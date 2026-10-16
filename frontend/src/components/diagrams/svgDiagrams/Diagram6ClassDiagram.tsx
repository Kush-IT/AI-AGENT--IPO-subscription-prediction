import React from 'react';

export const Diagram6ClassDiagram: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: isModal ? '580px' : '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 960 560"
        style={{ width: '100%', height: '100%', maxHeight: isModal ? '760px' : '380px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="cls-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
          </marker>
          <marker id="cls-diamond" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="8" markerHeight="8">
            <polygon points="6,0 12,6 6,12 0,6" fill="#0f172a" />
          </marker>
        </defs>

        <rect width="960" height="560" rx="12" fill="#ffffff" />

        {/* TOP ROW: Core Domain Entities */}
        {/* Class: IPO */}
        <g transform="translate(30, 20)">
          <rect width="180" height="150" rx="4" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.5" />
          <rect width="180" height="24" rx="4" fill="#0284c7" />
          <text x="90" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">IPO</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ ipo_id: str</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ company_name: str</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ ipo_open_date: date</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ ipo_close_date: date</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ price_band: Tuple[float, float]</text>
          <text x="8" y="98" fill="#334155" fontSize="8" fontFamily="monospace">+ issue_size_cr: float</text>
          <text x="8" y="110" fill="#334155" fontSize="8" fontFamily="monospace">+ lot_size: int</text>
          <text x="8" y="122" fill="#334155" fontSize="8" fontFamily="monospace">+ sector: str</text>
          
          <line x1="0" y1="126" x2="180" y2="126" stroke="#cbd5e1" />
          <text x="8" y="138" fill="#059669" fontSize="8" fontFamily="monospace">+ is_open_for_bidding(): bool</text>
          <text x="8" y="148" fill="#059669" fontSize="8" fontFamily="monospace">+ get_cutoff_timestamp(): str</text>
        </g>

        {/* Association 1: IPO to Prediction */}
        <line x1="210" y1="95" x2="260" y2="95" stroke="#475569" strokeWidth="1.5" markerEnd="url(#cls-arr)" />
        <text x="215" y="88" fill="#64748b" fontSize="8" fontFamily="sans-serif">1</text>
        <text x="248" y="88" fill="#64748b" fontSize="8" fontFamily="sans-serif">1..*</text>

        {/* Class: Prediction */}
        <g transform="translate(260, 20)">
          <rect width="210" height="150" rx="4" fill="#faf5ff" stroke="#7c3aed" strokeWidth="1.5" />
          <rect width="210" height="24" rx="4" fill="#7c3aed" />
          <text x="105" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">Prediction</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ prediction_id: UUID</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ ipo_id: str</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ total_multiple: float</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ qib_multiple: float</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ nii_multiple: float</text>
          <text x="8" y="98" fill="#334155" fontSize="8" fontFamily="monospace">+ retail_multiple: float</text>
          <text x="8" y="110" fill="#334155" fontSize="8" fontFamily="monospace">+ ex_ante: bool = True</text>
          <text x="8" y="122" fill="#334155" fontSize="8" fontFamily="monospace">+ confidence_score: int</text>
          
          <line x1="0" y1="126" x2="210" y2="126" stroke="#e9d5ff" />
          <text x="8" y="138" fill="#7c3aed" fontSize="8" fontFamily="monospace">+ get_recommended_edge(): str</text>
          <text x="8" y="148" fill="#7c3aed" fontSize="8" fontFamily="monospace">+ verify_temporal_integrity(): bool</text>
        </g>

        {/* Association 2: IPO to ActualResult */}
        <line x1="470" y1="95" x2="520" y2="95" stroke="#475569" strokeWidth="1.5" markerEnd="url(#cls-arr)" />
        <text x="475" y="88" fill="#64748b" fontSize="8" fontFamily="sans-serif">1</text>
        <text x="508" y="88" fill="#64748b" fontSize="8" fontFamily="sans-serif">0..1</text>

        {/* Class: ActualResult */}
        <g transform="translate(520, 20)">
          <rect width="180" height="150" rx="4" fill="#f0fdf4" stroke="#059669" strokeWidth="1.5" />
          <rect width="180" height="24" rx="4" fill="#059669" />
          <text x="90" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">ActualResult (Outcome)</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ ipo_id: str</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ actual_total: float</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ actual_qib: float</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ actual_nii: float</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ actual_retail: float</text>
          <text x="8" y="98" fill="#334155" fontSize="8" fontFamily="monospace">+ listing_price: float</text>
          <text x="8" y="110" fill="#334155" fontSize="8" fontFamily="monospace">+ published_at: datetime</text>
          <text x="8" y="122" fill="#334155" fontSize="8" fontFamily="monospace">+ verified: bool</text>
          
          <line x1="0" y1="126" x2="180" y2="126" stroke="#bbf7d0" />
          <text x="8" y="138" fill="#059669" fontSize="8" fontFamily="monospace">+ calculate_error(pred): ErrorMetric</text>
          <text x="8" y="148" fill="#059669" fontSize="8" fontFamily="monospace">+ is_post_close(): bool</text>
        </g>

        {/* Class: FeatureSnapshot */}
        <g transform="translate(730, 20)">
          <rect width="200" height="150" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <rect width="200" height="24" rx="4" fill="#475569" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="11" fontFamily="sans-serif">FeatureSnapshot</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ snapshot_id: str</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ ipo_id: str</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ features_json: Dict[str, Any]</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ canonical_count: int = 45</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ captured_at: datetime</text>
          <text x="8" y="98" fill="#334155" fontSize="8" fontFamily="monospace">+ cutoff_ts: datetime</text>
          <text x="8" y="110" fill="#334155" fontSize="8" fontFamily="monospace">+ hash_digest: str</text>
          
          <line x1="0" y1="126" x2="200" y2="126" stroke="#cbd5e1" />
          <text x="8" y="138" fill="#475569" fontSize="8" fontFamily="monospace">+ validate_completeness(): float</text>
          <text x="8" y="148" fill="#475569" fontSize="8" fontFamily="monospace">+ export_matrix(): np.ndarray</text>
        </g>

        {/* MIDDLE ROW: Service & Preprocessing Layer */}
        {/* Class: LiveIPODiscoveryService */}
        <g transform="translate(30, 200)">
          <rect width="200" height="150" rx="4" fill="#f0fdf4" stroke="#059669" strokeWidth="1.2" />
          <rect width="200" height="24" rx="4" fill="#047857" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">LiveIPODiscoveryService</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ cache_ttl_seconds: int = 3600</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ last_refresh_ist: str</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ freshness_status: str</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ nse_connector: NSEConnector</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ gmp_connector: GMPConnector</text>
          
          <line x1="0" y1="94" x2="200" y2="94" stroke="#bbf7d0" />
          <text x="8" y="106" fill="#065f46" fontSize="8" fontFamily="monospace">+ get_live_ipos(force): Dict</text>
          <text x="8" y="118" fill="#065f46" fontSize="8" fontFamily="monospace">+ fetch_nse_tallies(): List[IPO]</text>
          <text x="8" y="130" fill="#065f46" fontSize="8" fontFamily="monospace">+ fetch_indicative_gmp(): Dict</text>
          <text x="8" y="142" fill="#065f46" fontSize="8" fontFamily="monospace">+ handle_stale_fallback(): Dict</text>
        </g>

        {/* Class: FoldPreprocessor */}
        <g transform="translate(260, 200)">
          <rect width="210" height="150" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.2" />
          <rect width="210" height="24" rx="4" fill="#1d4ed8" />
          <text x="105" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">FoldPreprocessor</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ medians_: Dict[str, float]</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ category_maps_: Dict[str, Any]</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ winsor_bounds_: Dict[str, Tuple]</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ feature_cols: List[str] (45)</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ artifact: dev_preprocessor.joblib</text>
          
          <line x1="0" y1="94" x2="210" y2="94" stroke="#bfdbfe" />
          <text x="8" y="106" fill="#1e40af" fontSize="8" fontFamily="monospace">+ fit(X, y): FoldPreprocessor</text>
          <text x="8" y="118" fill="#1e40af" fontSize="8" fontFamily="monospace">+ transform(df, cols): np.ndarray</text>
          <text x="8" y="130" fill="#1e40af" fontSize="8" fontFamily="monospace">+ impute_missing_medians(): df</text>
          <text x="8" y="142" fill="#1e40af" fontSize="8" fontFamily="monospace">+ encode_frequencies(): df</text>
        </g>

        {/* Class: PredictionTool */}
        <g transform="translate(500, 200)">
          <rect width="200" height="150" rx="4" fill="#faf5ff" stroke="#9333ea" strokeWidth="1.2" />
          <rect width="200" height="24" rx="4" fill="#7e22ce" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">PredictionTool</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ models: Dict[str, BaseEstimator]</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ preprocessor: FoldPreprocessor</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ metadata: Dict[str, Any]</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ model_dir: Path</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ cache_ttl: int = 3600</text>
          
          <line x1="0" y1="94" x2="200" y2="94" stroke="#e9d5ff" />
          <text x="8" y="106" fill="#6b21a8" fontSize="8" fontFamily="monospace">+ predict_all_targets(feat): Dict</text>
          <text x="8" y="118" fill="#6b21a8" fontSize="8" fontFamily="monospace">+ verify_integrity(): Tuple[bool, h]</text>
          <text x="8" y="130" fill="#6b21a8" fontSize="8" fontFamily="monospace">+ inverse_transform(log_pred): float</text>
          <text x="8" y="142" fill="#6b21a8" fontSize="8" fontFamily="monospace">+ generate_ml_predictions(): Dict</text>
        </g>

        {/* Class: SHAPExplanation & RiskAnalyzer */}
        <g transform="translate(730, 200)">
          <rect width="200" height="150" rx="4" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" />
          <rect width="200" height="24" rx="4" fill="#b45309" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">SHAP &amp; Risk Engines</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ shap_explainer: TreeExplainer</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ risk_rules: List[RiskFactor]</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ max_confidence: int = 82</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ base_values_: float</text>
          
          <line x1="0" y1="84" x2="200" y2="84" stroke="#fde68a" />
          <text x="8" y="98" fill="#92400e" fontSize="8" fontFamily="monospace">+ explain_prediction_features(): Dict</text>
          <text x="8" y="110" fill="#92400e" fontSize="8" fontFamily="monospace">+ extract_top_factors(k=3): Tuple</text>
          <text x="8" y="122" fill="#92400e" fontSize="8" fontFamily="monospace">+ calculate_composite_risk(): int</text>
          <text x="8" y="134" fill="#92400e" fontSize="8" fontFamily="monospace">+ calculate_calibrated_conf(): int</text>
          <text x="8" y="146" fill="#92400e" fontSize="8" fontFamily="monospace">+ evaluate_category_edge(): str</text>
        </g>

        {/* BOTTOM ROW: Monitoring, Retraining & Router */}
        {/* Class: MonitoringService */}
        <g transform="translate(30, 380)">
          <rect width="200" height="150" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.2" />
          <rect width="200" height="24" rx="4" fill="#334155" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">MonitoringService</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ drift_threshold_psi: float = 0.25</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ retrospective_df: DataFrame</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ error_tracker: ErrorAnalysis</text>
          
          <line x1="0" y1="74" x2="200" y2="74" stroke="#cbd5e1" />
          <text x="8" y="90" fill="#1e293b" fontSize="8" fontFamily="monospace">+ compute_psi(dist_a, dist_b): float</text>
          <text x="8" y="104" fill="#1e293b" fontSize="8" fontFamily="monospace">+ audit_prospective_predictions(): List</text>
          <text x="8" y="118" fill="#1e293b" fontSize="8" fontFamily="monospace">+ generate_drift_summary(): Dict</text>
          <text x="8" y="132" fill="#1e293b" fontSize="8" fontFamily="monospace">+ log_daily_metrics(): bool</text>
        </g>

        {/* Class: RetrainingService */}
        <g transform="translate(260, 380)">
          <rect width="210" height="150" rx="4" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.2" />
          <rect width="210" height="24" rx="4" fill="#b91c1c" />
          <text x="105" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">RetrainingService (Quarantine)</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ min_samples_threshold: int = 10</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ auto_promotion: bool = False</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ candidate_dir: Path</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ manifest_path: Path</text>
          
          <line x1="0" y1="84" x2="210" y2="84" stroke="#fecaca" />
          <text x="8" y="98" fill="#991b1b" fontSize="8" fontFamily="monospace">+ run_weekly_retraining(req): Result</text>
          <text x="8" y="110" fill="#991b1b" fontSize="8" fontFamily="monospace">+ enforce_sample_gate(n): bool</text>
          <text x="8" y="122" fill="#991b1b" fontSize="8" fontFamily="monospace">+ stage_candidate(manifest): void</text>
          <text x="8" y="134" fill="#991b1b" fontSize="8" fontFamily="monospace">+ compare_against_frozen(): Decision</text>
        </g>

        {/* Class: ModelAuditLog */}
        <g transform="translate(500, 380)">
          <rect width="200" height="150" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
          <rect width="200" height="24" rx="4" fill="#475569" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">ModelAuditLog (Audit)</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ log_id: UUID</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ checked_at: datetime</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ sha256_digests: Dict[str, str]</text>
          <text x="8" y="74" fill="#334155" fontSize="8" fontFamily="monospace">+ verified_match: bool = True</text>
          <text x="8" y="86" fill="#334155" fontSize="8" fontFamily="monospace">+ file_path: prediction_audit.jsonl</text>
          
          <line x1="0" y1="94" x2="200" y2="94" stroke="#cbd5e1" />
          <text x="8" y="108" fill="#334155" fontSize="8" fontFamily="monospace">+ append_audit_entry(data): void</text>
          <text x="8" y="122" fill="#334155" fontSize="8" fontFamily="monospace">+ verify_official_hashes(): bool</text>
          <text x="8" y="136" fill="#334155" fontSize="8" fontFamily="monospace">+ raise_on_mutation(): void</text>
        </g>

        {/* Class: APIRouter (FastAPI) */}
        <g transform="translate(730, 380)">
          <rect width="200" height="150" rx="4" fill="#eff6ff" stroke="#0284c7" strokeWidth="1.2" />
          <rect width="200" height="24" rx="4" fill="#0369a1" />
          <text x="100" y="16" textAnchor="middle" fill="#ffffff" fontWeight="700" fontSize="10.5" fontFamily="sans-serif">FastAPI Intelligence Routes</text>
          
          <text x="8" y="38" fill="#334155" fontSize="8" fontFamily="monospace">+ prefix: /api/v1/ipo</text>
          <text x="8" y="50" fill="#334155" fontSize="8" fontFamily="monospace">+ monitoring_prefix: /api/v1/monitor</text>
          <text x="8" y="62" fill="#334155" fontSize="8" fontFamily="monospace">+ tags: ["IPO Intelligence"]</text>
          
          <line x1="0" y1="74" x2="200" y2="74" stroke="#bfdbfe" />
          <text x="8" y="88" fill="#0284c7" fontSize="8" fontFamily="monospace">+ get_active_open(): List[Card]</text>
          <text x="8" y="100" fill="#0284c7" fontSize="8" fontFamily="monospace">+ get_next_15_days(): List[Card]</text>
          <text x="8" y="112" fill="#0284c7" fontSize="8" fontFamily="monospace">+ get_last_15_days(): List[Card]</text>
          <text x="8" y="124" fill="#0284c7" fontSize="8" fontFamily="monospace">+ get_hourly_status(): Dict</text>
          <text x="8" y="136" fill="#0284c7" fontSize="8" fontFamily="monospace">+ analyze_custom_ipo(): Result</text>
        </g>
      </svg>
    </div>
  );
};
