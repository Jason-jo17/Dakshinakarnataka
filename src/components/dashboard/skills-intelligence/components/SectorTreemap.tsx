
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface SectorNode {
  id: string;
  name: string;
  value: number;
  growth: number;
  color: string;
}

interface SectorTreemapProps {
  sectors: SectorNode[];
}

const CustomContent = (props: any) => {
  const { x, y, width, height, name, growth, color } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color || '#8884d8',
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 30 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
          pointerEvents="none"
        >
          {name}
        </text>
      )}
      {width > 30 && height > 50 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 16}
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize={10}
          pointerEvents="none"
        >
          +{growth}%
        </text>
      )}
    </g>
  );
};

// Custom tooltip needs to be defined outside or handled carefully
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-slate-200 rounded shadow-sm text-xs">
        <p className="font-semibold text-slate-800">{data.name}</p>
        <p>Employment: {data.value.toLocaleString()}</p>
        <p className="text-green-600">Growth: +{data.growth}%</p>
      </div>
    );
  }
  return null;
};

const SectorTreemap: React.FC<SectorTreemapProps> = ({ sectors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Employment Distribution</CardTitle>
        <CardDescription>Size represents employment volume, Color represents sector</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={sectors as any}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SectorTreemap;
