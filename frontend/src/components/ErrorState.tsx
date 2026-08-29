import React from 'react';
import { AlertCircle, RefreshCw, WifiOff, AlertTriangle, ServerCrash } from 'lucide-react';
import { ApiErrorResponse } from '../api/types';

interface ErrorStateProps {
  error: (Error & { status?: number; data?: ApiErrorResponse }) | null;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const errorData = error?.data;
  const status = error?.status;
  const isNetworkError = status === 503 || status === 504 || errorData?.error_code === 'NETWORK_ERROR';
  const isValidationError = status === 400 || status === 422 || errorData?.error_code === 'PYDANTIC_VALIDATION_ERROR' || errorData?.error_code === 'INVALID_IPO_INPUT';
  const isServerError = status === 500 || errorData?.error_code === 'INTERNAL_SERVER_ERROR';

  const requestId = errorData?.request_id;
  const message = errorData?.message || error?.message || 'An unexpected error occurred while analyzing the IPO.';

  // Extract structured validation errors if present
  const detailsObj = errorData?.details as Record<string, unknown> | undefined;
  const rawErrors = (detailsObj?.validation_errors || detailsObj?.errors) as
    | Array<string | { loc?: (string | number)[]; msg?: string }>
    | undefined;

  const validationErrorsList: string[] = [];
  if (Array.isArray(rawErrors)) {
    for (const item of rawErrors) {
      if (typeof item === 'string') {
        validationErrorsList.push(item);
      } else if (item && typeof item === 'object') {
        const fieldLoc = Array.isArray(item.loc)
          ? item.loc.filter((l) => l !== 'body').join('.')
          : '';
        const msg = item.msg || 'Invalid value';
        validationErrorsList.push(fieldLoc ? `${fieldLoc}: ${msg}` : msg);
      }
    }
  }

  // Title and icon based on error category
  let errorTitle = 'Analysis Request Failed';
  let IconComponent = AlertCircle;
  if (isNetworkError) {
    errorTitle = 'Backend Connection Notice';
    IconComponent = WifiOff;
  } else if (isValidationError) {
    errorTitle = 'Input Validation Notice (HTTP ' + (status || 422) + ')';
    IconComponent = AlertTriangle;
  } else if (isServerError) {
    errorTitle = 'Server Processing Error (HTTP 500)';
    IconComponent = ServerCrash;
  }

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--accent-negative)', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ color: 'var(--accent-negative)', marginTop: '0.15rem' }}>
          <IconComponent size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-negative)', marginBottom: '0.35rem' }}>
            {errorTitle}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            {message}
          </p>

          {validationErrorsList.length > 0 && (
            <div style={{ backgroundColor: 'var(--accent-negative-bg)', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.35rem' }}>
                Field-Level Validation Requirements:
              </p>
              <ul style={{ fontSize: '0.82rem', color: '#991b1b', paddingLeft: '1.2rem', margin: 0 }}>
                {validationErrorsList.map((errStr, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{errStr}</li>
                ))}
              </ul>
            </div>
          )}

          {requestId && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
              Request Tracing ID: <span className="mono">{requestId}</span>
            </p>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Modify Input & Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
