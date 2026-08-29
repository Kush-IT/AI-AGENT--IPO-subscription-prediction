"""
Population Stability Index (PSI) & Distribution Drift Detector.
Monitors input feature and target distribution shifts between historical baseline and prospective IPOs.
"""
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd

from backend.monitoring.schemas import (
    DriftAnalysisReport,
    FeatureDriftStat,
)

ROOT_DIR = Path(__file__).parent.parent.parent
HISTORICAL_FEATURES_CSV = ROOT_DIR / "data" / "processed" / "ipo_features_preipo_v2.csv"
HISTORICAL_TARGETS_CSV = ROOT_DIR / "data" / "processed" / "ipo_targets_v2.csv"
PREDICTIONS_CSV = ROOT_DIR / "data" / "live_predictions" / "predictions.csv"
COMPLETED_CSV = ROOT_DIR / "data" / "live_predictions" / "completed_predictions.csv"

MONITORED_FEATURES = [
    "gmp_percentage",
    "issue_size_in_crore",
    "pe_ratio",
    "india_vix",
    "average_sentiment_score",
    "revenue_latest_cr",
    "revenue_cagr_3yr",
    "price_band_spread_pct",
]


def calculate_psi(baseline: np.ndarray, current: np.ndarray, bins: int = 5) -> float:
    """
    Compute Population Stability Index (PSI) between baseline and current sample distributions.
    PSI < 0.10: Low drift (stable)
    0.10 <= PSI < 0.25: Moderate drift
    PSI >= 0.25: High drift
    """
    # Remove NaNs
    b_clean = baseline[~np.isnan(baseline)]
    c_clean = current[~np.isnan(current)]
    
    if len(b_clean) < 5 or len(c_clean) < 2:
        return 0.0
        
    # Generate quantile bin edges from baseline
    quantiles = np.linspace(0, 100, bins + 1)
    bin_edges = np.percentile(b_clean, quantiles)
    bin_edges[0] = -np.inf
    bin_edges[-1] = np.inf
    
    # Calculate counts in each bin
    b_counts, _ = np.histogram(b_clean, bins=bin_edges)
    c_counts, _ = np.histogram(c_clean, bins=bin_edges)
    
    # Convert to proportions with smoothing epsilon
    eps = 1e-4
    b_pct = (b_counts + eps) / (len(b_clean) + eps * bins)
    c_pct = (c_counts + eps) / (len(c_clean) + eps * bins)
    
    # PSI summation
    psi = np.sum((c_pct - b_pct) * np.log(c_pct / b_pct))
    return float(max(0.0, psi))


def classify_drift_level(psi: float) -> str:
    """Classify drift according to standard PSI benchmarks."""
    if psi < 0.10:
        return "LOW"
    elif psi < 0.25:
        return "MODERATE"
    else:
        return "HIGH"


def analyze_drift() -> DriftAnalysisReport:
    """
    Run comprehensive drift audit comparing historical baseline dataset with prospective IPOs.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # Load historical baseline
    if not HISTORICAL_FEATURES_CSV.exists():
        return DriftAnalysisReport(
            sample_count=0,
            overall_feature_drift_level="LOW",
            overall_target_drift_level="LOW",
            model_status="STABLE",
            feature_drifts=[],
            monitored_at=now_iso,
        )
        
    df_hist = pd.read_csv(HISTORICAL_FEATURES_CSV)
    
    # Load prospective predictions
    if not PREDICTIONS_CSV.exists():
        return DriftAnalysisReport(
            sample_count=0,
            overall_feature_drift_level="LOW",
            overall_target_drift_level="LOW",
            model_status="STABLE",
            feature_drifts=[],
            monitored_at=now_iso,
        )
        
    df_pred = pd.read_csv(PREDICTIONS_CSV)
    n_prospective = len(df_pred)
    
    if n_prospective == 0:
        return DriftAnalysisReport(
            sample_count=0,
            overall_feature_drift_level="LOW",
            overall_target_drift_level="LOW",
            model_status="STABLE",
            feature_drifts=[],
            monitored_at=now_iso,
        )

    # Extract prospective features from feature_snapshot_json
    feature_drifts: List[FeatureDriftStat] = []
    psi_scores = []
    
    for feat_name in MONITORED_FEATURES:
        if feat_name in df_hist.columns:
            hist_vals = df_hist[feat_name].to_numpy(dtype=float)
            
            # Extract from prospective snapshots
            prospective_vals = []
            for _, row in df_pred.iterrows():
                if "feature_snapshot_json" in row and isinstance(row["feature_snapshot_json"], str):
                    try:
                        snap = eval(row["feature_snapshot_json"]) if row["feature_snapshot_json"].startswith("{") else {}
                        if feat_name in snap:
                            prospective_vals.append(float(snap[feat_name]))
                    except Exception:
                        pass
                        
            if len(prospective_vals) > 0:
                p_arr = np.array(prospective_vals)
                psi = calculate_psi(hist_vals, p_arr)
                psi_scores.append(psi)
                drift_lvl = classify_drift_level(psi)
                
                feature_drifts.append(FeatureDriftStat(
                    feature_name=feat_name,
                    psi_score=round(psi, 4),
                    drift_level=drift_lvl,
                    historical_mean=round(float(np.mean(hist_vals)), 2),
                    prospective_mean=round(float(np.mean(p_arr)), 2),
                ))

    # Overall feature drift level
    if len(psi_scores) > 0:
        max_psi = max(psi_scores)
        overall_feat_drift = classify_drift_level(max_psi)
    else:
        overall_feat_drift = "LOW"

    # Target drift if completed outcomes are available
    overall_target_drift = "LOW"
    if COMPLETED_CSV.exists():
        df_comp = pd.read_csv(COMPLETED_CSV)
        if len(df_comp) >= 5 and HISTORICAL_TARGETS_CSV.exists():
            df_hist_t = pd.read_csv(HISTORICAL_TARGETS_CSV)
            if "total_subscription" in df_hist_t.columns:
                target_psi = calculate_psi(
                    df_hist_t["total_subscription"].to_numpy(dtype=float),
                    df_comp["actual_total"].to_numpy(dtype=float)
                )
                overall_target_drift = classify_drift_level(target_psi)

    # Model status: MODEL_REVIEW_REQUIRED if high drift observed
    if overall_feat_drift == "HIGH" or overall_target_drift == "HIGH":
        model_status = "MODEL_REVIEW_REQUIRED"
    else:
        model_status = "STABLE"

    return DriftAnalysisReport(
        sample_count=n_prospective,
        overall_feature_drift_level=overall_feat_drift,
        overall_target_drift_level=overall_target_drift,
        model_status=model_status,
        feature_drifts=feature_drifts,
        monitored_at=now_iso,
    )
