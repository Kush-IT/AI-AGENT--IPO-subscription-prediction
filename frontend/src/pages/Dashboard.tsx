import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { IPOForm } from '../components/IPOForm';
import { PredictionCards } from '../components/PredictionCards';
import { CategoryAssessment } from '../components/CategoryAssessment';
import { ConfidenceCard } from '../components/ConfidenceCard';
import { SHAPExplanation } from '../components/SHAPExplanation';
import { RiskAssessment } from '../components/RiskAssessment';
import { DataQuality } from '../components/DataQuality';
import { TemporalValidation } from '../components/TemporalValidation';
import { ModelInformation } from '../components/ModelInformation';
import { ProvenanceTable } from '../components/ProvenanceTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useIPOAnalysis } from '../hooks/useIPOAnalysis';

export const Dashboard: React.FC = () => {
  const { analyze, data, isLoading, isError, error, reset } = useIPOAnalysis();

  return (
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

            {/* 3. SHAP Additive Feature Attributions */}
            <SHAPExplanation
              topPositive={data.top_positive_factors}
              topNegative={data.top_negative_factors}
              groupedDrivers={data.grouped_driver_impacts}
            />

            {/* 4. Multi-Dimensional Risk Audit */}
            <RiskAssessment riskData={data.risk_assessment} />

            {/* 5. Data Quality & Temporal Compliance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <DataQuality dataQuality={data.data_quality} />
              <TemporalValidation
                validation={data.temporal_validation}
                openDate={data.ipo.ipo_open_date}
              />
            </div>

            {/* 6. Provenance Audit Accordion */}
            <ProvenanceTable
              sources={data.sources}
              featureProvenance={data.feature_provenance}
            />

            {/* 7. Frozen ML Model Registry Specs */}
            <ModelInformation modelInfo={data.model_information} />
          </div>
        )}

        {!isLoading && !isError && !data && (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', marginBottom: '1rem' }}>
              <TrendingUp size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Pre-IPO Quantitative Research Suite
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
  );
};
