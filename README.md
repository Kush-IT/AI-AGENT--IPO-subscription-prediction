# Pre-IPO Subscription AI — Decision Support System for Indian Mainboard IPOs

[![CI Pipeline](https://github.com/your-org/IPO-Agentic-AI/actions/workflows/ci.yml/badge.svg)](.github/workflows/ci.yml)
[![Backend Tests](https://img.shields.io/badge/pytest-83%20passed-brightgreen)](tests/)
[![Frontend Tests](https://img.shields.io/badge/vitest-15%20passed-brightgreen)](frontend/tests/)
[![Python](https://img.shields.io/badge/python-3.11%20%7C%203.14-blue)](backend/)
[![React](https://img.shields.io/badge/react-18-blue)](frontend/)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue)](frontend/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.110-teal)](backend/)
[![Docker](https://img.shields.io/badge/docker-compose-blue)](docker-compose.yml)

A research-grade **Pre-IPO Subscription Demand Forecasting & Explainability Decision Support System** combining Machine Learning, TreeSHAP Additive Attributions, LangGraph Agentic AI Orchestration, and a modern React + TypeScript Dashboard for Indian Mainboard IPOs.

---

## 1. System Architecture

```mermaid
graph TD
    subgraph DataConnectors [1. Pre-IPO Data Ingestion & Connectors]
        SEBI["SEBI DRHP/RHP Prospectus Filings"]
        NSE["NSE/BSE Historical Index Data"]
        CAP["Capitaline Listed Peer Multiples"]
        NLP["FinBERT Media News Sentiment"]
        GMP["Unofficial Ex-Ante Grey Market Rates"]
        HIST["Historical Past-Only Sector Lookups"]
    end
    subgraph TemporalBoundary [2. Strict Temporal Anti-Leakage Guard]
        VAL["Temporal Validator (observed_at <= 09:59:59 IST on Open Date)"]
        CACHE["SHA-256 Local Disk Cache (data/cache/)"]
    end
    subgraph MLLayer [3. Frozen ML & Explainability Core]
        M1["Total Model: XGBoost (log1p transform)"]
        M2["QIB Model: Random Forest (RAW scale)"]
        M3["NII Model: LightGBM (log1p transform)"]
        M4["Retail Model: XGBoost (RAW scale)"]
        SHAP["TreeSHAP Additive Attribution Engine"]
    end
    subgraph AgenticCore [4. LangGraph Agentic AI Orchestration]
        AG1["Input Validation Agent"] --> AG2["IPO Data Agent"]
        AG2 --> AG3["Feature Preparation Agent"]
        AG3 --> AG4["Prediction Agent"]
        AG4 --> AG5["SHAP Explanation Agent"]
        AG5 --> AG6["Category Analysis Agent"]
        AG6 --> AG7["Risk Analysis Agent"]
        AG7 --> AG8["Report Generation Agent"]
    end
    subgraph APIGateway [5. Production FastAPI Layer (/api/v1)]
        EP1["POST /api/v1/ipo/analyze"]
        EP2["GET /api/v1/health"]
        EP3["GET /api/v1/models"]
        EP4["GET /api/v1/schema"]
    end
    subgraph DashboardUI [6. React + TypeScript Dashboard (Port 3000)]
        UI1["Interactive Parameter Input Form"]
        UI2["Category Multiples Cards (QIB, NII, Retail, Total)"]
        UI3["Category Demand Ranking & Recommendation"]
        UI4["Evidence-Based Confidence Diagnostics"]
        UI5["Recharts SHAP Attribution Chart"]
        UI6["Multi-Dimensional Risk Audit Breakdown"]
        UI7["Statutory Source Provenance Table"]
    end

    DataConnectors --> TemporalBoundary --> MLLayer --> AgenticCore --> APIGateway --> DashboardUI
```

---

## 2. Frozen Machine Learning Models & Evaluation

Evaluated across 106 verified historical Indian Mainboard IPOs (2021–2024) across 45 ex-ante predictive features:

| Target Category | Selected Model Architecture | Target Transform | Development 5-Fold Walk-Forward MAE | Quarantined 2024 Test Performance (17 IPOs) |
|---|---|:---:|:---:|:---:|
| **Total Subscription** | **XGBoost Regressor** | `log1p` | \(16.17\times\) | **\(R^2 = +0.666\) • \(\text{MAE} = 17.43\times\)** |
| **QIB (Institutional)** | **Random Forest** | `raw` | \(28.48\times\) | **\(R^2 = +0.589\) • \(\text{MAE} = 31.43\times\)** |
| **NII (Non-Institutional)** | **LightGBM Regressor** | `log1p` | \(36.39\times\) | Expanding Walk-Forward Isolation |
| **Retail Individual** | **XGBoost Regressor** | `raw` | \(20.24\times\) | Expanding Walk-Forward Isolation |

---

## 3. Strict Ex-Ante Temporal Boundary
The core quantitative integrity constraint enforced across the entire system:
\[
t_{\text{observed}} \le 09:59:59 \text{ IST on } \text{ipo\_open\_date}
\]
- **Zero Future Lookahead**: Financial statements published after the open date, news articles published during bidding days, and listing-day prices are strictly rejected (`TEMPORAL_REJECTED`).
- **Past-Only Historical Baselines**: Expanding sector averages query only IPOs opened strictly prior to the target offering date.
- **Model Weight Immutability**: All model files in `models/final_candidates/` are read-only and verified via SHA-256 cryptographic hashing.

---

## 4. Quickstart with Docker Compose (Recommended)

Launch the full-stack system (FastAPI backend + React frontend via Nginx) with a single command:

```bash
# 1. Clone repository and create environment file
cp .env.example .env

# 2. Build and launch containers
docker compose up -d

# 3. Verify running containers
docker compose ps
```

* **React Research Dashboard**: [http://localhost:3000](http://localhost:3000)
* **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## 5. Local Development Setup

### Backend (Python / FastAPI)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI development server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (React / TypeScript / Vite)
```bash
cd frontend

# Install Node dependencies
npm install

# Run Vite local development server
npm run dev
```

---

## 6. Automated Verification & Testing Matrix

Run the comprehensive test suite (98 total unit, integration, and E2E tests):

### Backend Pytest Suite (83 Tests)
```bash
py -m pytest -v
```

### Frontend Vitest Suite (15 Tests)
```bash
cd frontend
npm run test
```

### Frontend Production Bundle Build
```bash
cd frontend
npm run build
```

---

## 7. Project Structure

```
IPO-Agentic-AI/
├── backend/
│   ├── api/                           # FastAPI v1 router, Pydantic schemas, and observability
│   ├── agents/                        # LangGraph StateGraph nodes (validation, features, prediction, SHAP, risk)
│   ├── connectors/                    # Modular data connectors (IPO, financials, market, GMP, news, history)
│   ├── ml/                            # Frozen candidate models, preprocessors, and TreeSHAP engine
│   └── routers/                       # Legacy compatibility routes
├── frontend/
│   ├── src/
│   │   ├── api/                       # Typed HTTP client and API endpoints
│   │   ├── components/                # React dashboard components (predictions, SHAP, risk, quality, provenance)
│   │   ├── pages/                     # Dashboard and About pages
│   │   ├── hooks/                     # Custom React Query hooks
│   │   └── utils/                     # Formatting and validation helpers
│   ├── tests/                         # Vitest unit & integration tests (15 tests)
│   ├── Dockerfile                     # Multi-stage production frontend Dockerfile
│   └── nginx.conf                     # Production Nginx SPA & reverse proxy configuration
├── data/
│   ├── processed/                     # 106 verified Mainboard IPO dataset and feature matrices
│   ├── metadata/                      # Source registry, data dictionary, and test evaluations
│   └── cache/                         # Local SHA-256 disk cache (ignored in git)
├── models/
│   └── final_candidates/              # Frozen ML models, preprocessors, and metadata
├── docs/
│   ├── architecture/                  # System architecture, connectors, and API specifications
│   ├── deployment/                    # Docker, environment, model artifacts, and security docs
│   └── research/                      # Literature review, hypotheses, and SHAP explainability docs
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions continuous integration workflow
├── Dockerfile.backend                 # Production FastAPI Dockerfile
├── docker-compose.yml                 # Multi-container orchestration
├── .env.example                       # Sanitized environment template
└── VERSION                            # Release version file (1.0.0)
```

---

## 8. Regulatory & Research Disclaimer
This system provides quantitative model-based pre-IPO subscription forecasts and SHAP additive feature attributions for academic, research, and decision-support purposes only. It does not constitute investment, legal, or financial advice and does not guarantee subscription levels, allotment probability, or listing gains.
