"""
Generic Outcome Collection & Post-Close Evaluation Module.
Ingests official closing outcomes, verifies post-close temporal precedence,
computes category errors, and updates registry status.
"""
from typing import Dict, Any, Optional
from pathlib import Path
import json
from datetime import datetime, timezone
import pandas as pd

from backend.monitoring.prediction_logger import (
    load_prediction,
    attach_actual_outcome,
)
from backend.monitoring.schemas import ActualIPOOutcome
from backend.monitoring.ipo_discovery import update_ipo_status, load_registry, IPOLifecycleStatus

ROOT_DIR = Path(__file__).parent.parent.parent
LIVE_PRED_DIR = ROOT_DIR / "data" / "live_predictions"


def collect_and_attach_outcome(
    ipo_id: str,
    actual_total: float,
    actual_qib: float,
    actual_nii: float,
    actual_retail: float,
    outcome_source: str = "NSE",
    outcome_source_url: Optional[str] = None,
    outcome_observed_at: Optional[str] = None,
    ipo_close_date: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Attach verified exchange outcome for any prospective IPO in the registry.
    """
    df = load_registry()
    match = df[df["ipo_id"] == ipo_id]
    if match.empty:
        raise ValueError(f"IPO ID '{ipo_id}' not found in prospective registry.")

    row = match.iloc[0]
    pred_id = row.get("prediction_id")
    if not pred_id or pd.isna(pred_id):
        raise ValueError(f"No prediction recorded for IPO ID '{ipo_id}'.")

    company_name = row["company_name"]
    close_dt = ipo_close_date or row["ipo_close_date"]
    obs_time = outcome_observed_at or datetime.now(timezone.utc).isoformat()

    outcome_obj = ActualIPOOutcome(
        prediction_id=pred_id,
        company_name=company_name,
        ipo_close_date=close_dt,
        actual_total_subscription=float(actual_total),
        actual_qib_subscription=float(actual_qib),
        actual_nii_subscription=float(actual_nii),
        actual_retail_subscription=float(actual_retail),
        outcome_source=outcome_source,
        outcome_source_url=outcome_source_url,
        outcome_observed_at=obs_time,
        outcome_validation_status="VERIFIED_EXCHANGE_OUTCOME",
    )

    # Attach outcome and compute errors
    error_rec = attach_actual_outcome(outcome_obj)

    # Update registry
    update_ipo_status(
        ipo_id,
        IPOLifecycleStatus.COMPLETED,
        outcome_timestamp=obs_time,
    )

    # Save to IPO directory
    ipo_dir = LIVE_PRED_DIR / ipo_id
    ipo_dir.mkdir(parents=True, exist_ok=True)

    outcome_payload = {
        "prediction_id": pred_id,
        "company_name": company_name,
        "ipo_close_date": close_dt,
        "outcome_source": outcome_source,
        "outcome_source_url": outcome_source_url,
        "outcome_observed_at": obs_time,
        "actual_subscriptions": {
            "total_subscription": float(actual_total),
            "qib_subscription": float(actual_qib),
            "nii_subscription": float(actual_nii),
            "retail_subscription": float(actual_retail),
        },
    }
    with open(ipo_dir / "actual_outcome.json", "w", encoding="utf-8") as f:
        json.dump(outcome_payload, f, indent=2)

    total_ape = round(abs(error_rec.predicted_total - actual_total) / actual_total * 100, 2) if actual_total > 0 else 0.0

    eval_payload = {
        "prediction_id": pred_id,
        "company_name": company_name,
        "evaluation_timestamp": datetime.now(timezone.utc).isoformat(),
        "total_error": error_rec.total_absolute_error,
        "total_ape": total_ape,
        "qib_error": error_rec.qib_absolute_error,
        "nii_error": error_rec.nii_absolute_error,
        "retail_error": error_rec.retail_absolute_error,
        "category_prediction_correct": error_rec.category_prediction_correct,
        "actual_strongest_category": error_rec.actual_best_category,
    }
    with open(ipo_dir / "performance_evaluation.json", "w", encoding="utf-8") as f:
        json.dump(eval_payload, f, indent=2)

    return eval_payload
