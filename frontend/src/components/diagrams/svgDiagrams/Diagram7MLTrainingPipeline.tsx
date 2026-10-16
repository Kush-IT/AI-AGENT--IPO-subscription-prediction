import React from 'react';

export const Diagram7MLTrainingPipeline: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d7-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="d7-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#f3e8ff" />
          </linearGradient>
          <linearGradient id="d7-emerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          <linearGradient id="d7-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <marker id="d7-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="d7-arr-em" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title / Banner */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="#1e293b" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          END-TO-END AI/ML MODEL TRAINING &amp; VALIDATION PIPELINE (HISTORICAL N=106)
        </text>

        {/* Step 1: Historical Dataset & Chronological Split */}
        <g transform="translate(20, 65)">
          <rect width="165" height="400" rx="8" fill="url(#d7-blue)" stroke="#38bdf8" strokeWidth="1.5" />
          <rect width="165" height="30" rx="8" fill="#0284c7" />
          <text x="82.5" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            1. Data Ingestion &amp; Split
          </text>
          
          <g transform="translate(10, 40)">
            <rect width="145" height="60" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Historical Dataset</text>
            <text x="72.5" y="34" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="sans-serif">106 Historical Mainboard IPOs</text>
            <text x="72.5" y="48" textAnchor="middle" fill="#0284c7" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Target: Actual Subscription</text>
          </g>

          <g transform="translate(10, 115)">
            <rect width="145" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Temporal Split (No Shuffle)</text>
            <rect x="8" y="26" width="129" height="22" rx="4" fill="#dbeafe" stroke="#bfdbfe" />
            <text x="72.5" y="41" textAnchor="middle" fill="#1e40af" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Train: Oldest 85 IPOs (80%)</text>
            <rect x="8" y="53" width="129" height="22" rx="4" fill="#fee2e2" stroke="#fecaca" />
            <text x="72.5" y="68" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Test: Newest 21 IPOs (20%)</text>
          </g>

          <g transform="translate(10, 215)">
            <rect width="145" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Walk-Forward CV</text>
            <text x="72.5" y="34" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">5-Fold Time-Series Split</text>
            <text x="72.5" y="48" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Train folds strictly precede</text>
            <text x="72.5" y="60" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">validation folds</text>
            <text x="72.5" y="74" textAnchor="middle" fill="#b91c1c" fontWeight="600" fontSize="8" fontFamily="sans-serif">Zero Look-Ahead Leakage</text>
          </g>

          <g transform="translate(10, 315)">
            <rect width="145" height="70" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <text x="72.5" y="18" textAnchor="middle" fill="#334155" fontWeight="700" fontSize="9" fontFamily="sans-serif">Governance Rule</text>
            <text x="72.5" y="34" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">Cutoff: 09:59:59 IST Day 1</text>
            <text x="72.5" y="48" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="600" fontFamily="sans-serif">Live Day-1/2/3 Bids BLOCKED</text>
            <text x="72.5" y="60" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">from Feature Store</text>
          </g>
        </g>

        {/* Step 2: Feature Engineering & Preprocessor */}
        <g transform="translate(200, 65)">
          <rect width="165" height="400" rx="8" fill="url(#d7-purple)" stroke="#c084fc" strokeWidth="1.5" />
          <rect width="165" height="30" rx="8" fill="#9333ea" />
          <text x="82.5" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            2. Feature Engineering
          </text>

          <g transform="translate(10, 40)">
            <rect width="145" height="90" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">45 Canonical Features</text>
            <text x="72.5" y="32" textAnchor="middle" fill="#7e22ce" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">Group_G_All_Features</text>
            <text x="72.5" y="46" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Issue Size &amp; Pricing (8)</text>
            <text x="72.5" y="58" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Financials &amp; Valuations (12)</text>
            <text x="72.5" y="70" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• GMP &amp; FinBERT News (9)</text>
            <text x="72.5" y="82" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Anchor &amp; Sector (16)</text>
          </g>

          <g transform="translate(10, 145)">
            <rect width="145" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">dev_preprocessor.joblib</text>
            <rect x="8" y="26" width="129" height="24" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
            <text x="72.5" y="41" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="600" fontFamily="sans-serif">SimpleImputer (Median)</text>
            <rect x="8" y="54" width="129" height="24" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
            <text x="72.5" y="69" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="600" fontFamily="sans-serif">RobustScaler (Median/IQR)</text>
            <text x="72.5" y="93" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Fitted ONLY on 80% Train</text>
            <text x="72.5" y="103" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">Transform applied to Test</text>
          </g>

          <g transform="translate(10, 270)">
            <rect width="145" height="115" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Target Transformations</text>
            <rect x="8" y="26" width="129" height="35" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
            <text x="72.5" y="39" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="700" fontFamily="sans-serif">log1p = log(1 + y)</text>
            <text x="72.5" y="52" textAnchor="middle" fill="#3b82f6" fontSize="7.5" fontFamily="sans-serif">Applied to Total &amp; NII (skewed)</text>
            <rect x="8" y="66" width="129" height="35" rx="4" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="72.5" y="79" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="700" fontFamily="sans-serif">Raw Target: y</text>
            <text x="72.5" y="92" textAnchor="middle" fill="#15803d" fontSize="7.5" fontFamily="sans-serif">Applied to QIB &amp; Retail</text>
          </g>
        </g>

        {/* Step 3: Candidate Models Training */}
        <g transform="translate(380, 65)">
          <rect width="175" height="400" rx="8" fill="url(#d7-amber)" stroke="#f59e0b" strokeWidth="1.5" />
          <rect width="175" height="30" rx="8" fill="#d97706" />
          <text x="87.5" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            3. Model Architecture Training
          </text>

          <g transform="translate(10, 40)">
            <rect width="155" height="78" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="77.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">TOTAL Model</text>
            <text x="77.5" y="32" textAnchor="middle" fill="#d97706" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">total_xgboost_log1p</text>
            <text x="77.5" y="46" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">XGBoost Regressor (trees=150)</text>
            <text x="77.5" y="58" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">max_depth=4, lr=0.04</text>
            <text x="77.5" y="70" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="600" fontFamily="sans-serif">Loss: Huber (outlier robust)</text>
          </g>

          <g transform="translate(10, 125)">
            <rect width="155" height="78" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="77.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">QIB Model</text>
            <text x="77.5" y="32" textAnchor="middle" fill="#d97706" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">qib_random_forest_raw</text>
            <text x="77.5" y="46" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Random Forest (n_est=200)</text>
            <text x="77.5" y="58" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">max_depth=6, min_samples=3</text>
            <text x="77.5" y="70" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="600" fontFamily="sans-serif">Raw Target scale [0, 500x]</text>
          </g>

          <g transform="translate(10, 210)">
            <rect width="155" height="78" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="77.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">NII Model</text>
            <text x="77.5" y="32" textAnchor="middle" fill="#d97706" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">nii_lightgbm_log1p</text>
            <text x="77.5" y="46" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">LightGBM (n_leaves=15)</text>
            <text x="77.5" y="58" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">min_child_samples=5, lr=0.03</text>
            <text x="77.5" y="70" textAnchor="middle" fill="#d97706" fontSize="8" fontWeight="600" fontFamily="sans-serif">Objective: regression_l1</text>
          </g>

          <g transform="translate(10, 295)">
            <rect width="155" height="78" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="77.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">RETAIL Model</text>
            <text x="77.5" y="32" textAnchor="middle" fill="#d97706" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">retail_xgboost_raw</text>
            <text x="77.5" y="46" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">XGBoost Regressor (trees=100)</text>
            <text x="77.5" y="58" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">max_depth=3, colsample=0.8</text>
            <text x="77.5" y="70" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="600" fontFamily="sans-serif">Loss: Absolute Error</text>
          </g>
        </g>

        {/* Step 4: Multi-Objective Evaluation & SHA-256 Gate */}
        <g transform="translate(570, 65)">
          <rect width="165" height="400" rx="8" fill="url(#d7-emerald)" stroke="#34d399" strokeWidth="1.5" />
          <rect width="165" height="30" rx="8" fill="#059669" />
          <text x="82.5" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            4. Evaluation &amp; Gating
          </text>

          <g transform="translate(10, 40)">
            <rect width="145" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Evaluation Metrics</text>
            <text x="72.5" y="32" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif">Computed on 20% Test IPOs</text>
            <line x1="10" y1="38" x2="135" y2="38" stroke="#e2e8f0" />
            <text x="15" y="52" fill="#334155" fontSize="8" fontFamily="sans-serif">• MAE (Mean Absolute Error)</text>
            <text x="15" y="66" fill="#334155" fontSize="8" fontFamily="sans-serif">• RMSE (Root Mean Sq. Error)</text>
            <text x="15" y="80" fill="#334155" fontSize="8" fontFamily="sans-serif">• R² Goodness of Fit</text>
            <text x="15" y="94" fill="#334155" fontSize="8" fontFamily="sans-serif">• sMAPE (Symmetric MAPE)</text>
            <text x="15" y="104" fill="#334155" fontSize="8" fontFamily="sans-serif">• Prediction/Actual Ratio</text>
          </g>

          <g transform="translate(10, 160)">
            <rect width="145" height="100" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">SHA-256 Checksum Gate</text>
            <text x="72.5" y="32" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Cryptographic Integrity</text>
            <rect x="8" y="38" width="129" height="24" rx="4" fill="#ecfdf5" stroke="#a7f3d0" />
            <text x="72.5" y="53" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="700" fontFamily="sans-serif">models/final_candidates/</text>
            <text x="72.5" y="75" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="600" fontFamily="sans-serif">Frozen Artifacts Locked</text>
            <text x="72.5" y="89" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Zero In-Place Overwrites</text>
          </g>

          <g transform="translate(10, 270)">
            <rect width="145" height="115" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">Explainability (SHAP)</text>
            <rect x="8" y="26" width="129" height="35" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="72.5" y="40" textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="600" fontFamily="sans-serif">TreeExplainer Pre-fit</text>
            <text x="72.5" y="53" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Exact Shapley value margins</text>
            <text x="72.5" y="77" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">Base value (E[f(x)])</text>
            <text x="72.5" y="90" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">+ Feature Contributions</text>
            <text x="72.5" y="103" textAnchor="middle" fill="#059669" fontWeight="700" fontSize="8" fontFamily="sans-serif">= Final Model Prediction</text>
          </g>
        </g>

        {/* Step 5: Production Deployment & Inference Registry */}
        <g transform="translate(750, 65)">
          <rect width="150" height="400" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <rect width="150" height="30" rx="8" fill="#475569" />
          <text x="75" y="20" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            5. Model Promotion
          </text>

          <g transform="translate(10, 40)">
            <rect width="130" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Registry Promotion</text>
            <text x="65" y="34" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Metadata logged:</text>
            <text x="65" y="48" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontFamily="sans-serif">Git commit, Train loss,</text>
            <text x="65" y="60" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontFamily="sans-serif">Test MAE, Target scaler</text>
          </g>

          <g transform="translate(10, 125)">
            <rect width="130" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">FastAPI Model Pool</text>
            <text x="65" y="34" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Singleton memory cache</text>
            <text x="65" y="48" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="600" fontFamily="sans-serif">Zero load-latency</text>
            <text x="65" y="62" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Thread-safe inference</text>
            <text x="65" y="74" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Latency: &lt;15ms per IPO</text>
          </g>

          <g transform="translate(10, 220)">
            <rect width="130" height="90" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="18" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Audit Log Stream</text>
            <text x="65" y="34" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Every inference written</text>
            <text x="65" y="48" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">to prediction_audit.jsonl</text>
            <text x="65" y="62" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Includes timestamp,</text>
            <text x="65" y="74" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">input hash &amp; output</text>
          </g>

          <g transform="translate(10, 320)">
            <rect width="130" height="65" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="65" y="18" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">Retraining Quarantine</text>
            <text x="65" y="32" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontFamily="sans-serif">Candidate models</text>
            <text x="65" y="44" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontFamily="sans-serif">must beat frozen base</text>
            <text x="65" y="56" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">before promotion</text>
          </g>
        </g>

        {/* Horizontal Connectors */}
        <path d="M 185 240 L 200 240" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d7-arr)" />
        <path d="M 365 240 L 380 240" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d7-arr)" />
        <path d="M 555 240 L 570 240" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d7-arr)" />
        <path d="M 735 240 L 750 240" stroke="#059669" strokeWidth="2" markerEnd="url(#d7-arr-em)" />

        {/* Footer Bar */}
        <rect x="20" y="480" width="880" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <text x="35" y="505" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
          Governance Highlights:
        </text>
        <text x="165" y="505" fill="#334155" fontSize="10" fontFamily="sans-serif">
          • Strict 80/20 chronological time split • Zero lookahead in CV folds • log1p skew reduction • Checksum-locked model artifacts
        </text>
      </svg>
    </div>
  );
};
