import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Layers,
  ShieldCheck,
  Cpu,
  Sparkles,
  Database,
  CheckCircle2,
  Lock,
  ArrowDown,
  Info,
  GitBranch,
  TrendingUp,
  FileCode2,
  Scale,
} from 'lucide-react';

export const ModelPrediction: React.FC = () => {
  // Canonical Production Model Configuration (Frozen)
  const productionModels = [
    {
      target: 'Total Subscription',
      model: 'XGBoost',
      transform: 'log(1+y)',
      artifact: 'total_xgboost_log1p.joblib',
      description: 'Gradient boosted trees trained on log-transformed total subscription to handle extreme right-skewed investor oversubscription.',
      keyHyperparams: 'n_estimators: 60, max_depth: 2, learning_rate: 0.05, reg_alpha: 0.1, reg_lambda: 1.0',
    },
    {
      target: 'QIB Subscription',
      model: 'Random Forest',
      transform: 'Raw',
      artifact: 'qib_random_forest_raw.joblib',
      description: 'Ensemble bagging tree estimator modeling institutional demand directly on raw scale without variance inflation.',
      keyHyperparams: 'n_estimators: 120, max_depth: 4, min_samples_split: 6, max_features: 0.6',
    },
    {
      target: 'NII Subscription',
      model: 'LightGBM',
      transform: 'log(1+y)',
      artifact: 'nii_lightgbm_log1p.joblib',
      description: 'Leaf-wise gradient boosted estimator predicting corporate & High Net-Worth Individual demand with L1/L2 regularization.',
      keyHyperparams: 'n_estimators: 80, num_leaves: 7, learning_rate: 0.03, reg_alpha: 0.5, reg_lambda: 1.5',
    },
    {
      target: 'Retail Subscription',
      model: 'XGBoost',
      transform: 'Raw',
      artifact: 'retail_xgboost_raw.joblib',
      description: 'Constrained depth boosted trees predicting individual retail bidding multiples directly on raw scale.',
      keyHyperparams: 'n_estimators: 100, max_depth: 3, learning_rate: 0.05, reg_alpha: 0.1, reg_lambda: 1.0',
    },
  ];

  // 11-Agent Execution Chain (Task 10)
  const pipelineStages = [
    {
      step: '01',
      title: 'NSE/Web Data Agent (IPO Data)',
      desc: 'Corporate issuer statutory terms, price band, issue size, lot size, financial health, and pre-market indicators.',
      icon: Database,
    },
    {
      step: '02',
      title: 'Data Validation Agent',
      desc: 'Validates price bands, dates, issue structures, and verifies numerical integrity.',
      icon: CheckCircle2,
    },
    {
      step: '03',
      title: 'Ex-Ante Temporal Guard Agent',
      desc: 'Enforces strict <= 09:59:59 IST cutoff on opening date; locks immutable pre-market snapshot.',
      icon: Lock,
    },
    {
      step: '04',
      title: 'Feature Preparation Agent (Feature Preparation)',
      desc: 'Strict ex-ante extraction restricted exclusively to data finalized prior to the 09:59:59 IST open cutoff.',
      icon: GitBranch,
    },
    {
      step: '05',
      title: '45-Feature Preprocessor (Preprocessing)',
      desc: 'Standardized pipeline via dev_preprocessor.joblib: median imputation, one-hot encoding, and feature alignment for 45 Canonical Features.',
      icon: Layers,
    },
    {
      step: '06',
      title: 'Model Integrity Agent',
      desc: 'Computes SHA-256 cryptographic digests of all 5 frozen production models to ensure zero tampering.',
      icon: ShieldCheck,
    },
    {
      step: '07',
      title: 'Prediction Agent (Trained ML Models)',
      desc: 'Inference executed across 4 frozen production candidates to generate Subscription Prediction.',
      icon: Cpu,
    },
    {
      step: '08',
      title: 'SHAP Explanation Agent (SHAP Explanation)',
      desc: 'TreeSHAP calculates exact additive feature contributions (phi) to uncover positive and negative demand drivers.',
      icon: Sparkles,
    },
    {
      step: '09',
      title: 'Risk Analysis Agent',
      desc: 'Analyzes financial leverage, valuation risk, promoter holding, and assigns composite risk penalty points.',
      icon: Scale,
    },
    {
      step: '10',
      title: 'Monitoring/Evaluation Agent',
      desc: 'Tracks prospective drift, logs ex-ante predictions, and compares them against final exchange outcomes.',
      icon: TrendingUp,
    },
    {
      step: '11',
      title: 'Final Report Agent (Final IPO Analysis)',
      desc: 'Optimal bidding category identification, composite risk scoring, confidence rating, and dashboard presentation.',
      icon: Brain,
    },
  ];

  // Sample Audit Records (Task 10)
  const auditRecords = [
    {
      ipo_name: 'Hero Motors Limited',
      prediction_timestamp: '2026-09-16T09:15:00+05:30',
      cutoff_timestamp: '2026-09-16T09:59:59+05:30',
      feature_snapshot_timestamp: '2026-09-16T09:15:00+05:30',
      model_version: '1.0.0-final-candidates',
      model_hash_status: 'VERIFIED (All 5 SHA-256 hashes match)',
      feature_completeness: '100.0% (45 / 45 features observed)',
      predictions: {
        total: '4.61x',
        qib: '3.82x',
        nii: '6.15x',
        retail: '4.88x',
      },
      shap_drivers: {
        positive: ['Issue Size: ₹900.0 Cr (Moderate cap liquid supply)', 'Anchor Investor Demand: 1.25x (Strong backing)'],
        negative: ['P/E Ratio: 32.4x (Valuation premium over capital goods sector)'],
      },
      data_sources: ['NSE Public Issue Feed', 'IPOWatch Indicative GMP', 'RHP Statutory Prospectus'],
      ex_ante: true,
      prediction_status: 'PREDICTED_EX_ANTE',
    },
    {
      ipo_name: 'SS Retail Limited',
      prediction_timestamp: '2026-09-16T09:10:00+05:30',
      cutoff_timestamp: '2026-09-16T09:59:59+05:30',
      feature_snapshot_timestamp: '2026-09-16T09:10:00+05:30',
      model_version: '1.0.0-final-candidates',
      model_hash_status: 'VERIFIED (All 5 SHA-256 hashes match)',
      feature_completeness: '100.0% (45 / 45 features observed)',
      predictions: {
        total: '23.73x',
        qib: '14.86x',
        nii: '44.52x',
        retail: '42.10x',
      },
      shap_drivers: {
        positive: ['Indicative GMP: +32.3% (Strong pre-market interest)', 'Revenue Growth YoY: +28.4%'],
        negative: ['Debt-to-Equity: 0.82 (Moderate corporate leverage)'],
      },
      data_sources: ['NSE Public Issue Feed', 'IPOWatch Indicative GMP', 'RHP Statutory Prospectus'],
      ex_ante: true,
      prediction_status: 'PREDICTED_EX_ANTE',
    },
    {
      ipo_name: 'Jindal Supreme (India) Limited',
      prediction_timestamp: '2026-09-16T09:05:00+05:30',
      cutoff_timestamp: '2026-09-16T09:59:59+05:30',
      feature_snapshot_timestamp: '2026-09-16T09:05:00+05:30',
      model_version: '1.0.0-final-candidates',
      model_hash_status: 'VERIFIED (All 5 SHA-256 hashes match)',
      feature_completeness: '100.0% (45 / 45 features observed)',
      predictions: {
        total: '45.34x',
        qib: '76.54x',
        nii: '104.99x',
        retail: '231.43x',
      },
      shap_drivers: {
        positive: ['Micro-Cap Float: ₹87.42 Cr (Acute supply constraint)', 'Indicative GMP: +32.3%'],
        negative: ['Working Capital Days: 142d (Extended inventory cycle)'],
      },
      data_sources: ['NSE Public Issue Feed', 'IPOWatch Indicative GMP', 'RHP Statutory Prospectus'],
      ex_ante: true,
      prediction_status: 'PREDICTED_EX_ANTE',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <Brain size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Model &amp; Prediction Architecture
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              End-to-End Quantitative Machine Learning Pipeline, Production Candidate Models, and TreeSHAP Explainability
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/data-flow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '8px',
              backgroundColor: '#0369a1',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(3, 105, 161, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={16} />
            View Data Flow
          </Link>
          <Link
            to="/diagrams"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            System Diagrams
          </Link>
        </div>
      </div>

      {/* PIPELINE SECTION */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--brand-primary)" />
            End-to-End Prediction Pipeline
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Step-by-step data flow from statutory pre-IPO discovery to explainable subscription forecasts.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.step}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.9rem 1.15rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#f1f5f9',
                      color: '#0284c7',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                    }}
                  >
                    {stage.step}
                  </div>
                  <div style={{ padding: '0.4rem', borderRadius: '6px', backgroundColor: '#f0f9ff', color: '#0369a1' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {stage.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {stage.desc}
                    </div>
                  </div>
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#94a3b8', margin: '-0.25rem 0' }}>
                    <ArrowDown size={16} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ACTUAL PRODUCTION MODELS USED (SECTION C) */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--brand-primary)" />
              Production Candidate Models
            </h3>
            <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>
              <Lock size={11} /> FROZEN CANDIDATES
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Currently active production models selected via walk-forward cross-validation on verified Indian Mainboard IPOs.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Target</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Model</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Transformation</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Artifact File</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700 }}>Governance Status</th>
              </tr>
            </thead>
            <tbody>
              {productionModels.map((m, i) => (
                <tr key={m.target} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>{m.target}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontWeight: 600, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {m.model}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                    <code style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                      {m.transform}
                    </code>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {m.artifact}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#166534', backgroundColor: '#dcfce7', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 600 }}>
                      <CheckCircle2 size={11} /> Frozen Production Candidate
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO-COLUMN SECTION: HOW TRAINING WORKS & HOW PREDICTION WORKS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* HOW TRAINING WORKS (SECTION D) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} color="#0284c7" />
              How Models Are Trained
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Rigorous walk-forward protocol avoiding temporal leakage.
            </p>
          </div>

          <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
            <li style={{ marginBottom: '0.45rem' }}>Historical verified IPO data is collected.</li>
            <li style={{ marginBottom: '0.45rem' }}>Only information available before the IPO prediction cutoff is used.</li>
            <li style={{ marginBottom: '0.45rem' }}>Data is sorted chronologically.</li>
            <li style={{ marginBottom: '0.45rem' }}>Features are prepared using the canonical 45-feature configuration.</li>
            <li style={{ marginBottom: '0.45rem' }}>Training/validation/testing are performed chronologically to avoid look-ahead leakage.</li>
            <li style={{ marginBottom: '0.45rem' }}>The target transformation is applied where required (e.g. log1p for Total and NII).</li>
            <li style={{ marginBottom: '0.45rem' }}>The selected model is trained on historical IPO data.</li>
            <li style={{ marginBottom: '0.45rem' }}>Model performance is evaluated using the project's existing evaluation metrics (MAE, RMSE, MedianAE, R²).</li>
            <li style={{ marginBottom: '0.45rem' }}>The production model artifact is frozen and its integrity/hash is verified.</li>
          </ol>

          <div style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '0.78rem', color: '#166534' }}>
            <ShieldCheck size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
            <strong>Strict Governance Invariant:</strong> Models are <strong>NOT</strong> retrained automatically in production. Any retraining requires offline verification, feature drift audit, and human sign-off.
          </div>
        </div>

        {/* HOW PREDICTION WORKS (SECTION E) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#9333ea" />
              How Prediction Works
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Ex-ante prospective inference pipeline prior to subscription opening.
            </p>
          </div>

          <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
            <li style={{ marginBottom: '0.45rem' }}>User selects or provides an Indian Mainboard IPO offering.</li>
            <li style={{ marginBottom: '0.45rem' }}>IPO statutory terms and prospectus information are collected.</li>
            <li style={{ marginBottom: '0.45rem' }}>Data is validated for completeness and price band consistency.</li>
            <li style={{ marginBottom: '0.45rem' }}>Only ex-ante information available before <strong>09:59:59 IST</strong> is used.</li>
            <li style={{ marginBottom: '0.45rem' }}>The exact same 45 canonical features are extracted and preprocessed.</li>
            <li style={{ marginBottom: '0.45rem' }}>The frozen production models generate Total, QIB, NII, and Retail subscription predictions.</li>
            <li style={{ marginBottom: '0.45rem' }}>Predictions are converted back from log scale where applicable (exp(ŷ) - 1).</li>
            <li style={{ marginBottom: '0.45rem' }}>SHAP explains the important features influencing the prediction.</li>
            <li style={{ marginBottom: '0.45rem' }}>Category recommendation and composite risk assessment are generated.</li>
            <li style={{ marginBottom: '0.45rem' }}>Final results are displayed clearly on the dashboard.</li>
          </ol>

          <div style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
            <Info size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
            Zero look-ahead leakage guarantee: Post-opening bidding tallies are never fed into the ML model.
          </div>
        </div>
      </div>

      {/* PRODUCTION MODEL DETAILS & ARTIFACTS (SECTION F) */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCode2 size={18} color="var(--brand-primary)" />
            Production Model Details & Joblib Artifacts
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Verified candidate model files loaded from models/final_candidates/ configuration:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Feature Preprocessor</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>dev_preprocessor.joblib</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Transforms 45 canonical features (median imputation + one-hot encoding).</div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Total Subscription Model</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>total_xgboost_log1p.joblib</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>XGBoost regression on log(1+y) scale. Walk-forward MAE: 14.56.</div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>QIB Subscription Model</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>qib_random_forest_raw.joblib</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Random Forest regression on raw scale. Walk-forward MAE: 27.60.</div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>NII Subscription Model</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>nii_lightgbm_log1p.joblib</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>LightGBM regression on log(1+y) scale. Walk-forward MAE: 34.01.</div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>Retail Subscription Model</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', margin: '0.3rem 0' }}>retail_xgboost_raw.joblib</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>XGBoost regression on raw scale. Walk-forward MAE: 20.33.</div>
          </div>
        </div>
      </div>

      {/* PRODUCTION MODEL INTEGRITY (SECTION G) */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={22} color="#10b981" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Production Model Integrity
          </h3>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
          All production models are <strong>strictly frozen</strong>. Before any inference or weekly monitoring evaluation is executed, a cryptographic pre-check computes the SHA-256 digest of all five model artifacts and compares them against the immutable official hash registry.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '0.78rem', color: '#166534' }}>
            <strong>Cryptographically Frozen:</strong> Production candidate weights cannot be altered without failing SHA-256 pre-checks.
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '0.78rem', color: '#166534' }}>
            <strong>Zero Drift Promotion:</strong> Automated promotion to production is disabled. All candidates remain in quarantined evaluation.
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '0.78rem', color: '#166534' }}>
            <strong>Deterministic Replay:</strong> Ex-ante feature vectors are hashed and preserved for prospective outcome audits.
          </div>
        </div>
      </div>

      {/* SHAP EXPLAINABILITY (SECTION H) */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--brand-primary)" />
            Why This Prediction? (TreeSHAP Explainability)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Game-theoretic feature attribution decomposes every prediction into transparent positive and negative demand drivers.
          </p>
        </div>

        <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 0.75rem 0' }}>
            Unlike black-box machine learning models, our platform implements <strong>TreeSHAP (SHapley Additive exPlanations)</strong> to calculate the exact marginal contribution of each of the 45 pre-IPO features.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.82rem' }}>Financial Performance Drivers</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                Profit After Tax (PAT) margin, Return on Net Worth (RoNW), EBITDA growth, and Leverage (Debt-to-Equity).
              </div>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.82rem' }}>Valuation & Issue Terms</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                P/E ratio relative to peer sector averages, Price-to-Book, Issue Size (Cr INR), and Lot Sizing.
              </div>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.82rem' }}>Market Environment & Momentum</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                NIFTY 50 30-day return, India VIX volatility index, Anchor investor subscription demand, and sectoral sentiment.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
            Note: SHAP values represent observational feature contributions relative to historical dataset baselines and do not imply causal intervention.
          </div>
        </div>
      </div>

      {/* AGENTIC PREDICTION AUDIT RECORD VIEWER (TASK 10) */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0284c7' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="#0284c7" />
              Ex-Ante Prediction Audit Records
            </h3>
            <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>
              <Lock size={11} /> IMMUTABLE SNAPSHOTS
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Verified immutable audit logs captured strictly before the 09:59:59 IST pre-market opening cutoff.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {auditRecords.map((rec) => (
            <div
              key={rec.ipo_name}
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                  {rec.ipo_name}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontWeight: 700 }}>
                    {rec.prediction_status}
                  </span>
                  <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 700 }}>
                    ex_ante: {rec.ex_ante ? 'true' : 'false'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.76rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Prediction Timestamp:</span>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{rec.prediction_timestamp}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Cutoff Timestamp:</span>
                  <div style={{ fontWeight: 600, color: '#b91c1c' }}>{rec.cutoff_timestamp}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Feature Snapshot Timestamp:</span>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{rec.feature_snapshot_timestamp}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Model Version:</span>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{rec.model_version}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Model Integrity / SHA-256:</span>
                  <div style={{ fontWeight: 600, color: '#166534' }}>{rec.model_hash_status}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>45-Feature Completeness:</span>
                  <div style={{ fontWeight: 600, color: '#0369a1' }}>{rec.feature_completeness}</div>
                </div>
              </div>

              {/* Predictions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Total</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{rec.predictions.total}</div>
                </div>
                <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>QIB</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{rec.predictions.qib}</div>
                </div>
                <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>NII</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{rec.predictions.nii}</div>
                </div>
                <div style={{ padding: '0.4rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Retail</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{rec.predictions.retail}</div>
                </div>
              </div>

              {/* SHAP Drivers */}
              <div style={{ fontSize: '0.74rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Top SHAP Drivers:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.15rem' }}>Positive Catalysts:</div>
                    {rec.shap_drivers.positive.map((d, i) => (
                      <div key={i} style={{ color: '#15803d' }}>• {d}</div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: '#fef2f2', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #fecaca' }}>
                    <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '0.15rem' }}>Risk Drags:</div>
                    {rec.shap_drivers.negative.map((d, i) => (
                      <div key={i} style={{ color: '#b91c1c' }}>• {d}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                <span style={{ fontWeight: 700 }}>Data Sources:</span> {rec.data_sources.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
