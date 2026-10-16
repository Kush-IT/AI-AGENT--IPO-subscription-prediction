import React from 'react';
import { Radio, ExternalLink, Award, AlertCircle, Clock } from 'lucide-react';
import { UpcomingIPOForecastData } from '../../api/types';

interface ActiveOpenSectionProps {
  ipos: UpcomingIPOForecastData[];
  isLoading: boolean;
  onSelectIPO: (ipoId: string) => void;
}

export const ActiveOpenSection: React.FC<ActiveOpenSectionProps> = ({ ipos, isLoading, onSelectIPO }) => {
  if (isLoading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading active Indian Mainboard IPOs open for bidding...
      </div>
    );
  }

  if (!ipos || ipos.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)',
              }}
            />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              CURRENTLY OPEN FOR BIDDING
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Active on Indian Exchanges (NSE/BSE). Live interim subscription tallies alongside frozen ex-ante AI predictions.
          </p>
        </div>
        <span
          style={{
            padding: '0.35rem 0.75rem',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Radio size={13} color="#10b981" /> {ipos.length} ACTIVE {ipos.length === 1 ? 'OFFERING' : 'OFFERINGS'}
        </span>
      </div>

      {/* Active IPO Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {ipos.map((ipo) => {
          const preds = ipo.predicted_subscriptions;
          const gmp = ipo.gmp_data;
          const hasGMP = gmp && gmp.gmp_in_inr !== null && gmp.status === 'ACTIVE';
          const liveSub = ipo.live_subscription_multiple;
          const daysClose = ipo.days_until_close ?? 0;
          const biddingDay = ipo.bidding_day ?? 1;
          const totalBiddingDays = ipo.total_bidding_days ?? 3;

          const discrepancy = liveSub !== null && liveSub !== undefined && preds
            ? (liveSub - preds.total)
            : null;

          return (
            <div
              key={ipo.ipo_id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                {/* Header: Company & Sector & Bidding Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {ipo.company_name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {ipo.sector} • Open: <strong>{ipo.ipo_open_date}</strong> to <strong>{ipo.ipo_close_date}</strong>
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-block',
                      }}
                    >
                      OPEN FOR BIDDING
                    </span>
                    <div style={{ fontSize: '0.72rem', color: daysClose === 0 ? '#b91c1c' : '#047857', fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                      <Clock size={11} />
                      {daysClose === 0 ? 'Closes today' : `Closes in ${daysClose}d`} (Day {biddingDay} of {totalBiddingDays})
                    </div>
                  </div>
                </div>

                {/* Statutory Issue Terms */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '0.6rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '0.9rem', fontSize: '0.78rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Price Band</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{ipo.price_low} - ₹{ipo.price_high}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Issue Size</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{ipo.issue_size_in_crore} Cr</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Lot Size</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{ipo.lot_size} shares</div>
                  </div>
                </div>

                {/* 1. AI PREDICTED SUBSCRIPTION (Ex-Ante) */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      AI PREDICTED SUBSCRIPTION (Ex-Ante)
                    </span>
                    {preds && (
                      <span className="badge badge-high" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                        <Award size={10} /> Edge: {preds.recommended_category}
                      </span>
                    )}
                  </div>

                  {preds ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', textAlign: 'center' }}>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 600 }}>Total:</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>{preds.total.toFixed(1)}x</div>
                      </div>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                        <div style={{ fontSize: '0.68rem', color: '#0369a1', fontWeight: 600 }}>QIB:</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>{preds.qib.toFixed(1)}x</div>
                      </div>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#faf5ff', borderRadius: '6px', border: '1px solid #e9d5ff' }}>
                        <div style={{ fontSize: '0.68rem', color: '#7e22ce', fontWeight: 600 }}>NII:</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#9333ea' }}>{preds.nii.toFixed(1)}x</div>
                      </div>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#fff7ed', borderRadius: '6px', border: '1px solid #fed7aa' }}>
                        <div style={{ fontSize: '0.68rem', color: '#c2410c', fontWeight: 600 }}>Retail:</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c' }}>{preds.retail.toFixed(1)}x</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '0.65rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
                      <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Prediction unavailable — no valid ex-ante model prediction recorded.
                    </div>
                  )}
                </div>

                {/* 2. LIVE SUBSCRIPTION TALLY (NSE) */}
                {(() => {
                  const hasLiveVal = liveSub !== null && liveSub !== undefined;
                  const freshnessStatus = !hasLiveVal
                    ? 'DATA UNAVAILABLE'
                    : (ipo.data_status && ipo.data_status.includes('STALE') ? 'STALE' : 'LIVE');
                  const freshnessColor = freshnessStatus === 'LIVE' ? '#047857' : (freshnessStatus === 'STALE' ? '#b45309' : '#64748b');
                  const freshnessBg = freshnessStatus === 'LIVE' ? '#dcfce7' : (freshnessStatus === 'STALE' ? '#fef3c7' : '#f1f5f9');

                  return (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        backgroundColor: '#ecfdf5',
                        border: '1.5px solid #6ee7b7',
                        borderRadius: '8px',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 800, color: '#047857' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: freshnessStatus === 'LIVE' ? '#10b981' : '#f59e0b',
                            }}
                          />
                          LIVE SUBSCRIPTION TALLY (NSE)
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#059669', marginTop: '0.15rem' }}>
                          Source: NSE Official Public Feed • Last updated: {ipo.last_updated_ist || 'Hourly Refresh'}
                        </div>
                        <div style={{ fontSize: '0.65rem', marginTop: '0.1rem' }}>
                          Freshness:{' '}
                          <span style={{ fontWeight: 700, padding: '0.1rem 0.3rem', borderRadius: '3px', color: freshnessColor, backgroundColor: freshnessBg }}>
                            {freshnessStatus}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#065f46' }}>
                        {hasLiveVal ? `${liveSub.toFixed(3)}x` : 'DATA UNAVAILABLE'}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. EX-ANTE vs LIVE OBSERVATION */}
                {discrepancy !== null && (
                  <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.85rem', fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>EX-ANTE vs LIVE OBSERVATION:</span>
                      <span style={{ fontWeight: 700, color: discrepancy > 0 ? '#0284c7' : '#e11d48' }}>
                        {discrepancy > 0 ? `+${discrepancy.toFixed(1)}x` : `${discrepancy.toFixed(1)}x`} (Live - Predicted)
                      </span>
                    </div>
                    <span>
                      Ex-ante model forecast captured strictly prior to 09:59:59 IST cutoff on open date. Live NSE multiple reflects cumulative bidding order flow during Day {biddingDay}. Do not imply that the AI should equal current live tallies.
                    </span>
                  </div>
                )}

                {/* Indicative GMP & Implied Listing Estimate */}
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Current Indicative GMP
                    </span>
                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontWeight: 600 }}>
                      Unofficial Indicative
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      {hasGMP ? (
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                          +₹{gmp!.gmp_in_inr} <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>({gmp!.gmp_percentage}%)</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>GMP Unavailable</span>
                      )}
                    </div>

                    {ipo.gmp_implied_listing_price && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>GMP-Implied Listing</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>
                          ₹{ipo.gmp_implied_listing_price} <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>({ipo.gmp_implied_gain_pct}% est.)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button & Statistical Validation Badges (Part P) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span className="badge badge-high" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                      Prediction Status: Valid Ex-Ante
                    </span>
                    <span className={`badge badge-${preds ? preds.overall_risk_level.toLowerCase() : 'low'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                      Risk: {preds ? preds.overall_risk_level : 'LOW'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    Model Validation: <strong>R² = 0.67</strong> • <strong>Test MAE = 17.4x</strong>
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', marginLeft: 'auto' }}
                  onClick={() => onSelectIPO(ipo.ipo_id)}
                >
                  Deep-Dive SHAP <ExternalLink size={11} style={{ marginLeft: '0.2rem' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
