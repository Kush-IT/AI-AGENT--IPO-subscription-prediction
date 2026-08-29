"""
Feature Preparation Agent Node.
Integrates historical expanding demand lookups, prepares the 45-feature matrix,
and calculates comprehensive data quality and completeness diagnostics.
"""
from typing import Dict, Any, List
from backend.agents.state import IPOState
from backend.connectors.historical_connector import HistoricalConnector
from backend.ml.model_config import ABLATION_GROUPS


def feature_preparation_node(state: IPOState) -> Dict[str, Any]:
    """
    Assembles the 45-feature pre-IPO matrix, attaches historical demand provenance,
    and computes data quality completeness metrics.
    """
    if state.get("status") in ["VALIDATION_FAILED"]:
        return state
        
    val_data = state.get("validated_data", {})
    raw_input = state.get("ipo_input", {})
    feature_provenance = dict(state.get("feature_provenance", {}))
    temporal_rejections = list(state.get("temporal_rejections", []))
    warnings = list(state.get("warnings", []))
    errors = list(state.get("errors", []))
    
    company_name = str(val_data.get("company_name", raw_input.get("company_name", "Unknown IPO"))).strip()
    open_date = str(val_data.get("ipo_open_date", raw_input.get("ipo_open_date", "2024-01-01"))).strip()
    cutoff_ts = f"{open_date}T09:59:59+05:30"
    
    # 1. Historical past-only demand lookup
    hist_conn = HistoricalConnector()
    hist_records = hist_conn.fetch_data(company_name, open_date, cutoff_ts, val_data)
    
    for f_name, prec in hist_records.items():
        feature_provenance[f_name] = prec.to_dict()
        if prec.is_valid and prec.value is not None:
            val_data[f_name] = prec.value
            
    # 2. Build 45-feature pre-IPO vector
    expected_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    features = {}
    missing_fields = []
    
    for col in expected_cols:
        if col in val_data and val_data[col] is not None:
            features[col] = val_data[col]
        else:
            missing_fields.append(col)
            # Apply domain-neutral default with provenance note
            if col == "sector":
                default_val = str(val_data.get("sector", raw_input.get("sector", "Other"))).strip()
            elif col == "market_trend":
                default_val = str(val_data.get("market_trend", raw_input.get("market_trend", "BULLISH"))).strip()
            else:
                default_val = 0.0
            features[col] = default_val
            warnings.append(f"Feature '{col}' was unavailable prior to cutoff; imputed with domain neutral default ({default_val}).")
            if col not in feature_provenance:
                feature_provenance[col] = {
                    "field": col,
                    "value": default_val,
                    "source": "Domain Imputation Default",
                    "source_url": "N/A",
                    "observed_at": cutoff_ts,
                    "feature_cutoff": cutoff_ts,
                    "status": "IMPUTED_DEFAULT",
                    "validation_status": "EX_ANTE_VALID"
                }
                
    # 3. Data Quality & Completeness Scoring
    total_features_count = len(expected_cols)
    available_features_count = total_features_count - len(missing_fields)
    completeness_pct = round((available_features_count / total_features_count) * 100.0, 2)
    
    dq_score = max(0, int(100 - (len(missing_fields) * 4) - (len(temporal_rejections) * 10)))
    
    data_quality_report = {
        "source_count": len(state.get("sources", [])),
        "total_features_count": total_features_count,
        "available_features_count": available_features_count,
        "missing_fields_count": len(missing_fields),
        "missing_fields": missing_fields,
        "temporal_rejections_count": len(temporal_rejections),
        "temporal_rejections": temporal_rejections,
        "feature_completeness_pct": completeness_pct,
        "data_quality_score": dq_score,
        "data_quality_tier": "EXCELLENT" if dq_score >= 85 else ("ACCEPTABLE" if dq_score >= 65 else "DEGRADED"),
        "temporal_compliance": "STRICT_EX_ANTE (Cutoff: 09:59:59 IST on Open Date)"
    }
    
    feature_metadata = {
        "feature_count": total_features_count,
        "feature_cutoff_timestamp": cutoff_ts,
        "temporal_validity": "STRICT_EX_ANTE",
        "missing_features_imputed_count": len(missing_fields)
    }
    
    return {
        "features": features,
        "feature_metadata": feature_metadata,
        "feature_provenance": feature_provenance,
        "data_quality": data_quality_report,
        "warnings": warnings,
        "errors": errors,
        "status": "FEATURES_PREPARED"
    }
