import React from 'react';
import { X, ShieldCheck, CheckCircle2, Clock, ExternalLink, Database } from 'lucide-react';
import { useIPODeepDive } from '../../hooks/useIPOIntelligence';

interface IPODetailModalProps {
  ipoId: string | null;
  onClose: () => void;
}

export const IPODetailModal: React.FC<IPODetailModalProps> = ({ ipoId, onClose }) => {
  const { data, isLoading, isError } = useIPODeepDive(ipoId || undefined);

  if (!ipoId) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {isLoading ? 'Loading Deep-Dive...' : data?.card.company_name}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {data?.card.sector} • ISIN: {data?.card.isin || 'N/A'} • Status: <strong>{data?.card.status}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {isLoading && (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Retrieving statutory prospectus, TreeSHAP attributions, and source provenance...
          </div>
        )}

        {isError && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
            Failed to retrieve detailed prospective record.
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 1. Statutory Issue Parameters */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={15} color="#0284c7" /> Statutory Issue Terms & Allocation
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Price Band</div>
                  <div style={{ fontWeight: 700 }}>₹{data.card.price_low} - ₹{data.card.price_high}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Issue Size</div>
                  <div style={{ fontWeight: 700 }}>₹{data.card.issue_size_in_crore} Cr</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Lot Size</div>
                  <div style={{ fontWeight: 700 }}>{data.card.lot_size} shares</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Min App Amount</div>
                  <div style={{ fontWeight: 700 }}>₹{(data.card.price_high * data.card.lot_size).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* 2. Chronological Lifecycle Timeline */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={15} color="#b45309" /> Ex-Ante Lifecycle Milestones
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {data.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: item.status === 'COMPLETED' ? '#f0fdf4' : item.status === 'ENFORCED' ? '#eff6ff' : '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.status === 'COMPLETED' ? <CheckCircle2 size={14} color="#16a34a" /> : <Clock size={14} color="#94a3b8" />}
                      {item.milestone}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Verified Data Provenance & Authoritative Sources */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={15} color="#16a34a" /> Verified Source Provenance
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '0.5rem' }}>Data Domain</th>
                      <th style={{ padding: '0.5rem' }}>Authoritative Source</th>
                      <th style={{ padding: '0.5rem' }}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.source_provenance.map((src, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem', fontWeight: 600 }}>{src.field}</td>
                        <td style={{ padding: '0.5rem' }}>
                          <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            {src.source} <ExternalLink size={10} />
                          </a>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className={`badge badge-${src.confidence === 'HIGH' || src.confidence === 'AUTHORITATIVE' ? 'high' : 'medium'}`} style={{ fontSize: '0.65rem' }}>
                            {src.confidence}
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
    </div>
  );
};
