import React from 'react';

export const Diagram5Sequence: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '580px' : '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 960 580"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '760px' : '380px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="seq-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="seq-arr-ret" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
          </marker>
          <marker id="seq-arr-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
          </marker>
        </defs>

        <rect width="960" height="580" rx="12" fill="#ffffff" />

        {/* Lifeline Headers */}
        {/* 1. User */}
        <g transform="translate(40, 20)">
          <rect width="70" height="30" rx="5" fill="#f1f5f9" stroke="#94a3b8" />
          <text x="35" y="19" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">User</text>
          <line x1="35" y1="30" x2="35" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 2. React UI */}
        <g transform="translate(130, 20)">
          <rect width="80" height="30" rx="5" fill="#eff6ff" stroke="#93c5fd" />
          <text x="40" y="19" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="10" fontFamily="sans-serif">React UI</text>
          <line x1="40" y1="30" x2="40" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 3. FastAPI */}
        <g transform="translate(230, 20)">
          <rect width="80" height="30" rx="5" fill="#eff6ff" stroke="#3b82f6" />
          <text x="40" y="19" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="10" fontFamily="sans-serif">FastAPI</text>
          <line x1="40" y1="30" x2="40" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 4. IPO Intel */}
        <g transform="translate(330, 20)">
          <rect width="90" height="30" rx="5" fill="#f0fdf4" stroke="#86efac" />
          <text x="45" y="19" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="10" fontFamily="sans-serif">IPO Intel Svc</text>
          <line x1="45" y1="30" x2="45" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 5. Temporal Guard */}
        <g transform="translate(440, 20)">
          <rect width="100" height="30" rx="5" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
          <text x="50" y="19" textAnchor="middle" fill="#991b1b" fontWeight="800" fontSize="9.5" fontFamily="sans-serif">Temporal Guard</text>
          <line x1="50" y1="30" x2="50" y2="530" stroke="#fca5a5" strokeDasharray="4 3" />
        </g>

        {/* 6. Feature Prep */}
        <g transform="translate(560, 20)">
          <rect width="90" height="30" rx="5" fill="#faf5ff" stroke="#d8b4fe" />
          <text x="45" y="19" textAnchor="middle" fill="#581c87" fontWeight="700" fontSize="10" fontFamily="sans-serif">45-Feat Prep</text>
          <line x1="45" y1="30" x2="45" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 7. ML Models */}
        <g transform="translate(670, 20)">
          <rect width="95" height="30" rx="5" fill="#faf5ff" stroke="#a855f7" strokeWidth="1.5" />
          <text x="47" y="19" textAnchor="middle" fill="#581c87" fontWeight="800" fontSize="10" fontFamily="sans-serif">ML Models (4)</text>
          <line x1="47" y1="30" x2="47" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 8. SHAP & Risk */}
        <g transform="translate(785, 20)">
          <rect width="85" height="30" rx="5" fill="#fffbeb" stroke="#fde68a" />
          <text x="42" y="19" textAnchor="middle" fill="#78350f" fontWeight="700" fontSize="10" fontFamily="sans-serif">SHAP &amp; Risk</text>
          <line x1="42" y1="30" x2="42" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* 9. Database */}
        <g transform="translate(885, 20)">
          <rect width="60" height="30" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="30" y="19" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Storage</text>
          <line x1="30" y1="30" x2="30" y2="530" stroke="#cbd5e1" strokeDasharray="4 3" />
        </g>

        {/* Sequence Steps */}
        {/* Step 1 */}
        <line x1="75" y1="75" x2="170" y2="75" stroke="#0284c7" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="122" y="68" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">1. Request Prediction(ipo_id)</text>

        {/* Step 2 */}
        <line x1="170" y1="100" x2="270" y2="100" stroke="#0284c7" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="220" y="93" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">2. GET /api/v1/ipo/active-open</text>

        {/* Step 3 */}
        <line x1="270" y1="125" x2="375" y2="125" stroke="#0284c7" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="322" y="118" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">3. Resolve IPO Forecast Card</text>

        {/* Step 4 */}
        <line x1="375" y1="150" x2="490" y2="150" stroke="#b91c1c" strokeWidth="1.8" markerEnd="url(#seq-arr-red)" />
        <text x="432" y="143" textAnchor="middle" fill="#b91c1c" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">4. Verify 09:59:59 IST Cutoff</text>

        {/* FORBIDDEN DATA BLOCKING BOX */}
        <g transform="translate(375, 168)">
          <rect width="230" height="52" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="115" y="16" textAnchor="middle" fill="#991b1b" fontWeight="800" fontSize="9" fontFamily="sans-serif">
            BLOCKED FROM EX-ANTE PIPELINE
          </text>
          <text x="115" y="30" textAnchor="middle" fill="#b91c1c" fontSize="8" fontFamily="sans-serif">
            • Live NSE bidding order tallies
          </text>
          <text x="115" y="44" textAnchor="middle" fill="#b91c1c" fontSize="8" fontFamily="sans-serif">
            • Day 1/2/3 interim multiples &amp; final outcomes
          </text>
        </g>

        {/* Step 5 */}
        <line x1="490" y1="240" x2="605" y2="240" stroke="#059669" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="548" y="233" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">5. Extract 45 Canonical Features</text>

        {/* Step 6 */}
        <line x1="605" y1="270" x2="605" y2="295" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="605" y1="295" x2="635" y2="295" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="635" y1="295" x2="635" y2="280" stroke="#7c3aed" strokeWidth="1.5" />
        <text x="660" y="290" fill="#6b21a8" fontSize="8" fontFamily="sans-serif">6. dev_preprocessor.transform()</text>

        {/* Step 7 */}
        <line x1="605" y1="320" x2="717" y2="320" stroke="#0284c7" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="660" y="313" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">7. SHA-256 Check &amp; Model Load</text>

        {/* Step 8 */}
        <line x1="717" y1="350" x2="717" y2="375" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="717" y1="375" x2="747" y2="375" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="747" y1="375" x2="747" y2="360" stroke="#7c3aed" strokeWidth="1.5" />
        <text x="765" y="370" fill="#7c3aed" fontSize="8" fontFamily="sans-serif">8. Predict Total, QIB, NII, Retail</text>

        {/* Step 9 */}
        <line x1="717" y1="395" x2="827" y2="395" stroke="#0284c7" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="772" y="388" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">9. Calculate TreeSHAP &amp; Risk</text>

        {/* Step 10 */}
        <line x1="827" y1="425" x2="915" y2="425" stroke="#059669" strokeWidth="1.8" markerEnd="url(#seq-arr)" />
        <text x="871" y="418" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">10. Persist Snapshot</text>

        {/* Step 11 Return */}
        <line x1="915" y1="455" x2="375" y2="455" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#seq-arr-ret)" />
        <text x="645" y="448" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">11. Snapshot JSON saved</text>

        {/* Step 12 Return */}
        <line x1="375" y1="480" x2="270" y2="480" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#seq-arr-ret)" />
        <text x="322" y="473" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">12. UpcomingIPOForecast</text>

        {/* Step 13 Return */}
        <line x1="270" y1="505" x2="170" y2="505" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#seq-arr-ret)" />
        <text x="220" y="498" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">13. HTTP 200 JSON</text>

        {/* Step 14 Display */}
        <line x1="170" y1="525" x2="75" y2="525" stroke="#059669" strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#seq-arr-ret)" />
        <text x="122" y="518" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">14. Render Card</text>
      </svg>
    </div>
  );
};
