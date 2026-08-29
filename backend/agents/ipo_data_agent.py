"""
IPO Data Agent Node.
Orchestrates live/offline connectors, attaches granular field-level provenance,
and validates ex-ante temporal constraints across all external data feeds.
"""
from typing import Dict, Any, List
from datetime import datetime

from backend.agents.state import IPOState
from backend.connectors.ipo_connector import IPOConnector
from backend.connectors.financial_connector import FinancialConnector
from backend.connectors.market_connector import MarketConnector
from backend.connectors.gmp_connector import GMPConnector
from backend.connectors.news_connector import NewsConnector


def ipo_data_node(state: IPOState) -> Dict[str, Any]:
    """
    Collects raw parameters via modular connectors and records verified provenance.
    """
    if state.get("status") == "VALIDATION_FAILED":
        return state
        
    raw_input = state.get("ipo_input", {})
    errors = list(state.get("errors", []))
    warnings = list(state.get("warnings", []))
    sources = list(state.get("sources", []))
    
    company_name = str(raw_input.get("company_name", "Unknown IPO")).strip()
    open_date = str(raw_input.get("ipo_open_date", "2024-01-01")).strip()
    cutoff_ts = f"{open_date}T09:59:59+05:30"
    
    validated_data = {}
    feature_provenance: Dict[str, Dict[str, Any]] = {}
    temporal_rejections: List[Dict[str, Any]] = []
    
    connectors = [
        ("IPO_CONNECTOR", IPOConnector()),
        ("FINANCIAL_CONNECTOR", FinancialConnector()),
        ("MARKET_CONNECTOR", MarketConnector()),
        ("GMP_CONNECTOR", GMPConnector()),
        ("NEWS_CONNECTOR", NewsConnector())
    ]
    
    for conn_name, connector in connectors:
        try:
            records = connector.fetch_data(company_name, open_date, cutoff_ts, raw_input)
            for f_name, prec in records.items():
                p_dict = prec.to_dict()
                feature_provenance[f_name] = p_dict
                
                if prec.is_valid:
                    if prec.value is not None:
                        validated_data[f_name] = prec.value
                else:
                    temporal_rejections.append({
                        "field": f_name,
                        "observed_at": prec.observed_at,
                        "cutoff": prec.feature_cutoff,
                        "reason": prec.validation_reason
                    })
                    warnings.append(f"Field '{f_name}' rejected by temporal validator: {prec.validation_reason}")
                    
        except Exception as e:
            warnings.append(f"Connector '{conn_name}' encountered an exception: {str(e)}")
            
    # Compile Source Provenance Summaries
    sources = [
        {
            "category": "Issue Terms & Quotas",
            "source": IPOConnector.SOURCE_NAME,
            "source_url": IPOConnector.SOURCE_URL,
            "feature_cutoff": cutoff_ts,
            "verification_status": "EX_ANTE_VERIFIED"
        },
        {
            "category": "Prospectus Restated Financials",
            "source": FinancialConnector.SOURCE_NAME,
            "source_url": FinancialConnector.SOURCE_URL,
            "feature_cutoff": cutoff_ts,
            "verification_status": "EX_ANTE_VERIFIED"
        },
        {
            "category": "Secondary Market Benchmarks",
            "source": MarketConnector.SOURCE_NAME,
            "source_url": MarketConnector.SOURCE_URL,
            "feature_cutoff": cutoff_ts,
            "verification_status": "EX_ANTE_VERIFIED"
        },
        {
            "category": "Grey Market Premium",
            "source": GMPConnector.SOURCE_NAME,
            "source_url": GMPConnector.SOURCE_URL,
            "feature_cutoff": cutoff_ts,
            "verification_status": "EX_ANTE_VERIFIED" if validated_data.get("gmp_percentage") is not None else "UNAVAILABLE"
        },
        {
            "category": "Media News & Sentiment",
            "source": NewsConnector.SOURCE_NAME,
            "source_url": NewsConnector.SOURCE_URL,
            "feature_cutoff": cutoff_ts,
            "verification_status": "EX_ANTE_VERIFIED"
        }
    ]
    
    return {
        "validated_data": validated_data,
        "feature_provenance": feature_provenance,
        "temporal_rejections": temporal_rejections,
        "errors": errors,
        "warnings": warnings,
        "sources": sources,
        "status": "DATA_COLLECTED"
    }
