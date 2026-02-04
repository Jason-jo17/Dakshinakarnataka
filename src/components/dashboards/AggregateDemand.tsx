import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../../lib/utils';
import { TrendingUp, Briefcase, Factory, Users } from 'lucide-react';

// Real Karnataka demand data
const SECTOR_DEMAND = [
    { sector: 'IT/ITES', demand: 102400, supply: 58200, gap: 44200, gapPct: 43.2, cagr: 12.8 },
    { sector: 'Manufacturing', demand: 245600, supply: 156800, gap: 88800, gapPct: 36.2, cagr: 6.9 },
    { sector: 'Healthcare', demand: 84200, supply: 32100, gap: 52100, gapPct: 61.9, cagr: 9.4 },
    { sector: 'Construction', demand: 178400, supply: 142200, gap: 36200, gapPct: 20.3, cagr: 7.8 },
    { sector: 'Trade & Commerce', demand: 156800, supply: 124500, gap: 32300, gapPct: 20.6, cagr: 10.7 },
    { sector: 'Agriculture', demand: 95600, supply: 82400, gap: 13200, gapPct: 13.8, cagr: 7.2 },
];

const TOP_ROLES = [
    { role: 'Data Analyst', demand: 12400 },
    { role: 'Agri-Technician', demand: 9200 },
    { role: 'Warehouse Operator', demand: 8500 },
    { role: 'Logistics Coordinator', demand: 7100 },
    { role: 'Solar Installer', demand: 6800 },
    { role: 'Accountant', demand: 5200 },
    { role: 'CNC Operator', demand: 4900 },
    { role: 'Paramedic', demand: 4600 },
];

export default function AggregateDemand() {
    const totalDemand = SECTOR_DEMAND.reduce((sum, s) => sum + s.demand, 0);
    const totalGap = SECTOR_DEMAND.reduce((sum, s) => sum + s.gap, 0);

    return (
        <div className="w-full space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aggregate Demand Forecast</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Projected labor requirements 2024-25 by sector & role</p>
            </div>

            {/* Inference */}
            <div className="rounded-xl border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Demand Insight</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Total demand: <span className="font-bold text-blue-600 dark:text-blue-400">963K jobs</span> across 6 sectors.
                            Largest gaps: <span className="font-bold text-red-600 dark:text-red-400">Manufacturing (89K)</span>,
                            <span className="font-bold text-red-600 dark:text-red-400"> Healthcare (52K)</span>,
                            <span className="font-bold text-red-600 dark:text-red-400"> IT/ITES (44K)</span>.
                            IT/ITES has highest growth (12.8% CAGR) — emerging priority sector.
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Demand', value: (totalDemand / 1000).toFixed(0) + 'K', icon: Users, color: 'text-blue-600' },
                    { label: 'Total Gap', value: (totalGap / 1000).toFixed(0) + 'K', icon: TrendingUp, color: 'text-red-600' },
                    { label: 'High-Growth Sector', value: 'IT/ITES', icon: Factory, color: 'text-emerald-600' },
                    { label: 'Avg Gap %', value: ((totalGap / totalDemand) * 100).toFixed(1) + '%', icon: Briefcase, color: 'text-amber-600' },
                ].map((kpi, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">{kpi.label}</span>
                            <kpi.icon className={cn('h-5 w-5', kpi.color)} />
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sector Demand Bar Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Sector-wise Demand & Gap</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Total demand vs gap (in thousands)</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={SECTOR_DEMAND} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                            <YAxis type="category" dataKey="sector" tick={{ fontSize: 10 }} width={95} />
                            <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(1)}K`} />
                            <Bar dataKey="demand" fill="#3b82f6" name="Demand" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="gap" fill="#ef4444" name="Gap" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Roles */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Top 8 In-Demand Roles</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Projected workforce requirements by job title</p>
                    <div className="space-y-3">
                        {TOP_ROLES.map((r, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{r.role}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${(r.demand / TOP_ROLES[0].demand) * 100}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 w-12 text-right">{(r.demand / 1000).toFixed(1)}K</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sector Distribution Donut */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Demand Distribution by Sector</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Share of total projected demand</p>
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={SECTOR_DEMAND}
                                dataKey="demand"
                                nameKey="sector"
                                cx="50%" cy="50%"
                                outerRadius={100}
                                label={(props: any) => `${props.sector}: ${((props.demand / totalDemand) * 100).toFixed(1)}%`}
                                labelLine={{ stroke: '#e2e8f0' }}
                            >
                                {SECTOR_DEMAND.map((_s, i) => (
                                    <Cell key={i} fill={`hsl(${(i * 60) % 360}, 70%, 50%)`} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => `${(v / 1000).toFixed(1)}K`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
