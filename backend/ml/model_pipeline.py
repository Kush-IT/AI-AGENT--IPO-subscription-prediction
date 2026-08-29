import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any

ROOT_DIR = Path(__file__).parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, median_absolute_error
from sklearn.preprocessing import StandardScaler

from backend.ml.model_config import get_baseline_models, ABLATION_GROUPS, RANDOM_STATE
from backend.ml.features import TARGET_COLUMNS

ROOT_DIR = Path(__file__).parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"
MODELS_DIR = ROOT_DIR / "models" / "baseline"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


class FoldPreprocessor:
    """
    Strictly isolated fold preprocessor that fits imputation, categorical encodings,
    and scalers solely on the training slice of a cross-validation fold.
    """
    def __init__(self, scale_features: bool = False):
        self.scale_features = scale_features
        self.medians_: Dict[str, float] = {}
        self.sector_map_: Dict[str, int] = {}
        self.trend_map_: Dict[str, int] = {}
        self.scaler_: Optional[StandardScaler] = None
        self.numeric_cols_: List[str] = []
        self.is_fitted = False

    def fit(self, X_train: pd.DataFrame, feature_cols: List[str]):
        self.numeric_cols_ = [c for c in feature_cols if c not in ["sector", "market_trend"]]
        
        # 1. Fit numerical medians
        for col in self.numeric_cols_:
            if col in X_train.columns:
                valid_vals = X_train[col].dropna()
                self.medians_[col] = float(valid_vals.median()) if len(valid_vals) > 0 else 0.0
                
        # 2. Fit categorical encodings
        if "sector" in feature_cols and "sector" in X_train.columns:
            sectors = sorted(X_train["sector"].dropna().unique())
            self.sector_map_ = {sec: idx for idx, sec in enumerate(sectors)}
            
        if "market_trend" in feature_cols and "market_trend" in X_train.columns:
            trends = ["BEARISH", "NEUTRAL", "BULLISH", "VOLATILE"]
            self.trend_map_ = {tr: idx for idx, tr in enumerate(trends)}
            
        # 3. Fit scaler if required
        if self.scale_features:
            self.scaler_ = StandardScaler()
            X_num = self._impute_and_encode(X_train, feature_cols)
            self.scaler_.fit(X_num)
            
        self.is_fitted = True
        return self

    def _impute_and_encode(self, X: pd.DataFrame, feature_cols: List[str]) -> np.ndarray:
        transformed = []
        for col in feature_cols:
            if col == "sector":
                # Apply fitted sector mapping with -1 fallback
                vals = X["sector"].map(lambda x: self.sector_map_.get(x, -1)).values
            elif col == "market_trend":
                vals = X["market_trend"].map(lambda x: self.trend_map_.get(x, 1)).values
            else:
                med = self.medians_.get(col, 0.0)
                vals = X[col].fillna(med).values
            transformed.append(vals)
        return np.column_stack(transformed)

    def transform(self, X: pd.DataFrame, feature_cols: List[str]) -> np.ndarray:
        assert self.is_fitted, "Preprocessor must be fitted on training fold before transform."
        X_mat = self._impute_and_encode(X, feature_cols)
        if self.scale_features and self.scaler_ is not None:
            X_mat = self.scaler_.transform(X_mat)
        return X_mat


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Computes standard evaluation metrics strictly on original scale."""
    y_pred_clipped = np.clip(y_pred, a_min=0.0, a_max=None)
    
    mae = float(mean_absolute_error(y_true, y_pred_clipped))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred_clipped)))
    r2 = float(r2_score(y_true, y_pred_clipped))
    medae = float(median_absolute_error(y_true, y_pred_clipped))
    
    return {
        "MAE": round(mae, 4),
        "RMSE": round(rmse, 4),
        "R2": round(r2, 4),
        "MedianAE": round(medae, 4)
    }


def generate_walk_forward_folds(df: pd.DataFrame, n_splits: int = 4, min_train: int = 50) -> List[Tuple[np.ndarray, np.ndarray]]:
    """
    Generates expanding-window walk-forward temporal folds.
    """
    n_samples = len(df)
    test_size = (n_samples - min_train) // n_splits
    folds = []
    
    for i in range(n_splits):
        train_end = min_train + i * test_size
        test_end = train_end + test_size if i < n_splits - 1 else n_samples
        
        train_indices = np.arange(0, train_end)
        val_indices = np.arange(train_end, test_end)
        folds.append((train_indices, val_indices))
        
    return folds


def run_baseline_benchmarking() -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Runs full walk-forward baseline benchmarking across all 4 targets,
    2 transformation modes (RAW vs log1p), and 7 baseline model families.
    """
    # 1. Load V2 datasets
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    
    # Sort strictly chronologically
    sorted_df = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    
    # 2. Chronological partition: 74 Train + 15 Val = 89 Development IPOs, 17 Final Test IPOs (UNTOUCHED)
    dev_df = sorted_df.iloc[:89].copy().reset_index(drop=True)
    test_df = sorted_df.iloc[89:].copy().reset_index(drop=True)
    
    print(f"Development Set: {len(dev_df)} IPOs ({dev_df['ipo_open_date'].min()} to {dev_df['ipo_open_date'].max()})")
    print(f"Quarantined Final Test Set: {len(test_df)} IPOs (STRICTLY UNUSED)")
    
    feature_cols = ABLATION_GROUPS["Group_G_All_Features_Plus_Sector"]
    folds = generate_walk_forward_folds(dev_df, n_splits=4, min_train=50)
    
    detailed_results = []
    val_predictions = []
    
    for target in TARGET_COLUMNS:
        for transform_mode in ["raw", "log1p"]:
            models_dict = get_baseline_models()
            
            for model_name, model_template in models_dict.items():
                is_linear = model_name in ["Linear_Regression", "Ridge_Regression"]
                
                for fold_idx, (train_idx, val_idx) in enumerate(folds, 1):
                    train_data = dev_df.iloc[train_idx]
                    val_data = dev_df.iloc[val_idx]
                    
                    # Fit fold preprocessor on train_data only
                    preprocessor = FoldPreprocessor(scale_features=is_linear)
                    preprocessor.fit(train_data, feature_cols)
                    
                    X_train = preprocessor.transform(train_data, feature_cols)
                    X_val = preprocessor.transform(val_data, feature_cols)
                    
                    y_train_raw = train_data[target].values
                    y_val_raw = val_data[target].values
                    
                    # Target scaling
                    if transform_mode == "log1p":
                        y_train = np.log1p(y_train_raw)
                    else:
                        y_train = y_train_raw
                        
                    # Clone and fit model
                    model = joblib.load(joblib.dump(model_template, MODELS_DIR / "temp_clone.joblib")[0])
                    model.fit(X_train, y_train)
                    
                    # Predict
                    y_val_pred_raw = model.predict(X_val)
                    if transform_mode == "log1p":
                        y_val_pred = np.expm1(y_val_pred_raw)
                    else:
                        y_val_pred = y_val_pred_raw
                        
                    y_val_pred = np.clip(y_val_pred, a_min=0.0, a_max=None)
                    
                    # Metrics on original scale
                    metrics = calculate_metrics(y_val_raw, y_val_pred)
                    
                    detailed_results.append({
                        "target": target,
                        "target_transform": transform_mode,
                        "model": model_name,
                        "fold": fold_idx,
                        "train_samples": len(train_idx),
                        "val_samples": len(val_idx),
                        "MAE": metrics["MAE"],
                        "RMSE": metrics["RMSE"],
                        "R2": metrics["R2"],
                        "MedianAE": metrics["MedianAE"]
                    })
                    
                    # Record pointwise validation predictions
                    for i, row in val_data.reset_index().iterrows():
                        actual = float(y_val_raw[i])
                        pred = float(y_val_pred[i])
                        res = actual - pred
                        val_predictions.append({
                            "ipo_id": row["ipo_id"],
                            "ipo_open_date": row["ipo_open_date"],
                            "company_name": row["company_name"],
                            "target": target,
                            "target_transform": transform_mode,
                            "model": model_name,
                            "fold": fold_idx,
                            "actual": round(actual, 2),
                            "predicted": round(pred, 2),
                            "residual": round(res, 2),
                            "absolute_error": round(abs(res), 2),
                            "squared_error": round(res ** 2, 2)
                        })
                        
                    # Save fold model for debugging/provenance
                    model_path = MODELS_DIR / f"experimental_{target}_{transform_mode}_{model_name}_fold{fold_idx}.joblib"
                    joblib.dump(model, model_path)
                    
    # Clean up temp clone
    temp_file = MODELS_DIR / "temp_clone.joblib"
    if temp_file.exists():
        temp_file.unlink()
        
    res_df = pd.DataFrame(detailed_results)
    pred_df = pd.DataFrame(val_predictions)
    
    # Summary aggregated metrics
    summary_df = res_df.groupby(["target", "target_transform", "model"])[["MAE", "RMSE", "R2", "MedianAE"]].mean().reset_index()
    summary_df.columns = ["target", "target_transform", "model", "mean_MAE", "mean_RMSE", "mean_R2", "mean_MedianAE"]
    summary_df = summary_df.round(4)
    
    # Save results
    res_df.to_csv(METADATA_DIR / "baseline_model_results.csv", index=False)
    summary_df.to_csv(METADATA_DIR / "baseline_model_summary.csv", index=False)
    pred_df.to_csv(METADATA_DIR / "validation_predictions.csv", index=False)
    
    return res_df, summary_df, pred_df


def run_ablation_benchmarking() -> pd.DataFrame:
    """
    Performs 7-stage feature group ablation benchmarking across models.
    """
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    sorted_df = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    dev_df = sorted_df.iloc[:89].copy().reset_index(drop=True)
    
    folds = generate_walk_forward_folds(dev_df, n_splits=4, min_train=50)
    ablation_records = []
    
    core_models = {
        "Mean_Predictor": get_baseline_models()["Mean_Predictor"],
        "Median_Predictor": get_baseline_models()["Median_Predictor"],
        "Ridge_Regression": get_baseline_models()["Ridge_Regression"],
        "Random_Forest": get_baseline_models()["Random_Forest"],
        "XGBoost": get_baseline_models()["XGBoost"],
        "LightGBM": get_baseline_models()["LightGBM"]
    }
    
    for target in TARGET_COLUMNS:
        # Use log1p as stable transformed representation
        transform_mode = "log1p"
        
        for group_name, feature_cols in ABLATION_GROUPS.items():
            for model_name, model_template in core_models.items():
                is_linear = model_name == "Ridge_Regression"
                fold_maes, fold_rmses, fold_r2s = [], [], []
                
                for fold_idx, (train_idx, val_idx) in enumerate(folds, 1):
                    train_data = dev_df.iloc[train_idx]
                    val_data = dev_df.iloc[val_idx]
                    
                    preprocessor = FoldPreprocessor(scale_features=is_linear)
                    preprocessor.fit(train_data, feature_cols)
                    
                    X_train = preprocessor.transform(train_data, feature_cols)
                    X_val = preprocessor.transform(val_data, feature_cols)
                    
                    y_train = np.log1p(train_data[target].values)
                    y_val_raw = val_data[target].values
                    
                    model = joblib.load(joblib.dump(model_template, MODELS_DIR / "temp_clone_abl.joblib")[0])
                    model.fit(X_train, y_train)
                    
                    y_pred = np.clip(np.expm1(model.predict(X_val)), a_min=0.0, a_max=None)
                    m = calculate_metrics(y_val_raw, y_pred)
                    
                    fold_maes.append(m["MAE"])
                    fold_rmses.append(m["RMSE"])
                    fold_r2s.append(m["R2"])
                    
                ablation_records.append({
                    "target": target,
                    "feature_group": group_name,
                    "num_features": len(feature_cols),
                    "model": model_name,
                    "target_transform": transform_mode,
                    "mean_MAE": round(float(np.mean(fold_maes)), 4),
                    "mean_RMSE": round(float(np.mean(fold_rmses)), 4),
                    "mean_R2": round(float(np.mean(fold_r2s)), 4)
                })
                
    temp_file = MODELS_DIR / "temp_clone_abl.joblib"
    if temp_file.exists():
        temp_file.unlink()
        
    abl_df = pd.DataFrame(ablation_records)
    abl_df.to_csv(METADATA_DIR / "ablation_results.csv", index=False)
    return abl_df


if __name__ == "__main__":
    print("Running Baseline ML Benchmarking...")
    res_df, summary_df, pred_df = run_baseline_benchmarking()
    print("Baseline Benchmarking Complete.")
    print("Running Feature Group Ablation...")
    abl_df = run_ablation_benchmarking()
    print("Ablation Benchmarking Complete.")
