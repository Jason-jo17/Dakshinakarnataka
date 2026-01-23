
import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { KSI_COLORS } from '../../../../lib/ksiCalculations';

interface Trend {
  previousYear: number;
  change: number;
  projectedScore2030: number;
  onTrack: boolean;
}

interface KSIScorecardProps {
  score: number;
  rank: number;
  totalDistricts: number;
  category: string;
  trend: Trend;
}

const KSIScorecard: React.FC<KSIScorecardProps> = ({ score, category }) => {
  // Data for the semi-circle gauge
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (cat: string) => {
    return (KSI_COLORS as any)[cat] || '#3b82f6';
  };

  const activeColor = getColor(category);

  return (
    <Card className="h-full">
      <CardContent className="p-6 h-full flex flex-col items-center justify-center relative">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Dakshina Kannada KSI Score</h3>

        <div className="w-full h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={activeColor} />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <span className="text-5xl font-bold text-slate-800">{score.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">/ 100</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm`} style={{ backgroundColor: activeColor }}>
            {category}
          </span>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4 max-w-xs">
          Performance Band: <strong>{category}</strong> based on aggregated indicators across 5 dimensions.
        </p>
      </CardContent>
    </Card>
  );
};

export default KSIScorecard;
