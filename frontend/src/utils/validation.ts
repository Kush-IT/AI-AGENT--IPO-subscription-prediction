/**
 * Client-Side IPO Form Pre-Flight Validation.
 */
import { IPOAnalysisRequest } from '../api/types';

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateIPOForm(values: Partial<IPOAnalysisRequest>): FormValidationResult {
  const errors: Record<string, string> = {};

  if (!values.company_name || values.company_name.trim() === '') {
    errors.company_name = 'Company name is required.';
  }

  if (!values.ipo_open_date || values.ipo_open_date.trim() === '') {
    errors.ipo_open_date = 'IPO subscription open date is required.';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(values.ipo_open_date)) {
      errors.ipo_open_date = 'Date must be in YYYY-MM-DD format.';
    }
  }

  if (values.issue_size_in_crore === undefined || isNaN(values.issue_size_in_crore) || values.issue_size_in_crore <= 0) {
    errors.issue_size_in_crore = 'Issue size must be a positive number (> 0 Cr).';
  }

  if (values.price_high === undefined || isNaN(values.price_high) || values.price_high <= 0) {
    errors.price_high = 'Upper cap price must be > 0.';
  }

  if (values.price_low !== undefined && values.price_low !== null && !isNaN(values.price_low)) {
    if (values.price_low <= 0) {
      errors.price_low = 'Floor price must be > 0.';
    } else if (values.price_high !== undefined && values.price_low > values.price_high) {
      errors.price_low = `Floor price (₹${values.price_low}) cannot exceed Cap price (₹${values.price_high}).`;
    }
  }

  if (values.qib_quota_pct !== undefined && (values.qib_quota_pct < 0 || values.qib_quota_pct > 100)) {
    errors.qib_quota_pct = 'QIB quota must be between 0% and 100%.';
  }

  if (values.nii_quota_pct !== undefined && (values.nii_quota_pct < 0 || values.nii_quota_pct > 100)) {
    errors.nii_quota_pct = 'NII quota must be between 0% and 100%.';
  }

  if (values.retail_quota_pct !== undefined && (values.retail_quota_pct < 0 || values.retail_quota_pct > 100)) {
    errors.retail_quota_pct = 'Retail quota must be between 0% and 100%.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
