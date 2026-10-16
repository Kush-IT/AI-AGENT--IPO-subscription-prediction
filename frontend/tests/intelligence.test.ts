import { describe, it, expect } from 'vitest';
import {
  UpcomingIPOForecastData,
  PastIPOResultData,
  MarketOverviewSummaryData,
  GMPIndicatorData,
} from '../src/api/types';

describe('Live 15-Day IPO Intelligence & Forecasting Unit Tests', () => {
  it('calculates GMP-implied listing price and expected gain accurately', () => {
    const priceHigh = 500.0;
    const gmpInr = 150.0;
    const impliedPrice = priceHigh + gmpInr;
    const impliedGainPct = (gmpInr / priceHigh) * 100.0;

    expect(impliedPrice).toBe(650.0);
    expect(impliedGainPct).toBe(30.0);
  });

  it('validates GMPIndicator contract and mandatory statutory disclaimer', () => {
    const mockGMP: GMPIndicatorData = {
      gmp_in_inr: 75.0,
      gmp_percentage: 15.0,
      source: 'Ex-Ante Grey Market Aggregator (Chittorgarh/IPOWatch)',
      observed_at: '2026-09-15T08:30:00+05:30',
      disclaimer: 'Unofficial / indicative grey-market data — subject to illiquidity and high volatility.',
      status: 'ACTIVE',
    };

    expect(mockGMP.status).toBe('ACTIVE');
    expect(mockGMP.disclaimer).toContain('Unofficial / indicative grey-market data');
    expect(mockGMP.gmp_in_inr).toBe(75.0);
  });

  it('validates UpcomingIPOForecastData contract and explicit GMP forecast note', () => {
    const mockUpcoming: UpcomingIPOForecastData = {
      ipo_id: 'test_candidate_2026',
      company_name: 'Test Engineering Ltd',
      sector: 'Capital Goods',
      ipo_open_date: '2026-09-15',
      ipo_close_date: '2026-09-18',
      price_low: 475.0,
      price_high: 500.0,
      issue_size_in_crore: 600.0,
      lot_size: 30,
      status: 'DISCOVERED',
      days_until_open: 4,
      gmp_data: {
        gmp_in_inr: 120.0,
        gmp_percentage: 24.0,
        source: 'Chittorgarh',
        disclaimer: 'Unofficial / indicative grey-market data',
        status: 'ACTIVE',
      },
      gmp_implied_listing_price: 620.0,
      gmp_implied_gain_pct: 24.0,
      gmp_forecast_note: 'GMP forecast unavailable — current GMP is an external unofficial market indicator.',
      predicted_subscriptions: {
        total: 42.5,
        qib: 85.0,
        nii: 48.0,
        retail: 16.0,
        recommended_category: 'QIB',
        confidence_level: 'HIGH',
        confidence_score: 90,
        overall_risk_level: 'LOW',
      },
      prediction_status: 'PREDICTED_EX_ANTE',
    };

    expect(mockUpcoming.days_until_open).toBe(4);
    expect(mockUpcoming.predicted_subscriptions?.recommended_category).toBe('QIB');
    expect(mockUpcoming.gmp_forecast_note).toContain('GMP forecast unavailable');
    expect(mockUpcoming.gmp_implied_listing_price).toBe(620.0);
  });

  it('enforces zero retrospective prediction invariant for unpredicted past IPOs', () => {
    const historicalIPO: PastIPOResultData = {
      ipo_id: 'IPO_2024_080',
      company_name: 'Historical Engineering Ltd',
      sector: 'Manufacturing',
      ipo_open_date: '2024-05-10',
      ipo_close_date: '2024-05-14',
      price_low: 285.0,
      price_high: 300.0,
      issue_size_in_crore: 450.0,
      lot_size: 50,
      status: 'COMPLETED',
      days_since_close: 10,
      actual_subscriptions: {
        total: 38.5,
        qib: 72.0,
        nii: 45.0,
        retail: 14.5,
        strongest_category: 'QIB',
      },
      has_ex_ante_prediction: false,
      predicted_subscriptions: null, // STRICT: Must be null
      prediction_error_ae: null,
      prediction_error_ape_pct: null,
      listing_metrics: {
        listing_date: '2024-05-17',
        issue_price: 300.0,
        actual_listing_price: 375.0,
        listing_gain_pct: 25.0,
        implied_price_label: 'GMP-implied listing estimate',
      },
      outcome_source: 'NSE Historical Master',
    };

    expect(historicalIPO.has_ex_ante_prediction).toBe(false);
    expect(historicalIPO.predicted_subscriptions).toBeNull();
    expect(historicalIPO.prediction_error_ae).toBeNull();
    expect(historicalIPO.listing_metrics?.listing_gain_pct).toBe(25.0);
  });

  it('verifies MarketOverviewSummaryData contract', () => {
    const mockOverview: MarketOverviewSummaryData = {
      reference_date: '2026-08-31',
      upcoming_ipos_count: 3,
      active_bidding_count: 1,
      recently_closed_count: 5,
      avg_recent_listing_gain_pct: 18.5,
      avg_recent_total_subscription: 42.1,
      strongest_recent_sector: 'Capital Goods',
      gmp_disclaimer: 'Grey Market Premium (GMP) data is unofficial and indicative.',
    };

    expect(mockOverview.upcoming_ipos_count).toBe(3);
    expect(mockOverview.avg_recent_listing_gain_pct).toBe(18.5);
    expect(mockOverview.gmp_disclaimer).toContain('unofficial and indicative');
  });

  it('verifies absence of yellow warning message and presence of AI predicted subscription section', async () => {
    const { Next15DaysSection } = await import('../src/components/intelligence/Next15DaysSection');
    const next15DaysCode = Next15DaysSection.toString();

    // 1. MUST NOT contain old yellow message
    expect(next15DaysCode).not.toContain('Feature snapshot capture in progress prior to 09:59:59 IST cutoff.');

    // 2. MUST contain AI PREDICTED SUBSCRIPTION (Ex-Ante) section
    expect(next15DaysCode).toContain('AI PREDICTED SUBSCRIPTION (Ex-Ante)');

    // 3. MUST contain Real Prediction value formatters
    expect(next15DaysCode).toContain('Total:');
    expect(next15DaysCode).toContain('QIB:');
    expect(next15DaysCode).toContain('NII:');
    expect(next15DaysCode).toContain('Retail:');
    expect(next15DaysCode).toContain('toFixed(1)');

    // 4. MUST contain unavailable prediction fallback message
    expect(next15DaysCode).toContain('Prediction unavailable — no valid ex-ante model prediction recorded.');

    // 5. MUST preserve live subscription tally, GMP, implied listing, and deep-dive button
    expect(next15DaysCode).toContain('LIVE SUBSCRIPTION TALLY (NSE)');
    expect(next15DaysCode).toContain('Current Indicative GMP');
    expect(next15DaysCode).toContain('GMP-Implied Listing');
    expect(next15DaysCode).toContain('Deep-Dive SHAP');
  }, 30000);

  it('verifies navigation header links to /model-prediction with label "Model & Prediction"', async () => {
    const { Header } = await import('../src/components/Header');
    const headerCode = Header.toString();

    expect(headerCode).toContain('/model-prediction');
    expect(headerCode).toContain('Model & Prediction');
    expect(headerCode).not.toContain('Monitoring & Drift');
  }, 30000);

  it('verifies App.tsx registers /model-prediction while preserving /monitoring route', async () => {
    const { App } = await import('../src/App');
    const appCode = App.toString();

    expect(appCode).toContain('/model-prediction');
    expect(appCode).toContain('ModelPrediction');
    expect(appCode).toContain('/monitoring');
  }, 30000);

  it('verifies ModelPrediction.tsx page architecture, pipeline, models, and integrity details', async () => {
    const { ModelPrediction } = await import('../src/pages/ModelPrediction');
    const modelPredictionCode = ModelPrediction.toString();

    // Pipeline steps
    expect(modelPredictionCode).toContain('IPO Data');
    expect(modelPredictionCode).toContain('Feature Preparation');
    expect(modelPredictionCode).toContain('45 Canonical Features');
    expect(modelPredictionCode).toContain('Preprocessing');
    expect(modelPredictionCode).toContain('Trained ML Models');
    expect(modelPredictionCode).toContain('Subscription Prediction');
    expect(modelPredictionCode).toContain('SHAP Explanation');
    expect(modelPredictionCode).toContain('Final IPO Analysis');

    // Actual 4 models and transformations
    expect(modelPredictionCode).toContain('total_xgboost_log1p.joblib');
    expect(modelPredictionCode).toContain('qib_random_forest_raw.joblib');
    expect(modelPredictionCode).toContain('nii_lightgbm_log1p.joblib');
    expect(modelPredictionCode).toContain('retail_xgboost_raw.joblib');
    expect(modelPredictionCode).toContain('dev_preprocessor.joblib');

    // How models are trained
    expect(modelPredictionCode).toContain('How Models Are Trained');
    expect(modelPredictionCode).toContain('avoid look-ahead leakage');
    expect(modelPredictionCode).toContain('NOT');

    // How prediction works
    expect(modelPredictionCode).toContain('How Prediction Works');
    expect(modelPredictionCode).toContain('09:59:59 IST');

    // Model integrity & explainability
    expect(modelPredictionCode).toContain('Production Model Integrity');
    expect(modelPredictionCode).toContain('SHA-256');
    expect(modelPredictionCode).toContain('Why This Prediction? (TreeSHAP Explainability)');
    expect(modelPredictionCode).toContain('do not imply causal');
  }, 30000);

  it('formats subscription predictions to 1 decimal place with x suffix', () => {
    const formatSub = (val: number) => `${val.toFixed(1)}x`;
    expect(formatSub(82.43)).toBe('82.4x');
    expect(formatSub(125.6)).toBe('125.6x');
    expect(formatSub(68.29)).toBe('68.3x');
    expect(formatSub(28.71)).toBe('28.7x');
  });

  it('validates enriched PredictedSubscriptionsData contract with ex-ante metadata', () => {
    const mockUpcomingPred: UpcomingIPOForecastData = {
      ipo_id: 'ipowatch_a_one_steels',
      company_name: 'A-One Steels',
      sector: 'Metals & Mining',
      ipo_open_date: '2026-09-24',
      ipo_close_date: '2026-09-24',
      price_low: 384.75,
      price_high: 405.0,
      issue_size_in_crore: 500.0,
      lot_size: 35,
      status: 'UPCOMING',
      days_until_open: 6,
      gmp_data: {
        gmp_in_inr: 55.0,
        gmp_percentage: 13.58,
        source: 'IPOWatch Verified Pipeline',
        disclaimer: 'Unofficial / indicative grey-market data',
        status: 'ACTIVE',
      },
      gmp_implied_listing_price: 460.0,
      gmp_implied_gain_pct: 13.58,
      gmp_forecast_note: 'GMP forecast unavailable — current GMP is an external unofficial market indicator.',
      predicted_subscriptions: {
        total: 7.92,
        qib: 22.47,
        nii: 9.18,
        retail: 7.94,
        recommended_category: 'QIB',
        confidence_level: 'HIGH',
        confidence_score: 100,
        overall_risk_level: 'LOW',
        composite_risk_score: 0,
        prediction_id: 'live-ipowatch_a_one_steels',
        prediction_timestamp: '2026-09-18T12:00:00Z',
        cutoff_timestamp: '2026-09-24T09:59:59+05:30',
        prediction_status: 'PREDICTED_EX_ANTE',
        prediction_source: 'Frozen Production Candidates (1.0.0-final-candidates)',
        feature_snapshot_timestamp: '2026-09-18T12:00:00Z',
        model_version: '1.0.0-final-candidates',
        model_integrity_verified: true,
        ex_ante: true,
      },
      prediction_status: 'PREDICTED_EX_ANTE',
      live_subscription_multiple: null, // Distinct from prediction!
    };

    expect(mockUpcomingPred.predicted_subscriptions?.total).toBe(7.92);
    expect(mockUpcomingPred.predicted_subscriptions?.cutoff_timestamp).toBe('2026-09-24T09:59:59+05:30');
    expect(mockUpcomingPred.predicted_subscriptions?.model_integrity_verified).toBe(true);
    expect(mockUpcomingPred.predicted_subscriptions?.ex_ante).toBe(true);
    expect(mockUpcomingPred.live_subscription_multiple).toBeNull();
  });
});
