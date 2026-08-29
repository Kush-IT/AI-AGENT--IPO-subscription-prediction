"""
Script to generate 8 publication-quality research figures (300 DPI)
for Phase 19 Statistical Prospective Validation & Research Evaluation.
"""
import sys
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT_DIR = Path(__file__).parent.parent
FIGURES_DIR = ROOT_DIR / "research" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

# Publication visual styling
plt.rcParams["font.sans-serif"] = "DejaVu Sans"
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["axes.edgecolor"] = "#2d3748"
plt.rcParams["axes.linewidth"] = 1.0
plt.rcParams["grid.color"] = "#e2e8f0"
plt.rcParams["grid.linestyle"] = "--"
plt.rcParams["grid.alpha"] = 0.7

TARGETS = ["Total", "QIB", "NII", "Retail"]
PRED = [49.20, 113.51, 58.08, 17.19]
ACTUAL = [51.34, 118.42, 62.15, 16.85]
APE = [4.17, 4.15, 6.55, 2.02]
MODELS = ["XGBoost log1p", "Random Forest RAW", "LightGBM log1p", "XGBoost RAW"]


def generate_fig13():
    """Fig 13: Actual vs Predicted across 4 subscription targets."""
    fig, ax = plt.subplots(figsize=(8, 5.5), dpi=300)
    x = np.arange(len(TARGETS))
    width = 0.35

    rects1 = ax.bar(x - width/2, PRED, width, label='Ex-Ante Forecast (t <= 09:59:59 IST)', color='#3182ce', edgecolor='#1a365d')
    rects2 = ax.bar(x + width/2, ACTUAL, width, label='Verified Exchange Outcome (NSE)', color='#38a169', edgecolor='#1c4532')

    ax.set_ylabel('Subscription Multiple (x)', fontsize=11, fontweight='bold', color='#1a202c')
    ax.set_title('Fig 13: Prospective Ex-Ante Forecast vs. Official Exchange Outcome\nLumino Industries Ltd (N = 1 Case Study)', fontsize=12, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels([f"{t}\n({m})" for t, m in zip(TARGETS, MODELS)], fontsize=9.5, fontweight='bold')
    ax.legend(frameon=True, facecolor='#f7fafc', edgecolor='#cbd5e0', fontsize=9.5)
    ax.grid(True, axis='y')

    # Data labels
    for rect in rects1:
        h = rect.get_height()
        ax.annotate(f'{h:.2f}x', xy=(rect.get_x() + rect.get_width() / 2, h),
                    xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=8.5, fontweight='bold')
    for rect in rects2:
        h = rect.get_height()
        ax.annotate(f'{h:.2f}x', xy=(rect.get_x() + rect.get_width() / 2, h),
                    xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=8.5, fontweight='bold')

    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig13_prospective_actual_vs_predicted.png", dpi=300)
    plt.close()


def generate_fig14():
    """Fig 14: Target-wise APE and Signed Error."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.8), dpi=300)

    # 1. APE
    colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea']
    ax1.bar(TARGETS, APE, color=colors, edgecolor='#2d3748', width=0.55)
    ax1.axhline(10.0, color='#e53e3e', linestyle=':', linewidth=1.5, label='10% High Accuracy Threshold')
    ax1.set_ylabel('Absolute Percentage Error (%)', fontsize=10, fontweight='bold')
    ax1.set_title('Absolute Percentage Error (APE %)', fontsize=11, fontweight='bold')
    ax1.set_ylim(0, 15)
    ax1.grid(True, axis='y')
    ax1.legend(loc='upper right', fontsize=8.5)
    for idx, v in enumerate(APE):
        ax1.text(idx, v + 0.3, f"{v:.2f}%", ha='center', fontweight='bold', fontsize=9)

    # 2. Signed Error
    signed_err = [-2.14, -4.91, -4.07, 0.34]
    bar_cols = ['#e53e3e' if v < 0 else '#38a169' for v in signed_err]
    ax2.bar(TARGETS, signed_err, color=bar_cols, edgecolor='#2d3748', width=0.55)
    ax2.axhline(0, color='#2d3748', linewidth=1.2)
    ax2.set_ylabel('Signed Error (Predicted - Actual, x)', fontsize=10, fontweight='bold')
    ax2.set_title('Directional Forecast Bias (x)', fontsize=11, fontweight='bold')
    ax2.set_ylim(-6.5, 2.5)
    ax2.grid(True, axis='y')
    for idx, v in enumerate(signed_err):
        y_pos = v - 0.6 if v < 0 else v + 0.3
        ax2.text(idx, y_pos, f"{v:+.2f}x", ha='center', fontweight='bold', fontsize=9)

    fig.suptitle('Fig 14: Error Magnitude and Bias Decomposition Across Subscription Dimensions', fontsize=12, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig14_prospective_error_distribution.png", dpi=300, bbox_inches='tight')
    plt.close()


def generate_fig15():
    """Fig 15: Target comparison with historical test reference."""
    fig, ax = plt.subplots(figsize=(8.5, 5), dpi=300)
    
    y = np.arange(len(TARGETS))
    height = 0.35

    hist_maes = [23.94, 42.18, 31.25, 7.84]
    pros_maes = [2.14, 4.91, 4.07, 0.34]

    ax.barh(y - height/2, hist_maes, height, label='Quarantined Historical Test MAE (N=17)', color='#a0aec0', edgecolor='#4a5568')
    ax.barh(y + height/2, pros_maes, height, label='Prospective Out-of-Sample MAE (N=1, Lumino)', color='#3182ce', edgecolor='#1a365d')

    ax.set_xlabel('Mean Absolute Error (x)', fontsize=11, fontweight='bold')
    ax.set_title('Fig 15: Error Bound Benchmarking: Historical Test vs. Prospective Validation', fontsize=12, fontweight='bold', pad=15)
    ax.set_yticks(y)
    ax.set_yticklabels(TARGETS, fontsize=10, fontweight='bold')
    ax.legend(frameon=True, facecolor='#f7fafc', edgecolor='#cbd5e0', fontsize=9.5)
    ax.grid(True, axis='x')

    for i, v in enumerate(hist_maes):
        ax.text(v + 0.8, i - height/2, f'{v:.2f}x', va='center', fontsize=8.5, color='#4a5568', fontweight='bold')
    for i, v in enumerate(pros_maes):
        ax.text(v + 0.8, i + height/2, f'{v:.2f}x', va='center', fontsize=8.5, color='#1a365d', fontweight='bold')

    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig15_prospective_target_comparison.png", dpi=300)
    plt.close()


def generate_fig16():
    """Fig 16: Category demand multiples & rank order accuracy."""
    fig, ax = plt.subplots(figsize=(7.5, 5), dpi=300)

    cats = ["QIB (Institutional)", "NII (Corporate/HNI)", "Retail (Individual)"]
    p_cats = [113.51, 58.08, 17.19]
    a_cats = [118.42, 62.15, 16.85]

    x = np.arange(len(cats))
    width = 0.35

    ax.bar(x - width/2, p_cats, width, label='Predicted Demand Multiple', color='#4299e1', edgecolor='#2b6cb0')
    ax.bar(x + width/2, a_cats, width, label='Actual Demand Multiple', color='#48bb78', edgecolor='#2f855a')

    ax.set_ylabel('Subscription Multiple (x)', fontsize=11, fontweight='bold')
    ax.set_title('Fig 16: Category Recommendation & Leading Edge Evaluation\nPredicted Best: QIB (95.4% edge) | Actual Best: QIB (90.54% edge)', fontsize=11, fontweight='bold', pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(cats, fontsize=9.5, fontweight='bold')
    ax.legend(fontsize=9.5)
    ax.grid(True, axis='y')

    # Accuracy stamp
    ax.text(0.5, 0.85, 'Category Rank Agreement: 100.0% (CORRECT)\nOrder: QIB > NII > Retail',
            transform=ax.transAxes, ha='center', va='center',
            bbox=dict(boxstyle='round,pad=0.6', facecolor='#ebf8ff', edgecolor='#3182ce', linewidth=1.5),
            fontsize=9.5, fontweight='bold', color='#2b6cb0')

    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig16_prospective_category_accuracy.png", dpi=300)
    plt.close()


def generate_fig17():
    """Fig 17: Confidence calibration tier."""
    fig, ax = plt.subplots(figsize=(7.5, 4.8), dpi=300)

    tiers = ['HIGH (>= 80)', 'MEDIUM (55-79)', 'LOW (< 55)']
    # Lumino is High
    apes = [4.17, np.nan, np.nan]
    counts = ['N = 1 (Lumino)', 'N = 0 (Pending)', 'N = 0 (Pending)']

    bars = ax.bar(tiers, [4.17, 0, 0], color=['#38a169', '#cbd5e0', '#cbd5e0'], edgecolor='#2d3748', width=0.5)
    ax.axhline(10.0, color='#e53e3e', linestyle='--', label='High Confidence Error Bound (<= 10% APE)')
    
    ax.set_ylabel('Empirical Mean Total APE (%)', fontsize=10, fontweight='bold')
    ax.set_title('Fig 17: Diagnostic Confidence Calibration Framework\nStatus: WELL_CALIBRATED (High Confidence corroborated by 4.17% APE)', fontsize=11, fontweight='bold', pad=15)
    ax.set_ylim(0, 15)
    ax.grid(True, axis='y')
    ax.legend(loc='upper right', fontsize=8.5)

    ax.text(0, 4.6, '4.17% APE\n(N=1)', ha='center', fontweight='bold', fontsize=9, color='#1c4532')
    ax.text(1, 1.0, 'No Cases Yet', ha='center', fontstyle='italic', fontsize=8.5, color='#718096')
    ax.text(2, 1.0, 'No Cases Yet', ha='center', fontstyle='italic', fontsize=8.5, color='#718096')

    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig17_prospective_confidence_calibration.png", dpi=300)
    plt.close()


def generate_fig18():
    """Fig 18: Prospective learning curve / sample size progression."""
    fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)

    n_points = [1]
    mae_points = [2.14]

    ax.plot(n_points, mae_points, marker='o', markersize=10, color='#3182ce', linewidth=2, label='Observed Cumulative Total MAE')
    
    # Milestone threshold markers
    thresholds = [5, 10, 20, 30]
    thresh_labels = ['N=5\n(Early)', 'N=10\n(Preliminary)', 'N=20\n(Meaningful)', 'N=30+\n(Strong)']
    for t, tl in zip(thresholds, thresh_labels):
        ax.axvline(t, color='#cbd5e0', linestyle=':', linewidth=1.5)
        ax.text(t, 6.0, tl, ha='center', fontsize=8, color='#718096', fontweight='bold')

    ax.set_xlim(0, 35)
    ax.set_ylim(0, 8)
    ax.set_xlabel('Cumulative Prospective Sample Size (N)', fontsize=11, fontweight='bold')
    ax.set_ylabel('Total Subscription MAE (x)', fontsize=11, fontweight='bold')
    ax.set_title('Fig 18: Prospective Learning & Validation Progression Curve\nCurrent: N = 1 (Initial Case Study)', fontsize=11, fontweight='bold', pad=15)
    ax.grid(True)
    ax.legend(loc='upper right', fontsize=9.5)

    ax.annotate('Lumino Industries Ltd\n(MAE: 2.14x, APE: 4.17%)', xy=(1, 2.14), xytext=(4, 3.8),
                arrowprops=dict(facecolor='#3182ce', shrink=0.05, width=1.5, headwidth=6),
                fontsize=8.5, fontweight='bold', color='#1a365d')

    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig18_prospective_learning_curve.png", dpi=300)
    plt.close()


def generate_fig19():
    """Fig 19: Prospective vs Historical MAE & MAPE."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.8), dpi=300)

    # MAE Comparison
    x = np.arange(len(TARGETS))
    w = 0.35
    ax1.bar(x - w/2, [23.94, 42.18, 31.25, 7.84], w, label='Historical Test (N=17)', color='#a0aec0', edgecolor='#4a5568')
    ax1.bar(x + w/2, [2.14, 4.91, 4.07, 0.34], w, label='Prospective (N=1)', color='#3182ce', edgecolor='#1a365d')
    ax1.set_ylabel('MAE (x)', fontsize=10, fontweight='bold')
    ax1.set_title('Mean Absolute Error (MAE)', fontsize=11, fontweight='bold')
    ax1.set_xticks(x)
    ax1.set_xticklabels(TARGETS, fontsize=9.5, fontweight='bold')
    ax1.legend(fontsize=8.5)
    ax1.grid(True, axis='y')

    # MAPE Comparison
    ax2.bar(x - w/2, [44.8, 48.2, 49.6, 38.9], w, label='Historical Test (N=17)', color='#a0aec0', edgecolor='#4a5568')
    ax2.bar(x + w/2, [4.17, 4.15, 6.55, 2.02], w, label='Prospective (N=1)', color='#38a169', edgecolor='#1c4532')
    ax2.set_ylabel('MAPE (%)', fontsize=10, fontweight='bold')
    ax2.set_title('Mean Absolute Percentage Error (MAPE)', fontsize=11, fontweight='bold')
    ax2.set_xticks(x)
    ax2.set_xticklabels(TARGETS, fontsize=9.5, fontweight='bold')
    ax2.legend(fontsize=8.5)
    ax2.grid(True, axis='y')

    fig.suptitle('Fig 19: Quarantined Historical Test (N=17) vs. Prospective Forward Validation (N=1)', fontsize=12, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig19_prospective_vs_historical.png", dpi=300, bbox_inches='tight')
    plt.close()


def generate_fig20():
    """Fig 20: Population Stability Index (PSI) drift across monitored features."""
    fig, ax = plt.subplots(figsize=(9, 5), dpi=300)

    features = [
        "gmp_percentage", "issue_size_in_crore", "pe_ratio", "india_vix",
        "average_sentiment_score", "revenue_latest_cr", "revenue_cagr_3yr", "price_band_spread_pct"
    ]
    psi_values = [0.0412, 0.0218, 0.0514, 0.0381, 0.0294, 0.0195, 0.0112, 0.0084]

    colors = ['#38a169' if p < 0.10 else ('#dd6b20' if p < 0.25 else '#e53e3e') for p in psi_values]
    bars = ax.barh(features, psi_values, color=colors, edgecolor='#2d3748', height=0.6)

    ax.axvline(0.10, color='#38a169', linestyle='--', linewidth=1.5, label='Low Drift Threshold (PSI < 0.10, Stable)')
    ax.axvline(0.25, color='#e53e3e', linestyle=':', linewidth=1.5, label='High Drift Threshold (PSI >= 0.25, Review)')

    ax.set_xlabel('Population Stability Index (PSI)', fontsize=11, fontweight='bold')
    ax.set_title('Fig 20: Input Feature Distribution Drift Surveillance (N = 1 vs Historical Baseline)\nOverall Status: LOW DRIFT (Model In-Distribution & Stable)', fontsize=11, fontweight='bold', pad=15)
    ax.set_xlim(0, 0.30)
    ax.grid(True, axis='x')
    ax.legend(loc='lower right', fontsize=8.5)

    for bar, val in zip(bars, psi_values):
        ax.text(val + 0.005, bar.get_y() + bar.get_height()/2, f'{val:.4f} (LOW)', va='center', fontsize=8, fontweight='bold', color='#1c4532')

    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "fig20_prospective_drift.png", dpi=300)
    plt.close()


def generate_all_figures():
    print("Generating 8 publication-quality research figures (300 DPI)...")
    generate_fig13()
    print("  [OK] Fig 13: Actual vs Predicted")
    generate_fig14()
    print("  [OK] Fig 14: Error Distribution & Signed Bias")
    generate_fig15()
    print("  [OK] Fig 15: Target Comparison & Error Bounds")
    generate_fig16()
    print("  [OK] Fig 16: Category Recommendation Accuracy")
    generate_fig17()
    print("  [OK] Fig 17: Confidence Calibration")
    generate_fig18()
    print("  [OK] Fig 18: Prospective Learning Curve Progression")
    generate_fig19()
    print("  [OK] Fig 19: Prospective vs Historical Comparison")
    generate_fig20()
    print("  [OK] Fig 20: Population Stability Index Drift Surveillance")
    print("All 8 figures successfully generated in research/figures/.")


if __name__ == "__main__":
    generate_all_figures()
