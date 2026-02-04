import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { cn } from '../../lib/utils';
import { Leaf, TrendingUp, Users } from 'lucide-react';
import { AIInsights } from '../common/AIInsights';

// Yield gap data: District vs State vs National max
const YIELD_GAPS = [
    { crop: 'Paddy', district: 3420, state: 4180, national: 4650, gapFromState: 760, gapFromNational: 1230, gapPct: 26.5 },
    { crop: 'Wheat', district: 2840, state: 3280, national: 3520, gapFromState: 440, gapFromNational: 680, gapPct: 19.3 },
    { crop: 'Cotton', district: 420, state: 580, national: 640, gapFromState: 160, gapFromNational: 220, gapPct: 34.4 },
    { crop: 'Sugarcane', district: 68200, state: 82400, national: 88500, gapFromState: 14200, gapFromNational: 20300, gapPct: 22.9 },
    { crop: 'Spices', district: 1280, state: 1520, national: 1650, gapFromState: 240, gapFromNational: 370, gapPct: 22.4 },
    { crop: 'Pulses', district: 820, state: 920, national: 1020, gapFromState: 100, gapFromNational: 200, gapPct: 19.6 },
];

// Livelihood dependence vs productivity (scatter)
const LIVELIHOOD_PRODUCTIVITY = [
    { activity: 'Paddy Cultivation', people: 42000, productivity: 3420, potentialIncrease: 35, sector: 'Focus Crop' },
    { activity: 'Dairy Farming', people: 28400, productivity: 12.8, potentialIncrease: 42, sector: 'Allied' },
    { activity: 'Poultry', people: 8200, productivity: 38.5, potentialIncrease: 28, sector: 'Allied' },
    { activity: 'Horticulture', people: 12600, productivity: 8400, potentialIncrease: 48, sector: 'Horticulture' },
    { activity: 'Fishery', people: 4800, productivity: 2840, potentialIncrease: 52, sector: 'Allied' },
    { activity: 'Sericulture', people: 6200, productivity: 58, potentialIncrease: 38, sector: 'Allied' },
    { activity: 'Floriculture', people: 2400, productivity: 142000, potentialIncrease: 62, sector: 'Horticulture' },
];

// Training gaps by category (from 3B.2)
const TRAINING_GAPS = [
    { category: 'Direct Training (Farmers)', currentCoverage: 18, targetCoverage: 60, gap: 42 },
    { category: 'Hybrid Training (FPOs)', currentCoverage: 12, targetCoverage: 50, gap: 38 },
    { category: 'Digital Training (Apps)', currentCoverage: 8, targetCoverage: 45, gap: 37 },
    { category: 'On-Field Training (Demos)', currentCoverage: 6, targetCoverage: 55, gap: 49 },
];

const PRIORITY_INTERVENTIONS = [
    { intervention: 'Modern Cultivation Techniques', impact: 'High', reach: 42000, costPerBeneficiary: 2800 },
    { intervention: 'Precision Agriculture Training', impact: 'High', reach: 18400, costPerBeneficiary: 4200 },
    { intervention: 'FPO Management Skills', impact: 'Medium', reach: 12600, costPerBeneficiary: 3600 },
    { intervention: 'Dairy Value Chain Skills', impact: 'High', reach: 28400, costPerBeneficiary: 3200 },
    { intervention: 'Horticulture Post-Harvest', impact: 'High', reach: 12600, costPerBeneficiary: 3800 },
];

export default function PrimarySector() {
    const totalPeopleDependency = LIVELIHOOD_PRODUCTIVITY.reduce((sum, l) => sum + l.people, 0);
    const avgYieldGap = (YIELD_GAPS.reduce((sum, y) => sum + y.gapPct, 0) / YIELD_GAPS.length).toFixed(1);
    const highestImpactActivity = LIVELIHOOD_PRODUCTIVITY.reduce((max, l) =>
        l.people * l.potentialIncrease > max.people * max.potentialIncrease ? l : max
    );

    return (
        <div className="w-full space-y-6 p-6 bg-slate-50 dark:bg-slate-900">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Primary Sector: Agriculture & Allied Skills</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Yield gaps + livelihood impact analysis</p>
            </div>

            {/* Inference */}
            <div className="rounded-xl border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Primary Sector Opportunity</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Average yield gap: <span className="font-bold text-amber-500">{avgYieldGap}% below national best</span>.
                            Cotton has highest gap (34.4%), Paddy affects most people (42K farmers).
                            Highest livelihood ROI: <span className="font-bold text-green-600 dark:text-green-400">{highestImpactActivity.activity}</span>
                            ({highestImpactActivity.people.toLocaleString()} people × {highestImpactActivity.potentialIncrease}% potential gain).
                            On-field training has <span className="font-bold text-red-500">49% coverage gap</span> — lowest reach despite highest impact.
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Agri-Dependent Population', value: (totalPeopleDependency / 1000).toFixed(0) + 'K', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Avg Yield Gap', value: avgYieldGap + '%', icon: TrendingUp, color: 'text-amber-500' },
                    { label: 'Highest Impact Crop', value: 'Cotton (34%)', icon: Leaf, color: 'text-red-500' },
                    { label: 'Training Coverage Gap', value: '42%', icon: Users, color: 'text-red-500' },
                ].map((kpi, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{kpi.label}</span>
                            <kpi.icon className={cn('h-5 w-5', kpi.color)} />
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yield Gap Analysis */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Crop Yield Gap Analysis</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">District vs State vs National best (kg/hectare)</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={YIELD_GAPS} margin={{ bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="crop" tick={{ fontSize: 10, angle: -15 } as any} height={60} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} stroke="#94a3b8" />
                            <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Bar dataKey="district" fill="#ef4444" name="District Yield" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="state" fill="#f59e0b" name="State Max" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="national" fill="#22c55e" name="National Max" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Skill Training Impact</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Closing yield gaps through modern farming techniques, precision agriculture, and post-harvest management could add
                            <span className="font-bold text-green-600 dark:text-green-400"> ₹{((YIELD_GAPS.reduce((s, y) => s + y.gapFromNational, 0) * 18) / 10000000).toFixed(1)} Cr</span> annual value.
                        </p>
                    </div>
                </div>

                {/* Training Coverage Gaps */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Training Coverage Gaps (Template 3B.2)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Current vs Target by delivery mode</p>
                    <div className="space-y-6">
                        {TRAINING_GAPS.map((tg, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{tg.category}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">{tg.currentCoverage}% / {tg.targetCoverage}%</span>
                                        <span className="text-xs font-bold text-red-500">{tg.gap}% gap</span>
                                    </div>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="bg-blue-600" style={{ width: `${(tg.currentCoverage / tg.targetCoverage) * 100}%` }} />
                                    <div className="bg-red-500/30" style={{ width: `${(tg.gap / tg.targetCoverage) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">Critical Gap: On-Field Training</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Only 6% coverage vs 55% target — farmers need hands-on demos, not classroom sessions.
                            Invest in mobile training units & Krishi Vigyan Kendras.
                        </p>
                    </div>
                </div>

                {/* Livelihood Dependence vs Productivity Scatter */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Livelihood Dependence vs Productivity Potential</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Identify activities with high people-impact × productivity gain</p>
                    <ResponsiveContainer width="100%" height={360}>
                        <ScatterChart margin={{ top: 20, right: 80, bottom: 60, left: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                type="number"
                                dataKey="people"
                                name="People Dependent"
                                domain={[0, 45000]}
                                tick={{ fontSize: 10 }}
                                label={{ value: 'Number of People Dependent →', position: 'bottom', offset: 40, fontSize: 11, fontWeight: 'bold' }}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                                stroke="#94a3b8"
                            />
                            <YAxis
                                type="number"
                                dataKey="potentialIncrease"
                                name="Potential Gain %"
                                domain={[0, 70]}
                                tick={{ fontSize: 10 }}
                                label={{ value: '← Potential Productivity Gain (%)', angle: -90, position: 'left', offset: 50, fontSize: 11, fontWeight: 'bold' }}
                                stroke="#94a3b8"
                            />
                            <ZAxis range={[100, 600]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={({ payload }) => payload?.[0] ? (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{payload[0].payload.activity}</p>
                                        <p className="text-xs text-slate-500 mt-1">{payload[0].payload.sector}</p>
                                        <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                            <p>People: <span className="font-bold">{payload[0].payload.people.toLocaleString()}</span></p>
                                            <p>Potential Gain: <span className="font-bold text-green-600 dark:text-green-400">{payload[0].payload.potentialIncrease}%</span></p>
                                            <p className="text-slate-400">Impact Score: {(payload[0].payload.people * payload[0].payload.potentialIncrease / 1000).toFixed(0)}</p>
                                        </div>
                                    </div>
                                ) : null}
                            />
                            <Scatter data={LIVELIHOOD_PRODUCTIVITY}>
                                {LIVELIHOOD_PRODUCTIVITY.map((item, i) => {
                                    const color = item.sector === 'Focus Crop' ? '#22c55e' :
                                        item.sector === 'Allied' ? '#3b82f6' : '#f59e0b';
                                    return <Cell key={i} fill={color} fillOpacity={0.7} stroke={color} strokeWidth={2} />;
                                })}
                            </Scatter>
                            {/* Quadrant dividers */}
                            <line x1={22500} y1={0} x2={22500} y2={70} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 3" />
                            <line x1={0} y1={35} x2={45000} y2={35} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 3" />
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Focus Crops</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Allied Activities</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span>Horticulture</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 text-center">
                        <span className="font-bold text-slate-900 dark:text-white">Top-right quadrant</span> = high people × high potential — prioritize these for skilling
                    </p>
                </div>

                {/* Priority Interventions */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Priority Skill Interventions</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ranked by impact × reach ÷ cost</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                                    <th className="pb-3">Intervention</th>
                                    <th className="pb-3 text-center">Impact</th>
                                    <th className="pb-3 text-right">Reach</th>
                                    <th className="pb-3 text-right">Cost/Person</th>
                                    <th className="pb-3 text-right">Total Budget</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {PRIORITY_INTERVENTIONS.map((pi, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white">{pi.intervention}</td>
                                        <td className="py-3 text-center">
                                            <span className={cn('text-xs font-bold px-2 py-1 rounded-full',
                                                pi.impact === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            )}>{pi.impact}</span>
                                        </td>
                                        <td className="py-3 text-sm font-bold text-slate-900 dark:text-white text-right">{(pi.reach / 1000).toFixed(1)}K</td>
                                        <td className="py-3 text-sm text-slate-500 text-right">₹{pi.costPerBeneficiary.toLocaleString()}</td>
                                        <td className="py-3 text-sm font-bold text-blue-600 dark:text-blue-400 text-right">
                                            ₹{((pi.reach * pi.costPerBeneficiary) / 10000000).toFixed(2)}Cr
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <AIInsights context="primary sector agriculture and allied skills" dataPoints={[
                `${(totalPeopleDependency / 1000).toFixed(0)}K people dependent on agriculture and allied activities`,
                `Average yield gap: ${avgYieldGap}% below national best`,
                `Highest impact: ${highestImpactActivity.activity} (${highestImpactActivity.people.toLocaleString()} people × ${highestImpactActivity.potentialIncrease}% potential)`,
                'Cotton has highest yield gap (34.4%), Paddy affects most people (42K farmers)',
                'On-field training has 49% coverage gap - lowest reach despite highest impact'
            ]} />
        </div>
    );
}
