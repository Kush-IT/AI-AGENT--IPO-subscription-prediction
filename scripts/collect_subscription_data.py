"""
Subscription Data Extraction and Validation Script.
Extracts category-wise subscription multiples from official BSE/NSE bidding archives.
"""
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"


def extract_and_validate_subscription():
    """Validates subscription targets and ensures no negative multiples."""
    sub_raw_path = RAW_DIR / "ipo_subscription_raw.csv"
    if not sub_raw_path.exists():
        raise FileNotFoundError(f"Missing {sub_raw_path}")
        
    df = pd.read_csv(sub_raw_path)
    print(f"Loaded {len(df)} subscription records.")
    
    # Assert non-negative multiples
    for col in ["qib_subscription", "nii_subscription", "retail_subscription", "total_subscription"]:
        negative_count = (df[col] < 0).sum()
        if negative_count > 0:
            raise ValueError(f"Found {negative_count} negative values in {col}")
            
    print(f"Subscription validation successful. Total IPOs: {len(df)}")
    print(f"Mean Total Subscription: {df['total_subscription'].mean():.2f}x")
    print(f"Median Total Subscription: {df['total_subscription'].median():.2f}x")
    return df


if __name__ == "__main__":
    extract_and_validate_subscription()
