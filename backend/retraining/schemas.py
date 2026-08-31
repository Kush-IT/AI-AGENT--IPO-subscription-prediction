"""
Pydantic Schemas for Weekly Rolling Retraining Engine.
Defines data contracts for data selection, candidate training, evaluation comparison,
promotion gates, manifests, and API payloads.
"""
from typing import Dict, List, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field


class RetrainingStatus(str, Enum):
    NO_ELIGIBLE_DATA = "NO_ELIGIBLE_DATA"
    INSUFFICIENT_SAMPLE_SIZE = "INSUFFICIENT_SAMPLE_SIZE"
    INSUFFICIENT_VALIDATION_DATA = "INSUFFICIENT_VALIDATION_DATA"
    SCHEMA_VALIDATION_FAILED = "SCHEMA_VALIDATION_FAILED"
    DATA_VALIDATION_FAILED = "DATA_VALIDATION_FAILED"
    LEAKAGE_DETECTED = "LEAKAGE_DETECTED"
    TRAINING_FAILED = "TRAINING_FAILED"
    CANDIDATE_VALIDATED = "CANDIDATE_VALIDATED"
    CANDIDATE_READY_FOR_PROMOTION = "CANDIDATE_READY_FOR_PROMOTION"
    PROMOTED = "PROMOTED"
    KEEP_CURRENT_MODEL = "KEEP_CURRENT_MODEL"
    MODEL_INTEGRITY_VIOLATION = "MODEL_INTEGRITY_VIOLATION"


class TargetMetricSet(BaseModel):
    mae: float
    rmse: float
    median_ae: float
    mape: float
    r2: float
    signed_bias: float


class ModelComparisonSummary(BaseModel):
    total_metrics_current: TargetMetricSet
    total_metrics_candidate: TargetMetricSet
    total_mae_difference: float

    qib_metrics_current: TargetMetricSet
    qib_metrics_candidate: TargetMetricSet
    qib_mae_difference: float

    nii_metrics_current: TargetMetricSet
    nii_metrics_candidate: TargetMetricSet
    nii_mae_difference: float

    retail_metrics_current: TargetMetricSet
    retail_metrics_candidate: TargetMetricSet
    retail_mae_difference: float

    category_ranking_accuracy_current_pct: float
    category_ranking_accuracy_candidate_pct: float

    strongest_category_accuracy_current_pct: float
    strongest_category_accuracy_candidate_pct: float


class PromotionGateCheck(BaseModel):
    check_name: str
    passed: bool
    details: str


class PromotionDecision(BaseModel):
    decision: str
    passed_all_checks: bool
    checks: List[PromotionGateCheck]
    rationale: str


class IPORecordAudit(BaseModel):
    ipo_id: str
    company_name: str
    ipo_open_date: str
    ipo_close_date: str
    feature_snapshot_hash: str
    outcome_timestamp: str

    actual_total: float
    actual_qib: float
    actual_nii: float
    actual_retail: float

    split: str = "TRAIN"
    included: bool = True
    rejection_reason: Optional[str] = None


class DataSelectionSummary(BaseModel):
    evaluation_date: str
    window_start_date: str
    window_end_date: str

    total_candidates_found: int
    eligible_count: int
    rejected_count: int

    training_sample_count: int
    validation_sample_count: int

    minimum_sample_threshold: int
    is_sample_size_sufficient: bool
    is_validation_split_sufficient: bool

    records_audit: List[IPORecordAudit]


class CandidateModelMetadata(BaseModel):
    model_version: str

    architecture: str = (
        "Unified XGBoost candidate architecture using "
        "four target-specific XGBoost regressors"
    )

    training_date: str
    training_start_date: str
    training_end_date: str

    training_ipo_ids: List[str]
    training_sample_count: int

    validation_ipo_ids: List[str]
    validation_sample_count: int

    feature_count: int = 45

    target_definitions: List[str] = [
        "total_subscription",
        "qib_subscription",
        "nii_subscription",
        "retail_subscription",
    ]

    target_transforms: Dict[str, str] = {
        "total_subscription": "log1p",
        "qib_subscription": "raw",
        "nii_subscription": "log1p",
        "retail_subscription": "raw",
    }

    xgboost_hyperparameters: Dict[str, Any]
    artifacts_directory: str
    sha256_hashes: Dict[str, str]


class RetrainingRunRequest(BaseModel):
    run_date: Optional[str] = None
    dry_run: bool = True
    min_samples: int = 10
    force_promote: bool = False


class RetrainingRunResponse(BaseModel):
    run_id: str
    timestamp: str
    evaluation_date: str
    is_dry_run: bool

    status: RetrainingStatus
    message: str

    production_model_integrity_verified: bool
    feature_drift_status: Dict[str, Any]

    data_selection: DataSelectionSummary

    candidate_metadata: Optional[CandidateModelMetadata] = None
    comparison_metrics: Optional[ModelComparisonSummary] = None

    promotion_decision: PromotionDecision
    manifest_path: Optional[str] = None
