# IPO Agentic AI — Pre-IPO Subscription Forecasting Platform

An academic/research-oriented AI platform for **pre-IPO subscription forecasting, investor-category analysis, explainability, prospective validation, monitoring, and governance-controlled model retraining** for Indian Mainboard IPOs.

> **Academic Disclaimer:** This project is developed for academic and research purposes. Model outputs are quantitative predictions and do not constitute investment advice.

---

## 1. Project Overview

The IPO Agentic AI platform predicts IPO subscription demand before the IPO opens using audited pre-IPO information.

The system analyzes four subscription targets:

- Total Aggregate Subscription
- QIB — Qualified Institutional Buyers
- NII — Non-Institutional Investors
- Retail / RII — Retail Individual Investors

The platform combines:

- 45 pre-IPO predictive features
- Machine-learning regression models
- TreeSHAP explainability
- Data-quality validation
- Temporal leakage protection
- Cryptographic model-integrity verification
- Prospective real-world validation
- Market/data drift monitoring
- Weekly rolling retraining experiments

---

## 2. Main Objectives

1. Predict IPO subscription multiples before the IPO opens.
2. Forecast subscription separately for Total, QIB, NII, and Retail categories.
3. Prevent post-IPO information leakage.
4. Provide interpretable TreeSHAP feature explanations.
5. Validate predictions prospectively against real exchange outcomes.
6. Monitor model and feature drift.
7. Experiment with controlled weekly model retraining.
8. Preserve production-model immutability.
9. Maintain reproducible research and audit artifacts.

---

## 3. System Architecture

```text
                    IPO Pre-IPO Data
                           |
                           v
                 45-Feature Data Pipeline
                           |
                           v
                Data Quality + Validation
                           |
                           v
                 Temporal Leakage Guard
                           |
                           v
                 Frozen Production Models
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          Total          QIB            NII
             |             |             |
             +-------------+-------------+
                           |
                           v
                       Retail
                           |
                           v
                    Predictions
                           |
              +------------+------------+
              |                         |
              v                         v
          TreeSHAP                 Risk Analysis
              |                         |
              +------------+------------+
                           |
                           v
                    Decision Support
                           |
                           v
                Prospective Validation
                           |
                           v
                  Real IPO Outcomes
                           |
                           v
                 Performance Evaluation
                           |
                           v
              Weekly Rolling Retraining
```

---

## 4. Documentation & Web Application Routes

The platform provides two distinct, dedicated architectural and operational documentation features:

| Route | Feature Title | Focus & Purpose |
| :--- | :--- | :--- |
| **`/diagrams`** | **System Diagrams & Architecture Documentation** | **Formal Software Engineering & Architecture Documentation:** Contains 18+ high-DPI vector SVG diagrams organized across 10 SE categories (Architecture, UML, Database, Security, Deployment, CI/CD, Monitoring, ML Architecture, Agentic AI, Governance). Includes UML Use Case, Sequence, Class, Activity, Component, State Machine, ER, and C4 Context models. |
| **`/data-flow`** | **IPO Subscription AI — End-to-End Data Flow** | **Operational Data Pipeline Flowchart:** Traces an offering from 6 external regulatory sources (NSE, BSE, SEBI DRHP, Company Documents, GMP, News) through the strict **09:59:59 IST Ex-Ante Cutoff**, 45-feature vectorization, `dev_preprocessor` median imputation, 4-model parallel inference, LangGraph 8-agent orchestration, TreeSHAP explainability, 60m live NSE monitoring, and candidate retraining governance. |

> **Note on URL Redirection:** Any legacy access to `/diagrams?category=Data%20Flow` is automatically redirected to `/data-flow` via React Router.

---

## 5. Local Execution Commands

### Backend Service (FastAPI)
```bash
cd /d D:\project-2
.venv\Scripts\activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive Swagger UI: `http://localhost:8000/docs`

### Frontend Application (React + Vite)
```bash
cd /d D:\project-2\frontend
npm run dev
```
- Software Engineering Diagrams: `http://localhost:5173/diagrams`
- End-to-End Operational Data Flow: `http://localhost:5173/data-flow`
- Main Dashboard: `http://localhost:5173/`