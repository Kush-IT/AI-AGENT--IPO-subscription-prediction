"""
Temporal Splitting and Walk-Forward Partitioning Subsystem.
Enforces strict chronological train/validation/test partitions with zero lookahead bias.
"""
from typing import Tuple, List, Generator
import pandas as pd
import numpy as np


def chronological_train_val_test_split(
    df: pd.DataFrame,
    date_column: str = "ipo_open_date",
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Splits DataFrame chronologically into train, validation, and test sets.
    Strictly forbids random shuffling.
    
    Returns:
        (train_df, val_df, test_df)
    """
    assert date_column in df.columns, f"Date column {date_column} missing from DataFrame"
    assert np.isclose(train_ratio + val_ratio + test_ratio, 1.0), "Split ratios must sum to 1.0"
    
    # 1. Sort strictly in ascending chronological order
    sorted_df = df.sort_values(by=date_column, ascending=True).reset_index(drop=True)
    n_total = len(sorted_df)
    
    n_train = int(n_total * train_ratio)
    n_val = int(n_total * val_ratio)
    
    # Ensure minimum split sizes
    if n_train == 0:
        n_train = max(1, n_total - 2)
    if n_val == 0 and n_total >= 3:
        n_val = 1
        
    train_df = sorted_df.iloc[:n_train].copy().reset_index(drop=True)
    val_df = sorted_df.iloc[n_train:n_train + n_val].copy().reset_index(drop=True)
    test_df = sorted_df.iloc[n_train + n_val:].copy().reset_index(drop=True)
    
    # 2. Strict Temporal Integrity Invariant Assertions
    if len(train_df) > 0 and len(val_df) > 0:
        max_train_date = train_df[date_column].max()
        min_val_date = val_df[date_column].min()
        assert max_train_date <= min_val_date, (
            f"Temporal Leakage! Max train date ({max_train_date}) > Min val date ({min_val_date})"
        )
        
    if len(val_df) > 0 and len(test_df) > 0:
        max_val_date = val_df[date_column].max()
        min_test_date = test_df[date_column].min()
        assert max_val_date <= min_test_date, (
            f"Temporal Leakage! Max val date ({max_val_date}) > Min test date ({min_test_date})"
        )
        
    return train_df, val_df, test_df


def walk_forward_temporal_cv(
    df: pd.DataFrame,
    date_column: str = "ipo_open_date",
    n_splits: int = 3,
    min_train_size: int = 5
) -> Generator[Tuple[np.ndarray, np.ndarray], None, None]:
    """
    Generates expanding-window walk-forward cross-validation splits.
    For each fold:
      Train indices: [0, ... t]
      Test indices:  [t, ... t + step]
    """
    sorted_df = df.sort_values(by=date_column, ascending=True).reset_index(drop=True)
    n_total = len(sorted_df)
    
    if n_total <= min_train_size:
        yield np.arange(n_total - 1), np.array([n_total - 1])
        return
        
    test_chunk_size = max(1, (n_total - min_train_size) // n_splits)
    
    for i in range(n_splits):
        train_end = min_train_size + i * test_chunk_size
        test_end = min(train_end + test_chunk_size, n_total) if i < n_splits - 1 else n_total
        
        train_idx = np.arange(0, train_end)
        test_idx = np.arange(train_end, test_end)
        
        if len(test_idx) > 0:
            yield train_idx, test_idx
