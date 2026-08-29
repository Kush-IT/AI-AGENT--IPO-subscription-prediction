"""
SHAP Attribution Tool for Single IPO Feature Explanations.
Computes positive and negative feature attributions using the TreeSHAP engine.
"""
from typing import Dict, Any, List
import pandas as pd
import numpy as np

from backend.ml.explainer import get_explainer
from backend.ml.features import TARGET_COLUMNS


def explain_prediction_features(feature_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes local SHAP attributions and groups correlated feature drivers.
    Uses observational language ('contributed positively/negatively').
    """
    engine = get_explainer()
    df_dict = {}
    for col in engine.feature_cols:
        if col in feature_dict and feature_dict[col] is not None:
            df_dict[col] = feature_dict[col]
        else:
            if col == "sector":
                df_dict[col] = "Other"
            elif col == "market_trend":
                df_dict[col] = "BULLISH"
            else:
                df_dict[col] = 0.0
                
    df = pd.DataFrame([df_dict])
    X_mat = engine.get_preprocessed_matrix(df)
    
    explanations = {}
    
    for target in TARGET_COLUMNS:
        explainer = engine.explainers[target]
        shap_vals = engine.compute_shap_values(X_mat, target)[0]
        
        expected_raw = explainer.expected_value
        base_val = float(expected_raw[0]) if isinstance(expected_raw, (list, np.ndarray)) else float(expected_raw)
        
        attributions = []
        for idx, f_name in enumerate(engine.feature_cols):
            f_val = feature_dict.get(f_name, 0.0)
            val_display = round(float(f_val), 4) if isinstance(f_val, (int, float, np.number)) else str(f_val)
            s_val = float(shap_vals[idx])
            
            attributions.append({
                "feature": f_name,
                "feature_value": val_display,
                "shap_value": round(s_val, 6),
                "abs_shap_value": round(abs(s_val), 6),
                "direction": "positive" if s_val > 0 else ("negative" if s_val < 0 else "neutral"),
                "attribution_statement": (
                    f"{f_name} ({val_display}) contributed positively to the model prediction by {s_val:+.4f}"
                    if s_val > 0 else
                    f"{f_name} ({val_display}) contributed negatively to the model prediction by {s_val:+.4f}"
                )
            })
            
        attributions.sort(key=lambda x: x["abs_shap_value"], reverse=True)
        top_pos = [f for f in attributions if f["direction"] == "positive"][:5]
        top_neg = [f for f in attributions if f["direction"] == "negative"][:5]
        
        # Correlated feature groupings
        gmp_group_shap = sum(f["shap_value"] for f in attributions if f["feature"] in ["gmp_percentage", "gmp_in_inr"])
        size_group_shap = sum(f["shap_value"] for f in attributions if f["feature"] in ["issue_size_in_crore", "issue_size_log"])
        sentiment_group_shap = sum(f["shap_value"] for f in attributions if f["feature"] in ["positive_news_ratio", "negative_news_ratio", "average_sentiment_score"])
        
        explanations[target] = {
            "base_value": round(base_val, 4),
            "top_positive_contributors": top_pos,
            "top_negative_contributors": top_neg,
            "grouped_driver_impacts": {
                "grey_market_premium": {
                    "total_shap_impact": round(gmp_group_shap, 4),
                    "direction": "positive" if gmp_group_shap > 0 else "negative"
                },
                "issue_scale_friction": {
                    "total_shap_impact": round(size_group_shap, 4),
                    "direction": "positive" if size_group_shap > 0 else "negative"
                },
                "news_sentiment": {
                    "total_shap_impact": round(sentiment_group_shap, 4),
                    "direction": "positive" if sentiment_group_shap > 0 else "negative"
                }
            }
        }
        
    return explanations
