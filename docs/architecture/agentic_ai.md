# Agentic AI Orchestration Architecture

## 1. System Overview & Architectural Separation
The **Agentic AI Orchestration Layer** acts as the deterministic coordinator and intelligence synthesizer for the pre-IPO subscription forecasting system.

It adheres to strict architectural separation of concerns:

```mermaid
graph TD
    subgraph DataLayer [1. Data & Provenance Layer]
        D1["Prospectus RHP / DRHP"]
        D2["NSE/BSE Indices"]
        D3["FinBERT Media News"]
        D4["Grey Market Rates"]
    end
    subgraph FeatureLayer [2. Feature Engineering Layer]
        F1["Ex-Ante Feature Extraction"]
        F2["Expanding Past-Only Lookups"]
        F3["Temporal Cutoff Validation (09:59:59 IST)"]
    end
    subgraph MLLayer [3. Frozen ML & Explainability Layer]
        M1["Total: XGBoost (log1p)"]
        M2["QIB: Random Forest (RAW)"]
        M3["NII: LightGBM (log1p)"]
        M4["Retail: XGBoost (RAW)"]
        S1["TreeSHAP Additive Engine"]
    end
    subgraph AgentLayer [4. Agentic Orchestration Layer (LangGraph)]
        A1["Input Validation Agent"] --> A2["IPO Data Agent"]
        A2 --> A3["Feature Preparation Agent"]
        A3 --> A4["Prediction Agent"]
        A4 --> A5["SHAP Explanation Agent"]
        A5 --> A6["Category Analysis Agent"]
        A6 --> A7["Risk Analysis Agent"]
        A7 --> A8["Report Generation Agent"]
    end
    subgraph APILayer [5. API Presentation Layer]
        API["POST /api/v1/ipo/analyze"]
    end

    DataLayer --> FeatureLayer
    FeatureLayer --> MLLayer
    MLLayer --> AgentLayer
    AgentLayer --> APILayer
```

---

## 2. Agent Node Responsibilities

| Agent Node | Core Responsibility | Input State | Output State | Failure / Fallback Behavior |
|---|---|---|---|---|
| **Input Validation Agent** | Validates schema types, price bounds, positive issue size, and YYYY-MM-DD date formatting. | `ipo_input` | `errors`, `warnings`, `status` | Sets `VALIDATION_FAILED` and routes directly to report generation. |
| **IPO Data Agent** | Normalizes structural terms, verifies quota sums (\(100\%\)), and attaches data provenance metadata. | `ipo_input` | `validated_data`, `sources` | Normalizes quota discrepancies with explicit warning flags. |
| **Feature Preparation Agent** | Assembles the 45-feature pre-IPO matrix enforcing strict ex-ante timestamp cutoffs (`<= 09:59:59 IST`). | `validated_data` | `features`, `feature_metadata` | Imputes absent non-critical features with domain neutrals (0.0). |
| **Prediction Agent** | Invokes frozen ML models and maps log-scale predictions back to natural subscription multiples via \(\operatorname{expm1}\). | `features` | `predictions` | Returns structured prediction error if inference encounters exceptions. |
| **SHAP Explanation Agent** | Computes additive feature attributions and synthesizes top positive/negative drivers using observational wording. | `features` | `shap_explanations` | Fallbacks to neutral driver summary if TreeSHAP fails. |
| **Category Analysis Agent** | Ranks investor classes, determines strongest/weakest segments, recommends `BEST_CATEGORY`, and computes confidence. | `predictions` | `category_assessment`, `confidence` | Disclaims non-advisory nature; outputs `NO_CLEAR_EDGE` on narrow parity. |
| **Risk Analysis Agent** | Audits valuation multiples, offering scale friction, balance sheet leverage, negative cash flows, and macro volatility. | `features`, `predictions` | `risk_assessment` | Scores composite risk points (\([0, 100]\)) and assigns `HIGH`/`MEDIUM`/`LOW`. |
| **Report Generation Agent** | Synthesizes all predictions, attributions, assessments, and provenance records into a standardized research JSON report. | Complete `IPOState` | `final_report` | Assembles final response payload with regulatory disclaimer. |

---

## 3. Tool Directory & Execution Boundaries

All external tool calls are isolated in `backend/tools/`:
- [`ipo_tool.py`](file:///d:/project-2/backend/tools/ipo_tool.py): Quota reservation and issue terms validation.
- [`market_tool.py`](file:///d:/project-2/backend/tools/market_tool.py): Secondary market returns, volatility, and market trend classification.
- [`financial_tool.py`](file:///d:/project-2/backend/tools/financial_tool.py): Financial ratios, margins, and valuation discounts.
- [`sentiment_tool.py`](file:///d:/project-2/backend/tools/sentiment_tool.py): Pre-IPO media news polarity and sentiment ratios.
- [`gmp_tool.py`](file:///d:/project-2/backend/tools/gmp_tool.py): Grey market premium calculations.
- [`historical_ipo_tool.py`](file:///d:/project-2/backend/tools/historical_ipo_tool.py): Expanding historical past-only sector subscription lookups.
- [`prediction_tool.py`](file:///d:/project-2/backend/tools/prediction_tool.py): Model inference on frozen candidates.
- [`shap_tool.py`](file:///d:/project-2/backend/tools/shap_tool.py): Local SHAP attribution calculator.

---

## 4. Strict Leakage Controls & Ex-Ante Boundaries

1. **Timestamp Cutoff**: Every feature must represent data observed prior to `09:59:59 IST` on `ipo_open_date`.
2. **Expanding Historical Lookups**: The `historical_ipo_tool` filters dataset records strictly via `ipo_open_date < target_open_date`, guaranteeing zero future lookahead.
3. **Frozen Weights Guarantee**: No agent or tool has write access to model weights or preprocessor artifacts.

---

## 5. Confidence & Recommendation Logic

### Confidence Scoring Engine:
- **Starting Score**: `100` points.
- **Distribution Penalty**: \(-25\) points if predicted Total Subscription \(> 120\times\) or NII \(> 200\times\) (sparse historical tail).
- **Missing Data Penalty**: \(-10\) to \(-30\) points if features were absent and defaulted.
- **Tier Classification**:
  - `HIGH` (\(\ge 80\))
  - `MEDIUM` (\(55 - 79\))
  - `LOW` (\(< 55\))

### Category Recommendation (`BEST_CATEGORY`):
- If the leading category multiple exceeds the second-highest by \(\ge 15\%\), it is classified as `QIB`, `NII`, or `RETAIL`.
- Otherwise, classified as `NO_CLEAR_EDGE`.
- **Disclaimer**: *"Model-based category assessment only. Not investment or financial advice."*
