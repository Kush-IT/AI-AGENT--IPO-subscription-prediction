"""
Category Analysis & Recommendation Agent Node.
Evaluates relative demand across investor classes and computes model confidence.
"""
from typing import Dict, Any, List
from backend.agents.state import IPOState


def category_analysis_node(state: IPOState) -> Dict[str, Any]:
    """
    Analyzes category-wise subscription predictions, determines relative strength,
    identifies strongest/weakest segments, and calculates evidence-based confidence.
    """
    if state.get("status") in ["VALIDATION_FAILED", "PREDICTION_FAILED"]:
        return state
        
    preds = state.get("predictions", {})
    warnings = list(state.get("warnings", []))
    errors = list(state.get("errors", []))
    feature_meta = state.get("feature_metadata", {})
    
    # Extract predicted multiples
    qib_pred = preds.get("qib_subscription", {}).get("predicted_multiple", 0.0)
    nii_pred = preds.get("nii_subscription", {}).get("predicted_multiple", 0.0)
    retail_pred = preds.get("retail_subscription", {}).get("predicted_multiple", 0.0)
    total_pred = preds.get("total_subscription", {}).get("predicted_multiple", 0.0)
    
    category_multiples = {
        "QIB": qib_pred,
        "NII": nii_pred,
        "RETAIL": retail_pred
    }
    
    # Sort categories by multiple
    sorted_cats = sorted(category_multiples.items(), key=lambda x: x[1], reverse=True)
    strongest_cat = sorted_cats[0][0]
    weakest_cat = sorted_cats[-1][0]
    
    # Determine best category recommendation
    # Check if top category leads second by at least 15% margin
    top_val = sorted_cats[0][1]
    second_val = sorted_cats[1][1]
    
    if top_val > 0 and (top_val / max(second_val, 0.1)) >= 1.15:
        best_category = strongest_cat
        edge_rationale = f"{strongest_cat} exhibits the strongest relative predicted demand ({top_val:.2f}x vs {second_val:.2f}x next highest)."
    else:
        best_category = "NO_CLEAR_EDGE"
        edge_rationale = f"Demand multiples across {sorted_cats[0][0]} ({top_val:.2f}x) and {sorted_cats[1][0]} ({second_val:.2f}x) are within narrow parity bounds."
        
    category_assessment = {
        "strongest_predicted_category": strongest_cat,
        "weakest_predicted_category": weakest_cat,
        "recommended_category": best_category,
        "category_ranking": [
            {"rank": idx + 1, "category": cat, "predicted_multiple": mult}
            for idx, (cat, mult) in enumerate(sorted_cats)
        ],
        "edge_rationale": edge_rationale,
        "disclaimer": "Model-based category assessment only. Not investment or financial advice."
    }
    
    # -------------------------------------------------------------
    # Multi-Factor Confidence Estimation (Evidence-Based)
    # -------------------------------------------------------------
    missing_count = feature_meta.get("missing_features_imputed_count", 0)
    confidence_reasons = []
    # Defensible econometric baseline: Max ex-ante confidence starts at 82% reflecting test set R2 and market variance
    confidence_score = 82
    
    # 1. Prediction magnitude vs historical distribution
    # Historical Total Subscription 90th percentile is ~90x
    if total_pred > 120.0 or nii_pred > 200.0:
        confidence_score -= 20
        confidence_reasons.append(f"Predicted total ({total_pred:.1f}x) or NII ({nii_pred:.1f}x) is in extreme historical tail; wide prediction interval applies.")
    elif total_pred > 60.0:
        confidence_score -= 8
        confidence_reasons.append("Moderate oversubscription prediction with standard historical coverage.")
    else:
        confidence_reasons.append("Predicted subscription falls well within dense historical training distribution.")
        
    # 2. Missing/Imputed features
    if missing_count > 3:
        confidence_score -= 22
        confidence_reasons.append(f"Multiple features ({missing_count}) were absent and defaulted to domain neutrals.")
    elif missing_count > 0:
        confidence_score -= 8
        confidence_reasons.append(f"{missing_count} minor feature(s) defaulted to neutrals.")
    else:
        confidence_reasons.append("Zero missing features; complete pre-IPO dataset provided.")
        
    # 3. Model validation baseline
    confidence_reasons.append("Total model validated on 2024 test set (R² = +0.674, Test MAE = 17.47x).")
    
    if confidence_score >= 75:
        confidence_level = "HIGH"
    elif confidence_score >= 55:
        confidence_level = "MEDIUM"
    else:
        confidence_level = "LOW"
        
    confidence = {
        "confidence_level": confidence_level,
        "confidence_score": confidence_score,
        "justification_factors": confidence_reasons
    }
    
    return {
        "category_assessment": category_assessment,
        "confidence": confidence,
        "warnings": warnings,
        "errors": errors,
        "status": "CATEGORY_ANALYZED"
    }
