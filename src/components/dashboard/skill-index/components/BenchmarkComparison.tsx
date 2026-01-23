
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../../../lib/constants/colors';

interface DimensionScore {
  dimension: string; // Should match across all inputs: "Access & Infrastructure" etc.
  score: number;
}

interface BenchmarkComparisonProps {
  dakshinaKannada: { name: string; score: number }[];
  stateAverage: DimensionScore[];
  bestPerformer: {
    name: string;
    scores: DimensionScore[];
  };
}

const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ dakshinaKannada, stateAverage, bestPerformer }) => {
  // Transform data for grouped bar chart
  const data = dakshinaKannada.map((dkDim) => {
    // Find matching dimensions
    // Note: In real app, IDs are safer than names, but using names based on prompt
    const stateScore = stateAverage.find(s => s.dimension === dkDim.name)?.score || 0;
    const bestScore = bestPerformer.scores.find(b => b.dimension === dkDim.name)?.score || 0;

    return {
      name: dkDim.name,
      'Dakshina Kannada': dkDim.score,
      'State Average': stateScore,
      [`Best (${bestPerformer.name})`]: bestScore,
    };
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Benchmark Comparison</CardTitle>
        <CardDescription>Performance vs State Average and Top Performer</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" interval={0} />
            <YAxis fontSize={12} stroke="#94a3b8" />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend />
            <Bar dataKey="Dakshina Kannada" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="State Average" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            <Bar dataKey={`Best (${bestPerformer.name})`} fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BenchmarkComparison;
