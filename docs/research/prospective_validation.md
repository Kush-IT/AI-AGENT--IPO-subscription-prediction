# Prospective Real-IPO Validation Methodology & Drift Surveillance

## 1. Motivation: Distinguishing Historical Backtesting from Forward Validation
In quantitative finance and econometrics, backtested out-of-sample evaluations—even when guarded by walk-forward temporal isolation—carry residual risk of survivorship or selection bias. 

**Prospective forward validation** establishes an incontrovertible empirical benchmark by generating and permanently logging model predictions *before* the market offering opens, locking all 45 feature states and model weights, and attaching actual exchange subscription outcomes only after the offering has concluded.

---

## 2. Temporal Precedence Rules
For any prospective offering $i$:
1. **Feature Cutoff:**
   \[
   t_{\text{observed}}(x_{i,j}) \le t_{\text{cutoff}}(i) = \text{ipo\_open\_date}(i) \,\|\, \text{09:59:59 IST}
   \]
2. **Prediction Generation:**
   \[
   t_{\text{prediction}}(i) \le t_{\text{cutoff}}(i)
   \]
3. **Outcome Attachment:**
   \[
   t_{\text{outcome}}(i) > t_{\text{prediction}}(i)
   \]
   No post-open order book velocity or secondary listing price can flow backward into the feature snapshot.

---

## 3. Population Stability Index (PSI) Formulation
To detect macroeconomic or regulatory regime shifts, the drift engine computes the Population Stability Index (PSI) comparing historical baseline feature distributions ($B$) against prospective samples ($P$):

\[
\text{PSI} = \sum_{b=1}^{K} \left( P_b - B_b \right) \times \ln\left( \frac{P_b + \epsilon}{B_b + \epsilon} \right)
\]

### Operational Benchmarks:
* $\text{PSI} < 0.10$: **LOW DRIFT (Model Stable)**
* $0.10 \le \text{PSI} < 0.25$: **MODERATE DRIFT (Surveillance Active)**
* $\text{PSI} \ge 0.25$: **HIGH DRIFT (Flag `MODEL_REVIEW_REQUIRED`)**

---

## 4. Controlled Retraining Governance
The platform strictly prohibits automated online retraining. If high drift or persistent degradation is detected:
1. System status is updated to `MODEL_REVIEW_REQUIRED`.
2. Frozen production candidate models remain active.
3. Any future model update requires independent walk-forward cross-validation, hyperparameter tuning, quarantined test isolation, TreeSHAP re-calibration, and new cryptographic hash registration.
