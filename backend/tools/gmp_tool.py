"""
Grey Market Premium (GMP) Verification Tool.
Validates ex-ante unofficial grey market rates observed immediately prior to subscription open.
"""
from typing import Dict, Any, List, Tuple


def validate_gmp_metrics(data: Dict[str, Any], price_high: float) -> Tuple[Dict[str, Any], List[str], List[str]]:
    """
    Validates pre-IPO Grey Market Premium (in INR and as percentage of price cap).
    """
    errors = []
    warnings = []
    normalized = {}
    
    try:
        gmp_inr = data.get("gmp_in_inr")
        gmp_pct = data.get("gmp_percentage")
        
        if gmp_pct is not None:
            gmp_pct = float(gmp_pct)
            gmp_inr = float(gmp_inr) if gmp_inr is not None else (gmp_pct / 100.0) * price_high
        elif gmp_inr is not None:
            gmp_inr = float(gmp_inr)
            gmp_pct = (gmp_inr / price_high) * 100.0 if price_high > 0 else 0.0
        else:
            # Missing GMP fallback with warning
            warnings.append("Pre-IPO Grey Market Premium is unavailable. Defaulting to 0.0 (Neutral baseline).")
            gmp_inr = 0.0
            gmp_pct = 0.0
            
        normalized["gmp_in_inr"] = round(float(gmp_inr), 2)
        normalized["gmp_percentage"] = round(float(gmp_pct), 4)
        
        if normalized["gmp_percentage"] > 150.0:
            warnings.append(f"Extremely elevated GMP detected ({normalized['gmp_percentage']:.1f}%). High speculation premium.")
            
    except (ValueError, TypeError) as e:
        errors.append(f"Type conversion failure in GMP validation: {str(e)}")
        
    return normalized, errors, warnings
