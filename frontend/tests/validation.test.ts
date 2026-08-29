import { describe, it, expect } from 'vitest';
import { validateIPOForm } from '../src/utils/validation';

describe('IPO Form Validation Rules', () => {
  it('validates a complete, valid IPO form without errors', () => {
    const valid = {
      company_name: 'Tata Technologies Ltd',
      ipo_open_date: '2023-11-22',
      issue_size_in_crore: 3042.51,
      price_high: 500.0,
      price_low: 475.0,
      qib_quota_pct: 50.0,
      nii_quota_pct: 15.0,
      retail_quota_pct: 35.0,
    };
    const res = validateIPOForm(valid);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('rejects missing company name and missing date', () => {
    const res = validateIPOForm({
      company_name: '',
      ipo_open_date: '',
      issue_size_in_crore: 500.0,
      price_high: 100.0,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.company_name).toBeDefined();
    expect(res.errors.ipo_open_date).toBeDefined();
  });

  it('rejects negative or zero issue size and price cap', () => {
    const res = validateIPOForm({
      company_name: 'Invalid Corp',
      ipo_open_date: '2024-05-15',
      issue_size_in_crore: -100.0,
      price_high: 0,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.issue_size_in_crore).toBeDefined();
    expect(res.errors.price_high).toBeDefined();
  });

  it('rejects floor price exceeding cap price', () => {
    const res = validateIPOForm({
      company_name: 'Invalid Spread Ltd',
      ipo_open_date: '2024-05-15',
      issue_size_in_crore: 800.0,
      price_high: 450.0,
      price_low: 500.0, // Floor > Cap
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.price_low).toContain('cannot exceed Cap price');
  });

  it('rejects quota values outside 0-100 range', () => {
    const res = validateIPOForm({
      company_name: 'Quota Corp',
      ipo_open_date: '2024-05-15',
      issue_size_in_crore: 800.0,
      price_high: 450.0,
      qib_quota_pct: 120.0, // > 100
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.qib_quota_pct).toBeDefined();
  });
});
