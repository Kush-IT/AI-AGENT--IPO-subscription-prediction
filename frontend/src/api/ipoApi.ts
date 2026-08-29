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
};
