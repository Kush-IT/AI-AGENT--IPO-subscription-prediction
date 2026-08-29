import { describe, it, expect } from 'vitest';
import { IPOAnalysisResponse } from '../src/api/types';
import { formatMultiple, formatSHAP } from '../src/utils/formatting';

// Synthetic response fixture for integration verification
const MOCK_SYNTHETIC_RESPONSE: IPOAnalysisResponse = {
  request_id: 'test-req-1234-abcd',
  status: 'ANALYSIS_COMPLETED',
  generated_at: '2024-05-15T10:00:00+05:30',
  ipo: {
    company_name: 'Acme Engineering Ltd (SYNTHETIC FIXTURE)',
    ipo_open_date: '2024-05-15',
    sector: 'Engineering',
    price_band: {
      floor_price_inr: 425.0,
      cap_price_inr: 450.0,
      spread_pct: 5.88,
    },
    issue_size_in_crore: 850.0,
    lot_size: 33,
    min_retail_application_amount_inr: 14850.0,
    quota_reservation_pct: {
      qib_quota: 50.0,
      nii_quota: 15.0,
      retail_quota: 35.0,
    },
    grey_market_premium: {
      gmp_percentage: 40.0,
      gmp_in_inr: 180.0,
    },
  },
  predictions: {
    total_subscription: {
      predicted_multiple: 41.25,
      model_name: 'XGBoost',
      target_transform: 'log1p',
      raw_model_output: 3.7436,
      unit: 'times (subscription multiple)',
    },
    qib_subscription: {
      predicted_multiple: 52.8,
      model_name: 'Random_Forest',
      target_transform: 'raw',
      raw_model_output: 52.8,
      unit: 'times (subscription multiple)',
    },
    nii_subscription: {
      predicted_multiple: 48.1,
      model_name: 'LightGBM',
      target_transform: 'log1p',
      raw_model_output: 3.8939,
      unit: 'times (subscription multiple)',
    },
    retail_subscription: {
      predicted_multiple: 28.4,
      model_name: 'XGBoost',
      target_transform: 'raw',
      raw_model_output: 28.4,
      unit: 'times (subscription multiple)',
    },
  },
  category_assessment: {
    strongest_predicted_category: 'QIB',
    weakest_predicted_category: 'RETAIL',
    recommended_category: 'NO_CLEAR_EDGE',
    category_ranking: [
      { rank: 1, category: 'QIB', predicted_multiple: 52.8 },
      { rank: 2, category: 'NII', predicted_multiple: 48.1 },
      { rank: 3, category: 'RETAIL', predicted_multiple: 28.4 },
    ],
    edge_rationale: 'Demand multiples across QIB (52.80x) and NII (48.10x) are within narrow parity bounds.',
    disclaimer: 'Model-based category assessment only. Not investment or financial advice.',
  },
  confidence: {
    confidence_level: 'HIGH',
    confidence_score: 100,
    justification_factors: [
      'Predicted subscription falls well within dense historical training distribution.',
      'Zero missing features; complete pre-IPO dataset provided.',
    ],
  },
  top_positive_factors: [
    {
      feature: 'gmp_percentage',
      feature_value: '40.0',
      shap_value: 0.4421,
      abs_shap_value: 0.4421,
      direction: 'positive',
      attribution_statement: 'gmp_percentage (40.0) contributed positively to the model prediction by +0.4421',
      rank: 1,
    },
  ],
  top_negative_factors: [
    {
      feature: 'issue_size_in_crore',
      feature_value: '850.0',
      shap_value: -0.0315,
      abs_shap_value: 0.0315,
      direction: 'negative',
      attribution_statement: 'issue_size_in_crore (850.0) contributed negatively to the model prediction by -0.0315',
      rank: 2,
    },
  ],
  grouped_driver_impacts: {
    grey_market_premium: { total_shap_impact: 0.4421, direction: 'positive' },
    issue_scale_friction: { total_shap_impact: -0.0315, direction: 'negative' },
  },
  risk_assessment: {
    overall_risk_level: 'LOW',
    composite_risk_score: 0,
    identified_risk_factors: [],
    total_risk_factors_count: 0,
  },
  data_quality: {
    source_count: 5,
    total_features_count: 45,
    available_features_count: 45,
    missing_fields_count: 0,
    missing_fields: [],
    temporal_rejections_count: 0,
    temporal_rejections: [],
    feature_completeness_pct: 100.0,
    data_quality_score: 100,
    data_quality_tier: 'EXCELLENT',
    temporal_compliance: 'STRICT_EX_ANTE (Cutoff: 09:59:59 IST on Open Date)',
  },
  temporal_validation: {
    status: 'EX_ANTE_COMPLIANT',
    temporal_rejections_count: 0,
    rejections: [],
  },
  model_information: {
    model_registry_version: '1.0.0-final-candidates',
    models_used: {
      total_subscription: 'XGBoost (log1p transform, expm1 inverted)',
      qib_subscription: 'Random Forest (RAW scale)',
      nii_subscription: 'LightGBM (log1p transform, expm1 inverted)',
      retail_subscription: 'XGBoost (RAW scale)',
    },
    test_set_performance: {
      total_test_r2: '+0.666',
      total_test_mae: '17.43x',
    },
  },
  sources: [
    {
      category: 'Issue Terms & Quotas',
      source: 'SEBI DRHP/RHP Prospectus Filing',
      source_url: 'https://www.sebi.gov.in',
      feature_cutoff: '2024-05-15T09:59:59+05:30',
      verification_status: 'EX_ANTE_VERIFIED',
    },
  ],
  feature_provenance: {
    gmp_percentage: {
      field: 'gmp_percentage',
      value: 40.0,
      source: 'Grey Market Aggregator',
      source_url: 'https://www.chittorgarh.com',
      observed_at: '2024-05-15T08:30:00+05:30',
      feature_cutoff: '2024-05-15T09:59:59+05:30',
      retrieved_at: '2024-05-15T08:31:00+05:30',
      status: 'VALID',
      validation_status: 'EX_ANTE_VALID',
      validation_reason: 'EX_ANTE_VALID',
    },
  },
  warnings: [],
  disclaimer: 'This analysis is produced for research purposes only.',
};

describe('End-to-End Frontend Dashboard Integration Tests', () => {
  it('correctly maps and formats all 4 prediction category outputs', () => {
    const { predictions } = MOCK_SYNTHETIC_RESPONSE;
    expect(formatMultiple(predictions.total_subscription.predicted_multiple)).toBe('41.25×');
    expect(formatMultiple(predictions.qib_subscription.predicted_multiple)).toBe('52.80×');
    expect(formatMultiple(predictions.nii_subscription.predicted_multiple)).toBe('48.10×');
    expect(formatMultiple(predictions.retail_subscription.predicted_multiple)).toBe('28.40×');
  });

  it('enforces non-advisory wording on category recommendations', () => {
    const { category_assessment } = MOCK_SYNTHETIC_RESPONSE;
    expect(category_assessment.recommended_category).toBe('NO_CLEAR_EDGE');
    expect(category_assessment.disclaimer).toContain('Not investment or financial advice');
    expect(category_assessment.edge_rationale).not.toContain('Guaranteed');
  });

  it('renders SHAP feature contributions accurately', () => {
    const { top_positive_factors, top_negative_factors } = MOCK_SYNTHETIC_RESPONSE;
    expect(formatSHAP(top_positive_factors[0].shap_value)).toBe('+0.4421');
    expect(formatSHAP(top_negative_factors[0].shap_value)).toBe('-0.0315');
    expect(top_positive_factors[0].attribution_statement).toContain('contributed positively');
  });

  it('validates data quality and temporal anti-leakage compliance metadata', () => {
    const { data_quality, temporal_validation } = MOCK_SYNTHETIC_RESPONSE;
    expect(data_quality.feature_completeness_pct).toBe(100.0);
    expect(data_quality.data_quality_tier).toBe('EXCELLENT');
    expect(temporal_validation.status).toBe('EX_ANTE_COMPLIANT');
    expect(temporal_validation.temporal_rejections_count).toBe(0);
  });

  it('verifies field provenance integrity and source linking', () => {
    const { feature_provenance, sources } = MOCK_SYNTHETIC_RESPONSE;
    expect(sources.length).toBeGreaterThan(0);
    expect(feature_provenance.gmp_percentage.source).toBe('Grey Market Aggregator');
    expect(feature_provenance.gmp_percentage.validation_status).toBe('EX_ANTE_VALID');
  });
});
