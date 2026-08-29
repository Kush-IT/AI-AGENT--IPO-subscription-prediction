"""
Schema, Metadata, and Data Quality Test Suite for Phase 3.
"""
from pathlib import Path
import json
import pandas as pd
import numpy as np

DATA_DIR = Path(__file__).parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def test_processed_files_exist():
    """Verify that all required Phase 4.5 data artifacts exist and are non-empty."""
    required_files = [
        PROCESSED_DIR / "ipo_master.csv",
        PROCESSED_DIR / "ipo_features_preipo.csv",
        PROCESSED_DIR / "ipo_targets.csv",
        PROCESSED_DIR / "ipo_training.csv",
        METADATA_DIR / "data_dictionary.csv",
        METADATA_DIR / "source_registry.csv",
        METADATA_DIR / "data_quality_report.csv",
        METADATA_DIR / "leakage_audit.csv",
        METADATA_DIR / "missing_value_report.csv",
        METADATA_DIR / "imputation_audit.csv",
        METADATA_DIR / "dataset_version.json"
    ]
    for filepath in required_files:
        assert filepath.exists(), f"Missing required file: {filepath}"
        assert filepath.stat().st_size > 100, f"File {filepath} is empty or invalid"


def test_no_duplicate_records():
    """Verify that there are zero duplicate IPO IDs or duplicate company names."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_training.csv")
    assert df["ipo_id"].duplicated().sum() == 0, "Duplicate ipo_id detected"
    assert df["company_name"].duplicated().sum() == 0, "Duplicate company_name detected"


def test_subscription_target_consistency():
    """Verify all 4 subscription targets are positive and non-null."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_targets.csv")
    targets = ["qib_subscription", "nii_subscription", "retail_subscription", "total_subscription"]
    for target in targets:
        assert target in df.columns, f"Missing target column: {target}"
        assert (df[target] >= 0).all(), f"Found negative values in target {target}"
        assert df[target].isna().sum() == 0, f"Found nulls in target {target}"


def test_issue_structure_integrity():
    """Verify issue size, lot size, face value, and price bands are strictly valid."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_master.csv")
    assert (df["issue_size_in_crore"] > 0).all(), "Found invalid issue size <= 0"
    assert (df["lot_size"] > 0).all(), "Found invalid lot size <= 0"
    assert (df["face_value"] > 0).all(), "Found invalid face value <= 0"
    assert (df["price_high"] >= df["price_low"]).all(), "Upper price band is less than lower price band"
    assert (df["price_low"] > 0).all(), "Lower price band <= 0"


def test_category_quota_sum():
    """Verify that QIB, NII, and Retail quotas sum to 100% (+/- 1%)."""
    df = pd.read_csv(PROCESSED_DIR / "ipo_master.csv")
    quota_sum = df["qib_quota_pct"] + df["nii_quota_pct"] + df["retail_quota_pct"]
    assert np.allclose(quota_sum, 100.0, atol=1.0), "Quota percentages do not sum to 100%"


def test_dataset_version_json():
    """Verify dataset_version.json structure and non-zero counts."""
    v_file = METADATA_DIR / "dataset_version.json"
    with open(v_file, "r", encoding="utf-8") as f:
        meta = json.load(f)
    assert meta["version"] == "1.1.0"
    assert meta["number_of_ipos"] >= 100
    assert meta["number_of_features"] == 40
    assert meta["number_of_targets"] == 4

