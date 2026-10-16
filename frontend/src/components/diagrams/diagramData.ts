import { DiagramItem, WalkthroughStep, ModelArtifactInfo, DataProvenanceSource } from './types';

// Import all 18 SVG diagram components
import { Diagram1HighLevelArch } from './svgDiagrams/Diagram1HighLevelArch';
import { Diagram2DataFlow } from './svgDiagrams/Diagram2DataFlow';
import { Diagram3SystemContext } from './svgDiagrams/Diagram3SystemContext';
import { Diagram4UseCase } from './svgDiagrams/Diagram4UseCase';
import { Diagram5Sequence } from './svgDiagrams/Diagram5Sequence';
import { Diagram6ClassDiagram } from './svgDiagrams/Diagram6ClassDiagram';
import { Diagram7MLTrainingPipeline } from './svgDiagrams/Diagram7MLTrainingPipeline';
import { Diagram8ModelPredictionFlow } from './svgDiagrams/Diagram8ModelPredictionFlow';
import { Diagram9DatabaseER } from './svgDiagrams/Diagram9DatabaseER';
import { Diagram10Deployment } from './svgDiagrams/Diagram10Deployment';
import { Diagram11CICD } from './svgDiagrams/Diagram11CICD';
import { Diagram12Security } from './svgDiagrams/Diagram12Security';
import { Diagram13Monitoring } from './svgDiagrams/Diagram13Monitoring';
import { Diagram14HourlyNSE } from './svgDiagrams/Diagram14HourlyNSE';
import { Diagram15TemporalGovernance } from './svgDiagrams/Diagram15TemporalGovernance';
import { Diagram16AgenticOrchestration } from './svgDiagrams/Diagram16AgenticOrchestration';
import { Diagram17FeatureMap } from './svgDiagrams/Diagram17FeatureMap';
import { Diagram18ModelSelection } from './svgDiagrams/Diagram18ModelSelection';
import { DiagramActivityFlow } from './svgDiagrams/DiagramActivityFlow';
import { DiagramComponent } from './svgDiagrams/DiagramComponent';
import { DiagramState } from './svgDiagrams/DiagramState';
import { DiagramDataModel } from './svgDiagrams/DiagramDataModel';
import { DiagramInfrastructure } from './svgDiagrams/DiagramInfrastructure';

export const DIAGRAMS_DATA: DiagramItem[] = [
  // CATEGORY 1: Architecture
  {
    id: 'diagram-1',
    title: 'High-Level System Architecture',
    category: 'Architecture',
    description: 'Tier-by-tier architecture illustrating External Ingestion, Preprocessing, ML Inference Core, Security Boundary, Application Server, and Client Presentation.',
    tags: ['Architecture', 'Full-Stack', 'FastAPI', 'React', 'Tiers'],
    component: Diagram1HighLevelArch,
  },
  {
    id: 'diagram-3',
    title: 'System Context & C4 Boundary Diagram',
    category: 'Architecture',
    description: 'Formal boundary diagram capturing all external systems (NSE, SEBI RHP, Chittorgarh GMP, FinBERT) and user personas with security perimeters.',
    tags: ['Context', 'Boundary', 'C4 Level 1', 'External APIs', 'Personas', 'Security'],
    component: Diagram3SystemContext,
  },

  // CATEGORY 2: UML
  {
    id: 'diagram-4',
    title: 'UML Use Case Diagram',
    category: 'UML',
    description: 'Actor relationships and system boundary interactions for Retail Investors, HNI / Institutional Analysts, ML Engineers, and System Admins.',
    tags: ['UML', 'Use Case', 'Actors', 'Permissions', 'Workflows'],
    component: Diagram4UseCase,
  },
  {
    id: 'diagram-5',
    title: 'UML Sequence Diagram: Prediction Lifecycle',
    category: 'UML',
    description: 'Synchronous sequence of calls from User UI click to Feature Engineering, SHA-256 Check, ML Inference, and the blocked Live Tally guard.',
    tags: ['UML', 'Sequence', 'FastAPI', 'Inference', 'Temporal Gate'],
    component: Diagram5Sequence,
  },
  {
    id: 'diagram-6',
    title: 'UML Class Diagram: Domain & Service Models',
    category: 'UML',
    description: 'Object-oriented domain model representing real codebase classes, Pydantic schemas, ML pipeline engines, and audit loggers.',
    tags: ['UML', 'Class Diagram', 'OOP', 'Pydantic', 'FastAPI'],
    component: Diagram6ClassDiagram,
  },
  {
    id: 'diagram-activity',
    title: 'UML Activity Diagram: Inference & Validation Workflow',
    category: 'UML',
    description: 'Algorithmic activity graph showing validation decisions, temporal exception branches, concurrency forks, parallel model inference, and join synchronizations.',
    tags: ['UML', 'Activity Diagram', 'Fork/Join', 'Concurrency', 'Validation Flow'],
    component: DiagramActivityFlow,
  },
  {
    id: 'diagram-component',
    title: 'UML Component Diagram: Subsystems & Ports',
    category: 'UML',
    description: 'Loose coupling and interface contracts across Presentation SPA, FastAPI Gateway, LangGraph Orchestrator, ML Inference Core, and Persistence stores.',
    tags: ['UML', 'Component Diagram', 'Ports', 'Interfaces', 'Modularity'],
    component: DiagramComponent,
  },
  {
    id: 'diagram-state',
    title: 'UML State Machine: Offering Lifecycle & Guards',
    category: 'UML',
    description: 'Deterministic state transitions (UPCOMING &rarr; OPEN_FOR_BIDDING &rarr; CLOSED &rarr; ALLOTTED &rarr; LISTED) with strict 09:59:59 IST temporal guards.',
    tags: ['UML', 'State Machine', 'Guards', 'Transitions', 'Lifecycle'],
    component: DiagramState,
  },

  // CATEGORY 3: Database
  {
    id: 'diagram-9',
    title: 'Database & Relational Persistence (ER) Diagram',
    category: 'Database',
    description: 'Entity-relationship schema for core tables: ipos, predictions, actual_results, feature_snapshots, and prediction_audit records.',
    tags: ['ER Diagram', 'PostgreSQL', 'Schemas', 'Foreign Keys', 'Audit Log'],
    component: Diagram9DatabaseER,
  },
  {
    id: 'diagram-datamodel',
    title: 'Logical & Physical Data Model Schemas',
    category: 'Database',
    description: 'In-memory 1x45 feature matrix structures, Pydantic models, JSON cache hashes, and relational table specifications.',
    tags: ['Data Model', 'Schemas', '45 Features', 'Indices', 'Payloads'],
    component: DiagramDataModel,
  },

  // CATEGORY 4: Security
  {
    id: 'diagram-12',
    title: 'Defense-in-Depth Security & Governance',
    category: 'Security',
    description: 'Multi-layer security architecture covering TLS 1.3, Pydantic validation, CORS whitelisting, immutable model files, and append-only audit trail.',
    tags: ['Security', 'Governance', 'SHA-256', 'Rate Limiting', 'Audit'],
    component: Diagram12Security,
  },

  // CATEGORY 5: Deployment
  {
    id: 'diagram-10',
    title: 'Deployment & Container Infrastructure',
    category: 'Deployment',
    description: 'Physical deployment topology depicting Vercel Edge CDN, Dockerized FastAPI ASGI workers, PostgreSQL 15, and read-only model mount.',
    tags: ['DevOps', 'Docker', 'Vercel', 'FastAPI', 'PostgreSQL'],
    component: Diagram10Deployment,
  },
  {
    id: 'diagram-infrastructure',
    title: 'Cloud Infrastructure & Network Topology',
    category: 'Deployment',
    description: 'VPC network isolation, subnets, Docker ASGI container orchestration, read-only volume mounts, port bindings, and TLS termination.',
    tags: ['Infrastructure', 'VPC', 'Docker', 'Networking', 'Volume Mounts'],
    component: DiagramInfrastructure,
  },

  // CATEGORY 6: CI/CD
  {
    id: 'diagram-11',
    title: 'CI/CD Pipeline & Quality Assurance Gate',
    category: 'CI/CD',
    description: 'Automated GitHub Actions workflow executing Vitest frontend suites, Pytest (221 tests), cryptographic SHA-256 gates, and zero-downtime roll.',
    tags: ['CI/CD', 'GitHub Actions', 'Pytest', 'Vitest', 'Integrity'],
    component: Diagram11CICD,
  },

  // CATEGORY 7: Monitoring
  {
    id: 'diagram-13',
    title: 'Monitoring, Observability & Drift Detection',
    category: 'Monitoring',
    description: 'Continuous health telemetry, Population Stability Index (PSI) drift calculation, feature stability tracking, and quarantine alerting.',
    tags: ['Monitoring', 'PSI Drift', 'SLO', 'Heartbeat', 'Observability'],
    component: Diagram13Monitoring,
  },

  // CATEGORY 8: ML Architecture
  {
    id: 'diagram-7',
    title: 'AI/ML Training & Validation Pipeline',
    category: 'ML Architecture',
    description: 'Complete offline training workflow on 106 historical IPOs with chronological 80/20 split, Walk-Forward CV, log1p transformation, and SHA-256 gating.',
    tags: ['Training', 'Walk-Forward', 'XGBoost', 'LightGBM', 'Random Forest'],
    component: Diagram7MLTrainingPipeline,
  },
  {
    id: 'diagram-18',
    title: 'Multi-Objective Model Selection & Gating Matrix',
    category: 'ML Architecture',
    description: 'Out-of-sample empirical benchmark on 21 test IPOs comparing Direct Total, Weighted Ensemble, and Retrained candidates against promotion criteria.',
    tags: ['Model Selection', 'Benchmarks', 'MAE', 'RMSE', 'Quarantine Matrix'],
    component: Diagram18ModelSelection,
  },

  // CATEGORY 9: Agentic AI
  {
    id: 'diagram-16',
    title: '11-Agent Autonomous AI Orchestration Graph',
    category: 'Agentic AI',
    description: 'Comprehensive execution graph illustrating how 11 specialized autonomous agents collaborate from discovery to inference, SHAP, and drift auditing.',
    tags: ['Agentic AI', '11 Agents', 'Orchestration', 'Multi-Agent', 'Pipeline'],
    component: Diagram16AgenticOrchestration,
  },

  // CATEGORY 10: Governance
  {
    id: 'diagram-15',
    title: 'Ex-Ante Temporal Data Governance & Cutoff',
    category: 'Governance',
    description: 'Visual timeline of Indian IPO issuance showing the strict 09:59:59 IST Day 1 boundary separating permitted ex-ante features from forbidden live data.',
    tags: ['Temporal Cutoff', 'Ex-Ante', '09:59:59 IST', 'Data Leakage', 'Governance'],
    component: Diagram15TemporalGovernance,
  },
];

// Dedicated Operational Data Flow Diagrams (Used in /data-flow)
export const DATA_FLOW_DIAGRAMS: DiagramItem[] = [
  {
    id: 'df-diagram-1',
    title: 'End-to-End Operational Data Flow Architecture',
    category: 'Architecture',
    description: 'Directional data pipeline showing pre-IPO ingestion, 45-feature vectorization, inference, and architectural isolation of Live NSE observations.',
    tags: ['Data Flow', 'Pipeline', 'Ex-Ante', 'Live NSE', 'Isolation'],
    component: Diagram2DataFlow,
  },
  {
    id: 'df-diagram-2',
    title: 'Model Prediction Flow ("How AI Predicts One IPO")',
    category: 'ML Architecture',
    description: 'Step-by-step transformation from raw ticker inputs to 4-model parallel inference, TreeSHAP explainability, and confidence interval output.',
    tags: ['Prediction Flow', 'SHAP', 'Quantiles', 'Latency', 'Ensemble'],
    component: Diagram8ModelPredictionFlow,
  },
  {
    id: 'df-diagram-3',
    title: 'The 45 Canonical Features Engineering Map',
    category: 'ML Architecture',
    description: 'Exhaustive map of all 45 canonical features across 8 clusters: Structure, Valuation, Fundamentals, Anchor, Sentiment, Lead Manager, Macro, and Sector.',
    tags: ['45 Features', 'Group G', 'Feature Engineering', 'Clusters', 'FinBERT'],
    component: Diagram17FeatureMap,
  },
  {
    id: 'df-diagram-4',
    title: 'Hourly Live NSE Feed & Segregation Architecture',
    category: 'Monitoring',
    description: '60-minute scheduler for scraping live exchange tallies, circuit-breaker fallbacks, and strict isolation preventing live tallies from entering AI models.',
    tags: ['NSE Live', 'Scheduler', 'Circuit Breaker', 'Observation Only', 'Isolation'],
    component: Diagram14HourlyNSE,
  },
];

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    title: 'IPO Registration & Identity Ingestion',
    phase: 'INPUT',
    description: 'The system ingests the IPO company name, NSE ticker symbol, and issue schedule from public registry or manual user selection.',
    inputs: [
      'Company Name: SS Retail Limited',
      'NSE Symbol: SSRETAIL',
      'Issue Schedule: Open 2026-09-16, Close 2026-09-18',
      'Price Band: Rs. 315 - Rs. 330 per share',
    ],
    process: 'System initializes the IPO entity in the registry, fetches SEBI filing IDs, and prepares an immutable tracking context.',
    outputs: [
      'Validated IPO Context: { id: "ssretail-2026", status: "PRE_OPEN" }',
      'Timestamp anchor established for ex-ante verification',
    ],
    badge: 'Step 1 of 10',
    color: '#0284c7',
  },
  {
    stepNumber: 2,
    title: 'Ex-Ante Temporal Cutoff Verification',
    phase: 'INPUT',
    description: 'Verifies that all fetched information and timestamps are strictly prior to 09:59:59 IST on Day 1 of public bidding.',
    inputs: [
      'System Clock / Filing Timestamp: 2026-09-15 23:59:59 IST',
      'Day 1 Opening Time: 2026-09-16 10:00:00 IST',
    ],
    process: 'Runs TemporalCutoffValidator.assert_ex_ante_cutoff(). Any timestamp >= 10:00:00 IST raises a HardLeakageViolation error.',
    outputs: [
      'CUTOFF_CHECK: PASSED (Timestamp delta: -10h 00m 01s)',
      'Live Exchange Bidding data permanently locked out of inference vector',
    ],
    badge: 'Step 2 of 10',
    color: '#dc2626',
  },
  {
    stepNumber: 3,
    title: 'Prospectus Financials & Ratios Extraction',
    phase: 'PROCESS',
    description: 'Parses the official SEBI Red Herring Prospectus (RHP) to extract 3-year financial history and valuation multiples.',
    inputs: [
      'SEBI RHP Tables: Restated Consolidated Financial Statements',
      'Total Issue Size: Rs. 1,450.00 Cr (Fresh: 60%, OFS: 40%)',
    ],
    process: 'FinancialExtractor parses Revenue (Rs. 2,120 Cr), EBITDA margin (18.4%), PAT (Rs. 195 Cr), RoNW (22.8%), and computes Post-Issue P/E (28.4x).',
    outputs: [
      '18 Fundamental financial metrics extracted and bounds-checked',
      'Sector peer valuation comparison generated',
    ],
    badge: 'Step 3 of 10',
    color: '#7c3aed',
  },
  {
    stepNumber: 4,
    title: 'Pre-Market Sentiment & Grey Market Aggregation',
    phase: 'PROCESS',
    description: 'Aggregates Day -1 Indicative Grey Market Premium (GMP) and computes FinBERT sentiment score across pre-IPO media articles.',
    inputs: [
      'Indicative GMP: Rs. 82 per share (24.8% premium over cap price)',
      '14 Financial News Articles published between Day -5 and Day -1',
    ],
    process: 'Passes headline texts through FinBERT NLP pipeline. Computes average sentiment polarity score (+0.642) and news buzz volume index.',
    outputs: [
      'gmp_reported: 82.00, gmp_percentage: 24.85%',
      'finbert_sentiment_score: +0.642 (Moderately Bullish)',
    ],
    badge: 'Step 4 of 10',
    color: '#d97706',
  },
  {
    stepNumber: 5,
    title: '45 Canonical Features Vector Assembly',
    phase: 'PROCESS',
    description: 'Maps extracted raw parameters into the strict 45-feature canonical order defined by Group_G_All_Features_Plus_Sector.',
    inputs: [
      'Raw fundamentals, sentiment, GMP, lead manager data, macro indicators, and sector one-hot encoding',
    ],
    process: 'Constructs numpy array of shape (1, 45). Validates that every column name, type, and index matches the production model training config.',
    outputs: [
      'Raw Feature Vector: shape (1, 45), dtype: float64',
      'Cryptographic input hash: SHA-256 = 7c1e89b... (Logged for audit)',
    ],
    badge: 'Step 5 of 10',
    color: '#2563eb',
  },
  {
    stepNumber: 6,
    title: 'dev_preprocessor Transformation',
    phase: 'PROCESS',
    description: 'Applies the frozen preprocessor pipeline (SimpleImputer median + RobustScaler) fitted exclusively on the 80% training set.',
    inputs: [
      'dev_preprocessor.joblib (SHA-256: 04bd6412e87a...)',
      'Raw Feature Vector (1, 45)',
    ],
    process: 'Imputes any missing values using training medians; transforms skewed features with IQR RobustScaler to prevent outlier distortion.',
    outputs: [
      'Preprocessed feature matrix: X_scaled of shape (1, 45)',
      'Zero NaN values, strictly finite, outlier bounded',
    ],
    badge: 'Step 6 of 10',
    color: '#9333ea',
  },
  {
    stepNumber: 7,
    title: 'Parallel Multi-Model Inference',
    phase: 'PROCESS',
    description: 'Executes parallel predictions across 4 specialized production model artifacts loaded as thread-safe singletons.',
    inputs: [
      'total_xgboost_log1p.joblib (Direct Total)',
      'qib_random_forest_raw.joblib (QIB Model)',
      'nii_lightgbm_log1p.joblib (NII Model)',
      'retail_xgboost_raw.joblib (Retail Model)',
    ],
    process: 'Inference runs in parallel (<15ms). log1p models invert predictions using expm1(y) = exp(y) - 1. Raw models pass directly.',
    outputs: [
      'Direct Total Prediction: 23.7x',
      'Category Predictions: QIB = 18.5x, NII = 38.2x, Retail = 14.1x',
      'Weighted Reference: 20.0x (0.50Q + 0.15N + 0.35R)',
    ],
    badge: 'Step 7 of 10',
    color: '#059669',
  },
  {
    stepNumber: 8,
    title: 'TreeSHAP Local Explainability Computation',
    phase: 'OUTPUT',
    description: 'Calculates exact Shapley values using TreeExplainer to explain exactly why the AI predicted 23.7x for this specific IPO.',
    inputs: [
      'total_xgboost_log1p model tree ensemble',
      'IPO feature vector X_scaled',
    ],
    process: 'Decomposes prediction relative to historical base value E[f(x)] = 13.9x. Allocates positive and negative contribution credits.',
    outputs: [
      'Top Positive Drivers: GMP (+8.4x), FinBERT Sentiment (+3.2x), RoNW (+1.8x)',
      'Top Negative Drivers: Large Issue Size (-1.8x), Modest QIB Quota (-1.2x)',
      'Sum of SHAP attributions = Final Model Output (23.7x)',
    ],
    badge: 'Step 8 of 10',
    color: '#059669',
  },
  {
    stepNumber: 9,
    title: 'Risk & Confidence Interval Generation',
    phase: 'OUTPUT',
    description: 'Computes uncertainty bounds (5th to 95th percentile) and empirical probability of over-subscription.',
    inputs: [
      'Prediction residuals distribution and quantile regression estimators',
    ],
    process: 'Constructs 90% confidence interval: [P05 = 12.1x, P50 = 23.7x, P95 = 48.6x]. Integrates CDF to compute probability of >1.0x subscription.',
    outputs: [
      'Bearish Scenario (P05): 12.1x | Bullish Scenario (P95): 48.6x',
      'Over-Subscription Probability: > 99.4% (Extremely High)',
    ],
    badge: 'Step 9 of 10',
    color: '#0284c7',
  },
  {
    stepNumber: 10,
    title: 'Dashboard Delivery & Immutable Audit Stream',
    phase: 'OUTPUT',
    description: 'Delivers prediction to the React UI side-by-side with Live Observation tallies and appends an immutable record to the audit stream.',
    inputs: [
      'Inference payload, SHAP attributions, confidence bands, execution metadata',
    ],
    process: 'FastAPI sends JSON response to client. Appends single-line record to prediction_audit.jsonl with timestamp and SHA-256 hash.',
    outputs: [
      'UI displays Ex-Ante AI: 23.7x with clear "Pre-Opening Cutoff 09:59:59 IST" badge',
      'Dashboard displays Live NSE: 71.3x clearly labeled "Observation Only"',
      'Audit log written: prediction_audit.jsonl (Bit-for-bit reproducible)',
    ],
    badge: 'Step 10 of 10',
    color: '#10b981',
  },
];

export const PRODUCTION_MODELS_DATA: ModelArtifactInfo[] = [
  {
    name: 'dev_preprocessor.joblib',
    role: 'Canonical Feature Preprocessor',
    algorithm: 'SimpleImputer (Median) + RobustScaler (IQR)',
    sha256: '04bd6412e87a2f58e458784d1264c8c7f7636e05ff2636fa091924ca60775319',
    trainingTarget: '45 Canonical Features (Group G)',
    targetTransform: 'Median Imputation + Interquartile Range Scaling',
    frozenDate: '2026-09-17',
    status: 'FROZEN & VERIFIED',
  },
  {
    name: 'total_xgboost_log1p.joblib',
    role: 'Primary Direct Total Subscription Model',
    algorithm: 'XGBoost Regressor (150 trees, max_depth=4, Huber loss)',
    sha256: '3b00118ebae7cb6ea15d481f18fc479c3b8411d33194a085d777e48b3f1bf407',
    trainingTarget: 'Total Subscription (x)',
    targetTransform: 'log1p: log(1 + y) -> Inversion: expm1(y)',
    frozenDate: '2026-09-17',
    status: 'FROZEN & VERIFIED',
  },
  {
    name: 'qib_random_forest_raw.joblib',
    role: 'Qualified Institutional Buyer (QIB) Model',
    algorithm: 'Random Forest Regressor (200 estimators, max_depth=6)',
    sha256: '29188a798544c0174092fc91238bf3e7b16528d22384a51e60055cbdb981a8b9',
    trainingTarget: 'QIB Subscription (x)',
    targetTransform: 'Raw Target Scale (Direct)',
    frozenDate: '2026-09-17',
    status: 'FROZEN & VERIFIED',
  },
  {
    name: 'nii_lightgbm_log1p.joblib',
    role: 'Non-Institutional / HNI (NII) Model',
    algorithm: 'LightGBM Regressor (15 leaves, regression_l1 objective)',
    sha256: '618ef835bdf9bbcf96765103a890db076722d64ba821ad578fe6d1bc50c60fd7',
    trainingTarget: 'NII Subscription (x)',
    targetTransform: 'log1p: log(1 + y) -> Inversion: expm1(y)',
    frozenDate: '2026-09-17',
    status: 'FROZEN & VERIFIED',
  },
  {
    name: 'retail_xgboost_raw.joblib',
    role: 'Retail Individual Investor (RII) Model',
    algorithm: 'XGBoost Regressor (100 trees, max_depth=3, absolute loss)',
    sha256: '835ceb1fa9ae4675747e91d5aa11fec0b0292fcaef8677c7ec7a731d770c6751',
    trainingTarget: 'Retail Subscription (x)',
    targetTransform: 'Raw Target Scale (Direct)',
    frozenDate: '2026-09-17',
    status: 'FROZEN & VERIFIED',
  },
];

export const DATA_PROVENANCE_SOURCES: DataProvenanceSource[] = [
  {
    sourceName: 'SEBI Red Herring Prospectus (RHP)',
    dataType: 'Audited Financials, Valuation, Issue Terms, Risk Factors',
    collectionFrequency: 'Per IPO Filing (Ex-Ante)',
    cutoffEnforced: 'Published 3-5 days prior to Day 1 (<= 09:59:59 IST)',
    usedInAI: true,
  },
  {
    sourceName: 'BSE / NSE Anchor Investor Filings',
    dataType: 'Anchor allocation, Institutional count, Anchor bid ratio',
    collectionFrequency: 'Day -1 Evening (Ex-Ante)',
    cutoffEnforced: 'Recorded by 23:59:59 IST on Day -1',
    usedInAI: true,
  },
  {
    sourceName: 'Financial Media & Press Releases',
    dataType: 'Pre-IPO news headlines for FinBERT sentiment scoring',
    collectionFrequency: 'Pre-IPO Window (Day -7 to Day -1)',
    cutoffEnforced: 'Strictly articles published prior to Day 1 09:59:59 IST',
    usedInAI: true,
  },
  {
    sourceName: 'IPOWatch / Chittorgarh GMP Feeds',
    dataType: 'Indicative Grey Market Premium (GMP)',
    collectionFrequency: 'Pre-Opening (Day -1 Final)',
    cutoffEnforced: 'Day -1 closing quote. Intra-day trades during bidding discarded',
    usedInAI: true,
  },
  {
    sourceName: 'NSE Official Live Subscription Feed',
    dataType: 'Live QIB, NII, Retail, and Total subscription tallies',
    collectionFrequency: 'Hourly during active bidding (10:00 to 17:00 IST)',
    cutoffEnforced: 'POST-OPENING: STRICTLY BLOCKED FROM AI FEATURE STORE',
    usedInAI: false,
  },
  {
    sourceName: 'Exchange Final Allotment Bulletin',
    dataType: 'Final settled subscription outcome & listing open price',
    collectionFrequency: 'Post-Issue Close / Listing Day T+3',
    cutoffEnforced: 'POST-EVENT: Used ONLY for historical model validation',
    usedInAI: false,
  },
];
