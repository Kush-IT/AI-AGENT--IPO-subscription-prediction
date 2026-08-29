"""
Financial Fundamentals and Valuation Metrics Verification Tool.
Validates restated prospectus financials (Revenue, EBITDA, PAT, EPS, P/E, P/B, Debt/Equity).
"""
from typing import Dict, Any, List, Tuple


def validate_financial_fundamentals(data: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str], List[str]]:
    """
    Validates audited financial statement metrics and valuation ratios.
    """
    errors = []
    warnings = []
    normalized = {}
    
    try:
        # Scale and earnings
        normalized["revenue_latest_cr"] = float(data.get("revenue_latest_cr", 500.0))
        normalized["pat_latest_cr"] = float(data.get("pat_latest_cr", 50.0))
        normalized["operating_cash_flow_cr"] = float(data.get("operating_cash_flow_cr", 40.0))
        
        # Margins & Growth
        normalized["ebitda_margin_pct"] = float(data.get("ebitda_margin_pct", 15.0))
        normalized["revenue_cagr_3yr"] = float(data.get("revenue_cagr_3yr", 18.0))
        normalized["pat_cagr_3yr"] = float(data.get("pat_cagr_3yr", 20.0))
        
        # Capital efficiency & Solvency
        normalized["roe_pct"] = float(data.get("roe_pct", 16.0))
        normalized["roce_pct"] = float(data.get("roce_pct", 18.0))
        normalized["debt_equity_ratio"] = float(data.get("debt_equity_ratio", 0.5))
        normalized["eps_pre_ipo"] = float(data.get("eps_pre_ipo", 12.0))
        
        # Valuation multiples
        pe = float(data.get("pe_ratio", 25.0))
        ind_pe = float(data.get("industry_pe", 30.0))
        normalized["pe_ratio"] = pe
        normalized["industry_pe"] = ind_pe
        normalized["pb_ratio"] = float(data.get("pb_ratio", 3.5))
        
        # Valuation discount vs peers
        # Positive = IPO is cheaper than industry peers; Negative = IPO demands a premium
        val_discount = round(((ind_pe - pe) / ind_pe) * 100.0, 4) if ind_pe > 0 else 0.0
        normalized["valuation_discount_pct"] = float(data.get("valuation_discount_pct", val_discount))
        
        if normalized["pe_ratio"] > 150.0:
            warnings.append(f"High P/E multiple detected: {normalized['pe_ratio']:.1f}x vs Industry {normalized['industry_pe']:.1f}x.")
        if normalized["debt_equity_ratio"] > 3.0:
            warnings.append(f"Elevated Debt/Equity leverage detected: {normalized['debt_equity_ratio']:.2f}.")
            
    except (ValueError, TypeError) as e:
        errors.append(f"Type conversion failure in financial validation: {str(e)}")
        
    return normalized, errors, warnings
