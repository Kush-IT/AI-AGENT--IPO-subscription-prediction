import React from 'react';

export const DiagramActivityFlow: React.FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  return (
    <svg
      viewBox="0 0 1100 700"
      className={`w-full h-auto font-sans select-none ${isModal ? 'max-h-[82vh]' : 'max-h-[500px]'}`}
      style={{ backgroundColor: '#090d16' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="actGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="actDecision" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="actProcess" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <marker id="actArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker id="actArrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
        </marker>
        <filter id="actGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Grid Pattern Background */}
      <pattern id="actGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeOpacity="0.4" />
      </pattern>
      <rect width="1100" height="700" fill="url(#actGrid)" />

      {/* Header Banner */}
      <rect x="30" y="20" width="1040" height="50" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="50" y="52" fill="#f8fafc" fontSize="18" fontWeight="700" letterSpacing="0.5">
        UML Activity Diagram: End-to-End IPO Inference &amp; Validation Workflow
      </text>
      <text x="750" y="51" fill="#38bdf8" fontSize="12" fontWeight="600">
        Formal Workflow • Concurrency Forks • Exception Joins
      </text>

      {/* Initial Node (Start) */}
      <circle cx="90" cy="150" r="16" fill="#10b981" stroke="#059669" strokeWidth="3" filter="url(#actGlow)" />
      <text x="90" y="190" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="600">Start Request</text>

      <path d="M 106 150 L 170 150" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Activity 1: Input Validation */}
      <rect x="170" y="120" width="150" height="60" rx="10" fill="url(#actProcess)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="245" y="145" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">1. Validate Input</text>
      <text x="245" y="165" fill="#bae6fd" fontSize="10" textAnchor="middle">Schema &amp; Ticker Check</text>

      <path d="M 320 150 L 375 150" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Decision 1: Temporal Cutoff */}
      <polygon points="420,115 465,150 420,185 375,150" fill="url(#actDecision)" stroke="#f59e0b" strokeWidth="2" />
      <text x="420" y="146" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">Timestamp</text>
      <text x="420" y="159" fill="#fde68a" fontSize="9" textAnchor="middle">&le; 09:59:59 IST?</text>

      {/* Decision 1: False -> Exception */}
      <path d="M 420 185 L 420 260" stroke="#ef4444" strokeWidth="2" markerEnd="url(#actArrowRed)" />
      <text x="430" y="225" fill="#f87171" fontSize="10" fontWeight="600">[No: Leakage Violation]</text>
      <rect x="360" y="260" width="120" height="45" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
      <text x="420" y="280" fill="#fca5a5" fontSize="10" fontWeight="700" textAnchor="middle">Raise Leakage Error</text>
      <text x="420" y="295" fill="#f87171" fontSize="9" textAnchor="middle">Reject Prediction</text>

      {/* Decision 1: True -> Activity 2 */}
      <path d="M 465 150 L 520 150" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />
      <text x="488" y="142" fill="#6ee7b7" fontSize="10" fontWeight="600">[Yes]</text>

      {/* Activity 2: Feature Preparation & Imputation */}
      <rect x="520" y="120" width="160" height="60" rx="10" fill="url(#actProcess)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="600" y="145" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">2. Impute Features</text>
      <text x="600" y="165" fill="#bae6fd" fontSize="10" textAnchor="middle">NaN &rarr; Training Medians</text>

      <path d="M 680 150 L 730 150" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Activity 3: Transform 45 Vector */}
      <rect x="730" y="120" width="150" height="60" rx="10" fill="url(#actProcess)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="805" y="145" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">3. Transform Vector</text>
      <text x="805" y="165" fill="#bae6fd" fontSize="10" textAnchor="middle">dev_preprocessor (1, 45)</text>

      <path d="M 880 150 L 940 150" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Fork Node (Concurrency) */}
      <rect x="940" y="100" width="10" height="100" rx="2" fill="#38bdf8" />
      <text x="945" y="90" fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">Fork Bar</text>

      {/* Concurrent Paths to 4 Models */}
      {/* Thread 1: Total XGBoost */}
      <path d="M 950 115 L 980 115 L 980 340 L 890 340" stroke="#38bdf8" strokeWidth="1.8" markerEnd="url(#actArrow)" />
      {/* Thread 2: QIB RF */}
      <path d="M 950 135 L 970 135 L 970 410 L 890 410" stroke="#38bdf8" strokeWidth="1.8" markerEnd="url(#actArrow)" />
      {/* Thread 3: NII LGBM */}
      <path d="M 950 165 L 970 165 L 970 480 L 890 480" stroke="#38bdf8" strokeWidth="1.8" markerEnd="url(#actArrow)" />
      {/* Thread 4: Retail XGB */}
      <path d="M 950 185 L 980 185 L 980 550 L 890 550" stroke="#38bdf8" strokeWidth="1.8" markerEnd="url(#actArrow)" />

      {/* Parallel Activities */}
      <rect x="730" y="320" width="160" height="45" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
      <text x="810" y="340" fill="#93c5fd" fontSize="11" fontWeight="700" textAnchor="middle">Total: XGBoost (log1p)</text>
      <text x="810" y="355" fill="#64748b" fontSize="9" textAnchor="middle">Invert via expm1(y)</text>

      <rect x="730" y="390" width="160" height="45" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
      <text x="810" y="410" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">QIB: Random Forest</text>
      <text x="810" y="425" fill="#64748b" fontSize="9" textAnchor="middle">Direct Raw Multiplier</text>

      <rect x="730" y="460" width="160" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
      <text x="810" y="480" fill="#fcd34d" fontSize="11" fontWeight="700" textAnchor="middle">NII: LightGBM (log1p)</text>
      <text x="810" y="495" fill="#64748b" fontSize="9" textAnchor="middle">Invert via expm1(y)</text>

      <rect x="730" y="530" width="160" height="45" rx="6" fill="#1e293b" stroke="#ec4899" strokeWidth="1" />
      <text x="810" y="550" fill="#f472b6" fontSize="11" fontWeight="700" textAnchor="middle">Retail: XGBoost (Raw)</text>
      <text x="810" y="565" fill="#64748b" fontSize="9" textAnchor="middle">Direct Raw Multiplier</text>

      {/* Join Node (Synchronization Bar) */}
      <path d="M 730 340 L 680 340 L 680 435" stroke="#38bdf8" strokeWidth="1.8" />
      <path d="M 730 410 L 680 410 L 680 435" stroke="#38bdf8" strokeWidth="1.8" />
      <path d="M 730 480 L 680 480 L 680 445" stroke="#38bdf8" strokeWidth="1.8" />
      <path d="M 730 550 L 680 550 L 680 445" stroke="#38bdf8" strokeWidth="1.8" />

      <rect x="675" y="400" width="10" height="80" rx="2" fill="#38bdf8" />
      <text x="680" y="390" fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle">Join Bar</text>

      <path d="M 675 440 L 610 440" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Activity 4: TreeSHAP Attribution */}
      <rect x="460" y="410" width="150" height="60" rx="10" fill="url(#actProcess)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="535" y="435" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">4. TreeSHAP Attribution</text>
      <text x="535" y="455" fill="#bae6fd" fontSize="10" textAnchor="middle">Feature Contribution Values</text>

      <path d="M 460 440 L 390 440" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Activity 5: Risk & Category Analysis */}
      <rect x="230" y="410" width="160" height="60" rx="10" fill="url(#actProcess)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="310" y="435" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">5. Risk Assessment</text>
      <text x="310" y="455" fill="#bae6fd" fontSize="10" textAnchor="middle">Category Edge &amp; Shortfall Risk</text>

      <path d="M 230 440 L 160 440" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Activity 6: Audit Log & Response Delivery */}
      <rect x="20" y="410" width="140" height="60" rx="10" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
      <text x="90" y="435" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">6. Audit &amp; Response</text>
      <text x="90" y="455" fill="#a7f3d0" fontSize="10" textAnchor="middle">Append prediction_audit</text>

      <path d="M 90 470 L 90 530" stroke="#10b981" strokeWidth="2" markerEnd="url(#actArrow)" />

      {/* Final State (Bullseye) */}
      <circle cx="90" cy="550" r="16" fill="#090d16" stroke="#10b981" strokeWidth="2" />
      <circle cx="90" cy="550" r="10" fill="#10b981" />
      <text x="90" y="590" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontWeight="700">Workflow Complete</text>

      {/* Legend Box */}
      <rect x="30" y="630" width="1040" height="50" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <circle cx="50" cy="655" r="7" fill="#10b981" />
      <text x="65" y="659" fill="#94a3b8" fontSize="10">Initial / Final Node</text>
      <rect x="175" y="647" width="16" height="16" rx="4" fill="#0369a1" />
      <text x="198" y="659" fill="#94a3b8" fontSize="10">Activity Execution Node</text>
      <polygon points="340,647 348,655 340,663 332,655" fill="#b45309" />
      <text x="355" y="659" fill="#94a3b8" fontSize="10">Decision Node</text>
      <rect x="440" y="647" width="5" height="16" fill="#38bdf8" />
      <text x="453" y="659" fill="#94a3b8" fontSize="10">Fork / Join Concurrency Bar</text>
      <text x="680" y="659" fill="#38bdf8" fontSize="10" fontWeight="600">Strict Rule: Exception branch aborts if clock &gt; 09:59:59 IST</text>
    </svg>
  );
};
