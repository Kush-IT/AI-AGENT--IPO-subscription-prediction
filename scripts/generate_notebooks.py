"""
Programmatic Generator for Phase 5 Jupyter Notebooks:
- notebooks/08_final_eda.ipynb
- notebooks/09_target_transformations.ipynb
- notebooks/10_feature_engineering.ipynb
- notebooks/11_temporal_analysis.ipynb
"""
from pathlib import Path
import json

NOTEBOOKS_DIR = Path(__file__).parent.parent / "notebooks"
NOTEBOOKS_DIR.mkdir(parents=True, exist_ok=True)


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


def make_md_cell(source):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [s + "\n" for s in source.split("\n")]
    }


def make_code_cell(source):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [s + "\n" for s in source.split("\n")]
    }


def create_all_notebooks():
    # -------------------------------------------------------------
    # 1. 08_final_eda.ipynb
    # -------------------------------------------------------------
    nb08_cells = [
        make_md_cell("# Notebook 08: Final Exploratory Data Analysis (EDA)\n## Pre-IPO Subscription Forecasting for Indian Mainboard IPOs (106 Verified Records)"),
        make_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import scipy.stats as stats

DATA_DIR = Path("../data")
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"

# Load V2 processed datasets
features_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
targets_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
merged_df = features_df.merge(targets_df, on=["ipo_id", "company_name", "ipo_open_date"])

print(f"Loaded {len(merged_df)} verified IPO observations.")
print(f"Features count: {features_df.shape[1]}, Targets count: {targets_df.shape[1]}")"""),
        make_md_cell("### 1. Target Variables Summary Statistics"),
        make_code_cell("""target_cols = ["qib_subscription", "nii_subscription", "retail_subscription", "total_subscription"]
stats_summary = []

for t in target_cols:
    vals = merged_df[t].values
    q1, q3 = np.percentile(vals, 25), np.percentile(vals, 75)
    stats_summary.append({
        "Target": t,
        "Mean": np.mean(vals),
        "Std": np.std(vals, ddof=1),
        "Min": np.min(vals),
        "Q1 (25%)": q1,
        "Median": np.median(vals),
        "Q3 (75%)": q3,
        "Max": np.max(vals),
        "IQR": q3 - q1,
        "Skewness": stats.skew(vals),
        "Kurtosis": stats.kurtosis(vals)
    })

pd.DataFrame(stats_summary).set_index("Target")"""),
        make_md_cell("### 2. Target Variable Empirical Cumulative Distributions (ECDF)"),
        make_code_cell("""fig, axes = plt.subplots(2, 2, figsize=(14, 10))
axes = axes.flatten()

for idx, t in enumerate(target_cols):
    vals = np.sort(merged_df[t].values)
    ecdf = np.arange(1, len(vals) + 1) / len(vals)
    axes[idx].plot(vals, ecdf, marker='.', linestyle='none', color='navy')
    axes[idx].set_title(f"ECDF: {t}")
    axes[idx].set_xlabel("Subscription Multiple (times)")
    axes[idx].set_ylabel("Cumulative Probability")
    axes[idx].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()"""),
        make_md_cell("### 3. Sector-Wise Subscription Profiles"),
        make_code_cell("""sector_grp = merged_df.groupby("sector")[target_cols].agg(["count", "median"])
print("Sector breakdown with median subscription multiples:")
sector_grp"""),
        make_md_cell("### 4. Correlation Analysis (Pearson & Spearman vs Targets)"),
        make_code_cell("""num_cols = [
    "issue_size_in_crore", "price_high", "pe_ratio", "debt_equity_ratio", 
    "roe_pct", "gmp_percentage", "india_vix", "previous_general_avg_subscription"
]

corr_pearson = merged_df[num_cols + target_cols].corr(method="pearson").loc[num_cols, target_cols]
corr_spearman = merged_df[num_cols + target_cols].corr(method="spearman").loc[num_cols, target_cols]

print("--- Spearman Rank Correlation with Targets ---")
corr_spearman""")
    ]
    with open(NOTEBOOKS_DIR / "08_final_eda.ipynb", "w", encoding="utf-8") as f:
        json.dump(make_notebook(nb08_cells), f, indent=2)

    # -------------------------------------------------------------
    # 2. 09_target_transformations.ipynb
    # -------------------------------------------------------------
    nb09_cells = [
        make_md_cell("# Notebook 09: Target Variable Transformations\n## Comparative Evaluation: RAW Multiples vs log1p Transformed Multiples"),
        make_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats
from pathlib import Path

targets_df = pd.read_csv(Path("../data/processed/ipo_targets_v2.csv"))
target_cols = ["qib_subscription", "nii_subscription", "retail_subscription", "total_subscription"]"""),
        make_md_cell("### 1. Skewness and Kurtosis Reduction Analysis"),
        make_code_cell("""comparison = []
for t in target_cols:
    raw = targets_df[t].values
    log_t = targets_df[f"log_{t}"].values
    
    comparison.append({
        "Target": t,
        "Raw Mean": round(np.mean(raw), 2),
        "Raw Median": round(np.median(raw), 2),
        "Raw Skewness": round(stats.skew(raw), 2),
        "Raw Kurtosis": round(stats.kurtosis(raw), 2),
        "Log1p Skewness": round(stats.skew(log_t), 2),
        "Log1p Kurtosis": round(stats.kurtosis(log_t), 2),
        "Skewness Reduction (%)": round((abs(stats.skew(raw)) - abs(stats.skew(log_t))) / abs(stats.skew(raw)) * 100, 1)
    })

pd.DataFrame(comparison).set_index("Target")"""),
        make_md_cell("### 2. Side-by-Side Distribution Histograms"),
        make_code_cell("""fig, axes = plt.subplots(4, 2, figsize=(14, 16))

for idx, t in enumerate(target_cols):
    # Raw
    axes[idx, 0].hist(targets_df[t], bins=25, color='steelblue', edgecolor='black', alpha=0.7)
    axes[idx, 0].set_title(f"RAW: {t} (Skew: {stats.skew(targets_df[t]):.2f})")
    axes[idx, 0].set_xlabel("Subscription Multiple (times)")
    axes[idx, 0].grid(True, alpha=0.3)
    
    # Log1p
    axes[idx, 1].hist(targets_df[f"log_{t}"], bins=25, color='seagreen', edgecolor='black', alpha=0.7)
    axes[idx, 1].set_title(f"LOG1P: log_{t} (Skew: {stats.skew(targets_df[f'log_{t}'] secret:=):.2f})".replace(" secret:=", ""))
    axes[idx, 1].set_xlabel("log(1 + y)")
    axes[idx, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()"""),
        make_md_cell("### 3. Quantile-Quantile (Q-Q) Normality Diagnostics"),
        make_code_cell("""fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.flatten()

for idx, t in enumerate(target_cols):
    stats.probplot(targets_df[f"log_{t}"], dist="norm", plot=axes[idx])
    axes[idx].set_title(f"Normal Q-Q Plot: log_{t}")
    axes[idx].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()""")
    ]
    with open(NOTEBOOKS_DIR / "09_target_transformations.ipynb", "w", encoding="utf-8") as f:
        json.dump(make_notebook(nb09_cells), f, indent=2)

    # -------------------------------------------------------------
    # 3. 10_feature_engineering.ipynb
    # -------------------------------------------------------------
    nb10_cells = [
        make_md_cell("# Notebook 10: Feature Engineering Pipeline\n## Ex-Ante Reproducible Engineering & Ablation Feature Groups"),
        make_code_cell("""import pandas as pd
import numpy as np
import json
from pathlib import Path

DATA_DIR = Path("../data")
features_df = pd.read_csv(DATA_DIR / "processed/ipo_features_preipo_v2.csv")
registry_df = pd.read_csv(DATA_DIR / "metadata/feature_engineering_registry.csv")
redundancy_df = pd.read_csv(DATA_DIR / "metadata/feature_redundancy_report.csv")

with open(DATA_DIR / "metadata/feature_groups.json", "r") as f:
    groups = json.load(f)

print(f"Total features registered in V2: {features_df.shape[1]}")
print(f"Ablation feature groups: {list(groups.keys())}")"""),
        make_md_cell("### 1. Feature Engineering Registry & Lineage"),
        make_code_cell("""registry_df"""),
        make_md_cell("### 2. High Collinearity & Redundancy Audit"),
        make_code_cell("""high_collinear = redundancy_df[redundancy_df["possible_redundancy"] == "HIGH"]
print(f"Found {len(high_collinear)} highly correlated feature pairs (|r| >= 0.85):")
high_collinear"""),
        make_md_cell("### 3. Ablation Experiment Groups Overview"),
        make_code_cell("""for g_name, cols in groups.items():
    print(f"Group '{g_name}' ({len(cols)} features):")
    print(f"  {', '.join(cols[:5])}...")""")
    ]
    with open(NOTEBOOKS_DIR / "10_feature_engineering.ipynb", "w", encoding="utf-8") as f:
        json.dump(make_notebook(nb10_cells), f, indent=2)

    # -------------------------------------------------------------
    # 4. 11_temporal_analysis.ipynb
    # -------------------------------------------------------------
    nb11_cells = [
        make_md_cell("# Notebook 11: Temporal Distribution Analysis\n## Macro Regime Evolution across 2021–2024 Indian IPOs"),
        make_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

features_df = pd.read_csv(Path("../data/processed/ipo_features_preipo_v2.csv"))
targets_df = pd.read_csv(Path("../data/processed/ipo_targets_v2.csv"))
merged = features_df.merge(targets_df, on=["ipo_id", "company_name", "ipo_open_date"])

merged["year"] = pd.to_datetime(merged["ipo_open_date"]).dt.year
print(f"Total historical observations: {len(merged)}")"""),
        make_md_cell("### 1. Yearly IPO Activity and Median Subscription Multiples"),
        make_code_cell("""yearly_stats = merged.groupby("year").agg(
    ipo_count=("ipo_id", "count"),
    median_qib=("qib_subscription", "median"),
    median_nii=("nii_subscription", "median"),
    median_retail=("retail_subscription", "median"),
    median_total=("total_subscription", "median"),
    median_issue_size=("issue_size_in_crore", "median"),
    median_vix=("india_vix", "median")
)
yearly_stats"""),
        make_md_cell("### 2. Temporal Boxplot of Total Subscription Across Market Regimes"),
        make_code_cell("""plt.figure(figsize=(10, 6))
sns.boxplot(data=merged, x="year", y="total_subscription", palette="Set2")
plt.title("Distribution of Total Subscription Multiples (2021 - 2024)")
plt.xlabel("Listing Year")
plt.ylabel("Total Subscription (times)")
plt.grid(True, alpha=0.3)
plt.show()"""),
        make_md_cell("### 3. Chronological Train / Val / Test Partition Verification"),
        make_code_cell("""with open(Path("../data/metadata/dataset_version.json"), "r") as f:
    meta = json.load(f)

print("Chronological Partitions Summary:")
print(json.dumps(meta["chronological_partitions"], indent=2))""")
    ]
    with open(NOTEBOOKS_DIR / "11_temporal_analysis.ipynb", "w", encoding="utf-8") as f:
        json.dump(make_notebook(nb11_cells), f, indent=2)

    print("Generated all 4 Jupyter notebooks in notebooks/:")
    print("  - 08_final_eda.ipynb")
    print("  - 09_target_transformations.ipynb")
    print("  - 10_feature_engineering.ipynb")
    print("  - 11_temporal_analysis.ipynb")


if __name__ == "__main__":
    create_all_notebooks()
