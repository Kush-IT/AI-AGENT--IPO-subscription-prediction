"""
Risk Analysis Agent Node.
Audits financial solvency, valuation disparity, issue scale friction, and macro market vulnerabilities.
"""
from typing import Dict, Any, List
from backend.agents.state import IPOState


def risk_analysis_node(state: IPOState) -> Dict[str, Any]:
    """
    Evaluates multi-dimensional investment and modeling risk factors.
    """
    if state.get("status") in ["VALIDATION_FAILED", "PREDICTION_FAILED"]:
        return state
        
    features = state.get("features", {})
    preds = state.get("predictions", {})
    warnings = list(state.get("warnings", []))
    errors = list(state.get("errors", []))
    
    risk_factors: List[Dict[str, str]] = []
    risk_points = 0
    
    # 1. Valuation Risk
    pe = float(features.get("pe_ratio", 25.0))
    ind_pe = float(features.get("industry_pe", 30.0))
    val_disc = float(features.get("valuation_discount_pct", 0.0))
    
    if pe > 60.0 or val_disc < -40.0:
        risk_points += 25
        risk_factors.append({
            "risk_type": "VALUATION_PREMIUM_RISK",
            "severity": "HIGH",
            "description": f"Asking P/E multiple ({pe:.1f}x) demands a substantial premium over industry peers ({ind_pe:.1f}x)."
        })
    elif pe > 40.0 or val_disc < -15.0:
        risk_points += 15
        risk_factors.append({
            "risk_type": "VALUATION_STRETCH_RISK",
            "severity": "MEDIUM",
            "description": f"Valuation is slightly stretched relative to industry peers (P/E {pe:.1f}x vs {ind_pe:.1f}x)."
        })
        
    # 2. Offering Scale Friction Risk
    issue_size = float(features.get("issue_size_in_crore", 500.0))
    if issue_size > 3000.0:
        risk_points += 20
        risk_factors.append({
            "risk_type": "LARGE_OFFERING_SCALE_FRICTION",
            "severity": "HIGH",
            "description": f"Mega offering size of ₹{issue_size:,.0f} Cr requires massive liquidity absorption, dampening oversubscription multiples."
        })
    elif issue_size > 1500.0:
        risk_points += 10
        risk_factors.append({
            "risk_type": "MODERATE_OFFERING_SCALE",
            "severity": "MEDIUM",
            "description": f"Offering size of ₹{issue_size:,.0f} Cr introduces moderate capital absorption friction."
        })
        
    # 3. Macro Market Volatility Risk
    vix = float(features.get("india_vix", 14.5))
    if vix > 19.0:
        risk_points += 25
        risk_factors.append({
            "risk_type": "ELEVATED_MACRO_VOLATILITY",
            "severity": "HIGH",
            "description": f"India VIX is elevated at {vix:.1f}, signaling heightened secondary market risk aversion."
        })
    elif vix > 16.0:
        risk_points += 10
        risk_factors.append({
            "risk_type": "MODERATE_MARKET_VOLATILITY",
            "severity": "MEDIUM",
            "description": f"Secondary market volatility is moderately active (India VIX: {vix:.1f})."
        })
        
    # 4. Solvency & Cash Flow Fundamentals
    de_ratio = float(features.get("debt_equity_ratio", 0.5))
    ocf = float(features.get("operating_cash_flow_cr", 10.0))
    ebitda_margin = float(features.get("ebitda_margin_pct", 15.0))
    
    if de_ratio > 2.5:
        risk_points += 20
        risk_factors.append({
            "risk_type": "HIGH_BALANCE_SHEET_LEVERAGE",
            "severity": "HIGH",
            "description": f"Debt/Equity ratio is high at {de_ratio:.2f}, creating interest expense vulnerability."
        })
    if ocf < 0:
        risk_points += 15
        risk_factors.append({
            "risk_type": "NEGATIVE_OPERATING_CASH_FLOW",
            "severity": "HIGH",
            "description": f"Latest fiscal year generated negative operating cash flow (₹{ocf:.1f} Cr)."
        })
    if ebitda_margin < 7.0:
        risk_points += 10
        risk_factors.append({
            "risk_type": "THIN_OPERATING_MARGINS",
            "severity": "MEDIUM",
            "description": f"Operating profitability is thin with EBITDA margin at {ebitda_margin:.1f}%."
        })
        
    # 5. Sentiment & Grey Market Speculation
    gmp_pct = float(features.get("gmp_percentage", 0.0))
    neg_ratio = float(features.get("negative_news_ratio", 0.15))
    
    if gmp_pct <= 0.0:
        risk_points += 15
        risk_factors.append({
            "risk_type": "ZERO_OR_NEGATIVE_GREY_MARKET_PREMIUM",
            "severity": "MEDIUM",
            "description": "Pre-IPO Grey Market Premium is zero or unavailable, indicating subdued unofficial listing appetite."
        })
    if neg_ratio > 0.35:
        risk_points += 15
        risk_factors.append({
            "risk_type": "ADVERSE_MEDIA_COVERAGE",
            "severity": "HIGH",
            "description": f"Negative news coverage ratio is elevated ({neg_ratio*100:.1f}%)."
        })
        
    # Determine overall risk tier
    if risk_points >= 45:
        risk_level = "HIGH"
    elif risk_points >= 20:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
        
    risk_assessment = {
        "overall_risk_level": risk_level,
        "composite_risk_score": risk_points,
        "identified_risk_factors": risk_factors,
        "total_risk_factors_count": len(risk_factors)
    }
    
    return {
        "risk_assessment": risk_assessment,
        "warnings": warnings,
        "errors": errors,
        "status": "RISK_ASSESSED"
    }
