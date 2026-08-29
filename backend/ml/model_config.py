"""
Model Configurations and Hyperparameters for Phase 6 Baseline Benchmarking.
Centralizes standard configurations for classical linear, tree-based, and gradient boosted models.
"""
from typing import Dict, Any
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.dummy import DummyRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

RANDOM_STATE = 42

# Centralized baseline model registry
def get_baseline_models() -> Dict[str, Any]:
    """Returns initialized baseline models with controlled random states."""
    return {
        "Mean_Predictor": DummyRegressor(strategy="mean"),
        "Median_Predictor": DummyRegressor(strategy="median"),
        "Linear_Regression": LinearRegression(),
        "Ridge_Regression": Ridge(alpha=1.0, random_state=RANDOM_STATE),
        "Random_Forest": RandomForestRegressor(
            n_estimators=100,
            max_depth=5,
            min_samples_split=4,
            min_samples_leaf=2,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        "XGBoost": XGBRegressor(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=RANDOM_STATE,
            verbosity=0
        ),
        "LightGBM": LGBMRegressor(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=RANDOM_STATE,
            verbose=-1
        )
    }

# 7-stage ablation feature group definitions
ABLATION_GROUPS = {
    "Group_A_IPO_Structure": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct"
    ],
    "Group_B_Structure_Fundamentals": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct",
        "revenue_latest_cr", "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr",
        "ebitda_margin_pct", "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio", "operating_cash_flow_cr"
    ],
    "Group_C_Plus_Valuation": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct",
        "revenue_latest_cr", "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr",
        "ebitda_margin_pct", "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio", "operating_cash_flow_cr",
        "pe_ratio", "pb_ratio", "industry_pe", "valuation_discount_pct"
    ],
    "Group_D_Plus_Market": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct",
        "revenue_latest_cr", "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr",
        "ebitda_margin_pct", "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio", "operating_cash_flow_cr",
        "pe_ratio", "pb_ratio", "industry_pe", "valuation_discount_pct",
        "nifty_1d_return", "nifty_5d_return", "nifty_20d_return", "sensex_1d_return", "sensex_5d_return", "sensex_20d_return",
        "india_vix", "india_vix_5d_change", "market_trend"
    ],
    "Group_E_Plus_Historical_Demand": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct",
        "revenue_latest_cr", "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr",
        "ebitda_margin_pct", "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio", "operating_cash_flow_cr",
        "pe_ratio", "pb_ratio", "industry_pe", "valuation_discount_pct",
        "nifty_1d_return", "nifty_5d_return", "nifty_20d_return", "sensex_1d_return", "sensex_5d_return", "sensex_20d_return",
        "india_vix", "india_vix_5d_change", "market_trend",
        "previous_sector_avg_subscription", "previous_general_avg_subscription"
    ],
    "Group_F_Plus_Sentiment_GMP": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct",
        "revenue_latest_cr", "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr",
        "ebitda_margin_pct", "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio", "operating_cash_flow_cr",
        "pe_ratio", "pb_ratio", "industry_pe", "valuation_discount_pct",
        "nifty_1d_return", "nifty_5d_return", "nifty_20d_return", "sensex_1d_return", "sensex_5d_return", "sensex_20d_return",
        "india_vix", "india_vix_5d_change", "market_trend",
        "previous_sector_avg_subscription", "previous_general_avg_subscription",
        "gmp_in_inr", "gmp_percentage", "news_count", "average_sentiment_score", "positive_news_ratio", "negative_news_ratio"
    ],
    "Group_G_All_Features_Plus_Sector": [
        "issue_size_in_crore", "issue_size_log", "fresh_issue_percentage", "ofs_percentage",
        "price_low", "price_high", "price_band_spread_pct", "lot_size",
        "min_retail_application_amount", "face_value", "qib_quota_pct", "nii_quota_pct", "retail_quota_pct",
        "revenue_latest_cr", "revenue_cagr_3yr", "pat_latest_cr", "pat_cagr_3yr",
        "ebitda_margin_pct", "eps_pre_ipo", "roe_pct", "roce_pct", "debt_equity_ratio", "operating_cash_flow_cr",
        "pe_ratio", "pb_ratio", "industry_pe", "valuation_discount_pct",
        "nifty_1d_return", "nifty_5d_return", "nifty_20d_return", "sensex_1d_return", "sensex_5d_return", "sensex_20d_return",
        "india_vix", "india_vix_5d_change", "market_trend",
        "previous_sector_avg_subscription", "previous_general_avg_subscription",
        "gmp_in_inr", "gmp_percentage", "news_count", "average_sentiment_score", "positive_news_ratio", "negative_news_ratio",
        "sector"
    ]
}
