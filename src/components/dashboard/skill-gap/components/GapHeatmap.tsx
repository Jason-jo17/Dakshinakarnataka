
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';

interface GapHeatmapProps {
  sectors: string[];
  skills: string[];
  gapData: number[][];
}

const GapHeatmap: React.FC<GapHeatmapProps> = ({ sectors, skills, gapData }) => {
  // Helper to determine color based on gap percentage
  const getCellColor = (value: number) => {
    if (value >= 60) return 'bg-red-600';
    if (value >= 40) return 'bg-orange-500';
    if (value >= 20) return 'bg-amber-400';
    if (value > 0) return 'bg-yellow-200';
    if (value === 0) return 'bg-gray-100';
    return 'bg-green-300'; // Surplus
  };

  const getTextColor = (value: number) => {
    // Dark text for lighter backgrounds, light text for darker backgrounds
    if (value >= 40) return 'text-white';
    return 'text-slate-800';
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Skill Gap Intensity Matrix</CardTitle>
        <CardDescription>Heatmap showing % gap by Sector and Skill</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="flex">
              <div className="w-32 flex-shrink-0 p-2 font-semibold text-sm text-slate-500">Sector \ Skill</div>
              {skills.map((skill, i) => (
                <div key={i} className="flex-1 p-2 text-center text-xs font-medium text-slate-600 rotate-0">
                  {skill}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {sectors.map((sector, rowIndex) => (
              <div key={rowIndex} className="flex items-center border-t border-slate-100">
                <div className="w-32 flex-shrink-0 p-2 text-xs font-medium text-slate-700 truncate" title={sector}>
                  {sector}
                </div>
                {gapData[rowIndex]?.map((cellValue, colIndex) => (
                  <div key={colIndex} className="flex-1 p-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={`h-8 rounded flex items-center justify-center text-[10px] font-medium transition-transform hover:scale-105 cursor-pointer ${getCellColor(cellValue)} ${getTextColor(cellValue)}`}
                          >
                            {cellValue}%
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{sector} - {skills[colIndex]}</p>
                          <p className="font-bold">Gap: {cellValue}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-slate-600">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded"></div> Critical (&gt;60%)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded"></div> High (40-60%)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-400 rounded"></div> Medium (20-40%)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-200 rounded"></div> Low (0-20%)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-300 rounded"></div> Surplus (&lt;0%)</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GapHeatmap;
