import React from 'react';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataQualityData } from '../api/types';

interface DataQualityProps {
  dataQuality: DataQualityData;
}

export const DataQuality: React.FC<DataQualityProps> = ({ dataQuality }) => {
  const isExcellent = dataQuality.data_quality_tier === 'EXCELLENT';

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Database size={18} color="var(--brand-primary)" />
          <span>Data Quality & Completeness</span>
        </h3>
        <span className={`badge ${isExcellent ? 'badge-high' : 'badge-medium'}`}>
          {dataQuality.data_quality_tier} ({dataQuality.data_quality_score}/100)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completeness</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'JetBrains Mono' }}>
            {dataQuality.feature_completeness_pct}%
          </div>
        </div>

        <div style={{ padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sources Consulted</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'JetBrains Mono' }}>
            {dataQuality.source_count}
          </div>
        </div>

        <div style={{ padding: '0.6rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Missing Fields</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: dataQuality.missing_fields_count > 0 ? 'var(--accent-warning)' : 'var(--accent-positive)', fontFamily: 'JetBrains Mono' }}>
            {dataQuality.missing_fields_count}
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          {dataQuality.missing_fields_count === 0 ? (
            <CheckCircle2 size={16} color="var(--accent-positive)" />
          ) : (
            <AlertCircle size={16} color="var(--accent-warning)" />
          )}
          <span>
            {dataQuality.missing_fields_count === 0
              ? 'All 45 pre-IPO predictive features available.'
              : `${dataQuality.missing_fields_count} non-critical feature(s) imputed with domain defaults.`}
          </span>
        </div>

        {dataQuality.missing_fields_count > 0 && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
            Imputed: {dataQuality.missing_fields.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};
