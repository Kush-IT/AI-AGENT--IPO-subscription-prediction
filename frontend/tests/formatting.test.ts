import { describe, it, expect } from 'vitest';
import {
  formatMultiple,
  formatPercent,
  formatCrores,
  formatSHAP,
  formatTimestamp,
} from '../src/utils/formatting';

describe('Formatting Utilities', () => {
  it('formats subscription multiples with 2 decimal precision and multiplier symbol', () => {
    expect(formatMultiple(45.234)).toBe('45.23×');
    expect(formatMultiple(0)).toBe('0.00×');
    expect(formatMultiple(null)).toBe('N/A');
  });

  it('formats percentage values accurately', () => {
    expect(formatPercent(18.5)).toBe('18.50%');
    expect(formatPercent(null)).toBe('N/A');
  });

  it('formats INR crore currency', () => {
    expect(formatCrores(1250.5)).toContain('1,250.5 Cr');
    expect(formatCrores(null)).toBe('N/A');
  });

  it('formats SHAP attribution values with explicit signs', () => {
    expect(formatSHAP(0.4421)).toBe('+0.4421');
    expect(formatSHAP(-0.0315)).toBe('-0.0315');
    expect(formatSHAP(0)).toBe('0.0000');
  });

  it('handles timestamp formatting safely', () => {
    const ts = '2024-05-15T09:59:59+05:30';
    const formatted = formatTimestamp(ts);
    expect(formatted).toContain('2024');
    expect(formatTimestamp(null)).toBe('N/A');
  });
});
