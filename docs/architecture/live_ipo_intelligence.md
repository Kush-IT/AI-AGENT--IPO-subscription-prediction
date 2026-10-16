# Live 15-Day IPO Intelligence & Forecasting System Architecture

```
==================================================================================================
                      LIVE 15-DAY IPO INTELLIGENCE DATAFLOW ARCHITECTURE
==================================================================================================

                     +---------------------------------------+
                     |    Indian Mainboard IPO Filings       |
                     |     (NSE / BSE / SEBI DRHP/RHP)       |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |        Data Acquisition Layer         |
                     | (IPO terms, Quotas, Pricing, Dates)   |
                     +-------------------+-------------------+
                                         |
                         +---------------+---------------+
                         |                               |
                         v                               v
           [TRAILING 15 DAYS: T - 15d to T]  [UPCOMING 15 DAYS: T to T + 15d]
           +-----------------------------+   +-----------------------------+
           | Historical Closed Offerings |   | Scheduled Pipeline Offerings|
           +--------------+--------------+   +--------------+--------------+
                          |                                 |
                          v                                 v
           +-----------------------------+   +-----------------------------+
           | Official Exchange Tallies   |   | Ex-Ante Cutoff Check        |
           | (Total, QIB, NII, Retail)   |   | (Strict 09:59:59 IST)       |
           +--------------+--------------+   +--------------+--------------+
                          |                                 |
                          v                                 v
           +-----------------------------+   +-----------------------------+
           | Actual Listing Price & Gain |   | Frozen Production ML Models |
           | (NSE/BSE First Trade Price) |   | (XGBoost, RF, LightGBM)     |
           +--------------+--------------+   +--------------+--------------+
                          |                                 |
                          v                                 v
           +-----------------------------+   +-----------------------------+
           | Compare vs Ex-Ante Forecast |   | Category Forecast & SHAP    |
           | (Zero Retrospective Backfill|   | (Total, QIB, NII, Retail)   |
           +--------------+--------------+   +--------------+--------------+
                          |                                 |
                          +---------------+-----------------+
                                          |
                                          v
                     +---------------------------------------+
                     |   Indicative Grey Market Layer (GMP)  |
                     |   - Labelled: Unofficial / Indicative |
                     |   - Implied Listing: High + GMP       |
                     |   - No fabricated GMP forecasts       |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |   FastAPI Intelligence Endpoints      |
                     |   (/api/v1/ipo/overview, last-15-days,|
                     |    next-15-days, {id}, sources, hist) |
                     +-------------------+-------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |  React 18 + TypeScript Dashboard      |
                     |  (Overview KPIs, Upcoming Forecasts,  |
                     |   Historical Outcomes, Drill-Down)    |
                     +---------------------------------------+
```

---

## 1. Modular Components Decomposition

### A. Backend Services
1. **`backend/schemas/intelligence_schemas.py`**:
   - Strictly typed Pydantic models: `UpcomingIPOForecast`, `PastIPOResult`, `MarketOverviewSummary`, `GMPIndicator`, `ListingMetrics`, `PredictedSubscriptions`, `ActualSubscriptions`.
   - Incorporates statutory disclosures (`disclaimer`, `implied_price_label`, `gmp_forecast_note`).
2. **`backend/monitoring/ipo_intelligence.py`**:
   - `get_last_15_days_ipos(reference_date)`: Filters IPOs closed or listed in $[T - 15\text{d}, T]$. Enforces zero retrospective prediction: if an IPO was not prospectively logged pre-open, `predicted_subscriptions` is strictly `None`.
   - `get_next_15_days_ipos(reference_date)`: Discovers IPOs opening in $[T, T + 15\text{d}]$ (or currently open). Runs frozen production inference and TreeSHAP feature attributions.
   - `get_market_overview(reference_date)`: Computes aggregate momentum metrics across the 30-day window.
   - `get_ipo_deep_dive(ipo_id)`: Provides complete lifecycle milestones, statutory parameters, 45-feature snapshot, and source provenance.
3. **`backend/routers/intelligence_routes.py`**:
   - Exposes RESTful endpoints registered under `/api/v1/ipo/*`.

### B. Frontend Architecture
1. **Dual-Mode Dashboard (`frontend/src/pages/Dashboard.tsx`)**:
   - **Mode 1 (Live Intelligence Platform):** Interactive overview cards, upcoming forecast cards, historical outcome cards, demand charts, and drill-down modal.
   - **Mode 2 (Custom Scenario Analysis):** Preserves the interactive `IPOForm` and simulation suite for ad-hoc / what-if modeling.
2. **Intelligence UI Components (`frontend/src/components/intelligence/`)**:
   - `MarketOverviewCards.tsx`: 4 KPI metrics and data integrity banner.
   - `Next15DaysSection.tsx`: Upcoming forecast cards with category predictions, indicative GMP, and implied listing estimates.
   - `Last15DaysSection.tsx`: Past outcome cards with actual vs predicted subscription, prediction error, and actual listing gain.
   - `IPODetailModal.tsx`: Drill-down modal with timeline milestones, statutory terms, and source provenance.
   - `IPOIntelligenceCharts.tsx`: Subscription demand distribution and listing performance charts.

---

## 2. Temporal Leakage Safeguards
1. **Ex-Ante Statutory Cutoff:** Predictions for upcoming IPOs must be generated prior to `09:59:59 IST` on the open date. No post-open subscription counts or listing data can enter the feature vector.
2. **Zero Retrospective Prediction:** For past IPOs that did not have an ex-ante prediction recorded in `live_predictions/` before the offering opened, the system explicitly displays actuals only (`prediction: null`).
3. **Indicative Labeling:** GMP-implied listing prices are explicitly designated as `"GMP-implied listing estimate"`, preventing confusion with guaranteed listing prices.
