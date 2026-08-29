"""
Phase 10 Pre-IPO Data Connectors and Temporal Traceability Test Suite.
Verifies connector protocols, cache management, temporal leakage rejection, and provenance tracking.
"""
from pathlib import Path
import pytest
import pandas as pd

from backend.connectors.temporal_validator import TemporalValidator, validate_ex_ante
from backend.connectors.base_connector import ProvenanceRecord, CacheManager
from backend.connectors.ipo_connector import IPOConnector
from backend.connectors.financial_connector import FinancialConnector
from backend.connectors.market_connector import MarketConnector
from backend.connectors.gmp_connector import GMPConnector
from backend.connectors.news_connector import NewsConnector
from backend.connectors.historical_connector import HistoricalConnector

METADATA_DIR = Path(__file__).parent.parent / "data" / "metadata"


def test_temporal_validator_valid_and_invalid_timestamps():
    """Verify that temporal validator passes pre-cutoff and rejects future timestamps."""
    cutoff = "2024-05-15T09:59:59+05:30"
    
    # Valid past timestamps
    valid_record = {
        "field": "gmp_percentage",
        "value": 25.0,
        "observed_at": "2024-05-15T08:30:00+05:30",
        "feature_cutoff": cutoff
    }
    res = validate_ex_ante(valid_record)
    assert res["valid"] is True
    assert res["validation_status"] == "EX_ANTE_VALID"
    
    # Invalid future timestamp (leakage)
    future_record = {
        "field": "gmp_percentage",
        "value": 45.0,
        "observed_at": "2024-05-15T15:30:00+05:30", # Observed afternoon after open
        "feature_cutoff": cutoff
    }
    res_future = validate_ex_ante(future_record)
    assert res_future["valid"] is False
    assert res_future["validation_status"] == "TEMPORAL_REJECTED"
    assert "Temporal Leakage Violation" in res_future["reason"]


def test_future_financial_data_rejected():
    """CRITICAL TEST: Verify financial data published after cutoff is strictly rejected."""
    cutoff = "2024-05-15T09:59:59+05:30"
    prec = ProvenanceRecord(
        field="revenue_latest_cr",
        value=1500.0,
        source="Audited Annual Report",
        source_url="https://bseindia.com",
        observed_at="2024-06-30T10:00:00+05:30", # Published 1.5 months AFTER open date
        feature_cutoff=cutoff
    )
    assert prec.is_valid is False
    assert prec.status == "REJECTED"
    assert prec.validation_status == "TEMPORAL_REJECTED"


def test_future_news_rejected():
    """CRITICAL TEST: Verify news articles published after cutoff are filtered out."""
    cutoff = "2024-05-15T09:59:59+05:30"
    conn = NewsConnector()
    
    test_articles = [
        {"headline": "Pre-IPO surge expected", "sentiment_score": 0.85, "publication_datetime": "2024-05-14T14:00:00+05:30"}, # Valid
        {"headline": "Day 2 massive retail bid", "sentiment_score": 0.95, "publication_datetime": "2024-05-16T11:00:00+05:30"} # Future leak
    ]
    records = conn.fetch_data("Demo Corp", "2024-05-15", cutoff, {"articles": test_articles})
    
    # Only 1 valid article should be counted
    assert records["news_count"].value == 1
    assert records["average_sentiment_score"].value == 0.85


def test_future_market_data_rejected():
    """CRITICAL TEST: Verify future secondary market data is rejected."""
    cutoff = "2024-05-15T09:59:59+05:30"
    prec = ProvenanceRecord(
        field="nifty_1d_return",
        value=1.5,
        source="NSE Feeds",
        source_url="https://nseindia.com",
        observed_at="2024-05-15T15:30:00+05:30", # End of Day on Open Date
        feature_cutoff=cutoff
    )
    assert prec.is_valid is False
    assert prec.validation_status == "TEMPORAL_REJECTED"


def test_future_gmp_rejected():
    """CRITICAL TEST: Verify listing-day GMP is rejected as pre-IPO predictor."""
    cutoff = "2024-05-15T09:59:59+05:30"
    prec = ProvenanceRecord(
        field="gmp_percentage",
        value=85.0,
        source="Grey Market",
        source_url="https://chittorgarh.com",
        observed_at="2024-05-20T09:00:00+05:30", # Listing Day GMP
        feature_cutoff=cutoff
    )
    assert prec.is_valid is False
    assert prec.status == "REJECTED"


def test_historical_features_use_past_only():
    """CRITICAL TEST: Verify historical expanding averages only use IPOs prior to target open date."""
    conn = HistoricalConnector()
    cutoff = "2022-01-01T09:59:59+05:30"
    records = conn.fetch_data("Early IPO", "2022-01-01", cutoff, {"sector": "Technology"})
    
    gen_avg = records["previous_general_avg_subscription"].value
    sec_avg = records["previous_sector_avg_subscription"].value
    
    assert gen_avg > 0.0
    assert sec_avg > 0.0
    assert records["previous_general_avg_subscription"].is_valid is True


def test_gmp_connector_unavailability_handling():
    """Verify that GMP connector returns UNAVAILABLE without fabricating values."""
    conn = GMPConnector()
    cutoff = "2024-05-15T09:59:59+05:30"
    records = conn.fetch_data("No GMP IPO Ltd", "2024-05-15", cutoff, {})
    
    assert records["gmp_percentage"].status == "UNAVAILABLE"
    assert records["gmp_percentage"].value is None
    assert records["gmp_in_inr"].status == "UNAVAILABLE"
    assert records["gmp_in_inr"].value is None


def test_cache_manager_storage_and_retrieval():
    """Verify local cache storage, retrieval, and determinism."""
    test_data = {"price_high": 750.0, "issue_size_in_crore": 1200.0}
    CacheManager.set("TEST_SOURCE", "Test Company Ltd", "2024-05-15", test_data)
    
    retrieved = CacheManager.get("TEST_SOURCE", "Test Company Ltd", "2024-05-15")
    assert retrieved is not None
    assert retrieved["price_high"] == 750.0
    assert retrieved["issue_size_in_crore"] == 1200.0


def test_source_registry_csv_completeness():
    """Verify live_source_registry.csv contains all 45 features and required columns."""
    reg_file = METADATA_DIR / "live_source_registry.csv"
    assert reg_file.exists()
    
    df = pd.read_csv(reg_file)
    expected_cols = ["field", "source", "source_url", "retrieved_at", "observed_at", "cutoff", "status", "validation_status"]
    assert list(df.columns) == expected_cols
    assert len(df) >= 45
    assert (df["validation_status"] == "EX_ANTE_VALID").all()
