# Grey Market Premium (GMP): Characteristics, Modeling Limitations & Research Protocol

## 1. Context & Definition of Grey Market Premium (GMP)
In the Indian capital markets ecosystem, the Grey Market is an unofficial, over-the-counter (OTC) secondary market where IPO applications and shares are unofficially traded prior to statutory exchange allotment and listing. The **Grey Market Premium (GMP)** denotes the unofficial cash premium over the upper issue price band that dealers and high-net-worth investors are willing to bid.

---

## 2. Quantitative Status in the IPO Agentic AI Platform
An extensive code and model audit across `models/final_candidates/`, `backend/`, and `scripts/` confirms:
1. **The 4 Frozen Production ML Models Predict Subscription Multiples, NOT GMP:**
   - Total Subscription $\to$ `XGBoost + log1p`
   - QIB Institutional $\to$ `Random Forest + raw`
   - NII Corporate / HNI $\to$ `LightGBM + log1p`
   - Retail Individual $\to$ `XGBoost + raw`
2. **`gmp_percentage` is an Input Predictive Feature:**
   - In the canonical 45-feature schema (`Group_G_All_Features_Plus_Sector`), ex-ante GMP observed prior to `09:59:59 IST` on the open date serves as an independent explanatory feature capturing retail and informal market sentiment.
3. **No Validated Machine Learning Model Exists to Predict Future GMP:**
   - In accordance with rigorous scientific standards and project instructions, **zero GMP forecasts are fabricated**.
   - When displayed, current GMP is labelled as:
     `"Unofficial / indicative grey-market data — subject to illiquidity and high volatility."`
   - For predicted GMP, the system explicitly returns:
     `"GMP forecast unavailable — current GMP is an external unofficial market indicator."`

---

## 3. Implied Listing Price Formulation
For active upcoming IPOs where an indicative grey market quote is available:
$$\text{Implied Listing Price} = P_{\text{high}} + \text{GMP}_{\text{inr}}$$
$$\text{Implied Gain (\%)} = \left(\frac{\text{GMP}_{\text{inr}}}{P_{\text{high}}}\right) \times 100$$
where $P_{\text{high}}$ is the statutory upper price band.

*This metric is explicitly designated as an **indicative estimate** and must never be interpreted as an official guaranteed listing price.*

---

## 4. Key Limitations of Grey Market Data
1. **Lack of Regulatory Oversight:** Transactions are informal and not supervised by SEBI, NSE, or BSE.
2. **Severe Illiquidity & High Bid-Ask Spreads:** Quotes are frequently based on small transaction volumes.
3. **Susceptibility to Manipulation:** Unofficial circular trading and rumor-driven quotes can inflate or depress GMP rates.
4. **Sudden Volatility Reversals:** Changing macroeconomic sentiment or unexpected IPO over-allocation can cause GMP to collapse between close date and listing date.

---

## 5. Future Research: Machine Learning GMP Forecasting
Developing an AI-driven GMP forecasting model is an independent research direction requiring:
- Systematic historical collection of multi-day GMP curves ($T-5\text{d}$ to listing).
- Modeling OTC dealer order books and sentiment dynamics.
- Cross-validation against exchange listing returns under temporal walk-forward evaluation.
Until such models are rigorously validated, the platform maintains strict scientific honesty by reporting external observed GMP while declaring GMP forecasting unavailable.
