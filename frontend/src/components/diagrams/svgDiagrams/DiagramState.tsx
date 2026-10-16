import React from 'react';

export const DiagramState: React.FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  return (
    <svg
      viewBox="0 0 1100 700"
      className={`w-full h-auto font-sans select-none ${isModal ? 'max-h-[82vh]' : 'max-h-[500px]'}`}
      style={{ backgroundColor: '#090d16' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="stateArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="stateArrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
        </marker>
        <filter id="stateGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Grid Background */}
      <pattern id="stateGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeOpacity="0.4" />
      </pattern>
      <rect width="1100" height="700" fill="url(#stateGrid)" />

      {/* Header Banner */}
      <rect x="30" y="20" width="1040" height="50" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="50" y="52" fill="#f8fafc" fontSize="18" fontWeight="700" letterSpacing="0.5">
        UML State Machine Diagram: Offering Lifecycle &amp; Cutoff Transitions
      </text>
      <text x="750" y="51" fill="#38bdf8" fontSize="12" fontWeight="600">
        Deterministic States • Guard Conditions • Actions
      </text>

      {/* Initial State */}
      <circle cx="70" cy="200" r="16" fill="#10b981" stroke="#059669" strokeWidth="3" filter="url(#stateGlow)" />
      <text x="70" y="235" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="600">SEBI Filing</text>

      <path d="M 86 200 L 140 200" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#stateArrow)" />

      {/* State 1: UPCOMING (PRE_OPEN) */}
      <rect x="140" y="140" width="180" height="120" rx="14" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
      <rect x="140" y="140" width="180" height="34" rx="14" fill="#0369a1" />
      <text x="230" y="162" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">UPCOMING</text>
      <text x="155" y="195" fill="#94a3b8" fontSize="10">entry / Ingest DRHP &amp; GMP</text>
      <text x="155" y="215" fill="#94a3b8" fontSize="10">do / Compute ex-ante prediction</text>
      <text x="155" y="235" fill="#38bdf8" fontSize="10">exit / Lock features snapshot</text>

      {/* Transition: UPCOMING -> OPEN_FOR_BIDDING */}
      <path d="M 320 200 L 430 200" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#stateArrow)" />
      <text x="375" y="175" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">Day 1: 10:00:00 IST</text>
      <text x="375" y="190" fill="#fde68a" fontSize="9" textAnchor="middle">[clock &gt; 09:59:59 IST]</text>
      <text x="375" y="225" fill="#38bdf8" fontSize="9" textAnchor="middle">/ Freeze Model Inputs</text>

      {/* State 2: OPEN_FOR_BIDDING */}
      <rect x="430" y="140" width="200" height="130" rx="14" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
      <rect x="430" y="140" width="200" height="34" rx="14" fill="#047857" />
      <text x="530" y="162" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">OPEN_FOR_BIDDING</text>
      <text x="445" y="195" fill="#94a3b8" fontSize="10">entry / Start 60m NSE Poller</text>
      <text x="445" y="215" fill="#94a3b8" fontSize="10">do / Render Live NSE tallies</text>
      <text x="445" y="235" fill="#6ee7b7" fontSize="10">do / Display Ex-Ante baseline</text>
      <text x="445" y="255" fill="#ef4444" fontSize="9" fontWeight="600">guard / No live data into AI</text>

      {/* Self-transition on OPEN_FOR_BIDDING: Hourly Scraper */}
      <path d="M 500 270 C 500 320, 560 320, 560 270" fill="none" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#stateArrow)" />
      <text x="530" y="315" fill="#6ee7b7" fontSize="9" textAnchor="middle">HourlyRefresh [60m poll]</text>

      {/* Transition: OPEN_FOR_BIDDING -> CLOSED */}
      <path d="M 630 200 L 740 200" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#stateArrow)" />
      <text x="685" y="180" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">Day 3: 17:00:00 IST</text>
      <text x="685" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle">[Bidding Window Closes]</text>
      <text x="685" y="225" fill="#38bdf8" fontSize="9" textAnchor="middle">/ Fetch Final NSE Tally</text>

      {/* State 3: CLOSED (AWAITING_ALLOTMENT) */}
      <rect x="740" y="140" width="190" height="120" rx="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
      <rect x="740" y="140" width="190" height="34" rx="14" fill="#b45309" />
      <text x="835" y="162" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">CLOSED / EVALUATION</text>
      <text x="755" y="195" fill="#94a3b8" fontSize="10">entry / Ingest final outcome</text>
      <text x="755" y="215" fill="#94a3b8" fontSize="10">do / Compute Residual &amp; Bias</text>
      <text x="755" y="235" fill="#fde68a" fontSize="10">do / Calculate PSI drift score</text>

      {/* Transition: CLOSED -> ALLOTTED & LISTED */}
      <path d="M 835 260 L 835 380" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#stateArrow)" />
      <text x="845" y="320" fill="#94a3b8" fontSize="10">[Basis of Allotment Released]</text>

      {/* State 4: LISTED / ARCHIVED */}
      <rect x="740" y="380" width="190" height="110" rx="14" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
      <rect x="740" y="380" width="190" height="34" rx="14" fill="#6d28d9" />
      <text x="835" y="402" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">LISTED / HISTORICAL</text>
      <text x="755" y="435" fill="#94a3b8" fontSize="10">entry / Ingest Listing Day %</text>
      <text x="755" y="455" fill="#94a3b8" fontSize="10">do / Append to Retrain Pool</text>
      <text x="755" y="475" fill="#c4b5fd" fontSize="10">exit / Permanent Storage</text>

      {/* Decision: Drift Alert Trigger */}
      <path d="M 740 435 L 530 435" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#stateArrowAmber)" />
      <text x="635" y="425" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">[PSI &gt; 0.25 | Drift Threshold]</text>

      {/* State 5: RETRAINING_QUARANTINE */}
      <rect x="350" y="380" width="180" height="110" rx="14" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
      <rect x="350" y="380" width="180" height="34" rx="14" fill="#991b1b" />
      <text x="440" y="402" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">QUARANTINE CANDIDATE</text>
      <text x="365" y="435" fill="#94a3b8" fontSize="10">do / Train candidate models</text>
      <text x="365" y="455" fill="#94a3b8" fontSize="10">do / Walk-Forward test split</text>
      <text x="365" y="475" fill="#fca5a5" fontSize="10">guard / Requires human gate</text>

      {/* Terminal Node */}
      <path d="M 350 435 L 200 435" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#stateArrow)" />
      <text x="275" y="425" fill="#38bdf8" fontSize="9" textAnchor="middle">Governance Approval</text>

      <circle cx="170" cy="435" r="16" fill="#090d16" stroke="#10b981" strokeWidth="2" />
      <circle cx="170" cy="435" r="10" fill="#10b981" />
      <text x="170" y="475" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontWeight="700">Archived Audit</text>

      {/* Legend */}
      <rect x="30" y="630" width="1040" height="50" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <circle cx="50" cy="655" r="7" fill="#10b981" />
      <text x="65" y="659" fill="#94a3b8" fontSize="10">Initial / Terminal State</text>
      <rect x="220" y="647" width="16" height="16" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
      <text x="245" y="659" fill="#94a3b8" fontSize="10">State with Internal Activities</text>
      <line x1="430" y1="655" x2="480" y2="655" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#stateArrow)" />
      <text x="490" y="659" fill="#94a3b8" fontSize="10">Event [Guard] / Action Transition</text>
      <text x="730" y="659" fill="#f59e0b" fontSize="10" fontWeight="600">Strict Temporal Fence: 09:59:59 IST Day 1 locks state features</text>
    </svg>
  );
};
