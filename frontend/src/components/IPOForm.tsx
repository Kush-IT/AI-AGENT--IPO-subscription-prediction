import React, { useState } from 'react';
import { Play, Sparkles, SlidersHorizontal } from 'lucide-react';
import { IPOAnalysisRequest, ExecutionMode } from '../api/types';
import { validateIPOForm } from '../utils/validation';

interface IPOFormProps {
  onSubmit: (values: IPOAnalysisRequest) => void;
  isLoading: boolean;
}

const DEFAULT_FORM_VALUES: IPOAnalysisRequest = {
  company_name: 'Tata Technologies Ltd',
  ipo_open_date: '2023-11-22',
  ipo_close_date: '2023-11-24',
  sector: 'Technology',
  issue_size_in_crore: 3042.51,
  price_low: 475.0,
  price_high: 500.0,
  lot_size: 30,
  qib_quota_pct: 50.0,
  nii_quota_pct: 15.0,
  retail_quota_pct: 35.0,
  revenue_latest_cr: 4414.18,
  pat_latest_cr: 624.04,
  operating_cash_flow_cr: 580.0,
  ebitda_margin_pct: 23.7,
  revenue_cagr_3yr: 36.2,
  pat_cagr_3yr: 61.5,
  roe_pct: 23.7,
  pe_ratio: 32.5,
  industry_pe: 60.0,
  gmp_percentage: 75.0,
  gmp_in_inr: 375.0,
  positive_news_ratio: 0.88,
  average_sentiment_score: 0.82,
  india_vix: 12.2,
  market_trend: 'BULLISH',
  mode: 'OFFLINE',
};

export const IPOForm: React.FC<IPOFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<IPOAnalysisRequest>(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let parsedVal: unknown = value;
    if (type === 'number') {
      parsedVal = value === '' ? undefined : parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedVal,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleModeChange = (mode: ExecutionMode) => {
    setFormData((prev) => ({ ...prev, mode }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateIPOForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    onSubmit(formData);
  };

  const handleFillSyntheticExample = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setErrors({});
    onSubmit(DEFAULT_FORM_VALUES);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <SlidersHorizontal size={18} color="var(--brand-primary)" />
            <span>Pre-IPO Input Parameters</span>
          </h2>
          <p className="card-subtitle">Ex-ante offering terms & fundamentals observed prior to open</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleFillSyntheticExample}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'none',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              color: 'var(--brand-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Populate verified IPO fixture and analyze"
          >
            <Sparkles size={12} />
            <span>Load Example Fixture</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Mode Selector */}
        <div style={{ marginBottom: '1.25rem', padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>Execution Connector Mode:</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {formData.mode === 'OFFLINE' ? 'Cached / Deterministic' : 'Authoritative Remote Connectors'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleModeChange('OFFLINE')}
              style={{
                padding: '0.45rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: formData.mode === 'OFFLINE' ? 'var(--brand-primary)' : 'var(--border-strong)',
                backgroundColor: formData.mode === 'OFFLINE' ? 'var(--brand-surface)' : '#ffffff',
                color: formData.mode === 'OFFLINE' ? 'var(--brand-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              OFFLINE (Recommended)
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('LIVE')}
              style={{
                padding: '0.45rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: formData.mode === 'LIVE' ? 'var(--brand-primary)' : 'var(--border-strong)',
                backgroundColor: formData.mode === 'LIVE' ? 'var(--brand-surface)' : '#ffffff',
                color: formData.mode === 'LIVE' ? 'var(--brand-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              LIVE (External Sources)
            </button>
          </div>
        </div>

        {/* Mandatory Offer Structure */}
        <div className="form-group">
          <label className="form-label" htmlFor="company_name">Company Name *</label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            className={`form-input ${errors.company_name ? 'error' : ''}`}
            placeholder="e.g. Tata Technologies Ltd"
            value={formData.company_name}
            onChange={handleInputChange}
          />
          {errors.company_name && <p className="form-error-text">{errors.company_name}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="ipo_open_date">Open Date (YYYY-MM-DD) *</label>
            <input
              id="ipo_open_date"
              name="ipo_open_date"
              type="date"
              className={`form-input ${errors.ipo_open_date ? 'error' : ''}`}
              value={formData.ipo_open_date}
              onChange={handleInputChange}
            />
            {errors.ipo_open_date && <p className="form-error-text">{errors.ipo_open_date}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sector">Sector</label>
            <input
              id="sector"
              name="sector"
              type="text"
              className="form-input"
              placeholder="e.g. Technology"
              value={formData.sector || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="issue_size_in_crore">Issue Size (₹ Cr) *</label>
            <input
              id="issue_size_in_crore"
              name="issue_size_in_crore"
              type="number"
              step="0.01"
              className={`form-input ${errors.issue_size_in_crore ? 'error' : ''}`}
              placeholder="e.g. 3042.51"
              value={formData.issue_size_in_crore ?? ''}
              onChange={handleInputChange}
            />
            {errors.issue_size_in_crore && <p className="form-error-text">{errors.issue_size_in_crore}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price_high">Cap Price (₹) *</label>
            <input
              id="price_high"
              name="price_high"
              type="number"
              step="0.05"
              className={`form-input ${errors.price_high ? 'error' : ''}`}
              placeholder="e.g. 500.00"
              value={formData.price_high ?? ''}
              onChange={handleInputChange}
            />
            {errors.price_high && <p className="form-error-text">{errors.price_high}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="price_low">Floor Price (₹)</label>
            <input
              id="price_low"
              name="price_low"
              type="number"
              step="0.05"
              className={`form-input ${errors.price_low ? 'error' : ''}`}
              placeholder="e.g. 475.00"
              value={formData.price_low ?? ''}
              onChange={handleInputChange}
            />
            {errors.price_low && <p className="form-error-text">{errors.price_low}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lot_size">Lot Size (Shares)</label>
            <input
              id="lot_size"
              name="lot_size"
              type="number"
              className="form-input"
              placeholder="e.g. 30"
              value={formData.lot_size ?? ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Quotas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="qib_quota_pct">QIB Quota (%)</label>
            <input
              id="qib_quota_pct"
              name="qib_quota_pct"
              type="number"
              step="0.1"
              className="form-input"
              value={formData.qib_quota_pct ?? ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="nii_quota_pct">NII Quota (%)</label>
            <input
              id="nii_quota_pct"
              name="nii_quota_pct"
              type="number"
              step="0.1"
              className="form-input"
              value={formData.nii_quota_pct ?? ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="retail_quota_pct">Retail (%)</label>
            <input
              id="retail_quota_pct"
              name="retail_quota_pct"
              type="number"
              step="0.1"
              className="form-input"
              value={formData.retail_quota_pct ?? ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Advanced Pre-IPO Indicators Toggle */}
        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span>{showAdvanced ? '▼ Hide Additional Fundamentals & GMP' : '▶ Show Additional Fundamentals & GMP'}</span>
          </button>
        </div>

        {showAdvanced && (
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="gmp_percentage">GMP (%)</label>
                <input
                  id="gmp_percentage"
                  name="gmp_percentage"
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 75.0"
                  value={formData.gmp_percentage ?? ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pe_ratio">P/E Ratio</label>
                <input
                  id="pe_ratio"
                  name="pe_ratio"
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 32.5"
                  value={formData.pe_ratio ?? ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="revenue_latest_cr">Revenue (₹ Cr)</label>
                <input
                  id="revenue_latest_cr"
                  name="revenue_latest_cr"
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.revenue_latest_cr ?? ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pat_latest_cr">PAT (₹ Cr)</label>
                <input
                  id="pat_latest_cr"
                  name="pat_latest_cr"
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.pat_latest_cr ?? ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="india_vix">India VIX</label>
                <input
                  id="india_vix"
                  name="india_vix"
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.india_vix ?? ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="positive_news_ratio">Pos News [0-1]</label>
                <input
                  id="positive_news_ratio"
                  name="positive_news_ratio"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="form-input"
                  value={formData.positive_news_ratio ?? ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          <Play size={16} />
          <span>{isLoading ? 'Analyzing Pre-IPO Dynamics...' : 'Analyze IPO Demand'}</span>
        </button>
      </form>
    </div>
  );
};
