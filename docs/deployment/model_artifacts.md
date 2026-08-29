# Production Frozen Model Artifacts & Cryptographic Hash Registry

## 1. Overview
All machine learning model weights, preprocessors, and transformers used by the Agentic AI inference engine are permanently frozen in `models/final_candidates/`.

These files are strictly **read-only** at runtime. The inference engine never modifies, retrains, or overwrites these artifacts.

---

## 2. Cryptographic Integrity Registry (SHA-256)

| Artifact Filename | Target Variable | Architecture Family | Target Transform | Development 5-Fold Walk-Forward MAE | Quarantined 2024 Test Performance | SHA-256 Cryptographic Hash |
|---|---|---|:---:|:---:|:---:|---|
| `dev_preprocessor.joblib` | *Feature Preprocessor* | Median Imputer + RobustScaler + Target Encoder | `N/A` | N/A | 45 features aligned | `04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57` |
| `total_xgboost_log1p.joblib` | `total_subscription` | XGBoost Regressor | `log1p` (\(\hat{y} = \operatorname{expm1}\)) | \(16.17\times\) | \(R^2 = +0.666\), \(\text{MAE} = 17.43\times\) | `3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6` |
| `qib_random_forest_raw.joblib` | `qib_subscription` | Random Forest Regressor | `raw` | \(28.48\times\) | \(R^2 = +0.589\), \(\text{MAE} = 31.43\times\) | `29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5` |
| `nii_lightgbm_log1p.joblib` | `nii_subscription` | LightGBM Regressor | `log1p` (\(\hat{y} = \operatorname{expm1}\)) | \(36.39\times\) | Expanding Walk-Forward Isolation | `618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29` |
| `retail_xgboost_raw.joblib` | `retail_subscription` | XGBoost Regressor | `raw` | \(20.24\times\) | Expanding Walk-Forward Isolation | `835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab` |

---

## 3. Runtime Data Artifacts
The backend packages the following verified historical datasets under `data/`:
1. `data/processed/ipo_training.csv` (106 verified Mainboard IPOs)
2. `data/processed/ipo_features_preipo_v2.csv` (45 pre-IPO predictive features)
3. `data/processed/ipo_targets_v2.csv` (4 subscription targets)
4. `data/metadata/live_source_registry.csv` (authoritative data provenance catalog)
5. `data/metadata/data_dictionary.csv` (feature definitions and units)

*Note: Runtime cache files in `data/cache/*.json` are excluded from Docker image layers and git commits to guarantee clean deployments.*
