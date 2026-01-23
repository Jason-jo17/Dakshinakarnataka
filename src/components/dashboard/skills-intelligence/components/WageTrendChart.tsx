
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../../../lib/constants/colors';

interface WageData {
  year: number;
  entrylevel: number;
  midlevel: number;
  senior: number;
}

const WageTrendChart: React.FC<{ data: WageData[] }> = ({ data }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Wage Appreciation Trends (LPA)</CardTitle>
        <CardDescription>Salary progression across experience levels (2020-2024)</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="year" fontSize={12} stroke="#94a3b8" />
            <YAxis fontSize={12} stroke="#94a3b8" unit="L" />
            <Tooltip
              formatter={(value: number) => [`₹${value} LPA`, '']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            <Line type="monotone" dataKey="senior" stroke={CHART_COLORS.primary} strokeWidth={2} name="Senior Level" />
            <Line type="monotone" dataKey="midlevel" stroke={CHART_COLORS.accent} strokeWidth={2} name="Mid Level" />
            <Line type="monotone" dataKey="entrylevel" stroke={CHART_COLORS.info} strokeWidth={2} name="Entry Level" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WageTrendChart;
