
// KSI Normalization Functions
export function normalizeIndicator(
  value: number,
  minBound: number,
  maxBound: number,
  direction: 'ascending' | 'descending'
): number {
  const clampedValue = Math.max(minBound, Math.min(maxBound, value));
  
  if (direction === 'ascending') {
    return ((clampedValue - minBound) / (maxBound - minBound)) * 100;
  } else {
    return ((maxBound - clampedValue) / (maxBound - minBound)) * 100;
  }
}

export function calculateDimensionScore(
  indicators: { normalizedScore: number; weight: number }[]
): number {
  return indicators.reduce((sum, ind) => sum + ind.normalizedScore * ind.weight, 0);
}

export function calculateOverallKSI(
  dimensions: { score: number; weight: number }[]
): number {
  return dimensions.reduce((sum, dim) => sum + dim.score * dim.weight, 0);
}

export function classifyPerformance(score: number): string {
  if (score === 100) return 'Achiever';
  if (score >= 65) return 'FrontRunner';
  if (score >= 50) return 'Performer';
  return 'Aspirant';
}

// Color coding for KSI categories
export const KSI_COLORS = {
  Achiever: '#10b981',      // green-500
  FrontRunner: '#3b82f6',   // blue-500
  Performer: '#f59e0b',     // amber-500
  Aspirant: '#ef4444',      // red-500
};
