import React from 'react';
import { Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { TemporalValidationData } from '../api/types';

interface TemporalValidationProps {
  validation: TemporalValidationData;
  openDate: string;
}

export const TemporalValidation: React.FC<TemporalValidationProps> = ({ validation, openDate }) => {
  const isCompliant = validation.status === 'EX_ANTE_COMPLIANT' && validation.temporal_rejections_count === 0;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Clock size={18} color="var(--brand-primary)" />
          <span>Temporal Anti-Leakage Boundary</span>
        </h3>
        <span className={`badge ${isCompliant ? 'badge-high' : 'badge-low'}`}>
          {isCompliant ? '100% EX-ANTE' : 'LOOK-AHEAD REJECTIONS'}
        </span>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Statutory Cutoff Timestamp:</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'JetBrains Mono' }}>
          {openDate}T09:59:59+05:30 (IST)
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
        <div style={{ color: isCompliant ? 'var(--accent-positive)' : 'var(--accent-negative)', marginTop: '0.1rem' }}>
          {isCompliant ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
        </div>
        <div>
          {isCompliant ? (
            <span>
              Zero future lookahead detected. All features, financial statements, and GMP rates were observed strictly prior to the market subscription open.
            </span>
          ) : (
            <span style={{ color: 'var(--accent-negative)' }}>
              {validation.temporal_rejections_count} post-cutoff observation(s) rejected by temporal validator to protect model integrity.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
