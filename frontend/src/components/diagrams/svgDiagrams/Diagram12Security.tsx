import React from 'react';

export const Diagram12Security: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d12-shield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="d12-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef2f2" />
            <stop offset="100%" stopColor="#fee2e2" />
          </linearGradient>
          <linearGradient id="d12-em" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          <linearGradient id="d12-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Header */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d12-shield)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          DEFENSE-IN-DEPTH SECURITY ARCHITECTURE &amp; DATA GOVERNANCE
        </text>

        {/* 4 Security Pillars */}
        {/* Pillar 1: Ingress & Network */}
        <g transform="translate(25, 70)">
          <rect width="200" height="395" rx="8" fill="url(#d12-blue)" stroke="#38bdf8" strokeWidth="1.5" />
          <rect width="200" height="30" rx="8" fill="#0284c7" />
          <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            1. Network &amp; Ingress
          </text>

          <g transform="translate(10, 42)">
            <rect width="180" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Transport Layer Security</text>
            <text x="90" y="34" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="600" fontFamily="sans-serif">TLS 1.3 / HTTPS Only</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Enforced HSTS &amp; CSP headers</text>
            <text x="90" y="60" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Prevent MITM eavesdropping</text>
          </g>

          <g transform="translate(10, 125)">
            <rect width="180" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">CORS &amp; Origin Whitelist</text>
            <text x="90" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Restricted allowed origins</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">No wildcard (*) in production</text>
            <text x="90" y="62" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Strict Preflight (OPTIONS)</text>
          </g>

          <g transform="translate(10, 208)">
            <rect width="180" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Rate Limiting &amp; DoS Guard</text>
            <text x="90" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Token Bucket per IP</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Max 60 requests / minute</text>
            <text x="90" y="62" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">429 Too Many Requests</text>
            <text x="90" y="74" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">Automated ban for scraping</text>
          </g>

          <g transform="translate(10, 301)">
            <rect width="180" height="80" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Pydantic v2 Validation</text>
            <text x="90" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Strict schema deserialization</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Zero SQL injection risk</text>
            <text x="90" y="64" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Type-safe JSON parsing</text>
          </g>
        </g>

        {/* Pillar 2: Cryptographic Model Integrity */}
        <g transform="translate(245, 70)">
          <rect width="205" height="395" rx="8" fill="url(#d12-em)" stroke="#34d399" strokeWidth="1.5" />
          <rect width="205" height="30" rx="8" fill="#059669" />
          <text x="102.5" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            2. Model Integrity &amp; Lock
          </text>

          <g transform="translate(10, 42)">
            <rect width="185" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">SHA-256 Boot Verification</text>
            <text x="92.5" y="32" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">5 Production Artifacts Verified</text>
            <line x1="8" y1="36" x2="177" y2="36" stroke="#e2e8f0" />
            <text x="12" y="48" fill="#334155" fontSize="7" fontFamily="monospace">preprocessor: 04bd6412...</text>
            <text x="12" y="58" fill="#334155" fontSize="7" fontFamily="monospace">total_xgb:   3b00118e...</text>
            <text x="12" y="68" fill="#334155" fontSize="7" fontFamily="monospace">qib_rf:      29188a79...</text>
            <text x="12" y="78" fill="#334155" fontSize="7" fontFamily="monospace">retail_xgb:  835ceb1f...</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="185" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Read-Only File Permissions</text>
            <text x="92.5" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">models/final_candidates/ (chmod 444)</text>
            <text x="92.5" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">FastAPI worker has NO write access</text>
            <text x="92.5" y="66" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">ZERO IN-PLACE MUTATION</text>
          </g>

          <g transform="translate(10, 223)">
            <rect width="185" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Quarantine Isolation Zone</text>
            <text x="92.5" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Retrained candidates isolated in</text>
            <text x="92.5" y="48" textAnchor="middle" fill="#b45309" fontSize="7.5" fontWeight="600" fontFamily="monospace">models/retrained/</text>
            <text x="92.5" y="64" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Cannot serve live traffic</text>
          </g>

          <g transform="translate(10, 311)">
            <rect width="185" height="70" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Promotion Audit Gate</text>
            <text x="92.5" y="34" textAnchor="middle" fill="#15803d" fontSize="7.5" fontFamily="sans-serif">Requires human engineer sign-off</text>
            <text x="92.5" y="48" textAnchor="middle" fill="#15803d" fontSize="7.5" fontFamily="sans-serif">+ OOS validation pass</text>
            <text x="92.5" y="60" textAnchor="middle" fill="#166534" fontSize="7" fontWeight="600" fontFamily="sans-serif">Automated overwrite disabled</text>
          </g>
        </g>

        {/* Pillar 3: Ex-Ante Data Governance */}
        <g transform="translate(470, 70)">
          <rect width="205" height="395" rx="8" fill="url(#d12-red)" stroke="#f87171" strokeWidth="1.5" />
          <rect width="205" height="30" rx="8" fill="#dc2626" />
          <text x="102.5" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            3. Ex-Ante Temporal Shield
          </text>

          <g transform="translate(10, 42)">
            <rect width="185" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Strict 09:59:59 IST Cutoff</text>
            <line x1="8" y1="24" x2="177" y2="24" stroke="#fee2e2" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Day 1 Bidding begins: 10:00:00</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Ex-Ante window ends: 09:59:59</text>
            <text x="12" y="68" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">• Post-cutoff feeds DROP from AI</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="185" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Anti-Leakage Barrier</text>
            <text x="92.5" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Day 1/2/3 Live NSE Tallies</text>
            <text x="92.5" y="48" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">BLOCKED from Feature Store</text>
            <text x="92.5" y="64" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Visualized as Observation only</text>
          </g>

          <g transform="translate(10, 223)">
            <rect width="185" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Pre-IPO Timestamp Audit</text>
            <text x="92.5" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">All 45 features validated with</text>
            <text x="92.5" y="48" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontFamily="monospace">assert timestamp &lt;= cutoff</text>
            <text x="92.5" y="64" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Audit verified in CI/CD</text>
          </g>

          <g transform="translate(10, 311)">
            <rect width="185" height="70" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="92.5" y="18" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Target Separation Guarantee</text>
            <text x="92.5" y="34" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">Actual final subscription NEVER</text>
            <text x="92.5" y="46" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">enters inference vector</text>
            <text x="92.5" y="58" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Zero Look-Ahead Bias</text>
          </g>
        </g>

        {/* Pillar 4: Immutable Audit & Observability */}
        <g transform="translate(695, 70)">
          <rect width="200" height="395" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="200" height="30" rx="8" fill="#475569" />
          <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            4. Audit &amp; Compliance
          </text>

          <g transform="translate(10, 42)">
            <rect width="180" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Append-Only Audit Log</text>
            <text x="90" y="34" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">prediction_audit.jsonl</text>
            <line x1="8" y1="38" x2="172" y2="38" stroke="#e2e8f0" />
            <text x="12" y="50" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• SHA-256 Input Feature Hash</text>
            <text x="12" y="64" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• UTC &amp; IST Timestamp</text>
            <text x="12" y="78" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Full Model Predictions</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="180" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">SHAP Attribution Archive</text>
            <text x="90" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Top 10 feature Shapley values</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">stored per prediction for</text>
            <text x="90" y="64" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Post-Hoc Viva Defense</text>
          </g>

          <g transform="translate(10, 223)">
            <rect width="180" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Drift Alerting (PSI)</text>
            <text x="90" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Population Stability Index</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Flag if PSI &gt; 0.20 (High Drift)</text>
            <text x="90" y="64" textAnchor="middle" fill="#d97706" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Alert logged to dashboard</text>
          </g>

          <g transform="translate(10, 311)">
            <rect width="180" height="70" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Scientific Reproducibility</text>
            <text x="90" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Any past prediction can be</text>
            <text x="90" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">exact-reproduced bit-for-bit</text>
            <text x="90" y="60" textAnchor="middle" fill="#059669" fontSize="7" fontWeight="700" fontFamily="sans-serif">100% Deterministic</text>
          </g>
        </g>

        {/* Footer */}
        <rect x="25" y="480" width="870" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <text x="40" y="505" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
          Compliance Summary:
        </text>
        <text x="175" y="505" fill="#334155" fontSize="10" fontFamily="sans-serif">
          • Cryptographic checksum locking • Strict 09:59:59 IST ex-ante cutoff • Zero lookahead leakage • Immutable append-only audit trail
        </text>
      </svg>
    </div>
  );
};
