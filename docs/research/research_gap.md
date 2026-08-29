# Research Gap Analysis

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## 1. Overview of the Research Landscape

While existing literature on Initial Public Offerings (IPOs) extensively investigates listing-day underpricing, aftermarket performance, and binary classification of IPO success, a critical examination of the literature reveals several structural, methodological, and practical research gaps—particularly concerning the emerging Indian equity market.

---

## 2. Identified Research Gaps in Existing Literature

### Gap 1: Scarcity of Pure Pre-IPO Subscription Multi-Target Regression
* **Existing Limitation:** The vast majority of published studies treat IPO oversubscription merely as an *independent explanatory variable* to explain listing-day underpricing (e.g., Sahoo & Rajib, 2010; Bansal et al., 2012; Sakharkar & Ramesh, 2019) or model IPO performance as a binary classification problem (e.g., Bastı et al., 2015; Ghosh et al., 2024).
* **Underexplored Domain:** There is **limited evidence** of machine learning frameworks dedicated specifically to forecasting the *continuous numerical subscription multiples* of upcoming IPOs prior to the opening of the bidding window using strictly ex-ante pre-IPO data.

### Gap 2: Absence of Category-Specific Demand Decomposition (QIB vs. NII vs. Retail)
* **Existing Limitation:** Existing forecasting models predominantly focus on aggregated total subscription or general listing return. However, institutional economics and empirical analyses (Sandhu & Guhathakurta, 2020; SEBI, 2024) demonstrate that Qualified Institutional Buyers (QIBs), Non-Institutional Investors (NIIs / HNIs), and Retail Individual Investors (RIIs) possess fundamentally heterogeneous utility functions, capital constraints, risk appetites, and information access.
* **Underexplored Domain:** **Few studies** have investigated whether training separate, specialized machine learning models for QIB, NII, and Retail subscription captures category-level feature elasticities better than a single omnibus total-subscription model.

### Gap 3: Methodological Susceptibility to Data Leakage in Pre-IPO Modeling
* **Existing Limitation:** In existing literature, models frequently incorporate intraday bidding data (e.g., Day-1 or Day-2 subscription rates), post-issue pricing updates, or contemporaneous post-close variables (e.g., Ghosh et al., 2024). While useful for short-term trading signals on the final day, this introduces subtle data leakage if the objective is to guide strategic capital allocation *before* the issue opens.
* **Underexplored Domain:** Establishing a strict, temporally isolated pre-IPO feature engineering pipeline—completely quarantined from post-open and post-close variables—**requires further empirical investigation**.

### Gap 4: Fragmented Feature Integration (Fundamentals, Valuation, Market, Sentiment & Peers)
* **Existing Limitation:** Prior literature typically examines financial fundamentals, valuation metrics, macroeconomic variables, or textual sentiment in isolation:
  - Econometric studies focus primarily on balance-sheet fundamentals (Bhatia & Singh, 2012; Anand & Singh, 2019).
  - NLP studies focus exclusively on news sentiment or prospectus text (Bajo & Raimondo, 2017; Ly & Nguyen, 2020).
  - Practical market tools rely heavily on informal Grey Market Premiums (GMP).
* **Underexplored Domain:** There is **limited evidence** of an end-to-end framework that systematically fuses structured fundamentals (P/E, ROE, ROCE, Debt/Equity), valuation relative to listed industry peers, macroeconomic indicators (NIFTY returns, India VIX), sentiment scores, and historical comparable IPO cohorts into a unified ML feature vector.

### Gap 5: Lack of Granular Explainability (XAI) in Category-Specific IPO Forecasting
* **Existing Limitation:** Complex non-linear models (e.g., Gradient Boosted Trees, Deep Neural Networks) often operate as black-box predictors. When interpretable models are used, they are generally limited to linear coefficients or simplified decision rules (Wang et al., 2018; Baba & Sevil, 2020).
* **Underexplored Domain:** The application of game-theoretic attribution methods (such as TreeSHAP) to explain *why* distinct investor categories (e.g., why QIBs demand an issue while Retail avoids it) respond differently to specific valuation or growth signals **remains underexplored**.

### Gap 6: Disconnect Between Subscription Prediction and Actionable Category Optimization
* **Existing Limitation:** Existing academic models output raw predicted percentages or returns without translating these forecasts into practical, allotment-oriented decision logic. In reality, retail allotment in Indian IPOs follows a lottery mechanism for oversubscribed issues, whereas NII allotment follows proportionate and tiered lot allocation rules (SEBI, 2024).
* **Underexplored Domain:** The development of an algorithmic decision engine that maps category demand forecasts, application sizes, and regulatory allotment structures into optimal category selection **requires further investigation**.

### Gap 7: Absence of Autonomous Agentic AI Orchestration for Financial Synthesis
* **Existing Limitation:** Recent research shows that while Large Language Models (LLMs) struggle with precise numerical calculations and regression, they excel at multistep domain reasoning, document extraction, and contextual report synthesis (Xie et al., 2024a, 2024b). Conversely, ML models excel at numerical regression but lack natural language reasoning.
* **Underexplored Domain:** The orchestration of specialized autonomous agents (using frameworks like LangGraph) to retrieve real-time pre-IPO data, execute ML predictions, compute SHAP attributions, optimize investor categories, and synthesize comprehensive audit-ready research reports **has not been systematically studied in the context of Indian IPOs**.

### Gap 8: Inelastic vs. Dynamic Forecasting Post-Opening
* **Existing Limitation:** Most existing models are static—once generated, predictions cannot adapt to real-time subscription flow observations during the 3-day bidding window.
* **Underexplored Domain:** Constructing a dual-mode framework that delivers an initial pre-IPO forecast and seamlessly transitions to dynamic Bayesian/Kalman-style updating upon observing Day-1 and Day-2 bids **is largely absent from current academic literature**.

---

## 3. Systematic Summary Matrix of Research Gaps

| Dimension | Typical Approach in Literature | Limitation | Current Study Focus |
|---|---|---|---|
| **Prediction Target** | Listing-day underpricing or binary classification | Subscription demand is rarely predicted as continuous multi-target regression | Continuous forecasting of QIB, NII, Retail, and Total subscription multiples |
| **Investor Segmentation** | Aggregated total demand or single category | Ignores divergent behavioral drivers between institutional and retail participants | Dedicated category-specific regression models (QIB ML, NII ML, Retail ML) |
| **Temporal Data Boundary** | Often includes Day-2 or intraday subscription data | Creates data leakage for true pre-IPO strategic decision-making | Strict temporal cutoff at 10:00 AM IST on IPO opening date |
| **Feature Synthesis** | Isolated subsets (only fundamentals or only sentiment) | Suboptimal capture of cross-domain non-linear interactions | Fuses fundamentals, peer valuation, market indices, sentiment, and historical comparables |
| **Explainability** | OLS regression p-values or black-box predictions | Lacks local per-prediction attribution for multi-target models | Global and local TreeSHAP attribution across all category models |
| **Decision Support** | Raw return prediction without eligibility logic | Fails to account for Indian lottery/allotment regulatory mechanisms | Algorithmic category recommendation and allotment probability scoring |
| **Workflow Automation** | Manual static data aggregation | Disjointed execution between NLP, ML, and reporting | LangGraph-based multi-agent autonomous research and orchestration pipeline |
| **Post-Open Updating** | Static single-shot prediction | Cannot refine forecasts as empirical subscription data arrives | Dynamic Bayesian/sequential updating across Day 1, Day 2, and Day 3 |
