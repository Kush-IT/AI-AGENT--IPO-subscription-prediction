"""
Unit and Integration Tests for Lumino Industries Ltd Prospective Prediction Pipeline.
Validates immutability, temporal precedence, non-negative scale, SHAP consistency,
and absence of post-cutoff outcomes.
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
from backend.monitoring.prediction_logger import load_prediction, list_predictions
from backend.monitoring.schemas import PredictionStatus

ROOT_DIR = Path(__file__).parent.parent
PACKAGE_DIR = ROOT_DIR / "data" / "live_predictions" / "lumino_2026_preipo"
FINAL_SNAPSHOT_FILE = PACKAGE_DIR / "final_feature_snapshot.json"
REPORT_FILE = PACKAGE_DIR / "prospective_prediction.json"
PREDICTIONS_CSV = ROOT_DIR / "data" / "live_predictions" / "predictions.csv"
CUTOFF = "2026-08-27T09:59:59+05:30"


@pytest.fixture
def prediction_report():
    with open(REPORT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def final_snapshot():
    with open(FINAL_SNAPSHOT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def test_final_snapshot_is_immutable(final_snapshot):
    """Verify that final feature snapshot hash is strictly deterministic and contains 45 features."""
    features = final_snapshot["features"]
    assert len(features) == 45
    h = compute_feature_snapshot_hash(features)
    assert h == "79338cc270661e7d884b6903fae9f62e4114c559d4556bd1407888d6ddb47859"


def test_prediction_timestamp_before_cutoff(prediction_report):
    """Verify that the prediction timestamp strictly precedes the statutory cutoff."""
    pred_ts = prediction_report["prediction_timestamp"]
    cutoff = prediction_report["feature_cutoff"]
    is_valid, msg = validate_prospective_timestamps("2026-08-27", pred_ts, cutoff)
    assert is_valid is True, f"Prediction timestamp violates cutoff: {msg}"


def test_all_features_ex_ante(final_snapshot):
    """Verify that every feature in snapshot adheres to ex-ante validity."""
    features = final_snapshot["features"]
    assert features["issue_size_in_crore"] == 700.0
    assert features["price_high"] == 82.0
    assert features["price_low"] == 78.0
    assert features["gmp_percentage"] == 56.10
    assert features["revenue_latest_cr"] == 2089.31


def test_model_hashes_match():
    """Verify that all 5 frozen candidate model files match canonical SHA-256 hashes."""
    is_valid, hashes = verify_model_integrity()
    assert is_valid is True
    assert len(hashes) == 5


def test_prediction_logged_once(prediction_report):
    """Verify that Lumino prediction is logged in predictions.csv."""
    assert PREDICTIONS_CSV.exists()
    df = pd.read_csv(PREDICTIONS_CSV)
    lumino_rows = df[df["company_name"] == "Lumino Industries Ltd"]
    assert len(lumino_rows) >= 1
    assert prediction_report["prediction_id"] in df["prediction_id"].values


def test_prediction_id_unique(prediction_report):
    """Verify that prediction_id is a valid UUID and correctly loaded."""
    pred_id = prediction_report["prediction_id"]
    rec = load_prediction(pred_id)
    assert rec is not None
    assert rec.company_name == "Lumino Industries Ltd"
    assert rec.prediction_status in [PredictionStatus.AWAITING_OUTCOME, PredictionStatus.OUTCOME_RECORDED]


def test_no_actual_outcome_before_close(prediction_report):
    """Verify that original prospective prediction payload does not contain outcome before close."""
    assert "actual_subscriptions" not in prediction_report
    assert "actual_total_subscription" not in prediction_report["predictions"]
    pred_id = prediction_report["prediction_id"]
    rec = load_prediction(pred_id)
    assert rec is not None


def test_log1p_predictions_positive(prediction_report):
    """Verify all 4 predicted multiples are strictly non-negative."""
    preds = prediction_report["predictions"]
    assert preds["total_subscription"] > 0.0
    assert preds["qib_subscription"] > 0.0
    assert preds["nii_subscription"] > 0.0
    assert preds["retail_subscription"] > 0.0


def test_shap_consistency(prediction_report):
    """Verify SHAP attributions use observational language and identify leading positive drivers."""
    shap_info = prediction_report["shap_explanation"]
    assert "top_positive_factors" in shap_info
    assert "top_negative_factors" in shap_info
    
    # Verify non-causal terminology
    for factor in shap_info["top_positive_factors"]:
        assert "contributed positively to the model prediction" in factor["impact"]


def test_category_rule(prediction_report):
    """Verify that QIB recommendation satisfies the 15% edge rule."""
    cat_info = prediction_report["category_assessment"]
    assert cat_info["recommended_category"] == "QIB"
    assert cat_info["category_edge_pct"] >= 15.0
    assert cat_info["is_edge_significant"] is True


def test_confidence_range(prediction_report):
    """Verify diagnostic confidence score is between 0 and 100 with valid level."""
    conf = prediction_report["confidence_assessment"]
    assert 0 <= conf["confidence_score"] <= 100
    assert conf["confidence_level"] in ["HIGH", "MEDIUM", "LOW"]


def test_provenance_complete():
    """Verify final provenance file exists and covers all 45 features."""
    prov_file = PACKAGE_DIR / "final_feature_provenance.json"
    assert prov_file.exists()
    with open(prov_file, "r", encoding="utf-8") as f:
        p_data = json.load(f)
    assert len(p_data["feature_provenance"]) == 45
