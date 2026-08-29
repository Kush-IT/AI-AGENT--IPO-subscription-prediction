"""
Prospective Temporal Validator & Cryptographic Model Integrity Guardian.
Ensures strict ex-ante timestamps and verifies frozen model hashes prior to prediction logging.
"""
from pathlib import Path
import hashlib
import json
from datetime import datetime
from typing import Dict, Any, Tuple, Optional

ROOT_DIR = Path(__file__).parent.parent.parent
FINAL_MODELS_DIR = ROOT_DIR / "models" / "final_candidates"

# Canonical frozen model hashes (from docs/deployment/model_artifacts.md)
OFFICIAL_MODEL_HASHES = {
    "dev_preprocessor.joblib": "04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57",
    "total_xgboost_log1p.joblib": "3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6",
    "qib_random_forest_raw.joblib": "29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5",
    "nii_lightgbm_log1p.joblib": "618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29",
    "retail_xgboost_raw.joblib": "835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab",
}


class ModelIntegrityError(Exception):
    """Raised when frozen model candidate files have been modified or corrupted."""
    pass


class TemporalValidationError(Exception):
    """Raised when prospective observations violate the pre-IPO temporal barrier."""
    pass


def get_current_model_hashes() -> Dict[str, str]:
    """Compute SHA-256 hashes of all candidate model files."""
    hashes = {}
    for filename in sorted(OFFICIAL_MODEL_HASHES.keys()):
        file_path = FINAL_MODELS_DIR / filename
        if not file_path.exists():
            raise ModelIntegrityError(f"Missing required frozen model file: {filename}")
        with open(file_path, "rb") as f:
            hashes[filename] = hashlib.sha256(f.read()).hexdigest()
    return hashes


def verify_model_integrity() -> Tuple[bool, Dict[str, str]]:
    """
    Verify that all model candidate joblib files match canonical SHA-256 hashes.
    Returns (is_valid, current_hashes). Raises ModelIntegrityError if mismatched.
    """
    current_hashes = get_current_model_hashes()
    for filename, expected_hash in OFFICIAL_MODEL_HASHES.items():
        actual_hash = current_hashes.get(filename)
        if actual_hash != expected_hash:
            raise ModelIntegrityError(
                f"SECURITY / INTEGRITY VIOLATION: Model file '{filename}' hash mismatch! "
                f"Expected {expected_hash}, got {actual_hash}."
            )
    return True, current_hashes


def compute_feature_snapshot_hash(snapshot: Dict[str, Any]) -> str:
    """Compute reproducible SHA-256 hash of 45-feature snapshot payload."""
    serialized = json.dumps(snapshot, sort_keys=True, default=str)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def validate_prospective_timestamps(
    ipo_open_date: str,
    prediction_timestamp: str,
    feature_cutoff: Optional[str] = None
) -> Tuple[bool, str]:
    """
    Verify that prediction was initiated strictly prior to the statutory cut-off.
    Cutoff is: <ipo_open_date>T09:59:59+05:30.
    """
    cutoff_str = feature_cutoff or f"{ipo_open_date}T09:59:59+05:30"
    
    # Parse timestamps
    try:
        # Standardize ISO parse
        pred_dt = datetime.fromisoformat(prediction_timestamp.replace("Z", "+00:00"))
        cutoff_dt = datetime.fromisoformat(cutoff_str.replace("Z", "+00:00"))
        
        # If prediction timezone offset differs, python datetime handles comparison
        if pred_dt > cutoff_dt:
            return False, f"Prediction timestamp ({prediction_timestamp}) is AFTER feature cutoff ({cutoff_str})."
    except Exception as e:
        # Fallback string comparison for standard ISO strings on same date
        if prediction_timestamp > cutoff_str:
            return False, f"Prediction timestamp ({prediction_timestamp}) is AFTER cutoff ({cutoff_str}): {e}"
            
    return True, "EX_ANTE_COMPLIANT"


def validate_outcome_timestamp(
    prediction_timestamp: str,
    outcome_observed_at: str
) -> Tuple[bool, str]:
    """
    Ensure actual outcome was observed strictly AFTER the prediction timestamp.
    Prevents backfilling / retroactive look-ahead.
    """
    try:
        pred_dt = datetime.fromisoformat(prediction_timestamp.replace("Z", "+00:00"))
        out_dt = datetime.fromisoformat(outcome_observed_at.replace("Z", "+00:00"))
        if out_dt <= pred_dt:
            return False, f"Outcome timestamp ({outcome_observed_at}) cannot precede prediction ({prediction_timestamp})."
    except Exception:
        if outcome_observed_at <= prediction_timestamp:
            return False, f"Outcome timestamp ({outcome_observed_at}) cannot precede prediction ({prediction_timestamp})."
            
    return True, "VALID_OUTCOME_TIMESTAMP"
