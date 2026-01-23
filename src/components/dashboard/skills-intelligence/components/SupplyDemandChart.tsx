
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../../../lib/constants/colors';

interface SupplyDemandData {
  month: string;
  supply: number;
  demand: number;
}

const SupplyDemandChart: React.FC<{ data: SupplyDemandData[] }> = ({ data }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Talent Supply vs Industry Demand (2024)</CardTitle>
        <CardDescription>Monthly tracking of available workforce vs job openings</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" fontSize={12} stroke="#94a3b8" />
            <YAxis fontSize={12} stroke="#94a3b8" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend />
            <Area type="monotone" dataKey="demand" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#colorDemand)" name="Industry Demand" />
            <Area type="monotone" dataKey="supply" stroke={CHART_COLORS.secondary} fillOpacity={1} fill="url(#colorSupply)" name="Talent Supply" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SupplyDemandChart;
