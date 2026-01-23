
interface RegressionInput {
  historicalGaps: number[];
  gdpGrowth: number[];
  itGrowth: number[];
  kdemInvestment: number[];
}

interface ForecastResult {
  year: number;
  predicted: number;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
}

export class RegressionForecaster {
  /**
   * Multiple linear regression: Gap = β0 + β1*GDP + β2*ITGrowth + β3*KDEM
   */
  forecast(
    input: RegressionInput,
    futureFactors: {
      year: number;
      gdpGrowth: number;
      itGrowth: number;
      kdemInvestment: number;
    }[],
    periods: number = 6
  ): ForecastResult[] {
    // Calculate regression coefficients
    const coefficients = this.calculateCoefficients(input);

    const forecasts: ForecastResult[] = [];

    for (let i = 0; i < periods; i++) {
      const factor = futureFactors[i] || futureFactors[futureFactors.length - 1];

      const predicted =
        coefficients.intercept +
        coefficients.gdp * factor.gdpGrowth +
        coefficients.itGrowth * factor.itGrowth +
        coefficients.kdem * factor.kdemInvestment;

      // Calculate standard error for confidence interval
      const standardError = this.calculateStandardError(input, coefficients);
      const ciWidth = 1.96 * standardError * Math.sqrt(1 + i * 0.15);

      forecasts.push({
        year: factor.year,
        predicted: Math.max(0, predicted),
        confidenceIntervalLower: Math.max(0, predicted - ciWidth),
        confidenceIntervalUpper: predicted + ciWidth,
      });
    }

    return forecasts;
  }

  private calculateCoefficients(input: RegressionInput) {
    const n = input.historicalGaps.length;

    // Calculate means
    const meanGap = input.historicalGaps.reduce((a, b) => a + b) / n;
    const meanGDP = input.gdpGrowth.reduce((a, b) => a + b) / n;
    const meanIT = input.itGrowth.reduce((a, b) => a + b) / n;
    const meanKDEM = input.kdemInvestment.reduce((a, b) => a + b) / n;

    // Calculate covariances
    let covGapGDP = 0, covGapIT = 0, covGapKDEM = 0;
    let varGDP = 0, varIT = 0, varKDEM = 0;

    for (let i = 0; i < n; i++) {
      const gapDiff = input.historicalGaps[i] - meanGap;
      const gdpDiff = input.gdpGrowth[i] - meanGDP;
      const itDiff = input.itGrowth[i] - meanIT;
      const kdemDiff = input.kdemInvestment[i] - meanKDEM;

      covGapGDP += gapDiff * gdpDiff;
      covGapIT += gapDiff * itDiff;
      covGapKDEM += gapDiff * kdemDiff;

      varGDP += gdpDiff * gdpDiff;
      varIT += itDiff * itDiff;
      varKDEM += kdemDiff * kdemDiff;
    }

    // Simplified coefficient calculation (assumes independent variables)
    const betaGDP = varGDP !== 0 ? covGapGDP / varGDP : 0;
    const betaIT = varIT !== 0 ? covGapIT / varIT : 0;
    const betaKDEM = varKDEM !== 0 ? covGapKDEM / varKDEM : 0;

    const intercept = meanGap - (betaGDP * meanGDP + betaIT * meanIT + betaKDEM * meanKDEM);

    return {
      intercept,
      gdp: betaGDP,
      itGrowth: betaIT,
      kdem: betaKDEM,
    };
  }

  private calculateStandardError(input: RegressionInput, coefficients: any): number {
    const n = input.historicalGaps.length;
    let sumSquaredErrors = 0;

    for (let i = 0; i < n; i++) {
      const predicted =
        coefficients.intercept +
        coefficients.gdp * input.gdpGrowth[i] +
        coefficients.itGrowth * input.itGrowth[i] +
        coefficients.kdem * input.kdemInvestment[i];

      sumSquaredErrors += Math.pow(input.historicalGaps[i] - predicted, 2);
    }

    return Math.sqrt(sumSquaredErrors / (n - 4));  // 4 parameters
  }
}
