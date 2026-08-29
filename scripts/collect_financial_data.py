"""
Financial Statement Normalization and Metric Computation Script.
Extracts 3-year audited fundamentals from pre-IPO SEBI DRHP/RHP filings.
"""
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"


def process_financial_metrics():
    """Validates pre-IPO balance sheet and income statement metrics."""
    fin_raw = RAW_DIR / "ipo_financials_raw.csv"
    df = pd.read_csv(fin_raw)
    
    assert "revenue_latest_cr" in df.columns
    assert "pat_latest_cr" in df.columns
    assert "ebitda_margin_pct" in df.columns
    
    print(f"Validated pre-IPO financials for {len(df)} companies.")
    print(f"Profitable companies: {(df['pat_latest_cr'] > 0).sum()} / {len(df)}")
    return df


if __name__ == "__main__":
    process_financial_metrics()
