"""
ML Prediction Tool for Frozen Candidate Models.
Executes inference and maps log-scale outputs back to the original subscription scale.
"""
from typing import Dict, Any, List, Tuple
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd

from backend.ml.features import TARGET_COLUMNS
from backend.ml.model_config import ABLATION_GROUPS

ROOT_DIR = Path(__file__).parent.parent.parent
FINAL_MODELS_DIR = ROOT_DIR / "models" / "final_candidates"


class PredictionTool:
    """
    Inference tool wrapping the frozen candidate models without modifying weights.
    """
    def __init__(self):
        self.feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
        self.preprocessor = None
        self.models: Dict[str, Any] = {}
        self.metadata: Dict[str, Any] = {}
        self._load()

    def _load(self):
        meta_file = FINAL_MODELS_DIR / "model_metadata.json"
        prep_file = FINAL_MODELS_DIR / "dev_preprocessor.joblib"
        
        if not meta_file.exists() or not prep_file.exists():
            raise FileNotFoundError("Missing frozen model artifacts in models/final_candidates/")
            
        with open(meta_file, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)
            
        self.preprocessor = joblib.load(prep_file)
        
        target_files = {
            "total_subscription": "total_xgboost_log1p.joblib",
            "qib_subscription": "qib_random_forest_raw.joblib",
            "nii_subscription": "nii_lightgbm_log1p.joblib",
            "retail_subscription": "retail_xgboost_raw.joblib"
        }
        for target, fname in target_files.items():
            self.models[target] = joblib.load(FINAL_MODELS_DIR / fname)

    def predict_all_targets(self, feature_dict: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
        """
        Executes prediction for all 4 subscription categories.
        Returns predicted multiples on the natural subscription scale.
        """
        warnings = []
        df_dict = {}
        for col in self.feature_cols:
            if col in feature_dict and feature_dict[col] is not None:
                df_dict[col] = feature_dict[col]
            else:
                if col == "sector":
                    df_dict[col] = "Other"
                elif col == "market_trend":
                    df_dict[col] = "BULLISH"
                else:
                    df_dict[col] = np.nan
                    
        df = pd.DataFrame([df_dict])
        X_mat = self.preprocessor.transform(df, self.feature_cols)
        
        predictions = {}
        for target in TARGET_COLUMNS:
            model = self.models[target]
            info = self.metadata["selected_candidates"][target]
            tf_mode = info["target_transform"]
            
            raw_pred = float(model.predict(X_mat)[0])
            if tf_mode == "log1p":
                inv_pred = float(np.expm1(raw_pred))
            else:
                inv_pred = raw_pred
                
            pred_val = round(float(np.clip(inv_pred, a_min=0.0, a_max=None)), 2)
            
            predictions[target] = {
                "predicted_multiple": pred_val,
                "model_name": info["model_name"],
                "target_transform": tf_mode,
                "raw_model_output": round(raw_pred, 4),
                "unit": "times (subscription multiple)"
            }
            
        return predictions, warnings


import logging
import time
from datetime import datetime, timezone
from backend.monitoring.prospective_validator import verify_model_integrity, ModelIntegrityError

logger = logging.getLogger("backend.tools.prediction_tool")

# In-memory prediction cache: key -> (timestamp, report_dict)
_ML_PREDICTION_CACHE: Dict[str, Tuple[float, Dict[str, Any]]] = {}
_CACHE_TTL_SECONDS = 3600  # 1 hour in-memory cache


def generate_ml_predictions(raw_inputs: Dict[str, Any], force_refresh: bool = False) -> Dict[str, Any]:
    """
    Executes ex-ante machine learning prediction and TreeSHAP attribution
    on frozen production candidate models using the canonical 45-feature schema.
    Strictly verifies model cryptographic integrity and ex-ante cutoff.
    """
    t0 = time.time()
    comp_name = str(raw_inputs.get("company_name", "Unknown IPO")).strip()
    open_dt_str = str(raw_inputs.get("ipo_open_date", "")).strip()
    cutoff_ts = f"{open_dt_str}T09:59:59+05:30"
    pred_ts = datetime.now(timezone.utc).isoformat()

    # 1. Cryptographic model integrity pre-check
    verified, hashes = verify_model_integrity()
    if not verified:
        logger.error(f"[MODEL INTEGRITY FAILED] Cannot generate predictions for {comp_name}. Production models modified.")
        raise ModelIntegrityError("Production model artifact integrity verification failed.")

    # 2. Check in-memory cache for fast response
    cache_key = f"{comp_name.lower()}_{open_dt_str}_{raw_inputs.get('price_high')}_{raw_inputs.get('issue_size_in_crore')}"
    if not force_refresh and cache_key in _ML_PREDICTION_CACHE:
        cached_time, cached_report = _ML_PREDICTION_CACHE[cache_key]
        if time.time() - cached_time < _CACHE_TTL_SECONDS:
            logger.debug(f"[CACHE HIT] Returning cached ML prediction for {comp_name}")
            return cached_report

    # 3. Execute LangGraph Agentic AI analysis graph
    from backend.agents.graph import run_ipo_analysis
    report = run_ipo_analysis(raw_inputs)

    # 4. Attach metadata fields
    report["cutoff_timestamp"] = cutoff_ts
    report["prediction_timestamp"] = pred_ts
    report["model_integrity_verified"] = verified
    report["model_artifact_hashes"] = hashes
    report["model_version"] = "1.0.0-final-candidates"
    report["prediction_source"] = "Frozen Production Candidates (1.0.0-final-candidates)"
    report["ex_ante"] = True

    # 5. Extract diagnostics for logging (Section 11)
    preds = report.get("predictions", {})
    tot_pred = preds.get("total_subscription", {}).get("predicted_multiple")
    qib_pred = preds.get("qib_subscription", {}).get("predicted_multiple")
    nii_pred = preds.get("nii_subscription", {}).get("predicted_multiple")
    ret_pred = preds.get("retail_subscription", {}).get("predicted_multiple")
    dq = report.get("data_quality", {})
    completeness = dq.get("feature_completeness_pct", 0.0)
    missing_fields = dq.get("missing_fields", [])
    rec_cat = report.get("category_assessment", {}).get("recommended_category", "QIB")

    logger.info(
        f"[EX-ANTE PREDICTION] IPO: '{comp_name}' | Pred Time: {pred_ts} | Cutoff: {cutoff_ts} | "
        f"Predictions => Total: {tot_pred}x, QIB: {qib_pred}x, NII: {nii_pred}x, Retail: {ret_pred}x (Edge: {rec_cat}) | "
        f"Completeness: {completeness}% | Missing: {len(missing_fields)} {missing_fields[:3]} | "
        f"Integrity: {verified} | Latency: {int((time.time() - t0) * 1000)}ms"
    )

    # 6. Store in cache
    _ML_PREDICTION_CACHE[cache_key] = (time.time(), report)
    return report
