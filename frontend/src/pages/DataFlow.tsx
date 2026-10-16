import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Shield,
  Play,
  ArrowRight,
  ArrowDown,
  Clock,
  CheckCircle2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Lock,
  FileText,
  Search
} from 'lucide-react';
import { InteractiveWalkthrough } from '../components/diagrams/InteractiveWalkthrough';
import { GovernancePanels } from '../components/diagrams/GovernancePanels';

interface PipelineNode {
  id: string;
  stageNumber: number;
  stageName: string;
  title: string;
  badge: string;
  type: 'SOURCE' | 'INGESTION' | 'VALIDATION' | 'FEATURE' | 'MODEL' | 'AGENT' | 'EXPLAIN' | 'OUTPUT' | 'LIVE' | 'FEEDBACK';
  timing: 'EX-ANTE (Pre-10:00 IST)' | 'POST-OPEN (Observation Only)' | 'POST-CLOSE (Evaluation)';
  freshness: string;
  component: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  codeSnippet?: string;
  upstreamIds: string[];
  downstreamIds: string[];
}

const PIPELINE_NODES: PipelineNode[] = [
  // ROW 1: External Sources
  {
    id: 'src-nse',
    stageNumber: 1,
    stageName: 'External Sources',
    title: 'NSE Official Exchange Portal',
    badge: 'Official Exchange Feed',
    type: 'SOURCE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Hourly (60m) / Pre-Market',
    component: 'backend/connectors/live_ipo_discovery.py',
    purpose: 'Provides primary issuer identity, symbol, ISIN, official price band, issue schedule, and post-opening live subscription tallies.',
    inputs: ['Public web endpoint: nseindia.com/api/ipo-current-issue'],
    outputs: ['Official issue schedule', 'Price band (min/max)', 'Issue size (Cr)', 'Live category shares bid'],
    upstreamIds: [],
    downstreamIds: ['ingest-connector', 'live-poller'],
  },
  {
    id: 'src-bse',
    stageNumber: 1,
    stageName: 'External Sources',
    title: 'BSE Exchange Portal',
    badge: 'Secondary Verification',
    type: 'SOURCE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Daily Pre-Market',
    component: 'backend/connectors/live_ipo_discovery.py',
    purpose: 'Secondary validation for Mainboard & SME offerings, basis of allotment documents, and cross-exchange confirmation.',
    inputs: ['BSE public listing schedule & scrip master'],
    outputs: ['Listing code', 'Allotment date schedule', 'Exchange verification'],
    upstreamIds: [],
    downstreamIds: ['ingest-connector'],
  },
  {
    id: 'src-sebi',
    stageNumber: 1,
    stageName: 'External Sources',
    title: 'SEBI DRHP / RHP Filings',
    badge: 'Statutory Regulator',
    type: 'SOURCE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Static at Prospectus filing',
    component: 'backend/monitoring/ipo_intelligence.py',
    purpose: 'Statutory source of truth for anchor book allocations, promoter dilution, QIB/NII/Retail quotas, and audited financials.',
    inputs: ['Red Herring Prospectus (RHP) & Anchor Allocation Report'],
    outputs: ['Audited P/E ratio', 'P/B ratio', 'QIB quota (50%)', 'Retail quota (35%)', 'Anchor lock-in commitments'],
    upstreamIds: [],
    downstreamIds: ['ingest-connector'],
  },
  {
    id: 'src-company',
    stageNumber: 1,
    stageName: 'External Sources',
    title: 'Company Prospectus & Financials',
    badge: 'Audited Financials',
    type: 'SOURCE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Historical 3-Year Audited',
    component: 'backend/data/canonical_schema.py',
    purpose: 'Provides revenue, PAT, EPS, EBITDA margins, debt-to-equity ratio, and lead manager syndicates.',
    inputs: ['Audited Financial Statements (Restated Ind AS)'],
    outputs: ['Revenue growth 3Y CAGR', 'PAT margin %', 'EPS', 'Lead manager quality score'],
    upstreamIds: [],
    downstreamIds: ['ingest-connector'],
  },
  {
    id: 'src-gmp',
    stageNumber: 1,
    stageName: 'External Sources',
    title: 'Grey Market Premium (GMP)',
    badge: 'Indicative Unofficial',
    type: 'SOURCE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Snapshot at 09:59:59 IST',
    component: 'backend/monitoring/ipo_intelligence.py',
    purpose: 'Captures unofficial pre-listing market sentiment and grey market premium percentage. Clearly flagged as non-exchange indicative data.',
    inputs: ['Chittorgarh & InvestorGain dealer polls at 09:00 IST'],
    outputs: ['gmp_percentage (e.g. +32.3%)', 'kostak_rate', 'subject_to_sauda'],
    upstreamIds: [],
    downstreamIds: ['ingest-connector'],
  },
  {
    id: 'src-sentiment',
    stageNumber: 1,
    stageName: 'External Sources',
    title: 'Pre-IPO News & FinBERT NLP',
    badge: 'Market NLP Sentiment',
    type: 'SOURCE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Pre-Market T-1 Day',
    component: 'backend/agents/feature_agent.py',
    purpose: 'Ingests financial news headlines, brokerage reports, and computes domain-adapted FinBERT sentiment polarity scores.',
    inputs: ['Financial headlines & analyst subscribe/avoid recommendations'],
    outputs: ['finbert_sentiment_score (-1.0 to +1.0)', 'broker_recommendation_ratio'],
    upstreamIds: [],
    downstreamIds: ['ingest-connector'],
  },

  // ROW 2: Ingestion Tier
  {
    id: 'ingest-connector',
    stageNumber: 2,
    stageName: 'Data Ingestion Tier',
    title: 'Discovery Connectors & Ingestion Gateway',
    badge: 'Connector Gateway',
    type: 'INGESTION',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Continuous / Scheduled',
    component: 'backend/connectors/live_ipo_discovery.py',
    purpose: 'Aggregates multi-source feeds with resilient retry policies, exponential backoff, rate limiting, and local JSON caching.',
    inputs: ['NSE API', 'BSE Feed', 'SEBI Filings', 'GMP Scrapers', 'FinBERT Scores'],
    outputs: ['Raw IPO dictionary with verified filing timestamps', 'live_ipo_discovery_cache.json'],
    codeSnippet: `def refresh_discovery_cache():\n    raw_ipos = fetch_nse_live_issues()\n    merged = merge_with_existing_registry(raw_ipos)\n    save_discovery_cache(merged)`,
    upstreamIds: ['src-nse', 'src-bse', 'src-sebi', 'src-company', 'src-gmp', 'src-sentiment'],
    downstreamIds: ['val-temporal'],
  },

  // ROW 3: Temporal Governance
  {
    id: 'val-temporal',
    stageNumber: 3,
    stageName: 'Temporal Governance Gate',
    title: 'The 09:59:59 IST Ex-Ante Cutoff Barrier',
    badge: 'Cryptographic Temporal Gate',
    type: 'VALIDATION',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Strict Enforcement',
    component: 'backend/tools/prediction_tool.py',
    purpose: 'Guarantees zero data leakage. Enforces that only information available before public bidding opens at 10:00:00 IST can enter feature vectorization.',
    inputs: ['Raw IPO dictionary', 'Data source fetch timestamps', 'Clock anchor (Asia/Kolkata)'],
    outputs: ['Temporal Compliance Token', 'Hard rejection if timestamp >= 10:00:00 IST'],
    codeSnippet: `def assert_ex_ante_cutoff(open_date_str: str, data_ts: datetime):\n    cutoff = datetime.combine(open_date, time(9, 59, 59), ZoneInfo("Asia/Kolkata"))\n    if data_ts >= cutoff:\n        raise HardLeakageViolation("Post-opening data leakage detected")`,
    upstreamIds: ['ingest-connector'],
    downstreamIds: ['feat-imputation'],
  },

  // ROW 4: Feature Engineering
  {
    id: 'feat-imputation',
    stageNumber: 4,
    stageName: 'Feature Engineering & Imputation',
    title: '45 Canonical Features & Training Median Imputation',
    badge: 'FoldPreprocessor Imputation',
    type: 'FEATURE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Deterministic',
    component: 'backend/ml/features.py & FoldPreprocessor',
    purpose: 'Transforms validated raw metadata into 45 canonical features across 8 clusters. Missing attributes are flagged as NaN (NEVER 0.0) and imputed with historical training-fold medians.',
    inputs: ['Validated pre-open metadata', 'Historical fold medians from dev_preprocessor.joblib'],
    outputs: ['Canonical feature dictionary', 'NaN imputation audit log', 'Feature scaling vector'],
    codeSnippet: `# Missing values explicitly converted to np.nan\nif col not in feature_dict or feature_dict[col] is None:\n    df_dict[col] = np.nan # FoldPreprocessor imputes historical median, NEVER 0.0`,
    upstreamIds: ['val-temporal'],
    downstreamIds: ['prep-matrix'],
  },
  {
    id: 'prep-matrix',
    stageNumber: 4,
    stageName: 'Feature Engineering & Imputation',
    title: 'Dense (1, 45) Feature Matrix',
    badge: 'Preprocessed Tensor',
    type: 'FEATURE',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Deterministic',
    component: 'models/final_candidates/dev_preprocessor.joblib',
    purpose: 'Frozen scikit-learn preprocessor applying robust quantile scaling, one-hot sector encoding, and numerical standardization.',
    inputs: ['Canonical feature dictionary'],
    outputs: ['Dense NumPy array of shape (1, 45) ready for ML inference'],
    upstreamIds: ['feat-imputation'],
    downstreamIds: ['model-parallel'],
  },

  // ROW 5: Model Inference
  {
    id: 'model-parallel',
    stageNumber: 5,
    stageName: 'Parallel Model Inference',
    title: 'Parallel 4-Model Inference Engine',
    badge: 'Production Frozen Candidates',
    type: 'MODEL',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Real-time (< 30ms latency)',
    component: 'backend/tools/prediction_tool.py',
    purpose: 'Simultaneously invokes 4 specialized ML models across investor categories with mathematical scale inversion.',
    inputs: ['Dense (1, 45) feature matrix', 'SHA-256 integrity verification'],
    outputs: [
      'Total: XGBoost (log1p &rarr; expm1) &bull; Direct Multiple',
      'QIB: Random Forest (Raw) &bull; Institutional Multiple',
      'NII: LightGBM (log1p &rarr; expm1) &bull; High Net Worth Multiple',
      'Retail: XGBoost (Raw) &bull; Retail Multiple',
      'Weighted Ensemble: 0.50*QIB + 0.15*NII + 0.35*Retail'
    ],
    codeSnippet: `raw_pred = model.predict(X_mat)[0]\nif tf_mode == "log1p":\n    pred_val = np.expm1(raw_pred)\nelse:\n    pred_val = raw_pred`,
    upstreamIds: ['prep-matrix'],
    downstreamIds: ['agent-orchestrator', 'shap-explainer'],
  },

  // ROW 6: Agentic AI Orchestration
  {
    id: 'agent-orchestrator',
    stageNumber: 6,
    stageName: 'Agentic AI Orchestration',
    title: 'LangGraph Autonomous Multi-Agent Pipeline',
    badge: '8-Agent StateGraph',
    type: 'AGENT',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Execution on Inference',
    component: 'backend/agents/graph.py',
    purpose: 'Coordinates 8 specialized AI agents via a compiled LangGraph StateGraph, managing state transitions, validations, and report synthesis.',
    inputs: ['IPOState dictionary with inputs, models, and metadata'],
    outputs: ['Validated state', 'Category recommendations', 'Risk flags', 'Synthesized synthesis report'],
    codeSnippet: `builder = StateGraph(IPOState)\nbuilder.add_node("validate_input", input_validation_node)\nbuilder.add_node("collect_ipo_data", ipo_data_node)\nbuilder.add_node("prepare_features", feature_preparation_node)\nbuilder.add_node("predict", prediction_node)\nbuilder.add_node("explain", shap_explanation_node)\nbuilder.add_node("analyze_categories", category_analysis_node)\nbuilder.add_node("assess_risk", risk_analysis_node)\nbuilder.add_node("generate_report", report_generation_node)`,
    upstreamIds: ['model-parallel'],
    downstreamIds: ['shap-explainer', 'risk-analysis'],
  },

  // ROW 7: Explainability & Risk
  {
    id: 'shap-explainer',
    stageNumber: 7,
    stageName: 'Explainability & Risk Attribution',
    title: 'TreeSHAP Feature Attribution Engine',
    badge: 'Local Shapley Decomposition',
    type: 'EXPLAIN',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Real-time (< 20ms)',
    component: 'backend/agents/shap_agent.py',
    purpose: 'Computes exact Shapley values on XGBoost trees to attribute each predicted multiple to fundamental, valuation, and sentiment drivers.',
    inputs: ['XGBoost booster model', 'Dense (1, 45) feature vector'],
    outputs: ['Base value', 'Positive drivers (+GMP%, +Sentiment)', 'Negative drivers (-Issue Size, -Valuation)', 'Narrative explanation'],
    upstreamIds: ['model-parallel', 'agent-orchestrator'],
    downstreamIds: ['dash-delivery'],
  },
  {
    id: 'risk-analysis',
    stageNumber: 7,
    stageName: 'Explainability & Risk Attribution',
    title: 'Category Edge & Subscription Shortfall Risk',
    badge: 'Risk Quantification',
    type: 'EXPLAIN',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Real-time',
    component: 'backend/agents/risk_agent.py & category_agent.py',
    purpose: 'Quantifies demand asymmetry across QIB/NII/Retail, identifies category edge, and computes subscription shortfall probability.',
    inputs: ['Category multiples', 'Historical volatility per sector', 'Issue size Cr'],
    outputs: ['Category Edge (e.g. Retail Edge 231x)', 'Shortfall Probability %', 'Risk Tier (LOW/MODERATE/HIGH)'],
    upstreamIds: ['agent-orchestrator'],
    downstreamIds: ['dash-delivery'],
  },

  // ROW 8: Final Dashboard Delivery
  {
    id: 'dash-delivery',
    stageNumber: 8,
    stageName: 'Presentation & Delivery Tier',
    title: 'Dashboard & Scenario Analysis Presentation',
    badge: 'React Presentation Layer',
    type: 'OUTPUT',
    timing: 'EX-ANTE (Pre-10:00 IST)',
    freshness: 'Instant Reactive',
    component: 'frontend/src/pages/Dashboard.tsx & ModelPrediction.tsx',
    purpose: 'Presents ex-ante predictions, confidence intervals, TreeSHAP waterfalls, and scenario analysis sliders to end-investors.',
    inputs: ['Final prediction payload', 'SHAP values', 'Category rankings', 'Risk scores'],
    outputs: ['Interactive demand cards', 'Waterfall bar charts', 'Category badges', 'Scenario simulation outputs'],
    upstreamIds: ['shap-explainer', 'risk-analysis'],
    downstreamIds: ['audit-trail'],
  },

  // ROW 9: Live Monitoring & Observation
  {
    id: 'live-poller',
    stageNumber: 9,
    stageName: 'Live Observation Tier',
    title: 'Hourly NSE Live Subscription Poller (60m)',
    badge: 'Observation Only Barrier',
    type: 'LIVE',
    timing: 'POST-OPEN (Observation Only)',
    freshness: '60 Minutes Scheduled',
    component: 'backend/monitoring/hourly_refresh.py',
    purpose: 'Scrapes live bidding progress (Day 1/2/3) from NSE official exchange. Isolated strictly to observation; NEVER fed into AI prediction models.',
    inputs: ['NSE live bidding tally API', 'Active open IPO registry'],
    outputs: ['Live subscription multiples', 'Bidding day counter (Day 3 of 3)', 'Status: LIVE / STALE / UNAVAILABLE'],
    codeSnippet: `# Strict isolation barrier: Live tallies NEVER overwrite frozen ex-ante predictions\nrecord = {\n    "symbol": symbol,\n    "live_total_sub": live_val,\n    "ex_ante_prediction": frozen_pred,\n    "is_leakage_prevented": True\n}`,
    upstreamIds: ['src-nse'],
    downstreamIds: ['audit-trail'],
  },

  // ROW 10: Feedback Loop & Governance
  {
    id: 'audit-trail',
    stageNumber: 10,
    stageName: 'Outcome Ingestion & Governance Loop',
    title: 'Final Outcome Evaluation & Drift Monitoring',
    badge: 'Audit & Drift Telemetry',
    type: 'FEEDBACK',
    timing: 'POST-CLOSE (Evaluation)',
    freshness: 'Post-Listing Closure',
    component: 'backend/monitoring/prospective_validator.py',
    purpose: 'Ingests official closing subscription, computes prediction residuals (MAE/RMSE/Bias), monitors Population Stability Index (PSI > 0.25 alert), and logs to prediction_audit.',
    inputs: ['Final actual subscription', 'Frozen ex-ante prediction', 'Feature snapshot'],
    outputs: ['Residual metrics', 'PSI drift score', 'Candidate retraining pool trigger', 'Quarantine flags'],
    upstreamIds: ['dash-delivery', 'live-poller'],
    downstreamIds: ['retrain-gate'],
  },
  {
    id: 'retrain-gate',
    stageNumber: 10,
    stageName: 'Outcome Ingestion & Governance Loop',
    title: 'Candidate Retraining & Human Governance Gate',
    badge: 'Protected Promotion Gate',
    type: 'FEEDBACK',
    timing: 'POST-CLOSE (Evaluation)',
    freshness: 'On Drift Trigger',
    component: 'models/retrained/ & scripts/audit_and_retrain_candidates.py',
    purpose: 'Trains candidate models in quarantined directory with walk-forward CV. Production models in models/final_candidates/ remain strictly locked until explicit human governance approval.',
    inputs: ['Retraining dataset', 'Candidate model architectures', 'Cryptographic SHA-256 verification'],
    outputs: ['Candidate evaluation manifest', 'Promotion recommendation', 'ZERO automatic replacement'],
    upstreamIds: ['audit-trail'],
    downstreamIds: [],
  },
];

export const DataFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flowchart' | 'walkthrough'>('flowchart');
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredNodes = PIPELINE_NODES.filter((node) => {
    const matchesSearch =
      searchFilter.trim() === '' ||
      node.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.purpose.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.component.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || node.stageName === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 145));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleZoomReset = () => setZoomLevel(100);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#f8fafc', paddingBottom: '4rem' }}>
      {/* Hero Banner */}
      <div className="diagram-hero-banner" style={{ background: 'linear-gradient(180deg, #030712 0%, #0b1329 100%)', borderBottom: '1px solid #1e293b' }}>
        <div className="diagram-hero-inner">
          <div>
            <div className="diagram-badge-group">
              <span className="diagram-badge-pill diagram-badge-sky">
                <Sparkles size={13} />
                Operational Data Pipeline
              </span>
              <span className="diagram-badge-pill diagram-badge-emerald">
                <Lock size={12} />
                09:59:59 IST Ex-Ante Barrier
              </span>
              <span className="diagram-badge-pill diagram-badge-slate">
                10 Pipeline Stages &bull; 16 Nodes
              </span>
            </div>
            <h1 className="diagram-hero-title">
              IPO Subscription AI — End-to-End Data Flow
            </h1>
            <p className="diagram-hero-subtitle">
              Trace how real-world IPO data transforms from external regulatory feeds into an ex-ante AI prediction, LangGraph agentic reasoning, TreeSHAP explanation, live NSE monitoring, and governance retraining.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="diagram-hero-actions">
            <Link to="/diagrams" className="diagram-btn-secondary">
              &larr; Software Diagrams
            </Link>
            <a href="#governance-section" className="diagram-btn-secondary">
              <Shield size={15} />
              Model Governance
            </a>
            <Link to="/model-prediction" className="diagram-btn-primary">
              <Play size={14} />
              Run Custom Scenario
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Tabs: Flowchart vs Walkthrough */}
        <div style={{ maxWidth: '1380px', margin: '2rem auto 0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('flowchart')}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'flowchart' ? '#0284c7' : '#0f172a',
              color: activeTab === 'flowchart' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'flowchart' ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={14} />
            Architecture Flowchart &amp; Interactive Nodes
          </button>
          <button
            onClick={() => setActiveTab('walkthrough')}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'walkthrough' ? '#0284c7' : '#0f172a',
              color: activeTab === 'walkthrough' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'walkthrough' ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Play size={14} />
            Simulate 1 IPO: Step-by-Step Walkthrough
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {activeTab === 'walkthrough' ? (
          /* Walkthrough Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: '#38bdf8' }} />
                <strong>Simulation Mode:</strong> Step-by-step trace of how SS Retail Limited is evaluated by the live ex-ante pipeline.
              </span>
              <button
                onClick={() => setActiveTab('flowchart')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Pipeline Flowchart &rarr;
              </button>
            </div>
            <InteractiveWalkthrough />
          </div>
        ) : (
          /* Flowchart Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Temporal Governance Notice Banner */}
            <div style={{ background: 'linear-gradient(90deg, rgba(69, 26, 3, 0.4) 0%, #0f172a 50%, rgba(3, 105, 161, 0.3) 100%)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fef3c7', margin: 0 }}>
                      Statutory Temporal Governance: The 09:59:59 IST Ex-Ante Boundary
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0.25rem 0 0 0', maxWidth: '850px', lineHeight: 1.45 }}>
                      Only data published <strong>at or before 09:59:59 IST on the IPO open date</strong> enters the AI feature pipeline. Live exchange subscription multiples gathered after 10:00:00 IST are strictly segregated as <strong>live observations only</strong> and can never leak into model predictions or feature scalers.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(5, 150, 105, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>
                    ✓ Permitted: DRHP, Pre-Open GMP, FinBERT
                  </span>
                  <span style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>
                    ✗ Forbidden: Day 1/2/3 Bids, Allotment
                  </span>
                </div>
              </div>
            </div>

            {/* Pipeline Controls & Search Bar */}
            <div style={{ backgroundColor: '#0b1329', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>Filter Stage:</span>
                {[
                  'ALL',
                  'External Sources',
                  'Temporal Governance Gate',
                  'Feature Engineering & Imputation',
                  'Parallel Model Inference',
                  'Agentic AI Orchestration',
                  'Live Observation Tier',
                  'Outcome Ingestion & Governance Loop',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStageFilter(st)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: stageFilter === st ? '#0284c7' : '#1e293b',
                      color: stageFilter === st ? '#ffffff' : '#94a3b8',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {st === 'ALL' ? 'All Stages' : st.replace(' Tier', '').replace(' & Imputation', '')}
                  </button>
                ))}
              </div>

              {/* Search Bar & Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search nodes & features..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.65rem 0.4rem 2rem',
                      fontSize: '0.78rem',
                      backgroundColor: '#030712',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Zoom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#030712', padding: '0.2rem 0.4rem', borderRadius: '6px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8', marginRight: '0.25rem' }}>{zoomLevel}%</span>
                  <button
                    onClick={handleZoomIn}
                    title="Zoom In"
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    title="Reset Zoom"
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Flowchart Canvas Area */}
            <div
              ref={containerRef}
              className="dataflow-canvas-wrapper"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Visual Flow Stages */}
              <div style={{ minWidth: '980px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* 10 Visual Pipeline Rows */}
                {[
                  {
                    stageNumber: 1,
                    title: 'Stage 1: External Regulatory & Market Feeds',
                    desc: 'Primary exchange gateways, statutory SEBI filings, indicative GMP, and financial news.',
                    nodeIds: ['src-nse', 'src-bse', 'src-sebi', 'src-company', 'src-gmp', 'src-sentiment'],
                  },
                  {
                    stageNumber: 2,
                    title: 'Stage 2: Ingestion & Cache Resiliency',
                    desc: 'Discovery gateway with exponential backoff and rate-limiting cache.',
                    nodeIds: ['ingest-connector'],
                  },
                  {
                    stageNumber: 3,
                    title: 'Stage 3: Temporal Governance Verification',
                    desc: 'Strict 09:59:59 IST ex-ante check. Post-opening data raises HardLeakageViolation.',
                    nodeIds: ['val-temporal'],
                  },
                  {
                    stageNumber: 4,
                    title: 'Stage 4: Feature Vectorization & Imputation',
                    desc: 'Group G canonical schema (45 features). Missing values imputed with training-fold medians, never 0.0.',
                    nodeIds: ['feat-imputation', 'prep-matrix'],
                  },
                  {
                    stageNumber: 5,
                    title: 'Stage 5: Parallel Model Inference',
                    desc: '4 specialized production candidates: Total XGBoost (log1p), QIB RF, NII LightGBM, Retail XGBoost.',
                    nodeIds: ['model-parallel'],
                  },
                  {
                    stageNumber: 6,
                    title: 'Stage 6: LangGraph Autonomous Multi-Agent Orchestration',
                    desc: 'Compiled 8-agent StateGraph executing validation, predictions, categories, and report generation.',
                    nodeIds: ['agent-orchestrator'],
                  },
                  {
                    stageNumber: 7,
                    title: 'Stage 7: Explainability & Risk Attribution',
                    desc: 'TreeSHAP local feature attribution and category demand shortfall risk modeling.',
                    nodeIds: ['shap-explainer', 'risk-analysis'],
                  },
                  {
                    stageNumber: 8,
                    title: 'Stage 8: Presentation & Scenario Delivery',
                    desc: 'Dashboard demand cards, category edge metrics, and custom scenario sliders.',
                    nodeIds: ['dash-delivery'],
                  },
                  {
                    stageNumber: 9,
                    title: 'Stage 9: Live Monitoring & Observation Barrier',
                    desc: 'Hourly 60m NSE poller. Strictly segregated as live observation without polluting AI feature store.',
                    nodeIds: ['live-poller'],
                  },
                  {
                    stageNumber: 10,
                    title: 'Stage 10: Feedback Loop, Drift & Human Governance Gate',
                    desc: 'Official outcome ingestion, PSI drift calculation (> 0.25 trigger), quarantined candidate retraining, human gate.',
                    nodeIds: ['audit-trail', 'retrain-gate'],
                  },
                ].map((row, rIdx) => {
                  const nodesInRow = filteredNodes.filter((n) => row.nodeIds.includes(n.id));
                  if (nodesInRow.length === 0) return null;

                  return (
                    <div key={row.stageNumber} className="dataflow-row-container">
                      {/* Row Header */}
                      <div className="dataflow-row-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className="dataflow-step-circle">
                            {row.stageNumber}
                          </span>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>{row.title}</h4>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.desc}</span>
                      </div>

                      {/* Nodes Grid in Row */}
                      <div className="dataflow-nodes-grid">
                        {nodesInRow.map((node) => {
                          const isSelected = selectedNode?.id === node.id;
                          return (
                            <div
                              key={node.id}
                              onClick={() => setSelectedNode(node)}
                              className={`dataflow-node-card ${isSelected ? 'selected' : ''}`}
                            >
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                  <span
                                    className={`dataflow-node-badge ${
                                      node.timing.includes('EX-ANTE')
                                        ? 'dataflow-badge-exante'
                                        : node.timing.includes('POST-OPEN')
                                        ? 'dataflow-badge-postopen'
                                        : 'dataflow-badge-feedback'
                                    }`}
                                  >
                                    {node.badge}
                                  </span>
                                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b' }}>
                                    #{node.id}
                                  </span>
                                </div>

                                <h5 className="dataflow-node-title">
                                  {node.title}
                                </h5>

                                <p className="dataflow-node-desc">
                                  {node.purpose}
                                </p>
                              </div>

                              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={11} style={{ color: '#94a3b8' }} />
                                  {node.freshness}
                                </span>
                                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                  Inspect &rarr;
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Directional Arrow between rows */}
                      {rIdx < 9 && (
                        <div className="dataflow-flow-arrow">
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowDown size={15} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Node Details Drawer / Modal */}
            {selectedNode && (
              <div className="diagram-modal-backdrop">
                <div className="diagram-modal-dialog" style={{ maxWidth: '750px' }}>
                  {/* Modal Header */}
                  <div className="diagram-modal-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                          Stage {selectedNode.stageNumber}: {selectedNode.stageName}
                        </span>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            backgroundColor: selectedNode.timing.includes('EX-ANTE') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: selectedNode.timing.includes('EX-ANTE') ? '#6ee7b7' : '#fde68a',
                            border: '1px solid',
                            borderColor: selectedNode.timing.includes('EX-ANTE') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                          }}
                        >
                          {selectedNode.timing}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{selectedNode.title}</h3>
                      <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={12} style={{ color: '#38bdf8' }} />
                        Code Component: <span style={{ color: '#f8fafc' }}>{selectedNode.component}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedNode(null)}
                      style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', cursor: 'pointer', padding: '0.35rem', display: 'flex' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="diagram-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.35rem' }}>
                        Purpose &amp; Architectural Role
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5, backgroundColor: '#030712', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b', margin: 0 }}>
                        {selectedNode.purpose}
                      </p>
                    </div>

                    {/* Inputs & Outputs Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem' }}>
                        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#38bdf8', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <ArrowRight size={12} /> Input Data Received
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {selectedNode.inputs.map((inp, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                              <span style={{ color: '#38bdf8', fontWeight: 800 }}>&bull;</span>
                              <span>{inp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem' }}>
                        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#34d399', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={12} /> Guaranteed Output Artifacts
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {selectedNode.outputs.map((out, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                              <span style={{ color: '#34d399', fontWeight: 800 }}>&bull;</span>
                              <span>{out}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Code Snippet if present */}
                    {selectedNode.codeSnippet && (
                      <div>
                        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.35rem' }}>
                          Production Implementation Snippet
                        </h4>
                        <pre style={{ backgroundColor: '#030712', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#7dd3fc', overflowX: 'auto', margin: 0 }}>
                          <code>{selectedNode.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Freshness & Isolation Notes */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '0.78rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0' }}>
                        <Clock size={13} style={{ color: '#fbbf24' }} />
                        <strong>Update Cadence:</strong> {selectedNode.freshness}
                      </span>
                      <span style={{ color: '#94a3b8' }}>
                        Node ID: <code style={{ color: '#38bdf8' }}>{selectedNode.id}</code>
                      </span>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="diagram-modal-footer">
                    <button
                      onClick={() => setSelectedNode(null)}
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Close Inspector
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Governance Panels */}
            <div id="governance-section" style={{ paddingTop: '2rem' }}>
              <GovernancePanels />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataFlow;
