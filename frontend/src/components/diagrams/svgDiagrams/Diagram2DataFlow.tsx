import React from 'react';

export const Diagram2DataFlow: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 940 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="flow-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="flow-arr-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
          </marker>
          <marker id="flow-arr-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>

        <rect width="940" height="540" rx="12" fill="#ffffff" />

        {/* Top Header Banner */}
        <rect x="20" y="16" width="900" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="40" y="42" fill="#0f172a" fontWeight="800" fontSize="14" fontFamily="sans-serif">
          Detailed End-to-End Data Pipeline: Pre-Market Discovery to Explainable Inference
        </text>
        <rect x="730" y="24" width="170" height="26" rx="13" fill="#ecfdf5" stroke="#10b981" />
        <text x="815" y="41" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
          Zero Look-Ahead Wall
        </text>

        {/* STAGE 1: Data Collection */}
        <g transform="translate(20, 75)">
          <rect width="135" height="290" rx="8" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
          <rect width="135" height="30" rx="8" fill="#0284c7" />
          <text x="67" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">1. Data Ingestion</text>

          <g transform="translate(8, 42)">
            <rect width="119" height="42" rx="5" fill="#ffffff" stroke="#bae6fd" />
            <text x="59" y="18" textAnchor="middle" fill="#0369a1" fontWeight="700" fontSize="10" fontFamily="sans-serif">NSE Live Feed</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Hourly (EQ Series)</text>
          </g>
          <g transform="translate(8, 92)">
            <rect width="119" height="42" rx="5" fill="#ffffff" stroke="#bae6fd" />
            <text x="59" y="18" textAnchor="middle" fill="#0369a1" fontWeight="700" fontSize="10" fontFamily="sans-serif">IPOWatch / Chittor</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Indicative GMP</text>
          </g>
          <g transform="translate(8, 142)">
            <rect width="119" height="42" rx="5" fill="#ffffff" stroke="#bae6fd" />
            <text x="59" y="18" textAnchor="middle" fill="#0369a1" fontWeight="700" fontSize="10" fontFamily="sans-serif">SEBI / RHP Filing</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Financials &amp; Terms</text>
          </g>
          <g transform="translate(8, 192)">
            <rect width="119" height="42" rx="5" fill="#ffffff" stroke="#bae6fd" />
            <text x="59" y="18" textAnchor="middle" fill="#0369a1" fontWeight="700" fontSize="10" fontFamily="sans-serif">FinBERT News</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Sentiment Score</text>
          </g>
          <g transform="translate(8, 242)">
            <rect width="119" height="38" rx="5" fill="#ffffff" stroke="#bae6fd" />
            <text x="59" y="16" textAnchor="middle" fill="#0369a1" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Market Indices</text>
            <text x="59" y="29" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">NIFTY 50, VIX</text>
          </g>
        </g>

        <line x1="155" y1="220" x2="175" y2="220" stroke="#0284c7" strokeWidth="2" markerEnd="url(#flow-arr)" />

        {/* STAGE 2: Validation & Temporal Cutoff */}
        <g transform="translate(180, 75)">
          <rect width="135" height="290" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
          <rect width="135" height="30" rx="8" fill="#059669" />
          <text x="67" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">2. Validation Gate</text>

          <g transform="translate(8, 42)">
            <rect width="119" height="50" rx="5" fill="#ffffff" stroke="#a7f3d0" />
            <text x="59" y="18" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="10" fontFamily="sans-serif">Data Quality Check</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Price Band consistency</text>
            <text x="59" y="43" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Issue size &gt; 0 check</text>
          </g>

          <g transform="translate(8, 102)">
            <rect width="119" height="66" rx="5" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
            <text x="59" y="18" textAnchor="middle" fill="#991b1b" fontWeight="800" fontSize="10" fontFamily="sans-serif">TEMPORAL GATE</text>
            <text x="59" y="32" textAnchor="middle" fill="#b91c1c" fontWeight="700" fontSize="9" fontFamily="sans-serif">09:59:59 IST</text>
            <text x="59" y="45" textAnchor="middle" fill="#7f1d1d" fontSize="8" fontFamily="sans-serif">Strict Ex-Ante Cutoff</text>
            <text x="59" y="57" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontFamily="sans-serif">Freezes Pre-Open Data</text>
          </g>

          <g transform="translate(8, 178)">
            <rect width="119" height="48" rx="5" fill="#ffffff" stroke="#a7f3d0" />
            <text x="59" y="18" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="10" fontFamily="sans-serif">Missing Value Policy</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Zero 0.0 Accidental</text>
            <text x="59" y="43" textAnchor="middle" fill="#059669" fontSize="8.5" fontFamily="sans-serif">Preserves NaN Flag</text>
          </g>

          <g transform="translate(8, 236)">
            <rect width="119" height="44" rx="5" fill="#ffffff" stroke="#a7f3d0" />
            <text x="59" y="18" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="10" fontFamily="sans-serif">Provenance Stamp</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">Timestamp &amp; URL Log</text>
          </g>
        </g>

        <line x1="315" y1="220" x2="335" y2="220" stroke="#0284c7" strokeWidth="2" markerEnd="url(#flow-arr)" />

        {/* STAGE 3: 45 Features & Preprocessor */}
        <g transform="translate(340, 75)">
          <rect width="135" height="290" rx="8" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.5" />
          <rect width="135" height="30" rx="8" fill="#7c3aed" />
          <text x="67" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">3. 45-Feature Prep</text>

          <g transform="translate(8, 42)">
            <rect width="119" height="110" rx="5" fill="#ffffff" stroke="#ddd6fe" />
            <text x="59" y="18" textAnchor="middle" fill="#5b21b6" fontWeight="700" fontSize="10" fontFamily="sans-serif">Group G Features</text>
            <text x="12" y="34" fill="#334155" fontSize="8" fontFamily="sans-serif">• 13 IPO Structure</text>
            <text x="12" y="48" fill="#334155" fontSize="8" fontFamily="sans-serif">• 10 Fundamentals</text>
            <text x="12" y="62" fill="#334155" fontSize="8" fontFamily="sans-serif">• 4 Valuation Ratios</text>
            <text x="12" y="76" fill="#334155" fontSize="8" fontFamily="sans-serif">• 9 Market Sentiment</text>
            <text x="12" y="90" fill="#334155" fontSize="8" fontFamily="sans-serif">• 6 GMP &amp; News</text>
            <text x="12" y="104" fill="#334155" fontSize="8" fontFamily="sans-serif">• 3 Hist &amp; Sector</text>
          </g>

          <g transform="translate(8, 160)">
            <rect width="119" height="60" rx="5" fill="#ffffff" stroke="#ddd6fe" />
            <text x="59" y="18" textAnchor="middle" fill="#5b21b6" fontWeight="700" fontSize="10" fontFamily="sans-serif">FoldPreprocessor</text>
            <text x="59" y="32" textAnchor="middle" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">dev_preprocessor</text>
            <text x="59" y="44" textAnchor="middle" fill="#059669" fontSize="8.5" fontFamily="sans-serif">Training Medians</text>
            <text x="59" y="55" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Winsorize (1-99%)</text>
          </g>

          <g transform="translate(8, 228)">
            <rect width="119" height="52" rx="5" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.2" />
            <text x="59" y="18" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">SHA-256 Gate</text>
            <text x="59" y="32" textAnchor="middle" fill="#047857" fontWeight="600" fontSize="8.5" fontFamily="sans-serif">Hashes Verified</text>
            <text x="59" y="44" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Zero Model Mutation</text>
          </g>
        </g>

        <line x1="475" y1="220" x2="495" y2="220" stroke="#0284c7" strokeWidth="2" markerEnd="url(#flow-arr)" />

        {/* STAGE 4: Production ML Models */}
        <g transform="translate(500, 75)">
          <rect width="145" height="290" rx="8" fill="#faf5ff" stroke="#c084fc" strokeWidth="1.5" />
          <rect width="145" height="30" rx="8" fill="#9333ea" />
          <text x="72" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">4. Model Inference</text>

          <g transform="translate(8, 42)">
            <rect width="129" height="52" rx="5" fill="#ffffff" stroke="#e9d5ff" />
            <text x="10" y="18" fill="#7e22ce" fontWeight="800" fontSize="9.5" fontFamily="sans-serif">Total Subscription</text>
            <text x="10" y="32" fill="#0f172a" fontSize="8.5" fontFamily="sans-serif">XGBoost (log1p)</text>
            <text x="10" y="44" fill="#059669" fontSize="8" fontFamily="sans-serif">Inverse: exp(ŷ) - 1</text>
          </g>

          <g transform="translate(8, 102)">
            <rect width="129" height="48" rx="5" fill="#ffffff" stroke="#e9d5ff" />
            <text x="10" y="18" fill="#0284c7" fontWeight="800" fontSize="9.5" fontFamily="sans-serif">QIB Institutional</text>
            <text x="10" y="32" fill="#0f172a" fontSize="8.5" fontFamily="sans-serif">Random Forest</text>
            <text x="10" y="44" fill="#64748b" fontSize="8" fontFamily="sans-serif">Direct Raw Multiple</text>
          </g>

          <g transform="translate(8, 158)">
            <rect width="129" height="52" rx="5" fill="#ffffff" stroke="#e9d5ff" />
            <text x="10" y="18" fill="#9333ea" fontWeight="800" fontSize="9.5" fontFamily="sans-serif">NII Corporate/HNI</text>
            <text x="10" y="32" fill="#0f172a" fontSize="8.5" fontFamily="sans-serif">LightGBM (log1p)</text>
            <text x="10" y="44" fill="#059669" fontSize="8" fontFamily="sans-serif">Inverse: exp(ŷ) - 1</text>
          </g>

          <g transform="translate(8, 218)">
            <rect width="129" height="48" rx="5" fill="#ffffff" stroke="#e9d5ff" />
            <text x="10" y="18" fill="#ea580c" fontWeight="800" fontSize="9.5" fontFamily="sans-serif">Retail Individual</text>
            <text x="10" y="32" fill="#0f172a" fontSize="8.5" fontFamily="sans-serif">XGBoost (Raw)</text>
            <text x="10" y="44" fill="#64748b" fontSize="8" fontFamily="sans-serif">Direct Raw Multiple</text>
          </g>

          <rect x="8" y="272" width="129" height="12" rx="3" fill="#ecfdf5" />
          <text x="72" y="281" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="7.5" fontFamily="sans-serif">NO RANDOM ENSEMBLE</text>
        </g>

        <line x1="645" y1="220" x2="665" y2="220" stroke="#0284c7" strokeWidth="2" markerEnd="url(#flow-arr)" />

        {/* STAGE 5: Explanation & Risk */}
        <g transform="translate(670, 75)">
          <rect width="120" height="290" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
          <rect width="120" height="30" rx="8" fill="#d97706" />
          <text x="60" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">5. SHAP &amp; Risk</text>

          <g transform="translate(6, 42)">
            <rect width="108" height="64" rx="5" fill="#ffffff" stroke="#fde68a" />
            <text x="54" y="18" textAnchor="middle" fill="#b45309" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">TreeSHAP Engine</text>
            <text x="54" y="32" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Game-Theoretic φ</text>
            <text x="54" y="44" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">Top 3 Positive</text>
            <text x="54" y="56" textAnchor="middle" fill="#dc2626" fontSize="8" fontFamily="sans-serif">Top 3 Negative</text>
          </g>

          <g transform="translate(6, 116)">
            <rect width="108" height="60" rx="5" fill="#ffffff" stroke="#fde68a" />
            <text x="54" y="18" textAnchor="middle" fill="#b45309" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Risk Engine</text>
            <text x="54" y="32" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Financial leverage</text>
            <text x="54" y="44" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Valuation premium</text>
            <text x="54" y="56" textAnchor="middle" fill="#b45309" fontSize="8" fontFamily="sans-serif">Penalty Points (0-10)</text>
          </g>

          <g transform="translate(6, 186)">
            <rect width="108" height="60" rx="5" fill="#ffffff" stroke="#fde68a" />
            <text x="54" y="18" textAnchor="middle" fill="#b45309" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Confidence</text>
            <text x="54" y="32" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Econometric Cap</text>
            <text x="54" y="44" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="8" fontFamily="sans-serif">Max 82% Baseline</text>
            <text x="54" y="56" textAnchor="middle" fill="#dc2626" fontSize="8" fontFamily="sans-serif">Tail Penalized</text>
          </g>

          <g transform="translate(6, 254)">
            <rect width="108" height="28" rx="5" fill="#ffffff" stroke="#fde68a" />
            <text x="54" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">Investor Edge</text>
          </g>
        </g>

        <line x1="790" y1="220" x2="805" y2="220" stroke="#0284c7" strokeWidth="2" markerEnd="url(#flow-arr)" />

        {/* STAGE 6: Output & UI Delivery */}
        <g transform="translate(810, 75)">
          <rect width="110" height="290" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="110" height="30" rx="8" fill="#334155" />
          <text x="55" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">6. User Interface</text>

          <g transform="translate(5, 42)">
            <rect width="100" height="72" rx="5" fill="#ffffff" stroke="#cbd5e1" />
            <text x="50" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">React Dashboard</text>
            <text x="50" y="32" textAnchor="middle" fill="#0284c7" fontSize="8" fontFamily="sans-serif">Active IPO Cards</text>
            <text x="50" y="44" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">Next 15d Forecast</text>
            <text x="50" y="56" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Closed 15d Audit</text>
            <text x="50" y="68" textAnchor="middle" fill="#7c3aed" fontSize="8" fontFamily="sans-serif">Scenario Studio</text>
          </g>

          <g transform="translate(5, 122)">
            <rect width="100" height="70" rx="5" fill="#ffffff" stroke="#cbd5e1" />
            <text x="50" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Prediction Audit</text>
            <text x="50" y="32" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Immutable JSONL</text>
            <text x="50" y="44" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Audit Log Record</text>
            <text x="50" y="56" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">ex_ante=true</text>
            <text x="50" y="68" textAnchor="middle" fill="#0284c7" fontSize="8" fontFamily="sans-serif">UUID Tracing</text>
          </g>

          <g transform="translate(5, 202)">
            <rect width="100" height="78" rx="5" fill="#ffffff" stroke="#cbd5e1" />
            <text x="50" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Drift Evaluator</text>
            <text x="50" y="32" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Prospective PSI</text>
            <text x="50" y="44" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">MAPE &amp; AE Tracking</text>
            <text x="50" y="56" textAnchor="middle" fill="#b91c1c" fontSize="8" fontFamily="sans-serif">Retraining Gate</text>
            <text x="50" y="68" textAnchor="middle" fill="#047857" fontSize="8" fontFamily="sans-serif">Candidate Staging</text>
          </g>
        </g>

        {/* BOTTOM EXPLICIT SEPARATION COMPARISON BOX (CRITICAL DIRECTIVE) */}
        <g transform="translate(20, 380)">
          <rect width="900" height="142" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          
          <rect x="12" y="12" width="430" height="118" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="28" y="34" fill="#1e3a8a" fontWeight="800" fontSize="12" fontFamily="sans-serif">
            AI EX-ANTE PREDICTION = QUANTITATIVE MODEL OUTPUT
          </text>
          <text x="28" y="52" fill="#1e40af" fontSize="9.5" fontFamily="sans-serif">• Captured strictly prior to 09:59:59 IST on Day 1 of subscription opening.</text>
          <text x="28" y="68" fill="#1e40af" fontSize="9.5" fontFamily="sans-serif">• Based on 45 fundamental, financial, valuation, and pre-market regime features.</text>
          <text x="28" y="84" fill="#1e40af" fontSize="9.5" fontFamily="sans-serif">• Sealed and frozen permanently in predictions.csv with immutable UUID.</text>
          <text x="28" y="100" fill="#1e40af" fontSize="9.5" fontFamily="sans-serif">• Provides honest ex-ante benchmark before dynamic retail or HNI herd momentum.</text>
          <rect x="28" y="108" width="130" height="16" rx="4" fill="#bfdbfe" />
          <text x="93" y="120" textAnchor="middle" fill="#1e3a8a" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">CLASSIFICATION: MODEL OUTPUT</text>

          <rect x="458" y="12" width="430" height="118" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
          <text x="474" y="34" fill="#065f46" fontWeight="800" fontSize="12" fontFamily="sans-serif">
            LIVE NSE SUBSCRIPTION TALLY = REAL-TIME OBSERVATION ONLY
          </text>
          <text x="474" y="52" fill="#047857" fontSize="9.5" fontFamily="sans-serif">• Dynamic order-book tally polled hourly from official NSE public exchange feed.</text>
          <text x="474" y="68" fill="#047857" fontSize="9.5" fontFamily="sans-serif">• Reflects intraday bidding progress across Day 1, Day 2, and Day 3.</text>
          <text x="474" y="84" fill="#047857" fontSize="9.5" fontFamily="sans-serif">• STRICT FIREWALL: NEVER fed into the preprocessor or model prediction engine.</text>
          <text x="474" y="100" fill="#047857" fontSize="9.5" fontFamily="sans-serif">• Displayed purely for investor tracking and prospective monitoring.</text>
          <rect x="474" y="108" width="150" height="16" rx="4" fill="#a7f3d0" />
          <text x="549" y="120" textAnchor="middle" fill="#065f46" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">CLASSIFICATION: OBSERVATION ONLY</text>
        </g>
      </svg>
    </div>
  );
};
