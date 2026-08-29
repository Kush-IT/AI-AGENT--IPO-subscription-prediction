"""
Cumulative Prospective Metrics Engine.
Computes multi-IPO aggregated forecasting metrics across out-of-sample forward-validation IPOs.
"""
from typing import Dict, Any, Optional
from pathlib import Path
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, median_absolute_error

ROOT_DIR = Path(__file__).parent.parent.parent
COMPLETED_CSV = ROOT_DIR / "data" / "live_predictions" / "completed_predictions.csv"
REGISTRY_CSV = ROOT_DIR / "data" / "live_predictions" / "prospective_ipo_registry.csv"


def calculate_target_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
    """Compute MAE, RMSE, MedianAE, MAPE, and signed bias for a single target array."""
    n = len(y_true)
    if n == 0:
        return {
            "sample_count": 0,
            "mae": None,
            "rmse": None,
            "median_ae": None,
            "mape": None,
            "mean_signed_bias": None,
            "median_signed_bias": None,
        }

    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    med_ae = float(median_absolute_error(y_true, y_pred))
    
    # MAPE (where actual > 0)
    valid_mask = y_true > 0
    if np.any(valid_mask):
        mape = float(np.mean(np.abs(y_true[valid_mask] - y_pred[valid_mask]) / y_true[valid_mask]) * 100.0)
    else:
        mape = None

    signed_errors = y_pred - y_true
    mean_bias = float(np.mean(signed_errors))
    median_bias = float(np.median(signed_errors))

    return {
        "sample_count": n,
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "median_ae": round(med_ae, 2),
        "mape": round(mape, 2) if mape is not None else None,
        "mean_signed_bias": round(mean_bias, 2),
        "median_signed_bias": round(median_bias, 2),
    }


def compute_cumulative_prospective_metrics() -> Dict[str, Any]:
    """
    Compute comprehensive metrics across all completed prospective forward-validation IPOs.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    if not COMPLETED_CSV.exists():
        return {
            "number_of_completed_ipos": 0,
            "status": "NO_COMPLETED_PROSPECTIVE_IPOS",
            "evaluation_timestamp": now_iso,
        }

    df = pd.read_csv(COMPLETED_CSV)
    n = len(df)
    if n == 0:
        return {
            "number_of_completed_ipos": 0,
            "status": "NO_COMPLETED_PROSPECTIVE_IPOS",
            "evaluation_timestamp": now_iso,
        }

    total_metrics = calculate_target_metrics(df["actual_total"].to_numpy(), df["predicted_total"].to_numpy())
    qib_metrics = calculate_target_metrics(df["actual_qib"].to_numpy(), df["predicted_qib"].to_numpy())
    nii_metrics = calculate_target_metrics(df["actual_nii"].to_numpy(), df["predicted_nii"].to_numpy())
    retail_metrics = calculate_target_metrics(df["actual_retail"].to_numpy(), df["predicted_retail"].to_numpy())

    # Category Accuracy
    if "category_prediction_correct" in df.columns:
        cat_acc = float(df["category_prediction_correct"].mean() * 100.0)
    else:
        cat_acc = None

    # Confidence Calibration Breakdown
    confidence_breakdown = {}
    if "confidence_level" in df.columns:
        for level in ["HIGH", "MEDIUM", "LOW"]:
            sub = df[df["confidence_level"] == level]
            if len(sub) > 0:
                sub_valid = sub["actual_total"] > 0
                sub_mape = float(np.mean(np.abs(sub.loc[sub_valid, "actual_total"] - sub.loc[sub_valid, "predicted_total"]) / sub.loc[sub_valid, "actual_total"]) * 100.0) if np.any(sub_valid) else 0.0
                confidence_breakdown[level] = {
                    "count": int(len(sub)),
                    "mean_mae": round(float(sub["total_absolute_error"].mean()), 2),
                    "mean_mape_pct": round(sub_mape, 2),
                    "category_accuracy_pct": round(float(sub["category_prediction_correct"].mean() * 100.0), 2) if "category_prediction_correct" in sub.columns else None,
                }

    return {
        "number_of_completed_ipos": n,
        "total_metrics": total_metrics,
        "qib_metrics": qib_metrics,
        "nii_metrics": nii_metrics,
        "retail_metrics": retail_metrics,
        "category_recommendation_accuracy_pct": round(cat_acc, 2) if cat_acc is not None else None,
        "confidence_calibration": confidence_breakdown,
        "evaluation_timestamp": now_iso,
        "governance_note": f"Cumulative evaluation over N={n} prospective forward-validation Mainboard IPOs.",
    }
