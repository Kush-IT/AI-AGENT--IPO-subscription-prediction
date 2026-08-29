"""
Prediction Agent Node.
Executes inference on frozen candidate models and returns subscription multiples on natural scale.
"""
from typing import Dict, Any
from backend.agents.state import IPOState
from backend.tools.prediction_tool import PredictionTool

_PRED_TOOL_INSTANCE = None

def get_prediction_tool():
    global _PRED_TOOL_INSTANCE
    if _PRED_TOOL_INSTANCE is None:
        _PRED_TOOL_INSTANCE = PredictionTool()
    return _PRED_TOOL_INSTANCE


def prediction_node(state: IPOState) -> Dict[str, Any]:
    """
    Executes model predictions across all 4 category subscription targets.
    """
    if state.get("status") == "VALIDATION_FAILED":
        return state
        
    features = state.get("features", {})
    warnings = list(state.get("warnings", []))
    errors = list(state.get("errors", []))
    
    try:
        pred_tool = get_prediction_tool()
        predictions, p_warn = pred_tool.predict_all_targets(features)
        warnings.extend(p_warn)
        status = "PREDICTIONS_GENERATED"
    except Exception as e:
        errors.append(f"Prediction execution failure: {str(e)}")
        predictions = {}
        status = "PREDICTION_FAILED"
        
    return {
        "predictions": predictions,
        "warnings": warnings,
        "errors": errors,
        "status": status
    }
