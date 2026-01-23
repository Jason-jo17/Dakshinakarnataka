
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { CHART_COLORS } from '../../../../lib/constants/colors';

interface SectorGapData {
  sector: string;
  demand: number;
  supply: number;
  gap: number;
}

const SectorGapChart: React.FC<{ data: SectorGapData[] }> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector-wise Demand vs Supply Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            stackOffset="sign"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="sector" type="category" width={100} stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <ReferenceLine x={0} stroke="#000" />

            <Bar dataKey="demand" name="Demand" fill={CHART_COLORS.primary} barSize={20} />
            <Bar dataKey="supply" name="Supply" fill={CHART_COLORS.secondary} barSize={20} />
            <Bar dataKey="gap" name="Gap (Deficit/Surplus)" fill={CHART_COLORS.danger} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SectorGapChart;
