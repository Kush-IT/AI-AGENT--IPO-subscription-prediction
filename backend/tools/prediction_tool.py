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
                    df_dict[col] = 0.0
                    
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
