# Research & Engineering Methodology

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## 1. Methodological Pipeline Overview

The proposed research methodology follows a rigorous, sequential, and reproducible pipeline designed to ensure absolute temporal integrity (no data leakage), high predictive precision, transparent explainability, and autonomous agentic synthesis.

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Historical Indian IPO Dataset Curation & Ingestion                  │
│    - Mainline IPOs (BSE/NSE) + SEBI Prospectuses + Macro Indicators    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. Data Sanitization, Preprocessing & Quality Assurance               │
│    - Missing value imputation, Outlier clipping, Type casting          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. Feature Engineering & Strict Pre-IPO Anti-Leakage Boundary          │
│    - Ratios, Peer Disparity, Market Regimes, Sentiment Embeddings      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. Exploratory Data Analysis (EDA) & Skewness Analysis                 │
│    - Heavy-tail subscription analysis & log(1+y) transformation        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. Temporal Train / Validation / Test Splitting                        │
│    - Out-of-time temporal partition (Train < 2023, Test >= 2023)      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. Model Training, Hyperparameter Tuning & Cross-Validation            │
│    - Baselines, Random Forest, XGBoost, LightGBM (Per-Category Models)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 7. Explainable AI (XAI) with TreeSHAP                                  │
│    - Global feature importance & Local waterfall attributions          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 8. Allotment-Oriented Category Recommendation Engine                   │
│    - Probability modeling, capital eligibility, risk scoring           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 9. Agentic AI Multi-Agent Orchestration (LangGraph)                    │
│    - 9 Specialized Agents, Tool Calling & Structured Report Generation │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 10. Temporal Walk-Forward Backtesting & Empirical Validation           │
│     - Simulation under strict historical information horizons          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Pipeline Stages

### Stage 1: Dataset Curation & Ingestion
* **Universe:** Historical Indian Mainline IPOs listed on the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE).
* **Data Sources:**
  - **IPO Terms & Subscription Data:** SEBI filings, NSE/BSE official circulars, and Chittorgarh IPO databases.
  - **Company Financials:** Audited 3-year pre-IPO statements from Draft Red Herring Prospectus (DRHP) and Red Herring Prospectus (RHP).
  - **Market & Macro Data:** Historical NIFTY 50, NIFTY 500, India VIX, and sector indices.
  - **Sentiment & Media Data:** Pre-IPO news headlines, articles, and historical Grey Market Premium (GMP) series.

---

### Stage 2: Data Cleaning & Preprocessing
* **Missing Value Treatment:**
  - Explicit distinction between `Unavailable` (missing historical metric), `Zero` (e.g., zero debt), and `Not Applicable` (e.g., SME issue lacking QIB quota).
  - Median imputation conditioned on industry sector for missing valuation multiples.
* **Outlier Analysis & Transformation:**
  - Identification of extreme subscription multiples (e.g., subscription > 100x).
  - Application of log-transform: \(y^* = \ln(1 + y)\) on target subscription variables to normalize skewed distributions.
* **Categorical Encoding:** One-Hot Encoding for low-cardinality features (Issue Type, Exchange); Target / Frequency encoding for Industry sectors.

---

### Stage 3: Feature Engineering & Anti-Leakage Boundary
* **Strict Temporal Rule:** All input features \(X_i\) for an IPO \(i\) must have a historical timestamp strictly prior to **10:00 AM IST on the IPO Opening Date** (\(T_{\text{open}}\)).
* **Feature Categories:**
  1. **Issue Structure:** Issue size (Rs. Cr), Fresh issue ratio, OFS ratio, Price band spread \(\frac{P_{\text{high}} - P_{\text{low}}}{P_{\text{low}}}\), Lot size, Minimum retail investment.
  2. **Fundamentals:** 3-year Compound Annual Growth Rate (CAGR) of Revenue, PAT Margin, EBITDA Margin, Return on Equity (ROE), Return on Capital Employed (ROCE), Debt-to-Equity.
  3. **Valuation Multiples:** P/E Ratio, P/B Ratio, Enterprise Value-to-Sales, Peer Valuation Spread \(\text{P/E}_{\text{offer}} - \text{P/E}_{\text{industry}}\).
  4. **Market Climate:** 30-day and 90-day NIFTY 50 return prior to open, 30-day average India VIX, recent 90-day IPO success rate.
  5. **Sentiment & Text:** News sentiment polarity, pre-IPO news volume, GMP percentage \(\frac{\text{GMP}}{P_{\text{high}}} \times 100\).

---

### Stage 4: Temporal Splitting Protocol
To avoid lookahead bias, random k-fold cross-validation is strictly avoided across the time horizon:
* **Training Set:** Historical IPOs listed prior to 2023.
* **Validation Set:** Time-series expanding window (walk-forward cross-validation on training partition).
* **Untouched Out-of-Time Test Set:** IPOs listed in 2023 and 2024.

---

### Stage 5: Machine Learning Model Suite
We develop four distinct regression pipelines targeting:
1. \(Y_{\text{QIB}}\) (Expected QIB Subscription)
2. \(Y_{\text{NII}}\) (Expected NII Subscription)
3. \(Y_{\text{Retail}}\) (Expected Retail Subscription)
4. \(Y_{\text{Total}}\) (Expected Total Subscription)

#### Candidate Model Architectures:
* **Baselines:** Mean/Median Baseline, Ordinary Least Squares (OLS) Linear Regression, Ridge Regularized Regression (\(L_2\)).
* **Bagging Ensembles:** Random Forest Regressor (combining decorrelated decision trees).
* **Gradient Boosting:**
  - **XGBoost (Extreme Gradient Boosting):** Regularized objective \(\mathcal{L}(\theta) = \sum l(y_i, \hat{y}_i) + \sum \Omega(f_k)\).
  - **LightGBM:** Fast, histogram-based gradient boosting with Leaf-wise (best-first) tree growth.

---

### Stage 6: Statistical Evaluation Metrics
All regression models are evaluated using standard quantitative criteria:
1. **Mean Absolute Error (MAE):** \(\frac{1}{n}\sum_{i=1}^n |y_i - \hat{y}_i|\)
2. **Root Mean Squared Error (RMSE):** \(\sqrt{\frac{1}{n}\sum_{i=1}^n (y_i - \hat{y}_i)^2}\)
3. **Median Absolute Error (MedAE):** \(\text{median}(|y_1 - \hat{y}_1|, \dots, |y_n - \hat{y}_n|)\)
4. **Coefficient of Determination (\(R^2\)):** \(1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}\)
5. **Prediction Interval Coverage:** 90% empirical prediction intervals computed via quantile regression / residual bootstrapping.

---

### Stage 7: Explainable AI (TreeSHAP)
Using Shapley Additive Explanations (Lundberg & Lee, 2017), the prediction \(\hat{f}(x)\) is decomposed into additive feature contributions:
\[
\hat{f}(x) = \phi_0 + \sum_{j=1}^M \phi_j(x)
\]
where \(\phi_0\) represents the base expected prediction across the dataset, and \(\phi_j(x)\) represents the local attribution of feature \(j\) for a specific IPO.

---

### Stage 8: Category Recommendation Engine
The decision engine formulates a risk-adjusted category score:
* Evaluates applicant capital \(C\) against regulatory thresholds:
  - Retail: \(C \le \text{Rs. } 200,000\)
  - Small HNI (S-NII): \(\text{Rs. } 200,000 < C \le \text{Rs. } 1,000,000\)
  - Big HNI (B-NII): \(C > \text{Rs. } 1,000,000\)
* Computes estimated allotment probabilities:
  \[
  P(\text{Allotment}_{\text{Retail}}) \approx \min\left(1.0, \frac{1}{\max(1.0, \hat{Y}_{\text{Retail}})}\right)
  \]
* Generates research signals:
  - `APPLY`: Positive model expected return, favorable category allotment odds, acceptable risk score.
  - `WATCH`: Borderline demand, elevated market volatility (VIX > 20), valuation at par with peers.
  - `AVOID`: Negative sentiment, excessive valuation premium, high debt, or severe institutional avoidance.

---

### Stage 9: LangGraph Agentic AI Architecture
An autonomous multi-agent state graph orchestrates the end-to-end analytical workflow:
1. **IPO Research Agent:** Extracts issue dates, price band, lot size, issue structure.
2. **Financial Agent:** Analyzes balance sheet, income statement, CAGR, profitability ratios.
3. **Valuation Agent:** Compares P/E, P/B against listed industry peers.
4. **Market Agent:** Queries NIFTY 50 trend, India VIX, sector performance.
5. **Sentiment Agent:** Ingests pre-IPO news headlines and sentiment polarity.
6. **Historical Agent:** Retrieves the top \(k\) most similar historical IPO cohorts.
7. **Prediction Agent:** Invokes serialized ML models to compute \(\hat{Y}_{\text{QIB}}, \hat{Y}_{\text{NII}}, \hat{Y}_{\text{Retail}}, \hat{Y}_{\text{Total}}\).
8. **Recommendation Agent:** Executes category optimizer and generates research signal.
9. **Explanation Agent:** Generates audit-ready markdown reports with SHAP factor breakdowns.

---

### Stage 10: Temporal Walk-Forward Backtesting
* For every historical IPO in the out-of-time test set:
  1. Hide all post-opening data.
  2. Execute the complete multi-agent and ML forecasting pipeline.
  3. Compare predictions \(\hat{Y}\) against actual subscription outcomes \(Y\).
  4. Benchmark performance against:
     - Pure ML (Tabular only)
     - ML + Sentiment
     - ML + Market
     - Agent-assisted Integrated Pipeline
