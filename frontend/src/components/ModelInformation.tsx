import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { ModelInformationData } from '../api/types';

interface ModelInformationProps {
  modelInfo: ModelInformationData;
}

export const ModelInformation: React.FC<ModelInformationProps> = ({ modelInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-header"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} color="var(--brand-primary)" />
          <span>Frozen ML Model Architecture & Registry Specifications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-neutral">v{modelInfo.model_registry_version}</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {Object.entries(modelInfo.models_used).map(([target, modelSpec]) => (
              <div key={target} style={{ padding: '0.65rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {target.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {modelSpec}
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Quarantined 2024 Test Set Performance (17 Verified Mainboard IPOs)
          </h4>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(modelInfo.test_set_performance).map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ fontWeight: 600 }}>{k.replace(/_/g, ' ')}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{v}</td>
                    <td style={{ color: 'var(--text-muted)' }}>Quarantined 2024 out-of-sample evaluation</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
