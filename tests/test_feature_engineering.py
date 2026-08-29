"""
Phase 5 Feature Engineering, Target Transformation, and Temporal Invariant Test Suite.
"""
from pathlib import Path
import json
import numpy as np
import pandas as pd
from backend.ml.features import (
    FeatureEngineeringPipeline,
    build_features_and_targets_v2,
    NUMERIC_COLUMNS_V2,
    CATEGORICAL_COLUMNS,
    TARGET_COLUMNS
)

DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def test_v2_datasets_exist_and_match_shape():
    """Verify that V2 features and targets exist and share exact length and indexing."""
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    
    assert len(feat_df) == 106, f"Expected 106 rows, found {len(feat_df)}"
    assert len(targ_df) == 106, f"Expected 106 rows, found {len(targ_df)}"
    assert (feat_df["ipo_id"] == targ_df["ipo_id"]).all(), "Mismatch in ipo_id alignment between features and targets"


def test_target_transformations_and_inverses():
    """Verify that log1p and expm1 target transformations are mathematically invertible."""
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    
    for t in TARGET_COLUMNS:
        raw_vals = targ_df[t].values
        log_vals = targ_df[f"log_{t}"].values
        
        # Verify log1p identity
        computed_log = np.log1p(raw_vals)
        assert np.allclose(log_vals, computed_log, atol=1e-5), f"log1p transformation error for {t}"
        
        # Verify inversion identity
        inverted = np.expm1(log_vals)
        assert np.allclose(raw_vals, inverted, atol=1e-5), f"expm1 inversion error for {t}"


def test_historical_expanding_strict_past_only():
    """
    Verify that historical expanding averages strictly use prior IPOs (open_date < current_open_date)
    and never include the current IPO or any future IPOs.
    """
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    
    # Sort chronologically
    sorted_df = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    
    for i in range(len(sorted_df)):
        curr_open = sorted_df.iloc[i]["ipo_open_date"]
        curr_feat_gen = sorted_df.iloc[i]["previous_general_avg_subscription"]
        
        past_records = sorted_df.iloc[:i]
        strict_past = past_records[past_records["ipo_open_date"] < curr_open]
        
        if len(strict_past) == 0:
            assert curr_feat_gen == 15.0, f"Expected baseline prior at row {i}, found {curr_feat_gen}"
        else:
            expected_mean = strict_past["total_subscription"].mean()
            assert np.isclose(curr_feat_gen, expected_mean, atol=1e-3), (
                f"Lookahead leak at index {i}: feature={curr_feat_gen}, expected={expected_mean}"
            )


def test_categorical_feature_preservation_raw():
    """
    Verify that categorical variables (sector, market_trend) are preserved in their raw string format
    and are NOT globally one-hot or target encoded in the stored V2 feature dataset.
    """
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    assert "sector" in feat_df.columns
    assert "market_trend" in feat_df.columns
    assert pd.api.types.is_string_dtype(feat_df["sector"]) or feat_df["sector"].dtype == object, "Sector should be raw string, not encoded"
    assert pd.api.types.is_string_dtype(feat_df["market_trend"]) or feat_df["market_trend"].dtype == object, "Market trend should be raw string, not encoded"
    assert "Financial Services" in feat_df["sector"].values
    assert "BULLISH" in feat_df["market_trend"].values



def test_no_future_observations_in_features():
    """Verify that feature cutoff timestamp is strictly <= 09:59:59 IST on open date."""
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    for _, row in feat_df.iterrows():
        open_date = row["ipo_open_date"]
        cutoff = row["feature_cutoff_datetime"]
        assert cutoff.startswith(open_date), f"Cutoff datetime {cutoff} does not match open date {open_date}"
        assert "09:59:59" in cutoff, f"Cutoff datetime {cutoff} must be 09:59:59 IST"


def test_feature_registry_consistency():
    """Verify that every feature in feature_engineering_registry.csv is valid and well-defined."""
    reg_df = pd.read_csv(METADATA_DIR / "feature_engineering_registry.csv")
    assert len(reg_df) >= 10
    required_cols = ["feature_name", "source_features", "transformation", "feature_type", "temporal_rule", "leakage_risk", "description"]
    for col in required_cols:
        assert col in reg_df.columns, f"Missing required column {col} in feature registry"
    assert (reg_df["leakage_risk"] == "ZERO").all(), "Non-zero leakage risk detected in feature registry"


def test_feature_groups_json_schema():
    """Verify that feature_groups.json contains all 6 required ablation groups."""
    with open(METADATA_DIR / "feature_groups.json", "r") as f:
        groups = json.load(f)
    expected_groups = ["IPO_Structure", "Fundamentals", "Valuation", "Market", "Historical_Demand", "Sentiment"]
    for grp in expected_groups:
        assert grp in groups, f"Missing ablation group {grp} in feature_groups.json"
        assert len(groups[grp]) > 0, f"Group {grp} is empty"


def test_raw_missingness_reporting():
    """Verify that raw_missingness_report.csv exists and covers raw tables."""
    miss_df = pd.read_csv(METADATA_DIR / "raw_missingness_report.csv")
    assert len(miss_df) > 0
    assert "feature_name" in miss_df.columns
    assert "missing_count" in miss_df.columns
    assert "missing_percentage" in miss_df.columns
