# Research Questions

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## Overview

To systematically investigate the predictability of Indian IPO subscription demand and address the gaps identified in the academic literature, this research formulates six core Research Questions (RQs). Each question is defined with its academic rationale, empirical methodology, and formal evaluation criteria.

---

### RQ1: Pre-IPO Total Subscription Predictability
> **Research Question 1:** *Can machine learning models accurately predict total IPO subscription demand using exclusively information available before the IPO subscription window opens?*

* **Theoretical Rationale:** Traditional financial literature suggests that public offerings in emerging markets suffer from high ex-ante uncertainty and speculative noise. This question tests whether pre-IPO structured signals (issue terms, corporate fundamentals, peer valuation, market climate, and news sentiment) contain sufficient predictive signal to forecast total subscription multiples without relying on post-opening bidding data.
* **Methodological Approach:** Train multiple regression models on strictly quarantined ex-ante features and evaluate them on an out-of-time test partition of historical Indian IPOs.
* **Evaluation Criteria:** Regression error metrics: Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), Median Absolute Error (MedAE), and Coefficient of Determination (\(R^2\)).

---

### RQ2: Category-Specific Demand Decomposition
> **Research Question 2:** *Can category-specific machine learning models independently predict Qualified Institutional Buyer (QIB), Non-Institutional Investor (NII), and Retail Individual Investor (Retail) subscription demands?*

* **Theoretical Rationale:** Institutional investors (QIBs), high-net-worth individuals (NIIs), and retail bidders operate under distinct capital constraints, information endowments, and behavioral incentives. This question examines whether modeling each investor class separately improves forecasting granularity and captures category-specific demand elasticity.
* **Methodological Approach:** Construct independent regression pipelines targeting \(Y_{\text{QIB}}\), \(Y_{\text{NII}}\), and \(Y_{\text{Retail}}\), employing target transformations (e.g., \(\log(1+y)\)) to accommodate heavy-tailed category subscription distributions.
* **Evaluation Criteria:** Category-specific MAE, RMSE, \(R^2\), and comparative predictive error across institutional vs. retail cohorts.

---

### RQ3: Feature Importance and Demand Drivers
> **Research Question 3:** *Which IPO characteristics, financial fundamentals, valuation multiples, market indicators, and sentiment features exert the greatest influence on subscription demand across different investor categories?*

* **Theoretical Rationale:** Understanding the non-linear feature attributions behind subscription demand provides vital insights into market behavior, distinguishing fundamental drivers (e.g., ROE, EBITDA margin, debt-to-equity) from market-driven factors (e.g., India VIX, NIFTY 50 momentum, Grey Market Premium, news buzz).
* **Methodological Approach:** Apply game-theoretic Shapley Additive Explanations (TreeSHAP) globally across all models and locally for individual IPO cases to quantify feature attributions and directional interaction effects.
* **Evaluation Criteria:** Global mean absolute SHAP values, summary attribution plots, feature importance rankings, and category-level feature sensitivity comparisons.

---

### RQ4: Comparative Model Performance
> **Research Question 4:** *Which machine learning architecture (Linear/Ridge Baselines, Random Forest, XGBoost, or LightGBM) demonstrates the superior forecasting performance and generalization capability for IPO subscription prediction?*

* **Theoretical Rationale:** Financial tabular data exhibits complex non-linearities, collinearity, and extreme outliers. Comparing linear, bagging, and gradient boosting paradigms identifies the optimal model family for skewed IPO demand curves.
* **Methodological Approach:** Benchmark Mean Baseline, Linear Regression, Ridge Regression, Random Forest Regressor, XGBoost Regressor, and LightGBM Regressor using nested cross-validation and temporal walk-forward evaluation.
* **Evaluation Criteria:** Comparative statistical performance tables across all evaluation metrics (MAE, RMSE, MedAE, \(R^2\)) on unseen test datasets.

---

### RQ5: Algorithmic Category Recommendation
> **Research Question 5:** *Can an algorithmic decision engine effectively evaluate predicted category demand, application sizes, and regulatory allocation rules to recommend the optimal eligible investor category?*

* **Theoretical Rationale:** In the Indian IPO framework, retail allotment in oversubscribed issues is determined by a computerized lottery (one lot per selected applicant), whereas NII allotment follows tiered proportionate allocation. This question explores whether combining predicted demand with investor capital constraints yields mathematically grounded, allotment-oriented category recommendations.
* **Methodological Approach:** Design an optimization engine that computes category-wise allotment probability scores, expected value metrics, risk penalties, and provides a structured `APPLY` / `WATCH` / `AVOID` research signal.
* **Evaluation Criteria:** Backtested allotment probability improvements, risk-adjusted decision matrices, and scenario-based validation across diverse capital tranches.

---

### RQ6: Agentic AI Autonomous Orchestration
> **Research Question 6:** *Can an Agentic AI multi-agent architecture (orchestrated via LangGraph) successfully automate the end-to-end workflow of IPO data collection, financial analysis, ML forecasting, explainability generation, and research report synthesis?*

* **Theoretical Rationale:** While quantitative ML models produce raw numerical predictions, investors require comprehensive qualitative context, risk disclosures, and structured synthesis. This question tests whether specialized autonomous agents collaborating via stateful directed graphs can orchestrate this entire analytical lifecycle reliably.
* **Methodological Approach:** Construct a multi-agent system comprising 9 specialized agents (IPO Research, Financial, Valuation, Market, Sentiment, Historical Comparable, Prediction, Recommendation, and Explanation Agents) connected via a typed LangGraph state.
* **Evaluation Criteria:** Execution reliability, structured JSON schema adherence, contextual consistency, tool-calling precision, and qualitative depth of generated research reports.
