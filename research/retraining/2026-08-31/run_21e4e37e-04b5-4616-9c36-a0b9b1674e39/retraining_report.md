# Weekly Rolling Retraining Audit Report — 2026-08-31

- **Run ID:** `21e4e37e-04b5-4616-9c36-a0b9b1674e39`
- **Execution Timestamp:** `2026-08-31T13:40:08.067563+00:00`
- **Dry Run Mode:** `Enabled`
- **Final Retraining Status:** `INSUFFICIENT_SAMPLE_SIZE`
- **Status Message:** INSUFFICIENT_SAMPLE_SIZE: Found 0 eligible completed Mainboard IPOs in trailing 30-day window [2026-08-01, 2026-08-31), minimum required is 10. Retaining production model.
- **Production Model Integrity:** `VERIFIED (Unchanged)`

## 1. Rolling 30-Day Data Window
- **Window Start (Inclusive):** `2026-08-01`
- **Window End (Exclusive):** `2026-08-31`
- **Total Candidates Examined:** `5`
- **Eligible Completed Mainboard IPOs:** `0`
- **Rejected Records Count:** `5`
- **Training Sample Count (N_train):** `0`
- **Validation Sample Count (N_val):** `0`
- **Minimum Sample Threshold:** `10`

### Audit Candidate Log
| IPO ID | Company Name | Close Date | Included | Reason / Split |
|---|---|---|---|---|
| `lumino_2026` | Lumino Industries Ltd | 2026-08-31 | NO | OUTSIDE_WINDOW: Close date 2026-08-31 is outside [2026-08-01, 2026-08-31). |
| `test_candidate_2026` | Test Engineering Ltd | 2026-09-18 | NO | NOT_COMPLETED: Offering lifecycle status is 'DISCOVERED'. |
| `9d8040d3-8d8f-4e8d-a20b-a0b992f49937` | Forward Testing Ltd | 2025-03-03 | NO | OUTSIDE_WINDOW: Close date 2025-03-03 is outside [2026-08-01, 2026-08-31). |
| `test-api-pred-9999` | Prospective API Corp | 2025-06-03 | NO | OUTSIDE_WINDOW: Close date 2025-06-03 is outside [2026-08-01, 2026-08-31). |
| `lumino_2026_preipo` | Lumino Industries Ltd | 2026-08-31 | NO | OUTSIDE_WINDOW: Close date 2026-08-31 is outside [2026-08-01, 2026-08-31). |

## 2. Monitored Feature Drift (PSI)
- **Overall Feature Drift Level:** `HIGH`
- **Model Stability Status:** `MODEL_REVIEW_REQUIRED`

## 3. Candidate Training & Promotion Gate
- **Candidate Training:** `SKIPPED (Insufficient observations in 30-day window)`
- **Promotion Decision:** `KEEP_CURRENT_MODEL`
- **Governance Notice:** Insufficient completed observations in rolling window. No candidate model trained.

## 5. Production Model Cryptographic Verification
```json
{
  "dev_preprocessor.joblib": "04bd6412a6dc3113f28ba117866e8e4a6d3de0dc8ee3c5f43b5a58432cc14d57",
  "nii_lightgbm_log1p.joblib": "618ef8351e54953b60063339910ac0638de28dad2f1368058895f690353d3c29",
  "qib_random_forest_raw.joblib": "29188a7909eb069a8185ec23f1b8b4f9e4a784be723b6fe81e79ed7f8c3a79d5",
  "retail_xgboost_raw.joblib": "835ceb1face5831889fd55a5774e02289ae3a2f6fd4085331f0f555bb5f9b7ab",
  "total_xgboost_log1p.joblib": "3b00118e9e12cddd7f5f4ce59d5b6fef4211826efaffa03a36af5ed845550cc6"
}
```

---
*Report generated automatically by IPO Subscription AI Weekly Retraining Engine.*