import React from 'react';

export const Diagram10Deployment: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d10-fe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="d10-be" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          <linearGradient id="d10-db" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#f3e8ff" />
          </linearGradient>
          <marker id="d10-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Header */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="#0f172a" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          DEPLOYMENT, NETWORK TOPOLOGY &amp; CONTAINER ARCHITECTURE
        </text>

        {/* Tier 1: Client / Edge CDN */}
        <g transform="translate(30, 70)">
          <rect width="180" height="390" rx="8" fill="url(#d10-fe)" stroke="#3b82f6" strokeWidth="1.5" />
          <rect width="180" height="30" rx="8" fill="#2563eb" />
          <text x="90" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            Client Tier (Browser / Edge)
          </text>

          <g transform="translate(10, 42)">
            <rect width="160" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">React 18 + Vite SPA</text>
            <text x="80" y="34" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">TypeScript + Lucide Icons</text>
            <text x="80" y="48" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Tailwind &amp; Recharts UI</text>
            <rect x="8" y="56" width="144" height="20" rx="3" fill="#eff6ff" />
            <text x="80" y="70" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="600" fontFamily="sans-serif">Static Edge Cache (Vercel/CDN)</text>
          </g>

          <g transform="translate(10, 140)">
            <rect width="160" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Client Features</text>
            <line x1="10" y1="24" x2="150" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• Responsive &amp; Mobile Ready</text>
            <text x="14" y="56" fill="#334155" fontSize="8" fontFamily="sans-serif">• Real-Time Health Indicator</text>
            <text x="14" y="72" fill="#334155" fontSize="8" fontFamily="sans-serif">• Vector SVG System Modal</text>
            <text x="14" y="88" fill="#334155" fontSize="8" fontFamily="sans-serif">• Observation vs AI Guard</text>
            <text x="14" y="102" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Zero Hydration Latency</text>
          </g>

          <g transform="translate(10, 265)">
            <rect width="160" height="100" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Client Security</text>
            <line x1="10" y1="24" x2="150" y2="24" stroke="#e2e8f0" />
            <text x="14" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• HTTPS / TLS 1.3 enforced</text>
            <text x="14" y="56" fill="#334155" fontSize="8" fontFamily="sans-serif">• XSS &amp; CSP protection</text>
            <text x="14" y="72" fill="#334155" fontSize="8" fontFamily="sans-serif">• Origin: localhost / domain</text>
            <text x="14" y="88" fill="#334155" fontSize="8" fontFamily="sans-serif">• Client session management</text>
          </g>
        </g>

        {/* Tier 2: Backend API & AI Engine */}
        <g transform="translate(240, 70)">
          <rect width="250" height="390" rx="8" fill="url(#d10-be)" stroke="#10b981" strokeWidth="1.5" />
          <rect width="250" height="30" rx="8" fill="#059669" />
          <text x="125" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            Application Tier (FastAPI Server)
          </text>

          <g transform="translate(10, 42)">
            <rect width="230" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="115" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">FastAPI + Uvicorn ASGI</text>
            <text x="115" y="32" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Python 3.11/3.12 Runtime</text>
            <text x="115" y="46" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="600" fontFamily="sans-serif">Endpoints: /api/predict, /api/health</text>
            <text x="115" y="60" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">/api/monitoring/drift, /api/intelligence</text>
            <rect x="8" y="66" width="214" height="14" rx="2" fill="#ecfdf5" />
            <text x="115" y="77" textAnchor="middle" fill="#065f46" fontSize="7" fontWeight="600" fontFamily="sans-serif">Async non-blocking event loop</text>
          </g>

          <g transform="translate(10, 137)">
            <rect width="230" height="115" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="115" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">In-Memory Model Singleton</text>
            <text x="115" y="30" textAnchor="middle" fill="#059669" fontSize="7.5" fontFamily="sans-serif">models/final_candidates/ (Pre-loaded)</text>
            <line x1="8" y1="34" x2="222" y2="34" stroke="#e2e8f0" />
            <text x="12" y="48" fill="#334155" fontSize="8" fontFamily="sans-serif">• total_xgboost_log1p.joblib (150 trees)</text>
            <text x="12" y="62" fill="#334155" fontSize="8" fontFamily="sans-serif">• qib_random_forest_raw.joblib (200 trees)</text>
            <text x="12" y="76" fill="#334155" fontSize="8" fontFamily="sans-serif">• nii_lightgbm_log1p.joblib (LGBM Reg)</text>
            <text x="12" y="90" fill="#334155" fontSize="8" fontFamily="sans-serif">• retail_xgboost_raw.joblib (100 trees)</text>
            <text x="12" y="104" fill="#0284c7" fontSize="8" fontWeight="600" fontFamily="sans-serif">• dev_preprocessor.joblib (Impute + Scale)</text>
          </g>

          <g transform="translate(10, 262)">
            <rect width="230" height="105" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="115" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Background Scheduler &amp; Tasks</text>
            <line x1="8" y1="24" x2="222" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="8" fontFamily="sans-serif">• Hourly NSE Live Tally Scraper</text>
            <text x="12" y="54" fill="#334155" fontSize="8" fontFamily="sans-serif">• Prospectus metadata discovery</text>
            <text x="12" y="68" fill="#334155" fontSize="8" fontFamily="sans-serif">• PSI Data Drift engine</text>
            <text x="12" y="82" fill="#334155" fontSize="8" fontFamily="sans-serif">• Health heartbeat logger</text>
            <text x="12" y="96" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">• Model Retraining: AUTO-DISABLED</text>
          </g>
        </g>

        {/* Tier 3: Persistence & Caching */}
        <g transform="translate(520, 70)">
          <rect width="180" height="390" rx="8" fill="url(#d10-db)" stroke="#9333ea" strokeWidth="1.5" />
          <rect width="180" height="30" rx="8" fill="#7e22ce" />
          <text x="90" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            Persistence &amp; Storage
          </text>

          <g transform="translate(10, 42)">
            <rect width="160" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">PostgreSQL 15 Database</text>
            <text x="80" y="32" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">ACID Transacted Store</text>
            <text x="80" y="46" textAnchor="middle" fill="#7e22ce" fontSize="8" fontWeight="600" fontFamily="sans-serif">Tables: ipos, predictions,</text>
            <text x="80" y="58" textAnchor="middle" fill="#7e22ce" fontSize="8" fontWeight="600" fontFamily="sans-serif">actual_results, audit</text>
            <text x="80" y="74" textAnchor="middle" fill="#059669" fontSize="7.5" fontFamily="sans-serif">SSL Connection / Pooled</text>
          </g>

          <g transform="translate(10, 140)">
            <rect width="160" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">File &amp; Snapshot Fallback</text>
            <line x1="8" y1="24" x2="152" y2="24" stroke="#e2e8f0" />
            <text x="12" y="40" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• data/processed/ (106 IPOs)</text>
            <text x="12" y="54" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• prospective_validation.csv</text>
            <text x="12" y="68" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• prediction_audit.jsonl</text>
            <text x="12" y="82" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• live_ipo_cache.json (TTL)</text>
          </g>

          <g transform="translate(10, 248)">
            <rect width="160" height="117" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Model Storage Gate</text>
            <rect x="8" y="26" width="144" height="24" rx="3" fill="#fef2f2" />
            <text x="80" y="41" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">RO / Read-Only Mount</text>
            <text x="80" y="64" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">models/final_candidates/</text>
            <text x="80" y="78" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Checksum Verified on Boot</text>
            <text x="80" y="92" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Quarantine Directory:</text>
            <text x="80" y="104" textAnchor="middle" fill="#b45309" fontSize="7" fontFamily="sans-serif">models/retrained/ (isolated)</text>
          </g>
        </g>

        {/* Tier 4: External World / Ingress */}
        <g transform="translate(730, 70)">
          <rect width="160" height="390" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="160" height="30" rx="8" fill="#334155" />
          <text x="80" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            External Networks
          </text>

          <g transform="translate(10, 42)">
            <rect width="140" height="65" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">NSE Live Server</text>
            <text x="70" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">HTTPS JSON API</text>
            <text x="70" y="48" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Live Subscription Feeds</text>
          </g>

          <g transform="translate(10, 120)">
            <rect width="140" height="65" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">SEBI / DRHP</text>
            <text x="70" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Public Filings Portal</text>
            <text x="70" y="48" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">RHP Financial Filings</text>
          </g>

          <g transform="translate(10, 198)">
            <rect width="140" height="65" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Financial News</text>
            <text x="70" y="34" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">RSS &amp; Headlines</text>
            <text x="70" y="48" textAnchor="middle" fill="#d97706" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">FinBERT Sentiment Stream</text>
          </g>

          <g transform="translate(10, 276)">
            <rect width="140" height="89" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            <text x="70" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Outbound Egress Guard</text>
            <text x="70" y="36" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Retries: 3 with backoff</text>
            <text x="70" y="50" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Circuit breaker: 5 min</text>
            <text x="70" y="64" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Strict Ex-Ante Cutoff</text>
            <text x="70" y="78" textAnchor="middle" fill="#dc2626" fontSize="7" fontFamily="sans-serif">on all fetched feeds</text>
          </g>
        </g>

        {/* Network connections */}
        <path d="M 210 240 L 240 240" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d10-arr)" />
        <path d="M 490 240 L 520 240" stroke="#059669" strokeWidth="2" markerEnd="url(#d10-arr)" />
        <path d="M 730 240 L 490 240" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>
    </div>
  );
};
