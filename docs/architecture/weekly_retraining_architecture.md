# Weekly Rolling Retraining System Architecture (Phase 20)

```
=================================================================================================
                            SYSTEM DATAFLOW & GOVERNANCE ARCHITECTURE
=================================================================================================

                              +-----------------------------+
                              |    Historical IPO Dataset   |
                              +--------------+--------------+
                                             |
                                             v
                              +-----------------------------+
                              | 45 Canonical Input Features |
                              +--------------+--------------+
                                             |
                                             v
                              +-----------------------------+
                              |  Frozen Production Models   |
                              |  (models/final_candidates/) |
                              +--------------+--------------+
                                             |
                      +----------------------+----------------------+
                      |                                             |
                      v                                             v
        +---------------------------+                 +---------------------------+
        |   Prospective Validation  |                 |  Weekly Rolling Retrain   |
        |   (Live IPO Monitoring)   |                 | (backend/retraining/mgr)  |
        +-------------+-------------+                 +-------------+-------------+
                      |                                             |
                      v                                             v
        +---------------------------+                 +---------------------------+
        |  Pre-Open Capture (09:59) |                 |  SHA-256 Pre-Check & Drift|
        +-------------+-------------+                 +-------------+-------------+
                      |                                             |
                      v                                             v
        +---------------------------+                 +---------------------------+
        | Official Exchange Outcome |                 | Trailing 30-Day Window    |
        +-------------+-------------+                 +-------------+-------------+
                      |                                             |
                      v                                             v
        +---------------------------+                 +---------------------------+
        | Cumulative Error Tracking |                 | N >= 10 Minimum Guard     |
        +---------------------------+                 +-------------+-------------+
                                                                    |
                                                                    v
                                                      +---------------------------+
                                                      | Chronological 80/20 Split |
                                                      +-------------+-------------+
                                                                    |
                                                                    v
                                                      +---------------------------+
                                                      | Unified XGBoost Candidate |
                                                      | (models/retrained/<ver>/) |
                                                      +-------------+-------------+
                                                                    |
                                                                    v
                                                      +---------------------------+
                                                      | Dual-Model Val Evaluation |
                                                      +-------------+-------------+
                                                                    |
                                                                    v
                                                      +---------------------------+
                                                      | 10-Point Promotion Gate   |
                                                      +-------------+-------------+
                                                                    |
                                                                    v
                                                      +---------------------------+
                                                      | Research Audit Manifest   |
                                                      | (research/retraining/...) |
                                                      +---------------------------+
```

---

## 1. Core Module Decomposition

| Module | Location | Primary Responsibilities |
|---|---|---|
| **Schemas** | `backend/retraining/schemas.py` | Pydantic contracts: `RetrainingStatus`, `TargetMetricSet`, `ModelComparisonSummary`, `PromotionGateCheck`, `PromotionDecision`, `DataSelectionSummary`, `CandidateModelMetadata`, `RetrainingRunRequest`, `RetrainingRunResponse`. |
| **Data Selector** | `backend/retraining/data_selector.py` | Window boundary enforcement ($[T-30\text{d}, T)$), Mainboard filtering, ex-ante cutoff verification (`09:59:59 IST`), target isolation, 45-feature schema validation, chronological sorting and 80/20 train/val split. |
| **Candidate Trainer** | `backend/retraining/candidate_trainer.py` | Trains 4 target-specific XGBoost regressors on training slice, fits `FoldPreprocessor` strictly on $X_{\text{train}}$, calculates SHA-256 hashes, verifies reload inference, writes candidate manifest. |
| **Evaluator & Promotion Gate** | `backend/retraining/evaluator.py` | Runs dual-model inference on identical validation slice, calculates MAE, RMSE, MedianAE, MAPE (zero-safe), $R^2$, signed bias, category ranking accuracy, strongest category classification, executes 10 promotion gate checks. |
| **Retraining Manager** | `backend/retraining/retraining_manager.py` | Orchestration pipeline, production SHA-256 pre/post checks, PSI feature drift audits, atomic manifest writing in `research/retraining/YYYY-MM-DD/run_<uuid>/`. |
| **CLI** | `scripts/weekly_retrain.py` | Command-line tool with `--dry-run`, `--date`, `--min-samples`, and `--force-promote`. |
| **API Endpoints** | `backend/routers/monitoring_routes.py` | `GET /status`, `GET /history`, `POST /run`. |
| **Frontend UI** | `frontend/src/pages/Monitoring.tsx` | Dashboard panel, live status indicators, dry-run button, dual-model comparison table, and history log. |
