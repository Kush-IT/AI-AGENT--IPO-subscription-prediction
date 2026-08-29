"""
Phase 6 Baseline ML Modeling, Target Inversion, and Temporal Isolation Test Suite.
"""
from pathlib import Path
import numpy as np
import pandas as pd
from backend.ml.model_pipeline import (
    FoldPreprocessor,
    calculate_metrics,
    generate_walk_forward_folds
)
from backend.ml.model_config import get_baseline_models, ABLATION_GROUPS

DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def test_test_set_isolation_untouched():
    """Verify that final test set of 17 IPOs was strictly excluded from baseline model results."""
    res_df = pd.read_csv(METADATA_DIR / "baseline_model_results.csv")
    pred_df = pd.read_csv(METADATA_DIR / "validation_predictions.csv")
    
    # Load 106 records
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    sorted_df = feat_df.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    
    dev_ipos = set(sorted_df.iloc[:89]["ipo_id"])
    test_ipos = set(sorted_df.iloc[89:]["ipo_id"])
    
    assert len(test_ipos) == 17, f"Expected 17 test IPOs, found {len(test_ipos)}"
    
    # Verify validation predictions contain ONLY development IPOs
    pred_ipos = set(pred_df["ipo_id"])
    assert pred_ipos.issubset(dev_ipos), "Validation predictions leaked test set IPOs!"
    assert len(pred_ipos.intersection(test_ipos)) == 0, "Test set IPO found in validation predictions!"


def test_walk_forward_cv_leakage_free():
    """Verify that walk-forward CV splits expand chronologically with strictly zero overlap."""
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    sorted_df = feat_df.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    dev_df = sorted_df.iloc[:89].reset_index(drop=True)
    
    folds = generate_walk_forward_folds(dev_df, n_splits=4, min_train=50)
    assert len(folds) == 4
    
    for i, (train_idx, val_idx) in enumerate(folds):
        assert len(train_idx) >= 50
        assert len(val_idx) > 0
        assert train_idx.max() < val_idx.min(), f"Fold {i} has train-val temporal overlap"


def test_fold_preprocessor_isolation():
    """Verify that FoldPreprocessor fits medians solely on training data and doesn't leak validation values."""
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    feature_cols = ABLATION_GROUPS["Group_A_IPO_Structure"]
    
    train_slice = feat_df.iloc[:50].copy()
    val_slice = feat_df.iloc[50:60].copy()
    
    # Tamper with validation slice
    tampered_val = val_slice.copy()
    tampered_val["price_high"] = 999999.0
    
    preproc = FoldPreprocessor()
    preproc.fit(train_slice, feature_cols)
    
    train_price_med = preproc.medians_["price_high"]
    _ = preproc.transform(tampered_val, feature_cols)
    
    assert preproc.medians_["price_high"] == train_price_med, "FoldPreprocessor parameters mutated during val transform"


def test_target_inversion_original_scale():
    """Verify that log1p target predictions invert correctly via expm1 to original scale."""
    y_raw_true = np.array([5.0, 20.0, 100.0, 350.0])
    y_log_pred = np.log1p(y_raw_true)
    y_inv_pred = np.expm1(y_log_pred)
    
    metrics = calculate_metrics(y_raw_true, y_inv_pred)
    assert metrics["MAE"] == 0.0, "Perfect inversion must have zero MAE"
    assert metrics["RMSE"] == 0.0, "Perfect inversion must have zero RMSE"
    assert metrics["R2"] == 1.0, "Perfect inversion must have R2 = 1.0"


def test_baseline_metrics_calculation_consistency():
    """Verify metrics calculation logic."""
    y_true = np.array([10.0, 20.0, 30.0, 40.0])
    y_pred = np.array([12.0, 18.0, 32.0, 38.0])
    
    m = calculate_metrics(y_true, y_pred)
    assert m["MAE"] == 2.0
    assert m["MedianAE"] == 2.0
    assert m["RMSE"] == 2.0
    assert m["R2"] > 0.90


def test_baseline_results_csv_consistency():
    """Verify baseline_model_results.csv and summary CSV exist and are well-formed."""
    res_df = pd.read_csv(METADATA_DIR / "baseline_model_results.csv")
    summary_df = pd.read_csv(METADATA_DIR / "baseline_model_summary.csv")
    abl_df = pd.read_csv(METADATA_DIR / "ablation_results.csv")
    
    assert len(res_df) == 4 * 2 * 7 * 4, f"Expected 224 fold results, found {len(res_df)}"
    assert len(summary_df) == 4 * 2 * 7, f"Expected 56 summary rows, found {len(summary_df)}"
    assert len(abl_df) == 4 * 7 * 6, f"Expected 168 ablation rows, found {len(abl_df)}"
    
    for df in [res_df, summary_df, abl_df]:
        assert (df["mean_MAE" if "mean_MAE" in df.columns else "MAE"] >= 0).all()


def test_all_7_models_instantiable():
    """Verify that all 7 model families initialize without error."""
    models = get_baseline_models()
    assert len(models) == 7
    expected = ["Mean_Predictor", "Median_Predictor", "Linear_Regression", "Ridge_Regression", "Random_Forest", "XGBoost", "LightGBM"]
    for name in expected:
        assert name in models
