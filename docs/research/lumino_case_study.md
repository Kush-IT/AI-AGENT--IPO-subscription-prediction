# Case Study: Prospective Real-IPO Forecasting & Forward Evaluation — Lumino Industries Ltd

## 1. Executive Summary & Prospective Protocol
* **Company Name:** Lumino Industries Ltd
* **ISIN:** INE0ABC01019
* **Offering Type:** Book-Built Initial Public Offering (Mainboard BSE & NSE)
* **IPO Open Date:** August 27, 2026 (09:59:59 IST statutory cutoff)
* **IPO Close Date:** August 31, 2026
* **Subsystem Status:** `PROSPECTIVE_OUTCOME_EVALUATED`
* **Overall Lifecycle State:** `COMPLETED`
* **Prediction ID:** `308e97b4-45c7-4605-a00c-f60798dc19d9`
* **Prediction Timestamp:** `2026-08-26T10:53:50.825864+00:00` (Strictly ex-ante, preceding opening bell)
* **Outcome Attachment Timestamp:** `2026-08-31T18:00:00+05:30` (Strictly post-offering close)
* **Feature Snapshot Hash (SHA-256):** `79338cc270661e7d884b6903fae9f62e4114c559d4556bd1407888d6ddb47859`

---

## 2. Prospective Prediction vs. Actual Exchange Outcome

| Target Dimension | Candidate Model Architecture | Scale Transformation | Ex-Ante Forecast | Verified Outcome | Absolute Error | Signed Bias | APE (%) |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Total Aggregate Demand** | **XGBoost Regressor** | $\log(1+y)$ | **49.20×** | **51.34×** | **2.14×** | **-2.14×** | **4.17%** |
| **QIB Institutional** | **Random Forest Regressor** | $\text{RAW}$ | **113.51×** | **118.42×** | **4.91×** | **-4.91×** | **4.15%** |
| **NII Corporate / HNI** | **LightGBM Regressor** | $\log(1+y)$ | **58.08×** | **62.15×** | **4.07×** | **-4.07×** | **6.55%** |
| **Retail Individual (RII)** | **XGBoost Regressor** | $\text{RAW}$ | **17.19×** | **16.85×** | **0.34×** | **+0.34×** | **2.02%** |

---

## 3. Category Recommendation Accuracy & Leading Edge

* **Predicted Strongest Category:** **Qualified Institutional Buyers (QIB)** at **113.51×**
* **Actual Strongest Category:** **Qualified Institutional Buyers (QIB)** at **118.42×**
* **Actual Runner-Up:** Non-Institutional Investors (NII) at **62.15×**
* **Actual Leading Category Edge:**
  \[
  \text{Actual Category Edge} = \frac{118.42 - 62.15}{62.15} \times 100 = \mathbf{90.54\%}
  \]
* **Category Prediction Accuracy:** **`CORRECT`** (Both predicted and actual rank ordering: $\text{QIB} > \text{NII} > \text{Retail}$).

---

## 4. Confidence Calibration & Error Analysis

* **Original Diagnostic Confidence Score:** **100 / 100 (`HIGH`)**
* **Total Absolute Percentage Error (APE):** **4.17%**
* **Calibration Classification:** **`WELL_CALIBRATED`**
  * The model exhibited high diagnostic confidence supported by 100% complete statutory RHP data, strong GMP (+56.10%), and low India VIX (10.48), which was corroborated by tight real-world forecasting accuracy ($\le 6.55\%$ APE across all categories).

---

## 5. TreeSHAP Additive Feature Attributions (Observational Language)

Local TreeSHAP decomposition of the Total Subscription prediction ($49.20\times$) generated strictly pre-open:

### 5.1 Leading Positive Contributors
1. **`gmp_percentage` (+56.10%):** Contributed $+0.6595$ to the model log-prediction (*primary positive listing signal*).
2. **`negative_news_ratio` (0.00):** Contributed $+0.0941$ (*absence of adverse editorial coverage*).
3. **`india_vix` (10.48):** Contributed $+0.0793$ (*constructive, low-volatility secondary market environment*).
4. **`valuation_discount_pct` (64.34%):** Contributed positively to the model prediction relative to high-multiple sector peers.

### 5.2 Restraining Contributors
1. **`issue_size_in_crore` (₹700 Cr):** Contributed a slight scale absorption restraint relative to micro-cap offerings.

---

## 6. Population Stability Index (PSI) Drift Status

* **Input Feature Drift:** $\text{PSI} < 0.10$ (**`LOW DRIFT`**)
* **Target Distribution Shift:** $\text{PSI} < 0.10$ (**`LOW DRIFT`**)
* **Operational Model Status:** **`STABLE`**

---

## 7. Model Integrity & Cryptographic Signatures

All 5 frozen candidate joblib files were verified before outcome attachment and remained strictly identical to canonical signatures:
* `dev_preprocessor.joblib`: `04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57`
* `total_xgboost_log1p.joblib`: `3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6`
* `qib_random_forest_raw.joblib`: `29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5`
* `nii_lightgbm_log1p.joblib`: `618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29`
* `retail_xgboost_raw.joblib`: `835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab`

---

## 8. Methodological Conclusion

*Lumino Industries Ltd represents an initial prospective case study ($N=1$). While forecasting error across all 4 investor tiers remained exceptionally tight ($2.02\% - 6.55\%$ APE) and category rank ordering was correctly anticipated, this single case study does not establish statistical proof of generalized invariance. The platform continues to log upcoming Mainboard offerings into the prospective validation dataset to accumulate longitudinal evidence.*
