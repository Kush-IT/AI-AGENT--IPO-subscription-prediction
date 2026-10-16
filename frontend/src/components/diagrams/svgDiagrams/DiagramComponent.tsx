import React from 'react';

export const DiagramComponent: React.FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  return (
    <svg
      viewBox="0 0 1100 700"
      className={`w-full h-auto font-sans select-none ${isModal ? 'max-h-[82vh]' : 'max-h-[500px]'}`}
      style={{ backgroundColor: '#090d16' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="compArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="compArrowDashed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* Grid Pattern Background */}
      <pattern id="compGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeOpacity="0.4" />
      </pattern>
      <rect width="1100" height="700" fill="url(#compGrid)" />

      {/* Header Banner */}
      <rect x="30" y="20" width="1040" height="50" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="50" y="52" fill="#f8fafc" fontSize="18" fontWeight="700" letterSpacing="0.5">
        UML Component Diagram: Subsystem Architecture &amp; Interfaces
      </text>
      <text x="760" y="51" fill="#38bdf8" fontSize="12" fontWeight="600">
        Provided &amp; Required Ports • Loose Coupling
      </text>

      {/* Component: Presentation Tier (React + Vite) */}
      <rect x="40" y="100" width="220" height="240" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      {/* UML Component tab icons */}
      <rect x="25" y="115" width="25" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
      <rect x="25" y="135" width="25" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
      <text x="70" y="130" fill="#38bdf8" fontSize="14" fontWeight="700">&laquo;component&raquo;</text>
      <text x="70" y="150" fill="#f8fafc" fontSize="13" fontWeight="700">Frontend SPA</text>
      <line x1="40" y1="165" x2="260" y2="165" stroke="#1e293b" strokeWidth="1" />
      <text x="55" y="190" fill="#94a3b8" fontSize="11">&bull; Dashboard UI</text>
      <text x="55" y="210" fill="#94a3b8" fontSize="11">&bull; ModelPrediction UI</text>
      <text x="55" y="230" fill="#94a3b8" fontSize="11">&bull; Diagrams Explorer</text>
      <text x="55" y="250" fill="#94a3b8" fontSize="11">&bull; DataFlow Flowchart</text>
      <text x="55" y="270" fill="#94a3b8" fontSize="11">&bull; Monitoring &amp; Drift UI</text>
      <text x="55" y="290" fill="#38bdf8" fontSize="11">&bull; React Query v5 / Axios</text>

      {/* Port from Frontend to API Gateway */}
      <path d="M 260 210 L 330 210" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#compArrow)" />
      <circle cx="330" cy="210" r="5" fill="#38bdf8" />
      <text x="270" y="200" fill="#94a3b8" fontSize="9">REST / JSON</text>

      {/* Component: API Gateway / FastAPI Core */}
      <rect x="340" y="100" width="240" height="240" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <rect x="325" y="115" width="25" height="12" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
      <rect x="325" y="135" width="25" height="12" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
      <text x="370" y="130" fill="#10b981" fontSize="14" fontWeight="700">&laquo;component&raquo;</text>
      <text x="370" y="150" fill="#f8fafc" fontSize="13" fontWeight="700">FastAPI Gateway</text>
      <line x1="340" y1="165" x2="580" y2="165" stroke="#1e293b" strokeWidth="1" />
      <text x="355" y="190" fill="#94a3b8" fontSize="11">&bull; /api/v1/predict</text>
      <text x="355" y="210" fill="#94a3b8" fontSize="11">&bull; /api/v1/ipo/active-open</text>
      <text x="355" y="230" fill="#94a3b8" fontSize="11">&bull; /api/v1/ipo/next-15-days</text>
      <text x="355" y="250" fill="#94a3b8" fontSize="11">&bull; /api/v1/monitoring</text>
      <text x="355" y="270" fill="#94a3b8" fontSize="11">&bull; CORS &amp; RateLimit Middleware</text>
      <text x="355" y="290" fill="#10b981" fontSize="11">&bull; Pydantic v2 Schema Validator</text>

      {/* Connection: Gateway to Agentic Engine */}
      <path d="M 580 180 L 650 180" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#compArrow)" />
      <text x="590" y="170" fill="#94a3b8" fontSize="9">State Invocation</text>

      {/* Component: Agentic AI Orchestrator (LangGraph) */}
      <rect x="660" y="100" width="240" height="240" rx="6" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
      <rect x="645" y="115" width="25" height="12" rx="2" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
      <rect x="645" y="135" width="25" height="12" rx="2" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
      <text x="690" y="130" fill="#c084fc" fontSize="14" fontWeight="700">&laquo;component&raquo;</text>
      <text x="690" y="150" fill="#f8fafc" fontSize="13" fontWeight="700">Agentic Orchestrator</text>
      <line x1="660" y1="165" x2="900" y2="165" stroke="#1e293b" strokeWidth="1" />
      <text x="675" y="190" fill="#94a3b8" fontSize="11">&bull; InputValidationAgent</text>
      <text x="675" y="210" fill="#94a3b8" fontSize="11">&bull; FeaturePrepAgent</text>
      <text x="675" y="230" fill="#94a3b8" fontSize="11">&bull; PredictionAgent</text>
      <text x="675" y="250" fill="#94a3b8" fontSize="11">&bull; SHAPExplanationAgent</text>
      <text x="675" y="270" fill="#94a3b8" fontSize="11">&bull; RiskAnalysisAgent</text>
      <text x="675" y="290" fill="#c084fc" fontSize="11">&bull; ReportSynthesisAgent</text>

      {/* Component: ML Inference Subsystem */}
      <rect x="660" y="380" width="240" height="220" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
      <rect x="645" y="395" width="25" height="12" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
      <rect x="645" y="415" width="25" height="12" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
      <text x="690" y="410" fill="#f59e0b" fontSize="14" fontWeight="700">&laquo;component&raquo;</text>
      <text x="690" y="430" fill="#f8fafc" fontSize="13" fontWeight="700">ML Inference Core</text>
      <line x1="660" y1="445" x2="900" y2="445" stroke="#1e293b" strokeWidth="1" />
      <text x="675" y="470" fill="#94a3b8" fontSize="11">&bull; dev_preprocessor.joblib</text>
      <text x="675" y="490" fill="#94a3b8" fontSize="11">&bull; total_xgboost_log1p.joblib</text>
      <text x="675" y="510" fill="#94a3b8" fontSize="11">&bull; qib_random_forest_raw.joblib</text>
      <text x="675" y="530" fill="#94a3b8" fontSize="11">&bull; nii_lightgbm_log1p.joblib</text>
      <text x="675" y="550" fill="#94a3b8" fontSize="11">&bull; retail_xgboost_raw.joblib</text>
      <text x="675" y="570" fill="#f59e0b" fontSize="11">&bull; SHA-256 Checksum Gate</text>

      <path d="M 780 340 L 780 380" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#compArrow)" />

      {/* Component: Data Discovery & Scrapers */}
      <rect x="40" y="380" width="220" height="220" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
      <rect x="25" y="395" width="25" height="12" rx="2" fill="#1e293b" stroke="#0284c7" strokeWidth="1" />
      <rect x="25" y="415" width="25" height="12" rx="2" fill="#1e293b" stroke="#0284c7" strokeWidth="1" />
      <text x="70" y="410" fill="#38bdf8" fontSize="14" fontWeight="700">&laquo;component&raquo;</text>
      <text x="70" y="430" fill="#f8fafc" fontSize="13" fontWeight="700">Ingestion Connectors</text>
      <line x1="40" y1="445" x2="260" y2="445" stroke="#1e293b" strokeWidth="1" />
      <text x="55" y="470" fill="#94a3b8" fontSize="11">&bull; LiveIPODiscoveryConnector</text>
      <text x="55" y="490" fill="#94a3b8" fontSize="11">&bull; HourlyRefreshService (60m)</text>
      <text x="55" y="510" fill="#94a3b8" fontSize="11">&bull; BSE / SEBI Filing Parsers</text>
      <text x="55" y="530" fill="#94a3b8" fontSize="11">&bull; FinBERT Sentiment Engine</text>
      <text x="55" y="550" fill="#5eead4" fontSize="11">&bull; 09:59:59 IST Cutoff Barrier</text>

      {/* Component: Data Persistence & Auditing */}
      <rect x="340" y="380" width="240" height="220" rx="6" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
      <rect x="325" y="395" width="25" height="12" rx="2" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
      <rect x="325" y="415" width="25" height="12" rx="2" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
      <text x="370" y="410" fill="#818cf8" fontSize="14" fontWeight="700">&laquo;component&raquo;</text>
      <text x="370" y="430" fill="#f8fafc" fontSize="13" fontWeight="700">Persistence Store</text>
      <line x1="340" y1="445" x2="580" y2="445" stroke="#1e293b" strokeWidth="1" />
      <text x="355" y="470" fill="#94a3b8" fontSize="11">&bull; PostgreSQL 15 / SQLite</text>
      <text x="355" y="490" fill="#94a3b8" fontSize="11">&bull; prediction_audit.jsonl</text>
      <text x="355" y="510" fill="#94a3b8" fontSize="11">&bull; prospective_validation.csv</text>
      <text x="355" y="530" fill="#94a3b8" fontSize="11">&bull; live_ipo_discovery_cache</text>
      <text x="355" y="550" fill="#818cf8" fontSize="11">&bull; SQLAlchemy Repositories</text>

      {/* Inter-component links */}
      <path d="M 260 490 L 340 490" stroke="#0284c7" strokeWidth="2" markerEnd="url(#compArrow)" />
      <text x="275" y="480" fill="#94a3b8" fontSize="9">Cache Write</text>

      <path d="M 460 340 L 460 380" stroke="#6366f1" strokeWidth="2" markerEnd="url(#compArrow)" />
      <text x="470" y="365" fill="#94a3b8" fontSize="9">SQLAlchemy</text>

      <path d="M 660 490 L 580 490" stroke="#6366f1" strokeWidth="2" markerEnd="url(#compArrow)" />
      <text x="595" y="480" fill="#94a3b8" fontSize="9">Audit Save</text>

      {/* Legend Box */}
      <rect x="30" y="630" width="1040" height="50" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <rect x="50" y="645" width="20" height="15" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="80" y="657" fill="#94a3b8" fontSize="10">UML Component with Ports</text>
      <line x1="260" y1="652" x2="310" y2="652" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#compArrow)" />
      <text x="320" y="657" fill="#94a3b8" fontSize="10">Direct Dependency Call</text>
      <text x="650" y="657" fill="#38bdf8" fontSize="10" fontWeight="600">Encapsulation: Models load read-only via isolated PredictionTool interface</text>
    </svg>
  );
};
