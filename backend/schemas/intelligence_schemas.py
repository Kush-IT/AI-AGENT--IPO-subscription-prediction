"""
Pydantic Schemas for Live 15-Day IPO Intelligence + Forecasting Platform.
Enforces strict type safety, data provenance, and explicit disclaimer contracts.
"""
from typing import Dict, List, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class GMPIndicator(BaseModel):
    """
    Unofficial Grey Market Premium (GMP) market indicator.
    Must never be represented as official exchange data.
    """
    gmp_in_inr: Optional[float] = Field(None, description="Indicative GMP per share in INR")
    gmp_percentage: Optional[float] = Field(None, description="Indicative GMP as % of price band high")
    source: str = Field("Ex-Ante Grey Market Aggregator (Chittorgarh/IPOWatch)", description="Originating tracking platform")
    source_url: Optional[str] = Field("https://www.chittorgarh.com/report/ipo-grey-market-premium-gmp/24/", description="Source URL")
    observed_at: Optional[str] = Field(None, description="Timestamp when rate was recorded")
    disclaimer: str = Field(
        "Unofficial / indicative grey-market data — subject to illiquidity and high volatility.",
        description="Statutory disclosure"
    )
    status: str = Field("ACTIVE", description="Rate validity status (ACTIVE, STALE, UNAVAILABLE)")


class PredictedSubscriptions(BaseModel):
    """Ex-ante prospective subscription forecast generated strictly prior to IPO open."""
    total: float = Field(..., description="Predicted total subscription multiple (e.g. 45.2x)")
    qib: float = Field(..., description="Predicted QIB institutional multiple")
    nii: float = Field(..., description="Predicted NII corporate / HNI multiple")
    retail: float = Field(..., description="Predicted Retail individual multiple")
    recommended_category: str = Field("QIB", description="Predicted optimal subscription category")
    confidence_level: str = Field("HIGH", description="Model confidence rating (HIGH, MEDIUM, LOW)")
    confidence_score: int = Field(80, description="Calibrated confidence score out of 100")
    overall_risk_level: str = Field("LOW", description="Risk assessment (LOW, MEDIUM, HIGH)")
    composite_risk_score: int = Field(0, description="Risk penalty points")
    prediction_id: Optional[str] = Field(None, description="Unique immutable prediction UUID")
    prediction_timestamp: Optional[str] = Field(None, description="Ex-ante prediction timestamp")
    cutoff_timestamp: Optional[str] = Field(None, description="09:59:59 IST ex-ante cutoff timestamp")
    prediction_status: Optional[str] = Field("PREDICTED_EX_ANTE", description="Status of prediction")
    prediction_source: Optional[str] = Field("Frozen Production Candidates (1.0.0-final-candidates)", description="Originating model source")
    feature_snapshot_timestamp: Optional[str] = Field(None, description="Feature snapshot timestamp")
    model_version: Optional[str] = Field("1.0.0-final-candidates", description="Frozen model version")
    model_integrity_verified: bool = Field(True, description="SHA-256 integrity verification status")
    ex_ante: bool = Field(True, description="Strictly ex-ante compliance flag")


class ActualSubscriptions(BaseModel):
    """Verified official subscription multiples from exchange tallies."""
    total: float = Field(..., description="Actual total subscription multiple")
    qib: float = Field(..., description="Actual QIB subscription multiple")
    nii: float = Field(..., description="Actual NII subscription multiple")
    retail: float = Field(..., description="Actual Retail subscription multiple")
    strongest_category: str = Field("QIB", description="Category with highest final multiple")


class ListingMetrics(BaseModel):
    """Exchange listing performance and indicative price targets."""
    listing_date: Optional[str] = Field(None, description="Date of listing on NSE/BSE")
    issue_price: float = Field(..., description="Final issue price / upper price band (INR)")
    actual_listing_price: Optional[float] = Field(None, description="First exchange trade / open price (INR)")
    listing_gain_pct: Optional[float] = Field(None, description="Actual listing day gain/loss percentage")
    gmp_implied_listing_price: Optional[float] = Field(None, description="Estimated price = Upper Price + Current GMP")
    gmp_implied_gain_pct: Optional[float] = Field(None, description="Estimated % gain based on GMP")
    implied_price_label: str = Field("GMP-implied listing estimate", description="Label distinguishing from guaranteed price")


class IPOIntelligenceCard(BaseModel):
    """Base metadata for an Indian Mainboard IPO offering."""
    ipo_id: str = Field(..., description="Unique slug identifier (e.g. lumino_2026)")
    company_name: str = Field(..., description="Official issuer company name")
    isin: Optional[str] = Field("N/A", description="ISIN equity identifier")
    sector: str = Field("Capital Goods", description="Industry sectoral classification")
    ipo_open_date: str = Field(..., description="Subscription opening date (YYYY-MM-DD)")
    ipo_close_date: str = Field(..., description="Subscription closing date (YYYY-MM-DD)")
    listing_date: Optional[str] = Field(None, description="Scheduled/actual listing date (YYYY-MM-DD)")
    price_low: float = Field(..., description="Lower price band (INR)")
    price_high: float = Field(..., description="Upper price band / cut-off price (INR)")
    issue_size_in_crore: float = Field(..., description="Total issue size in Crore INR")
    lot_size: int = Field(..., description="Minimum market bid lot size (shares)")
    status: str = Field("UPCOMING", description="Current lifecycle state")
    record_source: str = Field("production", description="Explicit classification: 'production' vs 'test'")
    data_status: str = Field("LIVE / PERIODICALLY REFRESHED", description="Freshness status (LIVE / PERIODICALLY REFRESHED, STALE, DATA_UNAVAILABLE)")
    last_updated_ist: Optional[str] = Field(None, description="Timestamp formatted in IST (DD-MM-YYYY HH:MM IST)")


class UpcomingIPOForecast(IPOIntelligenceCard):
    """Intelligence card for IPOs opening within the upcoming 15-day window [T, T+15d]."""
    days_until_open: int = Field(0, description="Calendar days remaining until subscription opening")
    days_until_close: Optional[int] = Field(None, description="Calendar days remaining until subscription closing if open for bidding")
    bidding_day: Optional[int] = Field(None, description="Current bidding day (e.g. 1, 2, 3)")
    total_bidding_days: Optional[int] = Field(None, description="Total duration of bidding window in days")
    gmp_data: Optional[GMPIndicator] = Field(None, description="Latest indicative grey market premium")
    gmp_implied_listing_price: Optional[float] = Field(None, description="Price High + Indicative GMP")
    gmp_implied_gain_pct: Optional[float] = Field(None, description="Implied gain based on current GMP")
    gmp_forecast_note: str = Field(
        "GMP forecast unavailable — current GMP is an external unofficial market indicator.",
        description="Explicit notice stating no model forecasts GMP"
    )
    predicted_subscriptions: Optional[PredictedSubscriptions] = Field(
        None, description="Ex-ante model forecast if feature snapshot is complete"
    )
    top_positive_factors: List[Dict[str, Any]] = Field(default_factory=list, description="Top positive SHAP drivers")
    top_negative_factors: List[Dict[str, Any]] = Field(default_factory=list, description="Top negative SHAP drivers")
    prediction_status: str = Field("PREDICTED_EX_ANTE", description="Forecast status")
    data_sources: List[Dict[str, Any]] = Field(default_factory=list, description="Sourced data provenance")
    live_subscription_multiple: Optional[float] = Field(None, description="Current live subscription multiple if actively open")
    exchange_status: Optional[str] = Field(None, description="Exchange status (e.g. Active, Upcoming)")


class PastIPOResult(IPOIntelligenceCard):
    """Intelligence card for IPOs closed/listed within the trailing 15-day window [T-15d, T]."""
    days_since_close: int = Field(0, description="Calendar days elapsed since subscription closing")
    actual_subscriptions: Optional[ActualSubscriptions] = Field(None, description="Verified exchange subscriptions")
    has_ex_ante_prediction: bool = Field(False, description="Whether ex-ante forecast was recorded prior to open")
    predicted_subscriptions: Optional[PredictedSubscriptions] = Field(
        None, description="Ex-ante forecast if recorded (strictly None if not predicted pre-open)"
    )
    prediction_error_ae: Optional[float] = Field(None, description="Total absolute error |Actual - Predicted|")
    prediction_error_ape_pct: Optional[float] = Field(None, description="Total absolute percentage error (%)")
    listing_metrics: Optional[ListingMetrics] = Field(None, description="Exchange listing performance")
    closing_gmp: Optional[GMPIndicator] = Field(None, description="Indicative GMP recorded prior to close")
    outcome_source: str = Field("NSE/BSE Official Exchange Feed", description="Official outcome authority")
    outcome_observed_at: Optional[str] = Field(None, description="Timestamp when exchange tallies were captured")


class MarketOverviewSummary(BaseModel):
    """High-level macroeconomic and IPO activity overview for the 30-day window."""
    reference_date: str = Field(..., description="Current evaluation date (YYYY-MM-DD)")
    upcoming_ipos_count: int = Field(0, description="Count of IPOs opening in next 15 days")
    active_bidding_count: int = Field(0, description="Count of IPOs currently open for subscription")
    recently_closed_count: int = Field(0, description="Count of IPOs closed/listed in last 15 days")
    avg_recent_listing_gain_pct: Optional[float] = Field(None, description="Average listing day gain in last 15 days")
    avg_recent_total_subscription: Optional[float] = Field(None, description="Average total subscription multiple in last 15 days")
    strongest_recent_sector: Optional[str] = Field(None, description="Top performing sector in last 15 days")
    last_updated_ist: str = Field(..., description="Freshness timestamp (DD-MM-YYYY HH:MM IST)")
    data_status: str = Field("LIVE / PERIODICALLY REFRESHED", description="Data freshness status")
    sources_health: Dict[str, Any] = Field(default_factory=dict, description="Source availability and health")
    gmp_disclaimer: str = Field(
        "Grey Market Premium (GMP) data is unofficial and indicative. Subscription forecasts are generated by frozen production machine learning models.",
        description="Global platform disclaimer"
    )


class IPODeepDiveResponse(BaseModel):
    """Detailed drill-down response for a single IPO offering."""
    card: IPOIntelligenceCard = Field(..., description="Base IPO terms")
    timeline: List[Dict[str, Any]] = Field(default_factory=list, description="Chronological milestone events")
    forecast: Optional[UpcomingIPOForecast] = Field(None, description="Forecast details if upcoming")
    past_result: Optional[PastIPOResult] = Field(None, description="Performance details if closed")
    feature_snapshot: Optional[Dict[str, Any]] = Field(None, description="Canonical 45-feature vector if captured")
    source_provenance: List[Dict[str, Any]] = Field(default_factory=list, description="Audit provenance log")


class SourcesHealthResponse(BaseModel):
    """Health, latency, and freshness metadata for live upstream data feeds."""
    service: str = Field(..., description="Service name")
    overall_status: str = Field(..., description="Overall health (HEALTHY, DEGRADED, DOWN)")
    data_status: str = Field(..., description="Data freshness status (LIVE / PERIODICALLY REFRESHED, STALE, DATA_UNAVAILABLE)")
    cache: Dict[str, Any] = Field(default_factory=dict, description="Cache status, TTL, and timestamps")
    sources: Dict[str, Any] = Field(default_factory=dict, description="Individual source statuses and latencies")
