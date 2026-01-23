export const CHART_COLORS = {
  primary: '#3b82f6',       // blue-500
  secondary: '#10b981',     // emerald-500
  accent: '#f59e0b',        // amber-500
  danger: '#ef4444',        // red-500
  success: '#22c55e',       // green-500
  warning: '#eab308',       // yellow-500
  info: '#6366f1',          // indigo-500
  
  // Sector colors
  sectors: {
    'IT/ITES': '#3b82f6',
    'BPO/KPO': '#10b981',
    'Manufacturing': '#f97316',
    'Logistics': '#8b5cf6',
    'Construction': '#ef4444',
    'Tourism': '#ec4899',
    'Healthcare': '#06b6d4',
    'Retail': '#f59e0b',
  },
  
  // Heatmap gradient (green to red)
  heatmap: {
    veryLow: '#22c55e',   // < -20%
    low: '#86efac',       // -20 to 0%
    neutral: '#fef3c7',   // 0 to 20%
    medium: '#fbbf24',    // 20 to 40%
    high: '#f97316',      // 40 to 60%
    veryHigh: '#dc2626',  // > 60%
  },
};
