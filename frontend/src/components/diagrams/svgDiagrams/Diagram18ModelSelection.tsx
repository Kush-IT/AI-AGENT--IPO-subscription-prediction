import React from 'react';

export const Diagram18ModelSelection: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d18-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d18-hdr)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          MULTI-OBJECTIVE MODEL SELECTION &amp; PROMOTION DECISION MATRIX (TEST N=21)
        </text>

        {/* Table Container */}
        <g transform="translate(25, 68)">
          {/* Table Header Row */}
          <rect width="870" height="32" rx="4" fill="#1e293b" />
          <text x="110" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">MODEL CANDIDATE</text>
          <text x="240" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">ARCHITECTURE</text>
          <text x="330" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">MAE (↓)</text>
          <text x="410" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">RMSE (↓)</text>
          <text x="490" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">R² (↑)</text>
          <text x="575" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">sMAPE (↓)</text>
          <text x="665" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">MEAN BIAS</text>
          <text x="790" y="21" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9" fontFamily="sans-serif">DECISION / STATUS</text>

          {/* Row 1: Production Frozen Direct Total (WINNER) */}
          <g transform="translate(0, 36)">
            <rect width="870" height="42" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <text x="20" y="19" fill="#047857" fontWeight="700" fontSize="9" fontFamily="sans-serif">Direct Total Model (Prod)</text>
            <text x="20" y="32" fill="#065f46" fontSize="7.5" fontFamily="monospace">total_xgboost_log1p</text>
            <text x="240" y="25" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">XGBoost Huber (log1p)</text>
            <text x="330" y="25" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">18.42</text>
            <text x="410" y="25" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">31.28</text>
            <text x="490" y="25" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">+0.482</text>
            <text x="575" y="25" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">41.8%</text>
            <text x="665" y="25" textAnchor="middle" fill="#047857" fontWeight="700" fontSize="8.5" fontFamily="sans-serif">-1.84</text>
            <rect x="730" y="9" width="125" height="24" rx="4" fill="#059669" />
            <text x="792.5" y="24" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="8" fontFamily="sans-serif">PROD LOCKED (ACTIVE)</text>
          </g>

          {/* Row 2: Weighted Ensemble */}
          <g transform="translate(0, 82)">
            <rect width="870" height="42" rx="4" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
            <text x="20" y="19" fill="#92400e" fontWeight="700" fontSize="9" fontFamily="sans-serif">Category Weighted Ensemble</text>
            <text x="20" y="32" fill="#78350f" fontSize="7.5" fontFamily="monospace">0.50Q + 0.15N + 0.35R</text>
            <text x="240" y="25" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">Linear Convex Ensemble</text>
            <text x="330" y="25" textAnchor="middle" fill="#b45309" fontSize="8.5" fontFamily="sans-serif">24.16</text>
            <text x="410" y="25" textAnchor="middle" fill="#b45309" fontSize="8.5" fontFamily="sans-serif">46.72</text>
            <text x="490" y="25" textAnchor="middle" fill="#b45309" fontSize="8.5" fontFamily="sans-serif">+0.218</text>
            <text x="575" y="25" textAnchor="middle" fill="#b45309" fontSize="8.5" fontFamily="sans-serif">52.4%</text>
            <text x="665" y="25" textAnchor="middle" fill="#b45309" fontSize="8.5" fontFamily="sans-serif">+7.12</text>
            <rect x="730" y="9" width="125" height="24" rx="4" fill="#f59e0b" />
            <text x="792.5" y="24" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="8" fontFamily="sans-serif">QUARANTINED (HIGH VAR)</text>
          </g>

          {/* Row 3: Candidate LGBM Huber */}
          <g transform="translate(0, 128)">
            <rect width="870" height="42" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <text x="20" y="19" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Candidate Retrained LGBM</text>
            <text x="20" y="32" fill="#64748b" fontSize="7.5" fontFamily="monospace">candidate_lgbm_huber</text>
            <text x="240" y="25" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">LightGBM L1 Huber</text>
            <text x="330" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">20.89</text>
            <text x="410" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">36.14</text>
            <text x="490" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">+0.391</text>
            <text x="575" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">45.2%</text>
            <text x="665" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">-3.15</text>
            <rect x="730" y="9" width="125" height="24" rx="4" fill="#94a3b8" />
            <text x="792.5" y="24" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="8" fontFamily="sans-serif">QUARANTINED (MAE &gt; PROD)</text>
          </g>

          {/* Row 4: Candidate CatBoost Raw */}
          <g transform="translate(0, 174)">
            <rect width="870" height="42" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <text x="20" y="19" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Candidate CatBoost</text>
            <text x="20" y="32" fill="#64748b" fontSize="7.5" fontFamily="monospace">candidate_catboost_raw</text>
            <text x="240" y="25" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">CatBoost Symmetric Trees</text>
            <text x="330" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">22.45</text>
            <text x="410" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">41.80</text>
            <text x="490" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">+0.285</text>
            <text x="575" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">48.6%</text>
            <text x="665" y="25" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="sans-serif">+4.20</text>
            <rect x="730" y="9" width="125" height="24" rx="4" fill="#94a3b8" />
            <text x="792.5" y="24" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="8" fontFamily="sans-serif">QUARANTINED (MAE &gt; PROD)</text>
          </g>

          {/* Row 5: Ridge Linear Baseline */}
          <g transform="translate(0, 220)">
            <rect width="870" height="42" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="20" y="19" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">Baseline Ridge Linear</text>
            <text x="20" y="32" fill="#7f1d1d" fontSize="7.5" fontFamily="monospace">linear_ridge_baseline</text>
            <text x="240" y="25" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="sans-serif">L2 Regularized OLS</text>
            <text x="330" y="25" textAnchor="middle" fill="#dc2626" fontSize="8.5" fontFamily="sans-serif">31.80</text>
            <text x="410" y="25" textAnchor="middle" fill="#dc2626" fontSize="8.5" fontFamily="sans-serif">58.94</text>
            <text x="490" y="25" textAnchor="middle" fill="#dc2626" fontSize="8.5" fontFamily="sans-serif">-0.124</text>
            <text x="575" y="25" textAnchor="middle" fill="#dc2626" fontSize="8.5" fontFamily="sans-serif">68.2%</text>
            <text x="665" y="25" textAnchor="middle" fill="#dc2626" fontSize="8.5" fontFamily="sans-serif">-12.40</text>
            <rect x="730" y="9" width="125" height="24" rx="4" fill="#dc2626" />
            <text x="792.5" y="24" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="8" fontFamily="sans-serif">REJECTED (NEGATIVE R²)</text>
          </g>
        </g>

        {/* Detailed Scientific Insight Panel */}
        <g transform="translate(25, 340)">
          <rect width="870" height="120" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          
          <g transform="translate(15, 15)">
            <text x="0" y="14" fill="#0f172a" fontWeight="700" fontSize="10" fontFamily="sans-serif">
              Scientific Viva Defense: Why Direct Total (18.42 MAE) Beats the Weighted Ensemble (24.16 MAE)
            </text>
            <line x1="0" y1="22" x2="840" y2="22" stroke="#e2e8f0" />
            
            <text x="0" y="40" fill="#334155" fontSize="8.5" fontFamily="sans-serif">
              1. <tspan fontWeight="700">Non-linear Aggregation vs Linear Weights:</tspan> IPO subscription categories (QIB, NII, Retail) interact non-linearly. Direct XGBoost with log1p compresses the extreme positive skew and directly models joint distribution, achieving a 23.7% lower MAE than the weighted average.
            </text>
            <text x="0" y="60" fill="#334155" fontSize="8.5" fontFamily="sans-serif">
              2. <tspan fontWeight="700">Variance Compounding in Multi-Category Sums:</tspan> Summing three separately trained sub-models compounds their individual variance: Var(0.50Q + 0.15N + 0.35R) &gt; Var(Direct Total). This resulted in an RMSE of 46.72 for Weighted vs 31.28 for Direct.
            </text>
            <text x="0" y="80" fill="#334155" fontSize="8.5" fontFamily="sans-serif">
              3. <tspan fontWeight="700">Decision Gating Outcome:</tspan> Because no retrained candidate beat total_xgboost_log1p on both MAE and RMSE across the 21 test IPOs, production models remain <tspan fontWeight="700" fill="#059669">FROZEN AND CHECKSUM LOCKED</tspan>.
            </text>
          </g>
        </g>

        {/* Footer */}
        <rect x="25" y="475" width="870" height="42" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <text x="40" y="500" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
          Gating Standard:
        </text>
        <text x="145" y="500" fill="#475569" fontSize="9" fontFamily="sans-serif">
          Retrained models must beat frozen production baseline on out-of-sample test MAE, RMSE, and R² before any promotion can occur.
        </text>
      </svg>
    </div>
  );
};
