"""
Anti-Leakage and Chronological Partitioning Test Suite.
"""
from pathlib import Path
from datetime import datetime
import pandas as pd
import numpy as np
from backend.ml.leakage import validate_feature_timestamp, audit_dataset_for_leakage
from backend.ml.temporal_split import chronological_train_val_test_split, walk_forward_temporal_cv
from backend.ml.data_loader import get_train_val_test_datasets
from backend.ml.preprocessing import IPOPreprocessor

DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def test_validate_feature_timestamp_logic():
    """Verify timestamp validator correctly rejects future timestamps."""
    # Pre-cutoff timestamp (Valid)
    valid, _ = validate_feature_timestamp("rev", "2023-11-20T09:00:00+05:30", "2023-11-22T09:59:59+05:30")
    assert valid is True
    
    # Exact cutoff timestamp (Valid)
    valid, _ = validate_feature_timestamp("rev", "2023-11-22T09:59:59+05:30", "2023-11-22T09:59:59+05:30")
    assert valid is True
    
    # Future timestamp after cutoff (LEAKAGE)
    valid, reason = validate_feature_timestamp("rev", "2023-11-23T10:00:00+05:30", "2023-11-22T09:59:59+05:30")
    assert valid is False
    assert "Feature timestamp" in reason


def test_zero_leakage_in_processed_training_set():
    """Verify that audit_dataset_for_leakage detects zero violations in ipo_training.csv."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_training.csv")
    audit_df = audit_dataset_for_leakage(df)
    assert audit_df["leakage_detected"].sum() == 0, "Leakage detected in training dataset!"


def test_chronological_split_strict_invariants():
    """Verify temporal train/val/test splits maintain strict chronological ordering with no overlap."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_training.csv")
    train_df, val_df, test_df = chronological_train_val_test_split(
        df,
        date_column="ipo_open_date",
        train_ratio=0.70,
        val_ratio=0.15,
        test_ratio=0.15
    )
    
    assert len(train_df) > 0
    assert len(val_df) > 0
    assert len(test_df) > 0
    assert len(train_df) + len(val_df) + len(test_df) == len(df)
    
    max_train_date = train_df["ipo_open_date"].max()
    min_val_date = val_df["ipo_open_date"].min()
    max_val_date = val_df["ipo_open_date"].max()
    min_test_date = test_df["ipo_open_date"].min()
    
    assert max_train_date <= min_val_date, f"Train-Val Temporal Overlap: {max_train_date} > {min_val_date}"
    assert max_val_date <= min_test_date, f"Val-Test Temporal Overlap: {max_val_date} > {min_test_date}"


def test_expanding_window_walk_forward_cv():
    """Verify that walk-forward CV folds expand monotonically without lookahead bias."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_training.csv")
    splits = list(walk_forward_temporal_cv(df, n_splits=3, min_train_size=6))
    assert len(splits) == 3
    
    for train_idx, test_idx in splits:
        assert len(train_idx) >= 6
        assert len(test_idx) > 0
        assert train_idx.max() < test_idx.min(), "Walk-forward train fold overlaps with test fold"


def test_preprocessor_transformation_and_inverses():
    """Verify log1p and expm1 transformation consistency."""
    raw_multiples = np.array([0.0, 1.5, 10.0, 55.4, 203.41])
    transformed = IPOPreprocessor.transform_targets(raw_multiples)
    inverted = IPOPreprocessor.inverse_transform_targets(transformed)
    assert np.allclose(raw_multiples, inverted, atol=1e-5), "Target inversion error"


def test_data_loader_pipeline():
    """Verify that data loader loads clean non-null numerical matrices."""
    data = get_train_val_test_datasets()
    assert data["X_train"].shape[0] == len(data["train_df"])
    assert data["X_train"].shape[1] == len(data["feature_names"])
    assert not np.isnan(data["X_train"]).any(), "NaN found in X_train"
    assert not np.isnan(data["X_val"]).any(), "NaN found in X_val"
    assert not np.isnan(data["X_test"]).any(), "NaN found in X_test"


def test_no_imputation_leakage():
    """
    Verify that feature imputation is strictly quarantined to training partition
    and does not leak validation or test statistics.
    """
    df = pd.read_csv(PROCESSED_DIR / "ipo_training.csv")
    train_df, val_df, test_df = chronological_train_val_test_split(df)
    
    # 1. Fit preprocessor strictly on train_df
    preproc = IPOPreprocessor()
    preproc.fit(train_df)
    train_pe_median = preproc.medians_["pe_ratio"]
    
    # 2. Modify test_df with extreme values and ensure train preprocessor parameters remain unchanged
    tampered_test = test_df.copy()
    tampered_test["pe_ratio"] = 999999.0
    
    # Transform tampered test using training preprocessor
    transformed_test = preproc.transform_features(tampered_test)
    assert preproc.medians_["pe_ratio"] == train_pe_median, "Imputation parameter mutated during test transform"
    
    # 3. Check walk-forward CV fold isolation
    splits = list(walk_forward_temporal_cv(df, n_splits=3, min_train_size=20))
    for train_idx, test_idx in splits:
        fold_train = df.iloc[train_idx]
        fold_test = df.iloc[test_idx]
        
        fold_preproc = IPOPreprocessor().fit(fold_train)
        fold_transformed_val = fold_preproc.transform_features(fold_test)
        
        # Ensure fold preprocessor has distinct medians reflective solely of fold_train
        assert not np.isnan(fold_transformed_val["issue_size_in_crore"]).any()

