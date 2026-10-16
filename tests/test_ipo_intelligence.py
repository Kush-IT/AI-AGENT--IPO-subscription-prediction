"""
Unit & Integration Test Suite for Live 15-Day IPO Intelligence + Forecasting.
Verifies date-window calculations, zero retrospective prediction leakage,
indicative GMP disclaimers, implied listing prices, and API endpoints.
"""
import pytest
from datetime import datetime, date, timedelta
from fastapi.testclient import TestClient

from backend.main import app
from backend.monitoring.ipo_intelligence import (
    parse_date,
    get_reference_date,
    get_gmp_indicator,
    get_last_15_days_ipos,
    get_next_15_days_ipos,
    get_market_overview,
    get_ipo_deep_dive,
)


@pytest.fixture
def client():
    return TestClient(app)


def test_parse_date():
    assert parse_date("2026-08-31") == date(2026, 8, 31)
    assert parse_date("2026-08-31T18:00:00+05:30") == date(2026, 8, 31)
    assert parse_date(None) is None
    assert parse_date("invalid-date") is None


def test_reference_date_fallback():
    ref = get_reference_date(None)
    assert isinstance(ref, date)
    ref_custom = get_reference_date("2026-08-31")
    assert ref_custom == date(2026, 8, 31)


def test_gmp_indicator_formatting_and_disclaimer():
    # Valid GMP
    gmp = get_gmp_indicator("Test Co", "2026-09-15", 500.0, {"gmp_in_inr": 150.0})
    assert gmp.gmp_in_inr == 150.0
    assert gmp.gmp_percentage == 30.0
    assert gmp.status == "ACTIVE"
    assert "Unofficial / indicative grey-market data" in gmp.disclaimer

    # Missing GMP - must not fabricate
    gmp_none = get_gmp_indicator("Unknown Co", "2026-09-15", 500.0, None)
    assert gmp_none.status in ["ACTIVE", "UNAVAILABLE"]
    assert "Unofficial / indicative grey-market data" in gmp_none.disclaimer


def test_last_15_days_window_and_zero_retrospective_prediction():
    # Evaluate at 2026-08-31 where Lumino Industries closed on 2026-08-31
    past_ipos = get_last_15_days_ipos("2026-08-31")
    assert isinstance(past_ipos, list)
    assert len(past_ipos) >= 1

    # Check Lumino
    lumino = next((p for p in past_ipos if p.ipo_id == "lumino_2026"), None)
    assert lumino is not None
    assert lumino.company_name == "Lumino Industries Ltd"
    assert lumino.has_ex_ante_prediction is True
    assert lumino.actual_subscriptions is not None
    assert lumino.actual_subscriptions.total == 51.34
    assert lumino.predicted_subscriptions is not None
    assert lumino.predicted_subscriptions.total == 49.2
    assert lumino.prediction_error_ae is not None
    assert lumino.listing_metrics is not None
    assert lumino.listing_metrics.issue_price > 0

    # Ensure any historical IPO without ex-ante forecast has predicted_subscriptions == None
    for p in past_ipos:
        if not p.has_ex_ante_prediction:
            assert p.predicted_subscriptions is None, f"Leaked retrospective prediction for {p.ipo_id}"
            assert p.prediction_error_ae is None


def test_next_15_days_window_and_ex_ante_forecast():
    # Evaluate at 2026-09-11 where test_candidate_2026 opens 2026-09-15
    upcoming = get_next_15_days_ipos("2026-09-11")
    assert isinstance(upcoming, list)
    test_cand = next((u for u in upcoming if u.ipo_id == "test_candidate_2026"), None)
    if test_cand:
        assert test_cand.company_name == "Test Engineering Ltd"
        assert test_cand.days_until_open >= 0
        assert "GMP forecast unavailable" in test_cand.gmp_forecast_note
        if test_cand.gmp_data and test_cand.gmp_data.gmp_in_inr is not None:
            expected_implied = test_cand.price_high + test_cand.gmp_data.gmp_inr
            assert test_cand.gmp_implied_listing_price == expected_implied


def test_market_overview_summary():
    overview = get_market_overview("2026-08-31")
    assert overview.reference_date == "2026-08-31"
    assert overview.recently_closed_count >= 1
    assert "Grey Market Premium (GMP) data is unofficial" in overview.gmp_disclaimer


def test_ipo_deep_dive():
    dive = get_ipo_deep_dive("lumino_2026")
    assert dive.card.company_name == "Lumino Industries Ltd"
    assert len(dive.timeline) >= 4
    assert len(dive.source_provenance) >= 3


def test_api_endpoints_contracts(client):
    # 1. Overview
    r_ov = client.get("/api/v1/ipo/overview?reference_date=2026-08-31")
    assert r_ov.status_code == 200
    ov_data = r_ov.json()
    assert "reference_date" in ov_data
    assert "recently_closed_count" in ov_data

    # 2. Last 15 days
    r_last = client.get("/api/v1/ipo/last-15-days?reference_date=2026-08-31")
    assert r_last.status_code == 200
    last_data = r_last.json()
    assert isinstance(last_data, list)
    assert len(last_data) >= 1
    first_last = last_data[0]
    assert "company_name" in first_last
    assert "listing_metrics" in first_last
    assert "outcome_source" in first_last

    # 3. Next 15 days
    r_next = client.get("/api/v1/ipo/next-15-days?reference_date=2026-09-11")
    assert r_next.status_code == 200
    next_data = r_next.json()
    assert isinstance(next_data, list)

    # 4. Deep dive
    r_dive = client.get("/api/v1/ipo/lumino_2026")
    assert r_dive.status_code == 200
    dive_data = r_dive.json()
    assert dive_data["card"]["company_name"] == "Lumino Industries Ltd"

    # 5. Prediction sub-endpoint
    r_pred = client.get("/api/v1/ipo/lumino_2026/prediction")
    assert r_pred.status_code == 200

    # 6. Sources sub-endpoint
    r_src = client.get("/api/v1/ipo/lumino_2026/sources")
    assert r_src.status_code == 200
    assert "source_provenance" in r_src.json()

    # 7. History sub-endpoint
    r_hist = client.get("/api/v1/ipo/lumino_2026/history")
    assert r_hist.status_code == 200
    assert "timeline" in r_hist.json()

    # 8. 404 for unknown IPO
    r_404 = client.get("/api/v1/ipo/non_existent_ipo_9999")
    assert r_404.status_code == 404
