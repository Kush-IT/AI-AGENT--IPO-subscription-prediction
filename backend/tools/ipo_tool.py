"""
IPO Structure and Quota Verification Tool.
Validates offer size, pricing, lot limits, and statutory reservation quotas.
"""
from typing import Dict, Any, List, Tuple
import numpy as np


def validate_ipo_structure(data: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str], List[str]]:
    """
    Validates structural terms of an Indian Mainboard IPO offering.
    Returns normalized data, errors, and warnings.
    """
    errors = []
    warnings = []
    normalized = {}
    
    # Required core terms
    req_fields = ["company_name", "ipo_open_date", "price_high", "issue_size_in_crore"]
    for rf in req_fields:
        if rf not in data or data[rf] is None or data[rf] == "":
            errors.append(f"Missing required IPO structural parameter: '{rf}'")
            
    if errors:
        return normalized, errors, warnings
        
    normalized["company_name"] = str(data["company_name"]).strip()
    normalized["ipo_open_date"] = str(data["ipo_open_date"]).strip()
    
    # Numerical validation
    try:
        price_high = float(data["price_high"])
        price_low = float(data.get("price_low", price_high))
        if price_high <= 0:
            errors.append(f"price_high must be strictly positive, got {price_high}")
        if price_low > price_high:
            errors.append(f"price_low ({price_low}) cannot exceed price_high ({price_high})")
            
        normalized["price_high"] = price_high
        normalized["price_low"] = price_low
        normalized["face_value"] = float(data.get("face_value", 10.0))
        normalized["lot_size"] = int(data.get("lot_size", int(14500 // price_high) if price_high > 0 else 50))
        normalized["min_retail_application_amount"] = normalized["price_high"] * normalized["lot_size"]
        
        # Spread calculation
        spread_pct = round(((price_high - price_low) / price_low) * 100.0, 4) if price_low > 0 else 0.0
        normalized["price_band_spread_pct"] = spread_pct
        
        issue_size = float(data["issue_size_in_crore"])
        if issue_size <= 0:
            errors.append(f"issue_size_in_crore must be strictly positive, got {issue_size}")
        normalized["issue_size_in_crore"] = issue_size
        normalized["issue_size_log"] = round(float(np.log1p(issue_size)), 6)
        
        # Quota allocation checks (SEBI Mainboard: QIB + NII + Retail = 100%)
        qib_quota = float(data.get("qib_quota_pct", 50.0))
        nii_quota = float(data.get("nii_quota_pct", 15.0))
        retail_quota = float(data.get("retail_quota_pct", 35.0))
        
        quota_sum = qib_quota + nii_quota + retail_quota
        if abs(quota_sum - 100.0) > 0.5:
            warnings.append(f"Category quota sum is {quota_sum}%, expected 100.0%. Normalizing.")
            qib_quota = round((qib_quota / quota_sum) * 100.0, 2)
            nii_quota = round((nii_quota / quota_sum) * 100.0, 2)
            retail_quota = round(100.0 - qib_quota - nii_quota, 2)
            
        normalized["qib_quota_pct"] = qib_quota
        normalized["nii_quota_pct"] = nii_quota
        normalized["retail_quota_pct"] = retail_quota
        
        # OFS vs Fresh issue
        fresh_pct = float(data.get("fresh_issue_percentage", 50.0))
        ofs_pct = float(data.get("ofs_percentage", 100.0 - fresh_pct))
        normalized["fresh_issue_percentage"] = fresh_pct
        normalized["ofs_percentage"] = ofs_pct
        
        normalized["sector"] = str(data.get("sector", "Other")).strip()
        
    except (ValueError, TypeError) as e:
        errors.append(f"Type conversion failure in IPO structure validation: {str(e)}")
        
    return normalized, errors, warnings
