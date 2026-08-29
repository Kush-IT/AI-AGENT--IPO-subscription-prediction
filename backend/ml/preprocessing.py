"""
Data Preprocessing, Transformation, and Feature Engineering Pipeline.
Fuses structured fundamentals, valuation disparity, macroeconomic indicators,
pre-IPO news sentiment, and expanding historical peer averages.
"""
from typing import Dict, List, Tuple, Optional
from pathlib import Path
import sys
import numpy as np
import pandas as pd

ROOT_DIR = Path(__file__).parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

DATA_DIR = ROOT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

NUMERIC_FEATURE_COLUMNS = [
    "issue_size_in_crore", "fresh_issue_percentage", "ofs_percentage",
    "price_low", "price_high", "price_band_spread_pct", "lot_size",
    "min_retail_application_amount", "face_value", "qib_quota_pct",
    "nii_quota_pct", "retail_quota_pct", "revenue_latest_cr",
    "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr", "ebitda_margin_pct",
    "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio",
    "operating_cash_flow_cr", "pe_ratio", "pb_ratio", "industry_pe",
    "valuation_discount_pct", "nifty_1d_return", "nifty_5d_return",
    "nifty_20d_return", "india_vix", "india_vix_5d_change", "gmp_in_inr",
    "gmp_percentage", "news_count", "average_sentiment_score",
    "positive_news_ratio", "previous_sector_avg_subscription",
    "previous_general_avg_subscription"
]

CATEGORICAL_FEATURE_COLUMNS = [
    "sector", "market_trend"
]

TARGET_COLUMNS = [
    "qib_subscription", "nii_subscription", "retail_subscription", "total_subscription"
]


class IPOPreprocessor:
    """
    Stateful preprocessor that fits scalers, imputers, and encodings
    strictly on training partitions to prevent train-test contamination.
    """
    def __init__(self):
        self.medians_: Dict[str, float] = {}
        self.sector_encodings_: Dict[str, int] = {}
        self.market_trend_encodings_: Dict[str, int] = {"BEARISH": -1, "NEUTRAL": 0, "BULLISH": 1, "VOLATILE": 0}
        self.feature_means_: Dict[str, float] = {}
        self.feature_stds_: Dict[str, float] = {}
        self.is_fitted: bool = False
        
    @staticmethod
    def compute_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
        """
        Computes derived pre-IPO financial ratios and historical expanding averages.
        Must be applied on chronologically sorted data.
        """
        data = df.sort_values(by="ipo_open_date").copy().reset_index(drop=True)
        
        # 1. Issue proportions
        data["fresh_issue_percentage"] = (data["fresh_issue_in_crore"] / data["issue_size_in_crore"] * 100).fillna(0.0)
        data["ofs_percentage"] = (data["ofs_in_crore"] / data["issue_size_in_crore"] * 100).fillna(0.0)
        data["price_band_spread_pct"] = ((data["price_high"] - data["price_low"]) / data["price_low"] * 100).fillna(0.0)
        data["min_retail_application_amount"] = data["lot_size"] * data["price_high"]
        
        # 2. Valuation disparity vs industry peer P/E
        data["valuation_discount_pct"] = (
            (data["industry_pe"] - data["pe_ratio"]) / data["industry_pe"] * 100
        ).clip(lower=-200.0, upper=200.0)
        
        # 3. Expanding historical averages (using ONLY strictly preceding IPOs)
        expanding_general = []
        expanding_sector = []
        
        for i in range(len(data)):
            if i == 0:
                expanding_general.append(15.0) # Domain prior baseline
                expanding_sector.append(15.0)
            else:
                past_records = data.iloc[:i]
                current_sector = data.iloc[i]["sector"]
                
                # General expanding mean
                gen_mean = past_records["total_subscription"].mean()
                expanding_general.append(gen_mean)
                
                # Sector expanding mean (if past sector records exist)
                sector_past = past_records[past_records["sector"] == current_sector]
                if len(sector_past) > 0:
                    sec_mean = sector_past["total_subscription"].mean()
                else:
                    sec_mean = gen_mean
                expanding_sector.append(sec_mean)
                
        data["previous_general_avg_subscription"] = expanding_general
        data["previous_sector_avg_subscription"] = expanding_sector
        
        return data

    def fit(self, train_df: pd.DataFrame):
        """Fit imputation and encoding states on training partition."""
        # Fit median imputation for numeric features
        for col in NUMERIC_FEATURE_COLUMNS:
            if col in train_df.columns:
                valid_vals = train_df[col].dropna()
                self.medians_[col] = float(valid_vals.median()) if len(valid_vals) > 0 else 0.0
                self.feature_means_[col] = float(valid_vals.mean()) if len(valid_vals) > 0 else 0.0
                self.feature_stds_[col] = float(valid_vals.std()) if len(valid_vals) > 1 and valid_vals.std() > 0 else 1.0
                
        # Fit sector categorical mapping
        sectors = sorted(train_df["sector"].unique())
        self.sector_encodings_ = {sec: idx for idx, sec in enumerate(sectors)}
        self.is_fitted = True
        return self

    def transform_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Transforms feature matrix using fitted preprocessor states."""
        assert self.is_fitted, "Preprocessor must be fitted on training data before transform"
        transformed = df.copy()
        
        # 1. Apply median imputations
        for col, med in self.medians_.items():
            if col in transformed.columns:
                transformed[col] = transformed[col].fillna(med)
            else:
                transformed[col] = med
                
        # 2. Encode categorical columns
        transformed["sector_encoded"] = transformed["sector"].map(
            lambda x: self.sector_encodings_.get(x, -1)
        )
        transformed["market_trend_encoded"] = transformed["market_trend"].map(
            lambda x: self.market_trend_encodings_.get(x, 0)
        )
        
        return transformed

    @staticmethod
    def transform_targets(y: np.ndarray) -> np.ndarray:
        """Applies log1p transformation to normalize skewed subscription multiples."""
        return np.log1p(np.clip(y, a_min=0.0, a_max=None))

    @staticmethod
    def inverse_transform_targets(y_log: np.ndarray) -> np.ndarray:
        """Applies inverse expm1 transformation back to raw subscription multiples."""
        return np.clip(np.expm1(y_log), a_min=0.0, a_max=None)


def build_processed_datasets() -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Executes full pipeline to generate:
    - data/processed/ipo_master.csv
    - data/processed/ipo_features_preipo.csv
    - data/processed/ipo_targets.csv
    - data/processed/ipo_training.csv
    """
    from scripts.expand_dataset import build_expanded_dataset
    
    build_expanded_dataset()
    
    # Load and merge raw tables
    master_df = pd.read_csv(RAW_DIR / "ipo_master_raw.csv")
    fin_df = pd.read_csv(RAW_DIR / "ipo_financials_raw.csv").drop(columns=["company_name", "source", "source_url"], errors="ignore")
    mkt_df = pd.read_csv(RAW_DIR / "ipo_market_raw.csv").drop(columns=["company_name", "source", "source_url"], errors="ignore")
    sub_df = pd.read_csv(RAW_DIR / "ipo_subscription_raw.csv").drop(columns=["company_name", "source", "source_url"], errors="ignore")
    
    merged = master_df.merge(fin_df, on="ipo_id", how="left")
    merged = merged.merge(mkt_df, on="ipo_id", how="left")
    merged = merged.merge(sub_df, on="ipo_id", how="left")
    
    # Compute derived engineered features
    processed_df = IPOPreprocessor.compute_engineered_features(merged)
    
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Save ipo_master.csv
    processed_df.to_csv(PROCESSED_DIR / "ipo_master.csv", index=False)
    
    # 2. Save ipo_features_preipo.csv (Strictly pre-IPO features)
    feature_cols = ["ipo_id", "company_name", "ipo_open_date", "feature_cutoff_datetime"] + NUMERIC_FEATURE_COLUMNS + CATEGORICAL_FEATURE_COLUMNS
    features_df = processed_df[feature_cols].copy()
    features_df.to_csv(PROCESSED_DIR / "ipo_features_preipo.csv", index=False)
    
    # 3. Save ipo_targets.csv
    target_cols = ["ipo_id", "company_name"] + TARGET_COLUMNS
    targets_df = processed_df[target_cols].copy()
    targets_df.to_csv(PROCESSED_DIR / "ipo_targets.csv", index=False)
    
    # 4. Save ipo_training.csv (Unified train-ready table)
    training_cols = feature_cols + TARGET_COLUMNS
    training_df = processed_df[training_cols].copy()
    training_df.to_csv(PROCESSED_DIR / "ipo_training.csv", index=False)
    
    print(f"Generated processed datasets in {PROCESSED_DIR}:")
    print(f"  - ipo_master.csv ({len(processed_df)} rows)")
    print(f"  - ipo_features_preipo.csv ({len(features_df)} rows, {len(feature_cols)} cols)")
    print(f"  - ipo_targets.csv ({len(targets_df)} rows, {len(TARGET_COLUMNS)} target vars)")
    print(f"  - ipo_training.csv ({len(training_df)} rows)")
    
    return processed_df, features_df, targets_df


if __name__ == "__main__":
    build_processed_datasets()
