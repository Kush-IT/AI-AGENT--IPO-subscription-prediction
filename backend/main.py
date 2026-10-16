"""
FastAPI Application Entrypoint
Pre-IPO Subscription Forecasting & Agentic AI Decision System
"""
from contextlib import asynccontextmanager
import uuid
import time
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.config import settings
from backend.routers import health, monitoring_routes, intelligence_routes
from backend.api import v1_routes
from backend.api.observability import METRICS, log_structured


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for backend startup and shutdown."""
    print(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")
    from backend.monitoring.hourly_refresh import get_hourly_refresh_service
    refresh_service = get_hourly_refresh_service()
    refresh_service.start()
    try:
        yield
    finally:
        print(f"Shutting down {settings.PROJECT_NAME}")
        await refresh_service.stop()


app = FastAPI(
    title="Pre-IPO Subscription Forecasting API",
    description=(
        "Production-grade Decision Support System combining Machine Learning, "
        "SHAP Additive Feature Attributions, and Agentic AI Orchestration "
        "for Category-Wise Indian Mainboard IPO Forecasting."
    ),
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list if settings.cors_origin_list else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Structured Error Handlers (No raw stack traces exposed to clients)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = str(uuid.uuid4())
    METRICS.record_request(request.url.path, 422, 0.0, is_success=False)
    log_structured("REQUEST_VALIDATION_ERROR", request_id, request.url.path, 422, 0.0, extra={"errors": exc.errors()})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "request_id": request_id,
            "error_code": "PYDANTIC_VALIDATION_ERROR",
            "message": "Input payload failed schema validation.",
            "details": {"validation_errors": exc.errors()}
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    request_id = str(uuid.uuid4())
    detail_payload = exc.detail if isinstance(exc.detail, dict) else {"message": str(exc.detail)}
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "request_id": detail_payload.get("request_id", request_id),
            "error_code": detail_payload.get("error_code", f"HTTP_{exc.status_code}"),
            "message": detail_payload.get("message", "An HTTP error occurred."),
            "details": detail_payload.get("details", {})
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    request_id = str(uuid.uuid4())
    METRICS.record_request(request.url.path, 500, 0.0, is_success=False)
    log_structured("INTERNAL_SERVER_ERROR", request_id, request.url.path, 500, 0.0, extra={"error": str(exc)})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "request_id": request_id,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected internal server error occurred.",
            "details": {"exception_type": type(exc).__name__}
        }
    )


# Register route modules
app.include_router(health.router)
app.include_router(v1_routes.router)
app.include_router(monitoring_routes.router)
app.include_router(intelligence_routes.router)


@app.get("/", tags=["Root"])
async def root():
    """Root welcoming endpoint with sitemap links."""
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/health",
        "redoc_url": "/redoc",
        "api_v1_endpoints": {
            "analyze": "/api/v1/ipo/analyze",
            "health": "/api/v1/health",
            "models": "/api/v1/models",
            "schema": "/api/v1/schema",
            "monitoring_summary": "/api/v1/monitoring/summary",
            "monitoring_predictions": "/api/v1/monitoring/predictions",
            "monitoring_performance": "/api/v1/monitoring/performance",
            "monitoring_drift": "/api/v1/monitoring/drift",
        },
        "message": "Welcome to the Pre-IPO Subscription Forecasting Engine."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
