import React from 'react';

export const Diagram8ModelPredictionFlow: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d8-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="d8-emerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          <linearGradient id="d8-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#f3e8ff" />
          </linearGradient>
          <marker id="d8-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
          </marker>
          <marker id="d8-arr-purp" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#9333ea" />
          </marker>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="#1e293b" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          DETAILED MODEL PREDICTION FLOW — "HOW AI PREDICTS ONE IPO"
        </text>

        {/* Stage 1: Raw Input & Temporal Cutoff */}
        <g transform="translate(20, 68)">
          <rect width="160" height="395" rx="8" fill="url(#d8-blue)" stroke="#38bdf8" strokeWidth="1.5" />
          <rect width="160" height="28" rx="8" fill="#0284c7" />
          <text x="80" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            1. Pre-IPO Ingestion
          </text>

          <g transform="translate(10, 38)">
            <rect width="140" height="65" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">IPO Registration</text>
            <text x="70" y="30" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Company Name &amp; Sector</text>
            <text x="70" y="42" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">Price Band [Floor, Cap]</text>
            <text x="70" y="54" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="600" fontFamily="sans-serif">Issue Size (Rs. Cr)</text>
          </g>

          <g transform="translate(10, 115)">
            <rect width="140" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Prospectus Financials</text>
            <text x="70" y="30" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Revenue, PAT, Net Worth</text>
            <text x="70" y="42" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Post-issue P/E, P/B, RoNW</text>
            <text x="70" y="54" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• OFS vs Fresh Issue Ratio</text>
            <text x="70" y="68" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Extracted from SEBI RHP</text>
          </g>

          <g transform="translate(10, 207)">
            <rect width="140" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="70" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">Pre-IPO Market Data</text>
            <text x="70" y="30" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Indicative GMP (Day -1)</text>
            <text x="70" y="42" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• Anchor Investor Portion</text>
            <text x="70" y="54" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="sans-serif">• FinBERT Sentiment Score</text>
            <text x="70" y="66" textAnchor="middle" fill="#d97706" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Score range [-1.0, +1.0]</text>
          </g>

          <g transform="translate(10, 294)">
            <rect width="140" height="88" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.2" />
            <text x="70" y="16" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">TEMPORAL GATE</text>
            <text x="70" y="30" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="600" fontFamily="sans-serif">09:59:59 IST Day 1</text>
            <line x1="8" y1="36" x2="132" y2="36" stroke="#fecaca" />
            <text x="70" y="48" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">Any timestamp &gt; cutoff</text>
            <text x="70" y="60" textAnchor="middle" fill="#7f1d1d" fontSize="7.5" fontFamily="sans-serif">REJECTED from pipeline</text>
            <text x="70" y="76" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">ZERO LIVE TALLY LEAK</text>
          </g>
        </g>

        {/* Stage 2: Feature Transformation */}
        <g transform="translate(195, 68)">
          <rect width="155" height="395" rx="8" fill="url(#d8-purple)" stroke="#c084fc" strokeWidth="1.5" />
          <rect width="155" height="28" rx="8" fill="#9333ea" />
          <text x="77.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            2. Feature Pipeline
          </text>

          <g transform="translate(10, 38)">
            <rect width="135" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">45-Dim Vector Build</text>
            <text x="67.5" y="30" textAnchor="middle" fill="#7e22ce" fontSize="8" fontWeight="600" fontFamily="sans-serif">Group_G Mapping</text>
            <text x="67.5" y="44" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Strict feature ordering</text>
            <text x="67.5" y="56" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">aligned to config</text>
            <text x="67.5" y="68" textAnchor="middle" fill="#059669" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Shape: (1, 45)</text>
          </g>

          <g transform="translate(10, 125)">
            <rect width="135" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">dev_preprocessor</text>
            <text x="67.5" y="28" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">SHA256: 04bd6412...</text>
            <rect x="8" y="34" width="119" height="26" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
            <text x="67.5" y="46" textAnchor="middle" fill="#6b21a8" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">1. SimpleImputer</text>
            <text x="67.5" y="56" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">Median replacement</text>
            <rect x="8" y="65" width="119" height="26" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
            <text x="67.5" y="77" textAnchor="middle" fill="#6b21a8" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">2. RobustScaler</text>
            <text x="67.5" y="87" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">IQR scaling / Outlier resist</text>
            <text x="67.5" y="103" textAnchor="middle" fill="#059669" fontSize="7" fontWeight="600" fontFamily="sans-serif">Ready for Inference</text>
          </g>

          <g transform="translate(10, 248)">
            <rect width="135" height="134" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="67.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Feature Verification</text>
            <text x="67.5" y="30" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Range bounds check</text>
            <text x="67.5" y="42" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Type consistency</text>
            <text x="67.5" y="54" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• No NaN or Infinity</text>
            <text x="67.5" y="66" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">• Sector one-hot check</text>
            <rect x="8" y="76" width="119" height="48" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
            <text x="67.5" y="90" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Feature Snapshot</text>
            <text x="67.5" y="102" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="sans-serif">Archived with hash</text>
            <text x="67.5" y="114" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="sans-serif">for full reproducibility</text>
          </g>
        </g>

        {/* Stage 3: Parallel Model Inference */}
        <g transform="translate(365, 68)">
          <rect width="190" height="395" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
          <rect width="190" height="28" rx="8" fill="#d97706" />
          <text x="95" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            3. Parallel Multi-Model Inference
          </text>

          {/* Model 1: Total */}
          <g transform="translate(10, 38)">
            <rect width="170" height="74" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="85" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">TOTAL Model (XGBoost)</text>
            <text x="85" y="28" textAnchor="middle" fill="#d97706" fontSize="7.5" fontFamily="sans-serif">total_xgboost_log1p.joblib</text>
            <rect x="8" y="34" width="154" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
            <text x="85" y="47" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">f(x) = log1p =&gt; expm1(y)</text>
            <text x="85" y="65" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="700" fontFamily="sans-serif">Direct Total Output: e.g. 23.7x</text>
          </g>

          {/* Model 2: QIB */}
          <g transform="translate(10, 120)">
            <rect width="170" height="74" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="85" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">QIB Model (Random Forest)</text>
            <text x="85" y="28" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontFamily="sans-serif">qib_random_forest_raw.joblib</text>
            <rect x="8" y="34" width="154" height="20" rx="4" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="85" y="47" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Raw Target (No Inverse Req)</text>
            <text x="85" y="65" textAnchor="middle" fill="#0284c7" fontSize="8" fontWeight="700" fontFamily="sans-serif">QIB Prediction: e.g. 18.5x</text>
          </g>

          {/* Model 3: NII */}
          <g transform="translate(10, 202)">
            <rect width="170" height="74" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="85" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">NII Model (LightGBM)</text>
            <text x="85" y="28" textAnchor="middle" fill="#9333ea" fontSize="7.5" fontFamily="sans-serif">nii_lightgbm_log1p.joblib</text>
            <rect x="8" y="34" width="154" height="20" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
            <text x="85" y="47" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">f(x) = log1p =&gt; expm1(y)</text>
            <text x="85" y="65" textAnchor="middle" fill="#9333ea" fontSize="8" fontWeight="700" fontFamily="sans-serif">NII Prediction: e.g. 38.2x</text>
          </g>

          {/* Model 4: Retail */}
          <g transform="translate(10, 284)">
            <rect width="170" height="74" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="85" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">RETAIL Model (XGBoost)</text>
            <text x="85" y="28" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontFamily="sans-serif">retail_xgboost_raw.joblib</text>
            <rect x="8" y="34" width="154" height="20" rx="4" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="85" y="47" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Raw Target (No Inverse Req)</text>
            <text x="85" y="65" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="700" fontFamily="sans-serif">Retail Prediction: e.g. 14.1x</text>
          </g>

          {/* Latency badge */}
          <text x="95" y="380" textAnchor="middle" fill="#b45309" fontSize="8" fontWeight="700" fontFamily="sans-serif">
            Parallel Inference Time: 12ms
          </text>
        </g>

        {/* Stage 4: SHAP Explainer & Risk Quant */}
        <g transform="translate(570, 68)">
          <rect width="165" height="395" rx="8" fill="url(#d8-emerald)" stroke="#34d399" strokeWidth="1.5" />
          <rect width="165" height="28" rx="8" fill="#059669" />
          <text x="82.5" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            4. SHAP &amp; Risk Metrics
          </text>

          <g transform="translate(10, 38)">
            <rect width="145" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">TreeSHAP Explanations</text>
            <text x="72.5" y="28" textAnchor="middle" fill="#059669" fontSize="7.5" fontFamily="sans-serif">Local Attribution for IPO</text>
            <line x1="8" y1="34" x2="137" y2="34" stroke="#e2e8f0" />
            <rect x="8" y="40" width="129" height="16" rx="3" fill="#fee2e2" />
            <text x="72.5" y="52" textAnchor="middle" fill="#991b1b" fontSize="7" fontWeight="600" fontFamily="sans-serif">GMP: +8.4x (Positive)</text>
            <rect x="8" y="60" width="129" height="16" rx="3" fill="#fee2e2" />
            <text x="72.5" y="72" textAnchor="middle" fill="#991b1b" fontSize="7" fontWeight="600" fontFamily="sans-serif">FinBERT News: +3.2x</text>
            <rect x="8" y="80" width="129" height="16" rx="3" fill="#eff6ff" />
            <text x="72.5" y="92" textAnchor="middle" fill="#1e40af" fontSize="7" fontWeight="600" fontFamily="sans-serif">Issue Size: -1.8x (Drag)</text>
            <text x="72.5" y="104" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">Base E[f(x)] = 13.9x</text>
          </g>

          <g transform="translate(10, 158)">
            <rect width="145" height="105" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Risk &amp; Percentile Bands</text>
            <text x="72.5" y="28" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Quantile Regression &amp; Bounds</text>
            <rect x="8" y="34" width="129" height="18" rx="3" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="72.5" y="46" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">P05 (Bear): 12.1x</text>
            <rect x="8" y="56" width="129" height="18" rx="3" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="72.5" y="68" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">P50 (Median): 23.7x</text>
            <rect x="8" y="78" width="129" height="18" rx="3" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="72.5" y="90" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">P95 (Bull): 48.6x</text>
            <text x="72.5" y="101" textAnchor="middle" fill="#059669" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">Confidence Interval: 90%</text>
          </g>

          <g transform="translate(10, 273)">
            <rect width="145" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="72.5" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Weighting Audit Notice</text>
            <rect x="8" y="24" width="129" height="38" rx="4" fill="#fef3c7" stroke="#fde68a" />
            <text x="72.5" y="38" textAnchor="middle" fill="#92400e" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Ensemble Comparison</text>
            <text x="72.5" y="50" textAnchor="middle" fill="#b45309" fontSize="6.5" fontFamily="sans-serif">Direct: 23.7x | Wgt: 20.0x</text>
            <text x="72.5" y="58" textAnchor="middle" fill="#78350f" fontSize="6" fontFamily="sans-serif">(0.50Q + 0.15N + 0.35R)</text>
            <text x="72.5" y="78" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">Over-subscription Prob:</text>
            <text x="72.5" y="92" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="700" fontFamily="sans-serif">&gt; 99.4% (&gt; 1.0x)</text>
            <text x="72.5" y="104" textAnchor="middle" fill="#dc2626" fontSize="7" fontWeight="600" fontFamily="sans-serif">Direct Model is Primary</text>
          </g>
        </g>

        {/* Stage 5: Output & UI Delivery */}
        <g transform="translate(750, 68)">
          <rect width="150" height="395" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <rect width="150" height="28" rx="8" fill="#475569" />
          <text x="75" y="19" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
            5. UI &amp; Audit Log
          </text>

          <g transform="translate(10, 38)">
            <rect width="130" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">REST API Response</text>
            <text x="65" y="28" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontFamily="sans-serif">JSON Schema 2026</text>
            <line x1="6" y1="32" x2="124" y2="32" stroke="#e2e8f0" />
            <text x="65" y="44" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• predicted_total</text>
            <text x="65" y="56" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• qib, nii, retail</text>
            <text x="65" y="68" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• shap_attributions</text>
            <text x="65" y="80" textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="sans-serif">• confidence_bands</text>
          </g>

          <g transform="translate(10, 135)">
            <rect width="130" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">React Dashboard</text>
            <text x="65" y="28" textAnchor="middle" fill="#475569" fontSize="7.5" fontFamily="sans-serif">Rendered Cards</text>
            <rect x="6" y="34" width="118" height="24" rx="3" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="65" y="48" textAnchor="middle" fill="#166534" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Ex-Ante AI: 23.7x</text>
            <rect x="6" y="64" width="118" height="34" rx="3" fill="#fef2f2" stroke="#fecaca" />
            <text x="65" y="76" textAnchor="middle" fill="#991b1b" fontSize="7" fontWeight="700" fontFamily="sans-serif">Live NSE: 71.3x</text>
            <text x="65" y="86" textAnchor="middle" fill="#dc2626" fontSize="6.5" fontFamily="sans-serif">(Visualized as Observation</text>
            <text x="65" y="94" textAnchor="middle" fill="#dc2626" fontSize="6.5" fontFamily="sans-serif">NOT training target)</text>
          </g>

          <g transform="translate(10, 255)">
            <rect width="130" height="120" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="65" y="16" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Persistent Audit Log</text>
            <text x="65" y="28" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">prediction_audit.jsonl</text>
            <line x1="6" y1="32" x2="124" y2="32" stroke="#e2e8f0" />
            <text x="65" y="44" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">• timestamp_ist</text>
            <text x="65" y="56" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">• ipo_name &amp; ticker</text>
            <text x="65" y="68" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">• feature_hash (sha256)</text>
            <text x="65" y="80" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">• model_versions</text>
            <text x="65" y="92" textAnchor="middle" fill="#475569" fontSize="7" fontFamily="sans-serif">• prediction_values</text>
            <text x="65" y="106" textAnchor="middle" fill="#059669" fontSize="7" fontWeight="600" fontFamily="sans-serif">Immutable Audit Record</text>
          </g>
        </g>

        {/* Horizontal Connectors */}
        <path d="M 180 230 L 195 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d8-arr)" />
        <path d="M 350 230 L 365 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d8-arr)" />
        <path d="M 555 230 L 570 230" stroke="#0284c7" strokeWidth="2" markerEnd="url(#d8-arr)" />
        <path d="M 735 230 L 750 230" stroke="#059669" strokeWidth="2" markerEnd="url(#d8-arr)" />

        {/* Footer */}
        <rect x="20" y="480" width="880" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <text x="35" y="505" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
          Pipeline Guarantees:
        </text>
        <text x="170" y="505" fill="#334155" fontSize="10" fontFamily="sans-serif">
          • Strict Ex-Ante inputs only • TreeSHAP local feature explainability • Parallel 4-model inference (&lt;15ms) • Immutable audit log
        </text>
      </svg>
    </div>
  );
};
