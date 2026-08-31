# Weekly Rolling Retraining Protocol (Phase 20)

## 1. Executive Summary & Research Motivation

In prospective Indian Mainboard IPO forecasting, market regimes and investor bidding behaviors shift dynamically across monetary cycles, liquidity conditions, and sector rotations. The objective of the Weekly Rolling Retraining Pipeline is to systematically evaluate whether retraining the model on the most recent completed IPOs from a trailing 30-day window enhances predictive accuracy over the frozen production baseline.

To preserve scientific rigor, strict governance controls prevent data leakage, model contamination, and unvalidated promotions.

---

## 2. Mathematical & Algorithmic Specification

### A. Trailing 30-Day Rolling Window
Let $T$ denote the evaluation run date (e.g., `YYYY-MM-DD`). The rolling observation window is defined as:
$$\mathcal{W}(T) = [T - 30\text{d}, T)$$
where the start boundary is inclusive and the end boundary is exclusive.

### B. Eligibility & Selection Filters
An IPO observation $\mathcal{X}_i$ is eligible for inclusion in $\mathcal{W}(T)$ if and only if all of the following conditions hold:
1. **Exchange Listing Type:** Issue is an Indian Mainboard IPO (SME IPOs with ticker suffix `.BO`/`.NS` or category `SME_IPO` are strictly excluded).
2. **Lifecycle Completion:** Official status is `COMPLETED` with verified exchange subscription tallies.
3. **Closing Date Boundary:** $\text{ipo\_close\_date} \in \mathcal{W}(T)$.
4. **Ex-Ante Temporal Cutoff:** Feature snapshot capture timestamp $t_{\text{snap}} \le \text{Open Date } 09:59:59\text{ IST}$.
5. **Schema Fidelity:** Snapshot contains exactly the canonical 45 features ($\mathcal{F}_{45} = \text{Group\_G\_All\_Features\_Plus\_Sector}$) with zero missing values and zero outcome leakage columns.
6. **Target Integrity:** Verified final subscription tallies exist for all 4 targets: $y_{\text{total}}, y_{\text{qib}}, y_{\text{nii}}, y_{\text{retail}} \ge 0.0$.

---

## 3. Sample Size Governance & Guard Thresholds

To prevent overfitting, high variance, and spurious parameter updates on small cohorts:
* **Minimum Retraining Sample Guard:** $N_{\text{eligible}} \ge 10$.
* **Governance Invariant:** If $N_{\text{eligible}} < 10$, the pipeline **safely halts immediately** with status `INSUFFICIENT_SAMPLE_SIZE`.
* **Zero Fabrication Policy:** No synthetic, simulated, or duplicated observations are permitted in the real rolling dataset. Production models remain completely frozen.

---

## 4. Chronological 80/20 Train-Validation Split

Eligible records in $\mathcal{W}(T)$ are sorted chronologically by closing date ascending:
$$\mathcal{D} = \{(\mathbf{x}_{(1)}, \mathbf{y}_{(1)}), (\mathbf{x}_{(2)}, \mathbf{y}_{(2)}), \dots, (\mathbf{x}_{(N)}, \mathbf{y}_{(N)})\}$$
where $\text{close\_date}(\mathbf{x}_{(i)}) \le \text{close\_date}(\mathbf{x}_{(i+1)})$.

* **Training Set:** $\mathcal{D}_{\text{train}} = \{(\mathbf{x}_{(i)}, \mathbf{y}_{(i)})\}_{i=1}^{\lfloor 0.8 N \rfloor}$
* **Validation Set:** $\mathcal{D}_{\text{val}} = \{(\mathbf{x}_{(i)}, \mathbf{y}_{(i)})\}_{i=\lfloor 0.8 N \rfloor + 1}^{N}$

*To eliminate lookahead bias, `FoldPreprocessor` is fitted **strictly on $\mathcal{D}_{\text{train}}$**; $\mathcal{D}_{\text{val}}$ is transformed exclusively using parameters learned from training data.*

---

## 5. Unified XGBoost Candidate Model Architecture

The experimental candidate architecture standardizes all 4 subscription targets into dedicated, conservatively-regularized XGBoost regressors:

| Target Name | Target Transform | Inverse Transform | Hyperparameters |
|---|---|---|---|
| `total_subscription` | $\log(1 + y)$ | $\max(0, \exp(\hat{y}) - 1)$ | `n_estimators=60, max_depth=2, lr=0.05, alpha=0.1, lambda=1.0` |
| `qib_subscription` | $\text{raw}$ | $\max(0, \hat{y})$ | `n_estimators=80, max_depth=3, lr=0.05, alpha=0.1, lambda=1.0` |
| `nii_subscription` | $\log(1 + y)$ | $\max(0, \exp(\hat{y}) - 1)$ | `n_estimators=80, max_depth=3, lr=0.05, alpha=0.5, lambda=1.5` |
| `retail_subscription` | $\text{raw}$ | $\max(0, \hat{y})$ | `n_estimators=100, max_depth=3, lr=0.05, alpha=0.1, lambda=1.0` |

---

## 6. The 10-Point Promotion Gate

A candidate model can only receive status `CANDIDATE_READY_FOR_PROMOTION` if it simultaneously satisfies 10 explicit criteria:

1. **`1. Production Model Integrity`:** SHA-256 hashes of all 5 frozen production models match canonical registry.
2. **`2. Candidate Artifact Integrity`:** Candidate preprocessor and model artifact hashes match `candidate_manifest.json`.
3. **`3. Minimum Training Sample Size`:** Training sample count $N_{\text{train}} \ge 8$ ($N_{\text{eligible}} \ge 10$).
4. **`4. Validation Sample Size`:** Chronological validation sample count $N_{\text{val}} \ge 1$.
5. **`5. Temporal Ex-Ante Compliance`:** Validation observations strictly respect the `09:59:59 IST` cutoff.
6. **`6. 45-Feature Schema Compliance`:** Feature matrix contains exactly the 45 canonical features.
7. **`7. No Synthetic Records in Real Evaluation`:** Evaluated strictly on genuine verified exchange records.
8. **`8. Total MAE Improvement`:** $\text{MAE}_{\text{cand}}(\text{Total}) \le \text{MAE}_{\text{prod}}(\text{Total})$ ($\Delta\text{MAE} \le 0$).
9. **`9. Category Ranking Preservation`:** Candidate category ranking accuracy $\ge (\text{Production} - 10\%)$.
10. **`10. Strongest Category Accuracy Preservation`:** Candidate strongest category classification accuracy $\ge (\text{Production} - 10\%)$.

*Even upon passing all 10 checks, promotion is never automated; production files in `models/final_candidates/` remain isolated and frozen.*
