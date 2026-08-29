"""
Append-Only Prediction Logger & Audit Trail Manager for Prospective IPOs.
Guarantees immutability of original predictions and isolates actual post-close outcomes.
"""
from pathlib import Path
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import pandas as pd

from backend.monitoring.schemas import (
    ProspectivePredictionRecord,
    ActualIPOOutcome,
    PredictionStatus,
    PredictionErrorRecord,
)
from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    compute_feature_snapshot_hash,
    validate_prospective_timestamps,
    validate_outcome_timestamp,
    ModelIntegrityError,
)

ROOT_DIR = Path(__file__).parent.parent.parent
LIVE_PRED_DIR = ROOT_DIR / "data" / "live_predictions"
LIVE_PRED_DIR.mkdir(parents=True, exist_ok=True)

PREDICTIONS_CSV = LIVE_PRED_DIR / "predictions.csv"
COMPLETED_CSV = LIVE_PRED_DIR / "completed_predictions.csv"
PROSPECTIVE_VAL_CSV = LIVE_PRED_DIR / "prospective_validation.csv"
AUDIT_LOG_JSONL = LIVE_PRED_DIR / "prediction_audit.jsonl"


def log_audit_event(event_type: str, prediction_id: str, details: Dict[str, Any]) -> None:
    """Append audit event to JSONL ledger."""
    event = {
        "event": event_type,
        "prediction_id": prediction_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **details,
    }
    with open(AUDIT_LOG_JSONL, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def create_prediction_record(
    company_name: str,
    ipo_open_date: str,
    predicted_total: float,
    predicted_qib: float,
    predicted_nii: float,
    predicted_retail: float,
    recommended_category: str,
    confidence_score: int,
    confidence_level: str,
    risk_level: str,
    data_quality_score: int,
    data_quality_tier: str,
    feature_snapshot: Dict[str, Any],
    ipo_close_date: Optional[str] = None,
    prediction_timestamp: Optional[str] = None,
    feature_cutoff: Optional[str] = None,
) -> ProspectivePredictionRecord:
    """
    Construct a new immutable ProspectivePredictionRecord after checking model SHA-256 integrity.
    """
    # 1. Model Integrity Check
    try:
        _, current_hashes = verify_model_integrity()
    except ModelIntegrityError as e:
        log_audit_event("MODEL_INTEGRITY_FAILED", "N/A", {"error": str(e)})
        raise e

    # 2. Timestamps
    pred_ts = prediction_timestamp or datetime.now(timezone.utc).isoformat()
    cutoff_ts = feature_cutoff or f"{ipo_open_date}T09:59:59+05:30"
    
    # 3. Temporal Validation Check
    is_valid_time, time_msg = validate_prospective_timestamps(ipo_open_date, pred_ts, cutoff_ts)
    temporal_status = "EX_ANTE_COMPLIANT" if is_valid_time else "TEMPORAL_REJECTED"

    # 4. Snapshot Hash
    snapshot_hash = compute_feature_snapshot_hash(feature_snapshot)
    pred_id = str(uuid.uuid4())

    record = ProspectivePredictionRecord(
        prediction_id=pred_id,
        company_name=company_name,
        ipo_open_date=ipo_open_date,
        ipo_close_date=ipo_close_date,
        prediction_timestamp=pred_ts,
        feature_cutoff=cutoff_ts,
        predicted_total_subscription=round(float(predicted_total), 2),
        predicted_qib_subscription=round(float(predicted_qib), 2),
        predicted_nii_subscription=round(float(predicted_nii), 2),
        predicted_retail_subscription=round(float(predicted_retail), 2),
        recommended_category=recommended_category,
        confidence_score=int(confidence_score),
        confidence_level=confidence_level,
        risk_level=risk_level,
        data_quality_score=int(data_quality_score),
        data_quality_tier=data_quality_tier,
        temporal_validation_status=temporal_status,
        model_registry_version="1.0.0-final-candidates",
        total_model_name="XGBoost (log1p)",
        qib_model_name="Random Forest (RAW)",
        nii_model_name="LightGBM (log1p)",
        retail_model_name="XGBoost (RAW)",
        feature_snapshot_hash=snapshot_hash,
        model_artifact_hash=current_hashes,
        prediction_status=PredictionStatus.AWAITING_OUTCOME if is_valid_time else PredictionStatus.VALIDATION_FAILED,
        feature_snapshot=feature_snapshot,
    )

    log_audit_event("PREDICTION_CREATED", pred_id, {
        "company_name": company_name,
        "feature_cutoff": cutoff_ts,
        "feature_snapshot_hash": snapshot_hash,
        "temporal_validation_status": temporal_status,
    })

    return record


def save_prediction(record: ProspectivePredictionRecord) -> None:
    """Append prediction record to predictions.csv."""
    row_dict = record.model_dump(exclude={"feature_snapshot", "model_artifact_hash"})
    # Convert model_artifact_hash into json string for flat storage
    row_dict["model_artifact_hashes_json"] = json.dumps(record.model_artifact_hash)
    row_dict["feature_snapshot_json"] = json.dumps(record.feature_snapshot or {})

    df_new = pd.DataFrame([row_dict])
    if PREDICTIONS_CSV.exists():
        df_existing = pd.read_csv(PREDICTIONS_CSV)
        # Avoid duplicate prediction_id
        if record.prediction_id in df_existing["prediction_id"].values:
            return
        df_combined = pd.concat([df_existing, df_new], ignore_index=True)
    else:
        df_combined = df_new

    df_combined.to_csv(PREDICTIONS_CSV, index=False)
    log_audit_event("PREDICTION_SAVED", record.prediction_id, {"status": str(record.prediction_status)})


def _clean_row_dict(row: Dict[str, Any]) -> Dict[str, Any]:
    """Clean pandas row dict by converting NaNs to None and deserializing JSON columns."""
    clean = dict(row)
    for k, v in list(clean.items()):
        if pd.isna(v):
            clean[k] = None
    if "model_artifact_hashes_json" in clean and isinstance(clean["model_artifact_hashes_json"], str):
        try:
            clean["model_artifact_hash"] = json.loads(clean["model_artifact_hashes_json"])
        except Exception:
            clean["model_artifact_hash"] = {}
    if "feature_snapshot_json" in clean and isinstance(clean["feature_snapshot_json"], str):
        try:
            clean["feature_snapshot"] = json.loads(clean["feature_snapshot_json"])
        except Exception:
            clean["feature_snapshot"] = {}
    return clean


def load_prediction(prediction_id: str) -> Optional[ProspectivePredictionRecord]:
    """Retrieve an existing prospective prediction by UUID."""
    if not PREDICTIONS_CSV.exists():
        return None
    df = pd.read_csv(PREDICTIONS_CSV)
    match = df[df["prediction_id"] == prediction_id]
    if match.empty:
        return None
    
    clean_row = _clean_row_dict(match.iloc[0].to_dict())
    return ProspectivePredictionRecord(**clean_row)


def list_predictions(status_filter: Optional[PredictionStatus] = None) -> List[ProspectivePredictionRecord]:
    """List all logged predictions, optionally filtered by lifecycle status."""
    if not PREDICTIONS_CSV.exists():
        return []
    df = pd.read_csv(PREDICTIONS_CSV)
    if status_filter:
        df = df[df["prediction_status"] == status_filter.value]
        
    records = []
    for _, row in df.iterrows():
        clean_row = _clean_row_dict(row.to_dict())
        try:
            records.append(ProspectivePredictionRecord(**clean_row))
        except Exception:
            continue
    return records


def attach_actual_outcome(outcome: ActualIPOOutcome) -> PredictionErrorRecord:
    """
    Attach verified exchange outcome to an existing prospective prediction,
    compute prediction errors, and update persistence files.
    """
    pred_record = load_prediction(outcome.prediction_id)
    if not pred_record:
        raise ValueError(f"Prediction ID '{outcome.prediction_id}' not found in predictions registry.")

    # Validate outcome timestamp strictly after prediction timestamp
    is_valid_time, time_msg = validate_outcome_timestamp(
        pred_record.prediction_timestamp, outcome.outcome_observed_at
    )
    if not is_valid_time:
        raise ValueError(f"Temporal sequence error: {time_msg}")

    # Determine actual strongest category
    actual_cats = {
        "QIB": outcome.actual_qib_subscription,
        "NII": outcome.actual_nii_subscription,
        "RETAIL": outcome.actual_retail_subscription,
    }
    sorted_actual = sorted(actual_cats.items(), key=lambda x: x[1], reverse=True)
    actual_best = sorted_actual[0][0]

    # Category prediction correct?
    if pred_record.recommended_category == "NO_CLEAR_EDGE":
        # If model predicted parity, correct if top 2 actual are within 15%
        edge = (sorted_actual[0][1] - sorted_actual[1][1]) / (sorted_actual[1][1] if sorted_actual[1][1] > 0 else 1.0)
        is_category_correct = edge < 0.15
    else:
        is_category_correct = pred_record.recommended_category == actual_best

    # Calculate absolute and signed errors
    tot_abs = abs(pred_record.predicted_total_subscription - outcome.actual_total_subscription)
    qib_abs = abs(pred_record.predicted_qib_subscription - outcome.actual_qib_subscription)
    nii_abs = abs(pred_record.predicted_nii_subscription - outcome.actual_nii_subscription)
    ret_abs = abs(pred_record.predicted_retail_subscription - outcome.actual_retail_subscription)

    tot_sgn = pred_record.predicted_total_subscription - outcome.actual_total_subscription
    qib_sgn = pred_record.predicted_qib_subscription - outcome.actual_qib_subscription
    nii_sgn = pred_record.predicted_nii_subscription - outcome.actual_nii_subscription
    ret_sgn = pred_record.predicted_retail_subscription - outcome.actual_retail_subscription

    error_rec = PredictionErrorRecord(
        prediction_id=pred_record.prediction_id,
        company_name=pred_record.company_name,
        ipo_open_date=pred_record.ipo_open_date,
        predicted_total=pred_record.predicted_total_subscription,
        predicted_qib=pred_record.predicted_qib_subscription,
        predicted_nii=pred_record.predicted_nii_subscription,
        predicted_retail=pred_record.predicted_retail_subscription,
        actual_total=outcome.actual_total_subscription,
        actual_qib=outcome.actual_qib_subscription,
        actual_nii=outcome.actual_nii_subscription,
        actual_retail=outcome.actual_retail_subscription,
        total_absolute_error=round(tot_abs, 2),
        qib_absolute_error=round(qib_abs, 2),
        nii_absolute_error=round(nii_abs, 2),
        retail_absolute_error=round(ret_abs, 2),
        total_signed_error=round(tot_sgn, 2),
        qib_signed_error=round(qib_sgn, 2),
        nii_signed_error=round(nii_sgn, 2),
        retail_signed_error=round(ret_sgn, 2),
        recommended_category=pred_record.recommended_category,
        actual_best_category=actual_best,
        category_prediction_correct=is_category_correct,
        confidence_score=pred_record.confidence_score,
        confidence_level=pred_record.confidence_level,
        risk_level=pred_record.risk_level,
        prediction_timestamp=pred_record.prediction_timestamp,
        feature_cutoff=pred_record.feature_cutoff,
        outcome_observed_at=outcome.outcome_observed_at,
        data_quality_score=pred_record.data_quality_score,
        temporal_validation_status=pred_record.temporal_validation_status,
        model_registry_version=pred_record.model_registry_version,
    )

    # 1. Update predictions.csv status to OUTCOME_RECORDED
    if PREDICTIONS_CSV.exists():
        df_p = pd.read_csv(PREDICTIONS_CSV)
        df_p.loc[df_p["prediction_id"] == outcome.prediction_id, "prediction_status"] = PredictionStatus.OUTCOME_RECORDED.value
        df_p.to_csv(PREDICTIONS_CSV, index=False)

    # 2. Append to completed_predictions.csv and prospective_validation.csv
    err_df = pd.DataFrame([error_rec.model_dump()])
    if COMPLETED_CSV.exists():
        df_c = pd.read_csv(COMPLETED_CSV)
        if outcome.prediction_id not in df_c["prediction_id"].values:
            df_c = pd.concat([df_c, err_df], ignore_index=True)
            df_c.to_csv(COMPLETED_CSV, index=False)
    else:
        err_df.to_csv(COMPLETED_CSV, index=False)

    # Export consolidated prospective validation dataset (deduplicated)
    if PROSPECTIVE_VAL_CSV.exists():
        df_pv = pd.read_csv(PROSPECTIVE_VAL_CSV)
        if outcome.prediction_id not in df_pv["prediction_id"].values:
            df_pv = pd.concat([df_pv, err_df], ignore_index=True)
            df_pv.to_csv(PROSPECTIVE_VAL_CSV, index=False)
    else:
        err_df.to_csv(PROSPECTIVE_VAL_CSV, index=False)

    log_audit_event("OUTCOME_ATTACHED", outcome.prediction_id, {
        "actual_total": outcome.actual_total_subscription,
        "total_absolute_error": error_rec.total_absolute_error,
        "category_prediction_correct": is_category_correct,
    })

    return error_rec
