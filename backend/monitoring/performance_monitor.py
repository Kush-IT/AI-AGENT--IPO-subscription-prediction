"""
Performance Monitor for Tracking Prospective Out-of-Sample Accuracy and Error Metrics.
"""
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, median_absolute_error, r2_score

from backend.monitoring.schemas import (
    PerformanceMetricsReport,
    MetricValues,
)

ROOT_DIR = Path(__file__).parent.parent.parent
COMPLETED_CSV = ROOT_DIR / "data" / "live_predictions" / "completed_predictions.csv"


def calculate_metric_values(y_true: np.ndarray, y_pred: np.ndarray) -> MetricValues:
    """Calculate MAE, RMSE, MedianAE, and R2 safely with sample count."""
    n = len(y_true)
    if n == 0:
        return MetricValues(sample_count=0)
    
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    med_ae = float(median_absolute_error(y_true, y_pred))
    
    # R2 requires at least 2 distinct points and non-zero variance
    if n >= 2 and np.var(y_true) > 1e-8:
        r2 = float(r2_score(y_true, y_pred))
    else:
        r2 = None

    return MetricValues(
        mae=round(mae, 2),
        rmse=round(rmse, 2),
        median_ae=round(med_ae, 2),
        r2_score=round(r2, 4) if r2 is not None else None,
        sample_count=n,
    )


def compute_performance_report() -> PerformanceMetricsReport:
    """
    Compute comprehensive metrics across all prospective predictions with attached actual outcomes.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    if not COMPLETED_CSV.exists():
        empty_metrics = MetricValues(sample_count=0)
        return PerformanceMetricsReport(
            sample_count=0,
            total_metrics=empty_metrics,
            qib_metrics=empty_metrics,
            nii_metrics=empty_metrics,
            retail_metrics=empty_metrics,
            category_recommendation_accuracy_pct=None,
            confidence_error_breakdown={},
            evaluation_timestamp=now_iso,
        )

    df = pd.read_csv(COMPLETED_CSV)
    n = len(df)
    if n == 0:
        empty_metrics = MetricValues(sample_count=0)
        return PerformanceMetricsReport(
            sample_count=0,
            total_metrics=empty_metrics,
            qib_metrics=empty_metrics,
            nii_metrics=empty_metrics,
            retail_metrics=empty_metrics,
            category_recommendation_accuracy_pct=None,
            confidence_error_breakdown={},
            evaluation_timestamp=now_iso,
        )

    total_m = calculate_metric_values(df["actual_total"].to_numpy(), df["predicted_total"].to_numpy())
    qib_m = calculate_metric_values(df["actual_qib"].to_numpy(), df["predicted_qib"].to_numpy())
    nii_m = calculate_metric_values(df["actual_nii"].to_numpy(), df["predicted_nii"].to_numpy())
    retail_m = calculate_metric_values(df["actual_retail"].to_numpy(), df["predicted_retail"].to_numpy())

    # Category accuracy
    if "category_prediction_correct" in df.columns:
        cat_acc = float(df["category_prediction_correct"].mean() * 100.0)
    else:
        cat_acc = None

    # Confidence breakdown
    conf_breakdown = {}
    if "confidence_level" in df.columns:
        for level in ["HIGH", "MEDIUM", "LOW"]:
            sub_df = df[df["confidence_level"] == level]
            if len(sub_df) > 0:
                conf_breakdown[level] = {
                    "count": int(len(sub_df)),
                    "mean_total_mae": round(float(sub_df["total_absolute_error"].mean()), 2),
                    "mean_qib_mae": round(float(sub_df["qib_absolute_error"].mean()), 2),
                }

    return PerformanceMetricsReport(
        sample_count=n,
        total_metrics=total_m,
        qib_metrics=qib_m,
        nii_metrics=nii_m,
        retail_metrics=retail_m,
        category_recommendation_accuracy_pct=round(cat_acc, 2) if cat_acc is not None else None,
        confidence_error_breakdown=conf_breakdown,
        evaluation_timestamp=now_iso,
    )
