"""
Pydantic API Request, Response, Health, and Schema Definitions.
Provides robust contract validation for the FastAPI /api/v1/ endpoints.
"""
from typing import Dict, List, Any, Optional, Literal
from pydantic import BaseModel, Field


class IPOAnalysisRequest(BaseModel):
    """
    Input request payload for pre-IPO subscription forecasting and agentic audit.
    """
    company_name: str = Field(..., description="Company name seeking listing on Indian Mainboard", example="Tata Technologies Ltd")
    ipo_open_date: str = Field(..., description="Subscription start date (YYYY-MM-DD)", example="2023-11-22")
    ipo_close_date: Optional[str] = Field(None, description="Subscription closing date (YYYY-MM-DD)", example="2023-11-24")
    listing_date: Optional[str] = Field(None, description="Expected listing date (YYYY-MM-DD)", example="2023-11-30")
    sector: Optional[str] = Field("Other", description="Business industry sector", example="Technology")
    industry: Optional[str] = Field(None, description="Granular sub-industry classification", example="IT Services")
    
    # Offer structure
    issue_size_in_crore: float = Field(..., description="Total offering size in INR Crore", example=3042.51, gt=0)
    price_low: Optional[float] = Field(None, description="Floor price band in INR", example=475.0, gt=0)
    price_high: float = Field(..., description="Cap price band in INR", example=500.0, gt=0)
    lot_size: Optional[int] = Field(None, description="Minimum bidding lot size (shares)", example=30, gt=0)
    face_value: Optional[float] = Field(2.0, description="Share face value in INR", example=2.0)
    
    # Category quotas (SEBI Mainboard reservation terms)
    qib_quota_pct: Optional[float] = Field(50.0, description="QIB reservation percentage", ge=0, le=100)
    nii_quota_pct: Optional[float] = Field(15.0, description="NII/HNI reservation percentage", ge=0, le=100)
    retail_quota_pct: Optional[float] = Field(35.0, description="Retail reservation percentage", ge=0, le=100)
    employee_quota_pct: Optional[float] = Field(0.0, description="Employee reservation percentage", ge=0, le=100)
    fresh_issue_percentage: Optional[float] = Field(0.0, description="Fresh issue percentage of total offer", ge=0, le=100)
    ofs_percentage: Optional[float] = Field(100.0, description="Offer for sale percentage of total offer", ge=0, le=100)
    
    # Financial fundamentals (Audited prospectus statements)
    revenue_latest_cr: Optional[float] = Field(4414.18, description="Latest FY Restated Revenue (INR Cr)")
    pat_latest_cr: Optional[float] = Field(624.04, description="Latest FY Profit After Tax (INR Cr)")
    operating_cash_flow_cr: Optional[float] = Field(580.0, description="Latest FY Operating Cash Flow (INR Cr)")
    ebitda_margin_pct: Optional[float] = Field(23.7, description="Latest FY EBITDA Margin (%)")
    revenue_cagr_3yr: Optional[float] = Field(36.2, description="3-Year Revenue CAGR (%)")
    pat_cagr_3yr: Optional[float] = Field(61.5, description="3-Year PAT CAGR (%)")
    roe_pct: Optional[float] = Field(23.7, description="Return on Equity (%)")
    roce_pct: Optional[float] = Field(27.4, description="Return on Capital Employed (%)")
    debt_equity_ratio: Optional[float] = Field(0.05, description="Debt to Equity Ratio")
    eps_pre_ipo: Optional[float] = Field(15.38, description="Pre-IPO Basic EPS (INR)")
    pe_ratio: Optional[float] = Field(32.5, description="P/E Multiple based on cap price")
    industry_pe: Optional[float] = Field(60.0, description="Listed Peer Group Median P/E")
    pb_ratio: Optional[float] = Field(7.8, description="Price to Book Value Multiple")
    valuation_discount_pct: Optional[float] = Field(45.8, description="Discount vs Peer Median (%)")
    
    # Secondary market & sentiment indicators
    nifty_1d_return: Optional[float] = Field(0.15, description="NIFTY 1-day return prior to open (%)")
    nifty_5d_return: Optional[float] = Field(1.20, description="NIFTY 5-day return prior to open (%)")
    nifty_20d_return: Optional[float] = Field(3.50, description="NIFTY 20-day return prior to open (%)")
    sensex_1d_return: Optional[float] = Field(0.15, description="SENSEX 1-day return (%)")
    sensex_5d_return: Optional[float] = Field(1.20, description="SENSEX 5-day return (%)")
    sensex_20d_return: Optional[float] = Field(3.50, description="SENSEX 20-day return (%)")
    india_vix: Optional[float] = Field(12.2, description="India VIX level prior to open")
    india_vix_5d_change: Optional[float] = Field(-0.8, description="India VIX 5-day change")
    market_trend: Optional[str] = Field("BULLISH", description="Market regime (BULLISH, BEARISH, NEUTRAL, VOLATILE)")
    
    # Media sentiment and Grey Market Premium
    news_count: Optional[int] = Field(45, description="Pre-IPO media news article count")
    positive_news_ratio: Optional[float] = Field(0.88, description="Positive news coverage ratio [0, 1]")
    negative_news_ratio: Optional[float] = Field(0.04, description="Negative news coverage ratio [0, 1]")
    average_sentiment_score: Optional[float] = Field(0.82, description="FinBERT average sentiment score [0, 1]")
    gmp_in_inr: Optional[float] = Field(375.0, description="Grey Market Premium in INR")
    gmp_percentage: Optional[float] = Field(75.0, description="Grey Market Premium percentage (%)")
    
    # Execution mode
    mode: Optional[Literal["OFFLINE", "LIVE"]] = Field("OFFLINE", description="Execution mode: OFFLINE (cached/deterministic) or LIVE (remote feeds)")


class CategoryPrediction(BaseModel):
    """Prediction payload for an individual subscription category."""
    predicted_multiple: float = Field(..., description="Predicted subscription multiple (times)", example=69.43)
    model_name: str = Field(..., description="Model architecture used", example="Random_Forest")
    target_transform: str = Field(..., description="Target scale representation", example="raw")
    raw_model_output: float = Field(..., description="Internal regression model output", example=69.43)
    unit: str = Field("times (subscription multiple)", description="Measurement unit")


class CategoryAssessment(BaseModel):
    """Relative demand assessment across investor categories."""
    strongest_predicted_category: str = Field(..., description="Investor class with highest predicted multiple", example="QIB")
    weakest_predicted_category: str = Field(..., description="Investor class with lowest predicted multiple", example="RETAIL")
    recommended_category: str = Field(..., description="Model-recommended bidding category (QIB, NII, RETAIL, NO_CLEAR_EDGE)", example="QIB")
    category_ranking: List[Dict[str, Any]] = Field(..., description="Ranked list of categories by predicted multiple")
    edge_rationale: str = Field(..., description="Textual explanation of category demand dispersion")
    disclaimer: str = Field(..., description="Non-advisory regulatory disclaimer")


class ConfidenceAssessment(BaseModel):
    """Evidence-based multi-factor model confidence."""
    confidence_level: str = Field(..., description="Confidence rating (HIGH, MEDIUM, LOW)", example="HIGH")
    confidence_score: int = Field(..., description="Numerical score out of 100", example=100)
    justification_factors: List[str] = Field(..., description="Audit factors contributing to confidence rating")


class RiskAssessment(BaseModel):
    """Multi-dimensional investment and modeling risk diagnostics."""
    overall_risk_level: str = Field(..., description="Composite risk level (HIGH, MEDIUM, LOW)", example="LOW")
    composite_risk_score: int = Field(..., description="Cumulative risk penalty points", example=0)
    identified_risk_factors: List[Dict[str, Any]] = Field(..., description="List of identified risk warnings")
    total_risk_factors_count: int = Field(..., description="Count of identified risk factors", example=0)


class DataQualityReport(BaseModel):
    """Data quality and completeness audit."""
    source_count: int = Field(..., description="Number of independent verified data sources consulted")
    total_features_count: int = Field(..., description="Total feature matrix dimension (45)")
    available_features_count: int = Field(..., description="Features successfully observed ex-ante")
    missing_fields_count: int = Field(..., description="Count of missing/imputed fields")
    missing_fields: List[str] = Field(..., description="List of missing feature names")
    temporal_rejections_count: int = Field(..., description="Count of observations rejected for look-ahead violation")
    temporal_rejections: List[Dict[str, Any]] = Field(..., description="List of temporal rejection records")
    feature_completeness_pct: float = Field(..., description="Feature completeness percentage")
    data_quality_score: int = Field(..., description="Composite data quality score (0-100)")
    data_quality_tier: str = Field(..., description="Quality tier (EXCELLENT, ACCEPTABLE, DEGRADED)")
    temporal_compliance: str = Field(..., description="Temporal boundary compliance statement")


class TemporalValidationReport(BaseModel):
    """Temporal validation summary."""
    status: str = Field(..., description="Temporal compliance status (EX_ANTE_COMPLIANT, PARTIAL_REJECTIONS)")
    temporal_rejections_count: int = Field(..., description="Number of rejected observations")
    rejections: List[Dict[str, Any]] = Field(..., description="Details of rejected observations")


class IPOAnalysisResponse(BaseModel):
    """
    Standardized, production-grade API response contract.
    """
    request_id: str = Field(..., description="Unique UUID request identifier for tracing", example="c4b78a90-3b4c-4e89-9a2f-123456789abc")
    status: str = Field(..., description="Execution status (ANALYSIS_COMPLETED, VALIDATION_FAILED)", example="ANALYSIS_COMPLETED")
    generated_at: str = Field(..., description="ISO 8601 generation timestamp", example="2024-05-15T10:00:00+05:30")
    ipo: Dict[str, Any] = Field(..., description="Normalized IPO structural terms")
    predictions: Dict[str, CategoryPrediction] = Field(..., description="Category-wise and total subscription forecasts")
    category_assessment: CategoryAssessment = Field(..., description="Investor category ranking and recommendation")
    confidence: ConfidenceAssessment = Field(..., description="Model confidence diagnostics")
    top_positive_factors: List[Dict[str, Any]] = Field(..., description="Top positive contributing SHAP features")
    top_negative_factors: List[Dict[str, Any]] = Field(..., description="Top negative contributing SHAP features")
    grouped_driver_impacts: Dict[str, Any] = Field(..., description="Grouped SHAP impacts (GMP, Scale, Sentiment)")
    risk_assessment: RiskAssessment = Field(..., description="Financial solvency, valuation, and volatility risk audit")
    data_quality: DataQualityReport = Field(..., description="Feature completeness and quality audit")
    temporal_validation: TemporalValidationReport = Field(..., description="Strict ex-ante timestamp verification results")
    model_information: Dict[str, Any] = Field(..., description="Underlying model registry versions and benchmark metrics")
    sources: List[Dict[str, Any]] = Field(..., description="Authoritative data provenance sources")
    feature_provenance: Dict[str, Any] = Field(..., description="Granular field-level provenance records")
    warnings: List[str] = Field(..., description="Non-fatal warnings encountered during analysis")
    disclaimer: str = Field(..., description="Non-advisory regulatory disclaimer")


class ErrorResponse(BaseModel):
    """Structured error contract for API exceptions."""
    request_id: str = Field(..., description="Request tracing identifier")
    error_code: str = Field(..., description="Standardized error code", example="INVALID_IPO_INPUT")
    message: str = Field(..., description="Human-readable error description")
    details: Dict[str, Any] = Field(default_factory=dict, description="Additional error context or validation issues")


class HealthResponse(BaseModel):
    """API health status and dependency checks."""
    status: str = Field(..., example="HEALTHY")
    version: str = Field(..., example="1.0.0")
    timestamp: str = Field(..., example="2024-05-15T10:00:00+05:30")
    environment: str = Field(..., example="production")
    model_registry_status: Dict[str, str] = Field(..., description="Load status of frozen candidate models")
    connector_status: Dict[str, str] = Field(..., description="Operational status of modular connectors")
    metrics: Dict[str, Any] = Field(..., description="Runtime request latency and volume metrics")


class ModelMetadataResponse(BaseModel):
    """Detailed metadata for frozen production models."""
    model_registry_version: str
    training_dataset_observations: int
    training_date_range: str
    quarantined_test_observations: int
    quarantined_test_date_range: str
    models: List[Dict[str, Any]]
