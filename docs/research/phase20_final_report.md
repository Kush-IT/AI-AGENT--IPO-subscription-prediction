# Phase 20 Final Report: Weekly Rolling XGBoost Retraining Pipeline

```
========================================================================================
IPO SUBSCRIPTION AI PLATFORM — PHASE 20 RESEARCH & GOVERNANCE FINAL REPORT
========================================================================================
STATUS: PHASE 20 COMPLETE (WEEKLY_ROLLING_RETRAINING_OPERATIONAL)
CORE MODULES: backend/retraining/ (schemas, data_selector, candidate_trainer, evaluator, manager)
CLI & API: scripts/weekly_retrain.py | backend/routers/monitoring_routes.py
FRONTEND: frontend/src/pages/Monitoring.tsx
TEST SUITES: 186/186 Backend Tests PASSED | 24/24 Frontend Tests PASSED
PRODUCTION INTEGRITY: 100% FROZEN (All 5 SHA-256 Hashes Identical & Verified)
========================================================================================
```

---

## 1. Executive Summary & Research Motivation
Phase 20 implements an experimental weekly rolling retraining engine to assess whether continuously updating XGBoost models on recently completed Indian Mainboard IPOs from a trailing 30-day window enhances prediction accuracy over the baseline frozen production ensemble.

The architecture strictly enforces model immutability, data isolation, ex-ante temporal cutoff verification, sample size guards, and a 10-point promotion gate to ensure zero unvalidated model changes.

---

## 2. Key Architecture Pillars & Governance Principles

1. **Production Immutability & Model Integrity:**
   - Pre-training and post-training SHA-256 hash checks verify that artifacts in `models/final_candidates/` remain untouched.
2. **Trailing 30-Day Window:**
   - Window defined as $[T - 30\text{d}, T)$ (start inclusive, end exclusive).
3. **Mainboard Only & SME Rejection:**
   - Rejects SME exchange offerings and incomplete listings.
4. **Ex-Ante Temporal Cutoff Invariant:**
   - Feature snapshots must be captured prior to `09:59:59 IST` on the IPO open date. Post-IPO outcomes are strictly quarantined.
5. **Sample Size Guard ($N \ge 10$):**
   - If eligible completed IPOs in the window $N < 10$, the pipeline safely halts with `INSUFFICIENT_SAMPLE_SIZE`. No models are trained, and no synthetic data is fabricated.
6. **Chronological 80/20 Train-Validation Split:**
   - Avoids random shuffle leakage by strictly sorting by close date ascending.
7. **Preprocessor Isolation:**
   - `FoldPreprocessor` is fitted solely on the training slice; validation features are transformed using training parameters.
8. **Unified XGBoost Candidate Architecture:**
   - Evaluates whether a unified 4-target XGBoost candidate outperforms the heterogeneous production architecture.
9. **Dual-Model Validation & Metric Differences:**
   - Both models evaluated on the identical validation set. $\Delta\text{MAE} = \text{Candidate\_MAE} - \text{Current\_MAE}$ ($\le 0$ indicates candidate improvement).
10. **The 10-Point Promotion Gate:**
    - Candidate must pass all 10 technical, statistical, and schema checks to achieve `CANDIDATE_READY_FOR_PROMOTION`.
11. **Disabled Automatic Promotion:**
    - The pipeline never automatically overwrites production files.

---

## 3. Real-World Execution Results (`run_date = 2026-08-31`)

* **Window Evaluated:** `[2026-08-01, 2026-08-31)`
* **Eligible Completed IPOs Found:** `0`
* **Sample Size Requirement ($N$):** `10`
* **Retraining Status:** `INSUFFICIENT_SAMPLE_SIZE`
* **Candidate Model Trained:** `NONE`
* **Promotion Decision:** `KEEP_CURRENT_MODEL`
* **Feature Drift Level (PSI):** `HIGH` $\to$ `MODEL_REVIEW_REQUIRED` (Governance rule prevents automatic bypass).
* **Production Integrity:** `VERIFIED (100% Unchanged)`

---

## 4. Verification & Audit Metrics

| Verification Category | Status | Details |
|---|---|---|
| **Python Syntax Compilation** | **PASS** | `compileall` passed with 0 errors across `backend` and `scripts`. |
| **Retraining Test Suite** | **PASS** | `tests/test_weekly_retraining.py` (20/20 passed in 5.39s). |
| **Full Backend Regression** | **PASS** | Full suite (186/186 passed in 12.33s). Zero regressions. |
| **Frontend Unit Tests** | **PASS** | Vitest (24/24 passed in 0.48s). |
| **Frontend Production Build** | **PASS** | `npm run build` (`tsc && vite build`) generated production `dist`. |
| **Production Model SHA-256** | **PASS** | Pre-check and post-check hashes identical to canonical registry. |
| **Production File Immutability** | **PASS** | `models/final_candidates/` and `data/live_predictions/` untouched. |
| **Candidate Artifact Isolation** | **PASS** | `models/retrained/` remains isolated from production storage. |

---

## 5. Important Research Limitations

* **Prospective Real-World Sample Size:** The current forward-validation registry contains $N = 1$ completed prospective offering (*Lumino Industries Ltd*).
* **Statistical Significance:** With $N = 1$, no claims of statistical superiority or generalization can be made for weekly retraining.
* **Experimental Status:** The weekly retraining pipeline functions as a research and surveillance system until sufficient real-world volume accumulates.

---

## 6. Final Architecture Diagram

```
HISTORICAL DATA
      |
      v
45 FEATURE PIPELINE
      |
      v
FROZEN PRODUCTION MODELS (models/final_candidates/)
      |
      +----------------------+
      |                      |
      v                      v
PROSPECTIVE VALIDATION    WEEKLY RETRAINING (backend/retraining/)
      |                      |
      |                      v
      |                TRAILING 30 DAYS [T-30d, T)
      |                      |
      |                      v
      |                N >= 10 GUARD
      |                      |
      |                      v
      |                UNIFIED XGBOOST (models/retrained/)
      |                      |
      |                      v
      |                CHRONOLOGICAL 80/20 VAL
      |                      |
      |                      v
      |                10-POINT PROMOTION GATE
      |                      |
      |                      v
      |                CANDIDATE ONLY (models/retrained/)
      |
      v
REAL OUTCOME
      |
      v
PERFORMANCE MONITORING
```

---

## 7. Conclusion & Next Steps
Phase 20 is complete. The Weekly Rolling Retraining Pipeline, CLI tool, FastAPI monitoring endpoints, and Frontend dashboard are fully operational, tested, and cryptographically verified under strict zero-leakage and model immutability constraints.
