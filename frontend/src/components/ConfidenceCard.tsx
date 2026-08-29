import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ConfidenceData } from '../api/types';

interface ConfidenceCardProps {
  confidence: ConfidenceData;
}

export const ConfidenceCard: React.FC<ConfidenceCardProps> = ({ confidence }) => {
  const isHigh = confidence.confidence_level === 'HIGH';
  const isMedium = confidence.confidence_level === 'MEDIUM';

  const badgeClass = isHigh ? 'badge-high' : isMedium ? 'badge-medium' : 'badge-low';

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <ShieldCheck size={18} color={isHigh ? 'var(--accent-positive)' : isMedium ? 'var(--accent-warning)' : 'var(--accent-negative)'} />
          <span>Evidence-Based Confidence</span>
        </h3>
        <span className={`badge ${badgeClass}`}>
          {confidence.confidence_level} ({confidence.confidence_score}/100)
        </span>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
          Model Calibration & Evidence Tier:
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {confidence.confidence_level}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {confidence.confidence_score} Points
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Confidence Justification Factors
        </h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {confidence.justification_factors.map((factor, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              <span style={{ color: isHigh ? 'var(--accent-positive)' : 'var(--accent-warning)', marginTop: '0.1rem', flexShrink: 0 }}>
                {isHigh ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              </span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
        Note: Confidence rating reflects historical data density, feature completeness, and calibration limits—not investment return guarantees.
      </div>
    </div>
  );
};
