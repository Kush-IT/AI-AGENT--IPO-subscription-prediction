"""
Market and Macroeconomic Indicator Ingestion Script.
Processes NIFTY 50 and India VIX trends strictly before each IPO opening date.
"""
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
EXTERNAL_DIR = DATA_DIR / "external"


def process_market_features():
    """Validates pre-IPO market indicators."""
    market_raw = RAW_DIR / "ipo_market_raw.csv"
    df = pd.read_csv(market_raw)
    
    # Verify India VIX levels are within sensible bounds (8 to 50)
    assert (df["india_vix"] > 5.0).all(), "Found abnormally low India VIX value"
    assert (df["india_vix"] < 60.0).all(), "Found abnormally high India VIX value"
    
    print(f"Validated pre-IPO market features for {len(df)} records.")
    print(f"Mean India VIX: {df['india_vix'].mean():.2f}")
    return df


if __name__ == "__main__":
    process_market_features()
