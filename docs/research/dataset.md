# Historical Indian IPO Dataset Documentation

**Dataset Name:** Indian Mainboard Pre-IPO Subscription Research Dataset  
**Version:** 1.0.0  
**Coverage Horizon:** July 2021 – June 2024  
**Primary Exchanges:** National Stock Exchange of India (NSE), Bombay Stock Exchange (BSE)  
**Regulatory Jurisdiction:** Securities and Exchange Board of India (SEBI)  

---

## 1. Dataset Overview

The dataset provides a temporally consistent, multi-source collection of historical Indian Mainboard IPOs designed for pre-issue subscription forecasting. Every observation represents the exact information state available at the **pre-IPO feature cutoff datetime** (\(T_{\text{cutoff}} =\) 10:00 AM IST on the IPO Open Date).

### Summary Statistics

| Metric | Value |
|---|---|
| **Total Verified IPO Records** | 24 Mainboard Issues |
| **Market Segment** | 100% Mainboard (BSE / NSE listed) |
| **Time Horizon** | 2021-07-14 to 2024-06-03 |
| **Total Input Features** | 40 (38 Numeric / Derived + 2 Categorical) |
| **Continuous Target Variables** | 4 (\(Y_{\text{QIB}}, Y_{\text{NII}}, Y_{\text{Retail}}, Y_{\text{Total}}\)) |
| **Missing Values in Processed Matrix** | 0 (after domain-specific median imputation) |
| **Duplicate Records** | 0 (verified via unique `ipo_id` and ISIN) |
| **Leakage Violations** | 0 (audited via `backend/ml/leakage.py`) |

---

## 2. Target Variables Specification

All target subscription variables reflect the official cumulative subscription multiples finalized upon the close of the bookbuilding window.

| Target Variable | Target Name | Description | Min | Mean | Median | Max |
|---|---|---|---|---|---|---|
| \(Y_{\text{QIB}}\) | `qib_subscription` | Qualified Institutional Buyers subscription multiple | 2.79x | 79.52x | 76.74x | 203.41x |
| \(Y_{\text{NII}}\) | `nii_subscription` | Non-Institutional / HNI subscription multiple | 0.24x | 55.43x | 24.29x | 301.92x |
| \(Y_{\text{Retail}}\) | `retail_subscription` | Retail Individual Investors subscription multiple | 0.92x | 16.63x | 9.00x | 85.20x |
| \(Y_{\text{Total}}\) | `total_subscription` | Total aggregate issue subscription multiple | 1.89x | 46.59x | 38.39x | 119.62x |

> **Note on Non-Linearity:** Because subscription multiples exhibit heavy positive skewness (ranging from 1.89x to 119.62x), the preprocessing pipeline supports a logarithmic transform: \(y^* = \ln(1 + y)\).

---

## 3. Pre-IPO Feature Categories

### 3.1 Issue Structure & Terms
- `issue_size_in_crore`: Total capital offered (Min: Rs. 130.15 Cr, Max: Rs. 21,008.48 Cr, Mean: Rs. 3,147.28 Cr).
- `fresh_issue_percentage` / `ofs_percentage`: Proportion of capital raised for company expansion vs. promoter liquidation.
- `price_band_spread_pct`: Spread between upper and lower bidding bands (\(\frac{P_{\text{high}} - P_{\text{low}}}{P_{\text{low}}} \times 100\)).
- `lot_size` & `min_retail_application_amount`: Minimum capital required for a single retail lot.
- `qib_quota_pct`, `nii_quota_pct`, `retail_quota_pct`: Regulatory quota allocation percentages.

### 3.2 Fundamental Accounting Metrics (Audited 3-Year Pre-IPO)
- `revenue_latest_cr` & `revenue_cagr_3yr`: Topline revenue scale and compound growth rate.
- `pat_latest_cr` & `pat_cagr_3yr`: Net profitability and earnings trajectory.
- `ebitda_margin_pct`, `roe_pct`, `roce_pct`: Operating efficiency and capital return quality.
- `debt_equity_ratio`: Balance-sheet financial leverage.
- `operating_cash_flow_cr`: Operational cash generation.

### 3.3 Valuation Disparity Metrics
- `pe_ratio`: Offer Price-to-Earnings multiple at upper price band.
- `industry_pe`: Weighted average P/E of listed comparable industry peers.
- `valuation_discount_pct`: Explicit valuation discount relative to peers (\(\frac{\text{Industry P/E} - \text{Offer P/E}}{\text{Industry P/E}} \times 100\)).

### 3.4 Macroeconomic & Market Climate (Pre-Cutoff)
- `nifty_1d_return`, `nifty_5d_return`, `nifty_20d_return`: Benchmark equity momentum prior to opening.
- `india_vix` & `india_vix_5d_change`: Implied market volatility and risk regime.
- `market_trend`: High-level regime indicator (`BULLISH`, `NEUTRAL`, `BEARISH`, `VOLATILE`).

### 3.5 Pre-IPO Sentiment & Expanding Cohorts
- `gmp_in_inr` & `gmp_percentage`: Unofficial grey market premium observed strictly before opening.
- `news_count`, `average_sentiment_score`, `positive_news_ratio`: Natural language sentiment polarity.
- `previous_sector_avg_subscription` & `previous_general_avg_subscription`: Expanding historical subscription momentum of preceding IPOs.

---

## 4. Quarantined Intraday Dataset (`ipo_subscription_daily.csv`)

To support future dynamic updating without compromising pre-IPO model purity, day-wise intraday subscription counts are quarantined in a separate table (`data/raw/ipo_subscription_daily.csv`). These contain Day 1, Day 2, and Day 3 bids and are strictly excluded from pre-IPO feature matrices.
