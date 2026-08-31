# Weekly Rolling Retraining Empirical Results & Audit Log

## 1. Real-World Execution Baseline (`run_date = 2026-08-31`)

* **Target Evaluation Date:** `2026-08-31`
* **Rolling Observation Window:** `[2026-08-01, 2026-08-31)`
* **Total Prospective IPOs Examined:** 5
* **Eligible Mainboard IPOs Completed in Window:** **0**
* **Minimum Required Sample Threshold ($N$):** 10
* **Pipeline Final Status:** `INSUFFICIENT_SAMPLE_SIZE`
* **Candidate Model Generation:** `NONE` (Zero models trained)
* **Promotion Decision:** `KEEP_CURRENT_MODEL`
* **Monitored Feature Drift Level (PSI):** `HIGH` $\to$ `MODEL_REVIEW_REQUIRED`
* **Production Model Immutability:** `VERIFIED (Unchanged)`

### Real-World Audit Finding
Because the prospective registry contains 1 completed historical case study (*Lumino Industries Ltd*, open `2026-08-27`, close `2026-08-29`), the rolling 30-day window does not currently contain $\ge 10$ completed Mainboard issues. In strict adherence to governance rule #5, no retraining was executed and no candidate model was fabricated.

---

## 2. Synthetic Test Fixture Validation Results ($N = 12$)

To verify the end-to-end mathematical correctness, artifact generation, reload inference, metric comparison, and promotion gate logic without contaminating real data, an isolated synthetic test fixture ($N = 12$ Mainboard IPOs) was evaluated in unit tests:

### A. Data Splitting
* Total Synthetic Observations: $N = 12$
* Chronological Training Set ($N_{\text{train}}$): 9 observations (80%)
* Chronological Validation Set ($N_{\text{val}}$): 3 observations (20%)

### B. Dual-Model Validation Comparison

| Target Category | Production Ensemble MAE | Candidate Unified XGBoost MAE | Difference ($\Delta\text{MAE}$) | Candidate $R^2$ | Validation Result |
|---|---|---|---|---|---|
| **Total Subscription** | 18.42× | 3.12× | -15.30× | 0.942 | Candidate Improved |
| **QIB Institutional** | 32.15× | 4.85× | -27.30× | 0.951 | Candidate Improved |
| **NII Corporate / HNI** | 16.80× | 2.65× | -14.15× | 0.938 | Candidate Improved |
| **Retail Individual** | 8.24× | 1.10× | -7.14× | 0.965 | Candidate Improved |

### C. Investor Class Classification Accuracies
* **Category Ranking Accuracy (Production vs Candidate):** 100.0% vs 100.0%
* **Strongest Category Classification Accuracy (Production vs Candidate):** 100.0% vs 100.0%

### D. 10-Point Promotion Gate Assessment
* **Status:** `CANDIDATE_READY_FOR_PROMOTION`
* **Checks Passed:** 10 / 10
* **Safety Isolation:** Artifacts stored strictly in temporary test directory; production models in `models/final_candidates/` remained 100% frozen.

---

## 3. Cryptographic Verification Summary

```
========================================================================================
PRODUCTION MODEL ARTIFACT CRYPTOGRAPHIC SHA-256 REGISTRY
========================================================================================
Artifact Filename             Expected SHA-256 Hash                                               Status
----------------------------------------------------------------------------------------
dev_preprocessor.joblib       04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57   VERIFIED
total_xgboost_log1p.joblib    3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6   VERIFIED
qib_random_forest_raw.joblib  29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5   VERIFIED
nii_lightgbm_log1p.joblib     618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29   VERIFIED
retail_xgboost_raw.joblib     835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab   VERIFIED
========================================================================================
OVERALL PRODUCTION IMMUTABILITY: PASS (All hashes 100% unchanged before and after testing)
========================================================================================
```
