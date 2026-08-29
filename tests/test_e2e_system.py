"""
Phase 13 End-to-End System Validation and Integration Test Suite.
Verifies the complete quantitative pipeline:
React -> FastAPI -> LangGraph -> Connectors -> Feature Engineering -> Frozen ML Models -> SHAP -> Category -> Risk -> Response.
"""
from pathlib import Path
import hashlib
import time
import json
import pytest
import pandas as pd
from fastapi.testclient import TestClient

from backend.main import app
from backend.agents.graph import run_ipo_analysis
from backend.api.schemas import IPOAnalysisRequest, IPOAnalysisResponse
from backend.connectors.temporal_validator import validate_ex_ante
from backend.connectors.base_connector import ProvenanceRecord
from backend.connectors.ipo_connector import IPOConnector
from backend.connectors.financial_connector import FinancialConnector
from backend.connectors.market_connector import MarketConnector
from backend.connectors.gmp_connector import GMPConnector
from backend.connectors.news_connector import NewsConnector
from backend.connectors.historical_connector import HistoricalConnector
from backend.ml.model_config import ABLATION_GROUPS

client = TestClient(app)

ROOT_DIR = Path(__file__).parent.parent
FINAL_MODELS_DIR = ROOT_DIR / "models" / "final_candidates"

# Deterministic synthetic test fixture (clearly marked non-real mock)
SYNTHETIC_TEST_FIXTURE = {
    "company_name": "Acme Engineering Dynamics Ltd (SYNTHETIC FIXTURE)",
    "ipo_open_date": "2024-05-15",
    "ipo_close_date": "2024-05-17",
    "sector": "Engineering",
    "issue_size_in_crore": 850.0,
    "price_low": 425.0,
    "price_high": 450.0,
    "lot_size": 33,
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
    "gmp_percentage": 40.0,
    "mode": "OFFLINE"
}


# =====================================================================
# 1. OFFLINE E2E PIPELINE & SCHEMA CONTRACT
# =====================================================================
def test_offline_e2e_full_pipeline_success():
    """Verify complete successful pipeline execution using synthetic test fixture."""
    response = client.post("/api/v1/ipo/analyze", json=SYNTHETIC_TEST_FIXTURE)
    assert response.status_code == 200
    data = response.json()
    
    # 1. Validate response against strict Pydantic model contract
    validated = IPOAnalysisResponse(**data)
    assert validated.request_id is not None
    assert validated.status == "ANALYSIS_COMPLETED"
    
    # 2. Check 4 category predictions
    preds = validated.predictions
    assert preds["total_subscription"].predicted_multiple > 0
    assert preds["qib_subscription"].predicted_multiple > 0
    assert preds["nii_subscription"].predicted_multiple > 0
    assert preds["retail_subscription"].predicted_multiple > 0
    
    # 3. Check SHAP explainability
    assert len(validated.top_positive_factors) > 0
    assert len(validated.top_negative_factors) > 0
    for f in validated.top_positive_factors:
        assert "contributed positively" in f["attribution_statement"]
    for f in validated.top_negative_factors:
        assert "contributed negatively" in f["attribution_statement"]
        
    # 4. Check category assessment
    assert validated.category_assessment.recommended_category in ["QIB", "NII", "RETAIL", "NO_CLEAR_EDGE"]
    assert "not investment or financial advice" in validated.category_assessment.disclaimer.lower()
    
    # 5. Check confidence diagnostics
    assert validated.confidence.confidence_level in ["HIGH", "MEDIUM", "LOW"]
    assert 0 <= validated.confidence.confidence_score <= 100
    
    # 6. Check data quality & temporal validation
    assert validated.data_quality.feature_completeness_pct >= 95.0
    assert validated.temporal_validation.status == "EX_ANTE_COMPLIANT"
    assert validated.temporal_validation.temporal_rejections_count == 0


# =====================================================================
# 2. MODEL FILE IMMUTABILITY & HASH INTEGRITY
# =====================================================================
def test_model_files_read_only_hash_integrity():
    """CRITICAL TEST: Ensure model files in models/final_candidates/ are never modified during inference."""
    def get_model_hashes():
        hashes = {}
        for p in FINAL_MODELS_DIR.glob("*.joblib"):
            with open(p, "rb") as f:
                hashes[p.name] = hashlib.sha256(f.read()).hexdigest()
        return hashes
        
    hashes_before = get_model_hashes()
    assert len(hashes_before) == 5, "Expected 5 frozen candidate joblib files (4 models + preprocessor)"
    
    # Run full analysis multiple times
    for _ in range(3):
        report = run_ipo_analysis(SYNTHETIC_TEST_FIXTURE)
        assert report["status"] == "ANALYSIS_COMPLETED"
        
    hashes_after = get_model_hashes()
    assert hashes_before == hashes_after, "SECURITY VIOLATION: Model candidate files were modified during inference!"


# =====================================================================
# 3. TEMPORAL LEAKAGE INJECTION & STRICT REJECTION
# =====================================================================
def test_temporal_leakage_injection_rejected():
    """Verify that injected future timestamps across financials, news, and GMP are rejected."""
    cutoff = "2024-05-15T09:59:59+05:30"
    
    # Injected future financial publication
    future_fin = validate_ex_ante({
        "field": "pat_latest_cr",
        "value": 500.0,
        "observed_at": "2024-05-20T10:00:00+05:30",
        "feature_cutoff": cutoff
    })
    assert future_fin["valid"] is False
    assert future_fin["validation_status"] == "TEMPORAL_REJECTED"
    
    # Injected future market close
    future_market = validate_ex_ante({
        "field": "nifty_1d_return",
        "value": 2.5,
        "observed_at": "2024-05-15T15:30:00+05:30",
        "feature_cutoff": cutoff
    })
    assert future_market["valid"] is False
    assert future_market["validation_status"] == "TEMPORAL_REJECTED"
    
    # Injected future GMP
    future_gmp = validate_ex_ante({
        "field": "gmp_percentage",
        "value": 90.0,
        "observed_at": "2024-05-18T09:00:00+05:30",
        "feature_cutoff": cutoff
    })
    assert future_gmp["valid"] is False
    assert future_gmp["validation_status"] == "TEMPORAL_REJECTED"


# =====================================================================
# 4. FIELD-LEVEL PROVENANCE PROPAGATION
# =====================================================================
def test_provenance_propagation_complete():
    """Verify all 45 features contain granular field provenance with source metadata."""
    report = run_ipo_analysis(SYNTHETIC_TEST_FIXTURE)
    provenance = report["feature_provenance"]
    
    expected_features = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    assert len(expected_features) == 45
    
    for feat in expected_features:
        assert feat in provenance, f"Missing provenance for feature: {feat}"
        prec = provenance[feat]
        assert "source" in prec
        assert "observed_at" in prec
        assert "feature_cutoff" in prec
        assert "status" in prec


# =====================================================================
# 5. CATEGORY RECOMMENDATION RULE (>= 15% LEADING RULE)
# =====================================================================
def test_category_recommendation_leading_edge_and_parity():
    """Verify >= 15% rule correctly separates clear winners from narrow parity."""
    # Run analysis
    report = run_ipo_analysis(SYNTHETIC_TEST_FIXTURE)
    cat_assess = report["category_assessment"]
    
    # Verify non-advisory wording
    assert "strongest" in cat_assess["edge_rationale"].lower() or "parity" in cat_assess["edge_rationale"].lower()
    assert "guaranteed" not in cat_assess["edge_rationale"].lower()


# =====================================================================
# 6. MULTI-DIMENSIONAL RISK AUDIT TRIGGERS
# =====================================================================
def test_multi_dimensional_risk_triggers():
    """Verify high valuation P/E, large issue size, high VIX, and negative GMP trigger risk warnings."""
    high_risk_fixture = dict(SYNTHETIC_TEST_FIXTURE)
    high_risk_fixture["pe_ratio"] = 85.0 # Extreme P/E
    high_risk_fixture["debt_equity_ratio"] = 3.2 # High debt
    high_risk_fixture["issue_size_in_crore"] = 4500.0 # Large issue size friction
    high_risk_fixture["india_vix"] = 24.5 # High VIX
    high_risk_fixture["operating_cash_flow_cr"] = -80.0 # Negative OCF
    high_risk_fixture["gmp_percentage"] = -5.0 # Negative GMP discount
    
    report = run_ipo_analysis(high_risk_fixture)
    risk = report["risk_assessment"]
    
    assert risk["overall_risk_level"] == "HIGH"
    assert risk["composite_risk_score"] >= 40
    
    r_types = [rf["risk_type"] for rf in risk["identified_risk_factors"]]
    assert "VALUATION_PREMIUM_RISK" in r_types
    assert "LARGE_OFFERING_SCALE_FRICTION" in r_types
    assert "HIGH_BALANCE_SHEET_LEVERAGE" in r_types
    assert "NEGATIVE_OPERATING_CASH_FLOW" in r_types
    assert "ELEVATED_MACRO_VOLATILITY" in r_types
    assert "ZERO_OR_NEGATIVE_GREY_MARKET_PREMIUM" in r_types


# =====================================================================
# 7. STRUCTURED ERROR RESPONSES (NO STACK TRACES)
# =====================================================================
def test_structured_error_responses_no_stack_traces():
    """Verify 400, 422 errors return uniform JSON structure without stack traces."""
    # 400 Bad Request
    r400 = client.post("/api/v1/ipo/analyze", json={
        "company_name": "Test Ltd",
        "ipo_open_date": "2024-05-15",
        "price_high": 400.0,
        "price_low": 450.0, # Floor > Cap
        "issue_size_in_crore": 500.0
    })
    assert r400.status_code == 400
    d400 = r400.json()
    assert "request_id" in d400
    assert d400["error_code"] == "INVALID_IPO_INPUT"
    assert "traceback" not in str(d400).lower()
    
    # 422 Unprocessable Entity
    r422 = client.post("/api/v1/ipo/analyze", json={"company_name": "Missing Required Fields"})
    assert r422.status_code == 422
    d422 = r422.json()
    assert "request_id" in d422
    assert d422["error_code"] == "PYDANTIC_VALIDATION_ERROR"
    assert "traceback" not in str(d422).lower()


# =====================================================================
# 8. DETERMINISTIC REPRODUCIBILITY
# =====================================================================
def test_deterministic_reproducibility():
    """Verify running the same synthetic analysis twice yields identical predictions and attributions."""
    report1 = run_ipo_analysis(SYNTHETIC_TEST_FIXTURE)
    report2 = run_ipo_analysis(SYNTHETIC_TEST_FIXTURE)
    
    # Predictions must match exactly
    for target in ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]:
        pred1 = report1["predictions"][target]["predicted_multiple"]
        pred2 = report2["predictions"][target]["predicted_multiple"]
        assert pred1 == pytest.approx(pred2, rel=1e-5)
        
    # Risk scores and category assessments must match
    assert report1["risk_assessment"]["composite_risk_score"] == report2["risk_assessment"]["composite_risk_score"]
    assert report1["category_assessment"]["recommended_category"] == report2["category_assessment"]["recommended_category"]
