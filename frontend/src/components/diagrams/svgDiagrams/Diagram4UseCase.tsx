import React from 'react';

export const Diagram4UseCase: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 940 560"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '720px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="940" height="560" rx="12" fill="#ffffff" />

        {/* System Boundary Box */}
        <rect x="220" y="25" width="500" height="510" rx="14" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
        <rect x="220" y="25" width="500" height="34" rx="14" fill="#0284c7" />
        <text x="470" y="47" textAnchor="middle" fill="#ffffff" fontWeight="800" fontSize="13" fontFamily="sans-serif">
          System Boundary: IPO Subscription AI Platform
        </text>

        {/* ACTOR 1: Investor / Analyst (Left) */}
        <g transform="translate(60, 100)">
          {/* Stick Figure Head */}
          <circle cx="45" cy="20" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          {/* Body */}
          <line x1="45" y1="34" x2="45" y2="75" stroke="#0f172a" strokeWidth="2.5" />
          {/* Arms */}
          <line x1="15" y1="48" x2="75" y2="48" stroke="#0f172a" strokeWidth="2.5" />
          {/* Legs */}
          <line x1="45" y1="75" x2="25" y2="115" stroke="#0f172a" strokeWidth="2.5" />
          <line x1="45" y1="75" x2="65" y2="115" stroke="#0f172a" strokeWidth="2.5" />
          <text x="45" y="138" textAnchor="middle" fill="#0f172a" fontWeight="800" fontSize="11" fontFamily="sans-serif">Investor / Analyst</text>
          <text x="45" y="152" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">(Primary Consumer)</text>
        </g>

        {/* ACTOR 2: Researcher (Left Bottom) */}
        <g transform="translate(60, 320)">
          <circle cx="45" cy="20" r="14" fill="#ffffff" stroke="#7c3aed" strokeWidth="2.5" />
          <line x1="45" y1="34" x2="45" y2="75" stroke="#7c3aed" strokeWidth="2.5" />
          <line x1="15" y1="48" x2="75" y2="48" stroke="#7c3aed" strokeWidth="2.5" />
          <line x1="45" y1="75" x2="25" y2="115" stroke="#7c3aed" strokeWidth="2.5" />
          <line x1="45" y1="75" x2="65" y2="115" stroke="#7c3aed" strokeWidth="2.5" />
          <text x="45" y="138" textAnchor="middle" fill="#581c87" fontWeight="800" fontSize="11" fontFamily="sans-serif">ML Researcher</text>
          <text x="45" y="152" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">(Model Auditor)</text>
        </g>

        {/* ACTOR 3: Administrator / MLOps (Right) */}
        <g transform="translate(790, 200)">
          <circle cx="45" cy="20" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
          <line x1="45" y1="34" x2="45" y2="75" stroke="#059669" strokeWidth="2.5" />
          <line x1="15" y1="48" x2="75" y2="48" stroke="#059669" strokeWidth="2.5" />
          <line x1="45" y1="75" x2="25" y2="115" stroke="#059669" strokeWidth="2.5" />
          <line x1="45" y1="75" x2="65" y2="115" stroke="#059669" strokeWidth="2.5" />
          <text x="45" y="138" textAnchor="middle" fill="#065f46" fontWeight="800" fontSize="11" fontFamily="sans-serif">System Admin</text>
          <text x="45" y="152" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">(Governance &amp; Ops)</text>
        </g>

        {/* USE CASES INSIDE BOUNDARY */}
        {/* UC 1: View Active & Upcoming IPO List */}
        <g transform="translate(250, 75)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#1e3a8a" fontWeight="600" fontSize="9.5" fontFamily="sans-serif">View IPO Intelligence List</text>
        </g>
        <line x1="130" y1="140" x2="250" y2="97" stroke="#94a3b8" strokeWidth="1.2" />

        {/* UC 2: Get AI Ex-Ante Prediction */}
        <g transform="translate(250, 125)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="100" y="26" textAnchor="middle" fill="#4c1d95" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Get Ex-Ante AI Prediction</text>
        </g>
        <line x1="130" y1="145" x2="250" y2="147" stroke="#94a3b8" strokeWidth="1.2" />

        {/* UC 3: View Category Predictions (QIB, NII, Retail) */}
        <g transform="translate(500, 95)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#faf5ff" stroke="#c084fc" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#581c87" fontWeight="600" fontSize="9" fontFamily="sans-serif">Inspect Category Predictions</text>
        </g>
        <line x1="435" y1="140" x2="505" y2="120" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 3" />
        <text x="465" y="125" fill="#7c3aed" fontSize="7" fontFamily="sans-serif">&lt;&lt;extend&gt;&gt;</text>

        {/* UC 4: View SHAP Explanation */}
        <g transform="translate(500, 145)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#faf5ff" stroke="#c084fc" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#581c87" fontWeight="600" fontSize="9" fontFamily="sans-serif">View TreeSHAP Drivers</text>
        </g>
        <line x1="435" y1="147" x2="505" y2="160" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 3" />
        <text x="465" y="160" fill="#7c3aed" fontSize="7" fontFamily="sans-serif">&lt;&lt;extend&gt;&gt;</text>

        {/* UC 5: View Risk Analysis & Score */}
        <g transform="translate(500, 195)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#78350f" fontWeight="600" fontSize="9" fontFamily="sans-serif">View Risk Penalty Score</text>
        </g>
        <line x1="430" y1="155" x2="510" y2="205" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" />
        <text x="460" y="190" fill="#d97706" fontSize="7" fontFamily="sans-serif">&lt;&lt;extend&gt;&gt;</text>

        {/* UC 6: View Live Subscription (Observation) */}
        <g transform="translate(250, 175)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#065f46" fontWeight="600" fontSize="9" fontFamily="sans-serif">View Live NSE Observation</text>
        </g>
        <line x1="130" y1="150" x2="250" y2="195" stroke="#94a3b8" strokeWidth="1.2" />

        {/* UC 7: Compare Prediction vs Actual Outcome */}
        <g transform="translate(250, 225)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#1e3a8a" fontWeight="600" fontSize="9" fontFamily="sans-serif">Compare Ex-Ante vs Actual</text>
        </g>
        <line x1="130" y1="160" x2="250" y2="245" stroke="#94a3b8" strokeWidth="1.2" />

        {/* UC 8: Run Custom Scenario Simulator */}
        <g transform="translate(250, 275)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#1e3a8a" fontWeight="600" fontSize="9" fontFamily="sans-serif">Run Custom Scenario</text>
        </g>
        <line x1="130" y1="170" x2="250" y2="295" stroke="#94a3b8" strokeWidth="1.2" />
        <line x1="130" y1="360" x2="250" y2="297" stroke="#94a3b8" strokeWidth="1.2" />

        {/* UC 9: View System Architecture & Diagrams */}
        <g transform="translate(250, 325)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#0f172a" fontWeight="600" fontSize="9.5" fontFamily="sans-serif">View Diagrams &amp; Docs</text>
        </g>
        <line x1="130" y1="180" x2="250" y2="345" stroke="#94a3b8" strokeWidth="1.2" />
        <line x1="130" y1="370" x2="250" y2="347" stroke="#94a3b8" strokeWidth="1.2" />

        {/* UC 10: View Historical Data & Benchmark Metrics */}
        <g transform="translate(250, 375)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#faf5ff" stroke="#8b5cf6" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#4c1d95" fontWeight="600" fontSize="9" fontFamily="sans-serif">View 106-IPO Historical Data</text>
        </g>
        <line x1="130" y1="380" x2="250" y2="397" stroke="#7c3aed" strokeWidth="1.2" />

        {/* UC 11: View Prospective Model Drift */}
        <g transform="translate(250, 425)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#f0fdf4" stroke="#10b981" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#065f46" fontWeight="600" fontSize="9" fontFamily="sans-serif">Evaluate Feature &amp; Target Drift</text>
        </g>
        <line x1="130" y1="390" x2="250" y2="447" stroke="#7c3aed" strokeWidth="1.2" />
        <line x1="790" y1="280" x2="445" y2="445" stroke="#059669" strokeWidth="1.2" />

        {/* UC 12: Verify Cryptographic Model Hashes */}
        <g transform="translate(500, 275)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#f0fdf4" stroke="#059669" strokeWidth="1.5" />
          <text x="100" y="26" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="9" fontFamily="sans-serif">Verify SHA-256 Model Integrity</text>
        </g>
        <line x1="790" y1="250" x2="690" y2="295" stroke="#059669" strokeWidth="1.2" />

        {/* UC 13: Trigger Weekly Retraining Evaluation */}
        <g transform="translate(500, 335)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="100" y="22" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">Trigger Retraining Evaluation</text>
          <text x="100" y="34" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontFamily="sans-serif">(Auto-Promotion Disabled)</text>
        </g>
        <line x1="790" y1="260" x2="695" y2="355" stroke="#ef4444" strokeWidth="1.2" />

        {/* UC 14: Monitor System Health & Logs */}
        <g transform="translate(500, 395)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#f0fdf4" stroke="#059669" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#065f46" fontWeight="600" fontSize="9" fontFamily="sans-serif">Monitor Hourly Refresh &amp; Health</text>
        </g>
        <line x1="790" y1="270" x2="695" y2="415" stroke="#059669" strokeWidth="1.2" />

        {/* UC 15: Manage Quarantined Candidates */}
        <g transform="translate(500, 455)">
          <ellipse cx="100" cy="22" rx="90" ry="18" fill="#faf5ff" stroke="#8b5cf6" strokeWidth="1.3" />
          <text x="100" y="26" textAnchor="middle" fill="#4c1d95" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">Manage Quarantined Candidates</text>
        </g>
        <line x1="790" y1="290" x2="695" y2="475" stroke="#7c3aed" strokeWidth="1.2" />
      </svg>
    </div>
  );
};
