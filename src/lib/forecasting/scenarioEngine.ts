
import { ARIMAForecaster } from './arimaModel';
import { ExponentialSmoothingForecaster } from './exponentialSmoothing';
import { RegressionForecaster } from './regressionModel';
import { HISTORICAL_SKILL_GAPS } from '../../data/historicalSkillGaps';

export interface ScenarioAssumptions {
  gdpGrowth: number;
  itGrowth: number;
  kdemInvestment: number;
  trainingCapacityIncrease: number;
  industryDemandGrowth: number;
}

export interface ScenarioForecast {
  scenario: 'optimistic' | 'baseline' | 'pessimistic';
  assumptions: ScenarioAssumptions;
  forecasts: {
    year: number;
    gap: number;
    demand: number;
    supply: number;
    confidenceLower: number;
    confidenceUpper: number;
  }[];
  modelAccuracy: {
    rmse: number;
    mae: number;
    r2: number;
  };
}

export class ScenarioEngine {
  private arimaForecaster: ARIMAForecaster;
  private expSmoothingForecaster: ExponentialSmoothingForecaster;
  private regressionForecaster: RegressionForecaster;

  constructor() {
    this.arimaForecaster = new ARIMAForecaster();
    this.expSmoothingForecaster = new ExponentialSmoothingForecaster();
    this.regressionForecaster = new RegressionForecaster();
  }

  /**
   * Generate three scenario forecasts: Optimistic, Baseline, Pessimistic
   */
  generateScenarios(): ScenarioForecast[] {
    const scenarios: ScenarioForecast[] = [];

    // Scenario 1: OPTIMISTIC
    scenarios.push(
      this.generateScenario('optimistic', {
        gdpGrowth: 8.5,
        itGrowth: 18.0,
        kdemInvestment: 1200,  // ₹1200 cr/year
        trainingCapacityIncrease: 25,  // 25% increase
        industryDemandGrowth: 20,      // 20% CAGR
      })
    );

    // Scenario 2: BASELINE
    scenarios.push(
      this.generateScenario('baseline', {
        gdpGrowth: 7.0,
        itGrowth: 12.0,
        kdemInvestment: 850,   // ₹850 cr/year
        trainingCapacityIncrease: 15,  // 15% increase
        industryDemandGrowth: 12,      // 12% CAGR
      })
    );

    // Scenario 3: PESSIMISTIC
    scenarios.push(
      this.generateScenario('pessimistic', {
        gdpGrowth: 5.5,
        itGrowth: 6.0,
        kdemInvestment: 500,   // ₹500 cr/year
        trainingCapacityIncrease: 5,   // 5% increase
        industryDemandGrowth: 6,       // 6% CAGR
      })
    );

    return scenarios;
  }

  private generateScenario(
    scenarioType: 'optimistic' | 'baseline' | 'pessimistic',
    assumptions: ScenarioAssumptions
  ): ScenarioForecast {
    // Extract historical data
    const historicalGaps = HISTORICAL_SKILL_GAPS.overallGap.map(d => d.gap);
    const historicalDemand = HISTORICAL_SKILL_GAPS.overallGap.map(d => d.demand);
    const historicalSupply = HISTORICAL_SKILL_GAPS.overallGap.map(d => d.supply);

    const economicFactors = HISTORICAL_SKILL_GAPS.economicFactors;

    // Generate future economic factor projections
    const futureFactors = [];
    for (let i = 0; i < 6; i++) {
      futureFactors.push({
        year: 2025 + i,
        gdpGrowth: assumptions.gdpGrowth,
        itGrowth: assumptions.itGrowth,
        kdemInvestment: assumptions.kdemInvestment,
      });
    }

    // Run all three models
    const arimaForecast = this.arimaForecaster.forecast(historicalGaps, 6);

    const expForecast = this.expSmoothingForecaster.forecast(historicalGaps, 6);

    const regressionForecast = this.regressionForecaster.forecast(
      {
        historicalGaps,
        gdpGrowth: economicFactors.map(e => e.gdpGrowth),
        itGrowth: economicFactors.map(e => e.itGrowth),
        kdemInvestment: economicFactors.map(e => e.kdemInvestment),
      },
      futureFactors,
      6
    );

    // Ensemble: Average the three models
    const ensembleForecasts = [];

    for (let i = 0; i < 6; i++) {
      const year = 2025 + i;

      // Average gap predictions
      const avgGap =
        (arimaForecast[i].predicted +
          expForecast[i].predicted +
          regressionForecast[i].predicted) / 3;

      // Adjust based on scenario assumptions
      let adjustedGap = avgGap;

      if (scenarioType === 'optimistic') {
        // Faster gap reduction
        adjustedGap = avgGap * (1 - i * 0.08);
      } else if (scenarioType === 'pessimistic') {
        // Slower gap reduction
        adjustedGap = avgGap * (1 - i * 0.02);
      } else {
        // Baseline: moderate reduction
        adjustedGap = avgGap * (1 - i * 0.05);
      }

      adjustedGap = Math.max(5, adjustedGap);  // Floor at 5% gap

      // Calculate demand and supply based on gap
      const lastDemand = historicalDemand[historicalDemand.length - 1];
      const lastSupply = historicalSupply[historicalSupply.length - 1];

      const demandGrowthRate = assumptions.industryDemandGrowth / 100;
      const supplyGrowthRate =
        (assumptions.industryDemandGrowth + assumptions.trainingCapacityIncrease) / 100;

      const projectedDemand = lastDemand * Math.pow(1 + demandGrowthRate, i + 1);
      const projectedSupply = lastSupply * Math.pow(1 + supplyGrowthRate, i + 1);

      // Confidence intervals (average from all models)
      const avgConfidenceLower =
        (arimaForecast[i].confidenceIntervalLower +
          expForecast[i].confidenceIntervalLower +
          regressionForecast[i].confidenceIntervalLower) / 3;

      const avgConfidenceUpper =
        (arimaForecast[i].confidenceIntervalUpper +
          expForecast[i].confidenceIntervalUpper +
          regressionForecast[i].confidenceIntervalUpper) / 3;

      ensembleForecasts.push({
        year,
        gap: Math.round(adjustedGap * 10) / 10,
        demand: Math.round(projectedDemand),
        supply: Math.round(projectedSupply),
        confidenceLower: Math.max(0, Math.round(avgConfidenceLower * 10) / 10),
        confidenceUpper: Math.round(avgConfidenceUpper * 10) / 10,
      });
    }

    // Calculate model accuracy (backtesting on historical data)
    const modelAccuracy = this.calculateModelAccuracy(historicalGaps);

    return {
      scenario: scenarioType,
      assumptions,
      forecasts: ensembleForecasts,
      modelAccuracy,
    };
  }

  private calculateModelAccuracy(historicalData: number[]): {
    rmse: number;
    mae: number;
    r2: number;
  } {
    // Use last 2 years for backtesting
    const trainData = historicalData.slice(0, -2);
    const testData = historicalData.slice(-2);

    const predictions = this.arimaForecaster.forecast(trainData, 2);

    // RMSE (Root Mean Squared Error)
    let sumSquaredErrors = 0;
    let sumAbsoluteErrors = 0;

    for (let i = 0; i < 2; i++) {
      const error = testData[i] - predictions[i].predicted;
      sumSquaredErrors += error * error;
      sumAbsoluteErrors += Math.abs(error);
    }

    const rmse = Math.sqrt(sumSquaredErrors / 2);
    const mae = sumAbsoluteErrors / 2;

    // R-squared
    const meanActual = testData.reduce((a, b) => a + b) / 2;
    let ssTotal = 0;
    let ssResidual = 0;

    for (let i = 0; i < 2; i++) {
      ssTotal += Math.pow(testData[i] - meanActual, 2);
      ssResidual += Math.pow(testData[i] - predictions[i].predicted, 2);
    }

    const r2 = 1 - ssResidual / ssTotal;

    return {
      rmse: Math.round(rmse * 100) / 100,
      mae: Math.round(mae * 100) / 100,
      r2: Math.round(r2 * 100) / 100,
    };
  }
}
