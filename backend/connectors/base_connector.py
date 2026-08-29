"""
Base Connector Protocol, Provenance Tracking, and Local Caching Layer.
Supports offline deterministic replay and rate-limited live data fetching.
"""
from typing import Dict, Any, List, Optional, Tuple, Protocol, runtime_checkable
from pathlib import Path
from datetime import datetime
import json
import hashlib
import os

from backend.connectors.temporal_validator import validate_ex_ante

ROOT_DIR = Path(__file__).parent.parent.parent
CACHE_DIR = ROOT_DIR / "data" / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
METADATA_DIR = ROOT_DIR / "data" / "metadata"


class ProvenanceRecord:
    """
    Standardized atomic data record carrying full provenance and temporal validation metadata.
    """
    def __init__(
        self,
        field: str,
        value: Any,
        source: str,
        source_url: str,
        observed_at: str,
        feature_cutoff: str,
        financial_period: Optional[str] = None
    ):
        self.field = field
        self.value = value
        self.source = source
        self.source_url = source_url
        self.observed_at = observed_at
        self.feature_cutoff = feature_cutoff
        self.financial_period = financial_period
        self.retrieved_at = datetime.now().isoformat()
        
        # Execute temporal validation immediately
        val_res = validate_ex_ante({
            "field": self.field,
            "observed_at": self.observed_at,
            "feature_cutoff": self.feature_cutoff
        })
        self.is_valid = val_res["valid"]
        self.validation_status = val_res["validation_status"]
        self.validation_reason = val_res["reason"]
        self.status = "VALID" if self.is_valid and self.value is not None else ("MISSING" if self.value is None else "REJECTED")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "field": self.field,
            "value": self.value,
            "source": self.source,
            "source_url": self.source_url,
            "observed_at": self.observed_at,
            "feature_cutoff": self.feature_cutoff,
            "retrieved_at": self.retrieved_at,
            "financial_period": self.financial_period,
            "status": self.status,
            "validation_status": self.validation_status,
            "validation_reason": self.validation_reason
        }


class CacheManager:
    """
    Local disk caching mechanism for external connector responses.
    Prevents repeated external requests and guarantees reproducible audit logs.
    """
    @staticmethod
    def get_cache_key(source: str, company: str, date_str: str) -> str:
        raw_key = f"{source}_{company.lower().strip()}_{date_str.strip()}"
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()[:16]

    @classmethod
    def get(cls, source: str, company: str, date_str: str) -> Optional[Dict[str, Any]]:
        key = cls.get_cache_key(source, company, date_str)
        cache_file = CACHE_DIR / f"{key}.json"
        if cache_file.exists():
            try:
                with open(cache_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return None
        return None

    @classmethod
    def set(cls, source: str, company: str, date_str: str, data: Dict[str, Any]):
        key = cls.get_cache_key(source, company, date_str)
        cache_file = CACHE_DIR / f"{key}.json"
        try:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass


@runtime_checkable
class BaseConnector(Protocol):
    """
    Connector interface specification for pre-IPO data extraction.
    """
    def fetch_data(
        self,
        company_name: str,
        ipo_open_date: str,
        feature_cutoff: str,
        raw_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, ProvenanceRecord]:
        """Fetches and attaches temporal provenance records."""
        ...
