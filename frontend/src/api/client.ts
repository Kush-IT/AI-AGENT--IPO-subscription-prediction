/**
 * Base HTTP Client for API Communications.
 * Configured with environment variable fallback, resilient error parsing,
 * and structured status code handling for network, validation, and server faults.
 */
import { ApiErrorResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (netErr: unknown) {
    // True network failure (connection refused, DNS error, CORS block)
    const message = 'Unable to connect to the backend. Please ensure the server is running on ' + API_BASE_URL;
    const error = new Error(message) as Error & { status: number; data: ApiErrorResponse };
    error.status = 503;
    error.data = {
      error_code: 'NETWORK_ERROR',
      message: 'Unable to connect to the backend.',
      details: {
        target_url: url,
        hint: 'Please check that the FastAPI server is running on ' + API_BASE_URL,
      },
    };
    throw error;
  }

  // Parse response payload safely
  let responseData: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      const text = await response.text();
      responseData = { message: text };
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    let errorMsg = `API Error: ${response.status} ${response.statusText}`;

    if (responseData && typeof responseData === 'object') {
      if (typeof responseData.message === 'string' && responseData.message.trim().length > 0) {
        errorMsg = responseData.message;
      } else if (typeof responseData.detail === 'string') {
        errorMsg = responseData.detail;
      } else if (Array.isArray(responseData.detail)) {
        // FastAPI default 422 detail format
        errorMsg = responseData.detail
          .map((d: any) => `${Array.isArray(d.loc) ? d.loc.filter((l: any) => l !== 'body').join('.') : 'field'}: ${d.msg || 'Invalid'}`)
          .join(', ');
      }
    }

    const err = new Error(errorMsg) as Error & { status: number; data: ApiErrorResponse };
    err.status = response.status;
    err.data = (responseData && typeof responseData === 'object' ? responseData : {
      error_code: `HTTP_${response.status}`,
      message: errorMsg,
    }) as ApiErrorResponse;

    throw err;
  }

  return responseData as T;
}

apiClient.get = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

apiClient.post = <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
  const isString = typeof body === 'string';
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? (isString ? (body as string) : JSON.stringify(body)) : undefined,
  });
};
