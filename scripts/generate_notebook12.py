"""
Script to create notebooks/12_baseline_models.ipynb.
"""
from pathlib import Path
import json

NOTEBOOKS_DIR = Path(__file__).parent.parent / "notebooks"

def make_notebook(cells):
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.14.7"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 5
    }

def make_md(source):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [s + "\n" for s in source.split("\n")]
    }

def make_code(source):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [s + "\n" for s in source.split("\n")]
    }

cells = [
    make_md("# Notebook 12: Baseline ML Modeling & Target Transformation Benchmarks\n## Empirical Evaluation across 7 Model Families, 4 Walk-Forward Folds, and 7 Ablation Groups"),
    make_code("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

DATA_DIR = Path("../data")
METADATA_DIR = DATA_DIR / "metadata"

summary_df = pd.read_csv(METADATA_DIR / "baseline_model_summary.csv")
results_df = pd.read_csv(METADATA_DIR / "baseline_model_results.csv")
val_preds = pd.read_csv(METADATA_DIR / "validation_predictions.csv")
ablation_df = pd.read_csv(METADATA_DIR / "ablation_results.csv")

print(f"Loaded {len(results_df)} fold evaluations and {len(val_preds)} validation predictions.")"""),
    make_md("### 1. Overall Baseline Summary Metrics by Target"),
    make_code("""summary_df.sort_values(by=["target", "mean_MAE"])"""),
    make_md("### 2. Actual vs. Predicted Subscription Multiples (Best Models)"),
    make_code("""fig, axes = plt.subplots(2, 2, figsize=(14, 12))
axes = axes.flatten()

targets = ["total_subscription", "qib_subscription", "nii_subscription", "retail_subscription"]

for idx, t in enumerate(targets):
    sub_preds = val_preds[(val_preds["target"] == t) & (val_preds["model"] == "XGBoost") & (val_preds["target_transform"] == "log1p")]
    
    axes[idx].scatter(sub_preds["actual"], sub_preds["predicted"], color='crimson', alpha=0.6, edgecolors='k')
    max_val = max(sub_preds["actual"].max(), sub_preds["predicted"].max())
    axes[idx].plot([0, max_val], [0, max_val], 'k--', lw=1.5, label="Ideal Line (y=x)")
    axes[idx].set_title(f"XGBoost (log1p): {t} (MAE: {sub_preds['absolute_error'].mean():.2f})")
    axes[idx].set_xlabel("Actual Subscription (times)")
    axes[idx].set_ylabel("Predicted Subscription (times)")
    axes[idx].grid(True, alpha=0.3)
    axes[idx].legend()

plt.tight_layout()
plt.show()"""),
    make_md("### 3. Model Comparison: RAW vs. log1p Target Transformation"),
    make_code("""plt.figure(figsize=(12, 6))
sns.barplot(data=summary_df[summary_df["target"] == "total_subscription"], x="model", y="mean_MAE", hue="target_transform", palette="muted")
plt.title("Total Subscription: Mean MAE by Model (RAW vs log1p)")
plt.xlabel("Model Family")
plt.ylabel("Mean Walk-Forward MAE (times)")
plt.xticks(rotation=30)
plt.grid(True, alpha=0.3, axis='y')
plt.show()"""),
    make_md("### 4. Feature Group Ablation Progression"),
    make_code("""plt.figure(figsize=(14, 6))
sns.lineplot(data=ablation_df, x="feature_group", y="mean_MAE", hue="model", style="target", markers=True, dashes=False)
plt.title("Feature Ablation Lift: Progression from Group A to Group G")
plt.xlabel("Ablation Feature Group")
plt.ylabel("Mean MAE (times)")
plt.xticks(rotation=35)
plt.grid(True, alpha=0.3)
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()""")
]

with open(NOTEBOOKS_DIR / "12_baseline_models.ipynb", "w", encoding="utf-8") as f:
    json.dump(make_notebook(cells), f, indent=2)

print("Created notebooks/12_baseline_models.ipynb")
