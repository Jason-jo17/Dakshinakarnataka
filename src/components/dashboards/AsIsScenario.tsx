import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { Users, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AIInsightPanel from '../ui/AIInsightPanel';
import TrainingPlacementFunnel from './TrainingPlacementFunnel';
import { AIInsights } from '../common/AIInsights';

// Real Karnataka data
const ITI_CAPACITY = {
    govt: { seats: 28450, enrolled: 24182, utilization: 85 },
    private: { seats: 175462, enrolled: 105277, utilization: 60 },
    total: { seats: 203912, enrolled: 129459, utilization: 63.5 },
};

const DSC_MEETINGS = [
    { year: '2019-20', meetings: 18, target: 24 },
    { year: '2020-21', meetings: 24, target: 24 },
];

const TOP_TRADES_ENROLLMENT = [
    { trade: 'Electrician', capacity: 8420, enrolled: 7157, pct: 85 },
    { trade: 'Fitter', capacity: 6230, enrolled: 3738, pct: 60 },
    { trade: 'COPA', capacity: 5180, enrolled: 4921, pct: 95 },
    { trade: 'Welder', capacity: 4850, enrolled: 1940, pct: 40 },
    { trade: 'Mechanic', capacity: 4120, enrolled: 3296, pct: 80 },
];

export default function AsIsScenario() {
    return (
        <div className="w-full space-y-6 p-6 bg-background">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">As-Is Scenario: Supply Side</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current training infrastructure & governance effectiveness</p>
            </div>

            {/* Inference Panel */}
            {/* Key Insight & AI Analysis */}
            <div className="mb-6">
                <AIInsightPanel
                    context="as-is"
                    metrics={{
                        totalSeats: 203912,
                        enrollment: 129459,
                        utilization: 63.5,
                        govtUtil: 85,
                        pvtUtil: 60,
                        dscMeetings2021: 24,
                        dscMeetings2020: 18,
                    }}
                    existingInsight="Private ITIs have 40% unutilized capacity (70K vacant seats) while govt ITIs run at 85%. Welder & Fitter trades show chronic under-enrollment despite strong industry demand. DSC meetings improved +33% YoY — governance strengthening."
                    variant="warning"
                    icon={AlertCircle}
                />
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total ITI Seats', value: ITI_CAPACITY.total.seats.toLocaleString(), change: '+5.2%', icon: Building2, color: 'text-blue-600' },
                    { label: 'Current Enrollment', value: ITI_CAPACITY.total.enrolled.toLocaleString(), change: `${ITI_CAPACITY.total.utilization}% util.`, icon: Users, color: 'text-emerald-600' },
                    { label: 'Govt ITI Utilization', value: `${ITI_CAPACITY.govt.utilization}%`, change: 'Healthy', icon: CheckCircle2, color: 'text-emerald-600' },
                    { label: 'Pvt ITI Utilization', value: `${ITI_CAPACITY.private.utilization}%`, change: '-25% gap', icon: AlertCircle, color: 'text-yellow-600' },
                ].map((kpi, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">{kpi.label}</span>
                            <kpi.icon className={cn('h-5 w-5', kpi.color)} />
                        </div>
                        <p className="text-3xl font-black text-slate-800 dark:text-white">{kpi.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{kpi.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* DSC Governance Bar Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">DSC Meeting Compliance</h3>
                    <p className="text-sm text-slate-500 mb-6">Actual vs Target (2019-21)</p>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DSC_MEETINGS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    itemStyle={{ fontSize: '12px', color: '#1e293b' }}
                                />
                                <Bar dataKey="meetings" fill="#3b82f6" name="Actual" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" fill="#93c5fd" name="Target" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-blue-500" />
                            <span className="text-slate-500">Actual Meetings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-blue-300" />
                            <span className="text-slate-500">Target (24/year)</span>
                        </div>
                    </div>
                </div>

                {/* Capacity Utilization Donut */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Capacity Utilization Split</h3>
                    <p className="text-sm text-slate-500 mb-4">Govt vs Private ITIs</p>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Govt Enrolled', value: 24182, fill: '#3b82f6' },
                                        { name: 'Govt Vacant', value: 4268, fill: '#bfdbfe' },
                                        { name: 'Pvt Enrolled', value: 105277, fill: '#10b981' },
                                        { name: 'Pvt Vacant', value: 70185, fill: '#fca5a5' },
                                    ]}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                    dataKey="value"
                                    paddingAngle={2}
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#bfdbfe" />
                                    <Cell fill="#10b981" />
                                    <Cell fill="#fca5a5" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                        <div className="flex items-center justify-between p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Govt Util.</span>
                            <span className="font-bold text-blue-600">85%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/20">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Pvt Util.</span>
                            <span className="font-bold text-red-600">60%</span>
                        </div>
                    </div>
                </div>
            </div>

            <TrainingPlacementFunnel />

            {/* Top Trades Enrollment */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Top 5 Trades: Capacity vs Enrollment</h3>
                <p className="text-sm text-slate-500 mb-6">Identify under-enrolled high-capacity trades</p>
                <div className="space-y-4">
                    {TOP_TRADES_ENROLLMENT.map((t, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.trade}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500">{t.enrolled.toLocaleString()} / {t.capacity.toLocaleString()}</span>
                                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full',
                                        t.pct >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                            t.pct >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    )}>{t.pct}%</span>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={cn('h-full rounded-full transition-all',
                                    t.pct >= 80 ? 'bg-emerald-500' : t.pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                )} style={{ width: `${t.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Insights */}
            <AIInsights context="as-is scenario and current training infrastructure" dataPoints={[
                `Total ITI capacity: ${ITI_CAPACITY.total.seats.toLocaleString()} seats with ${ITI_CAPACITY.total.utilization}% utilization`,
                `Private ITIs have 40% unutilized capacity (70K vacant seats)`,
                `Government ITIs at ${ITI_CAPACITY.govt.utilization}% utilization - near full capacity`,
                'DSC meetings improved +33% YoY (governance strengthening)',
                'COPA and Electrician trades show highest enrollment rates (85-95%)'
            ]} />
        </div>
    );
}
