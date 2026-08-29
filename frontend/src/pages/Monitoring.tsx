import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Clock,
  PlusCircle,
  Database,
  CheckCircle2,
  ListFilter,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { formatMultiple } from '../utils/formatting';

interface MonitoringSummary {
  total_predictions_count: number;
  completed_outcomes_count: number;
  awaiting_outcomes_count: number;
  system_status: string;
  model_registry_version: string;
  model_integrity_verified: boolean;
  performance_summary?: {
    sample_count: number;
    total_mae?: number;
    qib_mae?: number;
    nii_mae?: number;
    retail_mae?: number;
    category_accuracy_pct?: number;
  };
  drift_summary?: {
    feature_drift_level: string;
    target_drift_level: string;
    model_status: string;
  };
}

interface ProspectiveRegistryEntry {
  ipo_id: string;
  company_name: string;
  isin: string;
  ipo_open_date: string;
  ipo_close_date: string;
  status: string;
  prediction_id?: string;
  prediction_timestamp?: string;
  outcome_timestamp?: string;
}

interface PredictionItem {
  prediction_id: string;
  company_name: string;
  ipo_open_date: string;
  predicted_total_subscription: number;
  predicted_qib_subscription: number;
  predicted_nii_subscription: number;
  predicted_retail_subscription: number;
  recommended_category: string;
  confidence_score: number;
  confidence_level: string;
  risk_level: string;
  prediction_status: string;
  temporal_validation_status: string;
}

interface CumulativeMetrics {
  number_of_completed_ipos: number;
  total_metrics?: {
    mae?: number;
    rmse?: number;
    median_ae?: number;
    mape?: number;
    mean_signed_bias?: number;
  };
  qib_metrics?: {
    mae?: number;
    rmse?: number;
    mape?: number;
  };
  nii_metrics?: {
    mae?: number;
    rmse?: number;
    mape?: number;
  };
  retail_metrics?: {
    mae?: number;
    rmse?: number;
    mape?: number;
  };
  category_recommendation_accuracy_pct?: number;
  confidence_calibration?: Record<string, { count: number; mean_mae: number; mean_mape_pct: number }>;
}

export const Monitoring: React.FC = () => {
  const queryClient = useQueryClient();
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedPredId, setSelectedPredId] = useState<string>('');
  const [outcomeForm, setOutcomeForm] = useState({
    company_name: '',
    ipo_close_date: '',
    actual_total_subscription: 0,
    actual_qib_subscription: 0,
    actual_nii_subscription: 0,
    actual_retail_subscription: 0,
    outcome_source: 'NSE',
    outcome_source_url: 'https://www.nseindia.com',
  });

  // 1. Fetch Summary
  const { data: summary } = useQuery<MonitoringSummary>({
    queryKey: ['monitoring-summary'],
    queryFn: () => apiClient.get('/api/v1/monitoring/summary'),
    refetchInterval: 10000,
  });

  // 2. Fetch Prospective Registry
  const { data: registryList = [] } = useQuery<ProspectiveRegistryEntry[]>({
    queryKey: ['prospective-registry'],
    queryFn: () => apiClient.get('/api/v1/monitoring/registry'),
    refetchInterval: 10000,
  });

  // 3. Fetch Predictions List
  const { data: predictionsList = [] } = useQuery<PredictionItem[]>({
    queryKey: ['monitoring-predictions'],
    queryFn: () => apiClient.get('/api/v1/monitoring/predictions'),
    refetchInterval: 10000,
  });

  // 4. Fetch Cumulative Metrics
  const { data: cumulativeMetrics } = useQuery<CumulativeMetrics>({
    queryKey: ['cumulative-metrics'],
    queryFn: () => apiClient.get('/api/v1/monitoring/metrics/cumulative'),
    refetchInterval: 10000,
  });

  // Mutation to Attach Outcome
  const attachMutation = useMutation({
    mutationFn: (data: { predId: string; payload: typeof outcomeForm }) =>
      apiClient.post(`/api/v1/monitoring/predictions/${data.predId}/outcome`, {
        prediction_id: data.predId,
        outcome_observed_at: new Date().toISOString(),
        ...data.payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring-summary'] });
      queryClient.invalidateQueries({ queryKey: ['monitoring-predictions'] });
      queryClient.invalidateQueries({ queryKey: ['prospective-registry'] });
      queryClient.invalidateQueries({ queryKey: ['cumulative-metrics'] });
      setShowAttachModal(false);
    },
  });

  const handleOpenAttach = (pred: PredictionItem) => {
    setSelectedPredId(pred.prediction_id);
    setOutcomeForm((prev) => ({
      ...prev,
      company_name: pred.company_name,
      ipo_close_date: pred.ipo_open_date,
    }));
    setShowAttachModal(true);
  };

  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPredId) return;
    attachMutation.mutate({ predId: selectedPredId, payload: outcomeForm });
  };

  const isModelStable = summary?.drift_summary?.model_status === 'STABLE';
  const completedCount = cumulativeMetrics?.number_of_completed_ipos ?? summary?.completed_outcomes_count ?? 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Banner */}
      <div className="card" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Activity size={22} color="var(--brand-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Prospective Model Monitoring & Forward Validation
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Out-of-sample forward prediction tracking, exchange outcome attachment, and PSI drift surveillance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-high" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
              <ShieldCheck size={14} /> MODEL INTEGRITY: VERIFIED
            </span>
            <span className="badge badge-neutral" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 700 }}>
              PROSPECTIVE N = {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prospective IPOs Registered</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
            {registryList.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Mainboard pipeline</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Forward Outcomes</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-positive)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Official NSE/BSE outcomes</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category Accuracy (N={completedCount})</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
            {cumulativeMetrics?.category_recommendation_accuracy_pct !== undefined && cumulativeMetrics.category_recommendation_accuracy_pct !== null
              ? `${cumulativeMetrics.category_recommendation_accuracy_pct}%`
              : 'N/A'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>Leading category edge rule</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Feature & Target Drift</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isModelStable ? 'var(--accent-positive)' : 'var(--accent-warning)', marginTop: '0.5rem' }}>
            {isModelStable ? 'STABLE' : 'REVIEW REQUIRED'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>PSI threshold surveillance</div>
        </div>
      </div>

      {/* Cumulative Performance Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={18} color="var(--brand-primary)" />
            <span>Cumulative Prospective Performance (N = {completedCount})</span>
          </h3>
          <span className="badge badge-neutral">Out-of-Sample Forward Validation</span>
        </div>

        {completedCount === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Clock size={24} color="var(--text-subtle)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Awaiting completion of live prospective offerings.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL SUBSCRIPTION</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
                MAE: {cumulativeMetrics?.total_metrics?.mae ? `${cumulativeMetrics.total_metrics.mae}×` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                MAPE: {cumulativeMetrics?.total_metrics?.mape ? `${cumulativeMetrics.total_metrics.mape}%` : 'N/A'}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>QIB INSTITUTIONAL</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
                MAE: {cumulativeMetrics?.qib_metrics?.mae ? `${cumulativeMetrics.qib_metrics.mae}×` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                MAPE: {cumulativeMetrics?.qib_metrics?.mape ? `${cumulativeMetrics.qib_metrics.mape}%` : 'N/A'}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>NII CORPORATE / HNI</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
                MAE: {cumulativeMetrics?.nii_metrics?.mae ? `${cumulativeMetrics.nii_metrics.mae}×` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                MAPE: {cumulativeMetrics?.nii_metrics?.mape ? `${cumulativeMetrics.nii_metrics.mape}%` : 'N/A'}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RETAIL INDIVIDUAL</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'JetBrains Mono', marginTop: '0.2rem' }}>
                MAE: {cumulativeMetrics?.retail_metrics?.mae ? `${cumulativeMetrics.retail_metrics.mae}×` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                MAPE: {cumulativeMetrics?.retail_metrics?.mape ? `${cumulativeMetrics.retail_metrics.mape}%` : 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prospective IPO Registry */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ListFilter size={18} color="var(--brand-primary)" />
            <span>Prospective IPO Registry</span>
          </h3>
          <span className="badge badge-neutral">{registryList.length} Issues Registered</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>IPO ID</th>
                <th>Company Name</th>
                <th>ISIN</th>
                <th>Open Date</th>
                <th>Close Date</th>
                <th>Status</th>
                <th>Prediction ID</th>
              </tr>
            </thead>
            <tbody>
              {registryList.map((entry) => (
                <tr key={entry.ipo_id}>
                  <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>{entry.ipo_id}</td>
                  <td style={{ fontWeight: 700 }}>{entry.company_name}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{entry.isin}</td>
                  <td style={{ fontSize: '0.78rem' }}>{entry.ipo_open_date}</td>
                  <td style={{ fontSize: '0.78rem' }}>{entry.ipo_close_date}</td>
                  <td>
                    <span className={`badge ${entry.status === 'COMPLETED' ? 'badge-high' : 'badge-medium'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                    {entry.prediction_id || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prospective Predictions Ledger */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Database size={18} color="var(--brand-primary)" />
            <span>Prospective Predictions Ledger</span>
          </h3>
          <span className="badge badge-neutral">{predictionsList.length} Total Records</span>
        </div>

        {predictionsList.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No prospective predictions logged yet.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Open Date</th>
                  <th>Predicted Total</th>
                  <th>Predicted QIB</th>
                  <th>Predicted NII</th>
                  <th>Predicted Retail</th>
                  <th>Best Category</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {predictionsList.map((pred) => (
                  <tr key={pred.prediction_id}>
                    <td style={{ fontWeight: 700 }}>{pred.company_name}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pred.ipo_open_date}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{formatMultiple(pred.predicted_total_subscription)}</td>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>{formatMultiple(pred.predicted_qib_subscription)}</td>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>{formatMultiple(pred.predicted_nii_subscription)}</td>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>{formatMultiple(pred.predicted_retail_subscription)}</td>
                    <td><span className="badge badge-neutral">{pred.recommended_category}</span></td>
                    <td><span className={`badge ${pred.confidence_level === 'HIGH' ? 'badge-high' : 'badge-medium'}`}>{pred.confidence_score}</span></td>
                    <td>
                      <span className={`badge ${pred.prediction_status === 'OUTCOME_RECORDED' ? 'badge-high' : 'badge-low'}`}>
                        {pred.prediction_status}
                      </span>
                    </td>
                    <td>
                      {pred.prediction_status === 'AWAITING_OUTCOME' && (
                        <button
                          onClick={() => handleOpenAttach(pred)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            backgroundColor: 'var(--brand-surface)',
                            color: 'var(--brand-primary)',
                            border: '1px solid var(--brand-primary)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <PlusCircle size={12} />
                          <span>Attach Outcome</span>
                        </button>
                      )}
                      {pred.prediction_status === 'OUTCOME_RECORDED' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-positive)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attach Outcome Modal */}
      {showAttachModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '480px', maxWidth: '90%', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Attach Verified Exchange Outcome
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Record official closing subscription tallies reported by NSE/BSE to compute prediction errors.
            </p>

            <form onSubmit={handleAttachSubmit}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" className="form-input" disabled value={outcomeForm.company_name} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Actual Total Multiple *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    value={outcomeForm.actual_total_subscription || ''}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, actual_total_subscription: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual QIB Multiple *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    value={outcomeForm.actual_qib_subscription || ''}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, actual_qib_subscription: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Actual NII Multiple *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    value={outcomeForm.actual_nii_subscription || ''}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, actual_nii_subscription: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Retail Multiple *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    value={outcomeForm.actual_retail_subscription || ''}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, actual_retail_subscription: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAttachModal(false)}
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: 600, border: '1px solid var(--border-strong)', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.45rem 1rem' }}
                  disabled={attachMutation.isPending}
                >
                  {attachMutation.isPending ? 'Saving...' : 'Save & Calculate Error'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
