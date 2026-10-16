import React, { useState } from 'react';
import { ShieldCheck, Lock, Database, AlertCircle, Copy, Check } from 'lucide-react';
import { PRODUCTION_MODELS_DATA, DATA_PROVENANCE_SOURCES } from './diagramData';

export const GovernancePanels: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
      {/* 1. Production Model Architecture & Cryptographic Integrity */}
      <div
        className="gov-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        <div
          className="gov-card-header"
          style={{
            padding: '1.1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.55rem',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="gov-card-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Production Model Architecture &amp; SHA-256 Integrity
              </h3>
              <p className="gov-card-subtitle" style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                Cryptographically verified production artifacts stored in{' '}
                <code
                  style={{
                    fontFamily: 'monospace',
                    color: '#047857',
                    backgroundColor: '#ecfdf5',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  models/final_candidates/
                </code>
              </p>
            </div>
          </div>
          <span
            className="gov-status-pill success"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
            }}
          >
            <Lock size={13} />
            FROZEN BASELINE LOCKED
          </span>
        </div>

        <div className="gov-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.85rem 1.25rem' }}>Artifact File</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Specialized Role</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Algorithm &amp; Target Transform</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>SHA-256 Checksum</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Integrity Status</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTION_MODELS_DATA.map((model) => (
                <tr
                  key={model.name}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                    {model.name}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#1e293b', fontWeight: 600 }}>
                    {model.role}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{model.algorithm}</div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#0284c7',
                        fontFamily: 'monospace',
                        marginTop: '0.2rem',
                      }}
                    >
                      {model.targetTransform}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        className="gov-hash-badge"
                        title={model.sha256}
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.74rem',
                          backgroundColor: '#f1f5f9',
                          color: '#0f172a',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        {model.sha256.slice(0, 16)}...{model.sha256.slice(-8)}
                      </span>
                      <button
                        onClick={() => handleCopy(model.sha256)}
                        title="Copy full SHA-256"
                        style={{
                          padding: '0.3rem',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          color: '#64748b',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {copiedHash === model.sha256 ? <Check size={13} style={{ color: '#059669' }} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    <span
                      className="gov-status-pill success"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#059669',
                          display: 'inline-block',
                        }}
                      />
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>
            Target Transformations: <code style={{ fontFamily: 'monospace', color: '#0369a1' }}>log1p</code> applied to skewed targets (Total, NII); Raw scale preserved for QIB and Retail.
          </span>
          <span style={{ fontWeight: 600, color: '#334155' }}>Zero In-Place Overwrites Permitted</span>
        </div>
      </div>

      {/* 2. Data Provenance & Temporal Source Classification */}
      <div
        className="gov-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        <div
          className="gov-card-header"
          style={{
            padding: '1.1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                padding: '0.55rem',
                borderRadius: '8px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 className="gov-card-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Data Provenance &amp; Ex-Ante Source Governance
              </h3>
              <p className="gov-card-subtitle" style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                Audit trail detailing collection frequency and strict feature store admission rules
              </p>
            </div>
          </div>
          <span
            className="gov-status-pill info"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
            }}
          >
            STRICT 09:59:59 IST CUTOFF
          </span>
        </div>

        <div className="gov-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.85rem 1.25rem' }}>Data Source</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Information Scope</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Frequency</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Cutoff Enforcement Rule</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>AI Feature Store</th>
              </tr>
            </thead>
            <tbody>
              {DATA_PROVENANCE_SOURCES.map((source) => (
                <tr
                  key={source.sourceName}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {source.sourceName}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#334155' }}>
                    {source.dataType}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {source.collectionFrequency}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color: source.usedInAI ? '#065f46' : '#9f1239',
                        fontSize: '0.78rem',
                      }}
                    >
                      {source.cutoffEnforced}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>
                    {source.usedInAI ? (
                      <span
                        className="gov-status-pill success"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        PERMITTED
                      </span>
                    ) : (
                      <span
                        className="gov-status-pill danger"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: '#fff1f2',
                          color: '#9f1239',
                          border: '1px solid #fecdd3',
                        }}
                      >
                        BLOCKED (OBSERVATION ONLY)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Scientific Viva & Methodology Notice */}
      <div
        className="gov-notice-box"
        style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '0.55rem',
            borderRadius: '8px',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            flexShrink: 0,
            marginTop: '0.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={22} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#78350f', margin: 0 }}>
            Methodological Integrity: Why Live Subscription Tallies Must Never Feed AI Predictions
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.55, margin: 0 }}>
            In academic research and rigorous financial engineering, an <strong>ex-ante forecasting model</strong> is designed to predict an outcome strictly before that outcome commences. Predicting total subscription after Day 1, 2, or 3 bidding has already occurred is trivial and invalidates the model&apos;s predictive validity through <strong>look-ahead bias</strong>.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.55, margin: 0 }}>
            When the dashboard displays a live subscription tally (e.g., Jindal Supreme at 125.101x or SS Retail at 71.332x) next to an AI prediction (16.9x or 23.7x), the system architecturally isolates the live tally as an <strong>Observation Only</strong>. This allows users to inspect market reality versus ex-ante expectations without corrupting model weights or compromising statistical defensibility.
          </p>
        </div>
      </div>
    </div>
  );
};
