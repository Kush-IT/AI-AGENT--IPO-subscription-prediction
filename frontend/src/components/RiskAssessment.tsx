import React from 'react';
import { AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { RiskAssessmentData } from '../api/types';

interface RiskAssessmentProps {
  riskData: RiskAssessmentData;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ riskData }) => {
  const isHigh = riskData.overall_risk_level === 'HIGH';
  const isMedium = riskData.overall_risk_level === 'MEDIUM';

  const badgeClass = isHigh ? 'badge-low' : isMedium ? 'badge-medium' : 'badge-high';

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <AlertOctagon size={18} color={isHigh ? 'var(--accent-negative)' : isMedium ? 'var(--accent-warning)' : 'var(--accent-positive)'} />
          <span>Multi-Dimensional Risk Audit</span>
        </h3>
        <span className={`badge ${badgeClass}`}>
          {riskData.overall_risk_level} RISK ({riskData.composite_risk_score} Penalty Points)
        </span>
      </div>

      {riskData.identified_risk_factors.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1rem', backgroundColor: 'var(--accent-positive-bg)', borderRadius: '8px', color: 'var(--accent-positive)' }}>
          <CheckCircle size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            No critical structural, solvency, valuation, or volatility risk warnings identified.
          </span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {riskData.identified_risk_factors.map((rf, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <AlertTriangle size={15} color="var(--accent-warning)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e' }}>
                  {rf.risk_type.replace(/_/g, ' ')}
                </span>
                <span className="badge badge-medium" style={{ marginLeft: 'auto', fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                  {rf.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#78350f', lineHeight: 1.4 }}>
                {rf.rationale}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
