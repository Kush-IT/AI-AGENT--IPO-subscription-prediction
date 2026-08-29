"""
Phase 11 Production FastAPI API Integration and Schema Contract Test Suite.
Verifies all /api/v1/ endpoints, request tracing, error responses, health checks,
model metadata, form schemas, and Pydantic response contract adherence.
"""
import uuid
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.api.schemas import IPOAnalysisResponse, HealthResponse, ModelMetadataResponse

client = TestClient(app)

# Standard valid fixture
VALID_PAYLOAD = {
    "company_name": "Tata Technologies Ltd",
    "ipo_open_date": "2023-11-22",
    "ipo_close_date": "2023-11-24",
    "sector": "Technology",
    "issue_size_in_crore": 3042.51,
    "price_low": 475.0,
    "price_high": 500.0,
    "lot_size": 30,
    "qib_quota_pct": 50.0,
    "nii_quota_pct": 15.0,
    "retail_quota_pct": 35.0,
    "revenue_latest_cr": 4414.18,
    "pat_latest_cr": 624.04,
    "operating_cash_flow_cr": 580.0,
    "ebitda_margin_pct": 23.7,
    "revenue_cagr_3yr": 36.2,
    "pat_cagr_3yr": 61.5,
    "roe_pct": 23.7,
    "pe_ratio": 32.5,
    "industry_pe": 60.0,
    "gmp_percentage": 75.0,
    "gmp_in_inr": 375.0,
    "positive_news_ratio": 0.88,
    "average_sentiment_score": 0.82,
    "india_vix": 12.2,
    "market_trend": "BULLISH",
    "mode": "OFFLINE"
}


def test_post_ipo_analyze_valid_request():
    """Verify POST /api/v1/ipo/analyze returns 200 with full forecast and attributions."""
    response = client.post("/api/v1/ipo/analyze", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "ANALYSIS_COMPLETED"
    assert "request_id" in data
    assert len(data["request_id"]) > 10
    assert data["ipo"]["company_name"] == "Tata Technologies Ltd"
    
    # Assert all 4 predictions exist and are positive
    preds = data["predictions"]
    for target in ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]:
        assert target in preds
        assert preds[target]["predicted_multiple"] > 0.0


def test_api_contract_strict_response_model_validation():
    """Validate that API response strictly conforms to the IPOAnalysisResponse Pydantic contract."""
    response = client.post("/api/v1/ipo/analyze", json=VALID_PAYLOAD)
    assert response.status_code == 200
    # Validate via Pydantic model constructor (will raise ValidationError if contract breaks)
    validated_response = IPOAnalysisResponse(**response.json())
    assert validated_response.request_id is not None
    assert validated_response.predictions["total_subscription"].predicted_multiple > 0


def test_post_ipo_analyze_invalid_date_format():
    """Verify invalid date format emits structured 400 error."""
    bad_payload = dict(VALID_PAYLOAD)
    bad_payload["ipo_open_date"] = "22-11-2023" # Not YYYY-MM-DD
    response = client.post("/api/v1/ipo/analyze", json=bad_payload)
    assert response.status_code == 400
    err = response.json()
    assert err["error_code"] == "INVALID_IPO_INPUT"
    assert "request_id" in err


def test_post_ipo_analyze_negative_issue_size():
    """Verify negative issue size triggers 422 validation failure."""
    bad_payload = dict(VALID_PAYLOAD)
    bad_payload["issue_size_in_crore"] = -500.0
    response = client.post("/api/v1/ipo/analyze", json=bad_payload)
    assert response.status_code == 422
    err = response.json()
    assert err["error_code"] == "PYDANTIC_VALIDATION_ERROR"
    assert "request_id" in err


def test_post_ipo_analyze_invalid_price_range():
    """Verify price_low > price_high triggers 400 structured error."""
    bad_payload = dict(VALID_PAYLOAD)
    bad_payload["price_low"] = 550.0
    bad_payload["price_high"] = 500.0 # Floor > Cap
    response = client.post("/api/v1/ipo/analyze", json=bad_payload)
    assert response.status_code == 400
    err = response.json()
    assert err["error_code"] == "INVALID_IPO_INPUT"
    assert "cannot exceed" in str(err["details"])


def test_post_ipo_analyze_missing_mandatory_data():
    """Verify missing company_name triggers 422 error."""
    bad_payload = {
        "price_high": 500.0,
        "issue_size_in_crore": 1000.0
        # Missing company_name and ipo_open_date
    }
    response = client.post("/api/v1/ipo/analyze", json=bad_payload)
    assert response.status_code == 422
    err = response.json()
    assert err["error_code"] == "PYDANTIC_VALIDATION_ERROR"


def test_get_api_v1_health():
    """Verify GET /api/v1/health returns system and dependency operational status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    validated = HealthResponse(**data)
    assert validated.status == "HEALTHY"
    assert validated.model_registry_status["total_subscription"] == "LOADED_AND_VERIFIED"
    assert "ipo_connector" in validated.connector_status


def test_get_api_v1_models_metadata():
    """Verify GET /api/v1/models returns model versions, validation, and test metrics."""
    response = client.get("/api/v1/models")
    assert response.status_code == 200
    data = response.json()
    validated = ModelMetadataResponse(**data)
    assert len(validated.models) == 4
    assert validated.training_dataset_observations == 89
    assert validated.quarantined_test_observations == 17


def test_get_api_v1_schema_catalog():
    """Verify GET /api/v1/schema returns full input fields catalog."""
    response = client.get("/api/v1/schema")
    assert response.status_code == 200
    data = response.json()
    assert "fields" in data
    assert data["supported_fields_count"] >= 20
    assert "temporal_rules" in data


def test_root_and_legacy_health_compatibility():
    """Verify that root / and legacy /health endpoints remain fully functional."""
    r_root = client.get("/")
    assert r_root.status_code == 200
    assert "api_v1_endpoints" in r_root.json()
    
    r_health = client.get("/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"
