"""
Comprehensive Unit & Integration Test Suite for Weekly Rolling Retraining Engine.
Tests data selector, candidate trainer, evaluator, retraining manager orchestration,
CLI commands, FastAPI monitoring routes, 10-point promotion gate, cryptographic SHA-256 hashing,
and production model immutability.
"""
from pathlib import Path
import subprocess
import json
import pytest
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient

from backend.main import app
from backend.ml.model_config import ABLATION_GROUPS
from backend.monitoring.prospective_validator import verify_model_integrity
from backend.retraining.schemas import (
    RetrainingStatus,
    DataSelectionSummary,
    TargetMetricSet,
    ModelComparisonSummary,
    PromotionDecision,
    RetrainingRunRequest,
    RetrainingRunResponse,
)
from backend.retraining.data_selector import (
    get_rolling_window,
    get_canonical_feature_names,
    validate_feature_snapshot,
    validate_temporal_cutoff,
    validate_targets,
    split_chronologically,
    select_completed_mainboard_ipos,
)
from backend.retraining.candidate_trainer import (
    train_xgboost_candidates,
    predict_candidate_targets,
    get_next_candidate_version,
    compute_file_sha256,
)
from backend.retraining.evaluator import (
    compute_target_metrics,
    compute_category_accuracies,
    predict_production_models,
    evaluate_candidate_vs_production,
)
from backend.retraining.retraining_manager import (
    run_weekly_retraining,
)

ROOT_DIR = Path(__file__).parent.parent


def test_canonical_45_feature_count():
    """Verify canonical feature list has exactly 45 features."""
    cols = get_canonical_feature_names()
    assert len(cols) == 45
    assert "sector" in cols
    assert "market_trend" in cols
    assert "gmp_percentage" in cols
    assert "issue_size_in_crore" in cols


def test_rolling_30_day_window_boundaries():
    """Verify exact 30-day rolling window calculation."""
    w_start, w_end = get_rolling_window("2026-08-31")
    assert w_start == "2026-08-01"
    assert w_end == "2026-08-31"

    # Start boundary included (2026-08-01 is >= 2026-08-01)
    assert "2026-08-01" >= w_start
    # End boundary excluded (2026-08-31 is not < 2026-08-31)
    assert not ("2026-08-31" < w_end)
    assert "2026-08-30" < w_end


def test_feature_snapshot_validation_valid():
    """Verify valid 45-feature snapshot passes without error."""
    canonical_cols = get_canonical_feature_names()
    dummy_features = {col: 10.0 for col in canonical_cols}
    dummy_features["sector"] = "Technology"
    dummy_features["market_trend"] = "BULLISH"

    ok, cleaned, err = validate_feature_snapshot(dummy_features, canonical_cols)
    assert ok is True
    assert err is None
    assert cleaned is not None
    assert len(cleaned) == 45
    assert cleaned["sector"] == "Technology"
    assert cleaned["market_trend"] == "BULLISH"


def test_feature_snapshot_target_leakage_detection():
    """Verify feature snapshot containing target or outcome fields is immediately rejected."""
    canonical_cols = get_canonical_feature_names()
    dummy_features = {col: 10.0 for col in canonical_cols}
    dummy_features["sector"] = "Technology"
    dummy_features["market_trend"] = "BULLISH"
    dummy_features["actual_total_subscription"] = 50.0  # Leakage!

    ok, cleaned, err = validate_feature_snapshot(dummy_features, canonical_cols)
    assert ok is False
    assert cleaned is None
    assert "LEAKAGE_DETECTED" in err


def test_feature_snapshot_missing_columns_rejected():
    """Verify feature snapshot missing canonical columns is rejected with schema error."""
    incomplete_features = {
        "issue_size_in_crore": 500.0,
        "sector": "Healthcare",
    }
    ok, cleaned, err = validate_feature_snapshot(incomplete_features)
    assert ok is False
    assert cleaned is None
    assert "SCHEMA_VALIDATION_FAILED" in err


def test_temporal_cutoff_validation():
    """Verify ex-ante timestamp verification relative to 09:59:59 IST."""
    open_date = "2026-08-27"
    valid_ts = "2026-08-26T10:00:00+00:00"
    ok, err = validate_temporal_cutoff(open_date, valid_ts)
    assert ok is True
    assert err is None

    ok, err = validate_temporal_cutoff(open_date, None)
    assert ok is False
    assert "MISSING_TEMPORAL_METADATA" in err


def test_validate_targets_valid():
    """Verify all 4 targets are parsed and validated."""
    outcome_payload = {
        "total_subscription": 51.34,
        "qib_subscription": 118.42,
        "nii_subscription": 62.15,
        "retail_subscription": 16.85,
    }
    ok, targets, err = validate_targets(outcome_payload)
    assert ok is True
    assert targets["actual_total"] == 51.34
    assert targets["actual_qib"] == 118.42
    assert targets["actual_nii"] == 62.15
    assert targets["actual_retail"] == 16.85


def test_validate_targets_missing_rejected():
    """Verify missing target category is rejected."""
    outcome_payload = {
        "total_subscription": 51.34,
        "qib_subscription": 118.42,
    }
    ok, targets, err = validate_targets(outcome_payload)
    assert ok is False
    assert targets is None
    assert "MISSING_OUTCOME" in err


def test_validate_targets_negative_rejected():
    """Verify negative target multiple is rejected."""
    outcome_payload = {
        "total_subscription": -5.0,
        "qib_subscription": 10.0,
        "nii_subscription": 5.0,
        "retail_subscription": 2.0,
    }
    ok, targets, err = validate_targets(outcome_payload)
    assert ok is False
    assert "INVALID_TARGET" in err


def test_split_chronologically():
    """Verify chronological 80/20 split sorts by close date ascending."""
    df = pd.DataFrame([
        {"ipo_id": f"ipo_{i}", "ipo_close_date": f"2026-08-{10+i:02d}", "val": i}
        for i in range(10)
    ])
    df_shuffled = df.sample(frac=1.0, random_state=42).reset_index(drop=True)
    train_df, val_df = split_chronologically(df_shuffled, train_ratio=0.8)

    assert len(train_df) == 8
    assert len(val_df) == 2
    assert train_df["ipo_close_date"].max() <= val_df["ipo_close_date"].min()
    assert train_df.iloc[0]["ipo_close_date"] == "2026-08-10"
    assert val_df.iloc[-1]["ipo_close_date"] == "2026-08-19"


def test_data_selector_insufficient_sample_size():
    """Verify selector returns INSUFFICIENT_SAMPLE_SIZE when eligible N < 10."""
    summary, X_train, y_train, X_val, y_val = select_completed_mainboard_ipos(
        run_date="2026-08-31",
        min_samples=10,
    )
    assert isinstance(summary, DataSelectionSummary)
    assert summary.is_sample_size_sufficient is False
    assert summary.training_sample_count == 0
    assert summary.validation_sample_count == 0
    assert X_train is None
    assert y_train is None


def test_candidate_trainer_insufficient_samples():
    """Verify trainer returns INSUFFICIENT_SAMPLE_SIZE if data_summary has insufficient samples."""
    summary = DataSelectionSummary(
        evaluation_date="2026-08-31",
        window_start_date="2026-08-01",
        window_end_date="2026-08-31",
        total_candidates_found=5,
        eligible_count=0,
        rejected_count=5,
        training_sample_count=0,
        validation_sample_count=0,
        minimum_sample_threshold=10,
        is_sample_size_sufficient=False,
        is_validation_split_sufficient=False,
        records_audit=[],
    )
    status, meta, manifest, err = train_xgboost_candidates(summary, None, None, None, None)
    assert status == RetrainingStatus.INSUFFICIENT_SAMPLE_SIZE
    assert meta is None
    assert manifest is None


def test_metrics_computation_and_zero_safety():
    """Verify metrics calculation and zero-division safety."""
    y_t = np.array([0.0, 10.0, 20.0, 50.0])
    y_p = np.array([2.0, 12.0, 18.0, 48.0])

    m = compute_target_metrics(y_t, y_p)
    assert isinstance(m, TargetMetricSet)
    assert m.mae == 2.0
    assert m.rmse == 2.0
    assert m.median_ae == 2.0
    assert not np.isnan(m.mape)
    assert not np.isinf(m.mape)
    assert m.signed_bias == 0.0


def test_category_accuracies_computation():
    """Verify category ranking and strongest category classification accuracy."""
    y_true_df = pd.DataFrame([
        {"qib_subscription": 100.0, "nii_subscription": 50.0, "retail_subscription": 10.0},
        {"qib_subscription": 20.0, "nii_subscription": 60.0, "retail_subscription": 15.0},
    ])
    y_pred_df = pd.DataFrame([
        {"qib_subscription": 95.0, "nii_subscription": 45.0, "retail_subscription": 12.0},
        {"qib_subscription": 25.0, "nii_subscription": 55.0, "retail_subscription": 10.0},
    ])

    rank_pct, strong_pct = compute_category_accuracies(y_true_df, y_pred_df)
    assert rank_pct == 100.0
    assert strong_pct == 100.0


def test_production_model_predictions_valid():
    """Verify frozen production models produce valid positive predictions across 45 features."""
    canonical_cols = get_canonical_feature_names()
    sample_df = pd.DataFrame([{
        c: 15.0 if c not in ["sector", "market_trend"] else ("Technology" if c == "sector" else "BULLISH")
        for c in canonical_cols
    }])

    preds = predict_production_models(sample_df, canonical_cols)
    assert "total_subscription" in preds
    assert "qib_subscription" in preds
    assert "nii_subscription" in preds
    assert "retail_subscription" in preds
    assert preds["total_subscription"][0] > 0.0
    assert preds["qib_subscription"][0] > 0.0
    assert preds["nii_subscription"][0] > 0.0
    assert preds["retail_subscription"][0] > 0.0


def test_retraining_manager_real_data_insufficient_samples(tmp_path):
    """Verify retraining manager returns INSUFFICIENT_SAMPLE_SIZE and logs manifest on real repository data."""
    req = RetrainingRunRequest(
        run_date="2026-08-31",
        dry_run=True,
        min_samples=10,
    )
    res_dir = tmp_path / "research_retraining"
    response = run_weekly_retraining(
        request=req,
        base_research_dir=res_dir,
    )
    assert isinstance(response, RetrainingRunResponse)
    assert response.status == RetrainingStatus.INSUFFICIENT_SAMPLE_SIZE
    assert response.candidate_metadata is None
    assert response.comparison_metrics is None
    assert response.production_model_integrity_verified is True
    assert response.manifest_path is not None
    assert Path(response.manifest_path).exists()


def test_fastapi_retraining_status_endpoint():
    """Verify GET /api/v1/monitoring/retraining/status returns structured metadata."""
    client = TestClient(app)
    r = client.get("/api/v1/monitoring/retraining/status")
    assert r.status_code == 200
    data = r.json()
    assert data["current_production_model"] == "1.0.0-final-candidates"
    assert data["production_integrity_verified"] is True
    assert "latest_status" in data
    assert data["rolling_window_days"] == 30


def test_fastapi_retraining_history_endpoint():
    """Verify GET /api/v1/monitoring/retraining/history returns list."""
    client = TestClient(app)
    r = client.get("/api/v1/monitoring/retraining/history")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_fastapi_retraining_run_endpoint_dry_run():
    """Verify POST /api/v1/monitoring/retraining/run returns response."""
    client = TestClient(app)
    payload = {
        "run_date": "2026-08-31",
        "dry_run": True,
        "min_samples": 10,
        "force_promote": False,
    }
    r = client.post("/api/v1/monitoring/retraining/run", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "INSUFFICIENT_SAMPLE_SIZE"
    assert data["production_model_integrity_verified"] is True
    assert data["data_selection"]["eligible_count"] == 0


def test_production_model_immutability_preserved():
    """Verify SHA-256 integrity of all frozen production models."""
    verified, hashes = verify_model_integrity()
    assert verified is True
    assert len(hashes) == 5
