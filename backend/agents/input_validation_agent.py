"""
Input Validation Agent Node.
Validates input schemas, data types, date formats, and checks for missing mandatory fields.
"""
from typing import Dict, Any
from datetime import datetime
from backend.agents.state import IPOState


def input_validation_node(state: IPOState) -> Dict[str, Any]:
    """
    Validates the initial raw IPO payload.
    Emits structured errors if mandatory terms are absent. Never fabricates values.
    """
    raw_input = state.get("ipo_input", {})
    errors = list(state.get("errors", []))
    warnings = list(state.get("warnings", []))
    
    # 1. Required core fields
    mandatory_fields = ["company_name", "ipo_open_date", "price_high", "issue_size_in_crore"]
    for field in mandatory_fields:
        if field not in raw_input or raw_input[field] is None or raw_input[field] == "":
            errors.append(f"Validation Error: Mandatory parameter '{field}' is missing.")
            
    # 2. Date format validation
    if "ipo_open_date" in raw_input and raw_input["ipo_open_date"]:
        try:
            datetime.strptime(str(raw_input["ipo_open_date"]).strip(), "%Y-%m-%d")
        except ValueError:
            errors.append(f"Validation Error: 'ipo_open_date' must be in YYYY-MM-DD format, got '{raw_input['ipo_open_date']}'.")
            
    # 3. Numerical boundaries
    if "price_high" in raw_input and raw_input["price_high"] is not None:
        try:
            p_high = float(raw_input["price_high"])
            if p_high <= 0:
                errors.append(f"Validation Error: 'price_high' must be > 0, got {p_high}.")
        except (ValueError, TypeError):
            errors.append("Validation Error: 'price_high' must be a valid number.")
            
    if "issue_size_in_crore" in raw_input and raw_input["issue_size_in_crore"] is not None:
        try:
            sz = float(raw_input["issue_size_in_crore"])
            if sz <= 0:
                errors.append(f"Validation Error: 'issue_size_in_crore' must be > 0, got {sz}.")
        except (ValueError, TypeError):
            errors.append("Validation Error: 'issue_size_in_crore' must be a valid number.")
            
    # 4. Price band relationship
    if "price_high" in raw_input and "price_low" in raw_input and raw_input["price_low"] is not None and raw_input["price_high"] is not None:
        try:
            p_high = float(raw_input["price_high"])
            p_low = float(raw_input["price_low"])
            if p_low > p_high:
                errors.append(f"Validation Error: 'price_low' ({p_low}) cannot exceed 'price_high' ({p_high}).")
        except (ValueError, TypeError):
            pass
            
    status = "VALIDATION_FAILED" if errors else "VALIDATION_PASSED"
    
    return {
        "errors": errors,
        "warnings": warnings,
        "status": status
    }
