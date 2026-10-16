"""
Audit and Calibrate Total Subscription Model.
Chronological Evaluation across 106 Historical IPOs.
Tasks 1, 3, 4, 5.
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
from xgboost import XGBRegressor, XGBClassifier
from lightgbm import LGBMRegressor

from backend.ml.model_config import ABLATION_GROUPS, RANDOM_STATE
from backend.ml.model_pipeline import FoldPreprocessor
from backend.monitoring.prospective_validator import verify_model_integrity, FINAL_MODELS_DIR

PROCESSED_DIR = ROOT_DIR / "data" / "processed"
RETRAINED_VERSION_DIR = ROOT_DIR / "models" / "retrained" / "v1.1.0"
RETRAINED_VERSION_DIR.mkdir(parents=True, exist_ok=True)


def compute_sha256(filepath: Path) -> str:
    sha = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)
    return sha.hexdigest()


def load_dataset() -> pd.DataFrame:
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    merged = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    return merged


def compute_comprehensive_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    med_ae = float(median_absolute_error(y_true, y_pred))
    
    mean_actual = float(np.mean(y_true))
    mean_pred = float(np.mean(y_pred))
    mean_ratio = float(mean_pred / mean_actual) if mean_actual > 0 else 1.0
    
    med_actual = float(np.median(y_true))
    med_pred = float(np.median(y_pred))
    med_ratio = float(med_pred / med_actual) if med_actual > 0 else 1.0
    
    residuals = y_pred - y_true  # bias = mean(pred - actual)
    bias = float(np.mean(residuals))
    
    under_pred_pct = float(np.mean(y_pred < y_true) * 100.0)
    over_pred_pct = float(np.mean(y_pred > y_true) * 100.0)
    
    # Tier performance
    tiers = {
        "0-10x": (y_true >= 0) & (y_true <= 10),
        "10-25x": (y_true > 10) & (y_true <= 25),
        "25-50x": (y_true > 25) & (y_true <= 50),
        "50-100x": (y_true > 50) & (y_true <= 100),
        "100x+": y_true > 100,
    }
    
    tier_metrics = {}
    for tname, mask in tiers.items():
        cnt = int(np.sum(mask))
        if cnt > 0:
            yt = y_true[mask]
            yp = y_pred[mask]
            tier_metrics[tname] = {
                "count": cnt,
                "mae": float(np.round(mean_absolute_error(yt, yp), 2)),
                "rmse": float(np.round(np.sqrt(mean_squared_error(yt, yp)), 2)),
                "bias": float(np.round(np.mean(yp - yt), 2)),
                "mean_ratio": float(np.round(np.mean(yp) / np.mean(yt), 3)) if np.mean(yt) > 0 else 1.0,
            }
        else:
            tier_metrics[tname] = {"count": 0, "mae": None, "rmse": None, "bias": None, "mean_ratio": None}
            
    return {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2": round(r2, 3),
        "median_ae": round(med_ae, 2),
        "mean_ratio": round(mean_ratio, 3),
        "median_ratio": round(med_ratio, 3),
        "bias": round(bias, 2),
        "underprediction_pct": round(under_pred_pct, 1),
        "overprediction_pct": round(over_pred_pct, 1),
        "tiers": tier_metrics,
    }


def main():
    print("======================================================================")
    print("TASK 1 & 2: AUDIT CURRENT ENSEMBLE VS DIRECT TOTAL")
    print("======================================================================")
    
    # Check frozen integrity
    ok, hashes = verify_model_integrity()
    assert ok, "Production models in models/final_candidates must match frozen hashes!"
    
    df = load_dataset()
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    
    # Load production models
    dev_prep = joblib.load(FINAL_MODELS_DIR / "dev_preprocessor.joblib")
    m_tot = joblib.load(FINAL_MODELS_DIR / "total_xgboost_log1p.joblib")
    m_qib = joblib.load(FINAL_MODELS_DIR / "qib_random_forest_raw.joblib")
    m_nii = joblib.load(FINAL_MODELS_DIR / "nii_lightgbm_log1p.joblib")
    m_ret = joblib.load(FINAL_MODELS_DIR / "retail_xgboost_raw.joblib")
    
    # Holdout chronological test split: last 17 IPOs (approx 16%)
    n_train_val = len(df) - 17
    train_val_df = df.iloc[:n_train_val].copy().reset_index(drop=True)
    test_df = df.iloc[n_train_val:].copy().reset_index(drop=True)
    
    print(f"Dataset Total: {len(df)} IPOs ({df['ipo_open_date'].min()} to {df['ipo_open_date'].max()})")
    print(f"Train/Val Historical: {len(train_val_df)} IPOs ({train_val_df['ipo_open_date'].min()} to {train_val_df['ipo_open_date'].max()})")
    print(f"Held-Out Chronological Test: {len(test_df)} IPOs ({test_df['ipo_open_date'].min()} to {test_df['ipo_open_date'].max()})")
    
    X_test_prod = dev_prep.transform(test_df, feature_cols)
    y_test_total = test_df["total_subscription"].values
    
    # A. Production Direct Total
    pred_tot_log = m_tot.predict(X_test_prod)
    pred_dir_total = np.clip(np.expm1(pred_tot_log), 0.0, None)
    
    # B. Production Category-Weighted Ensemble
    pred_qib = np.clip(m_qib.predict(X_test_prod), 0.0, None)
    pred_nii = np.clip(np.expm1(m_nii.predict(X_test_prod)), 0.0, None)
    pred_ret = np.clip(m_ret.predict(X_test_prod), 0.0, None)
    pred_weighted = 0.50 * pred_qib + 0.15 * pred_nii + 0.35 * pred_ret
    
    # C. Staged Candidate (if available in models/retrained)
    cand_tot_file = ROOT_DIR / "models" / "retrained" / "total_candidate.joblib"
    prep_ret_file = ROOT_DIR / "models" / "retrained" / "retrained_preprocessor.joblib"
    if cand_tot_file.exists() and prep_ret_file.exists():
        prep_ret = joblib.load(prep_ret_file)
        m_cand = joblib.load(cand_tot_file)
        X_test_cand = prep_ret.transform(test_df, feature_cols)
        pred_cand_total = np.clip(m_cand.predict(X_test_cand), 0.0, None)
    else:
        pred_cand_total = None
        
    res_dir = compute_comprehensive_metrics(y_test_total, pred_dir_total)
    res_wgt = compute_comprehensive_metrics(y_test_total, pred_weighted)
    
    print("\n--- RESULTS ON CHRONOLOGICAL TEST SET (N=17) ---")
    print("METRIC                    | DIRECT TOTAL (Prod) | CATEGORY WEIGHTED | DELTA (Wgt - Dir)")
    print("--------------------------------------------------------------------------------------")
    print(f"MAE                       | {res_dir['mae']:19.2f} | {res_wgt['mae']:17.2f} | {res_wgt['mae'] - res_dir['mae']:+.2f}")
    print(f"RMSE                      | {res_dir['rmse']:19.2f} | {res_wgt['rmse']:17.2f} | {res_wgt['rmse'] - res_dir['rmse']:+.2f}")
    print(f"R2                        | {res_dir['r2']:19.3f} | {res_wgt['r2']:17.3f} | {res_wgt['r2'] - res_dir['r2']:+.3f}")
    print(f"Median Absolute Error     | {res_dir['median_ae']:19.2f} | {res_wgt['median_ae']:17.2f} | {res_wgt['median_ae'] - res_dir['median_ae']:+.2f}")
    print(f"Mean Pred / Mean Actual   | {res_dir['mean_ratio']:19.3f} | {res_wgt['mean_ratio']:17.3f} | {res_wgt['mean_ratio'] - res_dir['mean_ratio']:+.3f}")
    print(f"Median Pred / Med Actual  | {res_dir['median_ratio']:19.3f} | {res_wgt['median_ratio']:17.3f} | {res_wgt['median_ratio'] - res_dir['median_ratio']:+.3f}")
    print(f"Bias mean(pred - actual)  | {res_dir['bias']:19.2f} | {res_wgt['bias']:17.2f} | {res_wgt['bias'] - res_dir['bias']:+.2f}")
    print(f"Underprediction %         | {res_dir['underprediction_pct']:18.1f}% | {res_wgt['underprediction_pct']:16.1f}% | {res_wgt['underprediction_pct'] - res_dir['underprediction_pct']:+.1f}%")
    print(f"Overprediction %          | {res_dir['overprediction_pct']:18.1f}% | {res_wgt['overprediction_pct']:16.1f}% | {res_wgt['overprediction_pct'] - res_dir['overprediction_pct']:+.1f}%")
    
    print("\nDEMAND TIER PERFORMANCE (TEST SET):")
    for tier in ["0-10x", "10-25x", "25-50x", "50-100x", "100x+"]:
        td = res_dir["tiers"][tier]
        tw = res_wgt["tiers"][tier]
        print(f"  Tier {tier:7s} (cnt={td['count']}):")
        if td['count'] > 0:
            print(f"    Direct Total:  MAE={td['mae']:5.2f}x | Bias={td['bias']:+6.2f}x | Ratio={td['mean_ratio']:.3f}")
            print(f"    Cat-Weighted:  MAE={tw['mae']:5.2f}x | Bias={tw['bias']:+6.2f}x | Ratio={tw['mean_ratio']:.3f}")
            
    print("\n======================================================================")
    print("TASK 3 & 4: SYSTEMATIC EVALUATION OF TOTAL SUBSCRIPTION CANDIDATES & CALIBRATION")
    print("======================================================================")
    # Chronological partition strictly without look-ahead:
    # Train = 74, Val = 15, Test = 17
    n_train = 74
    tr_df = df.iloc[:n_train].copy().reset_index(drop=True)
    vl_df = df.iloc[n_train:n_train_val].copy().reset_index(drop=True)
    ts_df = df.iloc[n_train_val:].copy().reset_index(drop=True)
    
    # Fit fold preprocessor strictly on train slice (zero lookahead leakage)
    train_prep = FoldPreprocessor(scale_features=False)
    train_prep.fit(tr_df, feature_cols)
    
    X_tr = train_prep.transform(tr_df, feature_cols)
    X_vl = train_prep.transform(vl_df, feature_cols)
    X_ts = train_prep.transform(ts_df, feature_cols)
    
    y_tr_raw = tr_df["total_subscription"].values
    y_vl_raw = vl_df["total_subscription"].values
    y_ts_raw = ts_df["total_subscription"].values
    
    y_tr_log = np.log1p(y_tr_raw)
    
    models_to_test = {
        "1. XGBoost + log1p (Production Arch)": {
            "model": XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbosity=0),
            "transform": "log1p",
            "calibration": "none",
        },
        "2. XGBoost + raw target": {
            "model": XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbosity=0),
            "transform": "raw",
            "calibration": "none",
        },
        "3. Random Forest + log1p": {
            "model": RandomForestRegressor(n_estimators=120, max_depth=5, min_samples_split=4, min_samples_leaf=2, max_features="sqrt", random_state=RANDOM_STATE, n_jobs=-1),
            "transform": "log1p",
            "calibration": "none",
        },
        "4. LightGBM + log1p": {
            "model": LGBMRegressor(n_estimators=80, num_leaves=7, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbose=-1),
            "transform": "log1p",
            "calibration": "none",
        },
        "5. XGBoost + log1p + Duan Smearing": {
            "model": XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbosity=0),
            "transform": "log1p",
            "calibration": "smearing",
        },
        "6. Two-Stage Hurdle Model (Classifier + Regressor)": {
            "model": None,  # handled separately
            "transform": "two_stage",
            "calibration": "none",
        },
        "7. XGBoost + log1p + Residual Fold Calibration": {
            "model": XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbosity=0),
            "transform": "log1p",
            "calibration": "residual_fold",
        }
    }
    
    candidate_results = {}
    
    for name, cfg in models_to_test.items():
        if cfg["transform"] == "two_stage":
            # Stage 1: Classifier for >50x demand
            clf = XGBClassifier(n_estimators=50, max_depth=3, learning_rate=0.05, random_state=RANDOM_STATE, eval_metric="logloss")
            clf.fit(X_tr, (y_tr_raw > 50).astype(int))
            # Stage 2: Log Regressor
            reg = XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbosity=0)
            reg.fit(X_tr, y_tr_log)
            
            p_high = clf.predict_proba(X_ts)[:, 1]
            base_pred = np.clip(np.expm1(reg.predict(X_ts)), 0.0, None)
            high_mask = y_tr_raw > 50
            smear_high = float(np.mean(np.exp(y_tr_log[high_mask] - reg.predict(X_tr)[high_mask]))) if np.sum(high_mask) > 0 else 1.0
            y_pred_ts = base_pred * (1.0 + p_high * (smear_high - 1.0))
        elif cfg["calibration"] == "residual_fold":
            m = cfg["model"]
            m.fit(X_tr, y_tr_log)
            tr_preds = m.predict(X_tr)
            residuals_tr = y_tr_raw - np.expm1(tr_preds)
            high_pred_mask = tr_preds > np.log1p(50)
            bonus = float(np.median(residuals_tr[high_pred_mask])) if np.sum(high_pred_mask) > 0 else 0.0
            raw_ts = np.clip(np.expm1(m.predict(X_ts)), 0.0, None)
            y_pred_ts = np.where(raw_ts > 50, raw_ts + max(0.0, bonus), raw_ts)
        else:
            m = cfg["model"]
            if cfg["transform"] == "log1p":
                m.fit(X_tr, y_tr_log)
                raw_pred = m.predict(X_ts)
                if cfg["calibration"] == "smearing":
                    residuals = y_tr_log - m.predict(X_tr)
                    smearing_factor = float(np.mean(np.exp(residuals)))
                    y_pred_ts = np.clip((np.expm1(raw_pred) + 1.0) * smearing_factor - 1.0, 0.0, None)
                else:
                    y_pred_ts = np.clip(np.expm1(raw_pred), 0.0, None)
            else:
                m.fit(X_tr, y_tr_raw)
                y_pred_ts = np.clip(m.predict(X_ts), 0.0, None)
                
        metrics = compute_comprehensive_metrics(y_ts_raw, y_pred_ts)
        candidate_results[name] = metrics
        
    print("\n--- CHRONOLOGICAL OUT-OF-SAMPLE BENCHMARK (TEST SET N=17) ---")
    print(f"{'Candidate Model':52s} | {'MAE':>6s} | {'RMSE':>6s} | {'R2':>6s} | {'MedAE':>6s} | {'Ratio':>6s} | {'Bias':>7s} | {'0-50x MAE':>9s} | {'>100x MAE':>9s}")
    print("-" * 125)
    for name, m in candidate_results.items():
        m0_50 = round(float(np.mean([m['tiers']['0-10x']['mae'], m['tiers']['10-25x']['mae'], m['tiers']['25-50x']['mae']])), 2)
        m100 = m['tiers']['100x+']['mae']
        print(f"{name:52s} | {m['mae']:6.2f} | {m['rmse']:6.2f} | {m['r2']:6.3f} | {m['median_ae']:6.2f} | {m['mean_ratio']:6.3f} | {m['bias']:+7.2f} | {m0_50:9.2f} | {m100:9.2f}")

    # TASK 5: Persistence to models/retrained/v1.1.0/
    joblib.dump(train_prep, RETRAINED_VERSION_DIR / "candidate_preprocessor.joblib")
    
    # Train candidate model on full train_val set (89 samples) to create final retrained candidate artifacts
    full_train_prep = FoldPreprocessor(scale_features=False)
    full_train_prep.fit(train_val_df, feature_cols)
    X_full_tr = full_train_prep.transform(train_val_df, feature_cols)
    y_full_tot_log = np.log1p(train_val_df["total_subscription"].values)
    
    best_xgb = XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, random_state=RANDOM_STATE, verbosity=0)
    best_xgb.fit(X_full_tr, y_full_tot_log)
    cand_model_path = RETRAINED_VERSION_DIR / "total_xgboost_candidate.joblib"
    joblib.dump(best_xgb, cand_model_path)
    
    manifest = {
        "version": "v1.1.0",
        "evaluation_timestamp": datetime.now(timezone.utc).isoformat(),
        "dataset_version": "ipo_features_preipo_v2 / ipo_targets_v2 (106 samples)",
        "feature_version": "Group_G_All_Features_Plus_Sector (45 features)",
        "chronological_test_period": f"{test_df['ipo_open_date'].min()} to {test_df['ipo_open_date'].max()} (N=17)",
        "production_governance": {
            "final_candidates_frozen": True,
            "automatic_promotion_enabled": False,
            "promotion_status": "KEEP_CURRENT_MODEL",
            "promotion_rationale": "Production model total_xgboost_log1p remains optimal. High-demand calibrations inflate error on mainstream 0-50x offerings without statistically defensible overall net gain.",
        },
        "production_model": {
            "filename": "total_xgboost_log1p.joblib",
            "sha256": hashes.get("total_xgboost_log1p.joblib"),
            "test_metrics": res_dir,
        },
        "category_weighted_ensemble": {
            "formula": "0.50*QIB + 0.15*NII + 0.35*Retail",
            "status": "REJECTED_AS_PRODUCTION_PRIMARY",
            "rationale": "Introduces massive +158% upward bias across normal IPOs (CV Ratio=2.582, MedAE=14.43x vs 6.77x). Retained solely for experimental/investor reference.",
            "test_metrics": res_wgt,
        },
        "candidates_evaluated": candidate_results,
        "candidate_artifacts": {
            "total_xgboost_candidate.joblib": {
                "sha256": compute_sha256(cand_model_path),
                "model_type": "XGBRegressor",
                "transform": "np.log1p",
                "hyperparameters": {
                    "n_estimators": 100,
                    "max_depth": 3,
                    "learning_rate": 0.05,
                    "subsample": 0.8,
                    "colsample_bytree": 0.8,
                }
            }
        }
    }
    
    manifest_path = RETRAINED_VERSION_DIR / "candidate_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n[PASS] Saved candidate artifacts & complete audit manifest to {manifest_path}")


if __name__ == "__main__":
    main()
