"""
Phase 8 SHAP Explainability, Feature Attribution, and API Integration Test Suite.
"""
from pathlib import Path
import json
import numpy as np
import pandas as pd
from backend.ml.explainer import (
    SHAPExplainerEngine,
    get_explainer,
    get_global_feature_importance,
    explain_ipo_prediction,
    get_top_positive_features,
    get_top_negative_features
)
from backend.ml.features import TARGET_COLUMNS

DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"


def test_explainer_initialization_and_models_loaded():
    """Verify that SHAPExplainerEngine initializes and loads all 4 frozen candidate models."""
    engine = get_explainer()
    assert engine.is_initialized is True
    assert len(engine.models) == 4
    assert len(engine.explainers) == 4
    for target in TARGET_COLUMNS:
        assert target in engine.models
        assert target in engine.explainers


def test_shap_output_shape_and_dimensions():
    """Verify that computed SHAP matrices match input sample count and feature dimension."""
    engine = get_explainer()
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    X_mat = engine.get_preprocessed_matrix(feat_df)
    
    assert X_mat.shape == (106, len(engine.feature_cols))
    
    for target in TARGET_COLUMNS:
        shap_vals = engine.compute_shap_values(X_mat, target)
        assert shap_vals.shape == (106, len(engine.feature_cols)), f"SHAP shape mismatch for {target}"
        assert not np.isnan(shap_vals).any(), f"NaNs detected in SHAP values for {target}"


def test_feature_alignment_and_no_missing_names():
    """Verify that global SHAP feature importances match feature names exactly."""
    for target in TARGET_COLUMNS:
        global_imp = get_global_feature_importance(target, top_k=None)
        assert len(global_imp) == 45, f"Expected 45 feature importances for {target}, got {len(global_imp)}"
        
        # Verify rank ordering
        ranks = [r["rank"] for r in global_imp]
        assert ranks == list(range(1, 46)), f"Incorrect ranking order for {target}"
        assert global_imp[0]["mean_abs_shap"] >= global_imp[-1]["mean_abs_shap"]


def test_local_explanation_generation_and_schema():
    """Verify that explain_ipo_prediction produces structured, valid attributions."""
    sample_ipo = "IPO_2024_001" # Jyoti CNC
    for target in TARGET_COLUMNS:
        exp = explain_ipo_prediction(sample_ipo, target)
        
        assert exp["ipo_id"] == sample_ipo
        assert exp["target"] == target
        assert "predicted_subscription" in exp
        assert "top_positive_contributors" in exp
        assert "top_negative_contributors" in exp
        assert len(exp["top_positive_contributors"]) <= 5
        assert len(exp["top_negative_contributors"]) <= 5
        
        # Check that top positive features have positive shap values
        for f in exp["top_positive_contributors"]:
            assert f["shap_value"] > 0
            assert f["direction"] == "positive"
            
        # Check that top negative features have negative shap values
        for f in exp["top_negative_contributors"]:
            assert f["shap_value"] < 0
            assert f["direction"] == "negative"


def test_json_serialization_of_explanations():
    """Verify that explanation outputs serialize cleanly to JSON for API consumption."""
    engine = get_explainer()
    multi_exp = engine.get_all_targets_explanation("IPO_2024_002")
    serialized = json.dumps(multi_exp)
    deserialized = json.loads(serialized)
    assert len(deserialized) == 4
    for target in TARGET_COLUMNS:
        assert target in deserialized
        assert "actual_subscription" in deserialized[target]
        assert "predicted_subscription" in deserialized[target]


def test_non_causal_wording_integrity():
    """Verify that attributions use observational wording ('contributed') rather than causal ('caused')."""
    exp = explain_ipo_prediction("IPO_2024_003", "total_subscription")
    for fa in exp["all_feature_attributions"]:
        stmt = fa["attribution_statement"]
        assert "contributed" in stmt.lower()
        assert "caused" not in stmt.lower()


def test_shap_metadata_files_exist_and_consistent():
    """Verify that all required Phase 8 metadata CSV files exist and have valid rows."""
    expected_files = [
        METADATA_DIR / "shap_global_importance.csv",
        METADATA_DIR / "shap_feature_rankings.csv",
        METADATA_DIR / "shap_local_explanations.csv",
        METADATA_DIR / "importance_comparison.csv",
        METADATA_DIR / "shap_stability.csv"
    ]
    for filepath in expected_files:
        assert filepath.exists(), f"Missing metadata file: {filepath}"
        df = pd.read_csv(filepath)
        assert len(df) > 0, f"File {filepath} is empty"


def test_figure_artifacts_generated():
    """Verify that high-resolution visual figure artifacts exist in docs/research/figures/."""
    figures_dir = Path(__file__).parent.parent / "docs" / "research" / "figures"
    expected_figures = [
        figures_dir / "shap_summary_total.png",
        figures_dir / "shap_summary_qib.png",
        figures_dir / "shap_summary_nii.png",
        figures_dir / "shap_summary_retail.png",
        figures_dir / "shap_importance_comparison.png",
        figures_dir / "shap_dependence_gmp.png",
        figures_dir / "shap_dependence_issue_size.png",
        figures_dir / "shap_waterfall_sample.png"
    ]
    for fig_path in expected_figures:
        assert fig_path.exists(), f"Missing figure file: {fig_path}"
        assert fig_path.stat().st_size > 5000, f"Figure file {fig_path} is suspiciously small"
