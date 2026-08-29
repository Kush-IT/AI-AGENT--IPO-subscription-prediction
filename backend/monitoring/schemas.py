"""
Pydantic Schemas for Prospective Real-IPO Validation, Prediction Logging,
Outcome Ingestion, and Performance Monitoring.
"""
from typing import Dict, Any, List, Optional
from enum import Enum
from pydantic import BaseModel, Field


class PredictionStatus(str, Enum):
    PREDICTED = "PREDICTED"
    AWAITING_OUTCOME = "AWAITING_OUTCOME"
    OUTCOME_RECORDED = "OUTCOME_RECORDED"
    VALIDATION_FAILED = "VALIDATION_FAILED"


class ProspectivePredictionRecord(BaseModel):
    prediction_id: str = Field(..., description="Unique UUID for prospective prediction")
    company_name: str = Field(..., description="Name of company offering IPO")
    ipo_open_date: str = Field(..., description="Date of IPO opening (YYYY-MM-DD)")
    ipo_close_date: Optional[str] = Field(None, description="Date of IPO closing (YYYY-MM-DD)")
    
    prediction_timestamp: str = Field(..., description="ISO 8601 timestamp when prediction was generated")
    feature_cutoff: str = Field(..., description="Statutory cut-off timestamp (09:59:59 IST on open date)")
    
    predicted_total_subscription: float = Field(..., description="Predicted Total subscription multiple")
    predicted_qib_subscription: float = Field(..., description="Predicted QIB subscription multiple")
    predicted_nii_subscription: float = Field(..., description="Predicted NII subscription multiple")
    predicted_retail_subscription: float = Field(..., description="Predicted Retail subscription multiple")
    
    recommended_category: str = Field(..., description="Strongest predicted category (QIB, NII, RETAIL, NO_CLEAR_EDGE)")
    
    confidence_score: int = Field(..., description="Diagnostic calibration score (0-100)")
    confidence_level: str = Field(..., description="Diagnostic level (HIGH, MEDIUM, LOW)")
    risk_level: str = Field(..., description="Multi-dimensional risk assessment (LOW, MEDIUM, HIGH)")
    
    data_quality_score: int = Field(..., description="Input data quality score (0-100)")
    data_quality_tier: str = Field(..., description="Data tier (EXCELLENT, GOOD, MODERATE, POOR)")
    
    temporal_validation_status: str = Field(..., description="Temporal compliance (EX_ANTE_COMPLIANT, TEMPORAL_REJECTED)")
    
    model_registry_version: str = Field("1.0.0-final-candidates", description="Frozen model registry version")
    
    total_model_name: str = Field("XGBoost (log1p)", description="Model used for Total target")
    qib_model_name: str = Field("Random Forest (RAW)", description="Model used for QIB target")
    nii_model_name: str = Field("LightGBM (log1p)", description="Model used for NII target")
    retail_model_name: str = Field("XGBoost (RAW)", description="Model used for Retail target")
    
    feature_snapshot_hash: str = Field(..., description="SHA-256 hash of immutable feature snapshot")
    model_artifact_hash: Dict[str, str] = Field(default_factory=dict, description="SHA-256 hashes of frozen model files")
    
    prediction_status: PredictionStatus = Field(PredictionStatus.PREDICTED, description="Lifecycle status")
    feature_snapshot: Optional[Dict[str, Any]] = Field(default=None, description="Granular 45-feature snapshot with timestamps")


class ActualIPOOutcome(BaseModel):
    prediction_id: str = Field(..., description="UUID of original prospective prediction")
    company_name: str = Field(..., description="Company name")
    ipo_close_date: str = Field(..., description="Actual offering close date (YYYY-MM-DD)")
    
    actual_qib_subscription: float = Field(..., ge=0.0, description="Actual QIB subscription multiple from exchange")
    actual_nii_subscription: float = Field(..., ge=0.0, description="Actual NII subscription multiple from exchange")
    actual_retail_subscription: float = Field(..., ge=0.0, description="Actual Retail subscription multiple from exchange")
    actual_total_subscription: float = Field(..., ge=0.0, description="Actual Total subscription multiple from exchange")
    
    outcome_source: str = Field(..., description="Authoritative outcome source (e.g. NSE, BSE)")
    outcome_source_url: Optional[str] = Field(None, description="Exchange public listing / bidding report URL")
    outcome_observed_at: str = Field(..., description="ISO 8601 timestamp when outcome was recorded")
    
    outcome_validation_status: str = Field("VERIFIED_EXCHANGE_OUTCOME", description="Outcome verification status")


class PredictionErrorRecord(BaseModel):
    prediction_id: str
    company_name: str
    ipo_open_date: str
    
    predicted_total: float
    predicted_qib: float
    predicted_nii: float
    predicted_retail: float
    
    actual_total: float
    actual_qib: float
    actual_nii: float
    actual_retail: float
    
    total_absolute_error: float
    qib_absolute_error: float
    nii_absolute_error: float
    retail_absolute_error: float
    
    total_signed_error: float
    qib_signed_error: float
    nii_signed_error: float
    retail_signed_error: float
    
    recommended_category: str
    actual_best_category: str
    category_prediction_correct: bool
    
    confidence_score: int
    confidence_level: str
    risk_level: str
    
    prediction_timestamp: str
    feature_cutoff: str
    outcome_observed_at: str
    
    data_quality_score: int
    temporal_validation_status: str
    model_registry_version: str


class MetricValues(BaseModel):
    mae: Optional[float] = None
    rmse: Optional[float] = None
    median_ae: Optional[float] = None
    r2_score: Optional[float] = None
    sample_count: int = 0


class PerformanceMetricsReport(BaseModel):
    sample_count: int
    total_metrics: MetricValues
    qib_metrics: MetricValues
    nii_metrics: MetricValues
    retail_metrics: MetricValues
    category_recommendation_accuracy_pct: Optional[float] = None
    confidence_error_breakdown: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    evaluation_timestamp: str


class FeatureDriftStat(BaseModel):
    feature_name: str
    psi_score: float
    drift_level: str  # LOW, MODERATE, HIGH
    historical_mean: float
    prospective_mean: float


class DriftAnalysisReport(BaseModel):
    sample_count: int
    overall_feature_drift_level: str  # LOW, MODERATE, HIGH
    overall_target_drift_level: str   # LOW, MODERATE, HIGH
    model_status: str                 # STABLE, MODEL_REVIEW_REQUIRED
    feature_drifts: List[FeatureDriftStat] = Field(default_factory=list)
    monitored_at: str


class MonitoringSummaryResponse(BaseModel):
    total_predictions_count: int
    completed_outcomes_count: int
    awaiting_outcomes_count: int
    system_status: str  # PROSPECTIVE_VALIDATION_READY or PROSPECTIVE_VALIDATION_ACTIVE
    model_registry_version: str
    model_integrity_verified: bool
    performance_summary: Optional[Dict[str, Any]] = None
    drift_summary: Optional[Dict[str, Any]] = None
    last_updated_at: str
