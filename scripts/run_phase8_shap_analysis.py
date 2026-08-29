"""
Phase 8 SHAP Explainability & Model Interpretation Execution Engine.
Generates global feature rankings, local attributions for all test IPOs,
permutation vs SHAP comparisons, stability metrics, and high-resolution figures.
"""
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import shap

from backend.ml.explainer import SHAPExplainerEngine
from backend.ml.model_config import ABLATION_GROUPS
from backend.ml.features import TARGET_COLUMNS

DATA_DIR = ROOT_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
METADATA_DIR = DATA_DIR / "metadata"
FIGURES_DIR = ROOT_DIR / "docs" / "research" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)


def run_phase8_shap():
    print("================================================================")
    print("PHASE 8: SHAP EXPLAINABILITY & MODEL INTERPRETATION")
    print("================================================================")
    
    # 1. Initialize Explainer Engine
    engine = SHAPExplainerEngine()
    feature_cols = engine.feature_cols
    
    feat_df = pd.read_csv(PROCESSED_DIR / "ipo_features_preipo_v2.csv")
    targ_df = pd.read_csv(PROCESSED_DIR / "ipo_targets_v2.csv")
    merged = feat_df.merge(targ_df, on=["ipo_id", "company_name", "ipo_open_date"])
    sorted_df = merged.sort_values(by=["ipo_open_date", "ipo_id"]).reset_index(drop=True)
    
    dev_df = sorted_df.iloc[:89].copy().reset_index(drop=True)
    test_df = sorted_df.iloc[89:].copy().reset_index(drop=True)
    
    X_dev = engine.get_preprocessed_matrix(dev_df)
    X_test = engine.get_preprocessed_matrix(test_df)
    X_all = engine.get_preprocessed_matrix(sorted_df)
    
    # 2. Global Explanations & Rankings
    all_global_records = []
    all_rankings_records = []
    shap_matrices = {}
    
    for target in TARGET_COLUMNS:
        shap_vals_dev = engine.compute_shap_values(X_dev, target)
        shap_matrices[target] = shap_vals_dev
        
        mean_abs = np.mean(np.abs(shap_vals_dev), axis=0)
        mean_signed = np.mean(shap_vals_dev, axis=0)
        
        target_records = []
        for idx, f_name in enumerate(feature_cols):
            target_records.append({
                "target": target,
                "feature": f_name,
                "mean_abs_shap": round(float(mean_abs[idx]), 6),
                "mean_shap": round(float(mean_signed[idx]), 6)
            })
            
        target_records.sort(key=lambda x: x["mean_abs_shap"], reverse=True)
        for rank_idx, r in enumerate(target_records, 1):
            r["rank"] = rank_idx
            all_global_records.append(r)
            all_rankings_records.append({
                "target": target,
                "feature": r["feature"],
                "mean_abs_shap": r["mean_abs_shap"],
                "rank": rank_idx
            })
            
    global_imp_df = pd.DataFrame(all_global_records)
    global_imp_df.to_csv(METADATA_DIR / "shap_global_importance.csv", index=False)
    
    rankings_df = pd.DataFrame(all_rankings_records)
    rankings_df.to_csv(METADATA_DIR / "shap_feature_rankings.csv", index=False)
    
    print(f"Generated shap_global_importance.csv ({len(global_imp_df)} rows)")
    print(f"Generated shap_feature_rankings.csv ({len(rankings_df)} rows)")
    
    # 3. Local Explanations on Test Set (17 IPOs)
    local_records = []
    for _, row in test_df.iterrows():
        ipo_id = row["ipo_id"]
        c_name = row["company_name"]
        
        for target in TARGET_COLUMNS:
            exp = engine.explain_ipo_prediction(ipo_id, target)
            pred = exp["predicted_subscription"]
            
            for fa in exp["all_feature_attributions"]:
                local_records.append({
                    "ipo_id": ipo_id,
                    "company_name": c_name,
                    "target": target,
                    "prediction": pred,
                    "feature": fa["feature"],
                    "feature_value": fa["feature_value"],
                    "shap_value": fa["shap_value"],
                    "direction": fa["direction"],
                    "rank": fa["rank"]
                })
                
    local_df = pd.DataFrame(local_records)
    local_df.to_csv(METADATA_DIR / "shap_local_explanations.csv", index=False)
    print(f"Generated shap_local_explanations.csv ({len(local_df)} rows across 17 test IPOs)")
    
    # 4. SHAP vs Permutation Importance Comparison
    perm_csv_path = METADATA_DIR / "model_feature_importance.csv"
    if perm_csv_path.exists():
        perm_df = pd.read_csv(perm_csv_path)
        comparison_records = []
        
        for target in TARGET_COLUMNS:
            p_sub = perm_df[perm_df["target"] == target].sort_values(by="permutation_importance_mean", ascending=False).reset_index(drop=True)
            p_sub["permutation_rank"] = p_sub.index + 1
            p_map = dict(zip(p_sub["feature_name"], p_sub["permutation_rank"]))
            
            s_sub = global_imp_df[global_imp_df["target"] == target].copy()
            for _, s_row in s_sub.iterrows():
                f_name = s_row["feature"]
                p_rank = p_map.get(f_name, len(feature_cols))
                comparison_records.append({
                    "target": target,
                    "feature": f_name,
                    "permutation_rank": p_rank,
                    "shap_rank": s_row["rank"],
                    "mean_abs_shap": s_row["mean_abs_shap"]
                })
                
        comp_df = pd.DataFrame(comparison_records)
        comp_df.to_csv(METADATA_DIR / "importance_comparison.csv", index=False)
        print(f"Generated importance_comparison.csv ({len(comp_df)} rows)")
        
    # 5. Stability Analysis Across Temporal Folds
    # Evaluate feature importance across walk-forward validation folds
    from backend.ml.model_pipeline import generate_walk_forward_folds
    from backend.ml.hyperparameter_search import instantiate_model
    
    folds = generate_walk_forward_folds(dev_df, n_splits=4, min_train=50)
    stability_records = []
    
    for target in TARGET_COLUMNS:
        info = engine.metadata["selected_candidates"][target]
        m_name = info["model_name"]
        tf_mode = info["target_transform"]
        params = info["hyperparameters"]
        
        fold_importances = []
        for fold_idx, (train_idx, val_idx) in enumerate(folds, 1):
            train_data = dev_df.iloc[train_idx]
            val_data = dev_df.iloc[val_idx]
            
            preproc = engine.preprocessor
            X_tr = preproc.transform(train_data, feature_cols)
            X_va = preproc.transform(val_data, feature_cols)
            
            y_tr_raw = train_data[target].values
            y_tr = np.log1p(y_tr_raw) if tf_mode == "log1p" else y_tr_raw
            
            m = instantiate_model(m_name, params)
            m.fit(X_tr, y_tr)
            
            expl = shap.TreeExplainer(m)
            s_vals = expl.shap_values(X_va)
            if isinstance(s_vals, list):
                s_vals = s_vals[0]
            fold_importances.append(np.mean(np.abs(s_vals), axis=0))
            
        fold_imp_mat = np.array(fold_importances) # (4 folds, n_features)
        mean_imp = np.mean(fold_imp_mat, axis=0)
        std_imp = np.std(fold_imp_mat, axis=0, ddof=1)
        
        # Rank consistency = rank correlation or relative std
        for idx, f_name in enumerate(feature_cols):
            cv_score = (std_imp[idx] / mean_imp[idx]) if mean_imp[idx] > 1e-6 else 0.0
            consistency = "HIGH" if cv_score < 0.50 else ("MODERATE" if cv_score < 1.0 else "LOW")
            stability_records.append({
                "target": target,
                "feature": f_name,
                "mean_importance": round(float(mean_imp[idx]), 6),
                "std_importance": round(float(std_imp[idx]), 6),
                "rank_consistency": consistency
            })
            
    stab_df = pd.DataFrame(stability_records).sort_values(by=["target", "mean_importance"], ascending=[True, False])
    stab_df.to_csv(METADATA_DIR / "shap_stability.csv", index=False)
    print(f"Generated shap_stability.csv ({len(stab_df)} rows)")
    
    # 6. Generate High-Resolution Visualizations in docs/research/figures/
    print("Generating visual plots in docs/research/figures/...")
    
    # (A) Global Summary Bar Plots for Each Target
    for target in TARGET_COLUMNS:
        plt.figure(figsize=(10, 7))
        top15 = global_imp_df[global_imp_df["target"] == target].head(15)
        
        sns.barplot(data=top15, x="mean_abs_shap", y="feature", palette="Blues_r")
        plt.title(f"Global SHAP Feature Importance: {target.upper().replace('_', ' ')}", fontsize=13, weight='bold')
        plt.xlabel("Mean Absolute SHAP Value (Impact on Prediction)", fontsize=11)
        plt.ylabel("Predictive Feature", fontsize=11)
        plt.grid(True, alpha=0.3, axis='x')
        plt.tight_layout()
        plt.savefig(FIGURES_DIR / f"shap_summary_{target.replace('_subscription', '')}.png", dpi=300)
        plt.close()
        
    # (B) Category Comparison Bar Plot
    plt.figure(figsize=(14, 8))
    top_common = ["gmp_percentage", "price_band_spread_pct", "revenue_cagr_3yr", "issue_size_in_crore", "valuation_discount_pct", "roe_pct", "positive_news_ratio", "india_vix"]
    comp_sub = global_imp_df[global_imp_df["feature"].isin(top_common)]
    
    sns.barplot(data=comp_sub, x="feature", y="mean_abs_shap", hue="target", palette="Set2")
    plt.title("Cross-Category SHAP Attribution Comparison (QIB vs NII vs Retail vs Total)", fontsize=14, weight='bold')
    plt.xlabel("Key Predictive Features", fontsize=12)
    plt.ylabel("Mean |SHAP Value|", fontsize=12)
    plt.xticks(rotation=30)
    plt.grid(True, alpha=0.3, axis='y')
    plt.legend(title="Target Category", frameon=True)
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_importance_comparison.png", dpi=300)
    plt.close()
    
    # (C) Dependence Plots (GMP vs SHAP and Issue Size vs SHAP)
    # Total model dependence
    total_shap = shap_matrices["total_subscription"]
    gmp_idx = feature_cols.index("gmp_percentage")
    sz_idx = feature_cols.index("issue_size_in_crore")
    
    plt.figure(figsize=(9, 6))
    plt.scatter(X_dev[:, gmp_idx], total_shap[:, gmp_idx], color='teal', alpha=0.7, edgecolors='k')
    plt.axhline(0, color='gray', linestyle='--', alpha=0.7)
    plt.title("SHAP Dependence: Grey Market Premium (gmp_percentage) -> Total Subscription", fontsize=12, weight='bold')
    plt.xlabel("Grey Market Premium (%)", fontsize=11)
    plt.ylabel("SHAP Value (log-scale impact)", fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_dependence_gmp.png", dpi=300)
    plt.close()
    
    plt.figure(figsize=(9, 6))
    plt.scatter(X_dev[:, sz_idx], total_shap[:, sz_idx], color='crimson', alpha=0.7, edgecolors='k')
    plt.axhline(0, color='gray', linestyle='--', alpha=0.7)
    plt.title("SHAP Dependence: Total Offering Scale (issue_size_in_crore) -> Total Subscription", fontsize=12, weight='bold')
    plt.xlabel("Issue Size (INR Crore)", fontsize=11)
    plt.ylabel("SHAP Value (log-scale impact)", fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_dependence_issue_size.png", dpi=300)
    plt.close()
    
    # (D) Local Waterfall Sample Plot (e.g. Tata Technologies or First Test Sample)
    sample_exp = engine.explain_ipo_prediction("IPO_2024_001", "total_subscription")
    sample_top_pos = sample_exp["top_positive_contributors"]
    sample_top_neg = sample_exp["top_negative_contributors"]
    
    sample_features = [f["feature"] for f in sample_top_pos + sample_top_neg]
    sample_values = [f["shap_value"] for f in sample_top_pos + sample_top_neg]
    colors = ['seagreen' if v > 0 else 'crimson' for v in sample_values]
    
    plt.figure(figsize=(10, 6))
    y_pos = np.arange(len(sample_features))
    plt.barh(y_pos, sample_values, color=colors, edgecolor='k', alpha=0.8)
    plt.yticks(y_pos, sample_features)
    plt.axvline(0, color='black', lw=1)
    plt.title(f"Local SHAP Feature Attribution: {sample_exp['company_name']} (Total Subscription)", fontsize=12, weight='bold')
    plt.xlabel("SHAP Value (Contribution to Log Prediction)", fontsize=11)
    plt.grid(True, alpha=0.3, axis='x')
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_waterfall_sample.png", dpi=300)
    plt.close()
    
    print("All figures successfully saved in docs/research/figures/")
    print("\nPhase 8 SHAP Analysis Complete.")


if __name__ == "__main__":
    run_phase8_shap()
