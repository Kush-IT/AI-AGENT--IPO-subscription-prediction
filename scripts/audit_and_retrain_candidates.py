"""
Audit and Candidate Retraining Script.
Performs:
1. Complete ML audit on target distributions, skewness, and high-subscription tiers.
2. Production model residual audit (actual - predicted, pred/actual ratio).
3. Chronological walk-forward candidate training on 106 IPOs (74 train, 16 val, 16 test).
4. Transformation comparison: Raw vs Log1p (with and without Duan's smearing factor).
5. Evaluation of XGBoost, LightGBM, Random Forest per target.
6. Persistence of retrained candidates into models/retrained/ with candidate_manifest.json.
7. Verification that models/final_candidates/ remains 100% frozen and untouched.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import json
import hashlib
import joblib
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, median_absolute_error
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

from backend.ml.model_config import ABLATION_GROUPS, RANDOM_STATE
from backend.ml.model_pipeline import FoldPreprocessor
from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    OFFICIAL_MODEL_HASHES,
    FINAL_MODELS_DIR,
)

RETRAINED_DIR = ROOT_DIR / "models" / "retrained"
DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def compute_sha256(filepath: Path) -> str:
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)
    return sha.hexdigest()


def calculate_slice_metrics(y_true: np.ndarray, y_pred: np.ndarray, threshold_name: str, mask: np.ndarray) -> dict:
    if np.sum(mask) == 0:
        return {"count": 0, "mae": None, "rmse": None, "mean_residual": None, "mean_ratio": None}
    yt = y_true[mask]
    yp = y_pred[mask]
    res = yt - yp
    ratio = np.where(yt > 0, yp / yt, 1.0)
    return {
        "count": int(np.sum(mask)),
        "mae": float(np.round(mean_absolute_error(yt, yp), 3)),
        "rmse": float(np.round(np.sqrt(mean_squared_error(yt, yp)), 3)),
        "mean_residual": float(np.round(np.mean(res), 3)),
        "mean_ratio": float(np.round(np.mean(ratio), 3)),
    }


def load_dataset() -> pd.DataFrame:
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    merged = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    return merged


def run_ml_audit():
    print("\n=======================================================")
    print("STEP 1: TARGET DISTRIBUTION & UNDERPREDICTION AUDIT")
    print("=======================================================")
    
    # Verify initial integrity of frozen models
    verify_model_integrity()
    print("[PASS] Frozen production model SHA-256 hashes verified before audit.")
    
    df = load_dataset()
    n_total = len(df)
    
    targets = ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]
    audit_stats = {}
    
    for t in targets:
        s = df[t].dropna()
        q25, q75 = np.percentile(s, [25, 75])
        stats = {
            "count": int(len(s)),
            "mean": float(np.round(s.mean(), 2)),
            "std": float(np.round(s.std(), 2)),
            "median": float(np.round(s.median(), 2)),
            "iqr": float(np.round(q75 - q25, 2)),
            "min": float(np.round(s.min(), 2)),
            "max": float(np.round(s.max(), 2)),
            "skewness": float(np.round(s.skew(), 3)),
            "kurtosis": float(np.round(s.kurtosis(), 3)),
            "count_gt_10x": int(np.sum(s > 10)),
            "pct_gt_10x": float(np.round(np.mean(s > 10) * 100, 1)),
            "count_gt_25x": int(np.sum(s > 25)),
            "pct_gt_25x": float(np.round(np.mean(s > 25) * 100, 1)),
            "count_gt_50x": int(np.sum(s > 50)),
            "pct_gt_50x": float(np.round(np.mean(s > 50) * 100, 1)),
            "count_gt_100x": int(np.sum(s > 100)),
            "pct_gt_100x": float(np.round(np.mean(s > 100) * 100, 1)),
        }
        audit_stats[t] = stats
        print(f"\n--- Target: {t} ---")
        print(f"  Mean: {stats['mean']:.2f}x | Median: {stats['median']:.2f}x | Std: {stats['std']:.2f}x | Max: {stats['max']:.2f}x")
        print(f"  Skewness: {stats['skewness']:.3f} | Kurtosis: {stats['kurtosis']:.3f}")
        print(f"  >10x: {stats['count_gt_10x']} ({stats['pct_gt_10x']}%) | >25x: {stats['count_gt_25x']} ({stats['pct_gt_25x']}%)")
        print(f"  >50x: {stats['count_gt_50x']} ({stats['pct_gt_50x']}%) | >100x: {stats['count_gt_100x']} ({stats['pct_gt_100x']}%)")

    # Audit production model on full dataset
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    dev_preprocessor = joblib.load(FINAL_MODELS_DIR / "dev_preprocessor.joblib")
    total_model = joblib.load(FINAL_MODELS_DIR / "total_xgboost_log1p.joblib")
    
    X_all = dev_preprocessor.transform(df, feature_cols)
    pred_log = total_model.predict(X_all)
    pred_total = np.clip(np.expm1(pred_log), 0.0, None)
    actual_total = df["total_subscription"].values
    
    residuals = actual_total - pred_total
    ratios = np.where(actual_total > 0, pred_total / actual_total, 1.0)
    
    print("\n--- Production Model (total_xgboost_log1p) Residual Audit ---")
    print(f"  Overall MAE: {mean_absolute_error(actual_total, pred_total):.2f}x")
    print(f"  Mean Residual (actual - predicted): {np.mean(residuals):.2f}x (positive = underprediction)")
    print(f"  Underpredictions count: {np.sum(residuals > 0)} / {len(actual_total)} ({np.mean(residuals > 0)*100:.1f}%)")
    print(f"  Mean Pred/Actual Ratio: {np.mean(ratios):.3f}")
    
    low_mask = actual_total < 15
    med_mask = (actual_total >= 15) & (actual_total <= 50)
    high_mask = actual_total > 50
    vhigh_mask = actual_total > 100
    
    print(f"  Low Tier (<15x): count={np.sum(low_mask)}, Mean Ratio={np.mean(ratios[low_mask]):.2f}, Mean Residual={np.mean(residuals[low_mask]):.2f}x")
    print(f"  Med Tier (15-50x): count={np.sum(med_mask)}, Mean Ratio={np.mean(ratios[med_mask]):.2f}, Mean Residual={np.mean(residuals[med_mask]):.2f}x")
    print(f"  High Tier (>50x): count={np.sum(high_mask)}, Mean Ratio={np.mean(ratios[high_mask]):.2f}, Mean Residual={np.mean(residuals[high_mask]):.2f}x")
    print(f"  Extreme Tier (>100x): count={np.sum(vhigh_mask)}, Mean Ratio={np.mean(ratios[vhigh_mask]):.2f}, Mean Residual={np.mean(residuals[vhigh_mask]):.2f}x")

    return df, audit_stats


def run_candidate_retraining(df: pd.DataFrame):
    print("\n=======================================================")
    print("STEP 2: CHRONOLOGICAL WALK-FORWARD CANDIDATE RETRAINING")
    print("=======================================================")
    
    RETRAINED_DIR.mkdir(parents=True, exist_ok=True)
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    
    # Chronological partition: 74 Train, 16 Validation, 16 Test (total 106)
    n_train = 74
    n_val = 16
    train_df = df.iloc[:n_train].copy().reset_index(drop=True)
    val_df = df.iloc[n_train:n_train+n_val].copy().reset_index(drop=True)
    test_df = df.iloc[n_train+n_val:].copy().reset_index(drop=True)
    
    print(f"Train set: {len(train_df)} IPOs ({train_df['ipo_open_date'].min()} to {train_df['ipo_open_date'].max()})")
    print(f"Val set:   {len(val_df)} IPOs ({val_df['ipo_open_date'].min()} to {val_df['ipo_open_date'].max()})")
    print(f"Test set:  {len(test_df)} IPOs ({test_df['ipo_open_date'].min()} to {test_df['ipo_open_date'].max()}) [HELD OUT]")

    # Fit FoldPreprocessor strictly on Train slice
    preprocessor = FoldPreprocessor(scale_features=False)
    preprocessor.fit(train_df, feature_cols)
    joblib.dump(preprocessor, RETRAINED_DIR / "retrained_preprocessor.joblib")
    
    X_train = preprocessor.transform(train_df, feature_cols)
    X_val = preprocessor.transform(val_df, feature_cols)
    X_test = preprocessor.transform(test_df, feature_cols)
    
    candidate_definitions = {
        "XGBoost_Depth3": lambda: XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, reg_alpha=0.1, reg_lambda=1.0, min_child_weight=1, random_state=RANDOM_STATE, verbosity=0),
        "XGBoost_Depth4": lambda: XGBRegressor(n_estimators=120, max_depth=4, learning_rate=0.04, subsample=0.8, colsample_bytree=0.8, reg_alpha=0.2, reg_lambda=1.5, min_child_weight=1, random_state=RANDOM_STATE, verbosity=0),
        "XGBoost_Depth5": lambda: XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.03, subsample=0.75, colsample_bytree=0.75, reg_alpha=0.5, reg_lambda=2.0, min_child_weight=2, random_state=RANDOM_STATE, verbosity=0),
        "LightGBM_Leaves7": lambda: LGBMRegressor(n_estimators=80, num_leaves=7, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, min_child_samples=5, reg_alpha=0.1, reg_lambda=1.0, random_state=RANDOM_STATE, verbose=-1),
        "LightGBM_Leaves15": lambda: LGBMRegressor(n_estimators=100, num_leaves=15, max_depth=4, learning_rate=0.04, subsample=0.8, colsample_bytree=0.8, min_child_samples=6, reg_alpha=0.2, reg_lambda=1.5, random_state=RANDOM_STATE, verbose=-1),
        "RandomForest_Depth5": lambda: RandomForestRegressor(n_estimators=120, max_depth=5, min_samples_split=4, min_samples_leaf=2, max_features="sqrt", random_state=RANDOM_STATE, n_jobs=-1),
        "RandomForest_Depth7": lambda: RandomForestRegressor(n_estimators=150, max_depth=7, min_samples_split=4, min_samples_leaf=2, max_features=0.7, random_state=RANDOM_STATE, n_jobs=-1),
    }

    targets = ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]
    best_candidates = {}
    evaluation_records = []
    
    for target in targets:
        print(f"\n=======================================================")
        print(f"SEARCHING CANDIDATES FOR: {target}")
        print(f"=======================================================")
        y_train_raw = train_df[target].values
        y_val_raw = val_df[target].values
        y_test_raw = test_df[target].values
        
        best_val_score = float("inf")
        best_cand_info = None
        
        for cand_name, model_fn in candidate_definitions.items():
            for tf_mode in ["log1p_standard", "log1p_smearing", "raw"]:
                model = model_fn()
                if "log1p" in tf_mode:
                    y_tr = np.log1p(y_train_raw)
                else:
                    y_tr = y_train_raw
                    
                model.fit(X_train, y_tr)
                
                # Predict on Train to calculate smearing factor if log1p
                train_pred_raw = model.predict(X_train)
                smearing_factor = 1.0
                if tf_mode == "log1p_smearing":
                    residuals_log = y_tr - train_pred_raw
                    smearing_factor = float(np.mean(np.exp(residuals_log)))
                
                # Predict on Val
                val_pred_raw = model.predict(X_val)
                if tf_mode == "log1p_standard":
                    y_val_pred = np.clip(np.expm1(val_pred_raw), 0.0, None)
                elif tf_mode == "log1p_smearing":
                    y_val_pred = np.clip((np.exp(val_pred_raw) * smearing_factor) - 1.0, 0.0, None)
                else:
                    y_val_pred = np.clip(val_pred_raw, 0.0, None)
                    
                mae_val = mean_absolute_error(y_val_raw, y_val_pred)
                rmse_val = np.sqrt(mean_squared_error(y_val_raw, y_val_pred))
                r2_val = r2_score(y_val_raw, y_val_pred)
                medae_val = median_absolute_error(y_val_raw, y_val_pred)
                mean_res_val = np.mean(y_val_raw - y_val_pred)
                mean_ratio_val = np.mean(np.where(y_val_raw > 0, y_val_pred / y_val_raw, 1.0))
                
                high_mask_val = y_val_raw > 50
                high_val_metrics = calculate_slice_metrics(y_val_raw, y_val_pred, ">50x", high_mask_val)
                
                record = {
                    "target": target,
                    "model_name": cand_name,
                    "transform": tf_mode,
                    "smearing_factor": round(smearing_factor, 4),
                    "val_mae": round(mae_val, 3),
                    "val_rmse": round(rmse_val, 3),
                    "val_r2": round(r2_val, 3),
                    "val_medae": round(medae_val, 3),
                    "val_mean_residual": round(mean_res_val, 3),
                    "val_mean_ratio": round(mean_ratio_val, 3),
                    "val_high_tier_mae": high_val_metrics["mae"],
                    "val_high_tier_ratio": high_val_metrics["mean_ratio"],
                }
                evaluation_records.append(record)
                
                # Composite score: MAE + penalty if underprediction on high tier is severe
                composite_score = mae_val
                if high_val_metrics["mean_ratio"] is not None and high_val_metrics["mean_ratio"] < 0.35:
                    composite_score += 15.0
                    
                if composite_score < best_val_score:
                    best_val_score = composite_score
                    best_cand_info = {
                        "target": target,
                        "model_name": cand_name,
                        "transform": tf_mode,
                        "smearing_factor": smearing_factor,
                        "model": model,
                        "val_metrics": record,
                    }
                    
        print(f"--> BEST CANDIDATE FOR {target}: {best_cand_info['model_name']} ({best_cand_info['transform']})")
        print(f"    Val MAE: {best_cand_info['val_metrics']['val_mae']} | RMSE: {best_cand_info['val_metrics']['val_rmse']} | High-Tier Ratio: {best_cand_info['val_metrics']['val_high_tier_ratio']}")
        best_candidates[target] = best_cand_info

    # Now evaluate best candidates on Held-out Test Set (16 IPOs)
    print("\n=======================================================")
    print("STEP 3: EVALUATION ON HELD-OUT TEST SET (16 IPOs)")
    print("=======================================================")
    
    test_results = {}
    target_filenames = {
        "total_subscription": "total_candidate.joblib",
        "qib_subscription": "qib_candidate.joblib",
        "nii_subscription": "nii_candidate.joblib",
        "retail_subscription": "retail_candidate.joblib",
    }
    
    prod_models = {
        "total_subscription": (joblib.load(FINAL_MODELS_DIR / "total_xgboost_log1p.joblib"), "log1p"),
        "qib_subscription": (joblib.load(FINAL_MODELS_DIR / "qib_random_forest_raw.joblib"), "raw"),
        "nii_subscription": (joblib.load(FINAL_MODELS_DIR / "nii_lightgbm_log1p.joblib"), "log1p"),
        "retail_subscription": (joblib.load(FINAL_MODELS_DIR / "retail_xgboost_raw.joblib"), "raw"),
    }
    dev_prep = joblib.load(FINAL_MODELS_DIR / "dev_preprocessor.joblib")
    X_test_prod = dev_prep.transform(test_df, feature_cols)

    candidate_manifest = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "training_dataset": "data/processed/ipo_features_preipo_v2.csv + ipo_targets_v2.csv",
        "train_samples": len(train_df),
        "val_samples": len(val_df),
        "test_samples": len(test_df),
        "targets": {}
    }

    for target, cand in best_candidates.items():
        model = cand["model"]
        tf_mode = cand["transform"]
        smear = cand["smearing_factor"]
        y_test_raw = test_df[target].values
        
        # Save candidate model artifact
        cand_path = RETRAINED_DIR / target_filenames[target]
        joblib.dump(model, cand_path)
        cand_hash = compute_sha256(cand_path)
        
        # Test prediction for Candidate
        cand_test_raw = model.predict(X_test)
        if tf_mode == "log1p_standard":
            y_cand_test = np.clip(np.expm1(cand_test_raw), 0.0, None)
        elif tf_mode == "log1p_smearing":
            y_cand_test = np.clip((np.exp(cand_test_raw) * smear) - 1.0, 0.0, None)
        else:
            y_cand_test = np.clip(cand_test_raw, 0.0, None)
            
        cand_mae = mean_absolute_error(y_test_raw, y_cand_test)
        cand_rmse = np.sqrt(mean_squared_error(y_test_raw, y_cand_test))
        cand_r2 = r2_score(y_test_raw, y_cand_test)
        cand_medae = median_absolute_error(y_test_raw, y_cand_test)
        cand_mean_res = np.mean(y_test_raw - y_cand_test)
        cand_ratio = np.mean(np.where(y_test_raw > 0, y_cand_test / y_test_raw, 1.0))
        
        high_mask = y_test_raw > 50
        cand_high = calculate_slice_metrics(y_test_raw, y_cand_test, ">50x", high_mask)
        
        # Test prediction for Frozen Production Baseline
        prod_m, prod_tf = prod_models[target]
        p_raw = prod_m.predict(X_test_prod)
        y_prod_test = np.clip(np.expm1(p_raw) if prod_tf == "log1p" else p_raw, 0.0, None)
        
        prod_mae = mean_absolute_error(y_test_raw, y_prod_test)
        prod_rmse = np.sqrt(mean_squared_error(y_test_raw, y_prod_test))
        prod_r2 = r2_score(y_test_raw, y_prod_test)
        prod_medae = median_absolute_error(y_test_raw, y_prod_test)
        prod_mean_res = np.mean(y_test_raw - y_prod_test)
        prod_ratio = np.mean(np.where(y_test_raw > 0, y_prod_test / y_test_raw, 1.0))
        prod_high = calculate_slice_metrics(y_test_raw, y_prod_test, ">50x", high_mask)
        
        print(f"\n--- {target.upper()} HEAD-TO-HEAD ON TEST SET (16 IPOs) ---")
        print(f"  [Production Frozen Baseline] ({prod_tf}):")
        print(f"    MAE: {prod_mae:.2f}x | RMSE: {prod_rmse:.2f}x | R2: {prod_r2:.3f} | MedAE: {prod_medae:.2f}x")
        print(f"    Mean Residual: {prod_mean_res:.2f}x | Mean Ratio: {prod_ratio:.3f} | High-Tier (>50x) Ratio: {prod_high['mean_ratio']}")
        print(f"  [Retrained Candidate] ({cand['model_name']}, {tf_mode}):")
        print(f"    MAE: {cand_mae:.2f}x | RMSE: {cand_rmse:.2f}x | R2: {cand_r2:.3f} | MedAE: {cand_medae:.2f}x")
        print(f"    Mean Residual: {cand_mean_res:.2f}x | Mean Ratio: {cand_ratio:.3f} | High-Tier (>50x) Ratio: {cand_high['mean_ratio']}")
        
        candidate_manifest["targets"][target] = {
            "artifact_file": target_filenames[target],
            "sha256": cand_hash,
            "model_architecture": cand["model_name"],
            "transform_mode": tf_mode,
            "smearing_factor": smear,
            "hyperparameters": model.get_params(),
            "validation_metrics": cand["val_metrics"],
            "test_set_metrics": {
                "mae": round(cand_mae, 3),
                "rmse": round(cand_rmse, 3),
                "r2": round(cand_r2, 3),
                "medae": round(cand_medae, 3),
                "mean_residual": round(cand_mean_res, 3),
                "mean_ratio": round(cand_ratio, 3),
                "high_tier_slice": cand_high,
            },
            "production_baseline_comparison": {
                "prod_mae": round(prod_mae, 3),
                "prod_rmse": round(prod_rmse, 3),
                "prod_r2": round(prod_r2, 3),
                "prod_medae": round(prod_medae, 3),
                "prod_mean_residual": round(prod_mean_res, 3),
                "prod_mean_ratio": round(prod_ratio, 3),
                "prod_high_tier_slice": prod_high,
            }
        }
        
    preproc_hash = compute_sha256(RETRAINED_DIR / "retrained_preprocessor.joblib")
    candidate_manifest["preprocessor"] = {
        "artifact_file": "retrained_preprocessor.joblib",
        "sha256": preproc_hash,
    }
    
    with open(RETRAINED_DIR / "candidate_manifest.json", "w") as f:
        json.dump(candidate_manifest, f, indent=2, default=str)
        
    pd.DataFrame(evaluation_records).to_csv(METADATA_DIR / "candidate_retraining_evaluations.csv", index=False)
    print(f"\n[DONE] Candidate manifest saved to {RETRAINED_DIR / 'candidate_manifest.json'}")
    print(f"[DONE] Full evaluations saved to {METADATA_DIR / 'candidate_retraining_evaluations.csv'}")

    # Post-training integrity assertion:
    verify_model_integrity()
    print("[PASS] Post-retraining production model SHA-256 hashes 100% verified. Zero files modified in models/final_candidates/.")


if __name__ == "__main__":
    df, stats = run_ml_audit()
    run_candidate_retraining(df)
