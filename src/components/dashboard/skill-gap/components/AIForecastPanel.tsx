
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../../../lib/constants/colors';

interface ProjectionPoint {
  year: number;
  gap: number;
}

interface AIForecastPanelProps {
  projections: {
    baseline: ProjectionPoint[];
    optimistic: ProjectionPoint[];
    pessimistic: ProjectionPoint[];
  };
  modelAccuracy: {
    rmse: number;
    r2: number;
  };
}

const AIForecastPanel: React.FC<AIForecastPanelProps> = ({ projections, modelAccuracy }) => {
  // Merge data for the chart
  const chartData = projections.baseline.map((point, i) => ({
    year: point.year,
    baseline: point.gap,
    optimistic: projections.optimistic[i]?.gap,
    pessimistic: projections.pessimistic[i]?.gap,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI-Driven Skill Gap Forecast (2025-2030)</CardTitle>
            <CardDescription>
              Projected skill gap % based on current intervention scenarios
            </CardDescription>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Model Accuracy (R²): <span className="font-semibold text-green-600">{modelAccuracy.r2}</span></div>
            <div>RMSE: {modelAccuracy.rmse}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.warning} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.warning} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" fontSize={12} stroke="#94a3b8" />
            <YAxis fontSize={12} stroke="#94a3b8" label={{ value: 'Gap %', angle: -90, position: 'insideLeft' }} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36} />

            <Area type="monotone" dataKey="pessimistic" stroke={CHART_COLORS.warning} fillOpacity={1} fill="url(#colorPessimistic)" name="Pessimistic Scenario" />
            <Area type="monotone" dataKey="baseline" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#colorBaseline)" name="Baseline Scenario" />
            <Area type="monotone" dataKey="optimistic" stroke={CHART_COLORS.success} fillOpacity={1} fill="url(#colorOptimistic)" name="Optimistic Scenario" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AIForecastPanel;
