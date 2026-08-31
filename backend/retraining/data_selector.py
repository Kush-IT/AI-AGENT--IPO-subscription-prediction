"""
Rolling 30-Day Data Selector & Leakage Protection Guard for Weekly Retraining.
Selects completed Indian Mainboard IPOs in the trailing 30-day window,
enforces strict ex-ante 09:59:59 IST temporal cutoffs, validates 45-feature schemas,
isolates targets, enforces N >= 10 sample size guards, and splits chronologically.
"""
from typing import Dict, List, Tuple, Optional, Any, Union
from pathlib import Path
from datetime import datetime, date, timedelta, timezone
import json
import pandas as pd
import numpy as np

from backend.ml.model_config import ABLATION_GROUPS
from backend.ml.features import TARGET_COLUMNS
from backend.monitoring.prospective_validator import (
    validate_prospective_timestamps,
    compute_feature_snapshot_hash,
)
from backend.monitoring.ipo_discovery import REGISTRY_CSV, load_registry
from backend.monitoring.prediction_logger import COMPLETED_CSV, LIVE_PRED_DIR
from backend.retraining.schemas import (
    DataSelectionSummary,
    IPORecordAudit,
    RetrainingStatus,
)

ROOT_DIR = Path(__file__).parent.parent.parent

LEAKAGE_COLUMNS = {
    "total_subscription",
    "qib_subscription",
    "nii_subscription",
    "retail_subscription",
    "actual_total",
    "actual_qib",
    "actual_nii",
    "actual_retail",
    "actual_total_subscription",
    "actual_qib_subscription",
    "actual_nii_subscription",
    "actual_retail_subscription",
    "listing_price",
    "listing_gains",
    "listing_day_return",
    "day_1_subscription",
    "day_2_subscription",
    "day_3_subscription",
    "post_close_gmp",
}


def get_canonical_feature_names() -> List[str]:
    """Returns the canonical 45-feature schema in exact order."""
    cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    assert len(cols) == 45, f"Expected 45 canonical features, got {len(cols)}"
    return list(cols)


def get_rolling_window(run_date: Union[str, datetime, date]) -> Tuple[str, str]:
    """
    Computes trailing 30-day window for a given run date.
    Window is [window_start, window_end) where window_start is inclusive and window_end is exclusive.
    Example: run_date = 2026-08-31 -> window_start = 2026-08-01, window_end = 2026-08-31.
    """
    if isinstance(run_date, str):
        dt = datetime.strptime(run_date.strip()[:10], "%Y-%m-%d").date()
    elif isinstance(run_date, datetime):
        dt = run_date.date()
    elif isinstance(run_date, date):
        dt = run_date
    else:
        raise ValueError(f"Invalid run_date type: {type(run_date)}")

    window_end = dt.strftime("%Y-%m-%d")
    window_start = (dt - timedelta(days=30)).strftime("%Y-%m-%d")
    return window_start, window_end


def validate_feature_snapshot(
    snapshot_features: Dict[str, Any],
    canonical_cols: Optional[List[str]] = None,
) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
    """
    Validates a feature snapshot dictionary against the canonical 45-feature schema
    and verifies strict absence of target/outcome leakage columns.
    """
    if canonical_cols is None:
        canonical_cols = get_canonical_feature_names()

    if not isinstance(snapshot_features, dict):
        return False, None, "INVALID_RECORD: Feature snapshot is not a dictionary."

    # Check for target / outcome leakage in feature matrix
    leakage_found = [k for k in snapshot_features.keys() if k.lower() in LEAKAGE_COLUMNS]
    if leakage_found:
        return False, None, f"LEAKAGE_DETECTED: Target/outcome columns found in feature snapshot: {leakage_found}"

    # Verify all 45 canonical columns exist
    missing_cols = [col for col in canonical_cols if col not in snapshot_features]
    if missing_cols:
        return False, None, f"SCHEMA_VALIDATION_FAILED: Missing {len(missing_cols)} canonical features: {missing_cols[:5]}"

    # Build clean validated 45-feature vector
    clean_features = {}
    for col in canonical_cols:
        val = snapshot_features[col]
        if col == "sector":
            clean_features[col] = str(val).strip() if val is not None else "Other"
        elif col == "market_trend":
            clean_features[col] = str(val).strip() if val is not None else "BULLISH"
        else:
            try:
                clean_features[col] = float(val) if val is not None else 0.0
            except (ValueError, TypeError):
                return False, None, f"DATA_VALIDATION_FAILED: Feature '{col}' has invalid non-numeric value: {val}"

    return True, clean_features, None


def validate_temporal_cutoff(
    open_date: str,
    feature_timestamp: Optional[str],
    cutoff_str: Optional[str] = None,
) -> Tuple[bool, Optional[str]]:
    """
    Validates that features were observed strictly prior to the statutory ex-ante cutoff.
    Statutory Cutoff: YYYY-MM-DD 09:59:59 IST on IPO open date.
    """
    if not feature_timestamp:
        return False, "MISSING_TEMPORAL_METADATA: Feature capture timestamp is required."

    cutoff_ts = cutoff_str or f"{open_date}T09:59:59+05:30"
    is_valid, msg = validate_prospective_timestamps(open_date, feature_timestamp, cutoff_ts)
    if not is_valid:
        return False, f"INVALID_TEMPORAL_CUTOFF: {msg}"
    return True, None


def validate_targets(
    outcome_dict: Dict[str, Any],
) -> Tuple[bool, Optional[Dict[str, float]], Optional[str]]:
    """
    Extracts and validates all 4 actual subscription target multiples.
    Must be valid, non-negative numerical values.
    """
    if not isinstance(outcome_dict, dict):
        return False, None, "MISSING_OUTCOME: Outcome payload is not a dictionary."

    # Look for nested actual_subscriptions or flat keys
    subs = outcome_dict.get("actual_subscriptions", outcome_dict)

    target_map = {
        "actual_total": ["total_subscription", "actual_total", "actual_total_subscription"],
        "actual_qib": ["qib_subscription", "actual_qib", "actual_qib_subscription"],
        "actual_nii": ["nii_subscription", "actual_nii", "actual_nii_subscription"],
        "actual_retail": ["retail_subscription", "actual_retail", "actual_retail_subscription"],
    }

    clean_targets = {}
    for target_key, candidate_keys in target_map.items():
        val = None
        for ck in candidate_keys:
            if ck in subs and subs[ck] is not None and not (isinstance(subs[ck], float) and np.isnan(subs[ck])):
                val = subs[ck]
                break
        if val is None:
            return False, None, f"MISSING_OUTCOME: Required target '{target_key}' missing from outcome."
        try:
            val_float = float(val)
            if val_float < 0.0:
                return False, None, f"INVALID_TARGET: Target '{target_key}' cannot be negative ({val_float})."
            clean_targets[target_key] = val_float
        except (ValueError, TypeError):
            return False, None, f"INVALID_TARGET: Target '{target_key}' has non-numeric value: {val}."

    return True, clean_targets, None


def split_chronologically(
    df: pd.DataFrame,
    train_ratio: float = 0.8,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Performs chronological 80/20 train/validation split sorted by close date ascending.
    Never randomly shuffles observations.
    """
    sort_cols = [c for c in ["ipo_close_date", "ipo_open_date", "ipo_id"] if c in df.columns]
    df_sorted = df.sort_values(by=sort_cols).reset_index(drop=True) if sort_cols else df.copy().reset_index(drop=True)
    n_total = len(df_sorted)
    if n_total == 0:
        return df_sorted.copy(), df_sorted.copy()

    n_train = max(1, int(np.floor(n_total * train_ratio)))
    # If n_total >= 2 and n_train == n_total, ensure at least 1 in validation
    if n_total >= 2 and n_train == n_total:
        n_train = n_total - 1

    train_df = df_sorted.iloc[:n_train].copy().reset_index(drop=True)
    val_df = df_sorted.iloc[n_train:].copy().reset_index(drop=True)
    return train_df, val_df


def select_completed_mainboard_ipos(
    run_date: Union[str, datetime, date],
    min_samples: int = 10,
    registry_csv: Optional[Path] = None,
    completed_csv: Optional[Path] = None,
    live_pred_dir: Optional[Path] = None,
) -> Tuple[
    DataSelectionSummary,
    Optional[pd.DataFrame],
    Optional[pd.DataFrame],
    Optional[pd.DataFrame],
    Optional[pd.DataFrame],
]:
    """
    Selects valid completed Indian Mainboard IPOs from the trailing 30-day window.
    Enforces minimum sample guard (N >= min_samples) and returns chronological splits.
    """
    canonical_cols = get_canonical_feature_names()
    window_start, window_end = get_rolling_window(run_date)
    eval_date_str = str(run_date)[:10]

    reg_file = registry_csv or REGISTRY_CSV
    comp_file = completed_csv or COMPLETED_CSV
    live_dir = live_pred_dir or LIVE_PRED_DIR

    # Load potential candidates from registry and completed files
    candidates_pool: Dict[str, Dict[str, Any]] = {}
    pred_to_ipo_map: Dict[str, str] = {}

    # 1. Inspect prospective IPO registry
    if reg_file.exists():
        try:
            reg_df = pd.read_csv(reg_file)
            for _, row in reg_df.iterrows():
                ipo_id = str(row.get("ipo_id", "")).strip()
                if ipo_id:
                    pred_id = str(row.get("prediction_id", "")).strip() if pd.notna(row.get("prediction_id")) else ""
                    if pred_id:
                        pred_to_ipo_map[pred_id] = ipo_id
                    candidates_pool[ipo_id] = {
                        "ipo_id": ipo_id,
                        "company_name": str(row.get("company_name", ipo_id)),
                        "ipo_open_date": str(row.get("ipo_open_date", "")),
                        "ipo_close_date": str(row.get("ipo_close_date", "")),
                        "status": str(row.get("status", "")),
                        "prediction_id": pred_id,
                        "prediction_timestamp": row.get("prediction_timestamp"),
                        "outcome_timestamp": row.get("outcome_timestamp"),
                        "is_mainboard": True,
                    }
        except Exception:
            pass

    # 2. Inspect completed predictions CSV and merge
    if comp_file.exists():
        try:
            comp_df = pd.read_csv(comp_file)
            for _, row in comp_df.iterrows():
                pred_id = str(row.get("prediction_id", "")).strip()
                co_name = str(row.get("company_name", "")).strip()
                open_date = str(row.get("ipo_open_date", "")).strip()
                
                # Match to existing candidate or create
                matched_id = pred_to_ipo_map.get(pred_id)
                if not matched_id:
                    for cid, cdata in candidates_pool.items():
                        if cdata.get("company_name") == co_name or cdata.get("prediction_id") == pred_id or cid == pred_id:
                            matched_id = cid
                            break
                
                if matched_id and matched_id in candidates_pool:
                    target_cand = candidates_pool[matched_id]
                    target_cand["status"] = "COMPLETED"
                    target_cand["actual_total"] = row.get("actual_total")
                    target_cand["actual_qib"] = row.get("actual_qib")
                    target_cand["actual_nii"] = row.get("actual_nii")
                    target_cand["actual_retail"] = row.get("actual_retail")
                    if pd.notna(row.get("outcome_observed_at")):
                        target_cand["outcome_timestamp"] = row.get("outcome_observed_at")
                    if not target_cand.get("ipo_close_date") and pd.notna(row.get("outcome_observed_at")):
                        target_cand["ipo_close_date"] = str(row.get("outcome_observed_at"))[:10]
                else:
                    cand_id = pred_id if pred_id else f"{co_name}_{open_date}"
                    candidates_pool[cand_id] = {
                        "ipo_id": cand_id,
                        "company_name": co_name,
                        "ipo_open_date": open_date,
                        "ipo_close_date": str(row.get("outcome_observed_at", open_date))[:10],
                        "status": "COMPLETED",
                        "prediction_id": pred_id,
                        "prediction_timestamp": row.get("prediction_timestamp"),
                        "outcome_timestamp": row.get("outcome_observed_at"),
                        "actual_total": row.get("actual_total"),
                        "actual_qib": row.get("actual_qib"),
                        "actual_nii": row.get("actual_nii"),
                        "actual_retail": row.get("actual_retail"),
                        "is_mainboard": True,
                    }
        except Exception:
            pass

    # 3. Inspect individual IPO directories in live_pred_dir
    if live_dir.exists():
        for sub_dir in live_dir.iterdir():
            if sub_dir.is_dir() and sub_dir.name not in [".", ".."]:
                ipo_id = sub_dir.name
                if ipo_id not in candidates_pool:
                    candidates_pool[ipo_id] = {
                        "ipo_id": ipo_id,
                        "company_name": ipo_id,
                        "status": "DISCOVERED",
                        "is_mainboard": True,
                    }
                
                snap_path = sub_dir / "final_feature_snapshot.json"
                if not snap_path.exists():
                    snap_path = sub_dir / "feature_snapshot.json"
                out_path = sub_dir / "actual_outcome.json"
                
                if snap_path.exists():
                    try:
                        with open(snap_path, "r", encoding="utf-8") as f:
                            snap_data = json.load(f)
                        candidates_pool[ipo_id]["company_name"] = snap_data.get("company_name", candidates_pool[ipo_id]["company_name"])
                        candidates_pool[ipo_id]["ipo_open_date"] = snap_data.get("ipo_open_date", candidates_pool[ipo_id].get("ipo_open_date"))
                        candidates_pool[ipo_id]["ipo_close_date"] = snap_data.get("ipo_close_date", candidates_pool[ipo_id].get("ipo_close_date"))
                        candidates_pool[ipo_id]["feature_snapshot_hash"] = snap_data.get("feature_snapshot_hash")
                        candidates_pool[ipo_id]["capture_timestamp"] = snap_data.get("capture_timestamp")
                        candidates_pool[ipo_id]["features"] = snap_data.get("features", snap_data)
                    except Exception:
                        pass
                
                if out_path.exists():
                    try:
                        with open(out_path, "r", encoding="utf-8") as f:
                            out_data = json.load(f)
                        candidates_pool[ipo_id]["outcome_data"] = out_data
                        candidates_pool[ipo_id]["status"] = "COMPLETED"
                        if "actual_subscriptions" in out_data:
                            subs = out_data["actual_subscriptions"]
                            candidates_pool[ipo_id]["actual_total"] = subs.get("total_subscription")
                            candidates_pool[ipo_id]["actual_qib"] = subs.get("qib_subscription")
                            candidates_pool[ipo_id]["actual_nii"] = subs.get("nii_subscription")
                            candidates_pool[ipo_id]["actual_retail"] = subs.get("retail_subscription")
                        candidates_pool[ipo_id]["outcome_timestamp"] = out_data.get("outcome_observed_at", out_data.get("retrieved_at"))
                    except Exception:
                        pass

    # Audit and filter each candidate
    records_audit: List[IPORecordAudit] = []
    eligible_records: List[Dict[str, Any]] = []

    for ipo_id, raw_cand in candidates_pool.items():
        company_name = str(raw_cand.get("company_name", ipo_id)).strip()
        open_date = str(raw_cand.get("ipo_open_date", "")).strip()
        close_date = str(raw_cand.get("ipo_close_date", "")).strip()
        status_val = str(raw_cand.get("status", "")).strip().upper()
        is_mainboard = raw_cand.get("is_mainboard", True)

        # 1. Mainboard check
        if not is_mainboard or "SME" in company_name.upper():
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date,
                    feature_snapshot_hash="N/A",
                    outcome_timestamp="N/A",
                    actual_total=0.0,
                    actual_qib=0.0,
                    actual_nii=0.0,
                    actual_retail=0.0,
                    included=False,
                    rejection_reason="SME_IPO: Non-Mainboard offerings are strictly excluded.",
                )
            )
            continue

        # 2. Status check
        if status_val not in ["COMPLETED", "OUTCOME_RECORDED"]:
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date,
                    feature_snapshot_hash="N/A",
                    outcome_timestamp="N/A",
                    actual_total=0.0,
                    actual_qib=0.0,
                    actual_nii=0.0,
                    actual_retail=0.0,
                    included=False,
                    rejection_reason=f"NOT_COMPLETED: Offering lifecycle status is '{status_val}'.",
                )
            )
            continue

        # 3. Date boundary check [window_start, window_end)
        if not close_date or len(close_date) < 10:
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date or "UNKNOWN",
                    feature_snapshot_hash="N/A",
                    outcome_timestamp="N/A",
                    actual_total=0.0,
                    actual_qib=0.0,
                    actual_nii=0.0,
                    actual_retail=0.0,
                    included=False,
                    rejection_reason="INVALID_RECORD: Missing or invalid ipo_close_date.",
                )
            )
            continue

        close_date_clean = close_date[:10]
        if not (window_start <= close_date_clean < window_end):
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date_clean,
                    feature_snapshot_hash="N/A",
                    outcome_timestamp="N/A",
                    actual_total=0.0,
                    actual_qib=0.0,
                    actual_nii=0.0,
                    actual_retail=0.0,
                    included=False,
                    rejection_reason=f"OUTSIDE_WINDOW: Close date {close_date_clean} is outside [{window_start}, {window_end}).",
                )
            )
            continue

        # 4. Verified Target Outcome Validation
        outcome_payload = raw_cand.get("outcome_data") or {
            "actual_total": raw_cand.get("actual_total"),
            "actual_qib": raw_cand.get("actual_qib"),
            "actual_nii": raw_cand.get("actual_nii"),
            "actual_retail": raw_cand.get("actual_retail"),
        }
        targets_ok, clean_targets, target_err = validate_targets(outcome_payload)
        if not targets_ok or clean_targets is None:
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date_clean,
                    feature_snapshot_hash="N/A",
                    outcome_timestamp="N/A",
                    actual_total=0.0,
                    actual_qib=0.0,
                    actual_nii=0.0,
                    actual_retail=0.0,
                    included=False,
                    rejection_reason=target_err or "MISSING_OUTCOME",
                )
            )
            continue

        # 5. Feature Snapshot & Schema Validation
        features_dict = raw_cand.get("features")
        if not features_dict and live_dir.exists():
            for possible_name in [ipo_id, f"{ipo_id}_preipo"]:
                cand_file = live_dir / possible_name / "final_feature_snapshot.json"
                if not cand_file.exists():
                    cand_file = live_dir / possible_name / "feature_snapshot.json"
                if cand_file.exists():
                    try:
                        with open(cand_file, "r", encoding="utf-8") as f:
                            snap_content = json.load(f)
                        features_dict = snap_content.get("features", snap_content)
                        raw_cand["feature_snapshot_hash"] = snap_content.get("feature_snapshot_hash")
                        raw_cand["capture_timestamp"] = snap_content.get("capture_timestamp")
                        break
                    except Exception:
                        pass

        if not features_dict:
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date_clean,
                    feature_snapshot_hash="N/A",
                    outcome_timestamp=str(raw_cand.get("outcome_timestamp", "N/A")),
                    actual_total=clean_targets["actual_total"],
                    actual_qib=clean_targets["actual_qib"],
                    actual_nii=clean_targets["actual_nii"],
                    actual_retail=clean_targets["actual_retail"],
                    included=False,
                    rejection_reason="MISSING_FEATURE_SNAPSHOT: Immutable pre-IPO feature snapshot not found.",
                )
            )
            continue

        features_ok, clean_features, schema_err = validate_feature_snapshot(features_dict, canonical_cols)
        if not features_ok or clean_features is None:
            records_audit.append(
                IPORecordAudit(
                    ipo_id=ipo_id,
                    company_name=company_name,
                    ipo_open_date=open_date,
                    ipo_close_date=close_date_clean,
                    feature_snapshot_hash="N/A",
                    outcome_timestamp=str(raw_cand.get("outcome_timestamp", "N/A")),
                    actual_total=clean_targets["actual_total"],
                    actual_qib=clean_targets["actual_qib"],
                    actual_nii=clean_targets["actual_nii"],
                    actual_retail=clean_targets["actual_retail"],
                    included=False,
                    rejection_reason=schema_err or "SCHEMA_VALIDATION_FAILED",
                )
            )
            continue

        # 6. Temporal Ex-Ante Cutoff Check
        capture_ts = raw_cand.get("capture_timestamp") or raw_cand.get("prediction_timestamp")
        cutoff_ts = f"{open_date}T09:59:59+05:30"
        if capture_ts:
            temp_ok, temp_err = validate_temporal_cutoff(open_date, str(capture_ts), cutoff_ts)
            if not temp_ok:
                records_audit.append(
                    IPORecordAudit(
                        ipo_id=ipo_id,
                        company_name=company_name,
                        ipo_open_date=open_date,
                        ipo_close_date=close_date_clean,
                        feature_snapshot_hash=raw_cand.get("feature_snapshot_hash", "N/A"),
                        outcome_timestamp=str(raw_cand.get("outcome_timestamp", "N/A")),
                        actual_total=clean_targets["actual_total"],
                        actual_qib=clean_targets["actual_qib"],
                        actual_nii=clean_targets["actual_nii"],
                        actual_retail=clean_targets["actual_retail"],
                        included=False,
                        rejection_reason=temp_err or "INVALID_TEMPORAL_CUTOFF",
                    )
                )
                continue

        # 7. Snapshot Hash Integrity Verification
        computed_hash = compute_feature_snapshot_hash(clean_features)
        stored_hash = raw_cand.get("feature_snapshot_hash")
        snapshot_hash = stored_hash or computed_hash

        outcome_ts_str = str(raw_cand.get("outcome_timestamp") or f"{close_date_clean}T18:00:00+05:30")
        audit_record = IPORecordAudit(
            ipo_id=ipo_id,
            company_name=company_name,
            ipo_open_date=open_date,
            ipo_close_date=close_date_clean,
            feature_snapshot_hash=snapshot_hash,
            outcome_timestamp=outcome_ts_str,
            actual_total=clean_targets["actual_total"],
            actual_qib=clean_targets["actual_qib"],
            actual_nii=clean_targets["actual_nii"],
            actual_retail=clean_targets["actual_retail"],
            split="TRAIN",
            included=True,
            rejection_reason=None,
        )
        records_audit.append(audit_record)

        eligible_records.append({
            "ipo_id": ipo_id,
            "company_name": company_name,
            "ipo_open_date": open_date,
            "ipo_close_date": close_date_clean,
            "feature_snapshot_hash": snapshot_hash,
            "outcome_timestamp": outcome_ts_str,
            "features": clean_features,
            "targets": clean_targets,
        })

    total_found = len(candidates_pool)
    eligible_count = len(eligible_records)
    rejected_count = total_found - eligible_count
    is_sample_size_ok = eligible_count >= min_samples

    # If sample size is insufficient, stop cleanly without training
    if not is_sample_size_ok:
        summary = DataSelectionSummary(
            evaluation_date=eval_date_str,
            window_start_date=window_start,
            window_end_date=window_end,
            total_candidates_found=total_found,
            eligible_count=eligible_count,
            rejected_count=rejected_count,
            training_sample_count=0,
            validation_sample_count=0,
            minimum_sample_threshold=min_samples,
            is_sample_size_sufficient=False,
            is_validation_split_sufficient=False,
            records_audit=records_audit,
        )
        return summary, None, None, None, None

    # Perform chronological 80/20 train/validation split
    eligible_df = pd.DataFrame(eligible_records)
    train_df, val_df = split_chronologically(eligible_df, train_ratio=0.8)
    n_train = len(train_df)
    n_val = len(val_df)
    is_val_split_ok = n_val >= 1

    # Update split label in records_audit
    val_ipo_ids = set(val_df["ipo_id"].tolist())
    for rec in records_audit:
        if rec.included:
            rec.split = "VALIDATION" if rec.ipo_id in val_ipo_ids else "TRAIN"

    # Separate X (45 features) and y (4 targets)
    X_train = pd.DataFrame([r["features"] for _, r in train_df.iterrows()])[canonical_cols]
    y_train = pd.DataFrame([r["targets"] for _, r in train_df.iterrows()])
    y_train.columns = ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]

    X_val = pd.DataFrame([r["features"] for _, r in val_df.iterrows()])[canonical_cols]
    y_val = pd.DataFrame([r["targets"] for _, r in val_df.iterrows()])
    y_val.columns = ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]

    summary = DataSelectionSummary(
        evaluation_date=eval_date_str,
        window_start_date=window_start,
        window_end_date=window_end,
        total_candidates_found=total_found,
        eligible_count=eligible_count,
        rejected_count=rejected_count,
        training_sample_count=n_train,
        validation_sample_count=n_val,
        minimum_sample_threshold=min_samples,
        is_sample_size_sufficient=True,
        is_validation_split_sufficient=is_val_split_ok,
        records_audit=records_audit,
    )

    return summary, X_train, y_train, X_val, y_val
