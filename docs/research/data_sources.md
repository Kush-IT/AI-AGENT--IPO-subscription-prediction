# Data Sources & Acquisition Methodology

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## 1. Source Hierarchy & Reliability Framework

To ensure maximum academic credibility and prevent synthetic contamination, all data points in this project follow a strict four-tier reliability hierarchy:

```
┌──────────────────────────────────────────────────────────┐
│ Tier 1: Primary Regulatory Filings (SEBI, DRHP, RHP)     │
│ - Reliability: 100% (Audited financial statements)       │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Tier 2: Official Exchange Circulars (NSE / BSE)          │
│ - Reliability: 100% (Official bid & subscription reports)│
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Tier 3: Market Data Providers (Yahoo Finance / Investing)│
│ - Reliability: High (End-of-day market index & VIX data) │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Tier 4: Curated Aggregators (Chittorgarh / InvestorGain) │
│ - Reliability: High (Secondary cross-verification & GMP) │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Verified Source Registry

| Source ID | Source Organization | Type | Data Elements Provided | Reliability Tier | Official URL |
|---|---|---|---|---|---|
| **SRC_SEBI_01** | Securities and Exchange Board of India (SEBI) | Regulator | Draft Red Herring Prospectus (DRHP), Red Herring Prospectus (RHP), Audited 3-Year Balance Sheet, Profit & Loss, Cash Flow Statements | Primary (Tier 1) | [sebi.gov.in](https://www.sebi.gov.in/filings/public-issues.html) |
| **SRC_NSE_01** | National Stock Exchange of India (NSE) | Exchange | Issue terms, price band, lot size, quota percentages, face value, ISIN identifiers, bidding circulars | Primary (Tier 2) | [nseindia.com](https://www.nseindia.com/market-data/all-upcoming-issues-ipo) |
| **SRC_BSE_01** | Bombay Stock Exchange (BSE) | Exchange | Category-wise final bid quantities, cumulative QIB/NII/Retail/Employee subscription multiples, allotment basis | Primary (Tier 2) | [bseindia.com](https://www.bseindia.com/publicissue.html) |
| **SRC_YAHOO_01** | Yahoo Finance (NSE Index Data) | Market Data | Historical daily closing values of NIFTY 50 (`^NSEI`) and India VIX (`^INDIAVIX`) | Secondary (Tier 3) | [finance.yahoo.com](https://finance.yahoo.com/quote/%5ENSEI/) |
| **SRC_CHITTOR_01** | Chittorgarh IPO Database | Aggregator | Verified historical issue timelines, peer comparisons, industry P/E aggregates | Secondary (Tier 4) | [chittorgarh.com](https://www.chittorgarh.com/ipo/ipo_dashboard.asp) |
| **SRC_INVESTORGAIN_01** | InvestorGain Portal | Aggregator | Historical pre-IPO Grey Market Premium (GMP) observations with exact pre-open timestamps | Secondary (Tier 4) | [investorgain.com](https://www.investorgain.com/report/live-ipo-gmp/331/) |
| **SRC_ET_01** | The Economic Times IPO Archive | News Portal | Timestamped editorial news coverage, analyst recommendations, media articles | Secondary (Tier 4) | [economictimes.indiatimes.com](https://economictimes.indiatimes.com/markets/ipos/) |

---

## 3. Data Integrity & Retrieval Protocol

1. **No Data Fabrication:** Missing data points are never populated with fabricated values. If a historical metric is unavailable in primary documents, it is explicitly flagged as `NOT_AVAILABLE`.
2. **Deterministic Cross-Verification:** Every subscription multiple is cross-checked between official NSE and BSE cumulative bidding reports.
3. **Strict Timestamp Binding:** Every feature is assigned an immutable extraction timestamp to support the automated anti-leakage audit pipeline.
