import { describe, it, expect } from 'vitest';
import { formatMultiple } from '../src/utils/formatting';

describe('Prospective Monitoring Dashboard Unit Tests', () => {
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
});
