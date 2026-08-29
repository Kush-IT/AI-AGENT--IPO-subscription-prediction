"""
Unit and Integration Tests for Lumino Industries Ltd Prospective Outcome Attachment & Evaluation.
Validates post-close temporal precedence, error calculations, category accuracy,
confidence calibration, and zero retrospective leakage.
"""
from pathlib import Path
import json
import pytest
import pandas as pd

from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    validate_outcome_timestamp,
    compute_feature_snapshot_hash,
)
from backend.monitoring.prediction_logger import load_prediction
from backend.monitoring.schemas import PredictionStatus

ROOT_DIR = Path(__file__).parent.parent
PACKAGE_DIR = ROOT_DIR / "data" / "live_predictions" / "lumino_2026_preipo"
EVAL_FILE = PACKAGE_DIR / "performance_evaluation.json"
OUTCOME_FILE = PACKAGE_DIR / "actual_outcome.json"
PROVENANCE_FILE = PACKAGE_DIR / "outcome_provenance.json"
SNAPSHOT_FILE = PACKAGE_DIR / "final_feature_snapshot.json"
COMPLETED_CSV = ROOT_DIR / "data" / "live_predictions" / "completed_predictions.csv"


@pytest.fixture
def eval_data():
    with open(EVAL_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def outcome_data():
    with open(OUTCOME_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def test_outcome_timestamp_after_prediction(outcome_data):
    """Verify outcome timestamp occurs strictly after original prediction timestamp."""
    pred_id = outcome_data["prediction_id"]
    pred_rec = load_prediction(pred_id)
    assert pred_rec is not None
    
    out_ts = outcome_data["outcome_observed_at"]
    is_valid, msg = validate_outcome_timestamp(pred_rec.prediction_timestamp, out_ts)
    assert is_valid is True, f"Outcome timestamp sequence error: {msg}"


def test_prediction_record_immutable(outcome_data):
    """Verify original prediction record remains unchanged after outcome attachment."""
    pred_id = outcome_data["prediction_id"]
    pred_rec = load_prediction(pred_id)
    assert pred_rec.predicted_total_subscription == 49.20
    assert pred_rec.predicted_qib_subscription == 113.51
    assert pred_rec.predicted_nii_subscription == 58.08
    assert pred_rec.predicted_retail_subscription == 17.19
    assert pred_rec.prediction_status == PredictionStatus.OUTCOME_RECORDED


def test_feature_snapshot_unchanged():
    """Verify that the 45-feature snapshot hash is identical to Phase 16B hash."""
    with open(SNAPSHOT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    h = compute_feature_snapshot_hash(data["features"])
    assert h == "79338cc270661e7d884b6903fae9f62e4114c559d4556bd1407888d6ddb47859"


def test_model_hashes_unchanged():
    """Verify that all 5 frozen candidate model hashes remain uncorrupted."""
    is_valid, hashes = verify_model_integrity()
    assert is_valid is True
    assert len(hashes) == 5


def test_actual_outcomes_non_fabricated(outcome_data):
    """Verify actual outcomes match official exchange report values."""
    actuals = outcome_data["actual_subscriptions"]
    assert actuals["total_subscription"] == 51.34
    assert actuals["qib_subscription"] == 118.42
    assert actuals["nii_subscription"] == 62.15
    assert actuals["retail_subscription"] == 16.85


def test_outcome_provenance_complete():
    """Verify outcome provenance file contains valid sources and exchange URLs."""
    with open(PROVENANCE_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["temporal_precedence_verified"] is True
    prov = data["outcome_provenance"]
    for target in ["actual_total_subscription", "actual_qib_subscription", "actual_nii_subscription", "actual_retail_subscription"]:
        assert target in prov
        assert prov[target]["source"] == "NSE Cumulative Bid Report"


def test_error_calculation(eval_data):
    """Verify absolute and signed error calculations across all 4 targets."""
    targs = eval_data["targets"]
    assert targs["total_subscription"]["absolute_error"] == pytest.approx(2.14, rel=1e-2)
    assert targs["qib_subscription"]["absolute_error"] == pytest.approx(4.91, rel=1e-2)
    assert targs["nii_subscription"]["absolute_error"] == pytest.approx(4.07, rel=1e-2)
    assert targs["retail_subscription"]["absolute_error"] == pytest.approx(0.34, rel=1e-2)


def test_category_accuracy(eval_data):
    """Verify that category recommendation was correctly evaluated as QIB."""
    cat_eval = eval_data["category_recommendation_evaluation"]
    assert cat_eval["predicted_best_category"] == "QIB"
    assert cat_eval["actual_strongest_category"] == "QIB"
    assert cat_eval["category_prediction_correct"] is True
    assert cat_eval["actual_category_edge_pct"] > 80.0


def test_confidence_calibration(eval_data):
    """Verify confidence calibration classification is WELL_CALIBRATED."""
    conf_eval = eval_data["confidence_calibration"]
    assert conf_eval["original_confidence_score"] == 100
    assert conf_eval["calibration_status"] == "WELL_CALIBRATED"


def test_completed_prediction_persisted(outcome_data):
    """Verify completed prediction record is appended to completed_predictions.csv."""
    assert COMPLETED_CSV.exists()
    df = pd.read_csv(COMPLETED_CSV)
    match = df[df["prediction_id"] == outcome_data["prediction_id"]]
    assert not match.empty
    assert match.iloc[0]["actual_total"] == 51.34


def test_no_outcome_leakage():
    """Verify that actual outcome columns do not exist in pre-IPO feature snapshot."""
    with open(SNAPSHOT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    features = data["features"]
    assert "actual_total_subscription" not in features
    assert "actual_qib_subscription" not in features
    assert "total_subscription" not in features


def test_original_prediction_reproducible():
    """Verify that running model prediction on snapshot reproduces the exact 49.20x total prediction."""
    import joblib
    import numpy as np
    from backend.ml.model_config import ABLATION_GROUPS
    
    with open(SNAPSHOT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    prep = joblib.load(ROOT_DIR / "models" / "final_candidates" / "dev_preprocessor.joblib")
    model = joblib.load(ROOT_DIR / "models" / "final_candidates" / "total_xgboost_log1p.joblib")
    
    feat_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    X = prep.transform(pd.DataFrame([data["features"]]), feat_cols)
    pred_log = float(model.predict(X)[0])
    pred = float(np.expm1(pred_log))
    assert round(pred, 2) == 49.20
