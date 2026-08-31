"""
Weekly Rolling Retraining CLI for IPO Subscription AI Platform.
Evaluates completed Mainboard IPOs from the trailing 30-day window,
validates data readiness, executes candidate XGBoost training,
and evaluates candidate vs production models.
"""
from typing import Optional
from pathlib import Path
from datetime import datetime, timezone
import argparse
import sys

ROOT_DIR = Path(__file__).parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.retraining.retraining_manager import run_weekly_retraining
from backend.retraining.schemas import (
    RetrainingRunRequest,
    RetrainingStatus,
)


def main():
    parser = argparse.ArgumentParser(
        description="Weekly Rolling Retraining CLI for IPO Subscription AI Platform."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=True,
        help="Run data selection and validation without modifying artifacts (default: True)",
    )
    parser.add_argument(
        "--no-dry-run",
        action="store_false",
        dest="dry_run",
        help="Execute full candidate training and validation pipeline",
    )
    parser.add_argument(
        "--date",
        type=str,
        default=None,
        help="Evaluation date in YYYY-MM-DD format (defaults to current date)",
    )
    parser.add_argument(
        "--min-samples",
        type=int,
        default=10,
        help="Minimum required completed IPO observations (default: 10)",
    )
    parser.add_argument(
        "--force-promote",
        action="store_true",
        default=False,
        help="Mark candidate as ready for promotion if all technical checks pass",
    )

    args = parser.parse_args()

    # Validate date format if provided
    if args.date:
        try:
            datetime.strptime(args.date.strip(), "%Y-%m-%d")
        except ValueError:
            print(f"ERROR: Invalid date format '{args.date}'. Expected YYYY-MM-DD.")
            sys.exit(1)

    eval_date = args.date or datetime.now(timezone.utc).strftime("%Y-%m-%d")

    req = RetrainingRunRequest(
        run_date=eval_date,
        dry_run=args.dry_run,
        min_samples=args.min_samples,
        force_promote=args.force_promote,
    )

    try:
        response = run_weekly_retraining(request=req)

        print("==================================================")
        print("WEEKLY ROLLING RETRAINING")
        print("==================================================")
        print(f"Run ID:                 {response.run_id}")
        print(f"Evaluation Date:        {response.evaluation_date}")
        print(f"Dry Run:                {'Enabled' if response.is_dry_run else 'Disabled'}")
        print(f"Minimum Samples:        {response.data_selection.minimum_sample_threshold}")
        print()
        print(f"Production Integrity:   {'VERIFIED' if response.production_model_integrity_verified else 'FAILED'}")
        print(f"Feature Drift:          {response.feature_drift_status.get('overall_feature_drift_level', 'LOW')}")
        print(f"Rolling Window:         {response.data_selection.window_start_date} -> {response.data_selection.window_end_date}")
        print()
        print(f"Candidates Examined:    {response.data_selection.total_candidates_found}")
        print(f"Eligible IPOs:          {response.data_selection.eligible_count}")
        print(f"Rejected IPOs:          {response.data_selection.rejected_count}")
        print()
        print(f"Training N:             {response.data_selection.training_sample_count}")
        print(f"Validation N:           {response.data_selection.validation_sample_count}")
        print()
        print(f"Status:                 {response.status.value}")
        print(f"Candidate:              {'CREATED' if response.candidate_metadata else 'NONE'}")
        print(f"Promotion:              {response.promotion_decision.decision}")
        print(f"Manifest:               {response.manifest_path or 'N/A'}")
        print("==================================================")

        if response.status not in [
            RetrainingStatus.CANDIDATE_READY_FOR_PROMOTION,
            RetrainingStatus.CANDIDATE_VALIDATED,
            RetrainingStatus.INSUFFICIENT_SAMPLE_SIZE,
        ]:
            print(f"Notice: {response.message}")

    except Exception as e:
        print(f"ERROR: Execution failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
