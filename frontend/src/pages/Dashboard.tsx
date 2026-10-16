import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Sliders, Activity, Network, ArrowRight } from 'lucide-react';
import { IPOForm } from '../components/IPOForm';
import { PredictionCards } from '../components/PredictionCards';
import { CategoryAssessment } from '../components/CategoryAssessment';
import { ConfidenceCard } from '../components/ConfidenceCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useIPOAnalysis } from '../hooks/useIPOAnalysis';

import { useMarketOverview, useLast15DaysIPOs, useActiveOpenIPOs, useNext15DaysIPOs } from '../hooks/useIPOIntelligence';
import { MarketOverviewCards } from '../components/intelligence/MarketOverviewCards';
import { ActiveOpenSection } from '../components/intelligence/ActiveOpenSection';
import { Next15DaysSection } from '../components/intelligence/Next15DaysSection';
import { Last15DaysSection } from '../components/intelligence/Last15DaysSection';
import { IPOIntelligenceCharts } from '../components/intelligence/IPOIntelligenceCharts';
import { IPODetailModal } from '../components/intelligence/IPODetailModal';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'scenario'>('intelligence');
  const [selectedIpoId, setSelectedIpoId] = useState<string | null>(null);

  // Scenario Analysis hook
  const { analyze, data, isLoading, isError, error, reset } = useIPOAnalysis();

  // Live Intelligence hooks
  const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview, isRefetching: isOverviewRefetching } = useMarketOverview();
  const { data: activeIPOs = [], isLoading: isActiveLoading, refetch: refetchActive, isRefetching: isActiveRefetching } = useActiveOpenIPOs();
  const { data: nextIPOs = [], isLoading: isNextLoading, refetch: refetchNext, isRefetching: isNextRefetching } = useNext15DaysIPOs();
  const { data: lastIPOs = [], isLoading: isLastLoading, refetch: refetchLast, isRefetching: isLastRefetching } = useLast15DaysIPOs();

  const handleRefreshData = async () => {
    await Promise.all([
      refetchOverview(),
      refetchActive(),
      refetchNext(),
      refetchLast(),
    ]);
  };

  const isRefreshing = isOverviewRefetching || isActiveRefetching || isNextRefetching || isLastRefetching;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Platform Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {activeTab === 'intelligence' ? 'Live IPO Intelligence Platform' : 'Custom Pre-IPO Scenario Analysis'}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            {activeTab === 'intelligence'
              ? 'Real-time Indian Mainboard IPO forecasting, indicative GMP intelligence, and 15-day retrospective performance.'
              : 'Interactive quantitative simulation and TreeSHAP attribution suite for ad-hoc filings.'}
          </p>
        </div>

        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('intelligence')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'intelligence' ? '#ffffff' : 'transparent',
              color: activeTab === 'intelligence' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'intelligence' ? 700 : 500,
              boxShadow: activeTab === 'intelligence' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Activity size={15} color={activeTab === 'intelligence' ? '#0284c7' : '#64748b'} />
            Live 15-Day Intelligence
          </button>
          <button
            onClick={() => setActiveTab('scenario')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'scenario' ? '#ffffff' : 'transparent',
              color: activeTab === 'scenario' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'scenario' ? 700 : 500,
              boxShadow: activeTab === 'scenario' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Sliders size={15} color={activeTab === 'scenario' ? '#0284c7' : '#64748b'} />
            Custom Scenario Analysis
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE IPO INTELLIGENCE PLATFORM (DEFAULT) */}
      {activeTab === 'intelligence' && (
        <div>
          {/* Market Overview Strip with Freshness & Refresh Control */}
          <MarketOverviewCards
            overview={overview}
            isLoading={isOverviewLoading}
            onRefresh={handleRefreshData}
            isRefreshing={isRefreshing}
          />

          {/* Understand the AI: Architecture & Data Flow Banner Card */}
          <div
            style={{
              margin: '1.25rem 0 2rem 0',
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              flexWrap: 'wrap',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(2, 132, 199, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  flexShrink: 0,
                }}
              >
                <Network size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff' }}>
                    Understand the AI &amp; Data Pipeline
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#6ee7b7',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    Ex-Ante Cutoff 09:59:59 IST
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  AI forecasts are generated strictly before market opening from 45 pre-IPO fundamentals. Live NSE tallies are tracked as separate observations to guarantee zero lookahead leakage.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              <Link
                to="/data-flow"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(2, 132, 199, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                View AI Data Flow
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/diagrams"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                All 18 Diagrams
              </Link>
            </div>
          </div>

          {/* Currently Open for Bidding (Active on Indian Exchanges) */}
          {(activeIPOs.length > 0 || isActiveLoading) && (
            <div style={{ marginBottom: '2rem' }}>
              <ActiveOpenSection
                ipos={activeIPOs}
                isLoading={isActiveLoading}
                onSelectIPO={(id) => setSelectedIpoId(id)}
              />
            </div>
          )}

          {/* Next 15 Days: Upcoming IPO Forecasts */}
          <div style={{ marginBottom: '2rem' }}>
            <Next15DaysSection
              ipos={nextIPOs}
              isLoading={isNextLoading}
              onSelectIPO={(id) => setSelectedIpoId(id)}
            />
          </div>

          {/* Last 15 Days: Historical Performance & Outcomes */}
          <div style={{ marginBottom: '2rem' }}>
            <Last15DaysSection
              ipos={lastIPOs}
              isLoading={isLastLoading}
              onSelectIPO={(id) => setSelectedIpoId(id)}
            />
          </div>

          {/* Charts */}
          <IPOIntelligenceCharts upcoming={nextIPOs} past={lastIPOs} active={activeIPOs} />

          {/* Deep-Dive Modal */}
          <IPODetailModal ipoId={selectedIpoId} onClose={() => setSelectedIpoId(null)} />
        </div>
      )}

      {/* VIEW 2: CUSTOM SCENARIO ANALYSIS (PRESERVED) */}
      {activeTab === 'scenario' && (
        <div className="dashboard-grid">
          {/* Left Column: Form Controls */}
          <div>
            <IPOForm onSubmit={analyze} isLoading={isLoading} />
          </div>

          {/* Right Column: Research Outputs / States */}
          <div>
            {isLoading && <LoadingState />}

            {isError && <ErrorState error={error} onRetry={reset} />}

            {!isLoading && !isError && data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Header info bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {data.ipo.company_name}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      ({data.ipo.sector} Sector • Open: {data.ipo.ipo_open_date})
                    </span>
                  </div>
                  <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                    <Sparkles size={11} /> STRICT EX-ANTE VALIDATED
                  </span>
                </div>

                {/* 1. Category Subscription Multiples */}
                <PredictionCards data={data} />

                {/* 2. Category Assessment & Confidence */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <CategoryAssessment assessment={data.category_assessment} />
                  <ConfidenceCard confidence={data.confidence} />
                </div>
              </div>
            )}

            {!isLoading && !isError && !data && (
              <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
                  <TrendingUp size={36} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Custom Pre-IPO Quantitative Simulation
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
                  Enter statutory issue terms in the left form panel or click <strong>"Load Example Fixture"</strong> to evaluate pre-IPO subscription dynamics, TreeSHAP attributions, and category rankings.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  <span>✓ 4 Frozen ML Regressors</span>
                  <span>✓ Additive TreeSHAP Explanations</span>
                  <span>✓ 09:59:59 IST Ex-Ante Cutoff</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
