import React from 'react';

export const Diagram16AgenticOrchestration: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d16-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <marker id="d16-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#4f46e5" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d16-hdr)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          11-AGENT AUTONOMOUS AGENTIC AI EXECUTION &amp; ORCHESTRATION GRAPH
        </text>

        {/* Stage 1: Data Gathering Agents (Left) */}
        <g transform="translate(25, 70)">
          <rect width="165" height="400" rx="8" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <rect width="165" height="28" rx="8" fill="#4f46e5" />
          <text x="82.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
            Stage 1: Discovery &amp; Ingestion
          </text>

          {/* Agent 1 */}
          <g transform="translate(8, 36)">
            <rect width="149" height="70" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1" />
            <text x="74.5" y="16" textAnchor="middle" fill="#312e81" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">1. IPO Ingestion Agent</text>
            <text x="74.5" y="30" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Scrapes upcoming IPOs</text>
            <text x="74.5" y="42" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Downloads SEBI DRHP/RHP</text>
            <text x="74.5" y="56" textAnchor="middle" fill="#4f46e5" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Status: Autonomous</text>
          </g>

          {/* Agent 2 */}
          <g transform="translate(8, 114)">
            <rect width="149" height="75" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1" />
            <text x="74.5" y="16" textAnchor="middle" fill="#312e81" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">2. Temporal Guard Agent</text>
            <text x="74.5" y="30" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">09:59:59 IST Enforcer</text>
            <text x="74.5" y="44" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Verifies pre-opening timestamp</text>
            <text x="74.5" y="56" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Drops post-cutoff items</text>
            <text x="74.5" y="68" textAnchor="middle" fill="#16a34a" fontSize="7" fontWeight="600" fontFamily="sans-serif">Zero Lookahead Gate</text>
          </g>

          {/* Agent 3 */}
          <g transform="translate(8, 197)">
            <rect width="149" height="75" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1" />
            <text x="74.5" y="16" textAnchor="middle" fill="#312e81" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">3. Market Sentiment Agent</text>
            <text x="74.5" y="30" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">FinBERT sentiment pipeline</text>
            <text x="74.5" y="44" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Scrapes financial media</text>
            <text x="74.5" y="56" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Collects Day -1 GMP</text>
            <text x="74.5" y="68" textAnchor="middle" fill="#d97706" fontSize="7" fontWeight="600" fontFamily="sans-serif">Sentiment Score [-1, +1]</text>
          </g>

          {/* Agent 4 */}
          <g transform="translate(8, 280)">
            <rect width="149" height="75" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1" />
            <text x="74.5" y="16" textAnchor="middle" fill="#312e81" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">4. Fundamentals Agent</text>
            <text x="74.5" y="30" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Parses balance sheets &amp; P&amp;L</text>
            <text x="74.5" y="44" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Computes P/E, RoNW, PAT</text>
            <text x="74.5" y="56" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Anchor investor allotment</text>
            <text x="74.5" y="68" textAnchor="middle" fill="#4f46e5" fontSize="7" fontWeight="600" fontFamily="sans-serif">12 Financial Metrics</text>
          </g>

          <text x="82.5" y="380" textAnchor="middle" fill="#4338ca" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">
            Data Extraction Tier
          </text>
        </g>

        {/* Stage 2: Feature Synthesis & Preprocessing */}
        <g transform="translate(200, 70)">
          <rect width="165" height="400" rx="8" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5" />
          <rect width="165" height="28" rx="8" fill="#7c3aed" />
          <text x="82.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
            Stage 2: Feature Synthesis
          </text>

          {/* Agent 5 */}
          <g transform="translate(8, 45)">
            <rect width="149" height="120" rx="6" fill="#ffffff" stroke="#ddd6fe" strokeWidth="1" />
            <text x="74.5" y="18" textAnchor="middle" fill="#581c87" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">5. Feature Eng Agent</text>
            <line x1="6" y1="24" x2="143" y2="24" stroke="#f3e8ff" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Assembles 45 canonicals</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Group_G schema mapping</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• dev_preprocessor apply</text>
            <text x="10" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Median impute + Robust</text>
            <text x="10" y="94" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• SHA-256 snapshot log</text>
            <text x="74.5" y="112" textAnchor="middle" fill="#7c3aed" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Output: Vector (1, 45)</text>
          </g>

          {/* Agent 6 */}
          <g transform="translate(8, 195)">
            <rect width="149" height="135" rx="6" fill="#ffffff" stroke="#ddd6fe" strokeWidth="1" />
            <text x="74.5" y="18" textAnchor="middle" fill="#581c87" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">6. Model Selection Agent</text>
            <line x1="6" y1="24" x2="143" y2="24" stroke="#f3e8ff" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Loads frozen candidates</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Verifies SHA-256 checks</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Routes Total to XGBoost</text>
            <text x="10" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Routes QIB to Random Forest</text>
            <text x="10" y="94" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Routes NII to LightGBM</text>
            <text x="10" y="108" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Routes Retail to XGBoost</text>
            <text x="74.5" y="126" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Multi-Engine Routed</text>
          </g>

          <text x="82.5" y="380" textAnchor="middle" fill="#6d28d9" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">
            Transform Tier
          </text>
        </g>

        {/* Stage 3: Inference & Explainability */}
        <g transform="translate(375, 70)">
          <rect width="170" height="400" rx="8" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
          <rect width="170" height="28" rx="8" fill="#d97706" />
          <text x="85" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
            Stage 3: Inference &amp; Explain
          </text>

          {/* Agent 7 */}
          <g transform="translate(8, 40)">
            <rect width="154" height="105" rx="6" fill="#ffffff" stroke="#fde68a" strokeWidth="1" />
            <text x="77" y="18" textAnchor="middle" fill="#78350f" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">7. Multi-Inference Agent</text>
            <line x1="6" y1="24" x2="148" y2="24" stroke="#fef3c7" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Parallel execution</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Direct Total (log1p =&gt; exp)</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• QIB / NII / Retail models</text>
            <text x="10" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Weighted ensemble test</text>
            <text x="77" y="96" textAnchor="middle" fill="#d97706" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Execution Time: 12ms</text>
          </g>

          {/* Agent 8 */}
          <g transform="translate(8, 155)">
            <rect width="154" height="105" rx="6" fill="#ffffff" stroke="#fde68a" strokeWidth="1" />
            <text x="77" y="18" textAnchor="middle" fill="#78350f" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">8. SHAP Explainer Agent</text>
            <line x1="6" y1="24" x2="148" y2="24" stroke="#fef3c7" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Computes Shapley values</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Top positive drivers</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Top drag / negative factors</text>
            <text x="10" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Base value vs Prediction</text>
            <text x="77" y="96" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Full Local Explainability</text>
          </g>

          {/* Agent 9 */}
          <g transform="translate(8, 270)">
            <rect width="154" height="95" rx="6" fill="#ffffff" stroke="#fde68a" strokeWidth="1" />
            <text x="77" y="18" textAnchor="middle" fill="#78350f" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">9. Risk &amp; Quantile Agent</text>
            <line x1="6" y1="24" x2="148" y2="24" stroke="#fef3c7" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Computes [P05, P50, P95]</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Over-subscription prob</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Extreme scenario stress test</text>
            <text x="77" y="84" textAnchor="middle" fill="#4f46e5" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Confidence Interval 90%</text>
          </g>

          <text x="85" y="385" textAnchor="middle" fill="#b45309" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">
            Prediction Tier
          </text>
        </g>

        {/* Stage 4: Monitoring, Audit & Governance (Right) */}
        <g transform="translate(555, 70)">
          <rect width="170" height="400" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
          <rect width="170" height="28" rx="8" fill="#059669" />
          <text x="85" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
            Stage 4: Audit &amp; Observability
          </text>

          {/* Agent 10 */}
          <g transform="translate(8, 50)">
            <rect width="154" height="135" rx="6" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
            <text x="77" y="18" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">10. Live Monitoring Agent</text>
            <line x1="6" y1="24" x2="148" y2="24" stroke="#d1fae5" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Tracks API latency &amp; SLO</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Computes Population Drift (PSI)</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Triggers hourly live NSE pull</text>
            <text x="10" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Isolates live bids to UI card</text>
            <text x="10" y="94" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Flags stale cache events</text>
            <text x="77" y="120" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Real-Time Heartbeat</text>
          </g>

          {/* Agent 11 */}
          <g transform="translate(8, 205)">
            <rect width="154" height="145" rx="6" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
            <text x="77" y="18" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">11. Retraining Evaluator</text>
            <line x1="6" y1="24" x2="148" y2="24" stroke="#d1fae5" />
            <text x="10" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Sandbox quarantine watcher</text>
            <text x="10" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Enforces walk-forward CV</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Validates MAE &amp; RMSE gates</text>
            <text x="10" y="80" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Prevents auto-overwrites</text>
            <text x="10" y="94" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Appends prediction_audit</text>
            <text x="77" y="128" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Integrity Gatekeeper</text>
          </g>

          <text x="85" y="385" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">
            Governance Tier
          </text>
        </g>

        {/* Stage 5: Target Presentation / UI (Far Right) */}
        <g transform="translate(735, 70)">
          <rect width="160" height="400" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="160" height="28" rx="8" fill="#334155" />
          <text x="80" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
            User Experience
          </text>

          <g transform="translate(10, 45)">
            <rect width="140" height="90" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">Live Dashboard</text>
            <text x="70" y="32" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Ex-Ante AI: 23.7x</text>
            <text x="70" y="46" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Live NSE: 71.3x</text>
            <text x="70" y="58" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="sans-serif">(Observation Only)</text>
            <text x="70" y="74" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Status: In-Market</text>
          </g>

          <g transform="translate(10, 150)">
            <rect width="140" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">Intelligence Tab</text>
            <text x="70" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Waterfall SHAP Chart</text>
            <text x="70" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Quantile Distribution</text>
            <text x="70" y="62" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Peer Multiples Table</text>
            <text x="70" y="78" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Deep Viva Insights</text>
          </g>

          <g transform="translate(10, 260)">
            <rect width="140" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">Diagrams Page</text>
            <text x="70" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• 18 SVG Architectures</text>
            <text x="70" y="48" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Interactive Walkthrough</text>
            <text x="70" y="62" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Vector Zoom &amp; Pan</text>
            <text x="70" y="78" textAnchor="middle" fill="#7c3aed" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Research Quality</text>
          </g>
        </g>

        {/* Connectors */}
        <path d="M 190 230 L 200 230" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#d16-arr)" />
        <path d="M 365 230 L 375 230" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#d16-arr)" />
        <path d="M 545 230 L 555 230" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#d16-arr)" />
        <path d="M 725 230 L 735 230" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#d16-arr)" />
      </svg>
    </div>
  );
};
