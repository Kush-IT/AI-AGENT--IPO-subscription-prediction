/**
 * Live 15-Day IPO Intelligence & Forecasting API Client.
 * Connects to FastAPI /api/v1/ipo/* endpoints with full type safety.
 */
import { apiClient } from './client';
import {
  MarketOverviewSummaryData,
  PastIPOResultData,
  UpcomingIPOForecastData,
  IPODeepDiveResponseData,
  SourcesHealthData,
} from './types';

export const getMarketOverview = async (referenceDate?: string, forceRefresh?: boolean): Promise<MarketOverviewSummaryData> => {
  const params = new URLSearchParams();
  if (referenceDate) params.append('reference_date', referenceDate);
  if (forceRefresh) params.append('force_refresh', 'true');
  const qs = params.toString();
  return apiClient.get<MarketOverviewSummaryData>(`/api/v1/ipo/overview${qs ? `?${qs}` : ''}`);
};

export const getLast15DaysIPOs = async (referenceDate?: string): Promise<PastIPOResultData[]> => {
  const params = new URLSearchParams();
  if (referenceDate) params.append('reference_date', referenceDate);
  const qs = params.toString();
  return apiClient.get<PastIPOResultData[]>(`/api/v1/ipo/last-15-days${qs ? `?${qs}` : ''}`);
};

export const getActiveOpenIPOs = async (referenceDate?: string, forceRefresh?: boolean): Promise<UpcomingIPOForecastData[]> => {
  const params = new URLSearchParams();
  if (referenceDate) params.append('reference_date', referenceDate);
  if (forceRefresh) params.append('force_refresh', 'true');
  const qs = params.toString();
  return apiClient.get<UpcomingIPOForecastData[]>(`/api/v1/ipo/active-open${qs ? `?${qs}` : ''}`);
};

export const getNext15DaysIPOs = async (referenceDate?: string, forceRefresh?: boolean): Promise<UpcomingIPOForecastData[]> => {
  const params = new URLSearchParams();
  if (referenceDate) params.append('reference_date', referenceDate);
  if (forceRefresh) params.append('force_refresh', 'true');
  const qs = params.toString();
  return apiClient.get<UpcomingIPOForecastData[]>(`/api/v1/ipo/next-15-days${qs ? `?${qs}` : ''}`);
};

export const getIPODeepDive = async (ipoId: string): Promise<IPODeepDiveResponseData> => {
  return apiClient.get<IPODeepDiveResponseData>(`/api/v1/ipo/${encodeURIComponent(ipoId)}`);
};

export const getSourcesHealth = async (): Promise<SourcesHealthData> => {
  return apiClient.get<SourcesHealthData>('/api/v1/ipo/sources/health');
};

