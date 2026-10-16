"""
Automated Test Suite for Retrained Candidate Models and Production Immutability.
Verifies:
1. Candidate artifacts exist in models/retrained/.
2. Frozen production models in models/final_candidates/ match canonical SHA-256 hashes.
3. Candidate manifest is valid and records model metrics.
4. Candidate models execute valid inference using retrained_preprocessor.
"""
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
import pytest

from backend.ml.model_config import ABLATION_GROUPS
from backend.monitoring.prospective_validator import verify_model_integrity, OFFICIAL_MODEL_HASHES

ROOT_DIR = Path(__file__).resolve().parent.parent
RETRAINED_DIR = ROOT_DIR / "models" / "retrained"
FINAL_DIR = ROOT_DIR / "models" / "final_candidates"


def test_frozen_production_models_untouched():
    """Verify that models/final_candidates/ hashes are 100% untouched and match official baseline."""
    is_valid, current_hashes = verify_model_integrity()
    assert is_valid is True
    for filename, expected_hash in OFFICIAL_MODEL_HASHES.items():
        assert current_hashes[filename] == expected_hash, f"Production hash mismatch for {filename}!"


def test_candidate_artifacts_exist():
    """Verify that all 4 retrained candidate models, preprocessor, and manifest exist in models/retrained/."""
    expected_files = [
        "total_candidate.joblib",
        "qib_candidate.joblib",
        "nii_candidate.joblib",
        "retail_candidate.joblib",
        "retrained_preprocessor.joblib",
        "candidate_manifest.json",
    ]
    for filename in expected_files:
        p = RETRAINED_DIR / filename
        assert p.exists(), f"Missing retrained candidate file: {filename}"
        assert p.stat().st_size > 0, f"Empty file: {filename}"


def test_candidate_manifest_structure():
    """Verify candidate_manifest.json contains targets, metrics, and non-empty hashes."""
    manifest_path = RETRAINED_DIR / "candidate_manifest.json"
    assert manifest_path.exists()
    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    
    assert "targets" in manifest
    assert manifest["train_samples"] in [74, 89]
    assert manifest["test_samples"] in [16, 17]
    
    for t in ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]:
        assert t in manifest["targets"]
        cand = manifest["targets"][t]
        assert "sha256" in cand and len(cand["sha256"]) == 64
        assert "validation_metrics" in cand
        assert "test_set_metrics" in cand
        assert cand["test_set_metrics"]["mae"] > 0


def test_candidate_inference_pipeline():
    """Verify candidate preprocessor and candidate models execute valid predictions."""
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    preproc = joblib.load(RETRAINED_DIR / "retrained_preprocessor.joblib")
    
    dummy_df = pd.DataFrame([{
        col: 0.0 for col in feature_cols if col not in ["sector", "market_trend"]
    }])
    dummy_df["sector"] = "IT"
    dummy_df["market_trend"] = "BULLISH"
    dummy_df["price_high"] = 500.0
    dummy_df["price_low"] = 475.0
    dummy_df["issue_size_in_crore"] = 1000.0
    
    X = preproc.transform(dummy_df, feature_cols)
    assert X.shape[1] == 45
    
    for filename in ["total_candidate.joblib", "qib_candidate.joblib", "nii_candidate.joblib", "retail_candidate.joblib"]:
        model = joblib.load(RETRAINED_DIR / filename)
        pred = model.predict(X)
        assert len(pred) == 1
