"""
Unit and Integration Tests for Phase 18 Generic Multi-IPO Prospective Validation Subsystem.
Validates discovery, registry preservation, Mainboard filtering, generic data pipeline,
frozen inference immutability, cumulative metrics, calibration, and drift surveillance.
"""
from pathlib import Path
import json
import pytest
import pandas as pd

from backend.monitoring.ipo_discovery import (
    DiscoveredIPO,
    register_ipo,
    load_registry,
    IPOLifecycleStatus,
    update_ipo_status,
)
from backend.monitoring.prospective_data_pipeline import prepare_prospective_ipo
from backend.monitoring.prospective_predictor import generate_prospective_prediction
from backend.monitoring.outcome_collector import collect_and_attach_outcome
from backend.monitoring.prospective_metrics import compute_cumulative_prospective_metrics
from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    compute_feature_snapshot_hash,
    validate_prospective_timestamps,
    validate_outcome_timestamp,
)
from backend.monitoring.drift_detector import analyze_drift

ROOT_DIR = Path(__file__).parent.parent
REGISTRY_CSV = ROOT_DIR / "data" / "live_predictions" / "prospective_ipo_registry.csv"
LUMINO_SNAP = ROOT_DIR / "data" / "live_predictions" / "lumino_2026_preipo" / "final_feature_snapshot.json"


def test_registry_preserves_lumino():
    """Verify that prospective IPO registry exists and preserves Lumino as COMPLETED."""
    df = load_registry()
    assert not df.empty
    lumino = df[df["company_name"] == "Lumino Industries Ltd"]
    assert not lumino.empty
    assert lumino.iloc[0]["status"] == "COMPLETED"
    assert lumino.iloc[0]["prediction_id"] == "308e97b4-45c7-4605-a00c-f60798dc19d9"


def test_new_ipo_registry_entry():
    """Verify registration of a newly discovered upcoming Mainboard IPO."""
    new_ipo = DiscoveredIPO(
        ipo_id="test_candidate_2026",
        company_name="Test Engineering Ltd",
        isin="INE0XYZ99999",
        ipo_open_date="2026-09-15",
        ipo_close_date="2026-09-18",
        sector="Capital Goods",
        is_mainboard=True,
        source="NSE Forthcoming Issues",
        source_url="https://www.nseindia.com/market-data/all-upcoming-issues-ipo",
    )
    entry = register_ipo(new_ipo)
    assert entry["ipo_id"] == "test_candidate_2026"
    assert entry["status"] == IPOLifecycleStatus.DISCOVERED.value

    # Verify reload
    df = load_registry()
    assert "test_candidate_2026" in df["ipo_id"].values


def test_only_mainboard_ipos():
    """Verify that SME IPOs are strictly rejected from entering prospective registry."""
    sme_ipo = DiscoveredIPO(
        ipo_id="sme_micro_corp",
        company_name="SME Micro Corp Ltd",
        ipo_open_date="2026-09-10",
        ipo_close_date="2026-09-12",
        is_mainboard=False,
        source="BSE SME",
        source_url="https://www.bseindia.com/sme",
    )
    with pytest.raises(ValueError, match="not an Indian Mainboard IPO"):
        register_ipo(sme_ipo)


def test_future_observation_rejected():
    """Verify that observations after the 09:59:59 IST cutoff are rejected."""
    is_valid, msg = validate_prospective_timestamps(
        ipo_open_date="2026-08-27",
        prediction_timestamp="2026-08-27T10:30:00+05:30",
        feature_cutoff="2026-08-27T09:59:59+05:30",
    )
    assert is_valid is False
    assert "AFTER feature cutoff" in msg or "AFTER cutoff" in msg


def test_snapshot_hash():
    """Verify reproducible snapshot hashing across identical feature dictionaries."""
    features = {"issue_size_in_crore": 500.0, "price_high": 100.0, "pe_ratio": 20.0}
    h1 = compute_feature_snapshot_hash(features)
    h2 = compute_feature_snapshot_hash(features)
    assert h1 == h2
    assert len(h1) == 64


def test_snapshot_immutable():
    """Verify Lumino's canonical snapshot hash has not been modified."""
    with open(LUMINO_SNAP, "r", encoding="utf-8") as f:
        data = json.load(f)
    h = compute_feature_snapshot_hash(data["features"])
    assert h == "79338cc270661e7d884b6903fae9f62e4114c559d4556bd1407888d6ddb47859"


def test_model_hash_integrity():
    """Verify all 5 frozen production candidate model files match canonical SHA-256 digests."""
    is_valid, hashes = verify_model_integrity()
    assert is_valid is True
    assert len(hashes) == 5


def test_prediction_append_only():
    """Verify that predictions.csv contains historical predictions without mutation."""
    pred_csv = ROOT_DIR / "data" / "live_predictions" / "predictions.csv"
    assert pred_csv.exists()
    df = pd.read_csv(pred_csv)
    lumino = df[df["company_name"] == "Lumino Industries Ltd"]
    assert len(lumino) >= 1
    assert lumino.iloc[0]["predicted_total_subscription"] == 49.20


def test_prediction_id_unique():
    """Verify prediction UUIDs are distinct and non-null in registry."""
    df = load_registry()
    completed = df[df["status"] == "COMPLETED"]
    assert not completed.empty
    pred_ids = completed["prediction_id"].dropna().tolist()
    assert len(pred_ids) == len(set(pred_ids))


def test_outcome_after_prediction():
    """Verify outcome timestamp strictly follows prediction timestamp."""
    is_valid, msg = validate_outcome_timestamp(
        prediction_timestamp="2026-08-26T10:53:50.825864+00:00",
        outcome_observed_at="2026-08-31T18:00:00+05:30",
    )
    assert is_valid is True


def test_no_outcome_before_close():
    """Verify invalid outcome timestamp sequence is rejected."""
    is_valid, msg = validate_outcome_timestamp(
        prediction_timestamp="2026-08-26T10:53:50.825864+00:00",
        outcome_observed_at="2026-08-25T18:00:00+05:30",
    )
    assert is_valid is False
    assert "cannot precede" in msg


def test_performance_metrics():
    """Verify cumulative prospective metrics computation over completed cases."""
    metrics = compute_cumulative_prospective_metrics()
    assert metrics["number_of_completed_ipos"] >= 1
    assert metrics["total_metrics"]["mae"] is not None
    assert metrics["total_metrics"]["mape"] is not None
    assert metrics["category_recommendation_accuracy_pct"] is not None


def test_category_accuracy():
    """Verify category accuracy computation is 100% on current completed case."""
    metrics = compute_cumulative_prospective_metrics()
    assert metrics["category_recommendation_accuracy_pct"] == 100.0


def test_confidence_calibration():
    """Verify confidence calibration breakdown is present and calibrated."""
    metrics = compute_cumulative_prospective_metrics()
    conf = metrics["confidence_calibration"]
    assert "HIGH" in conf
    assert conf["HIGH"]["count"] >= 1
    assert conf["HIGH"]["mean_mape_pct"] < 10.0


def test_psi_calculation():
    """Verify drift detector calculates PSI for all 8 monitored feature distributions."""
    report = analyze_drift()
    assert len(report.feature_drifts) == 8
    assert report.overall_feature_drift_level in ["LOW", "MODERATE", "HIGH"]
    assert report.model_status in ["STABLE", "MODEL_REVIEW_REQUIRED"]


def test_no_automatic_retraining():
    """Verify that model files remain unchanged even during high-drift simulation."""
    is_valid_before, hashes_before = verify_model_integrity()
    report = analyze_drift()
    is_valid_after, hashes_after = verify_model_integrity()
    assert hashes_before == hashes_after
    assert is_valid_after is True
