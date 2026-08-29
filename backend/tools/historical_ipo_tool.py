"""
Historical Demand and Sector Baseline Lookup Tool.
Computes expanding historical sector average subscription multiples strictly prior to open date.
"""
from typing import Dict, Any, List, Tuple
from pathlib import Path
import pandas as pd
import numpy as np

DATA_DIR = Path(__file__).parent.parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"


def lookup_historical_demand(sector: str, ipo_open_date: str) -> Tuple[Dict[str, float], List[str]]:
    """
    Looks up expanding historical average subscriptions up to the given open date.
    Strictly excludes any observations occurring on or after the target open date.
    """
    warnings = []
    default_vals = {
        "previous_sector_avg_subscription": 25.0,
        "previous_general_avg_subscription": 28.5
    }
    
    try:
        feat_path = PROCESSED_DIR / "ipo_features_preipo_v2.csv"
        targ_path = PROCESSED_DIR / "ipo_targets_v2.csv"
        
        if not feat_path.exists() or not targ_path.exists():
            return default_vals, ["Historical dataset files not found; using baseline sector defaults."]
            
        feat_df = pd.read_csv(feat_path)
        targ_df = pd.read_csv(targ_path)
        merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
        
        # Strict temporal past-only slice
        past_ipos = merged[merged["ipo_open_date"] < ipo_open_date]
        if len(past_ipos) == 0:
            return default_vals, ["No prior IPOs found before this open date; using default historical baseline."]
            
        gen_avg = float(past_ipos["total_subscription"].mean())
        
        # Sector specific past slice
        sec_ipos = past_ipos[past_ipos["sector"].str.lower() == str(sector).lower()]
        if len(sec_ipos) > 0:
            sec_avg = float(sec_ipos["total_subscription"].mean())
        else:
            sec_avg = gen_avg
            warnings.append(f"No prior historical IPOs for sector '{sector}'. Defaulted to general market average ({gen_avg:.1f}x).")
            
        return {
            "previous_sector_avg_subscription": round(sec_avg, 4),
            "previous_general_avg_subscription": round(gen_avg, 4)
        }, warnings
        
    except Exception as e:
        warnings.append(f"Historical lookup failed ({str(e)}); falling back to defaults.")
        return default_vals, warnings
