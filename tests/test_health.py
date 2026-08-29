"""
Health Check and Root Endpoint Tests
"""
from fastapi.testclient import TestClient
from backend.main import app
from backend.config import settings

client = TestClient(app)


def test_root_endpoint():
    """Verify that the root endpoint responds with 200 and valid status info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == settings.PROJECT_NAME
    assert data["version"] == settings.VERSION
    assert data["status"] == "online"
    assert "docs_url" in data
    assert "health_url" in data


def test_health_check_endpoint():
    """Verify that the /health endpoint returns healthy status and metadata."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["project"] == settings.PROJECT_NAME
    assert data["version"] == settings.VERSION
    assert data["environment"] == settings.ENVIRONMENT
    assert "timestamp" in data
    assert "disclaimer" in data
    assert "Research and decision-support system" in data["disclaimer"]
