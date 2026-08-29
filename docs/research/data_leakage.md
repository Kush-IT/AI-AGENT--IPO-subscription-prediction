# Data Leakage Prevention & Anti-Leakage Architecture

**Project:** Pre-IPO Subscription Forecasting Using Machine Learning and Agentic AI: A Category-Wise Prediction Framework for Indian IPOs

---

## 1. The Data Leakage Problem in Financial IPO Forecasting

Data leakage occurs when information from outside the training partition or information from the future (relative to the forecast point) is inadvertently introduced into the model's feature space. In IPO subscription forecasting, data leakage artificially inflates model accuracy during backtesting while causing catastrophic failures in real-world deployment.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       TEMPORAL INFORMATION HORIZON                         │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ 🟢 PERMITTED PRE-IPO FEATURES       │ 🔴 FORBIDDEN LEAKAGE VARIABLES       │
│ (Timestamp <= T_cutoff)             │ (Timestamp > T_cutoff)               │
├─────────────────────────────────────┼──────────────────────────────────────┤
│ • Prospectus Financials (FY-1, FY-2)│ • Day 1 / Day 2 / Day 3 Bids         │
│ • Issue Size, Price Band, Lot Size  │ • Final Category Subscription        │
│ • Industry Peer Valuation (Pre-Open)│ • Basis of Allotment Figures         │
│ • NIFTY 50 & VIX (T - 1 day)        │ • Listing Day Opening Price          │
│ • Pre-IPO GMP (Latest before open)  │ • Listing Day Underpricing / Return  │
│ • Historical IPO Cohorts (Past only)│ • Post-Open News / Analyst Updates   │
└─────────────────────────────────────┴──────────────────────────────────────┘
                                      ▲
                                      │
                        CUTOFF: T_open (10:00 AM IST)
```

---

## 2. Formal Temporal Boundary Definition

For any given IPO \(i\), let \(T_{\text{open}}^{(i)}\) denote the official opening time of the bidding window (10:00 AM IST on the opening date).

The **Pre-IPO Feature Cutoff Datetime** is formally defined as:
\[
T_{\text{cutoff}}^{(i)} = T_{\text{open}}^{(i)} - \epsilon, \quad \text{where } \epsilon = 1 \text{ second}
\]

### Anti-Leakage Validation Rule:
For every feature \(x_{i,j}\) with publication/observation timestamp \(t(x_{i,j})\):
\[
\text{Valid}(x_{i,j}) \iff t(x_{i,j}) \le T_{\text{cutoff}}^{(i)}
\]
If \(t(x_{i,j}) > T_{\text{cutoff}}^{(i)}\), the pipeline triggers an immediate **`LEAKAGE_VIOLATION`** exception and rejects the feature from the pre-IPO feature matrix.

---

## 3. Explicit Taxonomy of Forbidden Leakage Variables

The following variable categories are strictly quarantined and prohibited from entering the pre-IPO training matrix:

1. **Final Subscription Multiples:** `qib_subscription`, `nii_subscription`, `retail_subscription`, `total_subscription` (These serve exclusively as supervised targets \(Y\)).
2. **Intraday Bidding Trajectories:** Day-1, Day-2, or Day-3 cumulative bids from `ipo_subscription_daily.csv`.
3. **Allotment & Listing Metrics:** `allotment_date`, `listing_date`, `listing_price`, `listing_gain`, `listing_return`.
4. **Future Historical Cohorts:** Expanding average subscription calculations for IPO \(i\) must **never** include IPO \(i\) or any IPO \(k\) where \(T_{\text{open}}^{(k)} \ge T_{\text{open}}^{(i)}\).
5. **Preprocessing Leakage:** Imputers and scalers must be fitted **exclusively on the training partition** and applied out-of-sample to validation and test partitions.

---

## 4. Architectural Safeguards Implemented

### 4.1 Independent Feature and Target Pipelines
In `backend/ml/preprocessing.py`, the dataset is physically decoupled into separate artifact files:
- `data/processed/ipo_features_preipo.csv`: Contains exclusively ex-ante features \(X\).
- `data/processed/ipo_targets.csv`: Contains isolated target vectors \(Y\).

### 4.2 Automated Leakage Audit Engine
The module [`backend/ml/leakage.py`](file:///d:/project-2/backend/ml/leakage.py) programmatically scans every column and row of the dataset for semantic keyword collisions, future timestamp violations, and target contamination, writing an audit trail to `data/metadata/leakage_audit.csv`.

### 4.3 Strict Chronological Partitioning
The module [`backend/ml/temporal_split.py`](file:///d:/project-2/backend/ml/temporal_split.py) implements chronological train/validation/test splits with explicit invariant assertions:
\[
\max(D_{\text{train}}) \le \min(D_{\text{val}}) \quad \text{and} \quad \max(D_{\text{val}}) \le \min(D_{\text{test}})
\]
Random shuffling is strictly disabled across all training and evaluation routines.

---

## 5. Audit Results Summary

Execution of [`scripts/leakage_audit.py`](file:///d:/project-2/scripts/leakage_audit.py) on the processed dataset yielded:
- **Total Records Audited:** 24 Historical Mainboard IPOs
- **Total Feature Attributes Scanned:** 960 data cells
- **Leakage Violations Detected:** **0**
- **Status:** **100% PASS** (Fully Verified Pre-IPO Integrity)
