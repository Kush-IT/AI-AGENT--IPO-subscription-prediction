/**
 * Financial and Quantitative Data Formatting Utilities.
 */

export function formatMultiple(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${val.toFixed(2)}×`;
}

export function formatPercent(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${val.toFixed(2)}%`;
}

export function formatCurrencyINR(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatCrores(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
}

export function formatSHAP(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '0.0000';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(4)}`;
}

export function formatTimestamp(isoStr: string | null | undefined): string {
  if (!isoStr) return 'N/A';
  try {
    const dt = new Date(isoStr);
    return dt.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return isoStr;
  }
}
