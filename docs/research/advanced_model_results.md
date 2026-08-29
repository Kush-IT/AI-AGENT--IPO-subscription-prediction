# Advanced ML Optimization & Feature Group Results

## 1. Overview & Search Execution
In Phase 7, controlled hyperparameter searches were conducted across candidate tree ensembles (**XGBoost**, **LightGBM**, **Random Forest**) across all 4 category targets and candidate target representations (\(\text{RAW}\) vs \(\log(1+y)\)). 

A total of **112 model configurations** were evaluated using 4-fold expanding walk-forward cross-validation on the 89 historical development IPOs.

---

## 2. Advanced Tuning Summary

| Target | Model Family | Best Configuration Summary | Mean Walk-Forward MAE (\(\times\)) | Std MAE (\(\times\)) | Mean RMSE (\(\times\)) | Mean MedianAE (\(\times\)) |
|---|---|---|:---:|:---:|:---:|:---:|
| **Total** | **XGBoost (log1p)** | `max_depth=2`, `n_est=60`, `lr=0.05`, `colsample=0.7` | **14.56** | **3.32** | **21.35** | **8.52** |
| | LightGBM (log1p) | `max_depth=2`, `num_leaves=4`, `n_est=60`, `lr=0.05` | 17.02 | 3.85 | 24.11 | 10.42 |
| | Random Forest (log1p) | `max_depth=3`, `n_est=80`, `max_features='sqrt'` | 18.24 | 4.10 | 25.02 | 11.20 |
| **QIB** | **Random Forest (RAW)**| `max_depth=4`, `n_est=120`, `max_features=0.6` | **27.60** | **8.38** | **35.10** | **21.02** |
| | XGBoost (RAW) | `max_depth=3`, `n_est=80`, `lr=0.03`, `colsample=0.7` | 28.12 | 8.95 | 35.80 | 22.45 |
| | LightGBM (RAW) | `max_depth=3`, `n_est=80`, `lr=0.03`, `num_leaves=7` | 28.95 | 9.40 | 37.15 | 23.10 |
| **NII** | **LightGBM (log1p)** | `max_depth=3`, `num_leaves=7`, `n_est=80`, `lr=0.03` | **34.01** | **11.86** | **58.13** | **16.78** |
| | XGBoost (log1p) | `max_depth=3`, `n_est=80`, `lr=0.03`, `colsample=0.7` | 35.20 | 12.10 | 61.40 | 17.50 |
| **Retail** | **XGBoost (RAW)** | `max_depth=3`, `n_est=100`, `lr=0.05`, `colsample=0.8` | **20.33** | **12.03** | **42.54** | **10.70** |
| | Random Forest (log1p) | `max_depth=3`, `n_est=80`, `max_features='sqrt'` | 21.40 | 11.80 | 45.20 | 5.80 |

---

## 3. Verified GMP Ablation Math

In Phase 6, progressive feature group additions demonstrated that adding Grey Market Premium (GMP) and news sentiment signals (Group F) created the single largest error reduction.

We perform exact mathematical recalculation from the underlying ablation records ([`ablation_results.csv`](file:///d:/project-2/data/metadata/ablation_results.csv)):
- **Group E (Structure + Fundamentals + Valuation + Market + Historical Demand) MAE**: \(28.0846\times\)
- **Group F (Plus Sentiment & GMP) MAE**: \(16.4103\times\)
- **Absolute Error Reduction**: \(28.0846 - 16.4103 = 11.6743\times\)
- **Verified Relative Error Reduction Percentage**:
  \[
  \frac{28.0846 - 16.4103}{28.0846} \times 100\% = \mathbf{41.568\%}
  \]
This mathematically verifies that adding sentiment and grey market premium slashes forecasting error by **\(41.57\%\)**.

---

## 4. Permutation & Gini Feature Importance

Based on [`model_feature_importance.csv`](file:///d:/project-2/data/metadata/model_feature_importance.csv), the leading predictive signals across the selected models are:

1. **`gmp_percentage`**: Dominant driver across all categories (permutation importance score \(> 0.65\) in NII and Total models).
2. **`price_band_spread_pct`**: Captures issuer pricing flexibility.
3. **`revenue_cagr_3yr` & `revenue_latest_cr`**: High fundamental growth signals institutional stability.
4. **`issue_size_in_crore`**: Scale friction dampening excessive oversubscription.
5. **`positive_news_ratio` & `average_sentiment_score`**: Pre-IPO retail enthusiasm indicators.
6. **`india_vix`**: Macro volatility discount factor.
