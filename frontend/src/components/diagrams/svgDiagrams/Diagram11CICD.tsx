import React from 'react';

export const Diagram11CICD: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d11-card" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <marker id="d11-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="#1e293b" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          CONTINUOUS INTEGRATION, CRYPTOGRAPHIC GATING &amp; DEPLOYMENT (CI/CD)
        </text>

        {/* Step 1: Code Push & Static Analysis */}
        <g transform="translate(20, 68)">
          <rect width="160" height="395" rx="8" fill="url(#d11-card)" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="160" height="28" rx="8" fill="#3b82f6" />
          <text x="80" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            1. Push &amp; Lint Gate
          </text>

          <g transform="translate(10, 40)">
            <rect width="140" height="70" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Git Commit / PR</text>
            <text x="70" y="34" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">GitHub Actions Trigger</text>
            <text x="70" y="48" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="600" fontFamily="sans-serif">Branch: main / staging</text>
            <text x="70" y="60" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Pre-commit hooks</text>
          </g>

          <g transform="translate(10, 125)">
            <rect width="140" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Static Code Analysis</text>
            <line x1="8" y1="24" x2="132" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• TypeScript: tsc --noEmit</text>
            <text x="14" y="56" fill="#334155" fontSize="8" fontFamily="sans-serif">• ESLint (Strict rules)</text>
            <text x="14" y="72" fill="#334155" fontSize="8" fontFamily="sans-serif">• Python: flake8 &amp; black</text>
            <text x="14" y="88" fill="#334155" fontSize="8" fontFamily="sans-serif">• Pydantic schema checks</text>
            <text x="14" y="102" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Pass: 0 Syntax/Type Errors</text>
          </g>

          <g transform="translate(10, 250)">
            <rect width="140" height="130" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Dependency Audit</text>
            <text x="70" y="32" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">npm audit &amp; pip safety</text>
            <rect x="8" y="40" width="124" height="24" rx="3" fill="#eff6ff" />
            <text x="70" y="55" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Node.js 20 LTS</text>
            <rect x="8" y="70" width="124" height="24" rx="3" fill="#f0fdf4" />
            <text x="70" y="85" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Python 3.11.9 Engine</text>
            <text x="70" y="112" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Clean Dependencies</text>
          </g>
        </g>

        {/* Step 2: Automated Test Execution */}
        <g transform="translate(195, 68)">
          <rect width="165" height="395" rx="8" fill="url(#d11-card)" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="165" height="28" rx="8" fill="#0284c7" />
          <text x="82.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            2. Test Suite Execution
          </text>

          <g transform="translate(10, 40)">
            <rect width="145" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Frontend Vitest Suite</text>
            <line x1="8" y1="24" x2="137" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• 22+ Unit &amp; Component Tests</text>
            <text x="14" y="56" fill="#334155" fontSize="8" fontFamily="sans-serif">• Diagram filter &amp; zoom test</text>
            <text x="14" y="72" fill="#334155" fontSize="8" fontFamily="sans-serif">• Header &amp; Route navigations</text>
            <text x="14" y="88" fill="#334155" fontSize="8" fontFamily="sans-serif">• Observation card check</text>
            <text x="14" y="102" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Result: 100% Passed</text>
          </g>

          <g transform="translate(10, 160)">
            <rect width="145" height="125" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Backend Pytest Suite</text>
            <line x1="8" y1="24" x2="137" y2="24" stroke="#e2e8f0" />
            <text x="14" y="38" fill="#334155" fontSize="8" fontFamily="sans-serif">• 221 Comprehensive Tests</text>
            <text x="14" y="52" fill="#334155" fontSize="8" fontFamily="sans-serif">• 45-feature alignment</text>
            <text x="14" y="66" fill="#334155" fontSize="8" fontFamily="sans-serif">• Preprocessor transform test</text>
            <text x="14" y="80" fill="#334155" fontSize="8" fontFamily="sans-serif">• Inference stability &lt;15ms</text>
            <text x="14" y="94" fill="#334155" fontSize="8" fontFamily="sans-serif">• API contract validation</text>
            <text x="14" y="112" fill="#059669" fontSize="8" fontWeight="700" fontFamily="sans-serif">Result: 221 PASSED</text>
          </g>

          <g transform="translate(10, 295)">
            <rect width="145" height="85" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">Coverage Threshold</text>
            <text x="72.5" y="36" textAnchor="middle" fill="#15803d" fontSize="8" fontFamily="sans-serif">Code coverage: &gt;88%</text>
            <text x="72.5" y="50" textAnchor="middle" fill="#15803d" fontSize="8" fontFamily="sans-serif">Critical paths: 100%</text>
            <text x="72.5" y="68" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="700" fontFamily="sans-serif">Zero Regression Permitted</text>
          </g>
        </g>

        {/* Step 3: Model Integrity & SHA-256 Gate */}
        <g transform="translate(375, 68)">
          <rect width="175" height="395" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
          <rect width="175" height="28" rx="8" fill="#d97706" />
          <text x="87.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            3. Cryptographic Model Gate
          </text>

          <g transform="translate(10, 40)">
            <rect width="155" height="90" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="77.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">SHA-256 Verification</text>
            <line x1="8" y1="22" x2="147" y2="22" stroke="#e2e8f0" />
            <text x="12" y="36" fill="#334155" fontSize="7.5" fontFamily="monospace">• preprocessor: 04bd6412</text>
            <text x="12" y="48" fill="#334155" fontSize="7.5" fontFamily="monospace">• total: 3b00118e</text>
            <text x="12" y="60" fill="#334155" fontSize="7.5" fontFamily="monospace">• qib: 29188a79</text>
            <text x="12" y="72" fill="#334155" fontSize="7.5" fontFamily="monospace">• nii: 618ef835</text>
            <text x="12" y="84" fill="#334155" fontSize="7.5" fontFamily="monospace">• retail: 835ceb1f</text>
          </g>

          <g transform="translate(10, 140)">
            <rect width="155" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="77.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Lookahead Leakage Guard</text>
            <line x1="8" y1="22" x2="147" y2="22" stroke="#e2e8f0" />
            <text x="12" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Audit all features in test</text>
            <text x="12" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Verify timestamp &lt;= 09:59</text>
            <text x="12" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• No Day-1/2/3 live tally used</text>
            <text x="12" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• No target in feature matrix</text>
            <text x="77.5" y="98" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="700" fontFamily="sans-serif">LEAKAGE CHECK: PASSED</text>
          </g>

          <g transform="translate(10, 260)">
            <rect width="155" height="120" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="77.5" y="16" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">Immutable Lock Policy</text>
            <line x1="8" y1="22" x2="147" y2="22" stroke="#fecaca" />
            <text x="77.5" y="36" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">If any SHA-256 fails:</text>
            <text x="77.5" y="52" textAnchor="middle" fill="#b91c1c" fontSize="8" fontWeight="700" fontFamily="sans-serif">PIPELINE ABORTED</text>
            <text x="77.5" y="70" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">Production models inside</text>
            <text x="77.5" y="82" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="monospace">models/final_candidates/</text>
            <text x="77.5" y="94" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">cannot be overwritten</text>
            <text x="77.5" y="110" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Integrity Enforced</text>
          </g>
        </g>

        {/* Step 4: Build & Container Packaging */}
        <g transform="translate(565, 68)">
          <rect width="165" height="395" rx="8" fill="url(#d11-card)" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="165" height="28" rx="8" fill="#7c3aed" />
          <text x="82.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            4. Artifact Packaging
          </text>

          <g transform="translate(10, 40)">
            <rect width="145" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Vite Production Build</text>
            <line x1="8" y1="24" x2="137" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• npm run build</text>
            <text x="14" y="54" fill="#334155" fontSize="8" fontFamily="sans-serif">• Minified JS/CSS bundle</text>
            <text x="14" y="68" fill="#334155" fontSize="8" fontFamily="sans-serif">• Tree-shaking &amp; splitting</text>
            <text x="14" y="82" fill="#334155" fontSize="8" fontFamily="sans-serif">• Exit code 0 verified</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="145" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Docker Container Build</text>
            <line x1="8" y1="24" x2="137" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• Multi-stage Dockerfile</text>
            <text x="14" y="54" fill="#334155" fontSize="8" fontFamily="sans-serif">• Base: python:3.11-slim</text>
            <text x="14" y="68" fill="#334155" fontSize="8" fontFamily="sans-serif">• Read-only volume mount</text>
            <text x="14" y="82" fill="#334155" fontSize="8" fontFamily="sans-serif">• Non-root user execution</text>
            <text x="14" y="98" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Image size: ~320 MB</text>
          </g>

          <g transform="translate(10, 265)">
            <rect width="145" height="115" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Release Tagging</text>
            <line x1="8" y1="24" x2="137" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• Git tag: v2.4.0-stable</text>
            <text x="14" y="54" fill="#334155" fontSize="8" fontFamily="sans-serif">• SBOM generation</text>
            <text x="14" y="68" fill="#334155" fontSize="8" fontFamily="sans-serif">• Container digest logged</text>
            <text x="14" y="82" fill="#334155" fontSize="8" fontFamily="sans-serif">• Artifact signed</text>
            <text x="72.5" y="102" textAnchor="middle" fill="#7c3aed" fontSize="8" fontWeight="600" fontFamily="sans-serif">Ready for Deployment</text>
          </g>
        </g>

        {/* Step 5: Production Deployment & Health Smoke Test */}
        <g transform="translate(745, 68)">
          <rect width="155" height="395" rx="8" fill="url(#d11-card)" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="155" height="28" rx="8" fill="#059669" />
          <text x="77.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            5. Deploy &amp; Smoke Test
          </text>

          <g transform="translate(10, 40)">
            <rect width="135" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Zero-Downtime Roll</text>
            <line x1="8" y1="24" x2="127" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• Blue/Green deployment</text>
            <text x="12" y="54" fill="#334155" fontSize="8" fontFamily="sans-serif">• Health probes polling</text>
            <text x="12" y="68" fill="#334155" fontSize="8" fontFamily="sans-serif">• Traffic swap upon 200 OK</text>
            <text x="12" y="82" fill="#334155" fontSize="8" fontFamily="sans-serif">• Instant rollback ready</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="135" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Post-Deploy Probe</text>
            <line x1="8" y1="24" x2="127" y2="24" stroke="#e2e8f0" />
            <text x="12" y="38" fill="#0284c7" fontSize="7.5" fontFamily="monospace">GET /api/health</text>
            <text x="12" y="52" fill="#059669" fontSize="7.5" fontFamily="monospace">200 OK {"{"}"status":"healthy"{"}"}</text>
            <text x="12" y="66" fill="#0284c7" fontSize="7.5" fontFamily="monospace">POST /api/predict</text>
            <text x="12" y="80" fill="#059669" fontSize="7.5" fontFamily="monospace">200 OK (latency &lt;15ms)</text>
            <text x="67.5" y="100" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Smoke Test Passed</text>
          </g>

          <g transform="translate(10, 265)">
            <rect width="135" height="115" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="67.5" y="18" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Live Production</text>
            <text x="67.5" y="38" textAnchor="middle" fill="#15803d" fontSize="8" fontFamily="sans-serif">Dashboard Active</text>
            <text x="67.5" y="54" textAnchor="middle" fill="#15803d" fontSize="8" fontFamily="sans-serif">Drift monitoring on</text>
            <text x="67.5" y="70" textAnchor="middle" fill="#15803d" fontSize="8" fontFamily="sans-serif">Auditing active</text>
            <rect x="8" y="80" width="119" height="22" rx="3" fill="#166534" />
            <text x="67.5" y="95" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" fontFamily="sans-serif">SYSTEM ONLINE</text>
          </g>
        </g>

        {/* Horizontal Connectors */}
        <path d="M 180 230 L 195 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d11-arr)" />
        <path d="M 360 230 L 375 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d11-arr)" />
        <path d="M 550 230 L 565 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d11-arr)" />
        <path d="M 730 230 L 745 230" stroke="#059669" strokeWidth="2" markerEnd="url(#d11-arr)" />
      </svg>
    </div>
  );
};
