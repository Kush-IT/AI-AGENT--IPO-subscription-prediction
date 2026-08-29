# Academic & Technical Novelty Statement

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## 1. Overview & Positioning

The purpose of this document is to clearly delineate the defensible research contributions of this project relative to existing literature on Initial Public Offerings (IPOs), machine learning in computational finance, and Agentic AI architectures.

In alignment with academic standards of scientific humility and rigor, we avoid claims of absolute novelty and instead frame our contributions around specific, quantifiable methodological advancements and architectural integrations where prior research exhibits documented gaps.

---

## 2. Core Methodological & Technical Contributions

### Contribution 1: Pure Ex-Ante Pre-IPO Multi-Target Forecasting
* **Current State in Literature:** Existing computational models predominantly focus on either predicting binary listing-day success (positive vs. negative return) or modeling listing underpricing using subscription multiples as an *input* feature (which is only known after subscription closes).
* **Proposed Advancement:** This study presents a dedicated machine learning framework for forecasting continuous subscription multiples across investor categories using **strictly ex-ante pre-IPO data** (timestamped prior to issue opening). This provides institutional and retail market participants with actionable demand forecasts *before* committing capital.

### Contribution 2: Disaggregated Category-Wise Demand Modeling (QIB, NII, Retail)
* **Current State in Literature:** Most prior empirical works aggregate investor demand into a single omnibus total subscription metric. However, empirical market analyses reveal that Qualified Institutional Buyers (QIBs), Non-Institutional High-Net-Worth Individuals (NIIs), and Retail Individual Investors (RIIs) exhibit fundamentally distinct bidding behaviors and capital constraints.
* **Proposed Advancement:** We construct separate, specialized gradient boosting models (QIB ML, NII ML, Retail ML) with category-specific feature engineering. This enables the capture of heterogeneous feature elasticities and yields a more accurate, bottom-up total subscription estimate.

### Contribution 3: Unified Multimodal & Multi-Source Feature Synthesis
* **Current State in Literature:** Prior research typically examines financial ratios, macroeconomic indices, prospectus text, or grey market prices in isolation.
* **Proposed Advancement:** Our framework systematically integrates five complementary data dimensions into a unified pre-IPO feature matrix:
  1. Audited balance sheet & income statement fundamentals (3-year CAGR, ROE, ROCE, Debt/Equity).
  2. Issue pricing & peer valuation disparity (P/E relative to listed industry comparables).
  3. Pre-IPO market regime indicators (NIFTY 50 momentum, 30-day India VIX volatility).
  4. Quantified news sentiment polarity and pre-IPO media buzz.
  5. Historical comparable IPO cohort behaviors.

### Contribution 4: Mathematical Allotment Optimization & Decision Support
* **Current State in Literature:** Standard predictive models stop at numeric predictions without translating forecasts into practical capital allocation strategies under real-world regulatory constraints.
* **Proposed Advancement:** We propose an algorithmic recommendation engine that integrates predicted category demand with Indian regulatory allotment rules (computerized lottery for Retail vs. proportionate/tiered allocation for NIIs) and applicant capital constraints to recommend the optimal eligible bidding category alongside calibrated `APPLY` / `WATCH` / `AVOID` research signals.

### Contribution 5: Transparent Local & Global Game-Theoretic Explainability (TreeSHAP)
* **Current State in Literature:** High-performing ensemble models in financial contexts often operate as uninterpretable black boxes, limiting their adoption by institutional investors and researchers.
* **Proposed Advancement:** We integrate TreeSHAP (Lundberg & Lee, 2017) to provide consistent, mathematically grounded feature attributions for every individual prediction, allowing users to understand the precise fundamental, valuation, and market factors driving each category forecast.

### Contribution 6: Autonomous Agentic AI Orchestration via LangGraph
* **Current State in Literature:** Standalone LLMs struggle with precise numerical calculations and financial regression, while classical ML pipelines lack conversational synthesis and qualitative context generation.
* **Proposed Advancement:** We design a LangGraph multi-agent architecture where 9 specialized autonomous agents collaborate statefully to gather real-time data, execute ML models, compute SHAP attributions, optimize investor categories, and synthesize comprehensive, human-readable research reports with transparent risk disclosures.

### Contribution 7: Dynamic Post-Opening Subscription Ingestion
* **Current State in Literature:** Most academic IPO models are static single-shot predictors that cannot adapt as real-time market bidding data emerges.
* **Proposed Advancement:** We implement a sequential update mechanism that refines initial pre-IPO forecasts upon ingesting Day-1 and Day-2 intraday subscription updates, bridging ex-ante forecasting with dynamic Bayesian observation.

---

## 3. Comparison with Baseline and Prior State of the Art

| Dimension | Prior Academic State of the Art | Proposed Framework Advancement |
|---|---|---|
| **Target Variable** | Binary listing gain or aggregate listing return | Multi-target continuous subscription multiples (\(Y_{\text{QIB}}, Y_{\text{NII}}, Y_{\text{Retail}}, Y_{\text{Total}}\)) |
| **Temporal Data Scope** | Frequently incorporates Day-2 or post-close data | Strict pre-IPO temporal quarantine (no future data leakage) |
| **Investor Segmentation** | Aggregated total subscription | Category-specific decomposed gradient boosted models |
| **Feature Depth** | Siloed (only fundamentals or only sentiment) | Fused (Fundamentals + Valuation + Market + Sentiment + Cohorts) |
| **Model Interpretability** | OLS regression p-values or black-box predictions | Per-category and per-IPO local TreeSHAP attribution waterfalls |
| **Allotment Logic** | None (pure raw prediction) | Algorithmic allotment probability & category recommendation |
| **Orchestration** | Disjointed scripts and manual data wrangling | LangGraph multi-agent autonomous research and report synthesis |
| **Post-Open Updating** | Static single-shot prediction | Sequential dynamic updating on Day 1 & Day 2 subscription feeds |
