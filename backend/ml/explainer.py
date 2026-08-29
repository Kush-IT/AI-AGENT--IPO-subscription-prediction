"""
SHAP Explainability & Model Interpretation Engine for Pre-IPO Subscription Prediction.
Provides local and global additive feature attributions for frozen candidate models.
"""
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import json
import joblib
import numpy as np
import pandas as pd
import shap

ROOT_DIR = Path(__file__).parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"
FINAL_MODELS_DIR = ROOT_DIR / "models" / "final_candidates"

from backend.ml.model_config import ABLATION_GROUPS
from backend.ml.features import TARGET_COLUMNS


class SHAPExplainerEngine:
    """
    Unified SHAP explainer interface for frozen candidate models.
    Supports global feature rankings, local sample waterfalls, and category comparisons.
    """
    def __init__(self):
        self.feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
        self.models: Dict[str, Any] = {}
        self.explainers: Dict[str, Any] = {}
        self.preprocessor = None
        self.metadata: Dict[str, Any] = {}
        self.is_initialized = False
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads serialized candidate models, preprocessor, and metadata."""
        meta_path = FINAL_MODELS_DIR / "model_metadata.json"
        prep_path = FINAL_MODELS_DIR / "dev_preprocessor.joblib"
        
        if not meta_path.exists() or not prep_path.exists():
            raise FileNotFoundError("Missing frozen candidate model artifacts in models/final_candidates/")
            
        with open(meta_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)
            
        self.preprocessor = joblib.load(prep_path)
        
        # Load models and initialize TreeExplainers
        target_model_files = {
            "total_subscription": "total_xgboost_log1p.joblib",
            "qib_subscription": "qib_random_forest_raw.joblib",
            "nii_subscription": "nii_lightgbm_log1p.joblib",
            "retail_subscription": "retail_xgboost_raw.joblib"
        }
        
        for target, filename in target_model_files.items():
            model_file = FINAL_MODELS_DIR / filename
            if not model_file.exists():
                raise FileNotFoundError(f"Missing model artifact: {model_file}")
            model = joblib.load(model_file)
            self.models[target] = model
            # TreeExplainer is optimal for XGBoost, LightGBM, and Random Forest
            self.explainers[target] = shap.TreeExplainer(model)
            
        self.is_initialized = True

    def get_preprocessed_matrix(self, df: pd.DataFrame) -> np.ndarray:
        """Transforms raw input DataFrame using the frozen preprocessor."""
        return self.preprocessor.transform(df, self.feature_cols)

    def compute_shap_values(self, X_mat: np.ndarray, target: str) -> np.ndarray:
        """Computes raw SHAP values matrix for a given target."""
        assert self.is_initialized, "Explainer engine must be initialized"
        assert target in self.explainers, f"Invalid target {target}"
        explainer = self.explainers[target]
        shap_vals = explainer.shap_values(X_mat)
        if isinstance(shap_vals, list):
            shap_vals = shap_vals[0]
        return shap_vals

    def get_global_feature_importance(self, target: str, top_k: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Computes global mean absolute SHAP feature importances across the development dataset.
        """
        feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
        X_mat = self.get_preprocessed_matrix(feat_df)
        shap_vals = self.compute_shap_values(X_mat, target)
        
        mean_abs = np.mean(np.abs(shap_vals), axis=0)
        mean_signed = np.mean(shap_vals, axis=0)
        
        records = []
        for idx, col in enumerate(self.feature_cols):
            records.append({
                "target": target,
                "feature": col,
                "mean_abs_shap": round(float(mean_abs[idx]), 6),
                "mean_shap": round(float(mean_signed[idx]), 6)
            })
            
        records.sort(key=lambda x: x["mean_abs_shap"], reverse=True)
        for r_idx, r in enumerate(records, 1):
            r["rank"] = r_idx
            
        if top_k is not None:
            records = records[:top_k]
            
        return records

    def explain_ipo_prediction(self, ipo_id: str, target: str) -> Dict[str, Any]:
        """
        Generates local SHAP additive attribution for a specific IPO observation.
        Uses rigorous, non-causal attribution language.
        """
        feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
        targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
        merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
        
        matching = merged[merged["ipo_id"] == ipo_id]
        if len(matching) == 0:
            raise ValueError(f"IPO ID {ipo_id} not found in preprocessed dataset")
            
        row = matching.iloc[0]
        X_mat = self.get_preprocessed_matrix(matching)
        
        model = self.models[target]
        explainer = self.explainers[target]
        target_info = self.metadata["selected_candidates"][target]
        tf_mode = target_info["target_transform"]
        
        raw_pred = float(model.predict(X_mat)[0])
        pred_val = float(np.clip(np.expm1(raw_pred) if tf_mode == "log1p" else raw_pred, a_min=0.0, a_max=None))
        actual_val = float(row[target])
        
        expected_val_raw = explainer.expected_value
        if isinstance(expected_val_raw, (list, np.ndarray)):
            base_value = float(expected_val_raw[0])
        else:
            base_value = float(expected_val_raw)
            
        shap_vals = self.compute_shap_values(X_mat, target)[0]
        
        feature_attributions = []
        for idx, col in enumerate(self.feature_cols):
            val_raw = row[col] if col in row else matching[col].values[0]
            val_display = round(float(val_raw), 4) if isinstance(val_raw, (int, float, np.number)) else str(val_raw)
            s_val = float(shap_vals[idx])
            direction = "positive" if s_val > 0 else ("negative" if s_val < 0 else "neutral")
            
            feature_attributions.append({
                "feature": col,
                "feature_value": val_display,
                "shap_value": round(s_val, 6),
                "abs_shap_value": round(abs(s_val), 6),
                "direction": direction,
                "attribution_statement": (
                    f"{col} ({val_display}) contributed positively to the model prediction by {s_val:+.4f}"
                    if s_val > 0 else
                    f"{col} ({val_display}) contributed negatively to the model prediction by {s_val:+.4f}"
                )
            })
            
        feature_attributions.sort(key=lambda x: x["abs_shap_value"], reverse=True)
        for r_idx, fa in enumerate(feature_attributions, 1):
            fa["rank"] = r_idx
            
        top_positive = [f for f in feature_attributions if f["direction"] == "positive"][:5]
        top_negative = [f for f in feature_attributions if f["direction"] == "negative"][:5]
        
        return {
            "ipo_id": ipo_id,
            "company_name": row["company_name"],
            "ipo_open_date": row["ipo_open_date"],
            "target": target,
            "target_transform": tf_mode,
            "actual_subscription": round(actual_val, 2),
            "predicted_subscription": round(pred_val, 2),
            "base_value": round(base_value, 4),
            "top_positive_contributors": top_positive,
            "top_negative_contributors": top_negative,
            "all_feature_attributions": feature_attributions
        }

    def get_top_positive_features(self, ipo_id: str, target: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Returns top positive feature contributors for an IPO."""
        explanation = self.explain_ipo_prediction(ipo_id, target)
        return explanation["top_positive_contributors"][:top_k]

    def get_top_negative_features(self, ipo_id: str, target: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Returns top negative feature contributors for an IPO."""
        explanation = self.explain_ipo_prediction(ipo_id, target)
        return explanation["top_negative_contributors"][:top_k]

    def get_all_targets_explanation(self, ipo_id: str) -> Dict[str, Any]:
        """Generates simultaneous multi-target explanations for an IPO across QIB, NII, Retail, and Total."""
        results = {}
        for target in TARGET_COLUMNS:
            results[target] = self.explain_ipo_prediction(ipo_id, target)
        return results


# Module-level helper instances for external consumption
_EXPLAINER_INSTANCE: Optional[SHAPExplainerEngine] = None

def get_explainer() -> SHAPExplainerEngine:
    global _EXPLAINER_INSTANCE
    if _EXPLAINER_INSTANCE is None:
        _EXPLAINER_INSTANCE = SHAPExplainerEngine()
    return _EXPLAINER_INSTANCE

def get_global_feature_importance(target: str, top_k: Optional[int] = 10) -> List[Dict[str, Any]]:
    return get_explainer().get_global_feature_importance(target, top_k)

def explain_ipo_prediction(ipo_id: str, target: str = "total_subscription") -> Dict[str, Any]:
    return get_explainer().explain_ipo_prediction(ipo_id, target)

def get_top_positive_features(ipo_id: str, target: str = "total_subscription", top_k: int = 5) -> List[Dict[str, Any]]:
    return get_explainer().get_top_positive_features(ipo_id, target, top_k)

def get_top_negative_features(ipo_id: str, target: str = "total_subscription", top_k: int = 5) -> List[Dict[str, Any]]:
    return get_explainer().get_top_negative_features(ipo_id, target, top_k)
