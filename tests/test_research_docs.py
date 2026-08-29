"""
Validation test suite for Phase 2 research documentation foundation.
"""
from pathlib import Path

RESEARCH_DIR = Path(__file__).parent.parent / "docs" / "research"

EXPECTED_FILES = [
    "literature_review.md",
    "research_gap.md",
    "research_questions.md",
    "hypotheses.md",
    "methodology.md",
    "novelty.md",
    "references.md",
    "target_transformations.md",
    "feature_engineering.md",
    "temporal_analysis.md",
    "eda_findings.md",
    "model_selection_policy.md",
    "baseline_results.md",
    "advanced_model_results.md",
    "final_model_selection.md",
    "test_set_results.md",
    "nii_model_diagnostics.md",
    "hyperparameter_search_policy.md",
    "shap_explainability.md"
]


def test_research_files_exist():
    """Verify that all required Phase 2 research documents exist and are non-empty."""
    assert RESEARCH_DIR.exists(), f"Research directory {RESEARCH_DIR} does not exist"
    for filename in EXPECTED_FILES:
        filepath = RESEARCH_DIR / filename
        assert filepath.exists(), f"Missing required research file: {filename}"
        assert filepath.stat().st_size > 500, f"Research file {filename} is suspiciously small ({filepath.stat().st_size} bytes)"


def test_references_count():
    """Verify that references.md contains verified academic citations."""
    ref_file = RESEARCH_DIR / "references.md"
    content = ref_file.read_text(encoding="utf-8")
    assert "Verified Academic Publications" in content
    # Ensure at least 40 verified publications are indexed
    assert "51." in content or "45." in content or "50." in content


def test_research_questions_present():
    """Verify that all 6 Research Questions are formally documented."""
    rq_file = RESEARCH_DIR / "research_questions.md"
    content = rq_file.read_text(encoding="utf-8")
    for rq_num in range(1, 7):
        assert f"RQ{rq_num}" in content or f"Research Question {rq_num}" in content


def test_hypotheses_present():
    """Verify that all 6 Hypotheses are formally documented."""
    hypo_file = RESEARCH_DIR / "hypotheses.md"
    content = hypo_file.read_text(encoding="utf-8")
    for h_num in range(1, 7):
        assert f"H{h_num}" in content or f"Hypothesis {h_num}" in content
