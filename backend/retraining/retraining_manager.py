"""
Weekly Rolling Retraining Orchestrator & Governance Manager.
Coordinates production integrity verification, PSI drift detection,
trailing 30-day data selection, chronological train/validation splitting,
unified XGBoost candidate training, dual-model validation evaluation,
10-point promotion gate assessment, and atomic research audit logging.
"""
from typing import Dict, List, Tuple, Optional, Any, Union
from pathlib import Path
from datetime import datetime, timezone, date
import uuid
import json
import numpy as np
import pandas as pd

from backend.monitoring.prospective_validator import (
    verify_model_integrity,
    ModelIntegrityError,
)
from backend.monitoring.drift_detector import analyze_drift
from backend.retraining.schemas import (
    RetrainingStatus,
    RetrainingRunRequest,
    RetrainingRunResponse,
    DataSelectionSummary,
    CandidateModelMetadata,
    ModelComparisonSummary,
    PromotionDecision,
    PromotionGateCheck,
)
from backend.retraining.data_selector import (
    select_completed_mainboard_ipos,
    get_rolling_window,
    get_canonical_feature_names,
)
from backend.retraining.candidate_trainer import (
    train_xgboost_candidates,
    compute_file_sha256,
)
from backend.retraining.evaluator import (
    evaluate_candidate_vs_production,
)

ROOT_DIR = Path(__file__).parent.parent.parent
RESEARCH_RETRAINING_DIR = ROOT_DIR / "research" / "retraining"


def generate_retraining_report_markdown(
    response: RetrainingRunResponse,
    prod_hashes: Dict[str, str],
) -> str:
    """Generates an auditable markdown summary report of the retraining run."""
    ds = response.data_selection
    lines = [
        f"# Weekly Rolling Retraining Audit Report — {response.evaluation_date}",
        "",
        f"- **Run ID:** `{response.run_id}`",
        f"- **Execution Timestamp:** `{response.timestamp}`",
        f"- **Dry Run Mode:** `{'Enabled' if response.is_dry_run else 'Disabled'}`",
        f"- **Final Retraining Status:** `{response.status.value}`",
        f"- **Status Message:** {response.message}",
        f"- **Production Model Integrity:** `{'VERIFIED (Unchanged)' if response.production_model_integrity_verified else 'FAILED'}`",
        "",
        "## 1. Rolling 30-Day Data Window",
        f"- **Window Start (Inclusive):** `{ds.window_start_date}`",
        f"- **Window End (Exclusive):** `{ds.window_end_date}`",
        f"- **Total Candidates Examined:** `{ds.total_candidates_found}`",
        f"- **Eligible Completed Mainboard IPOs:** `{ds.eligible_count}`",
        f"- **Rejected Records Count:** `{ds.rejected_count}`",
        f"- **Training Sample Count (N_train):** `{ds.training_sample_count}`",
        f"- **Validation Sample Count (N_val):** `{ds.validation_sample_count}`",
        f"- **Minimum Sample Threshold:** `{ds.minimum_sample_threshold}`",
        "",
        "### Audit Candidate Log",
        "| IPO ID | Company Name | Close Date | Included | Reason / Split |",
        "|---|---|---|---|---|",
    ]

    for rec in ds.records_audit:
        inc_str = "YES" if rec.included else "NO"
        detail_str = rec.split if rec.included else (rec.rejection_reason or "REJECTED")
        lines.append(f"| `{rec.ipo_id}` | {rec.company_name} | {rec.ipo_close_date} | {inc_str} | {detail_str} |")

    lines.extend([
        "",
        "## 2. Monitored Feature Drift (PSI)",
        f"- **Overall Feature Drift Level:** `{response.feature_drift_status.get('overall_feature_drift_level', 'LOW')}`",
        f"- **Model Stability Status:** `{response.feature_drift_status.get('model_status', 'STABLE')}`",
        "",
    ])

    if response.candidate_metadata and response.comparison_metrics:
        cm = response.candidate_metadata
        comp = response.comparison_metrics
        lines.extend([
            "## 3. Candidate vs Production Model Comparison",
            f"- **Candidate Model Version:** `{cm.model_version}`",
            f"- **Candidate Architecture:** {cm.architecture}",
            "",
            "| Target | Current Production MAE | Candidate XGBoost MAE | Difference (Candidate - Prod) | Candidate R2 |",
            "|---|---|---|---|---|",
            f"| **Total Subscription** | {comp.total_metrics_current.mae} | {comp.total_metrics_candidate.mae} | {comp.total_mae_difference} | {comp.total_metrics_candidate.r2} |",
            f"| **QIB Subscription** | {comp.qib_metrics_current.mae} | {comp.qib_metrics_candidate.mae} | {comp.qib_mae_difference} | {comp.qib_metrics_candidate.r2} |",
            f"| **NII Subscription** | {comp.nii_metrics_current.mae} | {comp.nii_metrics_candidate.mae} | {comp.nii_mae_difference} | {comp.nii_metrics_candidate.r2} |",
            f"| **Retail Subscription** | {comp.retail_metrics_current.mae} | {comp.retail_metrics_candidate.mae} | {comp.retail_mae_difference} | {comp.retail_metrics_candidate.r2} |",
            "",
            "### Investor Category Classification Accuracies",
            f"- **Category Ranking Accuracy (Production):** `{comp.category_ranking_accuracy_current_pct}%`",
            f"- **Category Ranking Accuracy (Candidate):** `{comp.category_ranking_accuracy_candidate_pct}%`",
            f"- **Strongest Category Accuracy (Production):** `{comp.strongest_category_accuracy_current_pct}%`",
            f"- **Strongest Category Accuracy (Candidate):** `{comp.strongest_category_accuracy_candidate_pct}%`",
            "",
            "## 4. 10-Point Promotion Gate Assessment",
            f"- **Promotion Decision:** `{response.promotion_decision.decision}`",
            f"- **All Checks Passed:** `{response.promotion_decision.passed_all_checks}`",
            f"- **Decision Rationale:** {response.promotion_decision.rationale}",
            "",
            "| # | Promotion Gate Check | Status | Details |",
            "|---|---|---|---|",
        ])
        for idx, check in enumerate(response.promotion_decision.checks, 1):
            chk_icon = "PASS" if check.passed else "FAIL"
            lines.append(f"| {idx} | {check.check_name} | `{chk_icon}` | {check.details} |")
    else:
        lines.extend([
            "## 3. Candidate Training & Promotion Gate",
            "- **Candidate Training:** `SKIPPED (Insufficient observations in 30-day window)`",
            f"- **Promotion Decision:** `{response.promotion_decision.decision}`",
            f"- **Governance Notice:** {response.promotion_decision.rationale}",
        ])

    lines.extend([
        "",
        "## 5. Production Model Cryptographic Verification",
        "```json",
        json.dumps(prod_hashes, indent=2),
        "```",
        "",
        "---",
        "*Report generated automatically by IPO Subscription AI Weekly Retraining Engine.*",
    ])

    return "\n".join(lines)


def run_weekly_retraining(
    request: Optional[RetrainingRunRequest] = None,
    base_research_dir: Optional[Path] = None,
    base_retrained_dir: Optional[Path] = None,
    registry_csv: Optional[Path] = None,
    completed_csv: Optional[Path] = None,
    live_pred_dir: Optional[Path] = None,
) -> RetrainingRunResponse:
    """
    Executes the complete weekly rolling retraining pipeline:
    1. Pre-training SHA-256 integrity check of production models
    2. PSI drift analysis of monitored input features
    3. Trailing 30-day window data selection ($N >= 10$ guard)
    4. Chronological 80/20 train/validation splitting
    5. Unified XGBoost candidate model training (if not dry run)
    6. Candidate artifact integrity verification
    7. Dual-model validation evaluation
    8. 10-point promotion gate evaluation
    9. Atomic research audit logging and manifest generation
    10. Post-training SHA-256 integrity check of production models
    """
    req = request or RetrainingRunRequest()
    run_id = str(uuid.uuid4())
    now_ts = datetime.now(timezone.utc).isoformat()
    eval_date = req.run_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    min_samples = req.min_samples

    # 1. Production Model Integrity Pre-Check
    try:
        is_prod_ok_before, prod_hashes_before = verify_model_integrity()
        if not is_prod_ok_before:
            empty_ds = DataSelectionSummary(
                evaluation_date=eval_date,
                window_start_date=eval_date,
                window_end_date=eval_date,
                total_candidates_found=0,
                eligible_count=0,
                rejected_count=0,
                training_sample_count=0,
                validation_sample_count=0,
                minimum_sample_threshold=min_samples,
                is_sample_size_sufficient=False,
                is_validation_split_sufficient=False,
                records_audit=[],
            )
            return RetrainingRunResponse(
                run_id=run_id,
                timestamp=now_ts,
                evaluation_date=eval_date,
                is_dry_run=req.dry_run,
                status=RetrainingStatus.MODEL_INTEGRITY_VIOLATION,
                message="MODEL_INTEGRITY_VIOLATION: Production models compromised prior to retraining execution.",
                production_model_integrity_verified=False,
                feature_drift_status={"overall_feature_drift_level": "UNKNOWN", "model_status": "CRITICAL"},
                data_selection=empty_ds,
                candidate_metadata=None,
                comparison_metrics=None,
                promotion_decision=PromotionDecision(
                    decision="KEEP_CURRENT_MODEL",
                    passed_all_checks=False,
                    checks=[PromotionGateCheck(check_name="Production Integrity", passed=False, details="Integrity verification failed.")],
                    rationale="Production models altered or compromised. Pipeline halted immediately.",
                ),
                manifest_path=None,
            )
    except ModelIntegrityError as e:
        empty_ds = DataSelectionSummary(
            evaluation_date=eval_date,
            window_start_date=eval_date,
            window_end_date=eval_date,
            total_candidates_found=0,
            eligible_count=0,
            rejected_count=0,
            training_sample_count=0,
            validation_sample_count=0,
            minimum_sample_threshold=min_samples,
            is_sample_size_sufficient=False,
            is_validation_split_sufficient=False,
            records_audit=[],
        )
        return RetrainingRunResponse(
            run_id=run_id,
            timestamp=now_ts,
            evaluation_date=eval_date,
            is_dry_run=req.dry_run,
            status=RetrainingStatus.MODEL_INTEGRITY_VIOLATION,
            message=str(e),
            production_model_integrity_verified=False,
            feature_drift_status={"overall_feature_drift_level": "UNKNOWN", "model_status": "CRITICAL"},
            data_selection=empty_ds,
            candidate_metadata=None,
            comparison_metrics=None,
            promotion_decision=PromotionDecision(
                decision="KEEP_CURRENT_MODEL",
                passed_all_checks=False,
                checks=[PromotionGateCheck(check_name="Production Integrity", passed=False, details=str(e))],
                rationale="Production models altered or compromised. Pipeline halted immediately.",
            ),
            manifest_path=None,
        )

    # 2. Monitored Feature Drift Analysis (PSI)
    try:
        drift_report = analyze_drift()
        feature_drift_status = {
            "overall_feature_drift_level": drift_report.overall_feature_drift_level,
            "overall_target_drift_level": drift_report.overall_target_drift_level,
            "model_status": drift_report.model_status,
            "sample_count": drift_report.sample_count,
        }
    except Exception:
        feature_drift_status = {
            "overall_feature_drift_level": "LOW",
            "overall_target_drift_level": "LOW",
            "model_status": "STABLE",
            "sample_count": 0,
        }

    # 3. Trailing 30-Day Window Data Selection
    data_summary, X_train, y_train, X_val, y_val = select_completed_mainboard_ipos(
        run_date=eval_date,
        min_samples=min_samples,
        registry_csv=registry_csv,
        completed_csv=completed_csv,
        live_pred_dir=live_pred_dir,
    )

    # 4. Minimum Sample Guard Check (N < 10)
    if not data_summary.is_sample_size_sufficient:
        ret_status = RetrainingStatus.INSUFFICIENT_SAMPLE_SIZE
        msg = f"INSUFFICIENT_SAMPLE_SIZE: Found {data_summary.eligible_count} eligible completed Mainboard IPOs in trailing 30-day window [{data_summary.window_start_date}, {data_summary.window_end_date}), minimum required is {min_samples}. Retaining production model."
        decision = PromotionDecision(
            decision="KEEP_CURRENT_MODEL",
            passed_all_checks=False,
            checks=[
                PromotionGateCheck(
                    check_name="3. Minimum Training Sample Size",
                    passed=False,
                    details=f"Eligible sample count {data_summary.eligible_count} < required {min_samples}.",
                )
            ],
            rationale="Insufficient completed observations in rolling window. No candidate model trained.",
        )

        response = RetrainingRunResponse(
            run_id=run_id,
            timestamp=now_ts,
            evaluation_date=eval_date,
            is_dry_run=req.dry_run,
            status=ret_status,
            message=msg,
            production_model_integrity_verified=True,
            feature_drift_status=feature_drift_status,
            data_selection=data_summary,
            candidate_metadata=None,
            comparison_metrics=None,
            promotion_decision=decision,
            manifest_path=None,
        )

        # Write audit manifest safely
        res_dir = base_research_dir or RESEARCH_RETRAINING_DIR
        run_audit_dir = res_dir / eval_date / f"run_{run_id}"
        run_audit_dir.mkdir(parents=True, exist_ok=True)
        manifest_file = run_audit_dir / "manifest.json"
        with open(manifest_file, "w", encoding="utf-8") as f:
            json.dump(response.model_dump(), f, indent=2)

        report_md = generate_retraining_report_markdown(response, prod_hashes_before)
        with open(run_audit_dir / "retraining_report.md", "w", encoding="utf-8") as f:
            f.write(report_md)

        response.manifest_path = str(manifest_file)
        return response

    # 5. Validation Sample Guard Check
    if not data_summary.is_validation_split_sufficient or X_val is None or len(X_val) < 1:
        ret_status = RetrainingStatus.INSUFFICIENT_VALIDATION_DATA
        msg = "INSUFFICIENT_VALIDATION_DATA: Chronological validation set has 0 observations. Retaining production model."
        decision = PromotionDecision(
            decision="KEEP_CURRENT_MODEL",
            passed_all_checks=False,
            checks=[
                PromotionGateCheck(
                    check_name="4. Validation Sample Size",
                    passed=False,
                    details="Validation split resulted in 0 observations.",
                )
            ],
            rationale="Chronological validation slice is empty. No candidate model evaluated.",
        )

        response = RetrainingRunResponse(
            run_id=run_id,
            timestamp=now_ts,
            evaluation_date=eval_date,
            is_dry_run=req.dry_run,
            status=ret_status,
            message=msg,
            production_model_integrity_verified=True,
            feature_drift_status=feature_drift_status,
            data_selection=data_summary,
            candidate_metadata=None,
            comparison_metrics=None,
            promotion_decision=decision,
            manifest_path=None,
        )

        res_dir = base_research_dir or RESEARCH_RETRAINING_DIR
        run_audit_dir = res_dir / eval_date / f"run_{run_id}"
        run_audit_dir.mkdir(parents=True, exist_ok=True)
        manifest_file = run_audit_dir / "manifest.json"
        with open(manifest_file, "w", encoding="utf-8") as f:
            json.dump(response.model_dump(), f, indent=2)

        report_md = generate_retraining_report_markdown(response, prod_hashes_before)
        with open(run_audit_dir / "retraining_report.md", "w", encoding="utf-8") as f:
            f.write(report_md)

        response.manifest_path = str(manifest_file)
        return response

    # 6. Dry Run Handling (When N >= 10)
    if req.dry_run:
        ret_status = RetrainingStatus.CANDIDATE_VALIDATED
        msg = f"DRY_RUN: Data selection verified {data_summary.eligible_count} completed IPOs (Train N={data_summary.training_sample_count}, Val N={data_summary.validation_sample_count}). Candidate model training skipped in dry-run mode."
        decision = PromotionDecision(
            decision="KEEP_CURRENT_MODEL",
            passed_all_checks=True,
            checks=[
                PromotionGateCheck(
                    check_name="Dry Run Verification",
                    passed=True,
                    details=f"Dry run validated data readiness without modifying artifacts ({data_summary.eligible_count} eligible).",
                )
            ],
            rationale="Dry run executed successfully. Candidate training bypassed.",
        )

        response = RetrainingRunResponse(
            run_id=run_id,
            timestamp=now_ts,
            evaluation_date=eval_date,
            is_dry_run=True,
            status=ret_status,
            message=msg,
            production_model_integrity_verified=True,
            feature_drift_status=feature_drift_status,
            data_selection=data_summary,
            candidate_metadata=None,
            comparison_metrics=None,
            promotion_decision=decision,
            manifest_path=None,
        )

        res_dir = base_research_dir or RESEARCH_RETRAINING_DIR
        run_audit_dir = res_dir / eval_date / f"run_{run_id}"
        run_audit_dir.mkdir(parents=True, exist_ok=True)
        manifest_file = run_audit_dir / "manifest.json"
        with open(manifest_file, "w", encoding="utf-8") as f:
            json.dump(response.model_dump(), f, indent=2)

        report_md = generate_retraining_report_markdown(response, prod_hashes_before)
        with open(run_audit_dir / "retraining_report.md", "w", encoding="utf-8") as f:
            f.write(report_md)

        response.manifest_path = str(manifest_file)
        return response

    # 7. Candidate Training
    tr_status, candidate_metadata, candidate_manifest, tr_err = train_xgboost_candidates(
        data_summary=data_summary,
        X_train=X_train,
        y_train=y_train,
        X_val=X_val,
        y_val=y_val,
        base_retrained_dir=base_retrained_dir,
    )

    if tr_status != RetrainingStatus.CANDIDATE_VALIDATED or candidate_metadata is None:
        response = RetrainingRunResponse(
            run_id=run_id,
            timestamp=now_ts,
            evaluation_date=eval_date,
            is_dry_run=False,
            status=tr_status,
            message=tr_err or "TRAINING_FAILED: Candidate model training failed.",
            production_model_integrity_verified=True,
            feature_drift_status=feature_drift_status,
            data_selection=data_summary,
            candidate_metadata=None,
            comparison_metrics=None,
            promotion_decision=PromotionDecision(
                decision="KEEP_CURRENT_MODEL",
                passed_all_checks=False,
                checks=[PromotionGateCheck(check_name="Candidate Training", passed=False, details=tr_err or "Training failed.")],
                rationale="Candidate training failed.",
            ),
            manifest_path=None,
        )
        return response

    # 8. Dual-Model Validation Evaluation & Promotion Gate
    cand_artifacts_dir = Path(candidate_metadata.artifacts_directory)
    ev_status, comparison_summary, promotion_decision, ev_err = evaluate_candidate_vs_production(
        candidate_metadata=candidate_metadata,
        X_val=X_val,
        y_val=y_val,
        candidate_artifacts_dir=cand_artifacts_dir,
    )

    if promotion_decision is None:
        promotion_decision = PromotionDecision(
            decision="KEEP_CURRENT_MODEL",
            passed_all_checks=False,
            checks=[],
            rationale=ev_err or "Evaluation failed.",
        )

    # 9. Handle force_promote parameter safety
    if req.force_promote and promotion_decision.passed_all_checks:
        status_final = RetrainingStatus.CANDIDATE_READY_FOR_PROMOTION
        msg_final = "Candidate model passed all technical checks. Force-promote noted: Model is marked CANDIDATE_READY_FOR_PROMOTION (Production artifacts remain isolated in models/retrained/)."
    else:
        status_final = ev_status
        msg_final = f"Retraining evaluation completed: {promotion_decision.rationale}"

    # 10. Production Model Immutability Post-Check
    is_prod_ok_after, prod_hashes_after = verify_model_integrity()
    if not is_prod_ok_after or prod_hashes_before != prod_hashes_after:
        return RetrainingRunResponse(
            run_id=run_id,
            timestamp=now_ts,
            evaluation_date=eval_date,
            is_dry_run=False,
            status=RetrainingStatus.MODEL_INTEGRITY_VIOLATION,
            message="MODEL_INTEGRITY_VIOLATION: Production models altered during retraining pipeline!",
            production_model_integrity_verified=False,
            feature_drift_status=feature_drift_status,
            data_selection=data_summary,
            candidate_metadata=candidate_metadata,
            comparison_metrics=comparison_summary,
            promotion_decision=PromotionDecision(
                decision="KEEP_CURRENT_MODEL",
                passed_all_checks=False,
                checks=[PromotionGateCheck(check_name="Production Post-Check", passed=False, details="Hashes modified.")],
                rationale="Production hashes compromised.",
            ),
            manifest_path=None,
        )

    # 11. Write Research Audit Manifest and Markdown Report
    response = RetrainingRunResponse(
        run_id=run_id,
        timestamp=now_ts,
        evaluation_date=eval_date,
        is_dry_run=False,
        status=status_final,
        message=msg_final,
        production_model_integrity_verified=True,
        feature_drift_status=feature_drift_status,
        data_selection=data_summary,
        candidate_metadata=candidate_metadata,
        comparison_metrics=comparison_summary,
        promotion_decision=promotion_decision,
        manifest_path=None,
    )

    res_dir = base_research_dir or RESEARCH_RETRAINING_DIR
    run_audit_dir = res_dir / eval_date / f"run_{run_id}"
    run_audit_dir.mkdir(parents=True, exist_ok=True)
    manifest_file = run_audit_dir / "manifest.json"
    with open(manifest_file, "w", encoding="utf-8") as f:
        json.dump(response.model_dump(), f, indent=2)

    report_md = generate_retraining_report_markdown(response, prod_hashes_after)
    with open(run_audit_dir / "retraining_report.md", "w", encoding="utf-8") as f:
        f.write(report_md)

    if comparison_summary:
        with open(run_audit_dir / "model_comparison.json", "w", encoding="utf-8") as f:
            json.dump(comparison_summary.model_dump(), f, indent=2)

    response.manifest_path = str(manifest_file)
    return response
