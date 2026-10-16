"""
Unit and Integration Tests for Live Indian Mainboard IPO Discovery, Test Data Isolation,
Cache Fallback, and Sources Health.
"""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.main import app
from backend.connectors.live_ipo_discovery import (
    LiveIPODiscoveryService,
    is_test_record,
    parse_price_band,
    parse_date_str,
)
from backend.monitoring.ipo_intelligence import (
    get_next_15_days_ipos,
    get_active_open_ipos,
    get_last_15_days_ipos,
    get_market_overview,
    get_ipo_deep_dive,
)
from backend.monitoring.prospective_validator import verify_model_integrity

client = TestClient(app)


def test_is_test_record_classification():
    """Verify test-data classification correctly flags test fixtures."""
    fixture_1 = {"ipo_id": "test_candidate_2026", "company_name": "Test Engineering Ltd", "isin": "INE0XYZ99999"}
    fixture_2 = {"ipo_id": "fixture_abc", "company_name": "Some Corp"}
    fixture_3 = {"ipo_id": "real_corp_123", "company_name": "Mock Industries"}
    fixture_4 = {"ipo_id": "custom_id", "company_name": "Real Name", "record_source": "test"}

    assert is_test_record(fixture_1) is True
    assert is_test_record(fixture_2) is True
    assert is_test_record(fixture_3) is True
    assert is_test_record(fixture_4) is True


def test_is_production_record_classification():
    """Verify production IPO records are not misclassified as test records."""
    prod_1 = {"ipo_id": "nse_manika", "company_name": "Manika Plastech Limited", "isin": "INE012345678", "record_source": "production"}
    prod_2 = {"ipo_id": "lumino_2026", "company_name": "Lumino Industries Ltd", "isin": "INE0ABC01019", "record_source": "production"}
    prod_3 = {"ipo_id": "nse_veegaland", "company_name": "Veegaland Developers Limited", "record_source": "production"}

    assert is_test_record(prod_1) is False
    assert is_test_record(prod_2) is False
    assert is_test_record(prod_3) is False


def test_parse_price_band():
    """Verify robust parsing of price band strings."""
    assert parse_price_band("Rs.40 to Rs.43") == (40.0, 43.0)
    assert parse_price_band("₹1785") == (1785.0, 1785.0)
    assert parse_price_band("Rs. 130 - Rs. 140") == (130.0, 140.0)
    assert parse_price_band("") == (475.0, 500.0)


def test_parse_date_str():
    """Verify parsing of various date string formats."""
    assert parse_date_str("11-Sep-2026") == "2026-09-11"
    assert parse_date_str("2026-09-15") == "2026-09-15"
    assert parse_date_str("16-18 Sept", reference_year=2026) == "2026-09-16"
    assert parse_date_str(None) is None


def test_cache_fallback_and_stale_flag(tmp_path):
    """Verify graceful fallback to cached data with STALE flag when upstream network fails."""
    cache_file = tmp_path / "test_cache.json"
    service = LiveIPODiscoveryService(cache_file=cache_file)

    # Prime cache
    service.save_cache({
        "cached_at": "2026-09-10T10:00:00Z",
        "last_updated_ist": "10-09-2026 15:30 IST",
        "data_status": "LIVE / PERIODICALLY REFRESHED",
        "sources": {"nse": {"status": "HEALTHY"}},
        "ipos": [{
            "ipo_id": "nse_alpha",
            "company_name": "Cached Alpha Corp",
            "series": "EQ",
            "is_mainboard": True,
            "ipo_open_date": "2026-09-12",
            "ipo_close_date": "2026-09-15",
            "price_low": 100.0,
            "price_high": 110.0,
            "lot_size": 30,
            "issue_size_in_crore": 200.0,
            "record_source": "production",
        }],
    })

    # Simulate network failure during force_refresh
    with patch.object(service, "fetch_nse_live_issues", return_value=([], {"status": "ERROR", "error": "Connection timed out"})):
        with patch.object(service, "fetch_ipowatch_gmp_pipeline", return_value=({}, {"status": "ERROR"})):
            res = service.get_live_ipos(force_refresh=True)
            assert res["data_status"] == "STALE"
            assert len(res["ipos"]) == 1
            assert res["ipos"][0]["company_name"] == "Cached Alpha Corp"


def test_sources_health_reporting():
    """Verify get_sources_health returns structured metadata."""
    service = LiveIPODiscoveryService()
    health = service.get_sources_health()
    assert "service" in health
    assert "overall_status" in health
    assert "cache" in health
    assert "ttl_seconds" in health["cache"]


def test_get_next_15_days_isolates_test_records():
    """Verify production queries strictly exclude test_candidate_2026 and Test Engineering Ltd."""
    prod_ipos = get_next_15_days_ipos(reference_date="2026-09-11", include_test_records=False)
    for ipo in prod_ipos:
        assert ipo.ipo_id != "test_candidate_2026"
        assert "test engineering" not in ipo.company_name.lower()
        assert ipo.record_source == "production"


def test_get_next_15_days_includes_test_records_when_requested():
    """Verify test fixtures remain accessible to unit tests when explicitly requested."""
    all_ipos = get_next_15_days_ipos(reference_date="2026-09-11", include_test_records=True)
    test_ids = [u.ipo_id for u in all_ipos if u.ipo_id == "test_candidate_2026"]
    assert len(test_ids) == 1


def test_api_endpoints_test_isolation():
    """Verify FastAPI route enforces test isolation by default."""
    # Production route: no test fixtures
    r = client.get("/api/v1/ipo/next-15-days")
    assert r.status_code == 200
    prod_ipos = r.json()
    assert all(i.get("ipo_id") != "test_candidate_2026" for i in prod_ipos)

    # Test route with explicit flag on 2026-09-11 when test candidate opens in 4d
    r_test = client.get("/api/v1/ipo/next-15-days?reference_date=2026-09-11&include_test_records=true")
    assert r_test.status_code == 200
    test_ipos = r_test.json()
    assert any(i.get("ipo_id") == "test_candidate_2026" for i in test_ipos)

    # Verify active-open test isolation on 2026-09-18
    r_act_prod = client.get("/api/v1/ipo/active-open?reference_date=2026-09-18")
    assert all(i.get("ipo_id") != "test_candidate_2026" for i in r_act_prod.json())

    r_act_test = client.get("/api/v1/ipo/active-open?reference_date=2026-09-18&include_test_records=true")
    assert any(i.get("ipo_id") == "test_candidate_2026" for i in r_act_test.json())


def test_api_sources_health_endpoints():
    """Verify /api/v1/ipo/sources/health and /api/v1/monitoring/sources/health both return 200."""
    r1 = client.get("/api/v1/ipo/sources/health")
    assert r1.status_code == 200
    data1 = r1.json()
    assert data1["service"] == "Live IPO Discovery & Intelligence"

    r2 = client.get("/api/v1/monitoring/sources/health")
    assert r2.status_code == 200
    data2 = r2.json()
    assert "cache" in data2


def test_market_overview_metadata():
    """Verify market overview response includes data_status and last_updated_ist."""
    r = client.get("/api/v1/ipo/overview")
    assert r.status_code == 200
    data = r.json()
    assert "data_status" in data
    assert "last_updated_ist" in data
    assert "sources_health" in data


def test_production_model_hashes_strictly_intact():
    """Cryptographically verify that all 5 production models in models/final_candidates/ remain untouched."""
    valid, hashes = verify_model_integrity()
    assert valid is True
    expected = {
        "dev_preprocessor.joblib": "04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57",
        "total_xgboost_log1p.joblib": "3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6",
        "qib_random_forest_raw.joblib": "29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5",
        "nii_lightgbm_log1p.joblib": "618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29",
        "retail_xgboost_raw.joblib": "835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab",
    }
    for filename, exp_hash in expected.items():
        assert hashes.get(filename) == exp_hash, f"Hash mismatch on production model artifact {filename}!"


def test_real_upcoming_ipo_discovery_and_mainboard_filtering():
    """Verify live IPO discovery filters to Mainboard equity issues (series EQ) only."""
    service = LiveIPODiscoveryService()
    res = service.get_live_ipos()
    ipos = res.get("ipos", [])
    assert len(ipos) > 0
    for item in ipos:
        assert item.get("series") == "EQ"
        assert item.get("is_mainboard") is True


def test_ex_ante_prediction_generated_for_eligible_upcoming_ipo():
    """Verify an eligible upcoming IPO receives real ex-ante predictions for all 4 targets."""
    from backend.tools.prediction_tool import generate_ml_predictions
    raw_input = {
        "company_name": "A-One Steels",
        "ipo_open_date": "2026-09-24",
        "price_high": 405.0,
        "price_low": 384.75,
        "issue_size_in_crore": 500.0,
        "lot_size": 35,
        "sector": "Metals & Mining",
    }
    out = generate_ml_predictions(raw_input)
    preds = out["predictions"]
    
    assert "total_subscription" in preds
    assert "qib_subscription" in preds
    assert "nii_subscription" in preds
    assert "retail_subscription" in preds

    assert preds["total_subscription"]["predicted_multiple"] > 0
    assert preds["qib_subscription"]["predicted_multiple"] > 0
    assert preds["nii_subscription"]["predicted_multiple"] > 0
    assert preds["retail_subscription"]["predicted_multiple"] > 0

    assert out["category_assessment"]["recommended_category"] in ["QIB", "NII", "RETAIL", "NO_CLEAR_EDGE"]
    assert out["confidence"]["confidence_level"] in ["HIGH", "MEDIUM", "LOW"]
    assert out["cutoff_timestamp"] == "2026-09-24T09:59:59+05:30"
    assert out["model_integrity_verified"] is True


def test_next_15_days_endpoint_returns_real_predictions_for_upcoming():
    """Verify GET /api/v1/ipo/next-15-days returns real predictions for upcoming IPOs."""
    r = client.get("/api/v1/ipo/next-15-days")
    assert r.status_code == 200
    data = r.json()
    assert len(data) > 0

    upcoming_with_preds = [x for x in data if x.get("prediction_status") == "PREDICTED_EX_ANTE"]
    assert len(upcoming_with_preds) > 0

    for ipo in upcoming_with_preds:
        preds = ipo["predicted_subscriptions"]
        assert preds is not None
        assert isinstance(preds["total"], (int, float)) and preds["total"] > 0
        assert isinstance(preds["qib"], (int, float)) and preds["qib"] > 0
        assert isinstance(preds["nii"], (int, float)) and preds["nii"] > 0
        assert isinstance(preds["retail"], (int, float)) and preds["retail"] > 0
        assert preds["cutoff_timestamp"].endswith("09:59:59+05:30")
        assert preds["model_integrity_verified"] is True


def test_predictions_never_equal_live_subscription_copy():
    """Verify model predictions are not simply copied from live subscription tallies."""
    r = client.get("/api/v1/ipo/active-open?reference_date=2026-09-18")
    assert r.status_code == 200
    for ipo in r.json():
        preds = ipo.get("predicted_subscriptions")
        live_sub = ipo.get("live_subscription_multiple")
        if preds and live_sub is not None:
            assert preds["total"] != live_sub


def test_active_open_bidding_classification_and_temporal_partition():
    """
    Verify IPOs opened on 2026-09-16 are classified as OPEN_FOR_BIDDING on 2026-09-18
    and appear in /active-open, while NEVER appearing in /next-15-days.
    """
    # 1. Active open query on 2026-09-18
    r_act = client.get("/api/v1/ipo/active-open?reference_date=2026-09-18")
    assert r_act.status_code == 200
    active_data = r_act.json()
    assert len(active_data) >= 3

    active_names = [x["company_name"] for x in active_data]
    assert "Hero Motors Limited" in active_names
    assert "Jindal Supreme (India) Limited" in active_names
    assert "SS Retail Limited" in active_names

    for ipo in active_data:
        assert ipo["status"] == "OPEN_FOR_BIDDING"
        assert ipo["days_until_open"] == 0
        assert ipo["days_until_close"] is not None
        assert ipo["days_until_close"] >= 0

    # 2. Upcoming query on 2026-09-18
    r_nxt = client.get("/api/v1/ipo/next-15-days?reference_date=2026-09-18")
    assert r_nxt.status_code == 200
    upcoming_data = r_nxt.json()
    upcoming_names = [x["company_name"] for x in upcoming_data]

    # Strictly verify NO already-open IPO is returned under upcoming
    assert "Hero Motors Limited" not in upcoming_names
    assert "Jindal Supreme (India) Limited" not in upcoming_names
    assert "SS Retail Limited" not in upcoming_names

    for ipo in upcoming_data:
        assert ipo["status"] == "UPCOMING"
        assert ipo["days_until_open"] >= 1  # Absolutely never 0 or negative


def test_market_overview_counts_match_partitioned_endpoints():
    """Verify overview active and upcoming counts match the respective endpoints."""
    r_ov = client.get("/api/v1/ipo/overview?reference_date=2026-09-18")
    assert r_ov.status_code == 200
    ov = r_ov.json()

    r_act = client.get("/api/v1/ipo/active-open?reference_date=2026-09-18")
    r_nxt = client.get("/api/v1/ipo/next-15-days?reference_date=2026-09-18")

    assert ov["active_bidding_count"] == len(r_act.json())
    assert ov["upcoming_ipos_count"] == len(r_nxt.json())


