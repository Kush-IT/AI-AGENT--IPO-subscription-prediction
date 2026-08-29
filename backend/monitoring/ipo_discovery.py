"""
Generic Indian Mainboard IPO Discovery Engine and Registry Manager.
Discovers, filters, validates, and manages prospective IPO lifecycles.
"""
from typing import Dict, List, Any, Optional
from pathlib import Path
from enum import Enum
from datetime import datetime, timezone
import pandas as pd
from pydantic import BaseModel, Field

ROOT_DIR = Path(__file__).parent.parent.parent
LIVE_PRED_DIR = ROOT_DIR / "data" / "live_predictions"
LIVE_PRED_DIR.mkdir(parents=True, exist_ok=True)
REGISTRY_CSV = LIVE_PRED_DIR / "prospective_ipo_registry.csv"


class IPOLifecycleStatus(str, Enum):
    DISCOVERED = "DISCOVERED"
    DATA_COLLECTION = "DATA_COLLECTION"
    READY_FOR_PREOPEN_CAPTURE = "READY_FOR_PREOPEN_CAPTURE"
    PREDICTED = "PREDICTED"
    AWAITING_OUTCOME = "AWAITING_OUTCOME"
    COMPLETED = "COMPLETED"
    
    # Error states
    DATA_COLLECTION_REVIEW_REQUIRED = "DATA_COLLECTION_REVIEW_REQUIRED"
    TEMPORAL_VALIDATION_FAILED = "TEMPORAL_VALIDATION_FAILED"
    MODEL_INTEGRITY_FAILURE = "MODEL_INTEGRITY_FAILURE"
    PREDICTION_FAILED = "PREDICTION_FAILED"
    OUTCOME_VALIDATION_FAILED = "OUTCOME_VALIDATION_FAILED"


class DiscoveredIPO(BaseModel):
    ipo_id: str = Field(..., description="Unique slug identifier (e.g. lumino_2026)")
    company_name: str = Field(..., description="Registered corporate issuer name")
    isin: Optional[str] = Field(None, description="ISIN equity security identifier")
    ipo_open_date: str = Field(..., description="Opening subscription date (YYYY-MM-DD)")
    ipo_close_date: str = Field(..., description="Closing subscription date (YYYY-MM-DD)")
    sector: str = Field("Capital Goods", description="SEBI / Industry sectoral classification")
    industry: Optional[str] = Field(None, description="Granular industry category")
    is_mainboard: bool = Field(True, description="Must be True (SME issues strictly excluded)")
    source: str = Field("SEBI / Exchange IPO Feed", description="Authoritative discovery source")
    source_url: str = Field(..., description="Source filing URL")
    discovered_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: IPOLifecycleStatus = Field(IPOLifecycleStatus.DISCOVERED)


def load_registry() -> pd.DataFrame:
    """Load the prospective IPO registry table."""
    if not REGISTRY_CSV.exists():
        df = pd.DataFrame(columns=[
            "ipo_id", "company_name", "isin", "ipo_open_date", "ipo_close_date",
            "status", "prediction_id", "prediction_timestamp", "outcome_timestamp",
            "created_at", "updated_at"
        ])
        df.to_csv(REGISTRY_CSV, index=False)
        return df
    return pd.read_csv(REGISTRY_CSV)


def save_registry(df: pd.DataFrame) -> None:
    """Save the prospective IPO registry table."""
    df.to_csv(REGISTRY_CSV, index=False)


def register_ipo(ipo: DiscoveredIPO) -> Dict[str, Any]:
    """
    Register a newly discovered Mainboard IPO in the registry.
    Rejects SME offerings, invalid date sequences, and duplicate entries.
    """
    if not ipo.is_mainboard:
        raise ValueError(f"Issue '{ipo.company_name}' is not an Indian Mainboard IPO (SME excluded).")

    if ipo.ipo_open_date > ipo.ipo_close_date:
        raise ValueError(f"Invalid dates: open date ({ipo.ipo_open_date}) > close date ({ipo.ipo_close_date}).")

    df = load_registry()
    if ipo.ipo_id in df["ipo_id"].values:
        # Return existing record if already registered
        row = df[df["ipo_id"] == ipo.ipo_id].iloc[0].to_dict()
        return {k: (None if pd.isna(v) else v) for k, v in row.items()}

    now_iso = datetime.now(timezone.utc).isoformat()
    new_entry = {
        "ipo_id": ipo.ipo_id,
        "company_name": ipo.company_name,
        "isin": ipo.isin or "N/A",
        "ipo_open_date": ipo.ipo_open_date,
        "ipo_close_date": ipo.ipo_close_date,
        "status": ipo.status.value,
        "prediction_id": None,
        "prediction_timestamp": None,
        "outcome_timestamp": None,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    df_new = pd.DataFrame([new_entry])
    df_combined = pd.concat([df, df_new], ignore_index=True)
    save_registry(df_combined)
    return new_entry


def update_ipo_status(ipo_id: str, status: IPOLifecycleStatus, **kwargs) -> Dict[str, Any]:
    """Update lifecycle status and metadata for a registered prospective IPO."""
    df = load_registry()
    if ipo_id not in df["ipo_id"].values:
        raise ValueError(f"IPO ID '{ipo_id}' not found in prospective registry.")

    idx = df[df["ipo_id"] == ipo_id].index[0]
    df.at[idx, "status"] = status.value
    df.at[idx, "updated_at"] = datetime.now(timezone.utc).isoformat()

    for k, v in kwargs.items():
        if k in df.columns:
            df.at[idx, k] = v

    save_registry(df)
    row_dict = df.iloc[idx].to_dict()
    return {k: (None if pd.isna(v) else v) for k, v in row_dict.items()}


def list_registered_ipos(status_filter: Optional[IPOLifecycleStatus] = None) -> List[Dict[str, Any]]:
    """List all registered prospective IPOs with NaN sanitized to None."""
    df = load_registry()
    if status_filter:
        df = df[df["status"] == status_filter.value]
    records = df.to_dict(orient="records")
    return [{k: (None if pd.isna(v) else v) for k, v in r.items()} for r in records]
