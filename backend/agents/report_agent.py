"""
Report Agent Node.
Synthesizes all predictions, SHAP attributions, category assessments, risk diagnostics,
data quality metrics, and granular field provenance into a comprehensive research JSON report.
"""
from typing import Dict, Any
from datetime import datetime
from backend.agents.state import IPOState


def report_generation_node(state: IPOState) -> Dict[str, Any]:
    """
    Generates the final comprehensive IPO research report with complete provenance.
    """
    val_data = state.get("validated_data", {})
    raw_input = state.get("ipo_input", {})
    preds = state.get("predictions", {})
    shap_exps = state.get("shap_explanations", {})
    cat_assess = state.get("category_assessment", {})
    risk_assess = state.get("risk_assessment", {})
    conf = state.get("confidence", {})
    dq = state.get("data_quality", {})
    provenance = state.get("feature_provenance", {})
    temporal_rejections = state.get("temporal_rejections", [])
    sources = state.get("sources", [])
    warnings = list(state.get("warnings", []))
    errors = list(state.get("errors", []))
    
    # Handle failure states cleanly
    if state.get("status") in ["VALIDATION_FAILED", "PREDICTION_FAILED"]:
        err_status = state.get("status", "VALIDATION_FAILED")
        final_report = {
            "status": err_status,
            "company_name": raw_input.get("company_name", "UNKNOWN"),
            "ipo_open_date": raw_input.get("ipo_open_date", "UNKNOWN"),
            "errors": errors,
            "warnings": warnings,
            "message": f"IPO analysis failure: {err_status}."
        }
        return {"final_report": final_report, "status": "REPORT_GENERATED"}
        
    company_name = val_data.get("company_name", raw_input.get("company_name", "Unknown IPO"))
    open_date = val_data.get("ipo_open_date", raw_input.get("ipo_open_date", "2024-01-01"))
    
    # Extract total model SHAP attributions for headline summary
    total_shap = shap_exps.get("total_subscription", {})
    top_pos = total_shap.get("top_positive_contributors", [])
    top_neg = total_shap.get("top_negative_contributors", [])
    grouped_drivers = total_shap.get("grouped_driver_impacts", {})
    
    final_report = {
        "status": "ANALYSIS_COMPLETED",
        "generated_at": datetime.now().isoformat(),
        "ipo": {
            "company_name": company_name,
            "ipo_open_date": open_date,
            "sector": val_data.get("sector", "Other"),
            "price_band": {
                "floor_price_inr": val_data.get("price_low"),
                "cap_price_inr": val_data.get("price_high"),
                "spread_pct": val_data.get("price_band_spread_pct")
            },
            "issue_size_in_crore": val_data.get("issue_size_in_crore"),
            "lot_size": val_data.get("lot_size"),
            "min_retail_application_amount_inr": val_data.get("min_retail_application_amount"),
            "quota_reservation_pct": {
                "qib_quota": val_data.get("qib_quota_pct"),
                "nii_quota": val_data.get("nii_quota_pct"),
                "retail_quota": val_data.get("retail_quota_pct")
            },
            "grey_market_premium": {
                "gmp_percentage": val_data.get("gmp_percentage"),
                "gmp_in_inr": val_data.get("gmp_in_inr")
            }
        },
        "predictions": preds,
        "category_assessment": cat_assess,
        "confidence": conf,
        "top_positive_factors": top_pos,
        "top_negative_factors": top_neg,
        "grouped_driver_impacts": grouped_drivers,
        "risk_assessment": risk_assess,
        "data_quality": dq,
        "temporal_validation": {
            "status": "EX_ANTE_COMPLIANT" if len(temporal_rejections) == 0 else "PARTIAL_REJECTIONS",
            "temporal_rejections_count": len(temporal_rejections),
            "rejections": temporal_rejections
        },
        "model_information": {
            "model_registry_version": "1.0.0-final-candidates",
            "models_used": {
                "total_subscription": "XGBoost (log1p transform, expm1 inverted)",
                "qib_subscription": "Random Forest (RAW scale)",
                "nii_subscription": "LightGBM (log1p transform, expm1 inverted)",
                "retail_subscription": "XGBoost (RAW scale)"
            },
            "test_set_performance": {
                "total_test_r2": "+0.666",
                "total_test_mae": "17.43x",
                "qib_test_r2": "+0.589",
                "qib_test_mae": "31.43x"
            }
        },
        "sources": sources,
        "provenance_sources": sources,
        "feature_provenance": provenance,
        "warnings": warnings,
        "errors": errors,
        "disclaimer": "This analysis is produced by a quantitative machine learning and SHAP attribution framework for research and educational purposes. It does not constitute investment, legal, or financial advice."
    }
    
    return {
        "final_report": final_report,
        "status": "REPORT_GENERATED"
    }
