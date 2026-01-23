
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';

interface FunnelStage {
  stage: string;
  value: number;
  percentage: number;
}

interface TrainingFunnelProps {
  stages: FunnelStage[];
}

const TrainingFunnel: React.FC<TrainingFunnelProps> = ({ stages }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training & Placement Pipeline</CardTitle>
        <CardDescription>Conversion rates from Enrollment to Placement</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center p-6">
        <div className="w-full space-y-3">
          {stages.map((stage, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">{stage.stage}</span>
                <span className="text-slate-500 font-medium">{stage.value.toLocaleString()} ({stage.percentage}%)</span>
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-r-lg overflow-hidden relative">
                <div
                  className="h-full bg-blue-500 opacity-80 rounded-r-lg transition-all duration-500 ease-in-out group-hover:opacity-100 flex items-center px-3 text-white text-xs font-medium"
                  style={{ width: `${stage.percentage}%` }}
                >
                </div>
              </div>
              {/* Connector line for visual flow (optional) */}
              {index < stages.length - 1 && (
                <div className="absolute left-4 top-10 w-0.5 h-3 bg-slate-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingFunnel;
