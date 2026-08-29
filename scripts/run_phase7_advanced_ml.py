"""
Phase 7 Advanced ML Optimization, Model Selection, and Final Test Set Evaluation.
Executes controlled walk-forward tuning on development data (89 IPOs),
freezes model decisions, and evaluates exactly once on the quarantined test set (17 IPOs).
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import json
import joblib
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.inspection import permutation_importance

from backend.ml.hyperparameter_search import (
    evaluate_hyperparameter_grid,
    instantiate_model,
    SEARCH_GRIDS
)
from backend.ml.model_pipeline import (
    FoldPreprocessor,
    calculate_metrics,
    generate_walk_forward_folds
)
from backend.ml.model_config import ABLATION_GROUPS, RANDOM_STATE
from backend.ml.features import TARGET_COLUMNS

DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"
FINAL_MODELS_DIR = ROOT_DIR / "models" / "final_candidates"
FINAL_MODELS_DIR.mkdir(parents=True, exist_ok=True)


def run_phase7_optimization():
    print("================================================================")
    print("PHASE 7: ADVANCED ML OPTIMIZATION & MODEL SELECTION")
    print("================================================================")
    
    # 1. Load V2 Datasets
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    
    sorted_df = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    
    # Chronological partition: 89 Dev IPOs (74 train + 15 val), 17 Final Test IPOs
    dev_df = sorted_df.iloc[:89].copy().reset_index(drop=True)
    test_df = sorted_df.iloc[89:].copy().reset_index(drop=True)
    
    print(f"Development Set: {len(dev_df)} IPOs ({dev_df['ipo_open_date'].min()} to {dev_df['ipo_open_date'].max()})")
    print(f"Quarantined Final Test Set: {len(test_df)} IPOs ({test_df['ipo_open_date'].min()} to {test_df['ipo_open_date'].max()}) [FROZEN]")
    
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    folds = generate_walk_forward_folds(dev_df, n_splits=4, min_train=50)
    
    # 2. Hyperparameter Grid Evaluation across candidate transformations
    target_transforms = {
        "total_subscription": ["log1p", "raw"],
        "qib_subscription": ["raw", "log1p"],
        "nii_subscription": ["log1p", "raw"],
        "retail_subscription": ["raw", "log1p"]
    }
    
    all_tuning_dfs = []
    for target, transforms in target_transforms.items():
        for tf in transforms:
            print(f"Tuning {target} ({tf})...")
            df_tune = evaluate_hyperparameter_grid(dev_df, target, tf, feature_cols, folds)
            all_tuning_dfs.append(df_tune)
            
    tuning_results_df = pd.concat(all_tuning_dfs, ignore_index=True)
    tuning_results_df.to_csv(METADATA_DIR / "hyperparameter_tuning_results.csv", index=False)
    print(f"Saved {len(tuning_results_df)} tuning evaluations to data/metadata/hyperparameter_tuning_results.csv")
    
    # 3. Model Selection based on Selection Policy
    # Select candidate with lowest mean_MAE (and secondary criteria: std_MAE, MedianAE, RMSE)
    selected_models_info = {}
    selection_summary_rows = []
    
    for target in TARGET_COLUMNS:
        target_records = tuning_results_df[tuning_results_df["target"] == target].copy()
        # Sort by mean_MAE ascending, then std_MAE ascending
        target_records = target_records.sort_values(by=["mean_MAE", "std_MAE", "mean_RMSE"]).reset_index(drop=True)
        best_row = target_records.iloc[0]
        
        selected_models_info[target] = {
            "model_name": best_row["model"],
            "target_transform": best_row["target_transform"],
            "hyperparameters": json.loads(best_row["hyperparameters"]),
            "mean_MAE": best_row["mean_MAE"],
            "std_MAE": best_row["std_MAE"],
            "mean_RMSE": best_row["mean_RMSE"],
            "mean_MedianAE": best_row["mean_MedianAE"],
            "mean_R2": best_row["mean_R2"]
        }
        selection_summary_rows.append(best_row)
        
    final_selection_df = pd.DataFrame(selection_summary_rows)
    final_selection_df.to_csv(METADATA_DIR / "final_model_selection_summary.csv", index=False)
    print("\n--- FINAL MODEL SELECTION SUMMARY ---")
    print(final_selection_df[["target", "target_transform", "model", "mean_MAE", "std_MAE", "mean_RMSE", "mean_R2"]])
    
    # 4. Generate Final Validation Predictions for selected configurations
    val_preds_records = []
    for target, info in selected_models_info.items():
        m_name = info["model_name"]
        tf_mode = info["target_transform"]
        params = info["hyperparameters"]
        
        for fold_idx, (train_idx, val_idx) in enumerate(folds, 1):
            train_data = dev_df.iloc[train_idx]
            val_data = dev_df.iloc[val_idx]
            
            preproc = FoldPreprocessor(scale_features=False)
            preproc.fit(train_data, feature_cols)
            X_train = preproc.transform(train_data, feature_cols)
            X_val = preproc.transform(val_data, feature_cols)
            
            y_train_raw = train_data[target].values
            y_val_raw = val_data[target].values
            y_train = np.log1p(y_train_raw) if tf_mode == "log1p" else y_train_raw
            
            model = instantiate_model(m_name, params)
            model.fit(X_train, y_train)
            
            y_pred_raw = model.predict(X_val)
            y_pred = np.clip(np.expm1(y_pred_raw) if tf_mode == "log1p" else y_pred_raw, a_min=0.0, a_max=None)
            
            for i, row in val_data.reset_index().iterrows():
                actual = float(y_val_raw[i])
                pred = float(y_pred[i])
                res = actual - pred
                val_preds_records.append({
                    "ipo_id": row["ipo_id"],
                    "company_name": row["company_name"],
                    "ipo_open_date": row["ipo_open_date"],
                    "target": target,
                    "target_transform": tf_mode,
                    "model": m_name,
                    "fold": fold_idx,
                    "actual": round(actual, 2),
                    "predicted": round(pred, 2),
                    "residual": round(res, 2),
                    "absolute_error": round(abs(res), 2),
                    "squared_error": round(res ** 2, 2)
                })
                
    final_val_preds_df = pd.DataFrame(val_preds_records)
    final_val_preds_df.to_csv(METADATA_DIR / "final_validation_predictions.csv", index=False)
    
    # 5. Fit & Serialize Final Candidate Models on Full Development Data (89 IPOs)
    # Fit full development preprocessor
    dev_preprocessor = FoldPreprocessor(scale_features=False)
    dev_preprocessor.fit(dev_df, feature_cols)
    X_dev = dev_preprocessor.transform(dev_df, feature_cols)
    joblib.dump(dev_preprocessor, FINAL_MODELS_DIR / "dev_preprocessor.joblib")
    
    final_models = {}
    feature_importances_records = []
    
    for target, info in selected_models_info.items():
        m_name = info["model_name"]
        tf_mode = info["target_transform"]
        params = info["hyperparameters"]
        
        y_dev_raw = dev_df[target].values
        y_dev = np.log1p(y_dev_raw) if tf_mode == "log1p" else y_dev_raw
        
        model = instantiate_model(m_name, params)
        model.fit(X_dev, y_dev)
        
        # Save model
        target_slug = target.replace("_subscription", "")
        m_filename = f"{target_slug}_{m_name.lower()}_{tf_mode}.joblib"
        joblib.dump(model, FINAL_MODELS_DIR / m_filename)
        final_models[target] = model
        
        # Compute Feature Importance
        # 1. Built-in importance
        if hasattr(model, "feature_importances_"):
            builtin_imp = model.feature_importances_
        else:
            builtin_imp = np.zeros(len(feature_cols))
            
        # 2. Permutation importance on development data
        perm_res = permutation_importance(model, X_dev, y_dev, n_repeats=5, random_state=RANDOM_STATE)
        
        for f_idx, f_name in enumerate(feature_cols):
            feature_importances_records.append({
                "target": target,
                "model": m_name,
                "feature_name": f_name,
                "builtin_importance": round(float(builtin_imp[f_idx]), 6),
                "permutation_importance_mean": round(float(perm_res.importances_mean[f_idx]), 6),
                "permutation_importance_std": round(float(perm_res.importances_std[f_idx]), 6)
            })
            
    imp_df = pd.DataFrame(feature_importances_records).sort_values(by=["target", "permutation_importance_mean"], ascending=[True, False])
    imp_df.to_csv(METADATA_DIR / "model_feature_importance.csv", index=False)
    
    # 6. Save Model Metadata JSON
    metadata_json = {
        "model_registry_version": "1.0.0-final-candidates",
        "training_date": datetime.now().isoformat(),
        "development_dataset": {
            "total_observations": len(dev_df),
            "date_range": f"{dev_df['ipo_open_date'].min()} to {dev_df['ipo_open_date'].max()}",
            "features_used": len(feature_cols)
        },
        "quarantined_test_dataset": {
            "total_observations": len(test_df),
            "date_range": f"{test_df['ipo_open_date'].min()} to {test_df['ipo_open_date'].max()}"
        },
        "selected_candidates": selected_models_info
    }
    with open(FINAL_MODELS_DIR / "model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata_json, f, indent=2)
        
    print(f"Serialized candidate models and metadata in {FINAL_MODELS_DIR}")
    
    # 7. EXACTLY ONCE: Final Test Set Evaluation (17 IPOs)
    print("\n================================================================")
    print("EXECUTING FINAL 17-IPO TEST EVALUATION (EXACTLY ONCE)")
    print("================================================================")
    
    X_test = dev_preprocessor.transform(test_df, feature_cols)
    test_eval_records = []
    
    for target, info in selected_models_info.items():
        m_name = info["model_name"]
        tf_mode = info["target_transform"]
        model = final_models[target]
        
        y_test_raw = test_df[target].values
        y_test_pred_raw = model.predict(X_test)
        
        y_test_pred = np.clip(np.expm1(y_test_pred_raw) if tf_mode == "log1p" else y_test_pred_raw, a_min=0.0, a_max=None)
        
        # Test metrics
        m = calculate_metrics(y_test_raw, y_test_pred)
        errors = y_test_raw - y_test_pred
        
        mean_err = float(np.mean(errors))
        median_err = float(np.median(errors))
        underpred = int((errors > 0).sum()) # actual > pred -> underpredicted
        overpred = int((errors < 0).sum())  # actual < pred -> overpredicted
        
        val_mae = info["mean_MAE"]
        degradation_ratio = round(m["MAE"] / val_mae, 4) if val_mae > 0 else 1.0
        
        test_eval_records.append({
            "target": target,
            "selected_model": m_name,
            "target_transform": tf_mode,
            "val_walk_forward_MAE": val_mae,
            "test_MAE": m["MAE"],
            "test_RMSE": m["RMSE"],
            "test_MedianAE": m["MedianAE"],
            "test_R2": m["R2"],
            "degradation_ratio": degradation_ratio,
            "mean_error": round(mean_err, 4),
            "median_error": round(median_err, 4),
            "underpredictions_count": underpred,
            "overpredictions_count": overpred
        })
        
    test_results_df = pd.DataFrame(test_eval_records)
    test_results_df.to_csv(METADATA_DIR / "test_set_results.csv", index=False)
    
    print("\n--- FINAL TEST SET PERFORMANCE SUMMARY (17 IPOs) ---")
    print(test_results_df[["target", "selected_model", "target_transform", "val_walk_forward_MAE", "test_MAE", "test_MedianAE", "test_R2", "degradation_ratio"]])
    
    # 8. GMP Ablation Percentage Verification
    # Recalculate exactly from ablation_results.csv: Total subscription Group E vs Group F for XGBoost
    abl_csv = pd.read_csv(METADATA_DIR / "ablation_results.csv")
    xgb_abl = abl_csv[(abl_csv["target"] == "total_subscription") & (abl_csv["model"] == "XGBoost")].set_index("feature_group")
    e_mae = float(xgb_abl.loc["Group_E_Plus_Historical_Demand", "mean_MAE"])
    f_mae = float(xgb_abl.loc["Group_F_Plus_Sentiment_GMP", "mean_MAE"])
    exact_pct = round(((e_mae - f_mae) / e_mae) * 100.0, 3)
    
    print(f"\n--- GMP ABLATION VERIFICATION ---")
    print(f"Group E (Historical Demand) MAE = {e_mae}")
    print(f"Group F (Plus Sentiment/GMP) MAE = {f_mae}")
    print(f"Verified Error Reduction Percentage: ({e_mae} - {f_mae}) / {e_mae} * 100 = {exact_pct}%")
    
    return final_selection_df, test_results_df, imp_df


if __name__ == "__main__":
    run_phase7_optimization()
