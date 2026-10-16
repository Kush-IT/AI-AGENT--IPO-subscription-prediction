/**
 * Strict TypeScript Type Definitions for Pre-IPO Subscription AI.
 * Perfectly aligned with the FastAPI backend Pydantic schemas.
 */

export type ExecutionMode = 'OFFLINE' | 'LIVE';
export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskTier = 'HIGH' | 'MEDIUM' | 'LOW';
export type DataQualityTier = 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED';
export type CategoryRecommendation = 'QIB' | 'NII' | 'RETAIL' | 'NO_CLEAR_EDGE';

export interface IPOAnalysisRequest {
  company_name: string;
  ipo_open_date: string;
  ipo_close_date?: string;
  listing_date?: string;
  sector?: string;
  industry?: string;
  
  // Offering terms
  issue_size_in_crore: number;
  price_low?: number;
  price_high: number;
  lot_size?: number;
  face_value?: number;
  
  // Quotas
  qib_quota_pct?: number;
  nii_quota_pct?: number;
  retail_quota_pct?: number;
  employee_quota_pct?: number;
  fresh_issue_percentage?: number;
  ofs_percentage?: number;
  
  // Fundamentals
  revenue_latest_cr?: number;
  pat_latest_cr?: number;
  operating_cash_flow_cr?: number;
  ebitda_margin_pct?: number;
  revenue_cagr_3yr?: number;
  pat_cagr_3yr?: number;
  roe_pct?: number;
  roce_pct?: number;
  debt_equity_ratio?: number;
  eps_pre_ipo?: number;
  pe_ratio?: number;
  industry_pe?: number;
  pb_ratio?: number;
  valuation_discount_pct?: number;
  
  // Market & Sentiment
  nifty_1d_return?: number;
  nifty_5d_return?: number;
  nifty_20d_return?: number;
  sensex_1d_return?: number;
  sensex_5d_return?: number;
  sensex_20d_return?: number;
  india_vix?: number;
  india_vix_5d_change?: number;
  market_trend?: string;
  
  // GMP & Sentiment
  news_count?: number;
  positive_news_ratio?: number;
  negative_news_ratio?: number;
  average_sentiment_score?: number;
  gmp_in_inr?: number;
  gmp_percentage?: number;
  
  mode?: ExecutionMode;
}

export interface CategoryPrediction {
  predicted_multiple: number;
  model_name: string;
  target_transform: string;
  raw_model_output: number;
  unit: string;
}

export interface CategoryRankItem {
  rank: number;
  category: string;
  predicted_multiple: number;
}

export interface CategoryAssessmentData {
  strongest_predicted_category: string;
  weakest_predicted_category: string;
  recommended_category: CategoryRecommendation;
  category_ranking: CategoryRankItem[];
  edge_rationale: string;
  disclaimer: string;
}

export interface ConfidenceData {
  confidence_level: ConfidenceTier;
  confidence_score: number;
  justification_factors: string[];
}

export interface SHAPContributor {
  feature: string;
  feature_value: string;
  shap_value: number;
  abs_shap_value: number;
  direction: 'positive' | 'negative';
  attribution_statement: string;
  rank: number;
}

export interface GroupedDriverImpact {
  total_shap_impact: number;
  direction: string;
}

export interface RiskFactor {
  risk_type: string;
  severity: RiskTier;
  rationale: string;
}

export interface RiskAssessmentData {
  overall_risk_level: RiskTier;
  composite_risk_score: number;
  identified_risk_factors: RiskFactor[];
  total_risk_factors_count: number;
}

export interface TemporalRejection {
  field: string;
  observed_at: string;
  cutoff: string;
  reason: string;
}

export interface DataQualityData {
  source_count: number;
  total_features_count: number;
  available_features_count: number;
  missing_fields_count: number;
  missing_fields: string[];
  temporal_rejections_count: number;
  temporal_rejections: TemporalRejection[];
  feature_completeness_pct: number;
  data_quality_score: number;
  data_quality_tier: DataQualityTier;
  temporal_compliance: string;
}

export interface TemporalValidationData {
  status: string;
  temporal_rejections_count: number;
  rejections: TemporalRejection[];
}

export interface ProvenanceSource {
  category: string;
  source: string;
  source_url: string;
  feature_cutoff: string;
  verification_status: string;
}

export interface FieldProvenanceRecord {
  field: string;
  value: number | string | null;
  source: string;
  source_url: string;
  observed_at: string;
  feature_cutoff: string;
  retrieved_at: string;
  status: string;
  validation_status: string;
  validation_reason: string;
}

export interface ModelInformationData {
  model_registry_version: string;
  models_used: Record<string, string>;
  test_set_performance: Record<string, string>;
}

export interface IPOAnalysisResponse {
  request_id: string;
  status: string;
  generated_at: string;
  ipo: {
    company_name: string;
    ipo_open_date: string;
    sector: string;
    price_band?: {
      floor_price_inr: number | null;
      cap_price_inr: number;
      spread_pct: number | null;
    };
    issue_size_in_crore: number;
    lot_size?: number;
    min_retail_application_amount_inr?: number;
    quota_reservation_pct?: {
      qib_quota?: number;
      nii_quota?: number;
      retail_quota?: number;
    };
    grey_market_premium?: {
      gmp_percentage?: number | null;
      gmp_in_inr?: number | null;
    };
  };
  predictions: {
    total_subscription: CategoryPrediction;
    qib_subscription: CategoryPrediction;
    nii_subscription: CategoryPrediction;
    retail_subscription: CategoryPrediction;
  };
  category_assessment: CategoryAssessmentData;
  confidence: ConfidenceData;
  top_positive_factors: SHAPContributor[];
  top_negative_factors: SHAPContributor[];
  grouped_driver_impacts: Record<string, GroupedDriverImpact>;
  risk_assessment: RiskAssessmentData;
  data_quality: DataQualityData;
  temporal_validation: TemporalValidationData;
  model_information: ModelInformationData;
  sources: ProvenanceSource[];
  feature_provenance: Record<string, FieldProvenanceRecord>;
  warnings: string[];
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  environment: string;
  model_registry_status: Record<string, string>;
  connector_status: Record<string, string>;
  metrics: {
    uptime_seconds: number;
    total_requests: number;
    successful_analyses: number;
    failed_analyses: number;
    connector_errors: number;
    temporal_rejections: number;
    average_latency_ms: number;
  };
}

export interface ModelMetadataItem {
  target: string;
  selected_model: string;
  target_transform: string;
  hyperparameters: Record<string, unknown>;
  walk_forward_validation_metrics: Record<string, number>;
  quarantined_test_set_metrics: Record<string, number | string>;
}

export interface ModelMetadataResponse {
  model_registry_version: string;
  training_dataset_observations: number;
  training_date_range: string;
  quarantined_test_observations: number;
  quarantined_test_date_range: string;
  models: ModelMetadataItem[];
}

export interface FormFieldSchema {
  name: string;
  type: string;
  required: boolean;
  category: string;
  description: string;
  default?: string | number;
  min?: number;
  options?: string[];
}

export interface FormSchemaResponse {
  version: string;
  supported_fields_count: number;
  fields: FormFieldSchema[];
  temporal_rules: {
    cutoff_rule: string;
    imputation_policy: string;
  };
}

export interface ApiErrorResponse {
  request_id?: string;
  error_code: string;
  message: string;
  details?: Record<string, unknown>;
}

// --- Phase 20 Weekly Rolling Retraining Types ---

export interface RetrainingTargetMetrics {
  mae: number;
  rmse: number;
  median_ae: number;
  mape: number;
  r2: number;
  signed_bias: number;
}

export interface ModelComparisonData {
  total_metrics_current: RetrainingTargetMetrics;
  total_metrics_candidate: RetrainingTargetMetrics;
  total_mae_difference: number;
  qib_metrics_current: RetrainingTargetMetrics;
  qib_metrics_candidate: RetrainingTargetMetrics;
  qib_mae_difference: number;
  nii_metrics_current: RetrainingTargetMetrics;
  nii_metrics_candidate: RetrainingTargetMetrics;
  nii_mae_difference: number;
  retail_metrics_current: RetrainingTargetMetrics;
  retail_metrics_candidate: RetrainingTargetMetrics;
  retail_mae_difference: number;
  category_ranking_accuracy_current_pct: number;
  category_ranking_accuracy_candidate_pct: number;
  strongest_category_accuracy_current_pct: number;
  strongest_category_accuracy_candidate_pct: number;
}

export interface PromotionGateCheckItem {
  check_name: string;
  passed: boolean;
  details: string;
}

export interface PromotionDecisionData {
  decision: string;
  passed_all_checks: boolean;
  checks: PromotionGateCheckItem[];
  rationale: string;
}

export interface CandidateMetadataData {
  model_version: string;
  training_date: string;
  architecture: string;
  training_sample_count: number;
  validation_sample_count: number;
  artifacts_directory: string;
  sha256_hashes: Record<string, string>;
  features_used: string[];
}

export interface RetrainingStatusResponse {
  current_production_model: string;
  production_integrity_verified: boolean;
  latest_run_id: string | null;
  latest_run_date: string | null;
  latest_status: string;
  latest_candidate: CandidateMetadataData | null;
  latest_comparison: ModelComparisonData | null;
  latest_promotion_decision: string;
  latest_manifest_path: string | null;
  rolling_window_days: number;
  minimum_samples: number;
}

export interface RetrainingHistoryRecord {
  run_id: string;
  timestamp: string;
  evaluation_date: string;
  is_dry_run: boolean;
  status: string;
  eligible_count: number;
  training_sample_count: number;
  validation_sample_count: number;
  candidate_version: string | null;
  promotion_decision: string;
  manifest_path: string;
}

export interface RetrainingRunRequest {
  run_date?: string | null;
  dry_run?: boolean;
  min_samples?: number;
  force_promote?: boolean;
}

export interface RetrainingRunResponse {
  run_id: string;
  timestamp: string;
  evaluation_date: string;
  is_dry_run: boolean;
  status: string;
  message: string;
  production_model_integrity_verified: boolean;
  feature_drift_status: Record<string, unknown>;
  data_selection: {
    evaluation_date: string;
    window_start_date: string;
    window_end_date: string;
    total_candidates_found: number;
    eligible_count: number;
    rejected_count: number;
    training_sample_count: number;
    validation_sample_count: number;
    minimum_sample_threshold: number;
    is_sample_size_sufficient: boolean;
    is_validation_split_sufficient: boolean;
    records_audit: Array<{
      ipo_id: string;
      company_name: string;
      ipo_close_date: string;
      included: boolean;
      split?: string;
      rejection_reason?: string;
    }>;
  };
  candidate_metadata: CandidateMetadataData | null;
  comparison_metrics: ModelComparisonData | null;
  promotion_decision: PromotionDecisionData;
  manifest_path: string | null;
}

// ==========================================
// Phase 21: Live 15-Day IPO Intelligence Types
// ==========================================

export interface GMPIndicatorData {
  gmp_in_inr: number | null;
  gmp_percentage: number | null;
  source: string;
  source_url?: string | null;
  observed_at?: string | null;
  disclaimer: string;
  status: 'ACTIVE' | 'STALE' | 'UNAVAILABLE' | string;
}

export interface PredictedSubscriptionsData {
  total: number;
  qib: number;
  nii: number;
  retail: number;
  recommended_category: string;
  confidence_level: string;
  confidence_score: number;
  overall_risk_level: string;
  composite_risk_score?: number;
  prediction_id?: string | null;
  prediction_timestamp?: string | null;
  cutoff_timestamp?: string | null;
  prediction_status?: string | null;
  prediction_source?: string | null;
  feature_snapshot_timestamp?: string | null;
  model_version?: string | null;
  model_integrity_verified?: boolean;
  ex_ante?: boolean;
}

export interface ActualSubscriptionsData {
  total: number;
  qib: number;
  nii: number;
  retail: number;
  strongest_category: string;
}

export interface ListingMetricsData {
  listing_date?: string | null;
  issue_price: number;
  actual_listing_price?: number | null;
  listing_gain_pct?: number | null;
  gmp_implied_listing_price?: number | null;
  gmp_implied_gain_pct?: number | null;
  implied_price_label: string;
}

export interface IPOIntelligenceCardData {
  ipo_id: string;
  company_name: string;
  isin?: string;
  sector: string;
  ipo_open_date: string;
  ipo_close_date: string;
  listing_date?: string | null;
  price_low: number;
  price_high: number;
  issue_size_in_crore: number;
  lot_size: number;
  status: string;
  record_source?: string;
  data_status?: string;
  last_updated_ist?: string;
}

export interface UpcomingIPOForecastData extends IPOIntelligenceCardData {
  days_until_open: number;
  days_until_close?: number | null;
  bidding_day?: number | null;
  total_bidding_days?: number | null;
  gmp_data?: GMPIndicatorData | null;
  gmp_implied_listing_price?: number | null;
  gmp_implied_gain_pct?: number | null;
  gmp_forecast_note: string;
  predicted_subscriptions?: PredictedSubscriptionsData | null;
  top_positive_factors?: Array<{ feature_name: string; shap_value: number }>;
  top_negative_factors?: Array<{ feature_name: string; shap_value: number }>;
  prediction_status: string;
  data_sources?: Array<{ field: string; source: string; observed_at: string; status: string }>;
  live_subscription_multiple?: number | null;
  exchange_status?: string;
}

export interface PastIPOResultData extends IPOIntelligenceCardData {
  days_since_close: number;
  actual_subscriptions?: ActualSubscriptionsData | null;
  has_ex_ante_prediction: boolean;
  predicted_subscriptions?: PredictedSubscriptionsData | null;
  prediction_error_ae?: number | null;
  prediction_error_ape_pct?: number | null;
  listing_metrics?: ListingMetricsData | null;
  closing_gmp?: GMPIndicatorData | null;
  outcome_source: string;
  outcome_observed_at?: string | null;
}

export interface MarketOverviewSummaryData {
  reference_date: string;
  upcoming_ipos_count: number;
  active_bidding_count: number;
  recently_closed_count: number;
  avg_recent_listing_gain_pct?: number | null;
  avg_recent_total_subscription?: number | null;
  strongest_recent_sector?: string | null;
  last_updated_ist?: string;
  data_status?: string;
  sources_health?: Record<string, any>;
  gmp_disclaimer: string;
}

export interface IPODeepDiveResponseData {
  card: IPOIntelligenceCardData;
  timeline: Array<{ milestone: string; timestamp: string; status: string }>;
  forecast?: UpcomingIPOForecastData | null;
  past_result?: PastIPOResultData | null;
  feature_snapshot?: Record<string, any> | null;
  source_provenance: Array<{ field: string; source: string; url: string; confidence: string }>;
}

export interface SourcesHealthData {
  service: string;
  overall_status: string;
  data_status: string;
  cache: {
    status: string;
    age_seconds?: number | null;
    ttl_seconds: number;
    last_updated_ist?: string | null;
  };
  sources: Record<string, any>;
}

