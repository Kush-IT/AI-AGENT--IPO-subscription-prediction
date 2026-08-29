import React, { useState } from 'react';
import { FileSearch, ChevronDown, ChevronUp, ExternalLink, CheckCircle } from 'lucide-react';
import { ProvenanceSource, FieldProvenanceRecord } from '../api/types';
import { formatTimestamp } from '../utils/formatting';

interface ProvenanceTableProps {
  sources: ProvenanceSource[];
  featureProvenance: Record<string, FieldProvenanceRecord>;
}

export const ProvenanceTable: React.FC<ProvenanceTableProps> = ({
  sources,
  featureProvenance,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const recordsList = Object.values(featureProvenance);
  const filteredRecords = recordsList.filter((r) =>
    r.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-header"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSearch size={18} color="var(--brand-primary)" />
          <span>Statutory Data Sources & Field-Level Provenance Audit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-neutral">{recordsList.length} Verified Records</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Main Verified Source Catalog */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Authoritative Data Connectors & Statutory Provenance
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem' }}>
              {sources.map((s, idx) => (
                <div key={idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{s.category}</span>
                    <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>
                      <CheckCircle size={10} /> {s.verification_status}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.75rem' }}>{s.source}</div>
                  {s.source_url && (
                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--brand-primary)', textDecoration: 'none', marginTop: '0.3rem', fontSize: '0.72rem' }}
                    >
                      <span>Public Filing Registry</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Granular Field-Level Provenance Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Field-Level Observation Timestamps & Cutoffs
              </h4>
              <input
                type="text"
                placeholder="Filter by feature or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-strong)',
                  maxWidth: '220px',
                }}
              />
            </div>

            <div className="data-table-container" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Value</th>
                    <th>Source</th>
                    <th>Observed At</th>
                    <th>Cutoff (IST)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => (
                    <tr key={rec.field}>
                      <td style={{ fontWeight: 600, fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                        {rec.field}
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                        {rec.value !== null && rec.value !== undefined ? String(rec.value) : 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.source}</td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                        {formatTimestamp(rec.observed_at)}
                      </td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                        {formatTimestamp(rec.feature_cutoff)}
                      </td>
                      <td>
                        <span className={`badge ${rec.status === 'VALID' ? 'badge-high' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
