import React from 'react';

export const Diagram9DatabaseER: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d9-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <marker id="d9-crow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 8 5 L 0 10 M 8 0 L 8 10" fill="none" stroke="#64748b" strokeWidth="1.5" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="36" rx="8" fill="url(#d9-hdr)" />
        <text x="460" y="38" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          RELATIONAL &amp; PERSISTENCE ENTITY-RELATIONSHIP (ER) ARCHITECTURE
        </text>

        {/* Table 1: IPOS (Center Top) */}
        <g transform="translate(340, 65)">
          <rect width="240" height="185" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          <rect width="240" height="26" rx="6" fill="#0284c7" />
          <text x="120" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            ipos (Core Registry)
          </text>
          <g transform="translate(10, 34)">
            <text x="0" y="12" fill="#0284c7" fontWeight="700" fontSize="9.5" fontFamily="monospace">PK  id: UUID / VARCHAR(64)</text>
            <text x="0" y="26" fill="#334155" fontSize="9" fontFamily="monospace">    symbol: VARCHAR(32) UNIQUE</text>
            <text x="0" y="40" fill="#334155" fontSize="9" fontFamily="monospace">    company_name: VARCHAR(255)</text>
            <text x="0" y="54" fill="#334155" fontSize="9" fontFamily="monospace">    sector: VARCHAR(64)</text>
            <text x="0" y="68" fill="#334155" fontSize="9" fontFamily="monospace">    issue_size_cr: NUMERIC(10,2)</text>
            <text x="0" y="82" fill="#334155" fontSize="9" fontFamily="monospace">    price_min: NUMERIC(8,2)</text>
            <text x="0" y="96" fill="#334155" fontSize="9" fontFamily="monospace">    price_max: NUMERIC(8,2)</text>
            <text x="0" y="110" fill="#334155" fontSize="9" fontFamily="monospace">    open_date: DATE (Ex-Ante Anchor)</text>
            <text x="0" y="124" fill="#334155" fontSize="9" fontFamily="monospace">    close_date: DATE</text>
            <text x="0" y="138" fill="#334155" fontSize="9" fontFamily="monospace">    status: VARCHAR(20)</text>
          </g>
        </g>

        {/* Table 2: PREDICTIONS (Left) */}
        <g transform="translate(40, 150)">
          <rect width="250" height="195" rx="6" fill="#ffffff" stroke="#9333ea" strokeWidth="2" />
          <rect width="250" height="26" rx="6" fill="#9333ea" />
          <text x="125" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            predictions (Ex-Ante AI Inferences)
          </text>
          <g transform="translate(10, 34)">
            <text x="0" y="12" fill="#9333ea" fontWeight="700" fontSize="9.5" fontFamily="monospace">PK  id: UUID / VARCHAR(64)</text>
            <text x="0" y="26" fill="#0284c7" fontWeight="700" fontSize="9.5" fontFamily="monospace">FK  ipo_id: UUID (ref ipos.id)</text>
            <text x="0" y="40" fill="#334155" fontSize="9" fontFamily="monospace">    timestamp: TIMESTAMPTZ (&lt;=09:59)</text>
            <text x="0" y="54" fill="#334155" fontSize="9" fontFamily="monospace">    predicted_total: NUMERIC(8,3)</text>
            <text x="0" y="68" fill="#334155" fontSize="9" fontFamily="monospace">    predicted_qib: NUMERIC(8,3)</text>
            <text x="0" y="82" fill="#334155" fontSize="9" fontFamily="monospace">    predicted_nii: NUMERIC(8,3)</text>
            <text x="0" y="96" fill="#334155" fontSize="9" fontFamily="monospace">    predicted_retail: NUMERIC(8,3)</text>
            <text x="0" y="110" fill="#334155" fontSize="9" fontFamily="monospace">    weighted_total: NUMERIC(8,3)</text>
            <text x="0" y="124" fill="#334155" fontSize="9" fontFamily="monospace">    confidence_p05: NUMERIC(8,3)</text>
            <text x="0" y="138" fill="#334155" fontSize="9" fontFamily="monospace">    confidence_p95: NUMERIC(8,3)</text>
            <text x="0" y="152" fill="#334155" fontSize="9" fontFamily="monospace">    model_version_tag: VARCHAR(64)</text>
          </g>
        </g>

        {/* Table 3: ACTUAL_RESULTS (Right) */}
        <g transform="translate(630, 150)">
          <rect width="250" height="195" rx="6" fill="#ffffff" stroke="#059669" strokeWidth="2" />
          <rect width="250" height="26" rx="6" fill="#059669" />
          <text x="125" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            actual_results (Historical Outturn)
          </text>
          <g transform="translate(10, 34)">
            <text x="0" y="12" fill="#059669" fontWeight="700" fontSize="9.5" fontFamily="monospace">PK  id: UUID / VARCHAR(64)</text>
            <text x="0" y="26" fill="#0284c7" fontWeight="700" fontSize="9.5" fontFamily="monospace">FK  ipo_id: UUID (ref ipos.id)</text>
            <text x="0" y="40" fill="#334155" fontSize="9" fontFamily="monospace">    final_total: NUMERIC(8,3)</text>
            <text x="0" y="54" fill="#334155" fontSize="9" fontFamily="monospace">    final_qib: NUMERIC(8,3)</text>
            <text x="0" y="68" fill="#334155" fontSize="9" fontFamily="monospace">    final_nii: NUMERIC(8,3)</text>
            <text x="0" y="82" fill="#334155" fontSize="9" fontFamily="monospace">    final_retail: NUMERIC(8,3)</text>
            <text x="0" y="96" fill="#334155" fontSize="9" fontFamily="monospace">    listing_price: NUMERIC(8,2)</text>
            <text x="0" y="110" fill="#334155" fontSize="9" fontFamily="monospace">    listing_gain_pct: NUMERIC(6,2)</text>
            <text x="0" y="124" fill="#334155" fontSize="9" fontFamily="monospace">    settled_at: TIMESTAMPTZ</text>
            <text x="0" y="138" fill="#334155" fontSize="9" fontFamily="monospace">    is_outlier_capped: BOOLEAN</text>
            <text x="0" y="152" fill="#334155" fontSize="9" fontFamily="monospace">    data_source: VARCHAR(64)</text>
          </g>
        </g>

        {/* Table 4: FEATURE_SNAPSHOTS (Bottom Center-Left) */}
        <g transform="translate(160, 360)">
          <rect width="260" height="155" rx="6" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
          <rect width="260" height="26" rx="6" fill="#d97706" />
          <text x="130" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            feature_snapshots (45 Canonical)
          </text>
          <g transform="translate(10, 34)">
            <text x="0" y="12" fill="#d97706" fontWeight="700" fontSize="9.5" fontFamily="monospace">PK  snapshot_id: UUID</text>
            <text x="0" y="26" fill="#0284c7" fontWeight="700" fontSize="9.5" fontFamily="monospace">FK  ipo_id: UUID (ref ipos.id)</text>
            <text x="0" y="40" fill="#334155" fontSize="9" fontFamily="monospace">    feature_vector: JSONB (45 floats)</text>
            <text x="0" y="54" fill="#334155" fontSize="9" fontFamily="monospace">    feature_hash: CHAR(64) SHA-256</text>
            <text x="0" y="68" fill="#334155" fontSize="9" fontFamily="monospace">    gmp_reported: NUMERIC(8,2)</text>
            <text x="0" y="82" fill="#334155" fontSize="9" fontFamily="monospace">    finbert_sentiment: NUMERIC(5,4)</text>
            <text x="0" y="96" fill="#334155" fontSize="9" fontFamily="monospace">    snapshot_timestamp: TIMESTAMPTZ</text>
            <text x="0" y="110" fill="#dc2626" fontWeight="600" fontSize="8.5" fontFamily="monospace">    LEAKAGE_BARRIER_VALIDATED: BOOL</text>
          </g>
        </g>

        {/* Table 5: PREDICTION_AUDIT & RETRAINING (Bottom Right) */}
        <g transform="translate(500, 360)">
          <rect width="280" height="155" rx="6" fill="#ffffff" stroke="#475569" strokeWidth="2" />
          <rect width="280" height="26" rx="6" fill="#475569" />
          <text x="140" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            prediction_audit &amp; retraining_runs
          </text>
          <g transform="translate(10, 34)">
            <text x="0" y="12" fill="#475569" fontWeight="700" fontSize="9.5" fontFamily="monospace">PK  audit_id: UUID / JSONL index</text>
            <text x="0" y="26" fill="#9333ea" fontWeight="700" fontSize="9.5" fontFamily="monospace">FK  prediction_id: UUID</text>
            <text x="0" y="40" fill="#334155" fontSize="9" fontFamily="monospace">    shap_values: JSONB (top 10 factors)</text>
            <text x="0" y="54" fill="#334155" fontSize="9" fontFamily="monospace">    client_ip: VARCHAR(45)</text>
            <text x="0" y="68" fill="#334155" fontSize="9" fontFamily="monospace">    execution_ms: NUMERIC(6,2)</text>
            <text x="0" y="82" fill="#334155" fontSize="9" fontFamily="monospace">    retrain_run_id: UUID</text>
            <text x="0" y="96" fill="#334155" fontSize="9" fontFamily="monospace">    retrain_status: QUARANTINED|PROMOTED</text>
            <text x="0" y="110" fill="#059669" fontWeight="600" fontSize="8.5" fontFamily="monospace">    PROD_LOCK: SHA-256 Verified</text>
          </g>
        </g>

        {/* Relationships Lines */}
        {/* ipos -> predictions (1 to N) */}
        <path d="M 340 140 L 290 180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#d9-crow)" fill="none" />
        <text x="312" y="152" fill="#64748b" fontSize="8" fontFamily="sans-serif">1 : N</text>

        {/* ipos -> actual_results (1 to 1) */}
        <path d="M 580 140 L 630 180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#d9-crow)" fill="none" />
        <text x="596" y="152" fill="#64748b" fontSize="8" fontFamily="sans-serif">1 : 1</text>

        {/* ipos -> feature_snapshots (1 to N) */}
        <path d="M 400 250 L 350 360" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#d9-crow)" fill="none" />
        <text x="368" y="295" fill="#64748b" fontSize="8" fontFamily="sans-serif">1 : N</text>

        {/* predictions -> prediction_audit (1 to 1) */}
        <path d="M 290 320 Q 380 340 500 400" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <text x="390" y="348" fill="#64748b" fontSize="8" fontFamily="sans-serif">1 : 1 Audit Ref</text>
      </svg>
    </div>
  );
};
