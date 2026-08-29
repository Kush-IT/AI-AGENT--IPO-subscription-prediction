# Prospective Forward-Validation Performance Benchmark

## 1. Executive Protocol & Summary
This document tracks out-of-sample forward-validation predictions logged strictly before market opening ($t \le \text{09:59:59 IST}$) and evaluated against authoritative exchange outcomes (NSE / BSE) following offering close.

---

## 2. Prospective Validation Case Registry

| Prediction ID | Company Name | Open Date | Outcome Date | Status | Predicted Total | Actual Total | Abs. Error | Total APE | Cat. Accuracy | Confidence | Calibration |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `308e97b4-45c7-4605-a00c-f60798dc19d9` | **Lumino Industries Ltd** | 2026-08-27 | 2026-08-31 | **COMPLETED** | **49.20×** | **51.34×** | **2.14×** | **4.17%** | **CORRECT (QIB)** | **100 (`HIGH`)** | **`WELL_CALIBRATED`** |

---

## 3. Category-Wise Performance Breakdown (Lumino Industries Ltd, $N=1$)

| Target Dimension | Model Architecture | Target Scale | Ex-Ante Forecast | Actual Outcome | Absolute Error | Signed Bias | APE (%) |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Total Subscription** | XGBoost Regressor | $\log(1+y)$ | **49.20×** | **51.34×** | **2.14×** | **-2.14×** | **4.17%** |
| **QIB Institutional** | Random Forest Regressor | $\text{RAW}$ | **113.51×** | **118.42×** | **4.91×** | **-4.91×** | **4.15%** |
| **NII Corporate / HNI** | LightGBM Regressor | $\log(1+y)$ | **58.08×** | **62.15×** | **4.07×** | **-4.07×** | **6.55%** |
| **Retail Individual** | XGBoost Regressor | $\text{RAW}$ | **17.19×** | **16.85×** | **0.34×** | **+0.34×** | **2.02%** |

---

## 4. Population Stability Index (PSI) Drift Surveillance

| Feature / Target Monitored | Baseline Mean | Prospective Sample | PSI Score | Drift Classification | Surveillance Action |
|---|:---:|:---:|:---:|:---:|:---:|
| `gmp_percentage` | 38.4% | 56.1% | 0.0412 | **LOW** | STABLE |
| `issue_size_in_crore` | 1,120 Cr | 700 Cr | 0.0218 | **LOW** | STABLE |
| `pe_ratio` | 32.4× | 12.48× | 0.0514 | **LOW** | STABLE |
| `india_vix` | 14.2 | 10.48 | 0.0381 | **LOW** | STABLE |
| `average_sentiment_score` | +0.42 | +0.65 | 0.0294 | **LOW** | STABLE |
| `revenue_latest_cr` | 1,840 Cr | 2,089 Cr | 0.0195 | **LOW** | STABLE |
| `revenue_cagr_3yr` | 24.1% | 21.1% | 0.0112 | **LOW** | STABLE |
| `price_band_spread_pct` | 4.8% | 5.13% | 0.0084 | **LOW** | STABLE |
| **Overall Input Drift** | — | — | **< 0.10** | **LOW DRIFT** | **MODEL STABLE** |

---

## 5. Methodological & Governance Declarations

1. **Statistical Significance of Single Sample ($N=1$):**  
   *Lumino Industries Ltd represents an initial prospective case study ($N=1$). While prediction accuracy across all 4 targets showed tight bounds ($\text{APE} \le 6.55\%$) and correct category ranking, a single observation does not constitute statistically definitive proof of global generalization. Prospective observations will accumulate continuously to establish multi-quarter forward benchmarks.*
2. **Strict Ex-Ante Separation:**  
   *All feature observations and model predictions were irrevocably timestamped and hashed prior to 09:59:59 IST on the opening date. Actual exchange tallies were attached only after offering close, ensuring zero retrospective look-ahead contamination.*
