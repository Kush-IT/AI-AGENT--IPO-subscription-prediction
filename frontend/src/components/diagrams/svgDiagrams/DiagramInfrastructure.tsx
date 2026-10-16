import React from 'react';

export const DiagramInfrastructure: React.FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  return (
    <svg
      viewBox="0 0 1100 700"
      className={`w-full h-auto font-sans select-none ${isModal ? 'max-h-[82vh]' : 'max-h-[500px]'}`}
      style={{ backgroundColor: '#090d16' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="infraArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="infraArrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
        </marker>
      </defs>

      {/* Grid Background */}
      <pattern id="infraGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeOpacity="0.4" />
      </pattern>
      <rect width="1100" height="700" fill="url(#infraGrid)" />

      {/* Header Banner */}
      <rect x="30" y="20" width="1040" height="50" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="50" y="52" fill="#f8fafc" fontSize="18" fontWeight="700" letterSpacing="0.5">
        Infrastructure &amp; Network Topology: VPC, Containers &amp; Edge Edge Routing
      </text>
      <text x="760" y="51" fill="#38bdf8" fontSize="12" fontWeight="600">
        Vercel CDN Edge • Docker Swarm • PostgreSQL Cluster
      </text>

      {/* Region 1: Edge & Public Internet */}
      <rect x="40" y="100" width="260" height="500" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="60" y="130" fill="#38bdf8" fontSize="13" fontWeight="700">PUBLIC INTERNET &amp; EDGE</text>
      <text x="60" y="148" fill="#64748b" fontSize="10">Global User Traffic &amp; Anycast DNS</text>

      {/* Client Devices */}
      <rect x="60" y="180" width="220" height="70" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="80" y="210" fill="#f8fafc" fontSize="12" fontWeight="700">Client Browsers</text>
      <text x="80" y="230" fill="#94a3b8" fontSize="10">HTTPS / TLS 1.3 &bull; Port 443</text>

      {/* Vercel Edge Network */}
      <rect x="60" y="280" width="220" height="120" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
      <text x="80" y="310" fill="#ffffff" fontSize="12" fontWeight="700">Vercel Global Edge CDN</text>
      <text x="80" y="330" fill="#bae6fd" fontSize="10">&bull; Static Asset Compression (Brotli)</text>
      <text x="80" y="350" fill="#bae6fd" fontSize="10">&bull; SPA Route Rewrites (/data-flow)</text>
      <text x="80" y="370" fill="#bae6fd" fontSize="10">&bull; DDoS &amp; Bot Protection</text>

      {/* External Scraping Target */}
      <rect x="60" y="440" width="220" height="130" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="80" y="470" fill="#f8fafc" fontSize="12" fontWeight="700">External Upstreams</text>
      <text x="80" y="490" fill="#94a3b8" fontSize="10">&bull; NSE India Market Portal</text>
      <text x="80" y="510" fill="#94a3b8" fontSize="10">&bull; BSE SME / Mainboard</text>
      <text x="80" y="530" fill="#94a3b8" fontSize="10">&bull; SEBI DRHP Public Filings</text>
      <text x="80" y="550" fill="#94a3b8" fontSize="10">&bull; Chittorgarh GMP Feeds</text>

      {/* Region 2: Secure Application VPC */}
      <rect x="340" y="100" width="420" height="500" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <text x="360" y="130" fill="#10b981" fontSize="13" fontWeight="700">APPLICATION VPC (ISOLATED NETWORK)</text>
      <text x="360" y="148" fill="#64748b" fontSize="10">Private Subnets &bull; Internal Security Groups</text>

      {/* Reverse Proxy / Nginx */}
      <rect x="360" y="180" width="380" height="70" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="380" y="210" fill="#f8fafc" fontSize="12" fontWeight="700">Nginx Ingress Reverse Proxy</text>
      <text x="380" y="230" fill="#94a3b8" fontSize="10">SSL Offloading &bull; Rate Limiting (60 req/min) &bull; Upstream Proxying</text>

      {/* Docker Application Container (FastAPI) */}
      <rect x="360" y="280" width="380" height="170" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
      <text x="380" y="310" fill="#10b981" fontSize="12" fontWeight="700">Docker Container: backend-api:latest</text>
      <text x="380" y="330" fill="#94a3b8" fontSize="10">&bull; Python 3.10-slim &bull; Uvicorn ASGI Multi-Worker</text>
      <text x="380" y="350" fill="#94a3b8" fontSize="10">&bull; Internal Port: 8000 &bull; Healthcheck: /api/v1/health</text>
      <text x="380" y="370" fill="#94a3b8" fontSize="10">&bull; Read-Only Volume: /app/models/final_candidates:ro</text>
      <text x="380" y="390" fill="#94a3b8" fontSize="10">&bull; LangGraph Execution Runtime &bull; Scikit-Learn / XGBoost</text>
      <text x="380" y="410" fill="#6ee7b7" fontSize="10">&bull; Background Scheduler: HourlyRefresh (APScheduler)</text>

      {/* Model Weights Volume Mount */}
      <rect x="360" y="480" width="380" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
      <text x="380" y="510" fill="#f59e0b" fontSize="12" fontWeight="700">Immutable Storage Volume (Read-Only Mount)</text>
      <text x="380" y="530" fill="#94a3b8" fontSize="10">Path: models/final_candidates/ &bull; Tamper-Proof Cryptographic Lock</text>
      <text x="380" y="550" fill="#94a3b8" fontSize="10">SHA-256 verification on cold start &bull; Host-level write protection</text>

      {/* Region 3: Data Tier */}
      <rect x="800" y="100" width="260" height="500" rx="10" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x="820" y="130" fill="#a78bfa" fontSize="13" fontWeight="700">DATA &amp; PERSISTENCE TIER</text>
      <text x="820" y="148" fill="#64748b" fontSize="10">Encrypted at Rest &bull; Private Subnet</text>

      {/* Database Node */}
      <rect x="820" y="180" width="220" height="150" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1" />
      <text x="840" y="210" fill="#c4b5fd" fontSize="12" fontWeight="700">PostgreSQL 15 RDS Cluster</text>
      <text x="840" y="230" fill="#94a3b8" fontSize="10">&bull; Port 5432 &bull; SSL Mode: Require</text>
      <text x="840" y="250" fill="#94a3b8" fontSize="10">&bull; Automated Daily Backups</text>
      <text x="840" y="270" fill="#94a3b8" fontSize="10">&bull; Tables: ipos, predictions,</text>
      <text x="840" y="290" fill="#94a3b8" fontSize="10">  actual_results, audits</text>
      <text x="840" y="310" fill="#94a3b8" fontSize="10">&bull; Connection Pooling (SQLAlchemy)</text>

      {/* Redis Cache */}
      <rect x="820" y="360" width="220" height="100" rx="8" fill="#1e293b" stroke="#ec4899" strokeWidth="1" />
      <text x="840" y="390" fill="#f472b6" fontSize="12" fontWeight="700">In-Memory Cache (Redis 7)</text>
      <text x="840" y="410" fill="#94a3b8" fontSize="10">&bull; Port 6379 &bull; Auth Enabled</text>
      <text x="840" y="430" fill="#94a3b8" fontSize="10">&bull; TTL: 3600s Live Ingestion Cache</text>
      <text x="840" y="450" fill="#94a3b8" fontSize="10">&bull; Prediction Response Cache</text>

      {/* Log Collector */}
      <rect x="820" y="490" width="220" height="80" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="840" y="520" fill="#f8fafc" fontSize="12" fontWeight="700">Audit &amp; Log Archival</text>
      <text x="840" y="540" fill="#94a3b8" fontSize="10">&bull; prediction_audit.jsonl</text>
      <text x="840" y="555" fill="#94a3b8" fontSize="10">&bull; prospective_validation.csv</text>

      {/* Connecting Flows */}
      <path d="M 280 340 L 360 215" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#infraArrow)" />
      <path d="M 550 250 L 550 280" stroke="#10b981" strokeWidth="2" markerEnd="url(#infraArrowGreen)" />
      <path d="M 740 340 L 820 250" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#infraArrow)" />
      <path d="M 740 380 L 820 400" stroke="#ec4899" strokeWidth="2" markerEnd="url(#infraArrow)" />
      <path d="M 550 450 L 550 480" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#infraArrow)" />

      {/* Legend */}
      <rect x="30" y="630" width="1040" height="50" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <rect x="50" y="647" width="16" height="16" rx="3" fill="#0369a1" />
      <text x="75" y="659" fill="#94a3b8" fontSize="10">Edge CDN / Proxy</text>
      <rect x="220" y="647" width="16" height="16" rx="3" fill="#10b981" />
      <text x="245" y="659" fill="#94a3b8" fontSize="10">Docker ASGI Container</text>
      <rect x="420" y="647" width="16" height="16" rx="3" fill="#8b5cf6" />
      <text x="445" y="659" fill="#94a3b8" fontSize="10">Relational Database Subnet</text>
      <text x="680" y="659" fill="#38bdf8" fontSize="10" fontWeight="600">Zero-Trust Security: Internal services are unexposed to public WAN</text>
    </svg>
  );
};
