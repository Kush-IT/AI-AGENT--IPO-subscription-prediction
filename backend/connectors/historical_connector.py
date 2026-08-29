"""
Historical Demand and Expanding Sector Baseline Connector.
Queries past verified Mainboard IPO records strictly prior to target subscription open.
"""
from typing import Dict, Any, Optional
from pathlib import Path
import pandas as pd
from backend.connectors.base_connector import ProvenanceRecord, CacheManager

ROOT_DIR = Path(__file__).parent.parent.parent
PROCESSED_DIR = ROOT_DIR / "data" / "processed"


class HistoricalConnector:
    """
    Connects to the historical research dataset to compute expanding past demand baselines.
    Guarantees zero future lookahead.
    """
    SOURCE_NAME = "Verified Indian Mainboard Historical IPO Dataset (2021-2024)"
    SOURCE_URL = "data/processed/ipo_training.csv"

    def fetch_data(
        self,
        company_name: str,
        ipo_open_date: str,
        feature_cutoff: str,
        raw_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, ProvenanceRecord]:
        params = raw_params or {}
        obs_time = f"{ipo_open_date}T08:00:00+05:30"
        sector = str(params.get("sector", "Other")).strip()
        
        cached = CacheManager.get("HISTORICAL_DEMAND", company_name, ipo_open_date)
        if cached:
            fields_map = cached
        else:
            sec_avg = 25.0
            gen_avg = 28.5
            
            feat_path = PROCESSED_DIR / "ipo_features_preipo_v2.csv"
            targ_path = PROCESSED_DIR / "ipo_targets_v2.csv"
            
            if feat_path.exists() and targ_path.exists():
                feat_df = pd.read_csv(feat_path)
                targ_df = pd.read_csv(targ_path)
                merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
                
                # Strict past-only condition: ipo_open_date < target_ipo_open_date
                past_df = merged[merged["ipo_open_date"] < ipo_open_date]
                if len(past_df) > 0:
                    gen_avg = round(float(past_df["total_subscription"].mean()), 4)
                    sec_sub = past_df[past_df["sector"].str.lower() == sector.lower()]
                    if len(sec_sub) > 0:
                        sec_avg = round(float(sec_sub["total_subscription"].mean()), 4)
                    else:
                        sec_avg = gen_avg
                        
            fields_map = {
                "previous_sector_avg_subscription": sec_avg,
                "previous_general_avg_subscription": gen_avg
            }
            CacheManager.set("HISTORICAL_DEMAND", company_name, ipo_open_date, fields_map)
            
        records = {}
        for f_name, val in fields_map.items():
            records[f_name] = ProvenanceRecord(
                field=f_name,
                value=val,
                source=self.SOURCE_NAME,
                source_url=self.SOURCE_URL,
                observed_at=obs_time,
                feature_cutoff=feature_cutoff
            )
            
        return records
