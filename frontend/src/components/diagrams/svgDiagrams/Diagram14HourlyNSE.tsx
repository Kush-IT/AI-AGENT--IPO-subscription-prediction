import React from 'react';

export const Diagram14HourlyNSE: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d14-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <marker id="d14-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="d14-arr-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d14-hdr)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          HOURLY LIVE NSE FEED FLOW &amp; STRICT ARCHITECTURAL SEGREGATION
        </text>

        {/* Step 1: External NSE Poller */}
        <g transform="translate(20, 68)">
          <rect width="170" height="395" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect width="170" height="28" rx="8" fill="#0284c7" />
          <text x="85" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            1. 60m Scheduled Scraper
          </text>

          <g transform="translate(10, 38)">
            <rect width="150" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">APScheduler Interval</text>
            <text x="75" y="32" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Triggers Every 60 Mins</text>
            <line x1="8" y1="36" x2="142" y2="36" stroke="#e2e8f0" />
            <text x="12" y="50" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Checks active trading hours</text>
            <text x="12" y="64" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• 10:00 to 17:00 IST</text>
            <text x="12" y="78" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Queries live IPO symbols</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="150" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">NSE API Connector</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• User-Agent rotation</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Session cookie refresh</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Exponential backoff (x3)</text>
            <text x="12" y="82" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Timeout: 8s per request</text>
          </g>

          <g transform="translate(10, 242)">
            <rect width="150" height="135" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Circuit Breaker &amp; Cache</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• If NSE rate limits (429/403):</text>
            <text x="12" y="54" fill="#d97706" fontSize="7.5" fontFamily="sans-serif">  Trips breaker for 15 mins</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Serves cached JSON fallback</text>
            <text x="12" y="82" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Emits STALE tag to UI</text>
            <rect x="8" y="96" width="134" height="24" rx="3" fill="#fef3c7" stroke="#fde68a" />
            <text x="75" y="112" textAnchor="middle" fill="#92400e" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Zero UI Crash on Failure</text>
          </g>
        </g>

        {/* Step 2: Ingestion & Cache Layer */}
        <g transform="translate(205, 68)">
          <rect width="170" height="395" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <rect width="170" height="28" rx="8" fill="#2563eb" />
          <text x="85" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            2. Ingestion &amp; Cache
          </text>

          <g transform="translate(10, 38)">
            <rect width="150" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Live Raw Payload</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="38" fill="#334155" fontSize="7.5" fontFamily="monospace">symbol: "SSRETAIL"</text>
            <text x="12" y="50" fill="#334155" fontSize="7.5" fontFamily="monospace">live_total: 71.332x</text>
            <text x="12" y="62" fill="#334155" fontSize="7.5" fontFamily="monospace">live_qib: 98.401x</text>
            <text x="12" y="74" fill="#334155" fontSize="7.5" fontFamily="monospace">live_nii: 142.112x</text>
            <text x="12" y="86" fill="#334155" fontSize="7.5" fontFamily="monospace">live_retail: 28.514x</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="150" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Cache with TTL</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• live_ipo_cache.json</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• TTL: 3600 seconds</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Timestamp validated</text>
            <text x="12" y="82" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Atomic file write</text>
          </g>

          <g transform="translate(10, 252)">
            <rect width="150" height="125" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Sanitization &amp; Bounds</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Check subscription &gt;= 0</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Discard malformed shares</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Round to 3 decimals</text>
            <text x="12" y="82" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Tag day number: Day 1/2/3</text>
            <text x="75" y="104" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Sanitization Complete</text>
          </g>
        </g>

        {/* Step 3: THE GREAT ARCHITECTURAL DIVIDE (RED BARRIER) */}
        <g transform="translate(390, 68)">
          <rect width="155" height="395" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
          <rect width="155" height="28" rx="8" fill="#dc2626" />
          <text x="77.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            3. ISOLATION BARRIER
          </text>

          <g transform="translate(8, 38)">
            <rect width="139" height="150" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
            <text x="69.5" y="18" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">FORBIDDEN ROUTES</text>
            <line x1="6" y1="24" x2="133" y2="24" stroke="#fecaca" />
            <text x="10" y="38" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">❌ NO FEATURE STORE</text>
            <text x="10" y="52" fill="#475569" fontSize="7" fontFamily="sans-serif">   Live tallies cannot enter</text>
            <text x="10" y="62" fill="#475569" fontSize="7" fontFamily="sans-serif">   the 45 feature vector</text>
            <text x="10" y="78" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">❌ NO TARGET OVERWRITE</text>
            <text x="10" y="92" fill="#475569" fontSize="7" fontFamily="sans-serif">   Live != Final outcome</text>
            <text x="10" y="102" fill="#475569" fontSize="7" fontFamily="sans-serif">   Must not bias models</text>
            <text x="10" y="118" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">❌ NO RETRAINING FEED</text>
            <text x="10" y="132" fill="#475569" fontSize="7" fontFamily="sans-serif">   Zero feedback loop</text>
          </g>

          <g transform="translate(8, 200)">
            <rect width="139" height="175" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="69.5" y="18" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">ALLOWED ROUTE</text>
            <line x1="6" y1="24" x2="133" y2="24" stroke="#bbf7d0" />
            <text x="10" y="40" fill="#059669" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">✔ DASHBOARD ONLY</text>
            <text x="10" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">Forwarded directly to</text>
            <text x="10" y="66" fill="#334155" fontSize="7.5" fontFamily="sans-serif">frontend state as</text>
            <rect x="6" y="74" width="127" height="22" rx="3" fill="#ffffff" stroke="#86efac" />
            <text x="69.5" y="89" textAnchor="middle" fill="#166534" fontSize="7" fontWeight="700" fontFamily="sans-serif">"OBSERVATION ONLY"</text>
            <text x="10" y="114" fill="#475569" fontSize="7" fontFamily="sans-serif">Presented side-by-side</text>
            <text x="10" y="126" fill="#475569" fontSize="7" fontFamily="sans-serif">with Ex-Ante Prediction</text>
            <text x="10" y="138" fill="#475569" fontSize="7" fontFamily="sans-serif">so human investors see</text>
            <text x="10" y="150" fill="#475569" fontSize="7" fontFamily="sans-serif">live actual progression.</text>
            <text x="69.5" y="165" textAnchor="middle" fill="#059669" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">SAFE &amp; TRANSPARENT</text>
          </g>
        </g>

        {/* Step 4: AI Model Pipeline (Completely Parallel) */}
        <g transform="translate(560, 68)">
          <rect width="170" height="395" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
          <rect width="170" height="28" rx="8" fill="#d97706" />
          <text x="85" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            4. Pure Ex-Ante AI Pipeline
          </text>

          <g transform="translate(10, 38)">
            <rect width="150" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Ex-Ante Input Sources</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• SEBI RHP Financials</text>
            <text x="12" y="50" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Issue Structure &amp; Price</text>
            <text x="12" y="62" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Day -1 Indicative GMP</text>
            <text x="12" y="74" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• FinBERT Sentiment</text>
            <text x="75" y="88" textAnchor="middle" fill="#059669" fontSize="7" fontWeight="600" fontFamily="sans-serif">All &lt;= 09:59:59 IST</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="150" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Frozen Production Model</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="38" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• total_xgboost_log1p</text>
            <text x="12" y="50" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• SHA256: 3b00118e...</text>
            <text x="12" y="64" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Direct Total Prediction:</text>
            <rect x="8" y="70" width="134" height="24" rx="3" fill="#eff6ff" stroke="#bfdbfe" />
            <text x="75" y="86" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="700" fontFamily="sans-serif">e.g. SS Retail: 23.7x</text>
            <text x="75" y="103" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="sans-serif">Independent of live tallies</text>
          </g>

          <g transform="translate(10, 267)">
            <rect width="150" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="75" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">SHAP &amp; Uncertainty</text>
            <line x1="8" y1="24" x2="142" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• TreeSHAP attributions</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Quantile bounds: [P05, P95]</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Subscription likelihood</text>
            <rect x="8" y="78" width="134" height="20" rx="3" fill="#f0fdf4" />
            <text x="75" y="92" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Statistically Defensible</text>
          </g>
        </g>

        {/* Step 5: Dashboard Presentation */}
        <g transform="translate(745, 68)">
          <rect width="155" height="395" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="155" height="28" rx="8" fill="#475569" />
          <text x="77.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            5. UI Presentation
          </text>

          <g transform="translate(10, 38)">
            <rect width="135" height="145" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Dashboard Card</text>
            <line x1="6" y1="24" x2="129" y2="24" stroke="#e2e8f0" />
            <rect x="6" y="30" width="123" height="42" rx="3" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="67.5" y="44" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">EX-ANTE PREDICTION</text>
            <text x="67.5" y="58" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="700" fontFamily="sans-serif">23.7x</text>
            <text x="67.5" y="68" textAnchor="middle" fill="#166534" fontSize="6.5" fontFamily="sans-serif">Pre-Opening Model Output</text>
            
            <rect x="6" y="80" width="123" height="48" rx="3" fill="#fee2e2" stroke="#fecaca" />
            <text x="67.5" y="94" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">LIVE NSE OBSERVATION</text>
            <text x="67.5" y="108" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="700" fontFamily="sans-serif">71.3x</text>
            <text x="67.5" y="118" textAnchor="middle" fill="#7f1d1d" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">Observation Only (Day 3)</text>
            <text x="67.5" y="125" textAnchor="middle" fill="#7f1d1d" fontSize="6" fontFamily="sans-serif">Not training target</text>
          </g>

          <g transform="translate(10, 200)">
            <rect width="135" height="175" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">User Understanding</text>
            <line x1="6" y1="24" x2="129" y2="24" stroke="#e2e8f0" />
            <text x="8" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Ex-ante prediction</text>
            <text x="8" y="52" fill="#334155" fontSize="7.5" fontFamily="sans-serif">  answers: "What was</text>
            <text x="8" y="64" fill="#334155" fontSize="7.5" fontFamily="sans-serif">  expected before doors</text>
            <text x="8" y="76" fill="#334155" fontSize="7.5" fontFamily="sans-serif">  opened?"</text>
            <text x="8" y="94" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• Live observation</text>
            <text x="8" y="106" fill="#334155" fontSize="7.5" fontFamily="sans-serif">  answers: "How many</text>
            <text x="8" y="118" fill="#334155" fontSize="7.5" fontFamily="sans-serif">  bids have arrived so far</text>
            <text x="8" y="130" fill="#334155" fontSize="7.5" fontFamily="sans-serif">  on the exchange?"</text>
            <text x="67.5" y="152" textAnchor="middle" fill="#059669" fontSize="7" fontWeight="700" fontFamily="sans-serif">Complete Clarity</text>
          </g>
        </g>

        {/* Connectors */}
        <path d="M 190 230 L 205 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d14-arr)" />
        <path d="M 375 230 L 390 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d14-arr)" />
        <path d="M 545 320 L 745 320" stroke="#059669" strokeWidth="2" markerEnd="url(#d14-arr)" />
        <path d="M 730 230 L 745 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d14-arr)" />
      </svg>
    </div>
  );
};
