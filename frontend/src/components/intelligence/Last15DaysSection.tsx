import React from 'react';
import { CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { PastIPOResultData } from '../../api/types';

interface Last15DaysSectionProps {
  ipos: PastIPOResultData[];
  isLoading: boolean;
  onSelectIPO: (ipoId: string) => void;
}

export const Last15DaysSection: React.FC<Last15DaysSectionProps> = ({ ipos, isLoading, onSelectIPO }) => {
  if (isLoading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Retrieving trailing 15-day closed IPO outcomes...
      </div>
    );
  }

  if (!ipos || ipos.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Info size={28} style={{ margin: '0 auto 0.5rem auto', color: '#0284c7' }} />
        <p>No Indian Mainboard IPOs closed or listed in the trailing 15-day window.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Last 15 Days: Historical Outcomes & Error Audit
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Official exchange subscription tallies, actual listing prices, and ex-ante forecast accuracy.
          </p>
        </div>
        <span className="badge badge-low" style={{ fontSize: '0.72rem' }}>
          <CheckCircle2 size={12} /> {ipos.length} COMPLETED ISSUES
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {ipos.map((ipo) => {
          const act = ipo.actual_subscriptions;
          const pred = ipo.predicted_subscriptions;
          const list = ipo.listing_metrics;
          const gmp = ipo.closing_gmp;

          return (
            <div
              key={ipo.ipo_id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
              }}
            >
              <div>
                {/* Header: Company, Close Date, Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {ipo.company_name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {ipo.sector} • Closed: <strong>{ipo.ipo_close_date}</strong> ({ipo.days_since_close}d ago)
                    </span>
                  </div>
                  <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                    {ipo.status}
                  </span>
                </div>

                {/* Statutory Issue Terms */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '0.6rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '0.9rem', fontSize: '0.78rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Issue Price</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{ipo.price_high}</div>
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

                {/* Subscriptions: Actual vs Ex-Ante Model Evaluation */}
                {act && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Subscription Outcome & Model Evaluation
                      </span>
                      {ipo.has_ex_ante_prediction && pred ? (
                        <span className="badge badge-high" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                          APE: {ipo.prediction_error_ape_pct}% | AE: {ipo.prediction_error_ae}x
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          No Ex-Ante Model Log
                        </span>
                      )}
                    </div>

                    {/* Ex-Ante vs Final Actual Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600 }}>Total</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{act.total.toFixed(1)}x</div>
                        {pred && <div style={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: 600 }}>Ex-Ante: {pred.total.toFixed(1)}x</div>}
                      </div>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600 }}>QIB</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{act.qib.toFixed(1)}x</div>
                        {pred && <div style={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: 600 }}>Ex-Ante: {pred.qib.toFixed(1)}x</div>}
                      </div>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600 }}>NII</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{act.nii.toFixed(1)}x</div>
                        {pred && <div style={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: 600 }}>Ex-Ante: {pred.nii.toFixed(1)}x</div>}
                      </div>
                      <div style={{ padding: '0.5rem 0.2rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600 }}>Retail</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{act.retail.toFixed(1)}x</div>
                        {pred && <div style={{ fontSize: '0.65rem', color: '#0369a1', fontWeight: 600 }}>Ex-Ante: {pred.retail.toFixed(1)}x</div>}
                      </div>
                    </div>

                    {/* Explicit Error Audit Metrics */}
                    {pred && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', padding: '0.4rem 0.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '0.7rem', textAlign: 'center' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>ERROR (Pred - Act):</span>{' '}
                          <strong style={{ color: (pred.total - act.total) >= 0 ? '#15803d' : '#b91c1c' }}>
                            {(pred.total - act.total) >= 0 ? `+${(pred.total - act.total).toFixed(1)}x` : `${(pred.total - act.total).toFixed(1)}x`}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>ABSOLUTE ERROR:</span>{' '}
                          <strong style={{ color: '#334155' }}>
                            {Math.abs(pred.total - act.total).toFixed(1)}x
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>PERCENT ERROR:</span>{' '}
                          <strong style={{ color: '#334155' }}>
                            {act.total > 0 ? `${((Math.abs(pred.total - act.total) / act.total) * 100).toFixed(1)}%` : 'N/A'}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actual Listing Performance & GMP */}
                {list && (
                  <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                        Listing Day Performance
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#15803d' }}>
                        {list.listing_date ? `Listed: ${list.listing_date}` : 'Listing Pending'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#475569' }}>Actual Listing Price</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                          {list.actual_listing_price ? `₹${list.actual_listing_price}` : 'Awaiting listing'}
                        </div>
                      </div>

                      {list.listing_gain_pct !== null && list.listing_gain_pct !== undefined && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.68rem', color: '#475569' }}>Listing Gain</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: list.listing_gain_pct >= 0 ? '#16a34a' : '#dc2626' }}>
                            {list.listing_gain_pct >= 0 ? `+${list.listing_gain_pct}%` : `${list.listing_gain_pct}%`}
                          </div>
                        </div>
                      )}
                    </div>

                    {gmp && gmp.gmp_in_inr !== null && (
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.3rem' }}>
                        Closing GMP: +₹{gmp.gmp_in_inr} ({gmp.gmp_percentage}%) • Implied was ₹{list.gmp_implied_listing_price}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Provenance Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={13} color="#16a34a" /> {ipo.outcome_source.split(' ')[0]} Verified
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
                  onClick={() => onSelectIPO(ipo.ipo_id)}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
