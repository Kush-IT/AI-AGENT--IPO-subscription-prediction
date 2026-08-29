"""
Tests for Population Stability Index (PSI) Drift Detection & Thresholds.
"""
from fastapi.testclient import TestClient
import numpy as np
import pytest

from backend.main import app
from backend.monitoring.drift_detector import (
    calculate_psi,
    classify_drift_level,
    analyze_drift,
)

client = TestClient(app)


def test_psi_identical_distributions():
    """Verify PSI on identical distributions is near zero (< 0.10)."""
    np.random.seed(42)
    b = np.random.normal(50, 10, 500)
    c = np.random.normal(50, 10, 500)
    
    psi = calculate_psi(b, c)
    assert psi < 0.10
    assert classify_drift_level(psi) == "LOW"


def test_psi_shifted_distributions():
    """Verify PSI on significantly shifted distributions detects MODERATE or HIGH drift."""
    np.random.seed(42)
    b = np.random.normal(20, 5, 500)
    c = np.random.normal(80, 5, 500) # Large shift
    
    psi = calculate_psi(b, c)
    assert psi > 0.25
    assert classify_drift_level(psi) == "HIGH"


def test_drift_analysis_endpoint():
    """Verify GET /api/v1/monitoring/drift returns valid report structure."""
    res = client.get("/api/v1/monitoring/drift")
    assert res.status_code == 200
    data = res.json()
    assert "overall_feature_drift_level" in data
    assert "model_status" in data
    assert data["model_status"] in ["STABLE", "MODEL_REVIEW_REQUIRED"]
