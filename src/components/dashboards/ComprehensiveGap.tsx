import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../../lib/utils';
import { Users, Database, GraduationCap, TrendingDown, Leaf, DollarSign, UserX, AlertCircle } from 'lucide-react';
import { AIInsights } from '../common/AIInsights';


// From Image 2: 3B.2 Primary Sector Gaps
const PRIMARY_GAPS = [
    { crop: 'Rice', category: 'On-Field Training', gap: 92, severity: 'critical', people: 12400 },
    { crop: 'Wheat', category: 'Hybrid Training', gap: 78, severity: 'high', people: 8600 },
    { crop: 'Cotton', category: 'Direct Training', gap: 85, severity: 'critical', people: 6200 },
    { crop: 'Spices', category: 'Digital Training', gap: 88, severity: 'critical', people: 3400 },
];

// From Image 3: 3B.4 Inclusion Gaps
const INCLUSION_GAPS = {
    scEnrollment: 18.2,  // % in enrollment vs 22% in population
    scPopulation: 22.0,
    stEnrollment: 12.5,
    stPopulation: 18.0,
    womenEnrollment: 28.0,
    womenPopulation: 48.5,
    minorityEnrollment: 8.5,
    minorityPopulation: 14.2,
};

// From Image 4: 3B.5 Data Collection Gaps
const DATA_GAPS = [
    { scheme: 'PMKVY District Data', available: false },
    { scheme: 'DDU-GKY Trainee Tracking', available: false },
    { scheme: 'Industry Demand Survey', available: false },
    { scheme: 'NAPS Placement Records', available: true },
];

// From Image 5: 3B.6 Trainer Shortage
const TRAINER_GAPS = [
    { sector: 'Healthcare', trade: 'Paramedic', openings: 24, ratio: 28 },
    { sector: 'IT/ITES', trade: 'Data Analyst', openings: 18, ratio: 35 },
    { sector: 'Renewable', trade: 'Solar Tech', openings: 15, ratio: 22 },
    { sector: 'Manufacturing', trade: 'CNC Operator', openings: 12, ratio: 18 },
];

// From Image 5: 3B.7 Placement Gaps
const PLACEMENT_LOW = [
    { sector: 'Manufacturing', trade: 'Fitter', placementPct: 38 },
    { sector: 'Construction', trade: 'Painter', placementPct: 42 },
    { sector: 'IT/ITES', trade: 'DTP Operator', placementPct: 45 },
];

// From Image 5: 3B.8 Wage Gaps
const WAGE_GAPS = [
    { trade: 'Healthcare Technician', malePlaced: 340, maleAvgWage: 14200, femalePlaced: 180, femaleAvgWage: 11800, gap: 2400 },
    { trade: 'Data Entry Operator', malePlaced: 520, maleAvgWage: 12500, femalePlaced: 380, femaleAvgWage: 10200, gap: 2300 },
    { trade: 'Retail Sales', malePlaced: 680, maleAvgWage: 11200, femalePlaced: 920, femaleAvgWage: 9400, gap: 1800 },
];

const GAP_AREAS = [
    { id: 1, area: 'Demand-Supply Mismatch', severity: 'critical', affected: 191000, gapPct: 48, timeline: 'Immediate', icon: AlertCircle, color: 'danger' },
    { id: 2, area: 'Primary Sector Skills', severity: 'critical', affected: 22000, gapPct: 63, timeline: '6-12 months', icon: Leaf, color: 'danger' },
    { id: 3, area: 'Trainer Shortage', severity: 'high', affected: 8400, gapPct: 34, timeline: '3-6 months', icon: GraduationCap, color: 'warning' },
    { id: 4, area: 'Inclusion (SC/ST/Women)', severity: 'high', affected: 39000, gapPct: 34, timeline: 'Ongoing', icon: Users, color: 'warning' },
    { id: 5, area: 'Data Collection', severity: 'high', affected: null, gapPct: 75, timeline: 'Immediate', icon: Database, color: 'warning' },
    { id: 6, area: 'Placement Quality', severity: 'medium', affected: 12600, gapPct: 42, timeline: '6-12 months', icon: TrendingDown, color: 'warning' },
    { id: 7, area: 'Wage Parity (Gender)', severity: 'medium', affected: 4800, gapPct: 18, timeline: 'Long-term', icon: DollarSign, color: 'warning' },
    { id: 8, area: 'Geographic Access', severity: 'medium', affected: 51000, gapPct: 42, timeline: '12+ months', icon: UserX, color: 'warning' },
];

export default function ComprehensiveGap() {


    return (
        <div className="w-full space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Consolidated Gap Analysis</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">8 gap dimensions beyond supply-demand (Templates 3B.2–3B.8)</p>
            </div>

            {/* SKILLS DELIVERY GAPS (New Request) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b pb-2">Gaps in Skills Delivery</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Trainer Ratios */}
                    <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                            <label className="text-sm font-bold text-amber-800 dark:text-amber-400 block mb-1">Avg Ratio of Trainees to Trainers</label>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">24 : 1 <span className="text-xs text-slate-500 font-normal ml-2">(Norm 20:1)</span></div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Sectors with Trainer Shortage</h4>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-600 dark:text-slate-400">
                                    <tr>
                                        <th className="p-2 rounded-l">Sectors</th>
                                        <th className="p-2 rounded-r">Trades</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr><td className="p-2">Healthcare</td><td className="p-2 text-red-500 font-medium">General Duty Assistant</td></tr>
                                    <tr><td className="p-2">Electronics</td><td className="p-2 text-red-500 font-medium">Field Technician</td></tr>
                                    <tr><td className="p-2">Capital Goods</td><td className="p-2 text-red-500 font-medium">CNC Operator</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Assessment Delays */}
                    <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                            <label className="text-sm font-bold text-red-800 dark:text-red-400 block mb-1">Avg Assessment Delay (Days)</label>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">45 Days <span className="text-xs text-slate-500 font-normal ml-2">(Norm 15 Days)</span></div>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Sectors with Assessment Delays</h4>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-600 dark:text-slate-400">
                                    <tr>
                                        <th className="p-2 rounded-l">Sectors</th>
                                        <th className="p-2 rounded-r">Trades</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr><td className="p-2">Agriculture</td><td className="p-2 text-red-500 font-medium">Gardener</td></tr>
                                    <tr><td className="p-2">Automotive</td><td className="p-2 text-red-500 font-medium">Repair Technician</td></tr>
                                    <tr><td className="p-2">Apparel</td><td className="p-2 text-red-500 font-medium">Self Employed Tailor</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inference */}
            <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Multi-Dimensional Gap Profile</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Beyond just "not enough seats" — system has <span className="font-bold text-red-600 dark:text-red-400">8 interconnected gaps</span>.
                            Primary sector (agriculture) has <span className="font-bold text-red-600 dark:text-red-400">63% skill deficit</span> despite employing 30% of workforce.
                            Data gaps (75% schemes untracked) prevent evidence-based planning.
                            Women & SC/ST underrepresented by <span className="font-bold text-amber-600 dark:text-amber-400">10-20 percentage points</span>.
                        </p>
                    </div>
                </div>
            </div>                    {/* 10 Gap Area Cards */}
            < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
                {
                    GAP_AREAS.map((gap) => (
                        <div key={gap.id} className={cn(
                            'rounded-xl border p-5 transition-all hover:shadow-lg',
                            gap.color === 'danger' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                        )}>
                            <div className="flex items-start justify-between mb-3">
                                <gap.icon className={cn('h-6 w-6', gap.color === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')} />
                                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                                    gap.severity === 'critical' ? 'bg-red-600 text-white' :
                                        gap.severity === 'high' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 text-slate-500'
                                )}>{gap.severity}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{gap.area}</h3>
                            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center justify-between">
                                    <span>Gap Severity:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{gap.gapPct}%</span>
                                </div>
                                {gap.affected && (
                                    <div className="flex items-center justify-between">
                                        <span>People Affected:</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{(gap.affected / 1000).toFixed(0)}K</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span>Action Timeline:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{gap.timeline}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Primary Sector Gaps */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                        Primary Sector Skill Gaps (Image 2: 3B.2)
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Agriculture training deficits by category</p>
                    <div className="space-y-4">
                        {PRIMARY_GAPS.map((pg, i) => (
                            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{pg.crop} — {pg.category}</span>
                                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full',
                                        pg.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                    )}>{pg.gap}% Gap</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{pg.people.toLocaleString()} farmers affected</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trainer Shortage */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-amber-600" />
                        Trainer Shortage (Image 4: 3B.6)
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Open positions by sector & trade</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={TRAINER_GAPS} layout="vertical" margin={{ left: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="trade" tick={{ fontSize: 10 }} width={75} />
                            <Tooltip />
                            <Bar dataKey="openings" fill="#ef4444" name="Open Positions" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                        Avg trainee:trainer ratio: <span className="font-bold text-slate-900 dark:text-white">24:1</span> (target: 15:1)
                    </p>
                </div>

                {/* Inclusion Gaps */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Inclusion Gaps (Image 3: 3B.4)
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enrollment vs population share (percentage points)</p>
                    <div className="space-y-4">
                        {[
                            { group: 'SC', enroll: INCLUSION_GAPS.scEnrollment, pop: INCLUSION_GAPS.scPopulation },
                            { group: 'ST', enroll: INCLUSION_GAPS.stEnrollment, pop: INCLUSION_GAPS.stPopulation },
                            { group: 'Women', enroll: INCLUSION_GAPS.womenEnrollment, pop: INCLUSION_GAPS.womenPopulation },
                            { group: 'Minority', enroll: INCLUSION_GAPS.minorityEnrollment, pop: INCLUSION_GAPS.minorityPopulation },
                        ].map((inc, i) => {
                            const gap = inc.pop - inc.enroll;
                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{inc.group}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {inc.enroll.toFixed(1)}% enrolled vs {inc.pop.toFixed(1)}% population
                                            </span>
                                            <span className="text-xs font-bold text-red-600 dark:text-red-400">-{gap.toFixed(1)}pp</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                                        <div className="bg-blue-600" style={{ width: `${(inc.enroll / inc.pop) * 100}%` }} />
                                        <div className="bg-red-400/30" style={{ width: `${(gap / inc.pop) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Data Collection Gaps */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <Database className="h-5 w-5 text-amber-600" />
                        Data Collection Gaps (Image 3: 3B.5)
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Schemes not tracked at district level</p>
                    <div className="space-y-3">
                        {DATA_GAPS.map((dg, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{dg.scheme}</span>
                                {dg.available ? (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">Available</span>
                                ) : (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Not Available</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                        <span className="font-bold text-red-600 dark:text-red-400">75% of schemes</span> lack district-level MIS — blocks evidence-based planning
                    </p>
                </div>

                {/* Placement Quality Gaps */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-amber-600" />
                        Low Placement Trades (Image 4: 3B.7)
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Trades with &lt;40% placement rate</p>
                    <div className="space-y-3">
                        {PLACEMENT_LOW.map((pl, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{pl.trade}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{pl.sector}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-red-600 dark:text-red-400">{pl.placementPct}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gender Wage Gaps */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        Gender Wage Gaps (Image 5: 3B.8)
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Male-Female salary differences</p>
                    <div className="space-y-4">
                        {WAGE_GAPS.map((wg, i) => (
                            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">{wg.trade}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">Male Avg:</p>
                                        <p className="font-bold text-slate-900 dark:text-white">₹{wg.maleAvgWage.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">Female Avg:</p>
                                        <p className="font-bold text-slate-900 dark:text-white">₹{wg.femaleAvgWage.toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-2">Gap: ₹{wg.gap.toLocaleString()}/month ({((wg.gap / wg.maleAvgWage) * 100).toFixed(1)}%)</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SWOT Analysis (AI-Generated) */}
            <AIInsights context="district comprehensive gap analysis" />
        </div>
    );
}
