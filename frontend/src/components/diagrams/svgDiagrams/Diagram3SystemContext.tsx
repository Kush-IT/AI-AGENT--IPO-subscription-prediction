import React from 'react';

export const Diagram3SystemContext: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ctx-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="ctx-arr-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Central Core System */}
        <g transform="translate(330, 180)">
          <rect width="260" height="180" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="15" y="15" width="230" height="34" rx="8" fill="#1e293b" />
          <text x="130" y="37" textAnchor="middle" fill="#38bdf8" fontWeight="800" fontSize="13" fontFamily="sans-serif">
            IPO Subscription AI System
          </text>
          
          <text x="130" y="75" textAnchor="middle" fill="#f8fafc" fontWeight="600" fontSize="10.5" fontFamily="sans-serif">
            Centralized Machine Learning Platform
          </text>
          <text x="130" y="94" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
            • 45-Feature Preprocessing Pipeline
          </text>
          <text x="130" y="110" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
            • 4 Frozen ML Model Candidates
          </text>
          <text x="130" y="126" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
            • TreeSHAP Attribution &amp; Risk Engine
          </text>
          <text x="130" y="142" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
            • 09:59:59 IST Ex-Ante Cutoff Firewall
          </text>
          <text x="130" y="158" textAnchor="middle" fill="#10b981" fontWeight="700" fontSize="9" fontFamily="sans-serif">
            FastAPI Backend + React Frontend
          </text>
        </g>

        {/* TOP ROW: External Market & Exchange Data */}
        {/* NSE */}
        <g transform="translate(60, 30)">
          <rect width="180" height="70" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <text x="90" y="24" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="11" fontFamily="sans-serif">National Stock Exchange</text>
          <text x="90" y="42" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="sans-serif">NSE Official IPO Public Feed</text>
          <text x="90" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Hourly Schedules &amp; Live Bids</text>
        </g>
        <line x1="180" y1="100" x2="350" y2="180" stroke="#059669" strokeWidth="1.8" markerEnd="url(#ctx-arr-green)" />
        <text x="230" y="140" fill="#059669" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">IPO data, Bidding tallies</text>

        {/* SEBI & Prospectus */}
        <g transform="translate(370, 20)">
          <rect width="180" height="70" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
          <text x="90" y="24" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="11" fontFamily="sans-serif">SEBI / RHP Filings</text>
          <text x="90" y="42" textAnchor="middle" fill="#2563eb" fontSize="9" fontFamily="sans-serif">Statutory Disclosures</text>
          <text x="90" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Price Band, Balance Sheets</text>
        </g>
        <line x1="460" y1="90" x2="460" y2="180" stroke="#0284c7" strokeWidth="1.8" markerEnd="url(#ctx-arr)" />
        <text x="465" y="135" fill="#0284c7" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Statutory Financial Terms</text>

        {/* Grey Market / Chittorgarh */}
        <g transform="translate(680, 30)">
          <rect width="180" height="70" rx="8" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
          <text x="90" y="24" textAnchor="middle" fill="#92400e" fontWeight="700" fontSize="11" fontFamily="sans-serif">IPOWatch / Chittorgarh</text>
          <text x="90" y="42" textAnchor="middle" fill="#d97706" fontSize="9" fontFamily="sans-serif">Indicative Grey Market Rates</text>
          <text x="90" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Pre-Open GMP % &amp; Dates</text>
        </g>
        <line x1="740" y1="100" x2="570" y2="180" stroke="#d97706" strokeWidth="1.8" markerEnd="url(#ctx-arr)" />
        <text x="625" y="140" fill="#d97706" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Pre-Market GMP</text>

        {/* LEFT COLUMN: News & Indices */}
        {/* Market Data */}
        <g transform="translate(30, 220)">
          <rect width="180" height="70" rx="8" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.5" />
          <text x="90" y="24" textAnchor="middle" fill="#6b21a8" fontWeight="700" fontSize="11" fontFamily="sans-serif">Macro Index Providers</text>
          <text x="90" y="42" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="sans-serif">NSE Indices &amp; Volatility</text>
          <text x="90" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Nifty 50, Sensex, India VIX</text>
        </g>
        <line x1="210" y1="255" x2="330" y2="255" stroke="#7c3aed" strokeWidth="1.8" markerEnd="url(#ctx-arr)" />
        <text x="220" y="248" fill="#7c3aed" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Macro indicators</text>

        {/* Financial News */}
        <g transform="translate(30, 320)">
          <rect width="180" height="70" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="90" y="24" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="11" fontFamily="sans-serif">Financial Media / News</text>
          <text x="90" y="42" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="sans-serif">Articles &amp; Analyst Sentiment</text>
          <text x="90" y="58" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">FinBERT NLP Pipeline</text>
        </g>
        <line x1="210" y1="355" x2="330" y2="300" stroke="#475569" strokeWidth="1.8" markerEnd="url(#ctx-arr)" />
        <text x="215" y="340" fill="#475569" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">News sentiment scores</text>

        {/* RIGHT COLUMN: Stakeholders / Actors */}
        {/* Investors / Analysts */}
        <g transform="translate(710, 200)">
          <rect width="180" height="85" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="90" y="22" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="11" fontFamily="sans-serif">Investors &amp; Analysts</text>
          <text x="90" y="38" textAnchor="middle" fill="#2563eb" fontSize="8.5" fontFamily="sans-serif">Retail, HNIs, Equity Researchers</text>
          <text x="12" y="56" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">• Browse upcoming &amp; active IPOs</text>
          <text x="12" y="68" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">• Inspect ex-ante predictions &amp; SHAP</text>
          <text x="12" y="80" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">• Run scenario simulator</text>
        </g>
        <line x1="590" y1="242" x2="710" y2="242" stroke="#2563eb" strokeWidth="1.8" markerEnd="url(#ctx-arr)" />
        <text x="596" y="235" fill="#2563eb" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Ex-ante forecasts, SHAP</text>

        {/* System Administrators */}
        <g transform="translate(710, 310)">
          <rect width="180" height="85" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <text x="90" y="22" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="11" fontFamily="sans-serif">Administrators &amp; MLOps</text>
          <text x="90" y="38" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">Platform Engineers &amp; Auditors</text>
          <text x="12" y="56" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">• Verify SHA-256 model integrity</text>
          <text x="12" y="68" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">• Monitor prospective drift (PSI)</text>
          <text x="12" y="80" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">• Evaluate weekly candidate models</text>
        </g>
        <line x1="590" y1="330" x2="710" y2="340" stroke="#475569" strokeWidth="1.8" markerEnd="url(#ctx-arr)" />
        <text x="598" y="325" fill="#475569" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Drift metrics, health</text>

        {/* BOTTOM ROW: Registrars & Exchanges for Final Actual Outcomes */}
        <g transform="translate(320, 430)">
          <rect width="280" height="75" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
          <text x="140" y="22" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            Registrars &amp; Official Allotment (Post-Close)
          </text>
          <text x="140" y="38" textAnchor="middle" fill="#047857" fontSize="9" fontFamily="sans-serif">
            Link Intime, KFintech, NSE/BSE Allotment Basis
          </text>
          <text x="140" y="54" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">
            Used Exclusively for Retrospective Outcome Auditing
          </text>
          <text x="140" y="68" textAnchor="middle" fill="#b91c1c" fontWeight="700" fontSize="8" fontFamily="sans-serif">
            NEVER ACCESSIBLE TO EX-ANTE PREDICTIONS
          </text>
        </g>
        <line x1="460" y1="430" x2="460" y2="360" stroke="#059669" strokeWidth="1.8" markerEnd="url(#ctx-arr-green)" />
        <text x="468" y="400" fill="#059669" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Actual Final Multiples</text>
      </svg>
    </div>
  );
};
