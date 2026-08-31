"""
Unified XGBoost Candidate Trainer for Weekly Rolling Retraining.
Trains four target-specific XGBoost regressors on fold-isolated preprocessed features,
persists candidate artifacts in versioned models/retrained/ directories,
generates cryptographic SHA-256 hashes, performs reload verification,
and strictly enforces production model immutability.
"""
from typing import Dict, List, Tuple, Optional, Any
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import joblib
import numpy as np
import pandas as pd
from xgboost import XGBRegressor

from backend.ml.model_pipeline import FoldPreprocessor
from backend.ml.model_config import RANDOM_STATE
from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    ModelIntegrityError,
)
from backend.retraining.schemas import (
    RetrainingStatus,
    DataSelectionSummary,
    CandidateModelMetadata,
)
from backend.retraining.data_selector import get_canonical_feature_names

ROOT_DIR = Path(__file__).parent.parent.parent
RETRAINED_MODELS_DIR = ROOT_DIR / "models" / "retrained"

TARGET_TRANSFORMS = {
    "total_subscription": "log1p",
    "qib_subscription": "raw",
    "nii_subscription": "log1p",
    "retail_subscription": "raw",
}


def get_xgboost_candidate_configs() -> Dict[str, Dict[str, Any]]:
    """Returns deterministic, conservative XGBoost hyperparameter configurations per target."""
    return {
        "total_subscription": {
            "n_estimators": 60,
            "max_depth": 2,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.7,
            "reg_alpha": 0.1,
            "reg_lambda": 1.0,
            "min_child_weight": 2,
            "random_state": RANDOM_STATE,
            "verbosity": 0,
            "n_jobs": -1,
        },
        "qib_subscription": {
            "n_estimators": 80,
            "max_depth": 3,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "reg_alpha": 0.1,
            "reg_lambda": 1.0,
            "min_child_weight": 1,
            "random_state": RANDOM_STATE,
            "verbosity": 0,
            "n_jobs": -1,
        },
        "nii_subscription": {
            "n_estimators": 80,
            "max_depth": 3,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.7,
            "reg_alpha": 0.5,
            "reg_lambda": 1.5,
            "min_child_weight": 2,
            "random_state": RANDOM_STATE,
            "verbosity": 0,
            "n_jobs": -1,
        },
        "retail_subscription": {
            "n_estimators": 100,
            "max_depth": 3,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "reg_alpha": 0.1,
            "reg_lambda": 1.0,
            "min_child_weight": 1,
            "random_state": RANDOM_STATE,
            "verbosity": 0,
            "n_jobs": -1,
        },
    }


def compute_file_sha256(file_path: Path) -> str:
    """Computes SHA-256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()


def get_next_candidate_version(base_dir: Path, date_str: str) -> Tuple[str, Path]:
    """
    Generates a deterministic, collision-free candidate version directory.
    Example: 2026-08-31_xgboost_v1, 2026-08-31_xgboost_v2, etc.
    """
    base_dir.mkdir(parents=True, exist_ok=True)
    version_num = 1
    while True:
        ver_str = f"{date_str}_xgboost_v{version_num}"
        cand_dir = base_dir / ver_str
        if not cand_dir.exists():
            cand_dir.mkdir(parents=True, exist_ok=False)
            return ver_str, cand_dir
        version_num += 1


def train_xgboost_candidates(
    data_summary: DataSelectionSummary,
    X_train: Optional[pd.DataFrame],
    y_train: Optional[pd.DataFrame],
    X_val: Optional[pd.DataFrame],
    y_val: Optional[pd.DataFrame],
    base_retrained_dir: Optional[Path] = None,
) -> Tuple[
    RetrainingStatus,
    Optional[CandidateModelMetadata],
    Optional[Dict[str, Any]],
    Optional[str],
]:
    """
    Executes the training workflow for four target-specific XGBoost candidate models.
    Guarantees that production models remain immutable and all candidate artifacts are hashed and verified.
    """
    # 1. Sample Size Guard
    if not data_summary.is_sample_size_sufficient or X_train is None or y_train is None:
        return (
            RetrainingStatus.INSUFFICIENT_SAMPLE_SIZE,
            None,
            None,
            f"INSUFFICIENT_SAMPLE_SIZE: Eligible observations ({data_summary.eligible_count}) < minimum required ({data_summary.minimum_sample_threshold}).",
        )

    # 2. Validation Data Guard
    if not data_summary.is_validation_split_sufficient or X_val is None or y_val is None or len(X_val) < 1:
        return (
            RetrainingStatus.INSUFFICIENT_VALIDATION_DATA,
            None,
            None,
            "INSUFFICIENT_VALIDATION_DATA: Chronological validation set is empty or has < 1 observation.",
        )

    # 3. Production Model Immutability Pre-Check
    try:
        is_prod_ok, prod_hashes_before = verify_model_integrity()
        if not is_prod_ok:
            return (
                RetrainingStatus.MODEL_INTEGRITY_VIOLATION,
                None,
                None,
                "MODEL_INTEGRITY_VIOLATION: Production models compromised prior to retraining.",
            )
    except ModelIntegrityError as e:
        return RetrainingStatus.MODEL_INTEGRITY_VIOLATION, None, None, str(e)

    canonical_cols = get_canonical_feature_names()
    target_configs = get_xgboost_candidate_configs()
    retrained_dir = base_retrained_dir or RETRAINED_MODELS_DIR

    # 4. Setup Isolated Candidate Version Directory
    eval_date = data_summary.evaluation_date
    cand_version, cand_dir = get_next_candidate_version(retrained_dir, eval_date)

    try:
        # 5. Fit FoldPreprocessor strictly on X_train only (Prevent Leakage)
        preprocessor = FoldPreprocessor(scale_features=False)
        preprocessor.fit(X_train, canonical_cols)

        # Transform training matrix
        X_train_mat = preprocessor.transform(X_train, canonical_cols)

        # Transform validation matrix for verification
        X_val_mat = preprocessor.transform(X_val, canonical_cols)

        # 6. Save candidate preprocessor
        prep_path = cand_dir / "candidate_preprocessor.joblib"
        joblib.dump(preprocessor, prep_path)

        # 7. Train and persist four XGBoost candidate models
        saved_models: Dict[str, Any] = {}
        model_paths: Dict[str, Path] = {}

        artifact_filenames = {
            "total_subscription": "total_xgboost_log1p.joblib",
            "qib_subscription": "qib_xgboost_raw.joblib",
            "nii_subscription": "nii_xgboost_log1p.joblib",
            "retail_subscription": "retail_xgboost_raw.joblib",
        }

        for target_name, params in target_configs.items():
            transform_type = TARGET_TRANSFORMS[target_name]
            y_target = y_train[target_name].values

            # Apply log1p transform if required
            if transform_type == "log1p":
                y_fit = np.log1p(np.maximum(0.0, y_target))
            else:
                y_fit = y_target

            # Train XGBoost regressor
            model = XGBRegressor(**params)
            model.fit(X_train_mat, y_fit)

            # Persist model
            m_path = cand_dir / artifact_filenames[target_name]
            joblib.dump(model, m_path)

            saved_models[target_name] = model
            model_paths[target_name] = m_path

        # 8. Calculate SHA-256 hashes of all candidate artifacts
        artifact_hashes: Dict[str, str] = {
            "candidate_preprocessor.joblib": compute_file_sha256(prep_path),
        }
        for target_name, m_path in model_paths.items():
            filename = artifact_filenames[target_name]
            artifact_hashes[filename] = compute_file_sha256(m_path)

        # 9. Reload Verification (Mandatory Safety Check)
        reloaded_prep: FoldPreprocessor = joblib.load(prep_path)
        sample_x_val = X_val.iloc[:1]
        reloaded_x_mat = reloaded_prep.transform(sample_x_val, canonical_cols)

        for target_name, m_path in model_paths.items():
            reloaded_model = joblib.load(m_path)
            raw_pred = reloaded_model.predict(reloaded_x_mat)[0]
            if TARGET_TRANSFORMS[target_name] == "log1p":
                final_pred = float(np.expm1(raw_pred))
            else:
                final_pred = float(raw_pred)

            if np.isnan(final_pred) or np.isinf(final_pred) or final_pred < 0.0:
                # Prediction sanity failure
                return (
                    RetrainingStatus.TRAINING_FAILED,
                    None,
                    None,
                    f"TRAINING_FAILED: Reloaded candidate model '{target_name}' produced invalid prediction: {final_pred}",
                )

        # 10. Extract Training and Validation IPO IDs
        train_ipo_ids = [r.ipo_id for r in data_summary.records_audit if r.included and r.split == "TRAIN"]
        val_ipo_ids = [r.ipo_id for r in data_summary.records_audit if r.included and r.split == "VALIDATION"]

        # 11. Construct Candidate Model Metadata
        metadata = CandidateModelMetadata(
            model_version=cand_version,
            architecture="Unified XGBoost candidate architecture using four target-specific XGBoost regressors",
            training_date=eval_date,
            training_start_date=data_summary.window_start_date,
            training_end_date=data_summary.window_end_date,
            training_ipo_ids=train_ipo_ids,
            training_sample_count=len(train_ipo_ids),
            validation_ipo_ids=val_ipo_ids,
            validation_sample_count=len(val_ipo_ids),
            feature_count=45,
            target_definitions=["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"],
            target_transforms=TARGET_TRANSFORMS,
            xgboost_hyperparameters=target_configs,
            artifacts_directory=str(cand_dir),
            sha256_hashes=artifact_hashes,
        )

        # 12. Persist metadata.json, hashes.json, candidate_manifest.json
        with open(cand_dir / "metadata.json", "w", encoding="utf-8") as f:
            json.dump(metadata.model_dump(), f, indent=2)

        hashes_manifest = {
            "production_hashes_before": prod_hashes_before,
            "candidate_hashes": artifact_hashes,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
        with open(cand_dir / "hashes.json", "w", encoding="utf-8") as f:
            json.dump(hashes_manifest, f, indent=2)

        candidate_manifest = {
            "candidate_version": cand_version,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "training_sample_count": len(train_ipo_ids),
            "validation_sample_count": len(val_ipo_ids),
            "training_ipo_ids": train_ipo_ids,
            "validation_ipo_ids": val_ipo_ids,
            "feature_count": 45,
            "feature_names": canonical_cols,
            "target_definitions": TARGET_TRANSFORMS,
            "xgboost_parameters": target_configs,
            "artifact_hashes": artifact_hashes,
        }
        with open(cand_dir / "candidate_manifest.json", "w", encoding="utf-8") as f:
            json.dump(candidate_manifest, f, indent=2)

        # 13. Production Model Immutability Post-Check
        is_prod_ok_after, prod_hashes_after = verify_model_integrity()
        if not is_prod_ok_after or prod_hashes_before != prod_hashes_after:
            return (
                RetrainingStatus.MODEL_INTEGRITY_VIOLATION,
                None,
                None,
                "MODEL_INTEGRITY_VIOLATION: Production models altered during retraining process!",
            )

        hashes_manifest["production_hashes_after"] = prod_hashes_after
        with open(cand_dir / "hashes.json", "w", encoding="utf-8") as f:
            json.dump(hashes_manifest, f, indent=2)

        return (
            RetrainingStatus.CANDIDATE_VALIDATED,
            metadata,
            candidate_manifest,
            None,
        )

    except Exception as exc:
        return (
            RetrainingStatus.TRAINING_FAILED,
            None,
            None,
            f"TRAINING_FAILED: Candidate training encountered error: {str(exc)}",
        )


def predict_candidate_targets(
    candidate_artifacts_dir: Path,
    X_df: pd.DataFrame,
    feature_cols: Optional[List[str]] = None,
) -> Dict[str, np.ndarray]:
    """
    Executes inference for all 4 targets using a trained candidate artifact directory.
    Returns predicted subscription multiples on the natural scale.
    """
    if feature_cols is None:
        feature_cols = get_canonical_feature_names()

    prep_path = candidate_artifacts_dir / "candidate_preprocessor.joblib"
    preprocessor: FoldPreprocessor = joblib.load(prep_path)
    X_mat = preprocessor.transform(X_df, feature_cols)

    artifact_filenames = {
        "total_subscription": "total_xgboost_log1p.joblib",
        "qib_subscription": "qib_xgboost_raw.joblib",
        "nii_subscription": "nii_xgboost_log1p.joblib",
        "retail_subscription": "retail_xgboost_raw.joblib",
    }

    predictions: Dict[str, np.ndarray] = {}
    for target_name, filename in artifact_filenames.items():
        m_path = candidate_artifacts_dir / filename
        model = joblib.load(m_path)
        raw_preds = model.predict(X_mat)
        if TARGET_TRANSFORMS[target_name] == "log1p":
            pred_scale = np.expm1(raw_preds)
        else:
            pred_scale = raw_preds

        # Ensure valid non-negative subscription multiple
        predictions[target_name] = np.clip(pred_scale, a_min=0.0, a_max=None)

    return predictions
