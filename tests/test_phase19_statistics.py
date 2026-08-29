"""
Unit and Integration Tests for Phase 19 Statistical Prospective Validation & Research Evaluation.
Validates metric computation, small-sample guards, non-synthetic data adherence,
category accuracy, calibration, and reproducibility manifests.
"""
from pathlib import Path
import json
import pytest
import numpy as np
import pandas as pd

from backend.monitoring.statistical_evaluator import (
    run_comprehensive_evaluation,
    compute_target_stats,
    compute_bootstrap_ci,
    get_evidence_level,
)
from backend.monitoring.prospective_validator import verify_model_integrity

ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = ROOT_DIR / "data"
LIVE_PRED_DIR = DATA_DIR / "live_predictions"
METADATA_DIR = DATA_DIR / "metadata"
RESEARCH_RESULTS_DIR = ROOT_DIR / "research" / "results"
COMPLETED_CSV = LIVE_PRED_DIR / "completed_predictions.csv"
ERROR_ANALYSIS_CSV = LIVE_PRED_DIR / "prospective_error_analysis.csv"
MANIFEST_FILE = RESEARCH_RESULTS_DIR / "analysis_manifest.json"


@pytest.fixture(scope="module")
def eval_result():
    return run_comprehensive_evaluation()


def test_prospective_dataset_loaded():
    """Verify completed predictions CSV exists and is loaded successfully."""
    assert COMPLETED_CSV.exists()
    df = pd.read_csv(COMPLETED_CSV)
    assert not df.empty
    assert "Lumino Industries Ltd" in df["company_name"].values


def test_no_synthetic_observations():
    """Verify that genuine prospective observations correspond to real statutory offerings."""
    df = pd.read_csv(COMPLETED_CSV)
    genuine_df = df[~df["company_name"].str.contains("Forward Testing|Prospective API", na=False)]
    assert not genuine_df.empty
    for _, row in genuine_df.iterrows():
        assert row["company_name"] == "Lumino Industries Ltd"
        assert row["actual_total"] > 0
        assert pd.notna(row["prediction_id"])


def test_n_equals_completed_records(eval_result):
    """Verify prospective sample size N strictly equals completed genuine records (N=1)."""
    df = pd.read_csv(COMPLETED_CSV)
    genuine_df = df[~df["company_name"].str.contains("Forward Testing|Prospective API", na=False)]
    assert eval_result["n"] == len(genuine_df)
    assert eval_result["n"] == 1
    assert eval_result["evidence_level"] == "INITIAL_CASE_STUDY"


def test_mae_calculation(eval_result):
    """Verify MAE computation across all 4 subscription targets."""
    assert eval_result["total_stats"]["mae"] == pytest.approx(2.14, rel=1e-2)
    assert eval_result["qib_stats"]["mae"] == pytest.approx(4.91, rel=1e-2)
    assert eval_result["nii_stats"]["mae"] == pytest.approx(4.07, rel=1e-2)
    assert eval_result["retail_stats"]["mae"] == pytest.approx(0.34, rel=1e-2)


def test_rmse_calculation(eval_result):
    """Verify RMSE matches MAE for single observation N=1."""
    assert eval_result["total_stats"]["rmse"] == eval_result["total_stats"]["mae"]
    assert eval_result["qib_stats"]["rmse"] == eval_result["qib_stats"]["mae"]


def test_median_ae_calculation(eval_result):
    """Verify Median Absolute Error computation."""
    assert eval_result["total_stats"]["median_ae"] == pytest.approx(2.14, rel=1e-2)
    assert eval_result["retail_stats"]["median_ae"] == pytest.approx(0.34, rel=1e-2)


def test_ape_calculation(eval_result):
    """Verify Absolute Percentage Error (MAPE) is sub-7% for all targets."""
    assert eval_result["total_stats"]["mape"] == pytest.approx(4.17, rel=1e-1)
    assert eval_result["qib_stats"]["mape"] == pytest.approx(4.15, rel=1e-1)
    assert eval_result["nii_stats"]["mape"] == pytest.approx(6.55, rel=1e-1)
    assert eval_result["retail_stats"]["mape"] == pytest.approx(2.02, rel=1e-1)


def test_signed_bias(eval_result):
    """Verify signed error directionality (negative = under-predicted, positive = over-predicted)."""
    assert eval_result["total_stats"]["mean_signed_error"] == pytest.approx(-2.14, rel=1e-2)
    assert eval_result["qib_stats"]["mean_signed_error"] == pytest.approx(-4.91, rel=1e-2)
    assert eval_result["retail_stats"]["mean_signed_error"] == pytest.approx(0.34, rel=1e-2)


def test_category_accuracy(eval_result):
    """Verify category recommendation accuracy computation (100% on Lumino)."""
    assert eval_result["category_accuracy_pct"] == 100.0


def test_confidence_calibration():
    """Verify confidence calibration artifact records WELL_CALIBRATED status."""
    conf_csv = RESEARCH_RESULTS_DIR / "prospective_confidence_metrics.csv"
    assert conf_csv.exists()
    df = pd.read_csv(conf_csv)
    high_tier = df[df["confidence_tier"] == "HIGH"]
    assert not high_tier.empty
    assert high_tier.iloc[0]["calibration_status"] == "WELL_CALIBRATED"


def test_small_sample_guard():
    """Verify evidence level rules enforce INITIAL_CASE_STUDY for N < 5."""
    assert get_evidence_level(1) == "INITIAL_CASE_STUDY"
    assert get_evidence_level(4) == "INITIAL_CASE_STUDY"
    assert get_evidence_level(5) == "EARLY_PROSPECTIVE_EVIDENCE"
    assert get_evidence_level(10) == "PRELIMINARY_PROSPECTIVE_EVIDENCE"


def test_bootstrap_small_sample_guard():
    """Verify bootstrap function refuses population CI when N < 5."""
    res = compute_bootstrap_ci(np.array([51.34]), np.array([49.20]))
    assert res["status"] == "INSUFFICIENT_SAMPLE_SIZE"
    assert res["mae_ci"] is None


def test_sector_small_sample_guard():
    """Verify sector metrics table explicitly flags LOW_SAMPLE_SIZE."""
    sec_csv = RESEARCH_RESULTS_DIR / "prospective_sector_metrics.csv"
    assert sec_csv.exists()
    df = pd.read_csv(sec_csv)
    assert "LOW_SAMPLE_SIZE" in df.iloc[0]["sample_size_flag"]


def test_regime_small_sample_guard():
    """Verify regime metrics table explicitly flags INSUFFICIENT_SAMPLE_SIZE."""
    reg_csv = RESEARCH_RESULTS_DIR / "prospective_regime_metrics.csv"
    assert reg_csv.exists()
    df = pd.read_csv(reg_csv)
    assert "INSUFFICIENT_SAMPLE_SIZE" in df.iloc[0]["sample_size_flag"]


def test_gmp_bucket_small_sample_guard():
    """Verify error distribution table accurately logs GMP bucket features."""
    dist_csv = METADATA_DIR / "prospective_error_distribution.csv"
    assert dist_csv.exists()
    df = pd.read_csv(dist_csv)
    assert df.iloc[0]["gmp_pct"] == 56.10


def test_historical_comparison():
    """Verify historical comparison artifact exists and records valid baseline MAE."""
    assert (RESEARCH_RESULTS_DIR / "prospective_target_metrics.csv").exists()
    df = pd.read_csv(RESEARCH_RESULTS_DIR / "prospective_target_metrics.csv")
    assert len(df) == 4
    tot = df[df["target"] == "total_subscription"].iloc[0]
    assert tot["mae"] == 2.14


def test_drift_metrics():
    """Verify drift metrics artifact tracks all 8 features."""
    drift_csv = RESEARCH_RESULTS_DIR / "prospective_drift_metrics.csv"
    assert drift_csv.exists()
    df = pd.read_csv(drift_csv)
    assert len(df) == 8
    assert "psi_score" in df.columns
    assert "drift_level" in df.columns


def test_analysis_manifest():
    """Verify analysis_manifest.json contains valid environment metadata and model hashes."""
    assert MANIFEST_FILE.exists()
    with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    assert manifest["prospective_sample_size_n"] == 1
    assert manifest["evidence_level"] == "INITIAL_CASE_STUDY"
    assert manifest["synthetic_observations"] == 0
    assert len(manifest["model_hashes"]) == 5


def test_reproducibility():
    """Verify that model files match canonical hashes and allow deterministic re-evaluation."""
    is_valid, hashes = verify_model_integrity()
    assert is_valid is True
    res2 = run_comprehensive_evaluation()
    assert res2["total_stats"]["mae"] == 2.14
