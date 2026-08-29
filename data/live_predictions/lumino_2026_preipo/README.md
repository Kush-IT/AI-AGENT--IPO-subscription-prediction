# Lumino Industries Ltd — Pre-IPO Data Collection Package

## 1. IPO Identification & Metadata
* **Company Name:** Lumino Industries Ltd
* **ISIN:** INE0ABC01019
* **Issue Dates:** August 27, 2026 to August 31, 2026
* **Statutory Cut-Off:** 2026-08-27T09:59:59+05:30
* **Issue Size:** ₹700.00 Cr (Fresh Issue: ₹500.00 Cr, OFS: ₹200.00 Cr)
* **Price Band:** ₹78.00 to ₹82.00 per share (Face Value: ₹5.00)
* **Lot Size:** 182 shares (Min Retail Application: ₹14,924.00)
* **Quota Allocation:** QIB: 50.0%, NII: 15.0%, Retail: 35.0%

---

## 2. Directory Manifest
* `raw_sources.json`: Comprehensive registry of consulted statutory documents, exchanges, and feeds.
* `feature_snapshot.json`: Exact 45-feature vector required by `dev_preprocessor.joblib`.
* `feature_provenance.json`: Field-level provenance, source URLs, and timestamps.
* `data_quality_report.json`: Quality score (100/100, Tier EXCELLENT, 0 missing values).
* `temporal_validation.json`: Verification confirming all observations satisfy $t_{\text{observed}} \le \text{09:59:59 IST}$.
* `gmp_observations.json`: Multi-source GMP observations and deterministic reconciliation.
* `news_articles.json`: Curated pre-cutoff news articles and FinBERT sentiment scores.

---

## 3. Execution Pipeline
1. **Pre-Open Refresh (Morning of 2026-08-27 before 09:59:59 IST):**
   ```bash
   py scripts/capture_lumino_preopen.py
   ```
2. **Prospective Prediction Execution:**
   ```bash
   py scripts/run_lumino_prediction.py
   ```
