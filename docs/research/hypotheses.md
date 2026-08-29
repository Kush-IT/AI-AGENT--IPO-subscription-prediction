# Research Hypotheses

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## 1. Philosophical & Methodological Framework

The following hypotheses represent formal, testable empirical propositions designed to be evaluated through quantitative machine learning experiments, statistical significance testing, and temporal backtesting on historical Indian IPO data.

> **CRITICAL ACADEMIC NOTE:** These statements are formulated as **hypotheses to be tested**, rather than established facts or guaranteed truths. Each hypothesis is accompanied by its underlying theoretical rationale, null and alternative formulations, testable variables, and validation methodology.

---

## 2. Formal Hypotheses

### Hypothesis 1 (H1): Influence of Company Fundamentals
* **Hypothesis Statement (H1):** *Company financial fundamentals (including revenue growth, profit after tax, EBITDA margin, Return on Equity [ROE], and debt-to-equity ratio) significantly influence pre-IPO subscription demand.*
* **Theoretical Foundation:** Corporate finance theory (signaling theory and fundamental valuation) posits that higher profitability and lower financial leverage mitigate insolvency risks, thereby attracting greater aggregate capital.
* **Null Hypothesis (\(H_{1,0}\)):** Company fundamental variables have no statistically significant relationship with pre-IPO subscription demand (regression coefficients / SHAP attributions \(\approx 0\)).
* **Alternative Hypothesis (\(H_{1,a}\)):** Higher historical growth and profitability metrics are positively and significantly associated with higher subscription multiples across investor categories.
* **Evaluation Method:** Feature ablation experiments removing fundamental variables; permutation feature importance and global TreeSHAP magnitude analysis.

---

### Hypothesis 2 (H2): Influence of IPO Valuation Multiples
* **Hypothesis Statement (H2):** *IPO offer valuation (measured by Price-to-Earnings [P/E] ratio, Price-to-Book [P/B] ratio, and valuation discount/premium relative to listed industry peers) significantly influences subscription demand.*
* **Theoretical Foundation:** Undervaluation relative to industry peers provides an explicit "money left on the table" incentive that attracts rational bidders seeking immediate upside upon listing.
* **Null Hypothesis (\(H_{2,0}\)):** Valuation multiples and peer discounts exhibit no significant relationship with investor subscription intensity.
* **Alternative Hypothesis (\(H_{2,a}\)):** Offerings priced at a discount to industry peers exhibit significantly higher subscription demand than those priced at excessive premiums.
* **Evaluation Method:** Non-linear partial dependence plots (PDP), SHAP interaction values between offer P/E and Industry P/E, and regression error comparison.

---

### Hypothesis 3 (H3): Influence of Macroeconomic & Market Conditions
* **Hypothesis Statement (H3):** *Prevailing stock market conditions (measured by benchmark NIFTY 50 returns, market liquidity, and the India Volatility Index [India VIX] in the 30-day pre-IPO window) significantly influence subscription demand.*
* **Theoretical Foundation:** Investor sentiment and capital liquidity are pro-cyclical. High market volatility (VIX spikes) increases risk aversion, whereas strong secondary market momentum stimulates primary market risk appetite.
* **Null Hypothesis (\(H_{3,0}\)):** Pre-IPO market conditions and volatility indices do not significantly affect subscription demand.
* **Alternative Hypothesis (\(H_{3,a}\)):** Favorable market momentum and subdued market volatility significantly increase subscription multiples, particularly for retail and high-net-worth investors.
* **Evaluation Method:** Cross-sectional correlation analysis and regression performance comparison under high-VIX vs. low-VIX regime partitions.

---

### Hypothesis 4 (H4): Incremental Value of Sentiment and Media Buzz
* **Hypothesis Statement (H4):** *Incorporating sentiment metrics (including news sentiment polarity, IPO media coverage volume, and Grey Market Premium [GMP] data) significantly improves the prediction performance of pre-IPO forecasting models over models using fundamental and market data alone.*
* **Theoretical Foundation:** Behavioral finance suggests that media attention and informal grey market indicators capture retail herd behavior and investor hype that are not reflected in historical financial statements.
* **Null Hypothesis (\(H_{4,0}\)):** The addition of sentiment and buzz features yields no statistically significant improvement in forecasting accuracy (\(\Delta\text{MAE} \ge 0, \Delta R^2 \le 0\)).
* **Alternative Hypothesis (\(H_{4,a}\)):** Integrating sentiment signals results in a statistically significant reduction in MAE/RMSE and increases explanatory power (\(R^2\)).
* **Evaluation Method:** Paired t-tests / Wilcoxon signed-rank tests comparing out-of-fold cross-validation errors of models trained with vs. without sentiment features.

---

### Hypothesis 5 (H5): Superiority of Category-Specific Decomposed Models
* **Hypothesis Statement (H5):** *Training separate category-specific machine learning models for Qualified Institutional Buyers (QIB), Non-Institutional Investors (NII), and Retail Individual Investors (Retail) provides greater predictive utility and diagnostic detail than relying on a single aggregate total-subscription model.*
* **Theoretical Foundation:** Institutional and retail investor segments exhibit distinct demand elasticities, decision horizons, and reaction functions. Separate modeling prevents cross-category aggregation bias and captures segment-specific feature sensitivities.
* **Null Hypothesis (\(H_{5,0}\)):** Category-specific models do not improve total subscription forecasting accuracy or provide distinct feature attribution patterns compared to a unified aggregate model.
* **Alternative Hypothesis (\(H_{5,a}\)):** Decomposed category models yield lower aggregate weighted prediction error and reveal distinct, statistically divergent feature importance profiles across investor classes.
* **Evaluation Method:** Comparison of aggregate weighted category sum predictions against direct total subscription model predictions; divergence analysis of category SHAP profiles.

---

### Hypothesis 6 (H6): Multimodal Information Fusion (Structured + Textual)
* **Hypothesis Statement (H6):** *Combining structured numerical/tabular data with unstructured textual signals (from news synopses and prospectus disclosures) improves IPO subscription forecasting performance compared to purely tabular models.*
* **Theoretical Foundation:** Textual documents contain qualitative risk factors, promoter governance disclosures, and strategic forward-looking narratives that complement backward-looking quantitative accounting ratios.
* **Null Hypothesis (\(H_{6,0}\)):** Multimodal feature fusion yields identical or inferior forecasting performance compared to a purely tabular structured feature pipeline.
* **Alternative Hypothesis (\(H_{6,a}\)):** Multimodal feature fusion demonstrates superior predictive accuracy and lower generalization error across unseen test partitions.
* **Evaluation Method:** Ablation benchmarking across four feature configurations: (1) Tabular-Only, (2) Text-Only, (3) Tabular + Sentiment, (4) Fully Fused Multimodal Matrix.

---

## 3. Summary of Hypotheses & Testing Protocol

| Hypothesis | Core Focus | Anticipated Effect | Statistical / Empirical Validation Method |
|---|---|---|---|
| **H1** | Fundamentals (Revenue, PAT, ROE, Debt) | High growth & low debt \(\to\) higher subscription | TreeSHAP global importance ranking; Feature ablation test |
| **H2** | Valuation (P/E, P/B vs. Industry Peers) | Peer valuation discount \(\to\) higher subscription | Partial dependence plots; SHAP interaction values |
| **H3** | Market Conditions (NIFTY 50, India VIX) | Bullish momentum & low VIX \(\to\) higher subscription | Regime-based stratified error analysis |
| **H4** | Sentiment & News (Polarity, Coverage, GMP) | Positive sentiment \(\to\) improved prediction accuracy | Paired Wilcoxon test on CV fold errors (\(\Delta\text{MAE}\)) |
| **H5** | Category Decomposition (QIB, NII, Retail) | Decomposed models capture heterogeneous elasticities | Weighted category sum error vs. single omnibus model |
| **H6** | Multimodal Fusion (Tabular + Text) | Textual risk/governance data adds predictive signal | Benchmark comparison across ablation configurations |
