
import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPI {
  label: string;
  value: string;
  trend: {
    direction: 'up' | 'down' | 'flat';
    value: number;
  };
  sparklineData: number[];
}

interface LaborMarketKPIsProps {
  kpis: KPI[];
}

const LaborMarketKPIs: React.FC<LaborMarketKPIsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-slate-500 truncate">{kpi.label}</div>
            <div className="flex items-end justify-between mt-2">
              <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
              <div className={`flex items-center text-xs font-medium ${kpi.trend.direction === 'up' ? 'text-green-600' :
                kpi.trend.direction === 'down' ? 'text-red-600' : 'text-slate-500'
                }`}>
                {kpi.trend.direction === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                {kpi.trend.direction === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {kpi.trend.direction === 'flat' && <Minus className="w-3 h-3 mr-0.5" />}
                {kpi.trend.value}%
              </div>
            </div>
            <div className="h-10 mt-3 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.sparklineData.map((val, i) => ({ i, val }))}>
                  <Line
                    type="monotone"
                    dataKey="val"
                    stroke={
                      kpi.trend.direction === 'up' ? '#16a34a' :
                        kpi.trend.direction === 'down' ? '#dc2626' : '#64748b'
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LaborMarketKPIs;
