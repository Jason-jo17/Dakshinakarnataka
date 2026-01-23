
export const formatCurrency = (value: number, decimals = 1): string => {
  return `₹${value.toFixed(decimals)} LPA`;
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-IN');
};

export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getGapSeverity = (gapPercent: number): 'critical' | 'high' | 'medium' | 'low' => {
  if (gapPercent >= 60) return 'critical';
  if (gapPercent >= 40) return 'high';
  if (gapPercent >= 20) return 'medium';
  return 'low';
};

export const SEVERITY_COLORS = {
  critical: '#dc2626',  // red-600
  high: '#ea580c',      // orange-600
  medium: '#d97706',    // amber-600
  low: '#65a30d',       // lime-600
};
