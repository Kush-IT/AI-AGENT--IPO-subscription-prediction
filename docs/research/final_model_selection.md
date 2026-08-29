# Final Model Selection & Hyperparameter Configurations

## 1. Executive Summary
Following controlled walk-forward cross-validation on the 89 historical development IPOs, candidate models were selected across all 4 category targets based on the multi-tiered selection policy (lowest walk-forward MAE, fold stability, and MedianAE).

---

## 2. Final Selected Model Architecture per Target

| Target Variable | Selected Model Family | Target Transform | Selected Hyperparameters | Walk-Forward MAE (\(\times\)) | Walk-Forward Std MAE (\(\times\)) | Walk-Forward RMSE (\(\times\)) | Walk-Forward MedianAE (\(\times\)) | Walk-Forward \(R^2\) |
|---|---|:---:|---|:---:|:---:|:---:|:---:|:---:|
| **Total Subscription** | **XGBoost** | **\(\log(1+y)\)** | `n_est`: 60, `max_depth`: 2, `lr`: 0.05, `subsample`: 0.8, `colsample`: 0.7, `reg_alpha`: 0.1, `reg_lambda`: 1.0 | **14.56** | **3.32** | **21.35** | **8.52** | **+0.376** |
| **QIB Subscription** | **Random Forest** | **\(\text{RAW}\)** | `n_est`: 120, `max_depth`: 4, `min_split`: 6, `min_leaf`: 3, `max_features`: 0.6, `bootstrap`: True | **27.60** | **8.38** | **35.10** | **21.02** | **+0.470** |
| **NII Subscription** | **LightGBM** | **\(\log(1+y)\)** | `n_est`: 80, `max_depth`: 3, `num_leaves`: 7, `lr`: 0.03, `subsample`: 0.8, `colsample`: 0.7, `reg_alpha`: 0.5, `reg_lambda`: 1.5 | **34.01** | **11.86** | **58.13** | **16.78** | **-4.921** |
| **Retail Subscription** | **XGBoost** | **\(\text{RAW}\)** | `n_est`: 100, `max_depth`: 3, `lr`: 0.05, `subsample`: 0.8, `colsample`: 0.8, `reg_alpha`: 0.1, `reg_lambda`: 1.0, `min_child_weight`: 1 | **20.33** | **12.03** | **42.54** | **10.70** | **-0.275** |

---

## 3. Rationale for Each Target Selection

1. **Total Subscription**:
   - `XGBoost` on \(\log(1+y)\) achieved the lowest MAE (\(14.56\times\)) with exceptional fold stability (\(\sigma_{\text{MAE}} = 3.32\times\)) and a low Median Absolute Error of \(8.52\times\).
   - Shallow tree depth (`max_depth = 2`) effectively prevented overfitting on macroeconomic regime transitions.

2. **QIB Subscription**:
   - `Random Forest` on RAW targets won with MAE \(27.60\times\), RMSE \(35.10\times\), and the highest overall \(R^2\) score of **\(+0.470\)**.
   - Bagging with `max_features = 0.6` provided regularized aggregation over diverse institutional fundamentals.

3. **NII Subscription**:
   - `LightGBM` on \(\log(1+y)\) achieved the best MAE (\(34.01\times\)) and MedianAE (\(16.78\times\)), outperforming unregularized linear baselines by over \(60\%\).

4. **Retail Subscription**:
   - `XGBoost` on RAW targets won with MAE \(20.33\times\) and MedianAE \(10.70\times\).

---

## 4. Serialized Candidate Artifacts
All selected candidate models have been serialized in [`models/final_candidates/`](file:///d:/project-2/models/final_candidates/):
- `total_xgboost_log1p.joblib`
- `qib_random_forest_raw.joblib`
- `nii_lightgbm_log1p.joblib`
- `retail_xgboost_raw.joblib`
- `dev_preprocessor.joblib`
- `model_metadata.json`
