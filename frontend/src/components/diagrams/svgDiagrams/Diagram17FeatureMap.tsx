import React from 'react';

export const Diagram17FeatureMap: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d17-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d17-hdr)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          THE 45 CANONICAL FEATURES MAP (GROUP G ABLATION SCHEMA)
        </text>

        {/* Row 1 of Clusters (4 Clusters) */}
        {/* Cluster 1: Issue Structure (8) */}
        <g transform="translate(25, 68)">
          <rect width="205" height="195" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#2563eb" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            1. Issue Structure (8)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• issue_size_cr</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• price_band_spread_pct</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• retail_quota_pct</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• qib_quota_pct</text>
            <text x="0" y="60" fill="#1e293b" fontSize="8" fontFamily="monospace">• nii_quota_pct</text>
            <text x="0" y="72" fill="#1e293b" fontSize="8" fontFamily="monospace">• fresh_issue_ratio</text>
            <text x="0" y="84" fill="#1e293b" fontSize="8" fontFamily="monospace">• ofs_ratio</text>
            <text x="0" y="96" fill="#1e293b" fontSize="8" fontFamily="monospace">• face_value</text>
            <rect x="0" y="108" width="189" height="42" rx="3" fill="#ffffff" stroke="#bfdbfe" />
            <text x="94.5" y="122" textAnchor="middle" fill="#1d4ed8" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: SEBI RHP Section 1
            </text>
            <text x="94.5" y="136" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Quantifies size &amp; dilution burden
            </text>
          </g>
        </g>

        {/* Cluster 2: Valuation & Multiples (7) */}
        <g transform="translate(245, 68)">
          <rect width="205" height="195" rx="6" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#9333ea" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            2. Valuation Multiples (7)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• pe_ratio_post</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• pb_ratio</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• market_cap_sales_ratio</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• ev_ebitda</text>
            <text x="0" y="60" fill="#1e293b" fontSize="8" fontFamily="monospace">• eps_pre_issue</text>
            <text x="0" y="72" fill="#1e293b" fontSize="8" fontFamily="monospace">• eps_post_issue</text>
            <text x="0" y="84" fill="#1e293b" fontSize="8" fontFamily="monospace">• nav_per_share</text>
            <rect x="0" y="96" width="189" height="54" rx="3" fill="#ffffff" stroke="#e9d5ff" />
            <text x="94.5" y="112" textAnchor="middle" fill="#7e22ce" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: Prospectus Financials
            </text>
            <text x="94.5" y="126" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Post-issue pricing compared to
            </text>
            <text x="94.5" y="138" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              listed peer industry averages
            </text>
          </g>
        </g>

        {/* Cluster 3: Financial Fundamentals (6) */}
        <g transform="translate(465, 68)">
          <rect width="205" height="195" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#059669" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            3. Financial Performance (6)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• revenue_cagr_3yr</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• pat_margin_pct</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• ebitda_margin_pct</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• ronw_pct (Return on NW)</text>
            <text x="0" y="60" fill="#1e293b" fontSize="8" fontFamily="monospace">• debt_equity_ratio</text>
            <text x="0" y="72" fill="#1e293b" fontSize="8" fontFamily="monospace">• current_ratio</text>
            <rect x="0" y="86" width="189" height="64" rx="3" fill="#ffffff" stroke="#a7f3d0" />
            <text x="94.5" y="104" textAnchor="middle" fill="#047857" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: Audited 3-Yr P&amp;L
            </text>
            <text x="94.5" y="118" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Historical profitability, balance
            </text>
            <text x="94.5" y="130" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              sheet health &amp; earnings quality
            </text>
          </g>
        </g>

        {/* Cluster 4: Anchor Investors (4) */}
        <g transform="translate(685, 68)">
          <rect width="205" height="195" rx="6" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#d97706" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            4. Anchor Backing (4)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• anchor_portion_cr</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• anchor_investors_count</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• anchor_bid_ratio</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• foreign_anchor_share_pct</text>
            <rect x="0" y="66" width="189" height="84" rx="3" fill="#ffffff" stroke="#fde68a" />
            <text x="94.5" y="86" textAnchor="middle" fill="#b45309" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: Day -1 BSE/NSE Filing
            </text>
            <text x="94.5" y="100" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Institutional commitment locked
            </text>
            <text x="94.5" y="112" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              prior to opening. Strong signal
            </text>
            <text x="94.5" y="124" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              of smart-money confidence.
            </text>
          </g>
        </g>

        {/* Row 2 of Clusters (4 Clusters) */}
        {/* Cluster 5: Sentiment & GMP (5) */}
        <g transform="translate(25, 275)">
          <rect width="205" height="195" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#dc2626" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            5. Sentiment &amp; GMP (5)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• gmp_reported_day_minus_1</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• gmp_percentage_of_cap</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• finbert_sentiment_score</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• news_volume_pre_ipo</text>
            <text x="0" y="60" fill="#1e293b" fontSize="8" fontFamily="monospace">• rhp_risk_factors_count</text>
            <rect x="0" y="74" width="189" height="76" rx="3" fill="#ffffff" stroke="#fca5a5" />
            <text x="94.5" y="92" textAnchor="middle" fill="#b91c1c" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: FinBERT + IPOWatch
            </text>
            <text x="94.5" y="106" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Frozen at Day -1 23:59:59 IST.
            </text>
            <text x="94.5" y="118" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Captures grey-market buzz &amp;
            </text>
            <text x="94.5" y="130" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              financial news sentiment polarity
            </text>
          </g>
        </g>

        {/* Cluster 6: Underwriter Track Record (4) */}
        <g transform="translate(245, 275)">
          <rect width="205" height="195" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#16a34a" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            6. Lead Manager Record (4)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• lead_manager_past_avg_sub</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• lead_manager_past_success</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• underwriter_commit_pct</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• merchant_banker_tier</text>
            <rect x="0" y="66" width="189" height="84" rx="3" fill="#ffffff" stroke="#86efac" />
            <text x="94.5" y="86" textAnchor="middle" fill="#15803d" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: Historical Lead DB
            </text>
            <text x="94.5" y="100" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Merchant banker historical
            </text>
            <text x="94.5" y="112" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              reputation &amp; distribution power
            </text>
            <text x="94.5" y="124" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              across past 3 years.
            </text>
          </g>
        </g>

        {/* Cluster 7: Macro Context & Timing (4) */}
        <g transform="translate(465, 275)">
          <rect width="205" height="195" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#475569" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            7. Market Regime &amp; Macro (4)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• nifty_30d_return_pct</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• india_vix_at_open</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• market_regime_bull_flag</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• concurrent_ipos_open_count</text>
            <rect x="0" y="66" width="189" height="84" rx="3" fill="#ffffff" stroke="#94a3b8" />
            <text x="94.5" y="86" textAnchor="middle" fill="#334155" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: NSE Indices / Market
            </text>
            <text x="94.5" y="100" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              Prevailing market liquidity,
            </text>
            <text x="94.5" y="112" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              volatility regime and competing
            </text>
            <text x="94.5" y="124" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              IPOs absorbing retail cash.
            </text>
          </g>
        </g>

        {/* Cluster 8: Sector One-Hot / Embedding (7) */}
        <g transform="translate(685, 275)">
          <rect width="205" height="195" rx="6" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.2" />
          <rect width="205" height="24" rx="6" fill="#ea580c" />
          <text x="102.5" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
            8. Sector Encoding (7)
          </text>
          <g transform="translate(8, 30)">
            <text x="0" y="12" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_it_tech</text>
            <text x="0" y="24" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_healthcare_pharma</text>
            <text x="0" y="36" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_financial_services</text>
            <text x="0" y="48" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_consumer_retail</text>
            <text x="0" y="60" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_mfg_auto</text>
            <text x="0" y="72" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_energy_infra</text>
            <text x="0" y="84" fill="#1e293b" fontSize="8" fontFamily="monospace">• sector_other</text>
            <rect x="0" y="96" width="189" height="54" rx="3" fill="#ffffff" stroke="#fed7aa" />
            <text x="94.5" y="112" textAnchor="middle" fill="#c2410c" fontSize="7" fontWeight="600" fontFamily="sans-serif">
              Source: SEBI Industry Tag
            </text>
            <text x="94.5" y="126" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              One-hot categorical encoding
            </text>
            <text x="94.5" y="138" textAnchor="middle" fill="#475569" fontSize="6.5" fontFamily="sans-serif">
              adjusted for sector cyclicity
            </text>
          </g>
        </g>

        {/* Footer Summary */}
        <rect x="25" y="480" width="865" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <text x="40" y="505" fill="#0f172a" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">
          Schema Total:
        </text>
        <text x="145" y="505" fill="#334155" fontSize="10" fontFamily="sans-serif">
          8 (Structure) + 7 (Valuation) + 6 (Financials) + 4 (Anchor) + 5 (Sentiment) + 4 (Manager) + 4 (Macro) + 7 (Sector) = 45 Canonical Features
        </text>
      </svg>
    </div>
  );
};
