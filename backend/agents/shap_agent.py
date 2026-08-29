"""
SHAP Explanation Agent Node.
Computes additive feature attributions and synthesizes positive/negative factor drivers.
"""
from typing import Dict, Any
from backend.agents.state import IPOState
from backend.tools.shap_tool import explain_prediction_features


def shap_explanation_node(state: IPOState) -> Dict[str, Any]:
    """
    Computes local SHAP feature attributions and driver groupings for the prediction.
    """
    if state.get("status") in ["VALIDATION_FAILED", "PREDICTION_FAILED"]:
        return state
        
    features = state.get("features", {})
    warnings = list(state.get("warnings", []))
    errors = list(state.get("errors", []))
    
    try:
        shap_exps = explain_prediction_features(features)
        status = "SHAP_EXPLAINED"
    except Exception as e:
        warnings.append(f"SHAP explanation failed: {str(e)}")
        shap_exps = {}
        status = "SHAP_FAILED"
        
    return {
        "shap_explanations": shap_exps,
        "warnings": warnings,
        "errors": errors,
        "status": status
    }
