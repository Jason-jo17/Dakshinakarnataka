
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CHART_COLORS } from '../../../../lib/constants/colors';

interface Dimension {
  id: string;
  name: string;
  score: number;
}

interface DimensionRadarProps {
  dimensions: Dimension[];
  stateAverage: Record<string, number>;
}

const DimensionRadar: React.FC<DimensionRadarProps> = ({ dimensions, stateAverage }) => {
  const data = dimensions.map(dim => ({
    subject: dim.name,
    A: dim.score,
    B: stateAverage[dim.id] || 0,
    fullMark: 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensional Performance</CardTitle>
        <CardDescription>District performance vs State Average across 5 key dimensions</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
            <Radar
              name="Dakshina Kannada"
              dataKey="A"
              stroke={CHART_COLORS.primary}
              fill={CHART_COLORS.primary}
              fillOpacity={0.5}
            />
            <Radar
              name="State Average"
              dataKey="B"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DimensionRadar;
