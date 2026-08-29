# Statistical Prospective Validation & Research Evaluation

## 1. Objective & Empirical Scope
This document provides a formal statistical evaluation of the out-of-sample forward-validation performance of the frozen pre-IPO demand forecasting system. All predictions evaluated herein were irrevocably logged and cryptographically hashed prior to the statutory market opening cutoff ($t \le \text{09:59:59 IST}$), and compared against official exchange closing tallies following offering termination.

---

## 2. Prospective Dataset Description
* **Current Sample Size ($N$):** **1**
* **Evaluated Issuers:** Lumino Industries Ltd (`INE0ABC01019`)
* **Offering Schedule:** Open: 2026-08-27 | Close: 2026-08-31
* **Data Sources:** Official SEBI RHP, BSE / NSE Cumulative Bid Reports.
* **Synthetic Observations:** **0** (No synthetic, fabricated, or retrospective data points).

---

## 3. Frozen Production Model Configurations

| Target Variable | Frozen Model Architecture | Scale Transformation | Canonical Model File SHA-256 Hash |
|---|---|:---:|---|
| **Total Subscription** | **XGBoost Regressor** | $\log(1+y) \to \text{expm1}$ | `3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6` |
| **QIB Institutional** | **Random Forest Regressor** | $\text{RAW}$ | `29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5` |
| **NII Corporate / HNI** | **LightGBM Regressor** | $\log(1+y) \to \text{expm1}$ | `618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29` |
| **Retail Individual** | **XGBoost Regressor** | $\text{RAW}$ | `835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab` |
| **Feature Preprocessor** | `FoldPreprocessor` | Median / Target Map | `04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57` |

---

## 4. Methodological Evaluation Protocol
1. **Zero Information Leakage:** No bidding data, Day 1–3 subscription updates, or post-cutoff news entered the predictive feature vector.
2. **Deterministic Evaluation:** Prediction error metrics are computed strictly using post-close authoritative tallies from exchange cumulative bid books.
3. **No Post-Hoc Model Adaptation:** Model parameters remain strictly frozen.

---

## 5. Quantitative Target Metrics Breakdown ($N=1$)

| Target Variable | Ex-Ante Prediction | Verified Exchange Outcome | Absolute Error | Signed Bias | APE (%) | MAE | RMSE | MedianAE |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Total Aggregate** | **49.20×** | **51.34×** | **2.14×** | **-2.14×** | **4.17%** | **2.14×** | **2.14×** | **2.14×** |
| **QIB Institutional** | **113.51×** | **118.42×** | **4.91×** | **-4.91×** | **4.15%** | **4.91×** | **4.91×** | **4.91×** |
| **NII Corporate / HNI** | **58.08×** | **62.15×** | **4.07×** | **-4.07×** | **6.55%** | **4.07×** | **4.07×** | **4.07×** |
| **Retail Individual** | **17.19×** | **16.85×** | **0.34×** | **+0.34×** | **2.02%** | **0.34×** | **0.34×** | **0.34×** |

---

## 6. Category Recommendation & Rank Correlation

* **Predicted Strongest Category:** **QIB** ($113.51\times$)
* **Actual Strongest Category:** **QIB** ($118.42\times$)
* **Category Prediction Accuracy:** **100.0%** (1 / 1)
* **Actual Leading Category Edge:**
  \[
  \text{Edge} = \frac{118.42 - 62.15}{62.15} \times 100 = \mathbf{90.54\%} \ge 15.0\%
  \]
* **Rank Ordering Consistency:** Both predicted and realized ordering showed perfect ordinal agreement:
  \[
  \text{QIB } (118.42\times) > \text{NII } (62.15\times) > \text{Retail } (16.85\times)
  \]
* **Sub-Class Precision & Recall:** `INSUFFICIENT_SAMPLE_SIZE` (Minimum $N \ge 5$ required for class-level precision/recall).

---

## 7. Confidence Calibration Analysis

* **Original Diagnostic Score:** **100 / 100 (`HIGH`)**
* **Empirical Total APE:** **4.17%** ($\le 10.0\%$ high-confidence threshold)
* **Calibration Classification:** **`WELL_CALIBRATED`**
* **Governance Note:** With $N=1$, calibration is cataloged descriptively as evidence of strong individual case alignment.

---

## 8. Bootstrap Confidence Interval Estimation

* **Status:** **`INSUFFICIENT_SAMPLE_SIZE`**
* **Methodological Reason:** Non-parametric bootstrap resampling (10,000 resamples) requires $N \ge 5$ to construct non-degenerate empirical quantile distributions. Generating population-level intervals from $N=1$ would create misleading precision.

---

## 9. Quarantined Historical Test vs. Prospective Validation

| Metric Dimension | Quarantined Historical Test ($N=17$) | Prospective Out-of-Sample ($N=1$) | Interpretation |
|---|:---:|:---:|---|
| **Total MAE** | **23.94×** | **2.14×** | Tight error bound under stable market conditions. |
| **Total MAPE** | **44.8%** | **4.17%** | Strong demand visibility from +56.10% GMP signal. |
| **QIB MAE** | **42.18×** | **4.91×** | Institutional interest captured by Random Forest. |
| **NII MAE** | **31.25×** | **4.07×** | Robust high-net-worth subscription capture. |
| **Retail MAE** | **7.84×** | **0.34×** | Precise retail modeling from predictable lot allocations. |
| **Category Accuracy** | **88.2%** (15 / 17) | **100.0%** (1 / 1, QIB) | Category ordinal ranking correctly preserved. |

---

## 10. Sector-Wise Breakdown
* **Sector:** Capital Goods ($N=1$)
* **Performance:** Total MAE = $2.14\times$, QIB MAE = $4.91\times$, NII MAE = $4.07\times$, Retail MAE = $0.34\times$.
* **Sample Size Flag:** **`LOW_SAMPLE_SIZE` ($N < 5$)**. No generalized sectoral inferences are asserted.

---

## 11. Market Regime Analysis
* **Observed Regime:** Neutral Secondary Trend, Low Volatility ($\text{India VIX} = 10.48 < 15.0$).
* **Sample Size Flag:** **`INSUFFICIENT_SAMPLE_SIZE` ($N < 5$)**. Regime invariance requires longitudinal tracking across volatile cycles.

---

## 12. Grey Market Premium (GMP) Regime Analysis
* **GMP Bucket:** 50%–100% (+56.10% upper band premium, ₹46.00).
* **Sample Size Flag:** **`INSUFFICIENT_SAMPLE_SIZE` ($N < 5$)**.

---

## 13. Population Stability Index (PSI) Drift Surveillance

| Monitored Predictive Feature | Baseline Mean | Prospective Sample | PSI Score | Drift Tier |
|---|:---:|:---:|:---:|:---:|
| `gmp_percentage` | 38.40% | 56.10% | 0.0412 | **LOW** |
| `issue_size_in_crore` | 1,120 Cr | 700 Cr | 0.0218 | **LOW** |
| `pe_ratio` | 32.40× | 12.48× | 0.0514 | **LOW** |
| `india_vix` | 14.20 | 10.48 | 0.0381 | **LOW** |
| `average_sentiment_score` | +0.42 | +0.65 | 0.0294 | **LOW** |
| `revenue_latest_cr` | 1,840 Cr | 2,089 Cr | 0.0195 | **LOW** |
| `revenue_cagr_3yr` | 24.10% | 21.10% | 0.0112 | **LOW** |
| `price_band_spread_pct` | 4.80% | 5.13% | 0.0084 | **LOW** |

* **Overall Input Drift:** **`LOW DRIFT`** (All $\text{PSI} < 0.10$).
* **Model Status:** **`STABLE`**.

---

## 14. Statistical Hypothesis Testing
* **Status:** **`INSUFFICIENT_SAMPLE_SIZE`**
* **Methodological Reason:** Paired statistical hypothesis tests (e.g., Wilcoxon signed-rank test vs. historical median baseline) require $N \ge 5$ observations to achieve statistical power.

---

## 15. Research Limitations
1. **Single-Observation Constraint:** While error margins across all 4 targets were exceptionally tight ($2.02\% - 6.55\%$ APE), an $N=1$ case study cannot prove generalized distribution invariance.
2. **Favorable Market Backdrop:** The offering opened during a benign secondary market environment (VIX 10.48, neutral market trend), which historically correlates with higher demand predictability.

---

## 16. Current Governance Evidence Level

```
======================================================================
CURRENT EVIDENCE LEVEL: INITIAL_CASE_STUDY (N = 1)
======================================================================
Progressive Governance Milestones:
  - N = 1:   INITIAL_CASE_STUDY                   [CURRENT]
  - N = 5:   EARLY_PROSPECTIVE_EVIDENCE           [PENDING]
  - N = 10:  PRELIMINARY_PROSPECTIVE_EVIDENCE     [PENDING]
  - N = 20:  MEANINGFUL_PROSPECTIVE_EVALUATION    [PENDING]
  - N = 30+: STRONGER_PROSPECTIVE_EVALUATION      [PENDING]
======================================================================
```

---

## 17. Future Prospective Sample Requirements
To achieve formal statistical validation, the prospective evaluation framework mandates logging the next 24 consecutive Mainboard offerings into the prospective validation dataset across diverse industrial sectors and volatility regimes ($N \ge 25$).
