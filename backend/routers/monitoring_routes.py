"""
FastAPI Router for Prospective IPO Validation, Prediction Logging, and Monitoring.
Mounted at /api/v1/monitoring.
"""
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query, status

from backend.monitoring.schemas import (
    ProspectivePredictionRecord,
    ActualIPOOutcome,
    PredictionStatus,
    PredictionErrorRecord,
    PerformanceMetricsReport,
    DriftAnalysisReport,
    MonitoringSummaryResponse,
)
from backend.monitoring.prediction_logger import (
    create_prediction_record,
    save_prediction,
    load_prediction,
    list_predictions,
    attach_actual_outcome,
)
from backend.monitoring.performance_monitor import compute_performance_report
from backend.monitoring.drift_detector import analyze_drift
from backend.monitoring.prospective_validator import verify_model_integrity, ModelIntegrityError

router = APIRouter(prefix="/api/v1/monitoring", tags=["Prospective Monitoring"])


@router.post(
    "/predictions",
    response_model=ProspectivePredictionRecord,
    status_code=status.HTTP_201_CREATED,
    summary="Log a new prospective IPO prediction",
    description="Logs an immutable ex-ante prediction before the IPO opens. Validates model integrity and timestamps.",
)
def log_prospective_prediction(record_data: ProspectivePredictionRecord):
    try:
        # Check model integrity
        verify_model_integrity()
        save_prediction(record_data)
        return record_data
    except ModelIntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "MODEL_INTEGRITY_FAILURE", "message": str(e)},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error_code": "PREDICTION_LOGGING_FAILED", "message": str(e)},
        )


@router.get(
    "/predictions",
    response_model=List[ProspectivePredictionRecord],
    summary="List all logged prospective predictions",
    description="Retrieve all logged predictions with optional lifecycle status filtering.",
)
def get_predictions(status_filter: Optional[PredictionStatus] = Query(None, alias="status")):
    return list_predictions(status_filter=status_filter)


@router.get(
    "/predictions/{prediction_id}",
    response_model=ProspectivePredictionRecord,
    summary="Get single prospective prediction by ID",
)
def get_prediction_by_id(prediction_id: str):
    record = load_prediction(prediction_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_code": "PREDICTION_NOT_FOUND", "message": f"Prediction ID '{prediction_id}' not found."},
        )
    return record


@router.post(
    "/predictions/{prediction_id}/outcome",
    response_model=PredictionErrorRecord,
    summary="Attach verified exchange outcome to prediction",
    description="Attaches actual subscription multiples after offering closes and computes prediction error.",
)
def record_actual_outcome(prediction_id: str, outcome: ActualIPOOutcome):
    if outcome.prediction_id != prediction_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error_code": "ID_MISMATCH", "message": "Payload prediction_id does not match URL path."},
        )
    try:
        error_record = attach_actual_outcome(outcome)
        return error_record
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error_code": "OUTCOME_VALIDATION_ERROR", "message": str(ve)},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "ATTACH_OUTCOME_FAILED", "message": str(e)},
        )


@router.get(
    "/performance",
    response_model=PerformanceMetricsReport,
    summary="Get prospective model error metrics",
    description="Computes MAE, RMSE, MedianAE, R2, and category recommendation accuracy over completed outcomes.",
)
def get_performance():
    return compute_performance_report()


@router.get(
    "/drift",
    response_model=DriftAnalysisReport,
    summary="Get input and target distribution drift report",
    description="Computes PSI scores across monitored features and target distributions.",
)
def get_drift():
    return analyze_drift()


@router.get(
    "/summary",
    response_model=MonitoringSummaryResponse,
    summary="Get prospective validation system summary",
    description="Provides aggregate counts, operational readiness status, and model integrity state.",
)
def get_monitoring_summary():
    all_preds = list_predictions()
    completed = [p for p in all_preds if p.prediction_status == PredictionStatus.OUTCOME_RECORDED]
    awaiting = [p for p in all_preds if p.prediction_status == PredictionStatus.AWAITING_OUTCOME]

    try:
        is_integrity_ok, _ = verify_model_integrity()
    except Exception:
        is_integrity_ok = False

    # Status: ACTIVE if outcomes have been collected, READY if ready but awaiting live outcomes
    sys_status = "PROSPECTIVE_VALIDATION_ACTIVE" if len(completed) > 0 else "PROSPECTIVE_VALIDATION_READY"

    perf = compute_performance_report()
    drift = analyze_drift()

    return MonitoringSummaryResponse(
        total_predictions_count=len(all_preds),
        completed_outcomes_count=len(completed),
        awaiting_outcomes_count=len(awaiting),
        system_status=sys_status,
        model_registry_version="1.0.0-final-candidates",
        model_integrity_verified=is_integrity_ok,
        performance_summary={
            "sample_count": perf.sample_count,
            "total_mae": perf.total_metrics.mae,
            "qib_mae": perf.qib_metrics.mae,
            "nii_mae": perf.nii_metrics.mae,
            "retail_mae": perf.retail_metrics.mae,
            "category_accuracy_pct": perf.category_recommendation_accuracy_pct,
        },
        drift_summary={
            "feature_drift_level": drift.overall_feature_drift_level,
            "target_drift_level": drift.overall_target_drift_level,
            "model_status": drift.model_status,
        },
        last_updated_at=datetime.now(timezone.utc).isoformat(),
    )


# --- Phase 18 Generic Multi-IPO Endpoints ---

from backend.monitoring.ipo_discovery import (
    DiscoveredIPO,
    register_ipo,
    list_registered_ipos,
    IPOLifecycleStatus,
)
from backend.monitoring.prospective_data_pipeline import prepare_prospective_ipo
from backend.monitoring.prospective_predictor import generate_prospective_prediction
from backend.monitoring.outcome_collector import collect_and_attach_outcome
from backend.monitoring.prospective_metrics import compute_cumulative_prospective_metrics


@router.get("/registry", summary="List prospective IPO registry entries")
def get_ipo_registry(status: Optional[IPOLifecycleStatus] = None):
    return list_registered_ipos(status_filter=status)


@router.post("/registry/discover", summary="Register newly discovered Mainboard IPO", status_code=status.HTTP_201_CREATED)
def discover_ipo_endpoint(ipo: DiscoveredIPO):
    try:
        entry = register_ipo(ipo)
        return entry
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error_code": "INVALID_IPO_DISCOVERY", "message": str(ve)})


@router.post("/registry/{ipo_id}/prepare", summary="Run prospective feature preparation pipeline")
def prepare_prospective_endpoint(ipo_id: str, raw_input: dict):
    try:
        result = prepare_prospective_ipo(ipo_id, raw_input)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error_code": "DATA_PREPARATION_FAILED", "message": str(e)})


@router.post("/registry/{ipo_id}/predict", summary="Generate prospective ML forecast & SHAP explanation")
def generate_prediction_endpoint(ipo_id: str):
    try:
        pred_res = generate_prospective_prediction(ipo_id)
        return pred_res
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error_code": "PROSPECTIVE_PREDICTION_FAILED", "message": str(e)})


@router.post("/registry/{ipo_id}/outcome", summary="Attach verified exchange outcome to prospective IPO")
def attach_outcome_endpoint(ipo_id: str, payload: dict):
    try:
        res = collect_and_attach_outcome(
            ipo_id=ipo_id,
            actual_total=payload["actual_total_subscription"],
            actual_qib=payload["actual_qib_subscription"],
            actual_nii=payload["actual_nii_subscription"],
            actual_retail=payload["actual_retail_subscription"],
            outcome_source=payload.get("outcome_source", "NSE"),
            outcome_source_url=payload.get("outcome_source_url"),
            outcome_observed_at=payload.get("outcome_observed_at"),
            ipo_close_date=payload.get("ipo_close_date"),
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error_code": "OUTCOME_ATTACHMENT_FAILED", "message": str(e)})


@router.get("/metrics/cumulative", summary="Get cumulative forward-validation performance metrics")
def get_cumulative_metrics():
    return compute_cumulative_prospective_metrics()
