"""
Temporal Validation Engine for Strict Pre-IPO Ex-Ante Boundaries.
Enforces observed_at <= feature_cutoff across all raw external observations.
"""
from typing import Dict, Any, Tuple, Optional
from datetime import datetime
import dateutil.parser


class TemporalValidator:
    """
    Validates temporal timestamp ordering to prevent look-ahead leakage.
    """
    @staticmethod
    def parse_datetime(dt_str: str) -> datetime:
        """Parses ISO timestamp string or standard date string with timezone resilience."""
        if isinstance(dt_str, datetime):
            return dt_str
        dt = dateutil.parser.parse(str(dt_str))
        # Default naive datetimes to IST (UTC+05:30) if timezone is absent
        return dt

    @classmethod
    def validate_observation(
        cls,
        field: str,
        observed_at: str,
        feature_cutoff: str
    ) -> Tuple[bool, str]:
        """
        Verifies that an observation occurred strictly on or before the feature cutoff.
        """
        try:
            obs_dt = cls.parse_datetime(observed_at)
            cutoff_dt = cls.parse_datetime(feature_cutoff)
            
            # Align timezones if one is offset-aware and other is naive
            if obs_dt.tzinfo is not None and cutoff_dt.tzinfo is None:
                cutoff_dt = cutoff_dt.replace(tzinfo=obs_dt.tzinfo)
            elif obs_dt.tzinfo is None and cutoff_dt.tzinfo is not None:
                obs_dt = obs_dt.replace(tzinfo=cutoff_dt.tzinfo)
                
            if obs_dt <= cutoff_dt:
                return True, "EX_ANTE_VALID"
            else:
                return False, (
                    f"Temporal Leakage Violation: '{field}' observed at {observed_at} "
                    f"is strictly after feature cutoff {feature_cutoff}."
                )
        except Exception as e:
            return False, f"Temporal timestamp parsing error for '{field}': {str(e)}"


def validate_ex_ante(record: Dict[str, Any]) -> Dict[str, Any]:
    """
    Standardized validation function for a data provenance dictionary.
    
    Expected record schema:
    {
        "field": "gmp_percentage",
        "value": 25.4,
        "source": "Chittorgarh",
        "observed_at": "2024-05-15T08:30:00+05:30",
        "feature_cutoff": "2024-05-15T09:59:59+05:30"
    }
    """
    field = record.get("field", "unknown_field")
    observed_at = record.get("observed_at")
    feature_cutoff = record.get("feature_cutoff")
    
    if not observed_at or not feature_cutoff:
        return {
            "valid": False,
            "field": field,
            "reason": "Missing timestamp metadata (observed_at or feature_cutoff)",
            "observed_at": observed_at,
            "cutoff": feature_cutoff,
            "validation_status": "MISSING_TIMESTAMPS"
        }
        
    is_valid, reason = TemporalValidator.validate_observation(field, observed_at, feature_cutoff)
    
    return {
        "valid": is_valid,
        "field": field,
        "reason": reason,
        "observed_at": observed_at,
        "cutoff": feature_cutoff,
        "validation_status": "EX_ANTE_VALID" if is_valid else "TEMPORAL_REJECTED"
    }
