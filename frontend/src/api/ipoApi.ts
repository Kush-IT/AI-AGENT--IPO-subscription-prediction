/**
 * Typed API Operations for Pre-IPO Analysis, Health, Models, and Schema.
 */
import { apiClient } from './client';
import {
  IPOAnalysisRequest,
  IPOAnalysisResponse,
  HealthResponse,
  ModelMetadataResponse,
  FormSchemaResponse,
  RetrainingStatusResponse,
  RetrainingHistoryRecord,
  RetrainingRunResponse,
} from './types';

export const ipoApi = {
  /**
   * Execute full Agentic AI Pre-IPO analysis.
   */
  analyzeIPO: async (payload: IPOAnalysisRequest): Promise<IPOAnalysisResponse> => {
    return apiClient.post<IPOAnalysisResponse>('/api/v1/ipo/analyze', payload);
  },

  /**
   * Check service health and connector operational states.
   */
  getHealth: async (): Promise<HealthResponse> => {
    return apiClient.get<HealthResponse>('/api/v1/health');
  },

  /**
   * Retrieve metadata and metrics for frozen ML models.
   */
  getModelsMetadata: async (): Promise<ModelMetadataResponse> => {
    return apiClient.get<ModelMetadataResponse>('/api/v1/models');
  },

  /**
   * Retrieve dynamic parameter schema catalog for form construction.
   */
  getFormSchema: async (): Promise<FormSchemaResponse> => {
    return apiClient.get<FormSchemaResponse>('/api/v1/schema');
  },

  /**
   * Retrieve weekly rolling retraining pipeline status.
   */
  getRetrainingStatus: async (): Promise<RetrainingStatusResponse> => {
    return apiClient.get<RetrainingStatusResponse>('/api/v1/monitoring/retraining/status');
  },

  /**
   * Retrieve weekly rolling retraining history ledger.
   */
  getRetrainingHistory: async (): Promise<RetrainingHistoryRecord[]> => {
    return apiClient.get<RetrainingHistoryRecord[]>('/api/v1/monitoring/retraining/history');
  },

  /**
   * Execute dry-run evaluation of weekly rolling retraining pipeline.
   */
  runRetrainingDryRun: async (runDate?: string | null): Promise<RetrainingRunResponse> => {
    return apiClient.post<RetrainingRunResponse>('/api/v1/monitoring/retraining/run', {
      run_date: runDate || null,
      dry_run: true,
      min_samples: 10,
      force_promote: false,
    });
  },
};

