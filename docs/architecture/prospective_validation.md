# Prospective Real-IPO Validation & Prediction Logging Architecture

## 1. System Architecture

```mermaid
graph TD
    subgraph PreOpenInference [1. Pre-IPO Prospective Prediction Lifecycle]
        IPO["New Prospective Offering Terms"] --> VAL["Temporal Validator (t <= 09:59:59 IST)"]
        VAL --> HASH["Cryptographic Hash Check (5 Model Joblibs)"]
        HASH --> AGENT["LangGraph 8-Node Agent Core"]
        AGENT --> PRED["Predictions (Total, QIB, NII, Retail)"]
        PRED --> LOG["Append-Only Prediction Logger (predictions.csv)"]
        LOG --> AUDIT["JSONL Audit Trail (prediction_audit.jsonl)"]
    end

    subgraph PostCloseOutcome [2. Post-Offering Outcome Ingestion]
        EXCH["Exchange Allotment & Subscription Tallies (NSE/BSE)"] --> OUTVAL["Timestamp Precedence Validator (t_outcome > t_pred)"]
        OUTVAL --> ATTACH["Outcome Attachment (completed_predictions.csv)"]
        ATTACH --> ERR["Prediction Error Calculation (MAE, RMSE, MedianAE, R2)"]
        ATTACH --> VALDATA["Forward Validation Dataset (prospective_validation.csv)"]
    end

    subgraph MonitoringSurveillance [3. Drift & Performance Surveillance]
        ERR --> PERF["Performance Monitor (/api/v1/monitoring/performance)"]
        VALDATA --> DRIFT["PSI Feature & Target Drift Detector (/api/v1/monitoring/drift)"]
        DRIFT --> DASH["React Monitoring Dashboard (/monitoring)"]
    end

    PreOpenInference --> PostCloseOutcome --> MonitoringSurveillance
```

---

## 2. Immutability & Separation of Concerns
1. **Original Prediction Immutability**: All prospective forecasts are written to `data/live_predictions/predictions.csv` with a unique UUID `prediction_id`, cryptographic feature snapshot hash, and timestamp. Original forecast multiples are never modified.
2. **Outcome Isolation**: Exchange closing tallies are stored in `completed_predictions.csv` and attached only when $t_{\text{outcome}} > t_{\text{prediction}}$.
3. **No Automatic Retraining**: If PSI indicates moderate or high feature/target drift, the engine flags `model_status = "MODEL_REVIEW_REQUIRED"`. Frozen models in `models/final_candidates/` remain active and unchanged.
