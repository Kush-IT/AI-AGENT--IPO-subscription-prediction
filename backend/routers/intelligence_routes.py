"""
FastAPI Route Module: Live 15-Day IPO Intelligence & Forecasting Endpoints.
Serves rolling 15-day retrospective performance, 15-day ex-ante forecasts,
indicative GMP tracking, implied listing prices, and verified source provenance.
"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, status

from backend.schemas.intelligence_schemas import (
    UpcomingIPOForecast,
    PastIPOResult,
    MarketOverviewSummary,
    IPODeepDiveResponse,
    SourcesHealthResponse,
)
from backend.monitoring.ipo_intelligence import (
    get_last_15_days_ipos,
    get_next_15_days_ipos,
    get_active_open_ipos,
    get_market_overview,
    get_ipo_deep_dive,
)
from backend.connectors.live_ipo_discovery import LiveIPODiscoveryService

router = APIRouter(prefix="/api/v1/ipo", tags=["Live IPO Intelligence & Forecasting"])


@router.get(
    "/sources/health",
    response_model=SourcesHealthResponse,
    summary="Get Health and Freshness of Upstream Data Sources",
    description="Returns availability, latency, cache freshness, and stale state for NSE and IPOWatch feeds."
)
def api_get_sources_health():
    try:
        return LiveIPODiscoveryService().get_sources_health()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "SOURCES_HEALTH_ERROR", "message": str(exc)}
        )


@router.get(
    "/overview",
    response_model=MarketOverviewSummary,
    summary="Get 30-Day Market Overview & Momentum Indicators",
    description="Returns aggregate statistics for the 30-day window around reference_date."
)
def api_get_market_overview(
    reference_date: Optional[str] = Query(None, description="Reference date YYYY-MM-DD (defaults to today)"),
    force_refresh: bool = Query(False, description="Bypass cache and force live fetch from web sources"),
    include_test_records: bool = Query(False, description="Include test/fixture records (for unit testing)"),
):
    try:
        return get_market_overview(
            reference_date=reference_date,
            force_refresh=force_refresh,
            include_test_records=include_test_records,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "MARKET_OVERVIEW_ERROR", "message": str(exc)}
        )


@router.get(
    "/last-15-days",
    response_model=List[PastIPOResult],
    summary="Get Sourced Performance for IPOs in Trailing 15 Days",
    description="Returns verified subscription outcomes, listing metrics, and ex-ante prediction error for IPOs in [T-15d, T]."
)
def api_get_last_15_days(
    reference_date: Optional[str] = Query(None, description="Reference date YYYY-MM-DD (defaults to today)"),
    include_test_records: bool = Query(False, description="Include test/fixture records (for unit testing)"),
):
    try:
        return get_last_15_days_ipos(
            reference_date=reference_date,
            include_test_records=include_test_records,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "LAST_15_DAYS_QUERY_ERROR", "message": str(exc)}
        )


@router.get(
    "/next-15-days",
    response_model=List[UpcomingIPOForecast],
    summary="Get Ex-Ante Forecasts for IPOs in Upcoming 15 Days",
    description="Returns statutory terms, ex-ante predicted multiples, indicative GMP, and implied listing price for IPOs in [T, T+15d]."
)
def api_get_next_15_days(
    reference_date: Optional[str] = Query(None, description="Reference date YYYY-MM-DD (defaults to today)"),
    force_refresh: bool = Query(False, description="Bypass cache and force live fetch from web sources"),
    include_test_records: bool = Query(False, description="Include test/fixture records (for unit testing)"),
):
    try:
        return get_next_15_days_ipos(
            reference_date=reference_date,
            force_refresh=force_refresh,
            include_test_records=include_test_records,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "NEXT_15_DAYS_QUERY_ERROR", "message": str(exc)}
        )


@router.get(
    "/active-open",
    response_model=List[UpcomingIPOForecast],
    summary="Get IPOs Currently Active & Open for Bidding",
    description="Returns IPOs currently open on Indian exchanges (open_date <= T <= close_date) with live NSE tallies and ex-ante forecasts."
)
def api_get_active_open(
    reference_date: Optional[str] = Query(None, description="Reference date YYYY-MM-DD (defaults to today)"),
    force_refresh: bool = Query(False, description="Bypass cache and force live fetch from web sources"),
    include_test_records: bool = Query(False, description="Include test/fixture records (for unit testing)"),
):
    try:
        return get_active_open_ipos(
            reference_date=reference_date,
            force_refresh=force_refresh,
            include_test_records=include_test_records,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "ACTIVE_OPEN_QUERY_ERROR", "message": str(exc)}
        )


@router.get(
    "/{ipo_id}",
    response_model=IPODeepDiveResponse,
    summary="Get Detailed IPO Intelligence & Timeline",
    description="Returns drill-down specifications, timeline events, feature snapshot, and source provenance for a specific IPO."
)
def api_get_ipo_deep_dive(ipo_id: str):
    try:
        return get_ipo_deep_dive(ipo_id)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "IPO_NOT_FOUND", "message": str(val_err)}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "IPO_DEEP_DIVE_ERROR", "message": str(exc)}
        )


@router.get(
    "/{ipo_id}/prediction",
    summary="Get Ex-Ante Prospective Prediction Breakdown",
    description="Returns category subscription multiples, TreeSHAP attributions, confidence, and risk for a specific IPO."
)
def api_get_ipo_prediction(ipo_id: str):
    try:
        dive = get_ipo_deep_dive(ipo_id)
        return {
            "ipo_id": ipo_id,
            "company_name": dive.card.company_name,
            "forecast": dive.forecast,
            "past_result": dive.past_result,
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "IPO_NOT_FOUND", "message": str(val_err)}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "IPO_PREDICTION_ERROR", "message": str(exc)}
        )


@router.get(
    "/{ipo_id}/sources",
    summary="Get Verified Field-Level Data Provenance",
    description="Returns authoritative sources, URLs, timestamps, and confidence ratings for all fields."
)
def api_get_ipo_sources(ipo_id: str):
    try:
        dive = get_ipo_deep_dive(ipo_id)
        return {
            "ipo_id": ipo_id,
            "company_name": dive.card.company_name,
            "source_provenance": dive.source_provenance,
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "IPO_NOT_FOUND", "message": str(val_err)}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "IPO_SOURCES_ERROR", "message": str(exc)}
        )


@router.get(
    "/{ipo_id}/history",
    summary="Get Chronological Lifecycle Milestones",
    description="Returns timestamps and completion status for discovery, pre-open snapshot, bidding, and allotment."
)
def api_get_ipo_history(ipo_id: str):
    try:
        dive = get_ipo_deep_dive(ipo_id)
        return {
            "ipo_id": ipo_id,
            "company_name": dive.card.company_name,
            "timeline": dive.timeline,
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "IPO_NOT_FOUND", "message": str(val_err)}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "IPO_HISTORY_ERROR", "message": str(exc)}
        )
