import React from 'react';

export const DiagramDataModel: React.FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  return (
    <svg
      viewBox="0 0 1100 700"
      className={`w-full h-auto font-sans select-none ${isModal ? 'max-h-[82vh]' : 'max-h-[500px]'}`}
      style={{ backgroundColor: '#090d16' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="dmArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
        </marker>
      </defs>

      {/* Grid Background */}
      <pattern id="dmGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeOpacity="0.4" />
      </pattern>
      <rect width="1100" height="700" fill="url(#dmGrid)" />

      {/* Header Banner */}
      <rect x="30" y="20" width="1040" height="50" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="50" y="52" fill="#f8fafc" fontSize="18" fontWeight="700" letterSpacing="0.5">
        Logical &amp; Physical Data Model: Schemas, Feature Matrices &amp; Audit Payloads
      </text>
      <text x="750" y="51" fill="#38bdf8" fontSize="12" fontWeight="600">
        In-Memory Structs • Relational Entities • Cache Hashes
      </text>

      {/* Model 1: IPOEntity Schema */}
      <rect x="40" y="100" width="220" height="230" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="40" y="100" width="220" height="30" rx="6" fill="#0284c7" />
      <text x="150" y="121" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">IPOEntity (Base Schema)</text>
      <text x="55" y="150" fill="#38bdf8" fontSize="10">id: string (PK, UUIDv4)</text>
      <text x="55" y="170" fill="#f8fafc" fontSize="10">symbol: string (Index, Unique)</text>
      <text x="55" y="190" fill="#f8fafc" fontSize="10">company_name: string</text>
      <text x="55" y="210" fill="#f8fafc" fontSize="10">issue_open_date: date</text>
      <text x="55" y="230" fill="#f8fafc" fontSize="10">issue_close_date: date</text>
      <text x="55" y="250" fill="#f8fafc" fontSize="10">price_band_min: float</text>
      <text x="55" y="270" fill="#f8fafc" fontSize="10">price_band_max: float</text>
      <text x="55" y="290" fill="#f8fafc" fontSize="10">issue_size_cr: float</text>
      <text x="55" y="310" fill="#10b981" fontSize="10">status: OfferingStatus (Enum)</text>

      {/* Model 2: Canonical Feature Vector (In-Memory 1x45) */}
      <rect x="310" y="100" width="230" height="230" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <rect x="310" y="100" width="230" height="30" rx="6" fill="#059669" />
      <text x="425" y="121" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">FeatureVector (1x45 Matrix)</text>
      <text x="325" y="150" fill="#10b981" fontSize="10">schema_version: "Group_G"</text>
      <text x="325" y="170" fill="#f8fafc" fontSize="10">gmp_percentage: float [ex-ante]</text>
      <text x="325" y="190" fill="#f8fafc" fontSize="10">pe_ratio / pb_ratio: float</text>
      <text x="325" y="210" fill="#f8fafc" fontSize="10">qib_quota_ratio: float (0.50)</text>
      <text x="325" y="230" fill="#f8fafc" fontSize="10">anchor_investor_ratio: float</text>
      <text x="325" y="250" fill="#f8fafc" fontSize="10">finbert_sentiment_score: float</text>
      <text x="325" y="270" fill="#f8fafc" fontSize="10">nifty_trailing_return_30d: float</text>
      <text x="325" y="290" fill="#f59e0b" fontSize="10">missing_strategy: NaN &rarr; Median</text>
      <text x="325" y="310" fill="#ef4444" fontSize="10">post_open_features: FORBIDDEN</text>

      {/* Model 3: PredictionRecord Entity */}
      <rect x="580" y="100" width="230" height="230" rx="6" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
      <rect x="580" y="100" width="230" height="30" rx="6" fill="#7e22ce" />
      <text x="695" y="121" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">PredictionRecord (Entity)</text>
      <text x="595" y="150" fill="#c084fc" fontSize="10">id: string (PK)</text>
      <text x="595" y="170" fill="#f8fafc" fontSize="10">ipo_id: string (FK &rarr; IPOEntity)</text>
      <text x="595" y="190" fill="#f8fafc" fontSize="10">predicted_total: float</text>
      <text x="595" y="210" fill="#f8fafc" fontSize="10">predicted_qib: float</text>
      <text x="595" y="230" fill="#f8fafc" fontSize="10">predicted_nii: float</text>
      <text x="595" y="250" fill="#f8fafc" fontSize="10">predicted_retail: float</text>
      <text x="595" y="270" fill="#f8fafc" fontSize="10">model_confidence_r2: float (0.67)</text>
      <text x="595" y="290" fill="#f8fafc" fontSize="10">generated_at: timestamp (UTC)</text>
      <text x="595" y="310" fill="#10b981" fontSize="10">is_ex_ante_valid: boolean (true)</text>

      {/* Model 4: SHAPExplainerSnapshot */}
      <rect x="840" y="100" width="220" height="230" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
      <rect x="840" y="100" width="220" height="30" rx="6" fill="#d97706" />
      <text x="950" y="121" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">SHAPSnapshot (Payload)</text>
      <text x="855" y="150" fill="#fcd34d" fontSize="10">prediction_id: string (FK)</text>
      <text x="855" y="170" fill="#f8fafc" fontSize="10">base_value: float (expected val)</text>
      <text x="855" y="190" fill="#f8fafc" fontSize="10">feature_importances: dict[str, fl]</text>
      <text x="855" y="210" fill="#10b981" fontSize="10">top_positive_features: list[tuple]</text>
      <text x="855" y="230" fill="#ef4444" fontSize="10">top_negative_features: list[tuple]</text>
      <text x="855" y="250" fill="#f8fafc" fontSize="10">narrative_explanation: string</text>
      <text x="855" y="270" fill="#f8fafc" fontSize="10">waterfall_plot_json: string</text>
      <text x="855" y="290" fill="#f8fafc" fontSize="10">tree_limit: integer (100)</text>
      <text x="855" y="310" fill="#38bdf8" fontSize="10">shap_version: "0.46.0"</text>

      {/* Model 5: ObservationLiveNSE */}
      <rect x="40" y="370" width="220" height="230" rx="6" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
      <rect x="40" y="370" width="220" height="30" rx="6" fill="#be185d" />
      <text x="150" y="391" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">ObservationLiveNSE (Feed)</text>
      <text x="55" y="420" fill="#f472b6" fontSize="10">ipo_symbol: string (FK)</text>
      <text x="55" y="440" fill="#f8fafc" fontSize="10">polled_timestamp: timestamp</text>
      <text x="55" y="460" fill="#f8fafc" fontSize="10">qib_subscription_live: float</text>
      <text x="55" y="480" fill="#f8fafc" fontSize="10">nii_subscription_live: float</text>
      <text x="55" y="500" fill="#f8fafc" fontSize="10">retail_subscription_live: float</text>
      <text x="55" y="520" fill="#f8fafc" fontSize="10">total_subscription_live: float</text>
      <text x="55" y="540" fill="#f8fafc" fontSize="10">bidding_day: integer (1 to 3)</text>
      <text x="55" y="560" fill="#ef4444" fontSize="10">ai_feature_leak_flag: false</text>
      <text x="55" y="580" fill="#38bdf8" fontSize="10">cache_ttl_sec: 3600 (1 hour)</text>

      {/* Model 6: DriftMonitoringMetric */}
      <rect x="310" y="370" width="230" height="230" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
      <rect x="310" y="370" width="230" height="30" rx="6" fill="#0891b2" />
      <text x="425" y="391" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">DriftMetricRecord</text>
      <text x="325" y="420" fill="#67e8f9" fontSize="10">metric_id: string (PK)</text>
      <text x="325" y="440" fill="#f8fafc" fontSize="10">evaluation_window_days: 90</text>
      <text x="325" y="460" fill="#f8fafc" fontSize="10">psi_score: float (Pop. Stability)</text>
      <text x="325" y="480" fill="#f8fafc" fontSize="10">mae_actual_vs_pred: float</text>
      <text x="325" y="500" fill="#f8fafc" fontSize="10">mean_bias_ratio: float</text>
      <text x="325" y="520" fill="#f8fafc" fontSize="10">is_drift_detected: boolean</text>
      <text x="325" y="540" fill="#f8fafc" fontSize="10">drift_threshold: 0.25</text>
      <text x="325" y="560" fill="#f59e0b" fontSize="10">quarantine_flag: boolean</text>
      <text x="325" y="580" fill="#10b981" fontSize="10">evaluated_at: timestamp</text>

      {/* Model 7: CandidateModelManifest */}
      <rect x="580" y="370" width="230" height="230" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
      <rect x="580" y="370" width="230" height="30" rx="6" fill="#6d28d9" />
      <text x="695" y="391" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">CandidateManifest</text>
      <text x="595" y="420" fill="#c4b5fd" fontSize="10">candidate_id: string (UUID)</text>
      <text x="595" y="440" fill="#f8fafc" fontSize="10">target_column: string</text>
      <text x="595" y="460" fill="#f8fafc" fontSize="10">algorithm_type: string</text>
      <text x="595" y="480" fill="#f8fafc" fontSize="10">hyperparameters: json</text>
      <text x="595" y="500" fill="#f8fafc" fontSize="10">walk_forward_mae: float</text>
      <text x="595" y="520" fill="#f8fafc" fontSize="10">walk_forward_r2: float</text>
      <text x="595" y="540" fill="#ef4444" fontSize="10">storage_path: "models/retrained/"</text>
      <text x="595" y="560" fill="#f59e0b" fontSize="10">promotion_gate_approved: false</text>
      <text x="595" y="580" fill="#10b981" fontSize="10">sha256_checksum: string (64)</text>

      {/* Model 8: ModelIntegrityAudit */}
      <rect x="840" y="370" width="220" height="230" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <rect x="840" y="370" width="220" height="30" rx="6" fill="#047857" />
      <text x="950" y="391" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">ModelIntegrityAudit</text>
      <text x="855" y="420" fill="#6ee7b7" fontSize="10">audit_timestamp: timestamp</text>
      <text x="855" y="440" fill="#f8fafc" fontSize="10">file_dev_preprocessor: sha256</text>
      <text x="855" y="460" fill="#f8fafc" fontSize="10">file_total_xgboost: sha256</text>
      <text x="855" y="480" fill="#f8fafc" fontSize="10">file_qib_random_forest: sha256</text>
      <text x="855" y="500" fill="#f8fafc" fontSize="10">file_nii_lightgbm: sha256</text>
      <text x="855" y="520" fill="#f8fafc" fontSize="10">file_retail_xgboost: sha256</text>
      <text x="855" y="540" fill="#10b981" fontSize="10">all_hashes_verified: true</text>
      <text x="855" y="560" fill="#f8fafc" fontSize="10">system_caller: FastAPI Startup</text>
      <text x="855" y="580" fill="#38bdf8" fontSize="10">tamper_lock: ENFORCED</text>

      {/* Relationships */}
      <path d="M 260 200 L 310 200" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#dmArrow)" />
      <path d="M 540 200 L 580 200" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#dmArrow)" />
      <path d="M 810 200 L 840 200" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#dmArrow)" />
      <path d="M 150 330 L 150 370" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#dmArrow)" />
      <path d="M 700 330 L 700 370" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#dmArrow)" />

      {/* Legend Box */}
      <rect x="30" y="630" width="1040" height="50" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <rect x="50" y="647" width="16" height="16" rx="3" fill="#0284c7" />
      <text x="75" y="659" fill="#94a3b8" fontSize="10">Core Relational Entity</text>
      <rect x="220" y="647" width="16" height="16" rx="3" fill="#059669" />
      <text x="245" y="659" fill="#94a3b8" fontSize="10">45-Feature Matrix (In-Memory)</text>
      <rect x="420" y="647" width="16" height="16" rx="3" fill="#be185d" />
      <text x="445" y="659" fill="#94a3b8" fontSize="10">Live Observation (Isolated Feed)</text>
      <text x="700" y="659" fill="#38bdf8" fontSize="10" fontWeight="600">Integrity Principle: Foreign keys validate against SEBI ticker anchors</text>
    </svg>
  );
};
