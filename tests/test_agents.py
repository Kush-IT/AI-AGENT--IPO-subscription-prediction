"""
Phase 9 Agentic AI Orchestration Core Test Suite.
Tests LangGraph state transitions, tool execution, model inference, SHAP attribution,
category recommendations, risk audits, and FastAPI API routes.
"""
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.agents.graph import get_ipo_agent_graph, run_ipo_analysis
from backend.agents.state import IPOInputSchema

client = TestClient(app)

# Deterministic synthetic test fixture (clearly marked non-real mock)
MOCK_IPO_FIXTURE = {
    "company_name": "Demo Engineering Ltd",
    "ipo_open_date": "2024-05-15",
    "price_high": 450.0,
    "price_low": 425.0,
    "issue_size_in_crore": 850.0,
    "lot_size": 33,
    "sector": "Engineering",
    "face_value": 10.0,
    "qib_quota_pct": 50.0,
    "nii_quota_pct": 15.0,
    "retail_quota_pct": 35.0,
    "fresh_issue_percentage": 60.0,
    "ofs_percentage": 40.0,
    "revenue_latest_cr": 1200.0,
    "pat_latest_cr": 140.0,
    "operating_cash_flow_cr": 110.0,
    "ebitda_margin_pct": 18.5,
    "revenue_cagr_3yr": 22.0,
    "pat_cagr_3yr": 25.0,
    "roe_pct": 21.0,
    "roce_pct": 24.0,
    "debt_equity_ratio": 0.4,
    "eps_pre_ipo": 18.0,
    "pe_ratio": 25.0,
    "industry_pe": 32.0,
    "pb_ratio": 4.0,
    "nifty_1d_return": 0.25,
    "nifty_5d_return": 1.10,
    "nifty_20d_return": 3.40,
    "sensex_1d_return": 0.25,
    "sensex_5d_return": 1.10,
    "sensex_20d_return": 3.40,
    "india_vix": 13.8,
    "india_vix_5d_change": -0.5,
    "market_trend": "BULLISH",
    "news_count": 25,
    "positive_news_ratio": 0.80,
    "negative_news_ratio": 0.10,
    "average_sentiment_score": 0.72,
    "gmp_in_inr": 180.0,
    "gmp_percentage": 40.0
}


def test_graph_initialization_and_compilation():
    """Verify that LangGraph StateGraph initializes and compiles successfully."""
    graph = get_ipo_agent_graph()
    assert graph is not None
    # Check that required nodes exist
    nodes = graph.nodes
    expected_nodes = [
        "validate_input",
        "collect_ipo_data",
        "prepare_features",
        "predict",
        "explain",
        "analyze_categories",
        "assess_risk",
        "generate_report"
    ]
    for n in expected_nodes:
        assert n in nodes, f"Missing graph node: {n}"


def test_deterministic_mock_ipo_full_pipeline():
    """Execute end-to-end analysis on the deterministic mock IPO fixture."""
    report = run_ipo_analysis(MOCK_IPO_FIXTURE)
    
    assert report["status"] == "ANALYSIS_COMPLETED"
    assert report["ipo"]["company_name"] == "Demo Engineering Ltd"
    
    # 1. Predictions check
    preds = report["predictions"]
    assert len(preds) == 4
    for target in ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]:
        assert target in preds
        assert preds[target]["predicted_multiple"] > 0.0
        assert preds[target]["unit"] == "times (subscription multiple)"
        
    # 2. Category assessment check
    cat = report["category_assessment"]
    assert "strongest_predicted_category" in cat
    assert "weakest_predicted_category" in cat
    assert cat["recommended_category"] in ["QIB", "NII", "RETAIL", "NO_CLEAR_EDGE"]
    
    # 3. Confidence check
    conf = report["confidence"]
    assert conf["confidence_level"] in ["HIGH", "MEDIUM", "LOW"]
    assert len(conf["justification_factors"]) > 0
    
    # 4. SHAP factors check
    assert len(report["top_positive_factors"]) > 0
    assert len(report["top_negative_factors"]) > 0
    for factor in report["top_positive_factors"]:
        assert factor["shap_value"] > 0
        assert "contributed positively" in factor["attribution_statement"]
        
    # 5. Risk assessment check
    risk = report["risk_assessment"]
    assert risk["overall_risk_level"] in ["HIGH", "MEDIUM", "LOW"]
    assert "composite_risk_score" in risk
    
    # 6. Provenance check
    sources = report["provenance_sources"]
    assert len(sources) >= 4
    for src in sources:
        assert "feature_cutoff" in src
        assert "2024-05-15T09:59:59+05:30" in src["feature_cutoff"]


def test_missing_required_data_handling():
    """Verify that invalid/missing required fields trigger graceful failure report without throwing."""
    invalid_input = {
        "company_name": "Incomplete IPO Ltd"
        # Missing ipo_open_date, price_high, issue_size_in_crore
    }
    report = run_ipo_analysis(invalid_input)
    assert report["status"] == "VALIDATION_FAILED"
    assert len(report["errors"]) >= 3


def test_category_recommendation_and_confidence_tiers():
    """Verify category recommendation logic under extreme input variance."""
    # Test IPO with extreme tail values to verify confidence penalty
    high_spec_fixture = dict(MOCK_IPO_FIXTURE)
    high_spec_fixture["gmp_percentage"] = 180.0 # Extreme GMP
    
    report = run_ipo_analysis(high_spec_fixture)
    assert report["status"] == "ANALYSIS_COMPLETED"
    # When predicted total or NII is in extreme tail, confidence is lowered or penalised
    assert report["confidence"]["confidence_score"] <= 90


def test_risk_analysis_detection():
    """Verify that high leverage and extreme valuation multiples trigger risk warnings."""
    risky_fixture = dict(MOCK_IPO_FIXTURE)
    risky_fixture["pe_ratio"] = 95.0 # Very high P/E
    risky_fixture["debt_equity_ratio"] = 3.5 # High debt
    risky_fixture["operating_cash_flow_cr"] = -50.0 # Negative OCF
    risky_fixture["india_vix"] = 22.5 # High VIX
    
    report = run_ipo_analysis(risky_fixture)
    risk_types = [rf["risk_type"] for rf in report["risk_assessment"]["identified_risk_factors"]]
    
    assert "VALUATION_PREMIUM_RISK" in risk_types
    assert "HIGH_BALANCE_SHEET_LEVERAGE" in risk_types
    assert "NEGATIVE_OPERATING_CASH_FLOW" in risk_types
    assert "ELEVATED_MACRO_VOLATILITY" in risk_types
    assert report["risk_assessment"]["overall_risk_level"] == "HIGH"


def test_fastapi_analyze_endpoint_success():
    """Verify FastAPI POST /api/v1/ipo/analyze integration."""
    response = client.post("/api/v1/ipo/analyze", json=MOCK_IPO_FIXTURE)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ANALYSIS_COMPLETED"
    assert "predictions" in data
    assert "category_assessment" in data
    assert "top_positive_factors" in data


def test_fastapi_analyze_endpoint_validation_error():
    """Verify FastAPI POST /api/v1/ipo/analyze returns 422 for invalid payloads."""
    response = client.post("/api/v1/ipo/analyze", json={"company_name": "Bad Input"})
    assert response.status_code == 422
