
interface ARIMAParams {
  p: number;  // Autoregressive order
  d: number;  // Differencing order
  q: number;  // Moving average order
}

interface ForecastResult {
  year: number;
  predicted: number;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
}

export class ARIMAForecaster {
  private params: ARIMAParams = { p: 2, d: 1, q: 1 };  // Optimized for skill gap data

  /**
   * Fit ARIMA model and generate forecasts
   * @param historicalData - Array of historical values
   * @param periods - Number of periods to forecast
   * @param confidenceLevel - Confidence level (default 0.95 for 95% CI)
   */
  forecast(
    historicalData: number[],
    periods: number = 6,
    confidenceLevel: number = 0.95
  ): ForecastResult[] {
    // Step 1: Difference the data (d=1)
    const diffData = this.difference(historicalData, this.params.d);

    // Step 2: Calculate AR and MA coefficients
    const arCoeffs = this.calculateARCoefficients(diffData, this.params.p);
    const maCoeffs = this.calculateMACoefficients(diffData, this.params.q);

    // Step 3: Calculate residuals and standard error
    const residuals = this.calculateResiduals(diffData, arCoeffs, maCoeffs);
    const standardError = this.calculateStandardError(residuals);

    // Step 4: Generate forecasts
    const forecasts: ForecastResult[] = [];
    let lastValues = [...historicalData];

    const zScore = this.getZScore(confidenceLevel); // 1.96 for 95% CI

    for (let i = 0; i < periods; i++) {
      const yearForecast = 2025 + i;

      // AR component
      let arComponent = 0;
      for (let j = 0; j < this.params.p; j++) {
        if (lastValues.length > j) {
          arComponent += arCoeffs[j] * lastValues[lastValues.length - 1 - j];
        }
      }

      // MA component (simplified - uses recent residuals)
      let maComponent = 0;
      for (let j = 0; j < this.params.q && j < residuals.length; j++) {
        maComponent += maCoeffs[j] * residuals[residuals.length - 1 - j];
      }

      // Predicted value
      const predicted = arComponent + maComponent;

      // Confidence interval (widens over time)
      const ciWidth = zScore * standardError * Math.sqrt(1 + i * 0.1);

      forecasts.push({
        year: yearForecast,
        predicted: Math.max(0, predicted),  // Ensure non-negative
        confidenceIntervalLower: Math.max(0, predicted - ciWidth),
        confidenceIntervalUpper: predicted + ciWidth,
      });

      lastValues.push(predicted);
    }

    return forecasts;
  }

  private difference(data: number[], order: number): number[] {
    let result = [...data];
    for (let i = 0; i < order; i++) {
      result = result.slice(1).map((val, idx) => val - result[idx]);
    }
    return result;
  }

  private calculateARCoefficients(data: number[], p: number): number[] {
    // Yule-Walker equations for AR coefficients
    const coeffs: number[] = [];
    const n = data.length;

    for (let i = 0; i < p; i++) {
      let numerator = 0;
      let denominator = 0;

      for (let j = p; j < n; j++) {
        numerator += data[j] * data[j - i - 1];
        denominator += data[j - i - 1] * data[j - i - 1];
      }

      coeffs.push(denominator !== 0 ? numerator / denominator : 0);
    }

    return coeffs;
  }

  private calculateMACoefficients(data: number[], q: number): number[] {
    // Simplified MA coefficient estimation
    const coeffs: number[] = [];
    const mean = data.reduce((a, b) => a + b, 0) / data.length;

    for (let i = 0; i < q; i++) {
      let sum = 0;
      for (let j = i + 1; j < data.length; j++) {
        sum += (data[j] - mean) * (data[j - i - 1] - mean);
      }
      coeffs.push(sum / (data.length - i - 1));
    }

    return coeffs;
  }

  private calculateResiduals(
    data: number[],
    arCoeffs: number[],
    maCoeffs: number[]
  ): number[] {
    const residuals: number[] = [];

    for (let i = Math.max(arCoeffs.length, maCoeffs.length); i < data.length; i++) {
      let predicted = 0;

      for (let j = 0; j < arCoeffs.length; j++) {
        predicted += arCoeffs[j] * data[i - j - 1];
      }

      residuals.push(data[i] - predicted);
    }

    return residuals;
  }

  private calculateStandardError(residuals: number[]): number {
    const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const variance =
      residuals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      (residuals.length - 1);
    return Math.sqrt(variance);
  }

  private getZScore(confidenceLevel: number): number {
    // Z-scores for common confidence levels
    const zScores: { [key: number]: number } = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };
    return zScores[confidenceLevel] || 1.96;
  }
}
