"""
Standalone Leakage Audit Executable Script.
Runs anti-leakage verification across all processed training data tables.
"""
import sys
from pathlib import Path
import pandas as pd

ROOT_DIR = Path(__file__).parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.ml.leakage import generate_leakage_report

DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def run_full_leakage_audit():
    """Runs leakage audit on processed IPO datasets."""
    training_file = PROCESSED_DIR / "ipo_training.csv"
    if not training_file.exists():
        from backend.ml.preprocessing import build_processed_datasets
        build_processed_datasets()
        
    df = pd.read_csv(training_file)
    audit_report = generate_leakage_report(df, METADATA_DIR / "leakage_audit.csv")
    
    # Check violations
    violations = audit_report[audit_report["leakage_detected"] == True]
    if len(violations) > 0:
        print(f"CRITICAL LEAKAGE DETECTED! {len(violations)} violations found:")
        print(violations[["ipo_id", "feature_name", "reason"]])
        raise RuntimeError("Dataset failed anti-leakage audit.")
    else:
        print(f"PASS: Zero leakage violations detected across {len(df)} historical IPO records.")
        
    return audit_report


if __name__ == "__main__":
    run_full_leakage_audit()
