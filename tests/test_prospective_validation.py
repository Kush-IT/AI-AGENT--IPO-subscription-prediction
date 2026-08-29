"""
Tests for Prospective Validation Security, Model Integrity, and Monitoring API Endpoints.
"""
from fastapi.testclient import TestClient
import pytest
from backend.main import app
from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    compute_feature_snapshot_hash,
    validate_outcome_timestamp,
    ModelIntegrityError,
)
from backend.monitoring.schemas import ProspectivePredictionRecord, ActualIPOOutcome

client = TestClient(app)


def test_model_hash_integrity_verification():
    """Verify that all 5 frozen candidate joblib files match official cryptographic hashes."""
    is_valid, hashes = verify_model_integrity()
    assert is_valid is True
    assert len(hashes) == 5
    assert "total_xgboost_log1p.joblib" in hashes


def test_feature_snapshot_hash_reproducibility():
    """Verify feature snapshot hash is strictly deterministic across identical dictionaries."""
    snap1 = {"gmp_percentage": 50.0, "issue_size_in_crore": 1200.0, "sector": "Technology"}
    snap2 = {"sector": "Technology", "issue_size_in_crore": 1200.0, "gmp_percentage": 50.0}
    
    h1 = compute_feature_snapshot_hash(snap1)
    h2 = compute_feature_snapshot_hash(snap2)
    assert h1 == h2, "Snapshot hashes must be order-invariant and deterministic."


def test_outcome_timestamp_precedence():
    """Verify outcome timestamp cannot precede prediction timestamp."""
    pred_ts = "2025-05-10T08:30:00+05:30"
    
    # Invalid outcome timestamp (preceding prediction)
    invalid_out_ts = "2025-05-10T08:15:00+05:30"
    valid, msg = validate_outcome_timestamp(pred_ts, invalid_out_ts)
    assert valid is False
    assert "cannot precede prediction" in msg

    # Valid outcome timestamp
    valid_out_ts = "2025-05-12T18:00:00+05:30"
    valid_ok, _ = validate_outcome_timestamp(pred_ts, valid_out_ts)
    assert valid_ok is True


def test_monitoring_api_lifecycle_and_summary():
    """Verify monitoring REST endpoints: POST prediction -> GET prediction -> POST outcome -> GET summary."""
    # 1. Summary endpoint
    res_sum = client.get("/api/v1/monitoring/summary")
    assert res_sum.status_code == 200
    d_sum = res_sum.json()
    assert "system_status" in d_sum
    assert d_sum["model_integrity_verified"] is True
    
    # 2. Log prospective prediction
    sample_payload = {
        "prediction_id": "test-api-pred-9999",
        "company_name": "Prospective API Corp",
        "ipo_open_date": "2025-06-01",
        "prediction_timestamp": "2025-06-01T08:00:00+05:30",
        "feature_cutoff": "2025-06-01T09:59:59+05:30",
        "predicted_total_subscription": 38.5,
        "predicted_qib_subscription": 45.0,
        "predicted_nii_subscription": 40.0,
        "predicted_retail_subscription": 22.0,
        "recommended_category": "QIB",
        "confidence_score": 90,
        "confidence_level": "HIGH",
        "risk_level": "LOW",
        "data_quality_score": 100,
        "data_quality_tier": "EXCELLENT",
        "temporal_validation_status": "EX_ANTE_COMPLIANT",
        "feature_snapshot_hash": "abcd1234ef5678",
        "model_registry_version": "1.0.0-final-candidates",
        "total_model_name": "XGBoost (log1p)",
        "qib_model_name": "Random Forest (RAW)",
        "nii_model_name": "LightGBM (log1p)",
        "retail_model_name": "XGBoost (RAW)",
        "prediction_status": "AWAITING_OUTCOME"
    }
    
    res_post = client.post("/api/v1/monitoring/predictions", json=sample_payload)
    assert res_post.status_code == 201
    
    # 3. Get single prediction
    res_get = client.get("/api/v1/monitoring/predictions/test-api-pred-9999")
    assert res_get.status_code == 200
    assert res_get.json()["company_name"] == "Prospective API Corp"
    
    # 4. Attach outcome
    outcome_payload = {
        "prediction_id": "test-api-pred-9999",
        "company_name": "Prospective API Corp",
        "ipo_close_date": "2025-06-03",
        "actual_qib_subscription": 48.0,
        "actual_nii_subscription": 38.0,
        "actual_retail_subscription": 20.0,
        "actual_total_subscription": 36.5,
        "outcome_source": "BSE",
        "outcome_observed_at": "2025-06-03T19:00:00+05:30"
    }
    res_out = client.post("/api/v1/monitoring/predictions/test-api-pred-9999/outcome", json=outcome_payload)
    assert res_out.status_code == 200
    d_out = res_out.json()
    assert d_out["total_absolute_error"] == 2.0
    assert d_out["category_prediction_correct"] is True
