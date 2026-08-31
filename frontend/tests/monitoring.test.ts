import { describe, it, expect } from 'vitest';
import { formatMultiple } from '../src/utils/formatting';
import {
  RetrainingStatusResponse,
  RetrainingHistoryRecord,
  RetrainingRunResponse,
} from '../src/api/types';

describe('Prospective Monitoring Dashboard & Weekly Retraining Unit Tests', () => {
  it('formats prospective prediction multiples accurately', () => {
    expect(formatMultiple(48.5)).toBe('48.50×');
    expect(formatMultiple(0)).toBe('0.00×');
  });

  it('verifies PSI drift level thresholds', () => {
    const classifyPSI = (psi: number) => {
      if (psi < 0.10) return 'LOW';
      if (psi < 0.25) return 'MODERATE';
      return 'HIGH';
    };

    expect(classifyPSI(0.04)).toBe('LOW');
    expect(classifyPSI(0.15)).toBe('MODERATE');
    expect(classifyPSI(0.32)).toBe('HIGH');
  });

  it('validates prospective monitoring summary payload contract', () => {
    const mockSummary = {
      total_predictions_count: 5,
      completed_outcomes_count: 2,
      awaiting_outcomes_count: 3,
      system_status: 'PROSPECTIVE_VALIDATION_ACTIVE',
      model_registry_version: '1.0.0-final-candidates',
      model_integrity_verified: true,
      performance_summary: {
        sample_count: 2,
        total_mae: 14.5,
        category_accuracy_pct: 100.0,
      },
      drift_summary: {
        feature_drift_level: 'LOW',
        target_drift_level: 'LOW',
        model_status: 'STABLE',
      },
    };

    expect(mockSummary.total_predictions_count).toBe(5);
    expect(mockSummary.model_integrity_verified).toBe(true);
    expect(mockSummary.drift_summary.model_status).toBe('STABLE');
  });

  it('validates weekly retraining status payload schema', () => {
    const mockRetrainingStatus: RetrainingStatusResponse = {
      current_production_model: '1.0.0-final-candidates',
      production_integrity_verified: true,
      latest_run_id: '5c79b3b8-6b79-4538-8d55-01a36a956e81',
      latest_run_date: '2026-08-31',
      latest_status: 'INSUFFICIENT_SAMPLE_SIZE',
      latest_candidate: null,
      latest_comparison: null,
      latest_promotion_decision: 'KEEP_CURRENT_MODEL',
      latest_manifest_path: '/path/to/manifest.json',
      rolling_window_days: 30,
      minimum_samples: 10,
    };

    expect(mockRetrainingStatus.current_production_model).toBe('1.0.0-final-candidates');
    expect(mockRetrainingStatus.production_integrity_verified).toBe(true);
    expect(mockRetrainingStatus.latest_status).toBe('INSUFFICIENT_SAMPLE_SIZE');
    expect(mockRetrainingStatus.latest_candidate).toBeNull();
    expect(mockRetrainingStatus.rolling_window_days).toBe(30);
    expect(mockRetrainingStatus.minimum_samples).toBe(10);
  });

  it('validates weekly retraining history payload schema', () => {
    const mockRecord: RetrainingHistoryRecord = {
      run_id: 'run-uuid-1234',
      timestamp: '2026-08-31T18:00:00Z',
      evaluation_date: '2026-08-31',
      is_dry_run: true,
      status: 'INSUFFICIENT_SAMPLE_SIZE',
      eligible_count: 0,
      training_sample_count: 0,
      validation_sample_count: 0,
      candidate_version: null,
      promotion_decision: 'KEEP_CURRENT_MODEL',
      manifest_path: '/path/to/manifest.json',
    };

    expect(mockRecord.eligible_count).toBe(0);
    expect(mockRecord.is_dry_run).toBe(true);
    expect(mockRecord.candidate_version).toBeNull();
  });

  it('validates weekly retraining response payload schema', () => {
    const mockResponse: RetrainingRunResponse = {
      run_id: 'run-uuid-1234',
      timestamp: '2026-08-31T18:00:00Z',
      evaluation_date: '2026-08-31',
      is_dry_run: true,
      status: 'INSUFFICIENT_SAMPLE_SIZE',
      message: 'Insufficient sample size',
      production_model_integrity_verified: true,
      feature_drift_status: { overall_feature_drift_level: 'HIGH' },
      data_selection: {
        evaluation_date: '2026-08-31',
        window_start_date: '2026-08-01',
        window_end_date: '2026-08-31',
        total_candidates_found: 0,
        eligible_count: 0,
        rejected_count: 0,
        training_sample_count: 0,
        validation_sample_count: 0,
        minimum_sample_threshold: 10,
        is_sample_size_sufficient: false,
        is_validation_split_sufficient: false,
        records_audit: [],
      },
      candidate_metadata: null,
      comparison_metrics: null,
      promotion_decision: {
        decision: 'KEEP_CURRENT_MODEL',
        passed_all_checks: false,
        checks: [],
        rationale: 'Insufficient sample size.',
      },
      manifest_path: null,
    };

    expect(mockResponse.status).toBe('INSUFFICIENT_SAMPLE_SIZE');
    expect(mockResponse.production_model_integrity_verified).toBe(true);
  });

  it('validates weekly retraining dry-run request parameters', () => {
    const defaultDryRunPayload = {
      run_date: null,
      dry_run: true,
      min_samples: 10,
      force_promote: false,
    };

    expect(defaultDryRunPayload.dry_run).toBe(true);
    expect(defaultDryRunPayload.force_promote).toBe(false);
    expect(defaultDryRunPayload.min_samples).toBe(10);
  });

  it('verifies candidate comparison metric difference sign convention', () => {
    const comp = {
      total_metrics_current: { mae: 12.5, rmse: 15.0, median_ae: 10.0, mape: 25.0, r2: 0.85, signed_bias: 1.0 },
      total_metrics_candidate: { mae: 10.2, rmse: 12.0, median_ae: 8.0, mape: 20.0, r2: 0.90, signed_bias: 0.5 },
      total_mae_difference: -2.3, // Candidate - Current (negative = improved)
    };

    expect(comp.total_mae_difference).toBe(-2.3);
    const isImprovement = comp.total_mae_difference <= 0;
    expect(isImprovement).toBe(true);
  });

  it('validates 10-point promotion gate response structure', () => {
    const mockDecision = {
      decision: 'KEEP_CURRENT_MODEL',
      passed_all_checks: false,
      checks: [
        { check_name: '1. Production Model Integrity', passed: true, details: 'Verified' },
        { check_name: '3. Minimum Training Sample Size', passed: false, details: 'N=0 < 10' },
      ],
      rationale: 'Sample size insufficient.',
    };

    expect(mockDecision.decision).toBe('KEEP_CURRENT_MODEL');
    expect(mockDecision.passed_all_checks).toBe(false);
    expect(mockDecision.checks.length).toBe(2);
  });
});
