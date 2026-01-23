
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { Progress } from '../../../ui/progress';

interface TalukSurvey {
  name: string;
  surveysCompleted: number;
  surveysTarget: number;
  completion: number;
}

interface FieldStudyProps {
  taluks: TalukSurvey[];
  totalSurveys: number;
  targetSurveys: number;
  lastUpdated: string;
  nextScheduled: string;
}

const FieldStudyProgress: React.FC<FieldStudyProps> = ({ taluks, totalSurveys, targetSurveys, lastUpdated, nextScheduled }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Study Coverage</CardTitle>
        <CardDescription>
          ITI & College Survey Progress (Updated: {lastUpdated})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Summary Stats */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-slate-600">Total Completion</span>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round((totalSurveys / targetSurveys) * 100)}%
                </span>
              </div>
              <Progress value={(totalSurveys / targetSurveys) * 100} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{totalSurveys} Completed</span>
                <span>Target: {targetSurveys}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="text-xs text-slate-500">Active Surveyors</div>
                <div className="text-xl font-semibold text-slate-800">12</div>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="text-xs text-slate-500">Next Cycle</div>
                <div className="text-xl font-semibold text-slate-800">{nextScheduled}</div>
              </div>
            </div>
          </div>

          {/* Taluk List */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {taluks.map((taluk, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{taluk.name}</span>
                  <span className="text-slate-500">{taluk.surveysCompleted}/{taluk.surveysTarget}</span>
                </div>
                <Progress value={taluk.completion} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldStudyProgress;
