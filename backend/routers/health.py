"""
Health Check Router
Provides system status, uptime information, and environment configuration.
"""
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from backend.config import settings

router = APIRouter(tags=["Health & Status"])


class HealthResponse(BaseModel):
    status: str
    project: str
    version: str
    environment: str
    timestamp: str
    disclaimer: str


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify backend service availability.
    """
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).isoformat(),
        disclaimer="Research and decision-support system. Predictions are statistical forecasts, not financial advice."
    )
