"""
Controlled Hyperparameter Optimization & Model Selection Engine for Phase 7.
Executes leakage-free, expanding-window walk-forward validation on development data (89 IPOs).
Freezes decisions before single final evaluation on the quarantined test set (17 IPOs).
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any, Optional
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

from backend.ml.model_config import RANDOM_STATE, ABLATION_GROUPS
from backend.ml.model_pipeline import FoldPreprocessor, calculate_metrics, generate_walk_forward_folds
from backend.ml.features import TARGET_COLUMNS

DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"
FINAL_MODELS_DIR = ROOT_DIR / "models" / "final_candidates"
FINAL_MODELS_DIR.mkdir(parents=True, exist_ok=True)


# Controlled hyperparameter search grids (adapted for small sample size ~89 IPOs to avoid overfitting)
SEARCH_GRIDS = {
    "XGBoost": [
        {"n_estimators": 60, "max_depth": 2, "learning_rate": 0.05, "subsample": 0.8, "colsample_bytree": 0.7, "reg_alpha": 0.1, "reg_lambda": 1.0, "min_child_weight": 2},
        {"n_estimators": 80, "max_depth": 3, "learning_rate": 0.03, "subsample": 0.8, "colsample_bytree": 0.7, "reg_alpha": 0.5, "reg_lambda": 1.5, "min_child_weight": 2},
        {"n_estimators": 100, "max_depth": 3, "learning_rate": 0.05, "subsample": 0.8, "colsample_bytree": 0.8, "reg_alpha": 0.1, "reg_lambda": 1.0, "min_child_weight": 1},
        {"n_estimators": 100, "max_depth": 4, "learning_rate": 0.03, "subsample": 0.7, "colsample_bytree": 0.7, "reg_alpha": 1.0, "reg_lambda": 2.0, "min_child_weight": 3},
        {"n_estimators": 120, "max_depth": 2, "learning_rate": 0.02, "subsample": 0.85, "colsample_bytree": 0.8, "reg_alpha": 0.2, "reg_lambda": 1.0, "min_child_weight": 2}
    ],
    "LightGBM": [
        {"n_estimators": 60, "max_depth": 2, "num_leaves": 4, "learning_rate": 0.05, "subsample": 0.8, "colsample_bytree": 0.7, "min_child_samples": 5, "reg_alpha": 0.1, "reg_lambda": 1.0},
        {"n_estimators": 80, "max_depth": 3, "num_leaves": 7, "learning_rate": 0.03, "subsample": 0.8, "colsample_bytree": 0.7, "min_child_samples": 8, "reg_alpha": 0.5, "reg_lambda": 1.5},
        {"n_estimators": 100, "max_depth": 3, "num_leaves": 7, "learning_rate": 0.05, "subsample": 0.8, "colsample_bytree": 0.8, "min_child_samples": 10, "reg_alpha": 0.1, "reg_lambda": 1.0},
        {"n_estimators": 120, "max_depth": 2, "num_leaves": 4, "learning_rate": 0.03, "subsample": 0.85, "colsample_bytree": 0.8, "min_child_samples": 6, "reg_alpha": 0.2, "reg_lambda": 1.0}
    ],
    "Random_Forest": [
        {"n_estimators": 80, "max_depth": 3, "min_samples_split": 4, "min_samples_leaf": 2, "max_features": "sqrt", "bootstrap": True},
        {"n_estimators": 100, "max_depth": 4, "min_samples_split": 4, "min_samples_leaf": 2, "max_features": 0.7, "bootstrap": True},
        {"n_estimators": 100, "max_depth": 5, "min_samples_split": 4, "min_samples_leaf": 2, "max_features": "sqrt", "bootstrap": True},
        {"n_estimators": 120, "max_depth": 4, "min_samples_split": 6, "min_samples_leaf": 3, "max_features": 0.6, "bootstrap": True},
        {"n_estimators": 150, "max_depth": 3, "min_samples_split": 4, "min_samples_leaf": 2, "max_features": 0.8, "bootstrap": True}
    ]
}


def instantiate_model(model_name: str, params: Dict[str, Any]):
    """Instantiates model with parameters and fixed random seed."""
    if model_name == "XGBoost":
        return XGBRegressor(**params, random_state=RANDOM_STATE, verbosity=0)
    elif model_name == "LightGBM":
        return LGBMRegressor(**params, random_state=RANDOM_STATE, verbose=-1)
    elif model_name == "Random_Forest":
        return RandomForestRegressor(**params, random_state=RANDOM_STATE, n_jobs=-1)
    else:
        raise ValueError(f"Unknown model name {model_name}")


def evaluate_hyperparameter_grid(
    dev_df: pd.DataFrame,
    target: str,
    transform_mode: str,
    feature_cols: List[str],
    folds: List[Tuple[np.ndarray, np.ndarray]]
) -> pd.DataFrame:
    """Evaluates all candidate parameter configurations over walk-forward CV folds."""
    tuning_records = []
    
    for model_name, param_list in SEARCH_GRIDS.items():
        for param_idx, params in enumerate(param_list):
            fold_maes, fold_rmses, fold_medaes, fold_r2s = [], [], [], []
            
            for fold_idx, (train_idx, val_idx) in enumerate(folds, 1):
                train_data = dev_df.iloc[train_idx]
                val_data = dev_df.iloc[val_idx]
                
                # Fit preprocessor on training fold only
                preprocessor = FoldPreprocessor(scale_features=False)
                preprocessor.fit(train_data, feature_cols)
                
                X_train = preprocessor.transform(train_data, feature_cols)
                X_val = preprocessor.transform(val_data, feature_cols)
                
                y_train_raw = train_data[target].values
                y_val_raw = val_data[target].values
                
                if transform_mode == "log1p":
                    y_train = np.log1p(y_train_raw)
                else:
                    y_train = y_train_raw
                    
                model = instantiate_model(model_name, params)
                model.fit(X_train, y_train)
                
                y_val_pred_raw = model.predict(X_val)
                if transform_mode == "log1p":
                    y_val_pred = np.expm1(y_val_pred_raw)
                else:
                    y_val_pred = y_val_pred_raw
                    
                y_val_pred = np.clip(y_val_pred, a_min=0.0, a_max=None)
                m = calculate_metrics(y_val_raw, y_val_pred)
                
                fold_maes.append(m["MAE"])
                fold_rmses.append(m["RMSE"])
                fold_medaes.append(m["MedianAE"])
                fold_r2s.append(m["R2"])
                
            tuning_records.append({
                "target": target,
                "target_transform": transform_mode,
                "model": model_name,
                "param_config_id": f"{model_name}_cfg_{param_idx+1}",
                "hyperparameters": json.dumps(params),
                "mean_MAE": round(float(np.mean(fold_maes)), 4),
                "std_MAE": round(float(np.std(fold_maes, ddof=1)), 4),
                "mean_RMSE": round(float(np.mean(fold_rmses)), 4),
                "std_RMSE": round(float(np.std(fold_rmses, ddof=1)), 4),
                "mean_MedianAE": round(float(np.mean(fold_medaes)), 4),
                "mean_R2": round(float(np.mean(fold_r2s)), 4)
            })
            
    return pd.DataFrame(tuning_records)
