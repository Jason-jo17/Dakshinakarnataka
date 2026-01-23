
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';


interface DistanceData {
  name: string;
  current: number;
  target: number;
  distance: number;
}

const DistanceToIdealBars: React.FC<{ dimensions: DistanceData[] }> = ({ dimensions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance to Ideal (Frontier)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">{dim.name}</span>
              <span className="text-slate-500 text-xs">Distance: <span className="text-red-500 font-bold">{dim.distance.toFixed(0)} pts</span></span>
            </div>
            <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              {/* Background Target Line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10" style={{ left: '100%' }}></div>

              {/* Current Progress */}
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${dim.current}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>0</span>
              <span className="text-slate-600 font-medium">Current: {dim.current}</span>
              <span>Target: 100</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DistanceToIdealBars;
