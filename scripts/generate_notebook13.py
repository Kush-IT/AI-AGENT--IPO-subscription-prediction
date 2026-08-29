"""
Script to create notebooks/13_shap_analysis.ipynb.
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
    make_md("# Notebook 13: SHAP Explainability & Model Interpretation\n## Global Additive Attributions, Dependence Dynamics, and Local IPO Explanations across QIB, NII, Retail, and Total Models"),
    make_code("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import shap
from pathlib import Path
import joblib

DATA_DIR = Path("../data")
METADATA_DIR = DATA_DIR / "metadata"
MODELS_DIR = Path("../models/final_candidates")

# Load SHAP metadata
global_imp = pd.read_csv(METADATA_DIR / "shap_global_importance.csv")
rankings = pd.read_csv(METADATA_DIR / "shap_feature_rankings.csv")
local_exp = pd.read_csv(METADATA_DIR / "shap_local_explanations.csv")
comp_df = pd.read_csv(METADATA_DIR / "importance_comparison.csv")
stability_df = pd.read_csv(METADATA_DIR / "shap_stability.csv")

print(f"Loaded global rankings for {rankings['target'].nunique()} targets.")
print(f"Loaded {len(local_exp)} local feature attributions across 17 test IPOs.")"""),
    make_md("### 1. Top 10 Global SHAP Feature Importances by Target Category"),
    make_code("""for t in rankings["target"].unique():
    print(f"\\n================ TOP 10 FEATURES: {t.upper()} ================")
    top10 = rankings[rankings["target"] == t].head(10)[["rank", "feature", "mean_abs_shap"]]
    print(top10.to_string(index=False))"""),
    make_md("### 2. Cross-Category Feature Attribution Comparison"),
    make_code("""plt.figure(figsize=(14, 7))
top_common = ["gmp_percentage", "price_band_spread_pct", "revenue_cagr_3yr", "issue_size_in_crore", "valuation_discount_pct", "roe_pct", "positive_news_ratio", "india_vix"]
comp_sub = global_imp[global_imp["feature"].isin(top_common)]

sns.barplot(data=comp_sub, x="feature", y="mean_abs_shap", hue="target", palette="Set2")
plt.title("Cross-Category SHAP Attribution Comparison", fontsize=14, weight='bold')
plt.xlabel("Predictive Feature", fontsize=12)
plt.ylabel("Mean |SHAP Value|", fontsize=12)
plt.xticks(rotation=30)
plt.grid(True, alpha=0.3, axis='y')
plt.legend(title="Target Category")
plt.tight_layout()
plt.show()"""),
    make_md("### 3. Local SHAP Attribution for Individual Test IPOs"),
    make_code("""# Inspect sample test IPO
sample_ipo = "IPO_2024_001"
sample_rows = local_exp[(local_exp["ipo_id"] == sample_ipo) & (local_exp["target"] == "total_subscription")]

top_pos = sample_rows[sample_rows["direction"] == "positive"].head(5)
top_neg = sample_rows[sample_rows["direction"] == "negative"].head(5)

print(f"Company: {sample_rows['company_name'].iloc[0]} (Predicted: {sample_rows['prediction'].iloc[0]}x)")
print("\\nTop Positive Contributors:")
print(top_pos[["feature", "feature_value", "shap_value"]])

print("\\nTop Negative Contributors:")
print(top_neg[["feature", "feature_value", "shap_value"]])"""),
    make_md("### 4. Permutation vs SHAP Rank Consistency"),
    make_code("""plt.figure(figsize=(10, 6))
sns.scatterplot(data=comp_df, x="permutation_rank", y="shap_rank", hue="target", alpha=0.8, s=70)
plt.plot([1, 45], [1, 45], 'k--', lw=1.5, label="Ideal Concordance (y=x)")
plt.title("Rank Concordance: Permutation Importance vs SHAP Importance", fontsize=13, weight='bold')
plt.xlabel("Permutation Importance Rank", fontsize=11)
plt.ylabel("SHAP Global Importance Rank", fontsize=11)
plt.grid(True, alpha=0.3)
plt.legend()
plt.tight_layout()
plt.show()""")
]

with open(NOTEBOOKS_DIR / "13_shap_analysis.ipynb", "w", encoding="utf-8") as f:
    json.dump(make_notebook(cells), f, indent=2)

print("Created notebooks/13_shap_analysis.ipynb")
