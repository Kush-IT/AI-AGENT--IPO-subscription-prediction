"""
FastAPI Route Module for Agentic AI IPO Analysis Orchestration.
Exposes POST /api/v1/ipo/analyze endpoint.
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

from backend.agents.state import IPOInputSchema
from backend.agents.graph import run_ipo_analysis

router = APIRouter(prefix="/api/v1/ipo", tags=["Agentic IPO Analysis"])


@router.post(
    "/analyze",
    summary="Execute Agentic AI IPO Analysis",
    description="Orchestrates ex-ante data validation, feature generation, ML forecasting, SHAP attribution, category comparison, and risk audit.",
    response_model=Dict[str, Any]
)
async def analyze_ipo(request: IPOInputSchema):
    """
    Executes the multi-agent LangGraph workflow on the given IPO parameters.
    """
    try:
        input_data = request.model_dump()
        report = run_ipo_analysis(input_data)
        
        if report.get("status") == "VALIDATION_FAILED":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=report
            )
            
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agentic orchestration encountered an internal error: {str(e)}"
        )
