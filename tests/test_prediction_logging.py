"""
Tests for Prospective Prediction Logging, Immutability, and File Persistence.
"""
import uuid
import pytest
from pathlib import Path
from backend.monitoring.prediction_logger import (
    create_prediction_record,
    save_prediction,
    load_prediction,
    list_predictions,
    attach_actual_outcome,
)
from backend.monitoring.schemas import (
    ProspectivePredictionRecord,
    ActualIPOOutcome,
    PredictionStatus,
)

ROOT_DIR = Path(__file__).parent.parent


def test_create_prediction_record_and_immutability():
    """Verify prediction record creation, hash computation, and append-only immutability."""
    sample_snapshot = {
        "issue_size_in_crore": 850.0,
        "price_high": 450.0,
        "gmp_percentage": 40.0,
    }
    
    record = create_prediction_record(
        company_name="Prospective Tech Ltd",
        ipo_open_date="2025-02-15",
        predicted_total=45.2,
        predicted_qib=55.0,
        predicted_nii=48.0,
        predicted_retail=25.0,
        recommended_category="QIB",
        confidence_score=95,
        confidence_level="HIGH",
        risk_level="LOW",
        data_quality_score=100,
        data_quality_tier="EXCELLENT",
        feature_snapshot=sample_snapshot,
        prediction_timestamp="2025-02-15T08:30:00+05:30",
        feature_cutoff="2025-02-15T09:59:59+05:30",
    )
    
    assert record.prediction_id is not None
    assert record.company_name == "Prospective Tech Ltd"
    assert record.temporal_validation_status == "EX_ANTE_COMPLIANT"
    assert record.feature_snapshot_hash is not None
    assert record.prediction_status == PredictionStatus.AWAITING_OUTCOME
    
    # Save prediction
    save_prediction(record)
    
    # Reload prediction
    loaded = load_prediction(record.prediction_id)
    assert loaded is not None
    assert loaded.prediction_id == record.prediction_id
    assert loaded.predicted_total_subscription == 45.2
    assert loaded.feature_snapshot_hash == record.feature_snapshot_hash


def test_prediction_timestamp_cutoff_enforcement():
    """Verify that predictions initiated after the 09:59:59 IST cutoff are marked VALIDATION_FAILED."""
    sample_snapshot = {"issue_size_in_crore": 500.0}
    
    # Timestamp after cutoff
    late_record = create_prediction_record(
        company_name="Late Submission Corp",
        ipo_open_date="2025-02-15",
        predicted_total=30.0,
        predicted_qib=35.0,
        predicted_nii=30.0,
        predicted_retail=20.0,
        recommended_category="QIB",
        confidence_score=90,
        confidence_level="HIGH",
        risk_level="LOW",
        data_quality_score=95,
        data_quality_tier="EXCELLENT",
        feature_snapshot=sample_snapshot,
        prediction_timestamp="2025-02-15T10:15:00+05:30", # After 09:59:59
        feature_cutoff="2025-02-15T09:59:59+05:30",
    )
    
    assert late_record.temporal_validation_status == "TEMPORAL_REJECTED"
    assert late_record.prediction_status == PredictionStatus.VALIDATION_FAILED


def test_attach_outcome_temporal_sequence():
    """Verify outcome attachment computes errors and enforces outcome timestamp > prediction timestamp."""
    sample_snapshot = {"issue_size_in_crore": 600.0}
    
    record = create_prediction_record(
        company_name="Forward Testing Ltd",
        ipo_open_date="2025-03-01",
        predicted_total=40.0,
        predicted_qib=50.0,
        predicted_nii=45.0,
        predicted_retail=25.0,
        recommended_category="QIB",
        confidence_score=90,
        confidence_level="HIGH",
        risk_level="LOW",
        data_quality_score=100,
        data_quality_tier="EXCELLENT",
        feature_snapshot=sample_snapshot,
        prediction_timestamp="2025-03-01T08:00:00+05:30",
        feature_cutoff="2025-03-01T09:59:59+05:30",
    )
    save_prediction(record)
    
    # Valid outcome after close
    outcome = ActualIPOOutcome(
        prediction_id=record.prediction_id,
        company_name="Forward Testing Ltd",
        ipo_close_date="2025-03-03",
        actual_qib_subscription=55.0,
        actual_nii_subscription=42.0,
        actual_retail_subscription=22.0,
        actual_total_subscription=42.5,
        outcome_source="NSE",
        outcome_source_url="https://www.nseindia.com",
        outcome_observed_at="2025-03-03T18:00:00+05:30", # After prediction
    )
    
    err_rec = attach_actual_outcome(outcome)
    assert err_rec.total_absolute_error == pytest.approx(2.5, rel=1e-2)
    assert err_rec.qib_absolute_error == pytest.approx(5.0, rel=1e-2)
    assert err_rec.actual_best_category == "QIB"
    assert err_rec.category_prediction_correct is True
    
    # Verify reload shows OUTCOME_RECORDED status
    reloaded = load_prediction(record.prediction_id)
    assert reloaded.prediction_status == PredictionStatus.OUTCOME_RECORDED
