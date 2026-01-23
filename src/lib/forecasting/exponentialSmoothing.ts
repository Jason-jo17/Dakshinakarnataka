
interface HoltWintersParams {
  alpha: number;  // Level smoothing
  beta: number;   // Trend smoothing
  gamma: number;  // Seasonality smoothing (set to 0 for no seasonality)
}

interface ForecastResult {
  year: number;
  predicted: number;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
}

export class ExponentialSmoothingForecaster {
  private params: HoltWintersParams = { alpha: 0.3, beta: 0.1, gamma: 0 };

  forecast(
    historicalData: number[],
    periods: number = 6
  ): ForecastResult[] {
    const n = historicalData.length;

    // Initialize level and trend
    let level = historicalData[0];
    let trend = (historicalData[n - 1] - historicalData[0]) / (n - 1);

    // Smooth historical data
    const smoothed: number[] = [level];

    for (let i = 1; i < n; i++) {
      const prevLevel = level;
      level = this.params.alpha * historicalData[i] + 
              (1 - this.params.alpha) * (prevLevel + trend);
      trend = this.params.beta * (level - prevLevel) + 
              (1 - this.params.beta) * trend;
      smoothed.push(level);
    }

    // Generate forecasts
    const forecasts: ForecastResult[] = [];

    for (let i = 0; i < periods; i++) {
      const yearForecast = 2025 + i;
      const forecast = level + (i + 1) * trend;

      // Confidence interval based on forecast horizon
      const ciWidth = 2.0 + i * 0.5;  // Widens over time

      forecasts.push({
        year: yearForecast,
        predicted: Math.max(0, forecast),
        confidenceIntervalLower: Math.max(0, forecast - ciWidth),
        confidenceIntervalUpper: forecast + ciWidth,
      });
    }

    return forecasts;
  }
}
