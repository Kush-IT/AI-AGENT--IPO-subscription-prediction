import React from 'react';
import { TrendingUp, Calendar, Clock, DollarSign, ShieldCheck, RefreshCw } from 'lucide-react';
import { MarketOverviewSummaryData } from '../../api/types';

interface MarketOverviewCardsProps {
  overview?: MarketOverviewSummaryData;
  isLoading: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const MarketOverviewCards: React.FC<MarketOverviewCardsProps> = ({
  overview,
  isLoading,
  onRefresh,
  isRefreshing = false,
}) => {
  if (isLoading || !overview) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading live market indicators...
          </div>
        ))}
      </div>
    );
  }

  const isLive = overview.data_status === 'LIVE / PERIODICALLY REFRESHED';
  const isStale = overview.data_status === 'STALE';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Live Data Freshness & Refresh Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Data Status Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: isLive ? '#ecfdf5' : isStale ? '#fffbeb' : '#fef2f2',
              color: isLive ? '#047857' : isStale ? '#b45309' : '#b91c1c',
              border: `1px solid ${isLive ? '#a7f3d0' : isStale ? '#fde68a' : '#fecaca'}`,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#10b981' : isStale ? '#f59e0b' : '#ef4444',
              }}
            />
            {overview.data_status || 'LIVE / PERIODICALLY REFRESHED'}
          </span>

          {/* Source and Schedule */}
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Source: <strong style={{ color: '#0369a1' }}>NSE Official Feed</strong> (Hourly Cycle)
          </span>

          {/* Timestamp */}
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            Last updated: <strong style={{ color: '#1e293b' }}>{overview.last_updated_ist || 'DD-MM-YYYY HH:MM IST'}</strong>
          </span>
        </div>

        {/* Refresh Data Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#334155',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
            title="Fetch latest IPO updates from official exchange feed"
          >
            <RefreshCw
              size={12}
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                color: isRefreshing ? '#0284c7' : '#64748b',
              }}
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        )}
      </div>

      {/* 4 Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Upcoming IPOs (15 Days)
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {overview.upcoming_ipos_count}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Bidding Open
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {overview.active_bidding_count}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#15803d' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Recently Closed (15 Days)
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {overview.recently_closed_count}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Avg Recent Listing Gain
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: overview.avg_recent_listing_gain_pct && overview.avg_recent_listing_gain_pct > 0 ? '#16a34a' : 'var(--text-main)' }}>
              {overview.avg_recent_listing_gain_pct !== null && overview.avg_recent_listing_gain_pct !== undefined
                ? `+${overview.avg_recent_listing_gain_pct}%`
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
        <ShieldCheck size={16} color="#0284c7" />
        <span>
          <strong>Data Integrity Notice:</strong> All forecasts are generated by frozen production XGBoost/Random Forest/LightGBM models prior to the 09:59:59 IST open cutoff. <strong>Grey Market Premium (GMP)</strong> data is unofficial, indicative, and subject to illiquidity.
        </span>
      </div>
    </div>
  );
};
