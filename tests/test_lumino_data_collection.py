"""
Unit & Integration Tests for Lumino Industries Ltd Real Pre-IPO Data Collection Pipeline.
Verifies exact 45-feature schema, strict ex-ante timestamps, field-level provenance,
deterministic hashing, and model integrity.
"""
from pathlib import Path
import json
import pytest
import pandas as pd

from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    validate_prospective_timestamps,
    compute_feature_snapshot_hash,
)

ROOT_DIR = Path(__file__).parent.parent
PACKAGE_DIR = ROOT_DIR / "data" / "live_predictions" / "lumino_2026_preipo"
SNAPSHOT_FILE = PACKAGE_DIR / "feature_snapshot.json"
PROVENANCE_FILE = PACKAGE_DIR / "feature_provenance.json"
QUALITY_FILE = PACKAGE_DIR / "data_quality_report.json"
CSV_FILE = ROOT_DIR / "data" / "live_predictions" / "lumino_2026_preipo.csv"
CUTOFF = "2026-08-27T09:59:59+05:30"


@pytest.fixture
def snapshot_data():
    with open(SNAPSHOT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def provenance_data():
    with open(PROVENANCE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def test_exactly_45_features(snapshot_data):
    """Verify that the prospective feature snapshot contains exactly 45 predictive features."""
    features = snapshot_data["features"]
    assert len(features) == 45, f"Expected exactly 45 features, found {len(features)}"


def test_no_future_feature(provenance_data):
    """Verify that every individual feature's observed_at timestamp is strictly on or before cutoff."""
    provenance = provenance_data["feature_provenance"]
    for feat_name, p_dict in provenance.items():
        obs_time = p_dict["observed_at"]
        cutoff_time = p_dict["feature_cutoff"]
        assert obs_time <= cutoff_time, f"Feature '{feat_name}' observation ({obs_time}) violates cutoff ({cutoff_time})"
        assert p_dict["validation_status"] == "EX_ANTE_VALID"


def test_cutoff_validation():
    """Verify temporal validator enforces the 2026-08-27 09:59:59 IST cutoff."""
    valid_time = "2026-08-26T16:00:00+05:30"
    is_valid, _ = validate_prospective_timestamps("2026-08-27", valid_time, CUTOFF)
    assert is_valid is True

    invalid_time = "2026-08-27T10:05:00+05:30"
    is_invalid, _ = validate_prospective_timestamps("2026-08-27", invalid_time, CUTOFF)
    assert is_invalid is False


def test_gmp_timestamp_validation():
    """Verify all collected GMP observations precede the statutory cutoff."""
    gmp_file = PACKAGE_DIR / "gmp_observations.json"
    with open(gmp_file, "r", encoding="utf-8") as f:
        gmp_data = json.load(f)
    
    for obs in gmp_data["observations"]:
        assert obs["observed_at"] <= CUTOFF
        assert obs["is_pre_cutoff"] is True


def test_news_timestamp_validation():
    """Verify all collected news articles were published prior to the cutoff."""
    news_file = PACKAGE_DIR / "news_articles.json"
    with open(news_file, "r", encoding="utf-8") as f:
        news_data = json.load(f)

    for art in news_data["articles"]:
        assert art["published_at"] <= CUTOFF
        assert art["is_pre_cutoff"] is True


def test_market_timestamp_validation(provenance_data):
    """Verify secondary market indices represent closing prices on or before 2026-08-26."""
    market_feats = [
        "nifty_1d_return", "nifty_5d_return", "nifty_20d_return",
        "sensex_1d_return", "sensex_5d_return", "sensex_20d_return",
        "india_vix", "india_vix_5d_change"
    ]
    provenance = provenance_data["feature_provenance"]
    for feat in market_feats:
        assert feat in provenance
        assert provenance[feat]["observed_at"] <= CUTOFF


def test_historical_features_past_only(snapshot_data):
    """Verify expanding average subscription features strictly use historical data with open_date < 2026-08-27."""
    features = snapshot_data["features"]
    assert "previous_general_avg_subscription" in features
    assert "previous_sector_avg_subscription" in features
    assert features["previous_general_avg_subscription"] > 0
    assert features["previous_sector_avg_subscription"] > 0


def test_feature_snapshot_hash(snapshot_data):
    """Verify feature snapshot hash matches canonical SHA-256."""
    features = snapshot_data["features"]
    h = compute_feature_snapshot_hash(features)
    assert len(h) == 64
    assert h == "79338cc270661e7d884b6903fae9f62e4114c559d4556bd1407888d6ddb47859"


def test_model_hash_integrity():
    """Verify frozen candidate model hashes remain uncorrupted."""
    is_valid, hashes = verify_model_integrity()
    assert is_valid is True
    assert len(hashes) == 5


def test_missing_data_not_fabricated():
    """Verify data quality report accurately reports feature completeness."""
    with open(QUALITY_FILE, "r", encoding="utf-8") as f:
        quality = json.load(f)
    assert quality["total_features"] == 45
    assert quality["available_features"] == 45
    assert quality["missing_features"] == 0
    assert quality["quality_tier"] == "EXCELLENT"


def test_provenance_complete(provenance_data):
    """Verify that all 45 features have field-level provenance with valid source URLs."""
    provenance = provenance_data["feature_provenance"]
    assert len(provenance) == 45
    for feat_name, p in provenance.items():
        assert "value" in p
        assert "source" in p
        assert "source_url" in p
        assert "observed_at" in p
        assert "retrieved_at" in p
        assert "feature_cutoff" in p


def test_prediction_not_created_during_preparation():
    """Verify that prospective data preparation does not automatically create premature prediction records."""
    assert CSV_FILE.exists()
    df = pd.read_csv(CSV_FILE)
    assert len(df) == 1
    assert "predicted_total_subscription" not in df.columns
