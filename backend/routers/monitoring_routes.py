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


# --- Phase 20 Weekly Rolling Retraining Endpoints ---

from backend.retraining.schemas import (
    RetrainingRunRequest,
    RetrainingRunResponse,
    RetrainingStatus,
)
from backend.retraining.retraining_manager import (
    run_weekly_retraining,
    RESEARCH_RETRAINING_DIR,
)


@router.get("/retraining/status", summary="Get weekly retraining pipeline status")
def get_retraining_status():
    """Returns current retraining pipeline status, production model integrity, and latest candidate metrics."""
    try:
        is_prod_ok, _ = verify_model_integrity()
    except Exception:
        is_prod_ok = False

    latest_run = None
    if RESEARCH_RETRAINING_DIR.exists():
        all_manifests = sorted(
            RESEARCH_RETRAINING_DIR.glob("*/*/manifest.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )
        if all_manifests:
            try:
                with open(all_manifests[0], "r", encoding="utf-8") as f:
                    latest_run = json.load(f)
            except Exception:
                pass

    if latest_run:
        return {
            "current_production_model": "1.0.0-final-candidates",
            "production_integrity_verified": is_prod_ok,
            "latest_run_id": latest_run.get("run_id"),
            "latest_run_date": latest_run.get("evaluation_date"),
            "latest_status": latest_run.get("status"),
            "latest_candidate": latest_run.get("candidate_metadata"),
            "latest_comparison": latest_run.get("comparison_metrics"),
            "latest_promotion_decision": (
                latest_run.get("promotion_decision", {}).get("decision")
                if latest_run.get("promotion_decision")
                else "KEEP_CURRENT_MODEL"
            ),
            "latest_manifest_path": latest_run.get("manifest_path"),
            "rolling_window_days": 30,
            "minimum_samples": (
                latest_run.get("data_selection", {}).get("minimum_sample_threshold", 10)
                if latest_run.get("data_selection")
                else 10
            ),
        }
    else:
        return {
            "current_production_model": "1.0.0-final-candidates",
            "production_integrity_verified": is_prod_ok,
            "latest_run_id": None,
            "latest_run_date": None,
            "latest_status": "NO_RUN",
            "latest_candidate": None,
            "latest_comparison": None,
            "latest_promotion_decision": "KEEP_CURRENT_MODEL",
            "latest_manifest_path": None,
            "rolling_window_days": 30,
            "minimum_samples": 10,
        }


@router.get("/retraining/history", summary="Get historical weekly retraining runs chronological log")
def get_retraining_history():
    """Scans research/retraining/ and returns chronological history sorted newest first."""
    history = []
    if RESEARCH_RETRAINING_DIR.exists():
        all_manifests = sorted(
            RESEARCH_RETRAINING_DIR.glob("*/*/manifest.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )
        for m_path in all_manifests:
            try:
                with open(m_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                ds = data.get("data_selection", {})
                cand = data.get("candidate_metadata", {})
                history.append({
                    "run_id": data.get("run_id"),
                    "timestamp": data.get("timestamp"),
                    "evaluation_date": data.get("evaluation_date"),
                    "is_dry_run": data.get("is_dry_run"),
                    "status": data.get("status"),
                    "eligible_count": ds.get("eligible_count", 0),
                    "training_sample_count": ds.get("training_sample_count", 0),
                    "validation_sample_count": ds.get("validation_sample_count", 0),
                    "candidate_version": cand.get("model_version") if cand else None,
                    "promotion_decision": (
                        data.get("promotion_decision", {}).get("decision")
                        if data.get("promotion_decision")
                        else "KEEP_CURRENT_MODEL"
                    ),
                    "manifest_path": str(m_path),
                })
            except Exception:
                continue
    return history


@router.post(
    "/retraining/run",
    summary="Execute weekly rolling retraining evaluation or candidate training",
    response_model=RetrainingRunResponse,
)
def run_retraining_endpoint(req: RetrainingRunRequest):
    """Executes the weekly retraining pipeline with dry-run support and returns complete structured response."""
    try:
        response = run_weekly_retraining(request=req)
        if response.status == RetrainingStatus.MODEL_INTEGRITY_VIOLATION:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"error_code": "MODEL_INTEGRITY_VIOLATION", "message": response.message},
            )
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "RETRAINING_FAILED", "message": str(e)},
        )


@router.get(
    "/sources/health",
    summary="Get Health and Freshness of Upstream Data Sources",
    description="Returns availability, latency, cache freshness, and stale state for NSE and IPOWatch feeds."
)
def api_get_monitoring_sources_health():
    try:
        from backend.connectors.live_ipo_discovery import LiveIPODiscoveryService
        return LiveIPODiscoveryService().get_sources_health()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_code": "SOURCES_HEALTH_ERROR", "message": str(exc)}
        )

