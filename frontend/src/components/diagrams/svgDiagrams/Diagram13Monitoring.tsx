import React from 'react';

export const Diagram13Monitoring: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d13-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <marker id="d13-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d13-hdr)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          CONTINUOUS MONITORING, PSI DRIFT DETECTION &amp; RETRAINING GOVERNANCE
        </text>

        {/* Panel 1: API & Runtime Health */}
        <g transform="translate(25, 70)">
          <rect width="200" height="395" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="200" height="28" rx="8" fill="#0284c7" />
          <text x="100" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            1. Service Observability
          </text>

          <g transform="translate(10, 38)">
            <rect width="180" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">API Health Heartbeat</text>
            <text x="90" y="32" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontFamily="monospace">GET /api/health</text>
            <line x1="8" y1="36" x2="172" y2="36" stroke="#e2e8f0" />
            <text x="14" y="50" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Status: 200 OK (Healthy)</text>
            <text x="14" y="62" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Memory footprint: ~180MB</text>
            <text x="14" y="74" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Model load latency: 0ms (In-mem)</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="180" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Inference Latency Tracking</text>
            <line x1="8" y1="24" x2="172" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• p50 Response Time: 8.2ms</text>
            <text x="14" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• p95 Response Time: 14.7ms</text>
            <text x="14" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• p99 Response Time: 21.0ms</text>
            <text x="14" y="82" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">SLO Target: &lt;50ms (Exceeded)</text>
          </g>

          <g transform="translate(10, 242)">
            <rect width="180" height="135" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Error Budget &amp; Sentry</text>
            <line x1="8" y1="24" x2="172" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• 5xx Error Rate: 0.00%</text>
            <text x="14" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Preprocessing Failures: 0</text>
            <text x="14" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• NSE Scraper Fallback: Auto</text>
            <text x="14" y="82" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Sentry issue tracking</text>
            <rect x="8" y="94" width="164" height="24" rx="3" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="90" y="110" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">99.95% Availability</text>
          </g>
        </g>

        {/* Panel 2: Drift Detection Engine (PSI) */}
        <g transform="translate(245, 70)">
          <rect width="215" height="395" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <rect width="215" height="28" rx="8" fill="#2563eb" />
          <text x="107.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            2. Population Stability (PSI)
          </text>

          <g transform="translate(10, 38)">
            <rect width="195" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="97.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">PSI Mathematical Formula</text>
            <line x1="8" y1="24" x2="187" y2="24" stroke="#e2e8f0" />
            <rect x="8" y="30" width="179" height="26" rx="3" fill="#f8fafc" />
            <text x="97.5" y="47" textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="600" fontFamily="monospace">PSI = Σ (P - Q) × ln(P / Q)</text>
            <text x="97.5" y="70" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">P: Actual Target Dist (N=85 Train)</text>
            <text x="97.5" y="82" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Q: Live Predicted Dist (Prospective)</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="195" height="120" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="97.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">PSI Drift Severity Thresholds</text>
            <line x1="8" y1="24" x2="187" y2="24" stroke="#e2e8f0" />
            <rect x="8" y="30" width="179" height="24" rx="3" fill="#ecfdf5" stroke="#a7f3d0" />
            <text x="97.5" y="46" textAnchor="middle" fill="#065f46" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">PSI &lt; 0.10: Stable / Green</text>
            <rect x="8" y="60" width="179" height="24" rx="3" fill="#fffbeb" stroke="#fde68a" />
            <text x="97.5" y="76" textAnchor="middle" fill="#92400e" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">0.10 ≤ PSI &lt; 0.20: Moderate Drift</text>
            <rect x="8" y="90" width="179" height="24" rx="3" fill="#fef2f2" stroke="#fecaca" />
            <text x="97.5" y="106" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">PSI ≥ 0.20: Significant Drift Alert</text>
          </g>

          <g transform="translate(10, 275)">
            <rect width="195" height="102" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="97.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Feature-Level Drift Probes</text>
            <line x1="8" y1="24" x2="187" y2="24" stroke="#e2e8f0" />
            <text x="14" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• GMP Distribution Drift: 0.042 (Low)</text>
            <text x="14" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Issue Size Shift: 0.038 (Low)</text>
            <text x="14" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Sentiment Polarity: 0.071 (Stable)</text>
            <text x="97.5" y="86" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="700" fontFamily="sans-serif">Overall System Status: HEALTHY</text>
          </g>
        </g>

        {/* Panel 3: Retraining Governance & Sandboxing */}
        <g transform="translate(480, 70)">
          <rect width="215" height="395" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
          <rect width="215" height="28" rx="8" fill="#d97706" />
          <text x="107.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            3. Retraining Governance
          </text>

          <g transform="translate(10, 38)">
            <rect width="195" height="85" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.2" />
            <text x="97.5" y="18" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">POLICY: AUTO-RETRAIN OFF</text>
            <line x1="8" y1="24" x2="187" y2="24" stroke="#fecaca" />
            <text x="14" y="40" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">• Automated model overwrites</text>
            <text x="14" y="52" fill="#7f1d1d" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">  STRICTLY PROHIBITED</text>
            <text x="14" y="66" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Prevents feedback loop collapse</text>
            <text x="14" y="78" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Prevents chasing volatile swings</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="195" height="100" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="97.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Candidate Quarantine Area</text>
            <text x="97.5" y="32" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">models/retrained/ (Isolated)</text>
            <line x1="8" y1="36" x2="187" y2="36" stroke="#e2e8f0" />
            <text x="14" y="50" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Candidate retrained on expanded N</text>
            <text x="14" y="64" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Subjected to 5-Fold Walk Forward</text>
            <text x="14" y="78" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Baseline: frozen models in final/</text>
            <text x="97.5" y="92" textAnchor="middle" fill="#d97706" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Status: In Quarantine</text>
          </g>

          <g transform="translate(10, 248)">
            <rect width="195" height="129" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="97.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Multi-Objective Promotion Gate</text>
            <line x1="8" y1="24" x2="187" y2="24" stroke="#e2e8f0" />
            <text x="14" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">1. Candidate MAE &lt; Baseline MAE</text>
            <text x="14" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">2. Candidate RMSE &lt; Baseline RMSE</text>
            <text x="14" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">3. R² strictly positive on test set</text>
            <text x="14" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">4. Symmetric MAPE &lt; Baseline sMAPE</text>
            <text x="14" y="94" fill="#334155" fontSize="7.5" fontFamily="sans-serif">5. Mean Bias within [-5.0, +5.0]</text>
            <text x="97.5" y="114" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">ANY FAIL = RETAIN FROZEN</text>
          </g>
        </g>

        {/* Panel 4: Decision & Model Lock Outcome */}
        <g transform="translate(715, 70)">
          <rect width="180" height="395" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="180" height="28" rx="8" fill="#475569" />
          <text x="90" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            4. Current Lock State
          </text>

          <g transform="translate(10, 38)">
            <rect width="160" height="95" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.2" />
            <text x="80" y="18" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="9" fontFamily="sans-serif">PRODUCTION ACTIVE</text>
            <line x1="8" y1="24" x2="152" y2="24" stroke="#a7f3d0" />
            <text x="12" y="38" fill="#047857" fontSize="7.5" fontFamily="sans-serif">• total_xgboost_log1p</text>
            <text x="12" y="52" fill="#047857" fontSize="7.5" fontFamily="sans-serif">• qib_random_forest_raw</text>
            <text x="12" y="66" fill="#047857" fontSize="7.5" fontFamily="sans-serif">• nii_lightgbm_log1p</text>
            <text x="12" y="80" fill="#047857" fontSize="7.5" fontFamily="sans-serif">• retail_xgboost_raw</text>
            <text x="80" y="91" textAnchor="middle" fill="#059669" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">STATUS: FROZEN &amp; SECURED</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="160" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Candidate Audit History</text>
            <line x1="8" y1="24" x2="152" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Candidate Run #04:</text>
            <text x="12" y="54" fill="#334155" fontSize="7" fontFamily="sans-serif">Weighted 0.50Q+0.15N+0.35R</text>
            <text x="12" y="68" fill="#dc2626" fontSize="7" fontFamily="sans-serif">Out-of-sample Test MAE higher</text>
            <text x="12" y="82" fill="#dc2626" fontSize="7" fontFamily="sans-serif">than Direct Model</text>
            <text x="80" y="100" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">DECISION: QUARANTINED</text>
          </g>

          <g transform="translate(10, 268)">
            <rect width="160" height="109" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Viva Defense Readiness</text>
            <line x1="8" y1="24" x2="152" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Mathematically justified</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• No ad-hoc heuristics</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Audit trail reproducible</text>
            <text x="12" y="82" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Peer-review quality</text>
            <text x="80" y="98" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">AUDIT PASSED</text>
          </g>
        </g>

        {/* Connectors */}
        <path d="M 225 220 L 245 220" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d13-arr)" />
        <path d="M 460 220 L 480 220" stroke="#2563eb" strokeWidth="2" markerEnd="url(#d13-arr)" />
        <path d="M 695 220 L 715 220" stroke="#d97706" strokeWidth="2" markerEnd="url(#d13-arr)" />
      </svg>
    </div>
  );
};
