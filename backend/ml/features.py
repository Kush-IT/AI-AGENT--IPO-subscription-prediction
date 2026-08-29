"""
Feature Engineering Engine for Pre-IPO Subscription Prediction.
Implements reproducible, ex-ante feature transformations across:
1. IPO Structure
2. Financial Fundamentals
3. Valuation Metrics
4. Secondary Market Conditions
5. Historical Demand (Expanding Window strictly past only)
6. Sentiment & Grey Market Indicators
"""
from typing import List, Dict, Tuple, Optional
from pathlib import Path
import numpy as np
import pandas as pd

ROOT_DIR = Path(__file__).parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"

TARGET_COLUMNS = [
    "qib_subscription",
    "nii_subscription",
    "retail_subscription",
    "total_subscription"
]

CATEGORICAL_COLUMNS = ["sector", "market_trend"]

NUMERIC_COLUMNS_V2 = [
    # 1. IPO Structure
    "issue_size_in_crore",
    "issue_size_log",
    "fresh_issue_percentage",
    "ofs_percentage",
    "price_low",
    "price_high",
    "price_band_spread_pct",
    "lot_size",
    "min_retail_application_amount",
    "face_value",
    "qib_quota_pct",
    "nii_quota_pct",
    "retail_quota_pct",
    
    # 2. Financial Fundamentals
    "revenue_latest_cr",
    "revenue_cagr_3yr",
    "pat_latest_cr",
    "pat_cagr_3yr",
    "ebitda_margin_pct",
    "eps_pre_ipo",
    "roe_pct",
    "roce_pct",
    "debt_equity_ratio",
    "operating_cash_flow_cr",
    
    # 3. Valuation
    "pe_ratio",
    "pb_ratio",
    "industry_pe",
    "valuation_discount_pct",
    
    # 4. Market
    "nifty_1d_return",
    "nifty_5d_return",
    "nifty_20d_return",
    "sensex_1d_return",
    "sensex_5d_return",
    "sensex_20d_return",
    "india_vix",
    "india_vix_5d_change",
    
    # 5. Historical Demand (Expanding Window Past Only)
    "previous_sector_avg_subscription",
    "previous_general_avg_subscription",
    
    # 6. Sentiment
    "gmp_in_inr",
    "gmp_percentage",
    "news_count",
    "average_sentiment_score",
    "positive_news_ratio",
    "negative_news_ratio"
]


class FeatureEngineeringPipeline:
    """
    Modular transformer ensuring zero temporal leakage and strict ex-ante origin.
    """
    
    @staticmethod
    def compute_structure_features(df: pd.DataFrame) -> pd.DataFrame:
        """Derives structural offer features."""
        res = df.copy()
        res["issue_size_log"] = np.log1p(np.clip(res["issue_size_in_crore"], a_min=0, a_max=None))
        res["fresh_issue_percentage"] = (res["fresh_issue_in_crore"] / res["issue_size_in_crore"] * 100.0).fillna(0.0)
        res["ofs_percentage"] = (res["ofs_in_crore"] / res["issue_size_in_crore"] * 100.0).fillna(0.0)
        res["price_band_spread_pct"] = ((res["price_high"] - res["price_low"]) / res["price_low"] * 100.0).fillna(0.0)
        res["min_retail_application_amount"] = res["lot_size"] * res["price_high"]
        return res

    @staticmethod
    def compute_valuation_features(df: pd.DataFrame) -> pd.DataFrame:
        """Derives relative peer valuation metrics."""
        res = df.copy()
        res["valuation_discount_pct"] = (
            (res["industry_pe"] - res["pe_ratio"]) / res["industry_pe"] * 100.0
        ).clip(lower=-200.0, upper=200.0)
        return res

    @staticmethod
    def compute_sentiment_features(df: pd.DataFrame) -> pd.DataFrame:
        """Derives news sentiment and grey market premium metrics."""
        res = df.copy()
        res["negative_news_ratio"] = (1.0 - res["positive_news_ratio"]).clip(lower=0.0, upper=1.0)
        res["gmp_percentage"] = (res["gmp_in_inr"] / res["price_high"] * 100.0).fillna(0.0)
        return res

    @staticmethod
    def compute_historical_expanding_demand(df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates expanding averages using STRICTLY preceding IPOs (open_date < current_open_date).
        Never includes the current IPO or any future IPOs.
        """
        # Ensure chronological ordering
        data = df.sort_values(by=["ipo_open_date", "ipo_id"]).copy().reset_index(drop=True)
        
        expanding_general = []
        expanding_sector = []
        
        for i in range(len(data)):
            current_open_date = data.iloc[i]["ipo_open_date"]
            current_sector = data.iloc[i]["sector"]
            
            # Filter past records with STRICT inequality on date and index
            past_records = data.iloc[:i]
            past_strict = past_records[past_records["ipo_open_date"] < current_open_date]
            
            if len(past_strict) == 0:
                # Prior domain baseline if no strictly preceding IPOs
                expanding_general.append(15.0)
                expanding_sector.append(15.0)
            else:
                gen_mean = float(past_strict["total_subscription"].mean())
                expanding_general.append(gen_mean)
                
                sector_past = past_strict[past_strict["sector"] == current_sector]
                if len(sector_past) > 0:
                    sec_mean = float(sector_past["total_subscription"].mean())
                else:
                    sec_mean = gen_mean
                expanding_sector.append(sec_mean)
                
        data["previous_general_avg_subscription"] = expanding_general
        data["previous_sector_avg_subscription"] = expanding_sector
        return data


def build_features_and_targets_v2() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Builds and writes:
    - data/processed/ipo_features_preipo_v2.csv
    - data/processed/ipo_targets_v2.csv
    """
    master_raw = pd.read_csv(RAW_DIR / "ipo_master_raw.csv")
    fin_raw = pd.read_csv(RAW_DIR / "ipo_financials_raw.csv").drop(columns=["company_name", "source", "source_url"], errors="ignore")
    mkt_raw = pd.read_csv(RAW_DIR / "ipo_market_raw.csv").drop(columns=["company_name", "source", "source_url"], errors="ignore")
    sub_raw = pd.read_csv(RAW_DIR / "ipo_subscription_raw.csv").drop(columns=["company_name", "source", "source_url"], errors="ignore")
    
    merged = master_raw.merge(fin_raw, on="ipo_id", how="left")
    merged = merged.merge(mkt_raw, on="ipo_id", how="left")
    merged = merged.merge(sub_raw, on="ipo_id", how="left")
    
    # Apply feature transformations
    df_feat = FeatureEngineeringPipeline.compute_structure_features(merged)
    df_feat = FeatureEngineeringPipeline.compute_valuation_features(df_feat)
    df_feat = FeatureEngineeringPipeline.compute_sentiment_features(df_feat)
    df_feat = FeatureEngineeringPipeline.compute_historical_expanding_demand(df_feat)
    
    # 1. Prepare Feature Matrix V2 (Strictly Pre-IPO features)
    meta_cols = ["ipo_id", "company_name", "isin", "ipo_open_date", "feature_cutoff_datetime"]
    all_feature_cols = meta_cols + NUMERIC_COLUMNS_V2 + CATEGORICAL_COLUMNS
    features_v2 = df_feat[all_feature_cols].copy()
    
    # 2. Prepare Targets Matrix V2 (Raw and log1p targets)
    targets_v2 = df_feat[["ipo_id", "company_name", "ipo_open_date"] + TARGET_COLUMNS].copy()
    for col in TARGET_COLUMNS:
        targets_v2[f"log_{col}"] = np.log1p(targets_v2[col])
        
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    features_v2.to_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv", index=False)
    targets_v2.to_csv(PROCESSED_DIR / "ipo_targets_v2.csv", index=False)
    
    print(f"Generated V2 Datasets:")
    print(f"  - Features V2: {features_v2.shape} -> {PROCESSED_DIR / 'ipo_features_preipo_v2.csv'}")
    print(f"  - Targets V2: {targets_v2.shape} -> {PROCESSED_DIR / 'ipo_targets_v2.csv'}")
    
    return features_v2, targets_v2


if __name__ == "__main__":
    build_features_and_targets_v2()
