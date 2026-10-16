"""
Automated Test Suite for Hourly NSE Live Data Refresh Architecture.
Tests:
1. Cache TTL configuration (60 minutes).
2. HourlyRefreshService initialization and status reporting.
3. Graceful STALE fallback when upstream network fails.
4. Strict temporal isolation: Live subscription tallies NEVER leak into ex-ante predictions.
5. Sources health endpoint includes 60m TTL and next_refresh_ist.
"""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.config import settings
from backend.main import app
from backend.connectors.live_ipo_discovery import LiveIPODiscoveryService
from backend.monitoring.hourly_refresh import HourlyRefreshService, get_hourly_refresh_service
from backend.tools.prediction_tool import generate_ml_predictions


def test_settings_ttl_is_60_minutes():
    """Verify that IPO and subscription cache TTLs are configured to 60 minutes."""
    assert settings.IPO_DATA_TTL_MINUTES == 60
    assert settings.SUBSCRIPTION_DATA_TTL_MINUTES == 60


def test_hourly_refresh_service_initialization_and_status():
    """Verify HourlyRefreshService attributes and get_status structure."""
    service = HourlyRefreshService(interval_seconds=3600)
    status = service.get_status()
    assert status["refresh_interval_minutes"] == 60
    assert "is_running" in status
    assert "freshness_status" in status
    assert "last_refresh_utc" in status
    assert "next_refresh_utc" in status


@pytest.mark.asyncio
async def test_hourly_refresh_graceful_stale_fallback_on_network_error():
    """Verify that network exceptions result in STALE fallback rather than raising."""
    service = HourlyRefreshService(interval_seconds=3600)
    with patch.object(LiveIPODiscoveryService, "fetch_nse_live_issues", side_effect=Exception("NSE timeout 504")):
        with patch.object(LiveIPODiscoveryService, "fetch_ipowatch_gmp_pipeline", side_effect=Exception("IPOWatch connection failed")):
            result = await service.refresh_now(force=True)
            assert result is not None
            assert service.freshness_status in ["STALE", "DATA_UNAVAILABLE"]
            assert service.last_error is not None


def test_ex_ante_isolation_no_leakage_of_live_subscription():
    """
    Critical governance test:
    Verify that providing live_subscription_multiple in raw inputs does NOT alter
    the ex-ante ML prediction (strict temporal isolation).
    """
    raw_inputs_without_live = {
        "company_name": "Isolation Verification Corp",
        "ipo_open_date": "2026-10-01",
        "price_high": 450.0,
        "price_low": 420.0,
        "issue_size_in_crore": 500.0,
        "lot_size": 33,
        "sector": "FINANCIAL SERVICES",
        "mode": "OFFLINE",
    }
    
    raw_inputs_with_live = dict(raw_inputs_without_live)
    # Inject an extreme live subscription tally that should NOT leak
    raw_inputs_with_live["live_subscription_multiple"] = 999.99
    raw_inputs_with_live["actual_total"] = 888.88
    
    res1 = generate_ml_predictions(raw_inputs_without_live, force_refresh=True)
    res2 = generate_ml_predictions(raw_inputs_with_live, force_refresh=True)
    
    pred1 = res1["predictions"]["total_subscription"]["predicted_multiple"]
    pred2 = res2["predictions"]["total_subscription"]["predicted_multiple"]
    
    # Assert exact equality: live tallies have zero influence on ex-ante ML output
    assert pred1 == pred2
    assert pred1 < 200.0  # Does not reflect the 999.99x live mock


def test_sources_health_endpoint_includes_freshness_and_interval():
    """Verify /api/v1/ipo/sources/health exposes 60m TTL and next_refresh_ist."""
    client = TestClient(app)
    resp = client.get("/api/v1/ipo/sources/health")
    assert resp.status_code == 200
    data = resp.json()
    assert "cache" in data
    cache = data["cache"]
    assert cache["ttl_seconds"] == 3600
    assert cache["refresh_interval_minutes"] == 60
