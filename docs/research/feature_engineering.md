# Feature Engineering Framework & Ablation Experiment Design

## 1. Overview & Objectives
The feature engineering pipeline transforms raw issuer filings, pre-IPO market data, and sentiment signals into structured predictive matrices while strictly preserving temporal causality. 

All features satisfy the foundational ex-ante invariant:
\[
\text{timestamp}(f_{i,j}) \le \text{feature\_cutoff\_datetime}(i) = \text{ipo\_open\_date}(i) \text{ at 09:59:59 IST}
\]
No information regarding intraday bidding, post-open market movements, or eventual allotment is accessible to any feature generator.

---

## 2. Feature Taxonomy & Mathematical Formulations

### Group 1: IPO Offer Structure
1. **Log Issue Size**:
   \[
   \text{issue\_size\_log} = \ln(1 + \text{issue\_size\_in\_crore})
   \]
2. **Fresh Issue Percentage**:
   \[
   \text{fresh\_issue\_pct} = \frac{\text{fresh\_issue\_in\_crore}}{\text{issue\_size\_in\_crore}} \times 100
   \]
   *Economic Rationale*: Signals capital retention for business expansion versus promoter/PE liquidation.
3. **Offer for Sale (OFS) Percentage**:
   \[
   \text{ofs\_pct} = \frac{\text{ofs\_in\_crore}}{\text{issue\_size\_in\_crore}} \times 100 = 100 - \text{fresh\_issue\_pct}
   \]
4. **Price Band Spread**:
   \[
   \text{price\_band\_spread\_pct} = \frac{\text{price\_high} - \text{price\_low}}{\text{price\_low}} \times 100
   \]
5. **Minimum Retail Ticket Size**:
   \[
   \text{min\_retail\_app\_amount} = \text{lot\_size} \times \text{price\_high}
   \]
6. **Quota Allocations**: \(\text{qib\_quota\_pct}\), \(\text{nii\_quota\_pct}\), \(\text{retail\_quota\_pct}\).

---

### Group 2: Financial Fundamentals
1. **Growth Rates**: \(\text{revenue\_cagr\_3yr}\), \(\text{pat\_cagr\_3yr}\).
2. **Operating Efficiency & Profitability**: \(\text{ebitda\_margin\_pct}\), \(\text{roe\_pct}\), \(\text{roce\_pct}\), \(\text{eps\_pre\_ipo}\).
3. **Solvency & Cash Flow Quality**:
   \[
   \text{debt\_equity\_ratio} = \frac{\text{Total Borrowings}}{\text{Net Worth}}
   \]
   \[
   \text{operating\_cash\_flow\_cr} = \text{Pre-IPO Operating Cash Flow (INR Crore)}
   \]

---

### Group 3: Relative Valuation Metrics
1. **P/E and P/B Multiples**: \(\text{pe\_ratio}\), \(\text{pb\_ratio}\), \(\text{industry\_pe}\).
2. **Valuation Discount / Premium vs Industry**:
   \[
   \text{valuation\_discount\_pct} = \operatorname{clip}\left(\frac{\text{industry\_pe} - \text{pe\_ratio}}{\text{industry\_pe}} \times 100, -200, +200\right)
   \]
   *Positive values indicate discount to listed peers; negative values indicate premium pricing.*

---

### Group 4: Secondary Market Climate
1. **Benchmark Momentum**:
   - \(\text{nifty\_1d\_return}\), \(\text{nifty\_5d\_return}\), \(\text{nifty\_20d\_return}\)
   - \(\text{sensex\_1d\_return}\), \(\text{sensex\_5d\_return}\), \(\text{sensex\_20d\_return}\)
2. **Market Volatility Index**: \(\text{india\_vix}\), \(\text{india\_vix\_5d\_change}\).
3. **Macro Trend Regime**: \(\text{market\_trend} \in \{\text{BULLISH}, \text{NEUTRAL}, \text{BEARISH}, \text{VOLATILE}\}\).

---

### Group 5: Historical Expanding Demand
To avoid lookahead bias while capturing broader market momentum, expanding averages are computed strictly over past offerings:
\[
\text{previous\_general\_avg\_subscription}(i) = \frac{1}{|P_i|} \sum_{k \in P_i} \text{total\_subscription}(k)
\]
\[
\text{previous\_sector\_avg\_subscription}(i) = \frac{1}{|P_i \cap \text{sector}(i)|} \sum_{k \in P_i \cap \text{sector}(i)} \text{total\_subscription}(k)
\]
where \(P_i = \{k \mid \text{ipo\_open\_date}(k) < \text{ipo\_open\_date}(i)\}\).

---

### Group 6: Sentiment & Unofficial Grey Market Signals
1. **Grey Market Premium (GMP) Percentage**:
   \[
   \text{gmp\_percentage} = \frac{\text{gmp\_in\_inr}}{\text{price\_high}} \times 100
   \]
2. **Media Polarity & Coverage**:
   - \(\text{news\_count}\): Total pre-IPO headline count.
   - \(\text{average\_sentiment_score}\): Continuous score in \([-1.0, +1.0]\).
   - \(\text{positive\_news\_ratio}\), \(\text{negative\_news\_ratio}\).

---

## 3. Ablation Experiment Design (Models A–G)

To isolate feature group efficacy and evaluate incremental predictive power across all 4 category targets, we design a 7-stage ablation hierarchy:

| Model ID | Feature Subsets Included | Dimension (\(p\)) | Research Hypothesis Tested |
|---|---|:---:|---|
| **Model A** | **IPO Structure Only** | 13 | Tests whether issue terms (size, price band, quotas) alone predict demand. |
| **Model B** | **IPO Structure + Fundamentals** | 23 | Tests the marginal value of financial accounting health (growth, ROE, debt). |
| **Model C** | **Structure + Fundamentals + Valuation** | 27 | Evaluates the impact of relative pricing discounts vs listed peers. |
| **Model D** | **Structure + Fundamentals + Valuation + Market** | 36 | Assesses whether secondary market index returns and VIX improve accuracy. |
| **Model E** | **Structure + ... + Historical Demand** | 38 | Evaluates expanding historical momentum and sector spillover effects. |
| **Model F** | **Structure + ... + Sentiment & GMP** | 44 | Assesses the predictive uplift of grey market pricing and news sentiment. |
| **Model G** | **All Features + Sector Categorical** | 45 | Comprehensive benchmark integrating macroeconomic and sector effects. |

---

## 4. Collinearity & Redundancy Governance
As documented in [`feature_redundancy_report.csv`](file:///d:/project-2/data/metadata/feature_redundancy_report.csv):
- Highly collinear pairs (e.g. `nifty_5d_return` vs `sensex_5d_return`, \(r > 0.98\); `fresh_issue_percentage` vs `ofs_percentage`, \(r = -1.0\)) will be evaluated using L1 Lasso sparsity penalties, Ridge shrinkage, and PCA feature extraction during ML model training.
- Categorical mappings (`sector`, `market_trend`) are kept raw in [`ipo_features_preipo_v2.csv`](file:///d:/project-2/data/processed/ipo_features_preipo_v2.csv) to ensure target encoding or one-hot transformations fit solely on training folds.
