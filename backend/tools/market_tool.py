"""
Market Conditions and Volatility Validation Tool.
Extracts and validates secondary market climate (NIFTY, SENSEX, India VIX).
"""
from typing import Dict, Any, List, Tuple


def validate_market_conditions(data: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str], List[str]]:
    """
    Validates secondary market momentum and volatility indicators prior to IPO open date.
    """
    errors = []
    warnings = []
    normalized = {}
    
    try:
        # Benchmark returns
        normalized["nifty_1d_return"] = float(data.get("nifty_1d_return", 0.05))
        normalized["nifty_5d_return"] = float(data.get("nifty_5d_return", 0.35))
        normalized["nifty_20d_return"] = float(data.get("nifty_20d_return", 1.20))
        
        normalized["sensex_1d_return"] = float(data.get("sensex_1d_return", 0.05))
        normalized["sensex_5d_return"] = float(data.get("sensex_5d_return", 0.35))
        normalized["sensex_20d_return"] = float(data.get("sensex_20d_return", 1.20))
        
        # Volatility
        vix = float(data.get("india_vix", 14.5))
        if vix <= 0 or vix > 80:
            warnings.append(f"Unusual India VIX level detected: {vix}. Normal range is [9, 45].")
        normalized["india_vix"] = vix
        normalized["india_vix_5d_change"] = float(data.get("india_vix_5d_change", 0.0))
        
        # Market trend classification
        trend = str(data.get("market_trend", "")).upper()
        if trend not in ["BULLISH", "BEARISH", "NEUTRAL", "VOLATILE"]:
            if normalized["india_vix"] > 20.0:
                trend = "VOLATILE"
            elif normalized["nifty_20d_return"] > 2.0:
                trend = "BULLISH"
            elif normalized["nifty_20d_return"] < -2.0:
                trend = "BEARISH"
            else:
                trend = "NEUTRAL"
        normalized["market_trend"] = trend
        
    except (ValueError, TypeError) as e:
        errors.append(f"Type conversion failure in market conditions validation: {str(e)}")
        
    return normalized, errors, warnings
