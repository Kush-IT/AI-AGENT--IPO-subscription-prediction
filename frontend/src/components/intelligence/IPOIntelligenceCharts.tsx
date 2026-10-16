import React, { useState } from 'react';
import { BarChart3, TrendingUp, Info, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { UpcomingIPOForecastData, PastIPOResultData } from '../../api/types';

interface IPOIntelligenceChartsProps {
  upcoming: UpcomingIPOForecastData[];
  past: PastIPOResultData[];
  active?: UpcomingIPOForecastData[];
}

export const IPOIntelligenceCharts: React.FC<IPOIntelligenceChartsProps> = ({ upcoming = [], past = [], active = [] }) => {
  // Combine active and upcoming for comprehensive pipeline visibility
  const allPipeline = [...active, ...upcoming];

  // If past outcomes exist, default to 'past'; otherwise default to 'pipeline'
  const [viewMode, setViewMode] = useState<'past' | 'pipeline'>(() => {
    return past.length > 0 ? 'past' : 'pipeline';
  });

  const hasData = past.length > 0 || allPipeline.length > 0;

  if (!hasData) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
        <Info size={28} style={{ margin: '0 auto 0.5rem auto', color: '#0284c7' }} />
        <p style={{ margin: 0, fontWeight: 600 }}>Market Pipeline Idle</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>No offerings currently tracked within the trailing or upcoming 15-day window.</p>
      </div>
    );
  }

  const isShowingPast = viewMode === 'past' && past.length > 0;
  const displayPast = past.slice(0, 5);
  const displayPipeline = allPipeline.slice(0, 5);

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Scope Switcher Pill Bar (if both historical and pipeline offerings exist) */}
      {past.length > 0 && allPipeline.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Intelligence Visualizations</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              ({past.length} Closed Outcomes • {allPipeline.length} Active &amp; Upcoming)
            </span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              padding: '0.2rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle, #e2e8f0)',
            }}
          >
            <button
              onClick={() => setViewMode('past')}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isShowingPast ? '#ffffff' : 'transparent',
                color: isShowingPast ? '#0284c7' : '#64748b',
                boxShadow: isShowingPast ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Historical Outcomes ({past.length})
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: !isShowingPast ? '#ffffff' : 'transparent',
                color: !isShowingPast ? '#0284c7' : '#64748b',
                boxShadow: !isShowingPast ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Upcoming Pipeline ({allPipeline.length})
            </button>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* -------------------------------------------------------------
            CHART 1: SUBSCRIPTION DEMAND DISTRIBUTION
           ------------------------------------------------------------- */}
        <div className="card" style={{ padding: '1.35rem', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <BarChart3 size={17} color="#0284c7" /> Subscription Demand Distribution
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                {isShowingPast
                  ? 'Official Exchange Actual Tallies vs Ex-Ante Model Predictions'
                  : 'Ex-Ante Model Forecasted Subscription Multiples'}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: isShowingPast ? '#ecfdf5' : '#f0f9ff',
                color: isShowingPast ? '#065f46' : '#0369a1',
                border: isShowingPast ? '1px solid #a7f3d0' : '1px solid #bae6fd',
              }}
            >
              {isShowingPast ? 'OFFICIAL SETTLEMENT' : 'EX-ANTE PREDICTIONS'}
            </span>
          </div>

          {/* Render Historical Outcomes Demand */}
          {isShowingPast && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {displayPast.map((p) => {
                const actTotal = p.actual_subscriptions?.total ?? 0;
                const predTotal = p.predicted_subscriptions?.total ?? 0;
                const maxVal = Math.max(140, actTotal, predTotal);
                const actWidth = Math.min(100, Math.max(6, (actTotal / maxVal) * 100));
                const predWidth = predTotal > 0 ? Math.min(100, Math.max(6, (predTotal / maxVal) * 100)) : 0;
                const errorDelta = p.prediction_error_ae;

                return (
                  <div key={p.ipo_id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{p.company_name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({p.sector})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: '#0284c7' }}>{actTotal.toFixed(1)}x Actual</span>
                        {predTotal > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600 }}>
                            ({predTotal.toFixed(1)}x Pred)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dual Comparative Progress Bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {/* Bar 1: Actual Subscription Multiple */}
                      <div style={{ height: '9px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${actWidth}%`,
                            height: '100%',
                            backgroundColor: actTotal > 50 ? '#0284c7' : '#38bdf8',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease',
                          }}
                          title={`Actual: ${actTotal.toFixed(2)}x`}
                        />
                      </div>
                      {/* Bar 2: Predicted Ex-Ante Multiple */}
                      {predTotal > 0 && (
                        <div style={{ height: '5px', backgroundColor: '#f8fafc', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${predWidth}%`,
                              height: '100%',
                              backgroundColor: '#818cf8',
                              borderRadius: '4px',
                              opacity: 0.85,
                            }}
                            title={`Ex-Ante Predicted: ${predTotal.toFixed(2)}x`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer: Error Delta & Strongest Category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>Closed {p.ipo_close_date} ({p.days_since_close}d ago)</span>
                      {errorDelta !== null && errorDelta !== undefined && (
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: errorDelta < 10 ? '#059669' : '#d97706' }}>
                          Δ {errorDelta.toFixed(2)}x {errorDelta < 5 ? '• High Ex-Ante Calibration' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle, #f1f5f9)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#0284c7', display: 'inline-block' }} />
                  <span>Actual NSE Multiple</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#818cf8', display: 'inline-block' }} />
                  <span>Ex-Ante AI Prediction</span>
                </div>
              </div>
            </div>
          )}

          {/* Render Upcoming Pipeline Demand */}
          {!isShowingPast && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayPipeline.map((item) => {
                const pred = item.predicted_subscriptions?.total ?? 0;
                const recCat = item.predicted_subscriptions?.recommended_category ?? 'QIB';
                const widthPct = Math.min(100, Math.max(8, (pred / 40) * 100));

                return (
                  <div key={item.ipo_id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{item.company_name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({item.sector})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: '#0284c7' }}>{pred.toFixed(1)}x Forecast</span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            fontFamily: 'monospace',
                          }}
                        >
                          {recCat} EDGE
                        </span>
                      </div>
                    </div>

                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${widthPct}%`, height: '100%', backgroundColor: '#0284c7', borderRadius: '4px' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>Opens {item.ipo_open_date} ({item.days_until_open}d remaining)</span>
                      <span>₹{item.price_high} • ₹{item.issue_size_in_crore} Cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------
            CHART 2: LISTING PERFORMANCE & PREMIUM
           ------------------------------------------------------------- */}
        <div className="card" style={{ padding: '1.35rem', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <TrendingUp size={17} color="#16a34a" /> Listing Performance &amp; Premium
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                {isShowingPast
                  ? 'Official Listing Gains & Closing Indicative GMP Premiums'
                  : 'Pre-Listing Grey Market Premium & Implied Listing Gains'}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
              }}
            >
              PREMIUM INDICATORS
            </span>
          </div>

          {/* Render Historical Outcomes Listing Gains */}
          {isShowingPast && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {displayPast.map((p) => {
                const gain = p.listing_metrics?.listing_gain_pct ?? p.closing_gmp?.gmp_percentage ?? null;
                const isPos = gain !== null && gain >= 0;
                const widthPct = gain !== null ? Math.min(100, Math.max(12, Math.abs(gain))) : 8;
                const priceHigh = p.price_high;
                const gmpInr = p.closing_gmp?.gmp_in_inr ?? (gain !== null ? roundPrice(priceHigh * (gain / 100)) : 0);
                const impliedPrice = priceHigh + gmpInr;

                return (
                  <div key={p.ipo_id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{p.company_name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Issue: ₹{priceHigh}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: isPos ? '#16a34a' : '#dc2626',
                          }}
                        >
                          {gain !== null ? `${isPos ? '+' : ''}${gain.toFixed(1)}%` : 'N/A'}
                        </span>
                        {gain !== null && isPos && <ArrowUpRight size={13} color="#16a34a" />}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${widthPct}%`,
                          height: '100%',
                          backgroundColor: isPos ? '#16a34a' : '#dc2626',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>

                    {/* Price Bridge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>
                        Implied Listing: <strong style={{ color: 'var(--text-main)' }}>₹{impliedPrice.toFixed(1)}</strong>
                      </span>
                      <span style={{ fontFamily: 'monospace' }}>
                        GMP: {gmpInr >= 0 ? `+₹${gmpInr.toFixed(1)}` : `-₹${Math.abs(gmpInr).toFixed(1)}`}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle, #f1f5f9)',
                }}
              >
                <ShieldCheck size={12} color="#059669" />
                <span>Verified against NSE basis of allotment &amp; indicative closing dealer polls.</span>
              </div>
            </div>
          )}

          {/* Render Upcoming Pipeline Listing Premiums */}
          {!isShowingPast && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayPipeline.map((item) => {
                const gmpPct = item.gmp_data?.gmp_percentage ?? item.gmp_implied_gain_pct ?? null;
                const isPos = gmpPct !== null && gmpPct >= 0;
                const widthPct = gmpPct !== null ? Math.min(100, Math.max(12, Math.abs(gmpPct))) : 8;
                const priceHigh = item.price_high;
                const gmpInr = item.gmp_data?.gmp_in_inr ?? 0;
                const impliedPrice = priceHigh + gmpInr;

                return (
                  <div key={item.ipo_id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{item.company_name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Issue: ₹{priceHigh}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: isPos ? '#16a34a' : '#dc2626',
                          }}
                        >
                          {gmpPct !== null ? `${isPos ? '+' : ''}${gmpPct.toFixed(1)}%` : 'Indicative Pending'}
                        </span>
                        {gmpPct !== null && isPos && <ArrowUpRight size={13} color="#16a34a" />}
                      </div>
                    </div>

                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${widthPct}%`,
                          height: '100%',
                          backgroundColor: isPos ? '#16a34a' : '#94a3b8',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>
                        Implied Listing Price: <strong style={{ color: 'var(--text-main)' }}>₹{impliedPrice.toFixed(1)}</strong>
                      </span>
                      <span>GMP: ₹{gmpInr.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle, #f1f5f9)',
                }}
              >
                <Info size={12} color="#0284c7" />
                <span>Indicative GMP is non-exchange sentiment data captured prior to 09:59:59 IST.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function roundPrice(val: number): number {
  return Math.round(val * 10) / 10;
}
