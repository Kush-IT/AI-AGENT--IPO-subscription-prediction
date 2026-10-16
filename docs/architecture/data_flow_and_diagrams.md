# Separation of System Diagrams & Operational Data Flow

## 1. Architectural Distinction

In the IPO Subscription AI platform, technical documentation is bifurcated into two distinct operational and theoretical domains:

```
                                  DOCUMENTATION HUB
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
         SOFTWARE ENGINEERING                           OPERATIONAL DATA FLOW
           ROUTE: /diagrams                                ROUTE: /data-flow
                  │                                               │
   • Formal UML Specifications                     • Directional Data Pipeline
     (Use Case, Sequence, Class,                     (NSE/BSE/SEBI ──> Ingestion ──>
      Activity, Component, State)                     Temporal Gate ──> 45 Features ──>
   • C4 Context & System Architecture                 Preprocess ──> Models ──> LangGraph ──>
   • Relational ER & Physical Data Models             TreeSHAP ──> Dashboard ──> 60m NSE ──>
   • Infrastructure & Deployment (VPC, Docker)        Audit ──> Retraining Quarantine)
   • CI/CD & Automated Gates                       • Interactive Node Inspector
   • Defense-in-Depth Security Layers              • 10-Step Interactive Walkthrough
   • Model Selection & Retraining Gating           • 09:59:59 IST Ex-Ante Barrier
```

---

## 2. Feature Specification: `/diagrams`

- **Page Title:** `System Diagrams & Architecture Documentation`
- **Subtitle:** `Formal software engineering, architecture, UML, database, security, deployment, monitoring, and AI system documentation.`
- **Audience:** Software engineers, system architects, external reviewers, viva defense panels.
- **Categorization Structure (10 Categories):**
  1. `Architecture`: High-Level System Architecture, System Context & C4 Boundary.
  2. `UML`: UML Use Case, Sequence, Class, Activity Flow, Component & Ports, State Machine.
  3. `Database`: Database ER Schema, Logical & Physical Data Model.
  4. `Security`: Defense-in-Depth Security & Governance.
  5. `Deployment`: Deployment & Container Infrastructure, Cloud Infrastructure & Network Topology.
  6. `CI/CD`: CI/CD Pipeline & Quality Assurance Gate.
  7. `Monitoring`: Monitoring, Observability & Drift Detection.
  8. `ML Architecture`: AI/ML Training Pipeline, Multi-Objective Model Selection Matrix.
  9. `Agentic AI`: 11-Agent Autonomous AI Orchestration Graph.
  10. `Governance`: Ex-Ante Temporal Data Governance & Cutoff.

---

## 3. Feature Specification: `/data-flow`

- **Page Title:** `IPO Subscription AI — End-to-End Data Flow`
- **Subtitle:** `Trace how real-world IPO data transforms from external regulatory feeds into an ex-ante AI prediction, LangGraph agentic reasoning, TreeSHAP explanation, live NSE monitoring, and governance retraining.`
- **Audience:** Quantitative researchers, data engineers, prospective auditors.
- **10 End-to-End Pipeline Stages:**
  - **Stage 1 (External Feeds):** NSE, BSE, SEBI DRHP, Company Prospectus, Indicative GMP, FinBERT Sentiment.
  - **Stage 2 (Ingestion Tier):** Ingestion Connectors, Discovery Gateway, Local Cache.
  - **Stage 3 (Temporal Governance):** The 09:59:59 IST Ex-Ante Cutoff Barrier.
  - **Stage 4 (Feature Vectorization):** Group G 45-feature schema. Missing values imputed via `dev_preprocessor` historical medians (never `0.0`).
  - **Stage 5 (Model Inference):** Parallel execution of Total XGBoost (`log1p`), QIB Random Forest (`raw`), NII LightGBM (`log1p`), and Retail XGBoost (`raw`).
  - **Stage 6 (Agentic AI):** LangGraph StateGraph coordination (`validate_input` &rarr; `collect_ipo_data` &rarr; `prepare_features` &rarr; `predict` &rarr; `explain` &rarr; `analyze_categories` &rarr; `assess_risk` &rarr; `generate_report`).
  - **Stage 7 (Explainability & Risk):** TreeSHAP waterfall decomposition and subscription shortfall risk quantification.
  - **Stage 8 (Presentation):** React Dashboard presentation and What-If scenario simulations.
  - **Stage 9 (Live Monitoring):** 60-minute scheduled NSE poller. Isolated strictly to observation to prevent data leakage.
  - **Stage 10 (Governance Loop):** Official outcome ingestion, PSI drift tracking (> 0.25 trigger), quarantined candidate retraining, and human approval gate.

---

## 4. Legacy URL Redirection

Any incoming navigation with legacy query parameter `?category=Data%20Flow` or `?category=Data Flow` (e.g. `http://localhost:5173/diagrams?category=Data%20Flow`) is intercepted by `Diagrams.tsx` and immediately redirected via React Router:
```tsx
if (categoryFromUrl === 'Data Flow' || categoryFromUrl === 'Data%20Flow') {
  return <Navigate to="/data-flow" replace />;
}
```
