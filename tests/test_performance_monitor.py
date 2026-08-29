"""
Tests for Prospective Performance Monitor and Error Diagnostics.
"""
from fastapi.testclient import TestClient
import numpy as np
import pytest

from backend.main import app
from backend.monitoring.performance_monitor import (
    calculate_metric_values,
    compute_performance_report,
)

client = TestClient(app)


def test_calculate_metric_values_math():
    """Verify MAE, RMSE, MedianAE, and R2 calculations."""
    y_true = np.array([20.0, 40.0, 60.0, 80.0, 100.0])
    y_pred = np.array([22.0, 38.0, 65.0, 75.0, 95.0])
    
    metrics = calculate_metric_values(y_true, y_pred)
    assert metrics.sample_count == 5
    assert metrics.mae == pytest.approx(3.8, rel=1e-2)
    assert metrics.rmse == pytest.approx(4.07, rel=1e-2)
    assert metrics.median_ae == pytest.approx(5.0, rel=1e-2)
    assert metrics.r2_score is not None
    assert metrics.r2_score > 0.90


def test_compute_performance_report_structure():
    """Verify performance report structure and endpoint."""
    report = compute_performance_report()
    assert report.total_metrics is not None
    assert report.qib_metrics is not None
    assert report.nii_metrics is not None
    assert report.retail_metrics is not None
    
    # API test
    res = client.get("/api/v1/monitoring/performance")
    assert res.status_code == 200
    data = res.json()
    assert "sample_count" in data
    assert "total_metrics" in data
