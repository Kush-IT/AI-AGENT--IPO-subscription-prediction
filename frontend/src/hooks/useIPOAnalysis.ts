/**
 * Custom React Hook for Managing IPO Analysis Mutation and Results State.
 */
import { useMutation } from '@tanstack/react-query';
import { ipoApi } from '../api/ipoApi';
import { IPOAnalysisRequest, IPOAnalysisResponse, ApiErrorResponse } from '../api/types';

export function useIPOAnalysis() {
  const mutation = useMutation<
    IPOAnalysisResponse,
    Error & { status?: number; data?: ApiErrorResponse },
    IPOAnalysisRequest
  >({
    mutationFn: (requestData: IPOAnalysisRequest) => ipoApi.analyzeIPO(requestData),
  });

  return {
    analyze: mutation.mutate,
    analyzeAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
