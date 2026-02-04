import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

// 19 indicators from Matrix Analysis sheet
const INDICATORS = [
    { id: 1, indicator: 'ITI Seat Availability', current: 2.1, target: 4.5, impact: 14, effort: 4, criticality: 0.15 },
    { id: 2, indicator: 'Trainer Quality & Quantity', current: 1.8, target: 4.2, impact: 13, effort: 3, criticality: 0.12 },
    { id: 3, indicator: 'Placement Rate', current: 2.5, target: 4.8, impact: 15, effort: 5, criticality: 0.18 },
    { id: 4, indicator: 'Industry Linkage Strength', current: 1.5, target: 4.5, impact: 12, effort: 3, criticality: 0.10 },
    { id: 5, indicator: 'Skill-Job Matching', current: 1.9, target: 4.6, impact: 14, effort: 4, criticality: 0.14 },
    { id: 6, indicator: 'SC/ST Inclusion', current: 3.2, target: 4.5, impact: 8, effort: 2, criticality: 0.08 },
    { id: 7, indicator: 'Women Participation', current: 2.8, target: 4.5, impact: 9, effort: 3, criticality: 0.09 },
    { id: 8, indicator: 'Rural Access to Training', current: 1.7, target: 4.3, impact: 11, effort: 5, criticality: 0.11 },
    { id: 9, indicator: 'Data Collection & MIS', current: 1.2, target: 4.0, impact: 10, effort: 2, criticality: 0.08 },
    // ... 10 more indicators
];

// Aggregate by component (4 components as per sheet)
const COMPONENTS = [
    { component: 'Institutional Capacity', score: 2.2, target: 4.5, gap: 2.3 },
    { component: 'Quality & Delivery', score: 1.9, target: 4.6, gap: 2.7 },
    { component: 'Access & Inclusion', score: 1.8, target: 4.4, gap: 2.6 },
    { component: 'Governance & Data', score: 2.0, target: 4.3, gap: 2.3 },
];

// Radar dimensions
const RADAR_DATA = [
    { dimension: 'Planning', current: 2.1, target: 5 },
    { dimension: 'Data Systems', current: 1.5, target: 5 },
    { dimension: 'Placement', current: 2.4, target: 5 },
    { dimension: 'Industry Connect', current: 1.8, target: 5 },
    { dimension: 'Social Inclusion', current: 3.0, target: 5 },
    { dimension: 'Trainer Quality', current: 1.9, target: 5 },
    { dimension: 'Governance', current: 2.2, target: 5 },
    { dimension: 'Cost Efficiency', current: 2.5, target: 5 },
];

export default function MatrixPriority() {
    // Quadrant assignment logic
    const quickWins = INDICATORS.filter(i => i.impact >= 12 && i.effort <= 3);
    const strategic = INDICATORS.filter(i => i.impact >= 12 && i.effort > 3);
    const lowPriority = INDICATORS.filter(i => i.impact < 12 && i.effort <= 3);
    const deprioritize = INDICATORS.filter(i => i.impact < 12 && i.effort > 3);

    return (
        <div className="w-full space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">District Skill Matrix & Priority</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Self-assessment scoring + impact-effort prioritization</p>
            </div>

            {/* Inference */}
            <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10 p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Prioritization Insight</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-emerald-600 dark:text-emerald-500">{quickWins.length} Quick Wins</span> identified (high impact, low effort) — start here.
                            <span className="font-bold text-red-600 dark:text-red-500"> Placement Rate (2.5/5)</span> and <span className="font-bold text-red-600 dark:text-red-500">Data Systems (1.2/5)</span> are critical gaps.
                            Overall maturity: <span className="font-bold text-amber-600 dark:text-amber-500">2.1/5 (Developing stage)</span>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2×2 Priority Matrix */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Impact-Effort Priority Matrix</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">19 indicators plotted by actionability</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" dataKey="effort" name="Effort" domain={[0, 5]} tick={{ fontSize: 10 }}
                                label={{ value: 'Effort Required →', position: 'bottom', fontSize: 10, fill: '#64748b' }} />
                            <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 15]} tick={{ fontSize: 10 }}
                                label={{ value: '← Impact', angle: -90, position: 'left', fontSize: 10, fill: '#64748b' }} />
                            <ZAxis range={[60, 400]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }}
                                content={({ payload }) => payload?.[0] ? (
                                    <div className="rounded-lg border bg-white dark:bg-slate-800 p-2 shadow-lg">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{payload[0].payload.indicator}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Impact: {payload[0].payload.impact} | Effort: {payload[0].payload.effort}</p>
                                    </div>
                                ) : null} />
                            <Scatter data={INDICATORS}>
                                {INDICATORS.map((ind, i) => {
                                    const color = ind.impact >= 12 && ind.effort <= 3 ? '#10b981' : // emerald-500
                                        ind.impact >= 12 && ind.effort > 3 ? '#3b82f6' : // blue-500
                                            ind.impact < 12 && ind.effort <= 3 ? '#f59e0b' : '#64748b'; // amber-500 : slate-500
                                    return <Cell key={i} fill={color} fillOpacity={0.7} />;
                                })}
                            </Scatter>
                            {/* Quadrant dividers */}
                            <line x1={150} y1={0} x2={150} y2={300} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
                            <line x1={0} y1={150} x2={300} y2={150} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-slate-600 dark:text-slate-400">Quick Wins ({quickWins.length})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-slate-600 dark:text-slate-400">Strategic ({strategic.length})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-slate-600 dark:text-slate-400">Nice-to-have ({lowPriority.length})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-500" />
                            <span className="text-slate-600 dark:text-slate-400">Deprioritise ({deprioritize.length})</span>
                        </div>
                    </div>
                </div>

                {/* Radar: Current vs Target */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">8-Dimension Maturity Radar</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Current state vs Target (0-5 scale)</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Radar name="Current" dataKey="current" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                            <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500" />
                            <span className="text-slate-600 dark:text-slate-400">Current Score</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-emerald-500/10 border border-emerald-500" />
                            <span className="text-slate-600 dark:text-slate-400">Target (5.0)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Component Breakdown */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4 Component Scores</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Aggregate assessment by major area</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {COMPONENTS.map((c, i) => (
                        <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{c.component}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">{c.score}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">/ {c.target}</span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                                <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full"
                                    style={{ width: `${(c.score / c.target) * 100}%` }} />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gap: {c.gap} points</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
