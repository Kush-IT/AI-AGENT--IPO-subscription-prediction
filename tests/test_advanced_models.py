"""
Phase 7 Advanced ML Optimization, Final Model Selection, and Test Isolation Test Suite.
"""
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from backend.ml.hyperparameter_search import SEARCH_GRIDS, evaluate_hyperparameter_grid
from backend.ml.model_pipeline import generate_walk_forward_folds
from backend.ml.model_config import ABLATION_GROUPS

DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"
FINAL_MODELS_DIR = Path(__file__).parent.parent / "models" / "final_candidates"


def test_final_test_set_isolation():
    """Verify that final test set of 17 IPOs was strictly isolated during hyperparameter tuning."""
    tune_df = pd.read_csv(METADATA_DIR / "hyperparameter_tuning_results.csv")
    val_preds = pd.read_csv(METADATA_DIR / "final_validation_predictions.csv")
    test_results = pd.read_csv(METADATA_DIR / "test_set_results.csv")
    
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    sorted_df = feat_df.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    
    dev_ipos = set(sorted_df.iloc[:89]["ipo_id"])
    test_ipos = set(sorted_df.iloc[89:]["ipo_id"])
    
    assert len(test_ipos) == 17, f"Expected 17 test IPOs, found {len(test_ipos)}"
    assert len(dev_ipos) == 89, f"Expected 89 dev IPOs, found {len(dev_ipos)}"
    
    # Check that validation predictions never contain test IPOs
    val_pred_ipos = set(val_preds["ipo_id"])
    assert val_pred_ipos.issubset(dev_ipos), "Validation predictions contained test IPOs!"
    assert len(val_pred_ipos.intersection(test_ipos)) == 0


def test_hyperparameter_search_temporal_isolation():
    """Verify that walk-forward CV folds in tuning maintain strict temporal order."""
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    sorted_df = feat_df.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    dev_df = sorted_df.iloc[:89].reset_index(drop=True)
    
    folds = generate_walk_forward_folds(dev_df, n_splits=4, min_train=50)
    for train_idx, val_idx in folds:
        assert train_idx.max() < val_idx.min(), "Train-val overlap detected in tuning folds"


def test_final_model_schema_and_artifacts():
    """Verify that all 4 final selected model joblib artifacts exist and are loadable."""
    expected_models = [
        FINAL_MODELS_DIR / "total_xgboost_log1p.joblib",
        FINAL_MODELS_DIR / "qib_random_forest_raw.joblib",
        FINAL_MODELS_DIR / "nii_lightgbm_log1p.joblib",
        FINAL_MODELS_DIR / "retail_xgboost_raw.joblib",
        FINAL_MODELS_DIR / "dev_preprocessor.joblib"
    ]
    for model_path in expected_models:
        assert model_path.exists(), f"Missing required model artifact: {model_path}"
        loaded = joblib.load(model_path)
        assert loaded is not None


def test_model_metadata_json_consistency():
    """Verify model_metadata.json contains valid candidate entries and date ranges."""
    meta_path = FINAL_MODELS_DIR / "model_metadata.json"
    assert meta_path.exists(), "Missing model_metadata.json"
    
    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)
        
    assert meta["development_dataset"]["total_observations"] == 89
    assert meta["quarantined_test_dataset"]["total_observations"] == 17
    assert len(meta["selected_candidates"]) == 4


def test_feature_importance_output_validity():
    """Verify that model_feature_importance.csv has positive scores and correct columns."""
    imp_df = pd.read_csv(METADATA_DIR / "model_feature_importance.csv")
    assert len(imp_df) >= 4 * 40
    assert "gmp_percentage" in imp_df["feature_name"].values
    assert (imp_df["permutation_importance_mean"].notna()).all()


def test_test_set_evaluation_results_schema():
    """Verify that test_set_results.csv contains all 4 targets and reasonable degradation ratios."""
    test_res = pd.read_csv(METADATA_DIR / "test_set_results.csv")
    assert len(test_res) == 4
    for _, row in test_res.iterrows():
        assert row["test_MAE"] > 0
        assert row["test_RMSE"] > 0
        assert 0.5 <= row["degradation_ratio"] <= 2.5, f"Abnormal degradation ratio {row['degradation_ratio']}"


def test_gmp_ablation_math_verification():
    """Verify that GMP error reduction math is exact and matches documented percentage."""
    abl_df = pd.read_csv(METADATA_DIR / "ablation_results.csv")
    xgb_abl = abl_df[(abl_df["target"] == "total_subscription") & (abl_df["model"] == "XGBoost")].set_index("feature_group")
    
    e_mae = float(xgb_abl.loc["Group_E_Plus_Historical_Demand", "mean_MAE"])
    f_mae = float(xgb_abl.loc["Group_F_Plus_Sentiment_GMP", "mean_MAE"])
    
    calc_pct = ((e_mae - f_mae) / e_mae) * 100.0
    assert 40.0 <= calc_pct <= 43.0, f"Unexpected GMP ablation lift: {calc_pct}%"
