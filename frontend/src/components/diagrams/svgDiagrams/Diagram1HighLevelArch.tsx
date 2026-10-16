import React from 'react';

export const Diagram1HighLevelArch: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="g-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
          <linearGradient id="g-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#f3e8ff" />
          </linearGradient>
          <linearGradient id="g-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
          </marker>
        </defs>

        {/* Canvas Background */}
        <rect width="920" height="540" rx="12" fill="#ffffff" />
        
        {/* Column 1: External Data Sources */}
        <g transform="translate(20, 20)">
          <rect width="180" height="420" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="180" height="36" rx="10" fill="#0284c7" />
          <text x="90" y="23" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="12" fontFamily="sans-serif">
            External Data Sources
          </text>
          
          {/* Sub-boxes */}
          <g transform="translate(12, 48)">
            <rect width="156" height="44" rx="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
            <text x="78" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">NSE Official IPO Feed</text>
            <text x="78" y="32" textAnchor="middle" fill="#0369a1" fontSize="9" fontFamily="sans-serif">IPO Metadata &amp; EQ Tallies</text>
          </g>
          <g transform="translate(12, 102)">
            <rect width="156" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="78" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">IPOWatch / Chittorgarh</text>
            <text x="78" y="32" textAnchor="middle" fill="#d97706" fontSize="9" fontFamily="sans-serif">Indicative GMP / Pipeline</text>
          </g>
          <g transform="translate(12, 156)">
            <rect width="156" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="78" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">SEBI / RHP / DRHP</text>
            <text x="78" y="32" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="sans-serif">Statutory Financial Filings</text>
          </g>
          <g transform="translate(12, 210)">
            <rect width="156" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="78" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">BSE &amp; Capital Markets</text>
            <text x="78" y="32" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="sans-serif">Exchange Master Records</text>
          </g>
          <g transform="translate(12, 264)">
            <rect width="156" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="78" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">Macro Market Indicators</text>
            <text x="78" y="32" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="sans-serif">Nifty 50, Sensex, India VIX</text>
          </g>
          <g transform="translate(12, 318)">
            <rect width="156" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="78" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">Financial News &amp; Sentiment</text>
            <text x="78" y="32" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="sans-serif">FinBERT Sentiment Aggregation</text>
          </g>
          <g transform="translate(12, 372)">
            <rect width="156" height="38" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="78" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Historical IPO Database</text>
            <text x="78" y="29" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">106 Verified Mainboard IPOs</text>
          </g>
        </g>

        {/* Connector Arrow 1 */}
        <line x1="200" y1="230" x2="236" y2="230" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrow-blue)" />

        {/* Column 2: Ingestion & Validation Layer */}
        <g transform="translate(240, 20)">
          <rect width="190" height="420" rx="10" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <rect width="190" height="36" rx="10" fill="#059669" />
          <text x="95" y="23" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="12" fontFamily="sans-serif">
            Ingestion &amp; Guardrails
          </text>

          <g transform="translate(12, 48)">
            <rect width="166" height="52" rx="6" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
            <text x="83" y="19" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">LiveIPODiscoveryService</text>
            <text x="83" y="33" textAnchor="middle" fill="#047857" fontSize="9" fontFamily="sans-serif">Hourly Background Refresh (60m)</text>
            <text x="83" y="44" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Graceful Fallback to STALE</text>
          </g>

          <g transform="translate(12, 110)">
            <rect width="166" height="54" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1.5" />
            <text x="83" y="18" textAnchor="middle" fill="#b91c1c" fontWeight="800" fontSize="10" fontFamily="sans-serif">Ex-Ante Cutoff Guardrail</text>
            <text x="83" y="32" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">&lt;= 09:59:59 IST Strict Gate</text>
            <text x="83" y="45" textAnchor="middle" fill="#b91c1c" fontSize="8" fontFamily="sans-serif">Blocks Post-Open Bidding Data</text>
          </g>

          <g transform="translate(12, 174)">
            <rect width="166" height="50" rx="6" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
            <text x="83" y="19" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Data Validation Agent</text>
            <text x="83" y="33" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">Pydantic Schemas / Range Check</text>
            <text x="83" y="44" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Price Band &amp; Issue Size Integrity</text>
          </g>

          <g transform="translate(12, 234)">
            <rect width="166" height="52" rx="6" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
            <text x="83" y="19" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">Feature Preparation Agent</text>
            <text x="83" y="33" textAnchor="middle" fill="#047857" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">Builds 45 Canonical Features</text>
            <text x="83" y="45" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Group G Feature Configuration</text>
          </g>

          <g transform="translate(12, 296)">
            <rect width="166" height="52" rx="6" fill="#ffffff" stroke="#86efac" strokeWidth="1.2" />
            <text x="83" y="19" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">FoldPreprocessor</text>
            <text x="83" y="33" textAnchor="middle" fill="#047857" fontSize="8.5" fontFamily="sans-serif">dev_preprocessor.joblib</text>
            <text x="83" y="45" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Training Medians + One-Hot Enc</text>
          </g>

          <g transform="translate(12, 358)">
            <rect width="166" height="52" rx="6" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="83" y="19" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Model Integrity Agent</text>
            <text x="83" y="32" textAnchor="middle" fill="#2563eb" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">SHA-256 Cryptographic Check</text>
            <text x="83" y="44" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">Verifies 5 Frozen Artifacts</text>
          </g>
        </g>

        {/* Connector Arrow 2 */}
        <line x1="430" y1="230" x2="466" y2="230" stroke="#059669" strokeWidth="2.5" markerEnd="url(#arrow-green)" />

        {/* Column 3: ML Intelligence & Explainability */}
        <g transform="translate(470, 20)">
          <rect width="210" height="420" rx="10" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.5" />
          <rect width="210" height="36" rx="10" fill="#7c3aed" />
          <text x="105" y="23" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="12" fontFamily="sans-serif">
            ML Inference &amp; SHAP Layer
          </text>

          {/* 4 Models Box */}
          <g transform="translate(12, 48)">
            <rect width="186" height="150" rx="8" fill="#ffffff" stroke="#c084fc" strokeWidth="1.2" />
            <text x="93" y="18" textAnchor="middle" fill="#581c87" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">Frozen Production Candidates</text>
            
            <g transform="translate(8, 26)">
              <rect width="170" height="26" rx="4" fill="#f5f3ff" />
              <text x="8" y="17" fill="#4c1d95" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Total:</text>
              <text x="44" y="17" fill="#0f172a" fontSize="9" fontFamily="sans-serif">XGBoost (log1p transform)</text>
            </g>
            <g transform="translate(8, 56)">
              <rect width="170" height="26" rx="4" fill="#f5f3ff" />
              <text x="8" y="17" fill="#4c1d95" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">QIB:</text>
              <text x="44" y="17" fill="#0f172a" fontSize="9" fontFamily="sans-serif">Random Forest (Raw Multiple)</text>
            </g>
            <g transform="translate(8, 86)">
              <rect width="170" height="26" rx="4" fill="#f5f3ff" />
              <text x="8" y="17" fill="#4c1d95" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">NII:</text>
              <text x="44" y="17" fill="#0f172a" fontSize="9" fontFamily="sans-serif">LightGBM (log1p transform)</text>
            </g>
            <g transform="translate(8, 116)">
              <rect width="170" height="26" rx="4" fill="#f5f3ff" />
              <text x="8" y="17" fill="#4c1d95" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Retail:</text>
              <text x="44" y="17" fill="#0f172a" fontSize="9" fontFamily="sans-serif">XGBoost (Raw Multiple)</text>
            </g>
          </g>

          <g transform="translate(12, 208)">
            <rect width="186" height="56" rx="6" fill="#ffffff" stroke="#c084fc" strokeWidth="1.2" />
            <text x="93" y="18" textAnchor="middle" fill="#6b21a8" fontWeight="700" fontSize="10" fontFamily="sans-serif">SHAP Explanation Agent</text>
            <text x="93" y="32" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">TreeSHAP Additive Values (phi)</text>
            <text x="93" y="46" textAnchor="middle" fill="#7c3aed" fontSize="8" fontFamily="sans-serif">Identifies Top Positive &amp; Negative Drivers</text>
          </g>

          <g transform="translate(12, 274)">
            <rect width="186" height="52" rx="6" fill="#ffffff" stroke="#c084fc" strokeWidth="1.2" />
            <text x="93" y="18" textAnchor="middle" fill="#6b21a8" fontWeight="700" fontSize="10" fontFamily="sans-serif">Risk &amp; Category Edge Agents</text>
            <text x="93" y="32" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">Composite Risk Penalty Scoring</text>
            <text x="93" y="44" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">Investor Edge: QIB / NII / Retail</text>
          </g>

          <g transform="translate(12, 336)">
            <rect width="186" height="72" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="93" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Monitoring &amp; Governance</text>
            <text x="93" y="32" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Prospective Drift Evaluator (PSI)</text>
            <text x="93" y="44" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Weekly Retraining Framework</text>
            <text x="93" y="58" textAnchor="middle" fill="#b91c1c" fontWeight="700" fontSize="8" fontFamily="sans-serif">Auto-Promotion: DISABLED (Gate N&gt;=10)</text>
          </g>
        </g>

        {/* Connector Arrow 3 */}
        <line x1="680" y1="230" x2="716" y2="230" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrow-blue)" />

        {/* Column 4: Application & Presentation Layer */}
        <g transform="translate(720, 20)">
          <rect width="180" height="420" rx="10" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
          <rect width="180" height="36" rx="10" fill="#d97706" />
          <text x="90" y="23" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="12" fontFamily="sans-serif">
            Presentation &amp; UI Layer
          </text>

          <g transform="translate(10, 48)">
            <rect width="160" height="66" rx="6" fill="#ffffff" stroke="#fde68a" strokeWidth="1.2" />
            <text x="80" y="18" textAnchor="middle" fill="#92400e" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">FastAPI REST Backend</text>
            <text x="80" y="32" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">Pydantic v2 / OpenTelemetry</text>
            <text x="80" y="45" textAnchor="middle" fill="#0284c7" fontSize="8.5" fontFamily="sans-serif">/api/v1/ipo/active-open</text>
            <text x="80" y="57" textAnchor="middle" fill="#0284c7" fontSize="8.5" fontFamily="sans-serif">/api/v1/ipo/next-15-days</text>
          </g>

          <g transform="translate(10, 124)">
            <rect width="160" height="150" rx="6" fill="#ffffff" stroke="#fde68a" strokeWidth="1.2" />
            <text x="80" y="18" textAnchor="middle" fill="#92400e" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">React 18 + Vite Frontend</text>
            <text x="12" y="38" fill="#334155" fontSize="8.5" fontFamily="sans-serif">• Dashboard (Active &amp; Next 15d)</text>
            <text x="12" y="54" fill="#334155" fontSize="8.5" fontFamily="sans-serif">• Model &amp; Prediction Page</text>
            <text x="12" y="70" fill="#334155" fontSize="8.5" fontFamily="sans-serif">• Custom Scenario Analysis</text>
            <text x="12" y="86" fill="#334155" fontSize="8.5" fontFamily="sans-serif">• Diagrams &amp; Documentation</text>
            <text x="12" y="102" fill="#334155" fontSize="8.5" fontFamily="sans-serif">• About &amp; Methodology</text>
            <text x="12" y="118" fill="#334155" fontSize="8.5" fontFamily="sans-serif">• Retrospective Outcome Audit</text>
            <text x="12" y="134" fill="#059669" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">• Evidence Confidence (Max 82%)</text>
          </g>

          <g transform="translate(10, 284)">
            <rect width="160" height="124" rx="6" fill="#ffffff" stroke="#fde68a" strokeWidth="1.2" />
            <text x="80" y="18" textAnchor="middle" fill="#92400e" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">Target Stakeholders</text>
            <text x="12" y="38" fill="#0f172a" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">1. Retail Investors</text>
            <text x="22" y="51" fill="#64748b" fontSize="8" fontFamily="sans-serif">Category edge &amp; risk rating</text>
            <text x="12" y="67" fill="#0f172a" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">2. Financial Analysts</text>
            <text x="22" y="80" fill="#64748b" fontSize="8" fontFamily="sans-serif">TreeSHAP &amp; scenario test</text>
            <text x="12" y="96" fill="#0f172a" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">3. System Admins</text>
            <text x="22" y="109" fill="#64748b" fontSize="8" fontFamily="sans-serif">SHA-256 &amp; drift monitoring</text>
          </g>
        </g>

        {/* Bottom Bar: Infrastructure Banner */}
        <g transform="translate(20, 460)">
          <rect width="880" height="60" rx="8" fill="#0f172a" />
          <text x="440" y="24" textAnchor="middle" fill="#38bdf8" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            Underlying Infrastructure &amp; Runtime Environment
          </text>
          <text x="440" y="44" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily="sans-serif">
            FastAPI 0.110+ • Python 3.11 • Uvicorn • React 18 • TypeScript 5 • TanStack Query • Joblib Model Storage • SHA-256 Hash Verification
          </text>
        </g>
      </svg>
    </div>
  );
};
