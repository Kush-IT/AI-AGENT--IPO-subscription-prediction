"""
Unified Data Loader and Access Layer.
Provides typed access to pre-IPO features, target tensors, and chronological partitions.
"""
from typing import Tuple, Dict, Any, Optional
import pandas as pd
import numpy as np
from pathlib import Path
from backend.ml.temporal_split import chronological_train_val_test_split
from backend.ml.preprocessing import (
    NUMERIC_FEATURE_COLUMNS,
    CATEGORICAL_FEATURE_COLUMNS,
    TARGET_COLUMNS,
    IPOPreprocessor
)

DATA_DIR = Path(__file__).parent.parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"


def load_raw_dataset() -> pd.DataFrame:
    """Loads raw master dataset."""
    raw_path = DATA_DIR / "raw" / "ipo_master_raw.csv"
    if not raw_path.exists():
        raise FileNotFoundError(f"Missing raw master file at {raw_path}")
    return pd.read_csv(raw_path)


def load_processed_training_data() -> pd.DataFrame:
    """Loads processed training dataset with all engineered features."""
    train_path = PROCESSED_DIR / "ipo_training.csv"
    if not train_path.exists():
        raise FileNotFoundError(f"Missing processed training file at {train_path}")
    return pd.read_csv(train_path)


def load_features_and_targets() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Loads separated pre-IPO features and target DataFrames."""
    feat_path = PROCESSED_DIR / "ipo_features_preipo.csv"
    targ_path = PROCESSED_DIR / "ipo_targets.csv"
    
    if not feat_path.exists() or not targ_path.exists():
        raise FileNotFoundError("Missing processed feature or target files")
        
    X_df = pd.read_csv(feat_path)
    y_df = pd.read_csv(targ_path)
    return X_df, y_df


def get_train_val_test_datasets(
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    scale_numeric: bool = False
) -> Dict[str, Any]:
    """
    Returns chronologically partitioned and preprocessed training, validation, and test sets.
    """
    df = load_processed_training_data()
    train_df, val_df, test_df = chronological_train_val_test_split(
        df,
        date_column="ipo_open_date",
        train_ratio=train_ratio,
        val_ratio=val_ratio,
        test_ratio=test_ratio
    )
    
    # Initialize and fit preprocessor on training data only
    preprocessor = IPOPreprocessor()
    preprocessor.fit(train_df)
    
    train_proc = preprocessor.transform_features(train_df)
    val_proc = preprocessor.transform_features(val_df)
    test_proc = preprocessor.transform_features(test_df)
    
    feature_names = NUMERIC_FEATURE_COLUMNS + ["sector_encoded", "market_trend_encoded"]
    
    X_train = train_proc[feature_names].values
    X_val = val_proc[feature_names].values
    X_test = test_proc[feature_names].values
    
    y_train = train_df[TARGET_COLUMNS].values
    y_val = val_df[TARGET_COLUMNS].values
    y_test = test_df[TARGET_COLUMNS].values
    
    return {
        "train_df": train_df,
        "val_df": val_df,
        "test_df": test_df,
        "X_train": X_train,
        "X_val": X_val,
        "X_test": X_test,
        "y_train": y_train,
        "y_val": y_val,
        "y_test": y_test,
        "feature_names": feature_names,
        "target_names": TARGET_COLUMNS,
        "preprocessor": preprocessor
    }
