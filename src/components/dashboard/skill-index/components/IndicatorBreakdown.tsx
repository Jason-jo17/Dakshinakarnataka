
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from '../../../ui/progress';

interface Indicator {
    id: string;
    dimension: string;
    name: string;
    rawValue: number;
    normalizedScore: number;
    stateAverage: number;
    bestPerformer: number;
    trend: 'improving' | 'declining' | 'stagnating';
    unit: string;
}

const IndicatorBreakdown: React.FC<{ indicators: Indicator[] }> = ({ indicators }) => {
    // Group by dimension
    const grouped = indicators.reduce((acc, ind) => {
        if (!acc[ind.dimension]) acc[ind.dimension] = [];
        acc[ind.dimension].push(ind);
        return acc;
    }, {} as Record<string, Indicator[]>);

    // Mapping for dimension codes to names for display (Hardcoded based on typical mapping or passed in)
    const dimNames: Record<string, string> = {
        'D1': 'Access & Infrastructure',
        'D2': 'Training Quality',
        'D3': 'Placements',
        'D4': 'Labor Activation',
        'D5': 'Skill Matching'
    };

    const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'D1': true });

    const toggle = (dim: string) => {
        setExpanded(prev => ({ ...prev, [dim]: !prev[dim] }));
    };

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Detailed Indicator Breakdown</CardTitle>
                <CardDescription>Deep dive into all 19 KSI indicators</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Object.entries(grouped).map(([dimId, inds]) => (
                        <div key={dimId} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggle(dimId)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-2 font-semibold text-slate-800">
                                    {expanded[dimId] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    {dimNames[dimId] || dimId}
                                </div>
                                <div className="text-xs text-slate-500">{inds.length} Indicators</div>
                            </button>

                            {expanded[dimId] && (
                                <div className="p-4 bg-white space-y-4">
                                    {inds.map(ind => (
                                        <div key={ind.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-slate-50 py-3 last:border-0">
                                            <div className="md:col-span-4">
                                                <div className="text-sm font-medium text-slate-800">{ind.name}</div>
                                                <div className="text-xs text-slate-500">ID: {ind.id}</div>
                                            </div>

                                            <div className="md:col-span-2 flex flex-col justify-center">
                                                <div className="text-sm font-bold text-slate-900">{ind.rawValue} <span className="text-[10px] font-normal text-slate-500">{ind.unit}</span></div>
                                                <div className="flex items-center text-[10px] mt-1">
                                                    {ind.trend === 'improving' && <span className="text-green-600 flex items-center"><TrendingUp size={10} className="mr-1" /> Improving</span>}
                                                    {ind.trend === 'declining' && <span className="text-red-600 flex items-center"><TrendingDown size={10} className="mr-1" /> Declining</span>}
                                                    {ind.trend === 'stagnating' && <span className="text-amber-600 flex items-center"><Minus size={10} className="mr-1" /> Stagnating</span>}
                                                </div>
                                            </div>

                                            <div className="md:col-span-4 space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Normalized Score</span>
                                                    <span className="font-semibold">{ind.normalizedScore}/100</span>
                                                </div>
                                                <Progress value={ind.normalizedScore} className="h-2" />
                                                <div className="flex justify-between text-[10px] text-slate-400">
                                                    <span>State Avg: {ind.stateAverage}</span>
                                                    <span>Best: {ind.bestPerformer}</span>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 text-right">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${ind.normalizedScore >= 75 ? 'bg-green-100 text-green-700' :
                                                    ind.normalizedScore >= 50 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {ind.normalizedScore >= 75 ? 'Strong' : ind.normalizedScore >= 50 ? 'Moderate' : 'Weak'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default IndicatorBreakdown;
