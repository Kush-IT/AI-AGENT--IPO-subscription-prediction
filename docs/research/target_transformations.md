# Target Variable Distribution & Transformation Analysis

## 1. Research Motivation & Theoretical Context
In IPO subscription forecasting, category subscription multiples (\(Y_{\text{QIB}}, Y_{\text{NII}}, Y_{\text{Retail}}, Y_{\text{Total}}\)) represent non-negative demand multiples bounded below at zero (\(y \ge 0\)). In empirical financial markets, institutional and retail bidding often exhibit heavy positive skewness, acute right-tail kurtosis, and extreme oversubscription events (e.g. \(> 100\times\) to \(> 900\times\) oversubscription).

Training standard regression loss functions (such as Mean Squared Error or Ridge/Lasso penalties) directly on raw, unadjusted subscription multiples exposes predictive estimators to:
1. **Severe Sensitivity to Outliers**: Squared loss disproportionately penalizes rare extreme offerings (e.g. *Latent View Analytics* at \(326.5\times\) or *Paras Defence* at \(304.3\times\)), skewing linear coefficients toward extreme high-demand observations.
2. **Heteroscedasticity**: Error variance increases with the scale of the subscription multiple.
3. **Violations of Normality**: Residuals of linear models on raw multiples deviate substantially from Gaussian distributions.

To address these challenges, we evaluate the monotonic natural logarithmic transformation:
\[
\tilde{y} = \log(1 + y) \quad \iff \quad y = \exp(\tilde{y}) - 1
\]
The \(\log(1+y)\) operator preserves zero values (\(\log(1+0) = 0\)) while compressing variance in high-multiple regimes.

---

## 2. Empirical Statistical Comparison: RAW vs. \(\log(1+y)\)

Based on our verified historical dataset of **106 Indian Mainboard IPOs (2021–2024)**, the distribution parameters for raw and transformed targets are summarized below:

| Target Variable | Scale | Mean | Median | Std Dev | Min | Max | IQR | Skewness | Kurtosis |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **QIB Subscription** | **RAW** | 87.37 | 82.75 | 66.86 | 1.26 | 228.91 | 119.46 | **+0.27** | **-1.20** |
| | **\(\log(1+y)\)** | 3.91 | 4.43 | 1.35 | 0.82 | 5.44 | 2.16 | **-0.90** | **-0.58** |
| **NII Subscription** | **RAW** | 107.93 | 38.33 | 166.45 | 0.23 | 927.70 | 110.37 | **+2.74** | **+8.64** |
| | **\(\log(1+y)\)** | 3.58 | 3.67 | 1.70 | 0.21 | 6.83 | 2.68 | **-0.28** | **-0.79** |
| **Retail Subscription** | **RAW** | 28.33 | 10.99 | 50.42 | 0.11 | 374.81 | 24.38 | **+4.20** | **+22.32** |
| | **\(\log(1+y)\)** | 2.54 | 2.48 | 1.28 | 0.10 | 5.93 | 1.90 | **+0.28** | **-0.52** |
| **Total Subscription** | **RAW** | 62.72 | 44.89 | 60.54 | 0.70 | 326.49 | 69.17 | **+1.68** | **+4.05** |
| | **\(\log(1+y)\)** | 3.56 | 3.83 | 1.30 | 0.53 | 5.79 | 1.84 | **-0.69** | **-0.54** |

---

## 3. Key Findings & Diagnostic Insights

### 1. Massive Kurtosis and Skewness Dampening in Retail & NII
- **Retail Subscription**: Raw retail demand exhibits extreme skewness (\(+4.20\)) and severe leptokurtosis (kurtosis \(+22.32\)). Under \(\log(1+y)\), skewness plummets by **\(93.3\%\)** to \(+0.28\), and kurtosis normalizes to \(-0.52\).
- **NII Subscription**: High net-worth bidding (often driven by leveraged NBFC IPO funding) shows raw skewness of \(+2.74\) and kurtosis of \(+8.64\). Transformation stabilizes skewness to \(-0.28\) (an **\(89.8\%\)** reduction) and kurtosis to \(-0.79\).

### 2. Institutional (QIB) Bidding Behavior
- Raw QIB subscription displays a relatively symmetric, bimodal distribution (mean \(87.37\times\), median \(82.75\times\), skewness \(+0.27\)).
- Log-transformation introduces mild negative skewness (\(-0.90\)) due to compressing the wide upper plateau of fully anchored institutional demand.

### 3. Model Architecture Implications
- **Linear / Ridge / ElasticNet Models**: Highly recommended to train on \(\log(1+y)\) targets with MSE loss to prevent gradient explosion and outlier dominance, then invert predictions via \(\hat{y} = \exp(\hat{\tilde{y}}) - 1\).
- **Tree-Based Ensembles (Gradient Boosting / Random Forest / XGBoost / LightGBM)**: Invariant to monotonic target transformations under ranking, but gradient variance and leaf splits converge faster with lower variance on \(\log(1+y)\).
- **Evaluation Metrics**: Models should be evaluated on both:
  - **Transformed Scale**: RMSE / MAE on \(\log(1+y)\) space.
  - **Natural Scale**: Mean Absolute Error (MAE), Median Absolute Error (MedAE), and Symmetric Mean Absolute Percentage Error (sMAPE) on inverted \(\hat{y}\) multiples.

---

## 4. Methodological Policy
We do **not** prematurely enforce \(\log(1+y)\) as a rigid global mandate across all future baselines. In subsequent ML phases (Phase 6–8), empirical benchmarking will compare model performance natively trained on RAW targets vs. \(\log(1+y)\) transformed targets across expanding walk-forward cross-validation folds.
