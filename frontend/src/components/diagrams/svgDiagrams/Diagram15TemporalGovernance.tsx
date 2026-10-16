import React from 'react';

export const Diagram15TemporalGovernance: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '550px' : '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 920 540"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '700px' : '360px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="d15-hdr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="d15-green-lane" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
          <linearGradient id="d15-red-lane" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>
        </defs>

        <rect width="920" height="540" rx="12" fill="#ffffff" />

        {/* Title */}
        <rect x="20" y="15" width="880" height="38" rx="8" fill="url(#d15-hdr)" />
        <text x="460" y="39" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="13" fontFamily="sans-serif">
          TEMPORAL GOVERNANCE: 09:59:59 IST CUTOFF &amp; INFORMATION HORIZON
        </text>

        {/* Main Timeline Bar */}
        <g transform="translate(40, 75)">
          <rect width="840" height="45" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Phase 1: Pre-IPO (Allowed) */}
          <rect x="0" y="0" width="420" height="45" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
          <text x="210" y="27" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            PERMITTED EX-ANTE INFORMATION WINDOW (PRE-OPENING)
          </text>

          {/* Phase 2: Post-Opening (Forbidden) */}
          <rect x="420" y="0" width="420" height="45" rx="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="630" y="27" textAnchor="middle" fill="#991b1b" fontWeight="700" fontSize="11" fontFamily="sans-serif">
            FORBIDDEN FROM MODEL FEATURE STORE (POST-OPENING)
          </text>

          {/* Cutoff Marker Line */}
          <line x1="420" y1="-10" x2="420" y2="390" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 4" />
          <rect x="340" y="-12" width="160" height="24" rx="4" fill="#dc2626" />
          <text x="420" y="4" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
            CUTOFF: 09:59:59 IST
          </text>
        </g>

        {/* Timeline Milestones Below Bar */}
        <g transform="translate(40, 130)">
          {/* Milestone 1: RHP Filing */}
          <circle cx="60" cy="15" r="8" fill="#166534" />
          <text x="60" y="38" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">RHP Filing</text>
          <text x="60" y="50" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Day -7 to -5</text>

          {/* Milestone 2: Price Band Announced */}
          <circle cx="180" cy="15" r="8" fill="#166534" />
          <text x="180" y="38" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Price Band Set</text>
          <text x="180" y="50" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Floor &amp; Cap Cr</text>

          {/* Milestone 3: Anchor Bidding */}
          <circle cx="310" cy="15" r="8" fill="#166534" />
          <text x="310" y="38" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Anchor Bids</text>
          <text x="310" y="50" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Day -1 Closes</text>

          {/* Milestone 4: Day 1 Opening */}
          <circle cx="420" cy="15" r="10" fill="#dc2626" />
          <text x="420" y="38" textAnchor="middle" fill="#dc2626" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">10:00:00 IST</text>
          <text x="420" y="50" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Bidding Opens</text>

          {/* Milestone 5: Live Days 1 & 2 */}
          <circle cx="560" cy="15" r="8" fill="#991b1b" />
          <text x="560" y="38" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Day 1 &amp; Day 2 Bids</text>
          <text x="560" y="50" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Hourly Tallies</text>

          {/* Milestone 6: Issue Close */}
          <circle cx="700" cy="15" r="8" fill="#991b1b" />
          <text x="700" y="38" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Issue Close</text>
          <text x="700" y="50" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Day 3 17:00 IST</text>

          {/* Milestone 7: Listing Day */}
          <circle cx="800" cy="15" r="8" fill="#991b1b" />
          <text x="800" y="38" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9" fontFamily="sans-serif">Listing / Day T+3</text>
          <text x="800" y="50" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Listing Pop / Actual</text>
        </g>

        {/* Detailed Allowed vs Forbidden Box Grid */}
        <g transform="translate(40, 205)">
          {/* Allowed Section (Left) */}
          <g transform="translate(0, 0)">
            <rect width="395" height="255" rx="8" fill="url(#d15-green-lane)" stroke="#86efac" strokeWidth="1.5" />
            <rect width="395" height="26" rx="8" fill="#166534" />
            <text x="197.5" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
              PERMITTED FEATURES (100% EX-ANTE AUDITED)
            </text>

            <g transform="translate(15, 36)">
              <text x="0" y="14" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">✔ Prospectus Financial Fundamentals</text>
              <text x="12" y="28" fill="#334155" fontSize="8" fontFamily="sans-serif">Revenue, EBITDA, PAT, EPS, Net Worth, RoNW, Debt-to-Equity</text>

              <text x="0" y="50" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">✔ Issue Structure &amp; Valuation Parameters</text>
              <text x="12" y="64" fill="#334155" fontSize="8" fontFamily="sans-serif">Issue Size (Rs. Cr), Price Band, Post-issue P/E, Market Cap / Sales</text>

              <text x="0" y="86" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">✔ Pre-IPO Market &amp; Anchor Signals</text>
              <text x="12" y="100" fill="#334155" fontSize="8" fontFamily="sans-serif">Anchor investor quota subscription, Anchor institutional count</text>

              <text x="0" y="122" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">✔ Pre-Market Sentiment &amp; Grey Market Premium</text>
              <text x="12" y="136" fill="#334155" fontSize="8" fontFamily="sans-serif">Indicative GMP recorded on Day -1, FinBERT financial sentiment</text>

              <text x="0" y="158" fill="#166534" fontWeight="700" fontSize="9" fontFamily="sans-serif">✔ Macro &amp; Market Context</text>
              <text x="12" y="172" fill="#334155" fontSize="8" fontFamily="sans-serif">Nifty 50 30-day return, Sector trailing P/E, Interest rate regime</text>

              <rect x="0" y="186" width="365" height="24" rx="4" fill="#ffffff" stroke="#86efac" />
              <text x="182.5" y="202" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="700" fontFamily="sans-serif">
                Formally Frozen at 09:59:59 IST — Immutable for Inference
              </text>
            </g>
          </g>

          {/* Forbidden Section (Right) */}
          <g transform="translate(445, 0)">
            <rect width="395" height="255" rx="8" fill="url(#d15-red-lane)" stroke="#fca5a5" strokeWidth="1.5" />
            <rect width="395" height="26" rx="8" fill="#991b1b" />
            <text x="197.5" y="18" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10" fontFamily="sans-serif">
              FORBIDDEN FEATURES (ZERO DATA LEAKAGE ENFORCED)
            </text>

            <g transform="translate(15, 36)">
              <text x="0" y="14" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">❌ Live Day 1, 2, or 3 Subscription Bids</text>
              <text x="12" y="28" fill="#7f1d1d" fontSize="8" fontFamily="sans-serif">Total, QIB, NII, Retail subscription tallies while IPO is open</text>

              <text x="0" y="50" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">❌ Intra-Day Grey Market Trades During Bidding</text>
              <text x="12" y="64" fill="#7f1d1d" fontSize="8" fontFamily="sans-serif">GMP quotes updated on Day 1, Day 2, or Day 3 after 10:00 IST</text>

              <text x="0" y="86" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">❌ Final Subscription Outcome as Input</text>
              <text x="12" y="100" fill="#7f1d1d" fontSize="8" fontFamily="sans-serif">Final reported actual subscription tally (This is the target, NOT feature)</text>

              <text x="0" y="122" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">❌ Listing Day Price Action / Listing Gains</text>
              <text x="12" y="136" fill="#7f1d1d" fontSize="8" fontFamily="sans-serif">Open price, Day 1 close, listing pop percentage (Post-event)</text>

              <text x="0" y="158" fill="#991b1b" fontWeight="700" fontSize="9" fontFamily="sans-serif">❌ Post-Hoc Corrections or Ad-Hoc Multipliers</text>
              <text x="12" y="172" fill="#7f1d1d" fontSize="8" fontFamily="sans-serif">Scaling predictions to artificially match live NSE figures</text>

              <rect x="0" y="186" width="365" height="24" rx="4" fill="#ffffff" stroke="#fca5a5" />
              <text x="182.5" y="202" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="700" fontFamily="sans-serif">
                Strict CI/CD Assertion: FAIL Build if Any Post-10:00 Feature Found
              </text>
            </g>
          </g>
        </g>

        {/* Bottom Banner */}
        <rect x="40" y="475" width="840" height="45" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <text x="460" y="495" textAnchor="middle" fill="#0f172a" fontWeight="700" fontSize="9.5" fontFamily="sans-serif">
          Scientific Rationale: Ex-Ante Prediction vs Live Observation
        </text>
        <text x="460" y="510" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="sans-serif">
          Predicting subscription after bids start arriving is trivial and non-predictive. True ex-ante forecasting evaluates the issue purely before opening.
        </text>
      </svg>
    </div>
  );
};
