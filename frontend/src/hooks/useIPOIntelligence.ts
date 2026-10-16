/**
 * React Query Hooks for Live 15-Day IPO Intelligence & Forecasting.
 */
import { useQuery } from '@tanstack/react-query';
import {
  getMarketOverview,
  getLast15DaysIPOs,
  getActiveOpenIPOs,
  getNext15DaysIPOs,
  getIPODeepDive,
} from '../api/intelligenceApi';

export const useMarketOverview = (referenceDate?: string) => {
  return useQuery({
    queryKey: ['marketOverview', referenceDate],
    queryFn: () => getMarketOverview(referenceDate),
    staleTime: 60000,
    refetchInterval: 3600000, // 60-minute periodic background refetch
  });
};

export const useLast15DaysIPOs = (referenceDate?: string) => {
  return useQuery({
    queryKey: ['last15DaysIPOs', referenceDate],
    queryFn: () => getLast15DaysIPOs(referenceDate),
    staleTime: 60000,
    refetchInterval: 3600000, // 60-minute periodic background refetch
  });
};

export const useActiveOpenIPOs = (referenceDate?: string) => {
  return useQuery({
    queryKey: ['activeOpenIPOs', referenceDate],
    queryFn: () => getActiveOpenIPOs(referenceDate),
    staleTime: 60000,
    refetchInterval: 3600000, // 60-minute periodic background refetch
  });
};

export const useNext15DaysIPOs = (referenceDate?: string) => {
  return useQuery({
    queryKey: ['next15DaysIPOs', referenceDate],
    queryFn: () => getNext15DaysIPOs(referenceDate),
    staleTime: 60000,
    refetchInterval: 3600000, // 60-minute periodic background refetch
  });
};

export const useIPODeepDive = (ipoId?: string) => {
  return useQuery({
    queryKey: ['ipoDeepDive', ipoId],
    queryFn: () => (ipoId ? getIPODeepDive(ipoId) : Promise.reject('No IPO ID')),
    enabled: Boolean(ipoId),
    staleTime: 60000,
  });
};
