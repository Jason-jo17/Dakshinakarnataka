
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ScenarioEngine, type ScenarioForecast } from '../../lib/forecasting/scenarioEngine';
import { TrendingDown, TrendingUp, Activity, Zap } from 'lucide-react';

export default function AIForecastPanel() {
  const [scenarios, setScenarios] = useState<ScenarioForecast[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<'optimistic' | 'baseline' | 'pessimistic'>('baseline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate forecasts on mount
    const engine = new ScenarioEngine();
    const forecasts = engine.generateScenarios();
    setScenarios(forecasts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-600" />
        <p className="text-slate-600">Generating AI forecasts...</p>
      </Card>
    );
  }

  const currentScenario = scenarios.find(s => s.scenario === selectedScenario)!;

  // Prepare chart data (combine historical + forecast)
  const historicalData = [
    { year: 2020, gap: 35, type: 'historical' },
    { year: 2021, gap: 33, type: 'historical' },
    { year: 2022, gap: 30, type: 'historical' },
    { year: 2023, gap: 32, type: 'historical' },
    { year: 2024, gap: 28, type: 'historical' },
  ];

  const allScenarioData = scenarios.flatMap(scenario =>
    scenario.forecasts.map(f => ({
      year: f.year,
      [`${scenario.scenario}Gap`]: f.gap,
      [`${scenario.scenario}Lower`]: f.confidenceLower,
      [`${scenario.scenario}Upper`]: f.confidenceUpper,
    }))
  );

  // Merge by year
  const chartData = [...historicalData];

  // Bridge the gap: Add forecast start point at 2024 (same as historical)
  const lastHistorical = chartData.find(d => d.year === 2024);
  if (lastHistorical) {
    Object.assign(lastHistorical, {
      baselineGap: 28,
      optimisticGap: 28,
      pessimisticGap: 28,
      // Add confidence bounds matching the point for continuity
      baselineLower: 28, baselineUpper: 28,
      optimisticLower: 28, optimisticUpper: 28,
      pessimisticLower: 28, pessimisticUpper: 28
    });
  }

  for (let year = 2025; year <= 2030; year++) {
    const yearData: any = { year, type: 'forecast' };
    allScenarioData.forEach(d => {
      if (d.year === year) {
        Object.assign(yearData, d);
      }
    });
    chartData.push(yearData);
  }

  return (
    <div className="space-y-6">
      {/* Header with Scenario Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI-Powered Skill Gap Forecast (2025-2030)</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Ensemble model: ARIMA + Exponential Smoothing + Regression
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedScenario('optimistic')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center ${selectedScenario === 'optimistic'
              ? 'bg-green-600 text-white'
              : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
              }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-2" />
            Optimistic
          </button>
          <button
            onClick={() => setSelectedScenario('baseline')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center ${selectedScenario === 'baseline'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
              }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Baseline
          </button>
          <button
            onClick={() => setSelectedScenario('pessimistic')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center ${selectedScenario === 'pessimistic'
              ? 'bg-orange-600 text-white'
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400'
              }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Pessimistic
          </button>
        </div>
      </div>

      {/* KPI Cards for Selected Scenario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-none">
          <div className="text-sm text-blue-700 dark:text-blue-300">2030 Gap (Projected)</div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {currentScenario.forecasts[5].gap}%
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            From {currentScenario.forecasts[0].gap}% in 2025
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-none">
          <div className="text-sm text-green-700 dark:text-green-300">Gap Reduction</div>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
            {Math.round((28 - currentScenario.forecasts[5].gap) * 10) / 10}%
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
            {Math.round(((28 - currentScenario.forecasts[5].gap) / 28) * 100)}% improvement
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-none">
          <div className="text-sm text-purple-700 dark:text-purple-300">Model Accuracy (R²)</div>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {currentScenario.modelAccuracy.r2}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            RMSE: {currentScenario.modelAccuracy.rmse}, MAE: {currentScenario.modelAccuracy.mae}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-none">
          <div className="text-sm text-orange-700 dark:text-orange-300">KDEM Investment</div>
          <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">
            ₹{currentScenario.assumptions.kdemInvestment}cr
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">Annual allocation</div>
        </Card>
      </div>

      {/* Main Forecast Chart */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base font-semibold dark:text-white">
            Skill Gap Forecast Fan Chart (2020-2030)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  {/* Gradient for confidence bands */}
                  <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="pessimisticGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: 'Skill Gap (%)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: any) => [`${value}%`, 'Gap']}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />

                {/* Historical line */}
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke="#64748b"
                  strokeWidth={3}
                  dot={{ fill: '#64748b', r: 4 }}
                  name="Historical Gap"
                />

                {/* Confidence bands */}
                <Area
                  type="monotone"
                  dataKey="optimisticUpper"
                  stroke="none"
                  fill="url(#optimisticGradient)"
                  name="Optimistic CI"
                />
                <Area
                  type="monotone"
                  dataKey="baselineUpper"
                  stroke="none"
                  fill="url(#baselineGradient)"
                  name="Baseline CI"
                />
                <Area
                  type="monotone"
                  dataKey="pessimisticUpper"
                  stroke="none"
                  fill="url(#pessimisticGradient)"
                  name="Pessimistic CI"
                />

                {/* Forecast lines */}
                <Line
                  type="monotone"
                  dataKey="optimisticGap"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 3 }}
                  name="Optimistic"
                />
                <Line
                  type="monotone"
                  dataKey="baselineGap"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Baseline"
                />
                <Line
                  type="monotone"
                  dataKey="pessimisticGap"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#f97316', r: 3 }}
                  name="Pessimistic"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
            <strong>Note:</strong> Shaded areas represent 95% confidence intervals. Dotted lines indicate forecast uncertainty.
          </div>
        </CardContent>
      </Card>

      {/* Scenario Assumptions & Key Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assumptions */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 dark:text-white">
              <Zap className="w-5 h-5 text-blue-600" />
              {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario Assumptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GDP Growth</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                  {currentScenario.assumptions.gdpGrowth}% CAGR
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">IT Sector Growth</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                  {currentScenario.assumptions.itGrowth}% CAGR
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">KDEM Investment</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                  ₹{currentScenario.assumptions.kdemInvestment} Cr/year
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Training Capacity ↑</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">
                  +{currentScenario.assumptions.trainingCapacityIncrease}% annually
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Industry Demand Growth</span>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800">
                  {currentScenario.assumptions.industryDemandGrowth}% CAGR
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Drivers */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold dark:text-white">Key Drivers & Interventions</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedScenario === 'optimistic' && (
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Aggressive KDEM funding</strong> (₹1,200 cr/year) enables rapid infrastructure expansion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>25% training capacity increase</strong> through new ITIs and skill centers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Strong IT sector growth</strong> (18% CAGR) driven by GCC expansions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Cloud/DevOps bootcamps</strong> fill critical skill gaps quickly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>Industry partnerships</strong> ensure 90% curriculum alignment</span>
                </li>
              </ul>
            )}

            {selectedScenario === 'baseline' && (
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Moderate KDEM funding</strong> (₹850 cr/year) supports steady progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>15% training capacity increase</strong> through existing infrastructure upgrades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>IT sector grows at 12%</strong>, matching Karnataka state average</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Gradual curriculum modernization</strong> addressing top 5 skill gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Placement rate improves to 80%</strong> by 2030</span>
                </li>
              </ul>
            )}

            {selectedScenario === 'pessimistic' && (
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠</span>
                  <span><strong>Limited KDEM funding</strong> (₹500 cr/year) constrains expansion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠</span>
                  <span><strong>Only 5% training capacity increase</strong> due to resource constraints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠</span>
                  <span><strong>Slow IT sector growth</strong> (6%) amid economic headwinds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠</span>
                  <span><strong>Curriculum-industry mismatch</strong> persists, widening skill gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">⚠</span>
                  <span><strong>Brain drain accelerates</strong> as talent moves to Bengaluru</span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forecast Data Table */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base font-semibold dark:text-white">
            Year-by-Year Forecast: {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Year</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Skill Gap (%)</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Demand</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Supply</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">95% CI Lower</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">95% CI Upper</th>
                </tr>
              </thead>
              <tbody>
                {currentScenario.forecasts.map((forecast, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{forecast.year}</td>
                    <td className="text-right p-3">
                      <span
                        className={`font-bold ${forecast.gap < 15
                          ? 'text-green-600 dark:text-green-400'
                          : forecast.gap < 25
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-orange-600 dark:text-orange-400'
                          }`}
                      >
                        {forecast.gap}%
                      </span>
                    </td>
                    <td className="text-right p-3 text-slate-700 dark:text-slate-300">{forecast.demand.toLocaleString()}</td>
                    <td className="text-right p-3 text-slate-700 dark:text-slate-300">{forecast.supply.toLocaleString()}</td>
                    <td className="text-right p-3 text-slate-500 dark:text-slate-400">{forecast.confidenceLower}%</td>
                    <td className="text-right p-3 text-slate-500 dark:text-slate-400">{forecast.confidenceUpper}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Model Methodology */}
      <Card className="bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">AI Forecasting Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-yellow-300 mb-2">Model 1: ARIMA (2,1,1)</h4>
              <p className="text-sm text-slate-300">
                Auto-Regressive Integrated Moving Average for time series forecasting with differencing to handle trends.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-green-300 mb-2">Model 2: Holt-Winters</h4>
              <p className="text-sm text-slate-300">
                Exponential smoothing with level and trend components (α=0.3, β=0.1) for adaptive forecasting.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300 mb-2">Model 3: Regression</h4>
              <p className="text-sm text-slate-300">
                Multiple linear regression incorporating GDP growth, IT sector growth, and KDEM investment as predictors.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-600 rounded-lg">
            <p className="text-sm">
              <strong className="text-yellow-300">Ensemble Approach:</strong> Final forecasts are an average of all three models,
              weighted equally. Confidence intervals represent 95% probability bounds based on historical model error.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
