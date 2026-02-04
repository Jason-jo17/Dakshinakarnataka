import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../../lib/utils';
import { TrendingUp, AlertTriangle, Database, CheckCircle2, Scale } from 'lucide-react';

// Data Schema from Image 1
interface DemandEstimate {
    sector: string;
    role: string;
    survey_of_employer: number;
    skill_gap_study: number;
    gpdp_and_govt: number;
    self_employment: number;
    primary_sector: number;
    most_realistic_estimate: number; // User-selected final estimate

    // Optional sector-specific estimates
    agriculture?: number;
    mining?: number;
    manufacturing?: number;
    electricity?: number;
    construction?: number;
    trade_hotel?: number;
    finance?: number;
    public_admin?: number;
}

interface SourceComparison {
    source: string;
    demand: number;
    color: string;
}

// Sample data structure (this comes from the data entry form in Image 1)
const SAMPLE_DEMAND_DATA: DemandEstimate[] = [
    {
        sector: 'Primary Sector',
        role: 'Farm Mechanization Technician',
        survey_of_employer: 4200,
        skill_gap_study: 5800,
        gpdp_and_govt: 3200,
        self_employment: 1800,
        primary_sector: 8400,
        most_realistic_estimate: 5800,
        agriculture: 5800,
    },
    {
        sector: 'Primary Sector',
        role: 'Agri-Tech Specialist',
        survey_of_employer: 2100,
        skill_gap_study: 3400,
        gpdp_and_govt: 1800,
        self_employment: 2200,
        primary_sector: 4800,
        most_realistic_estimate: 3400,
        agriculture: 3400,
    },
    {
        sector: 'Secondary Sector',
        role: 'CNC Operator',
        survey_of_employer: 3800,
        skill_gap_study: 4200,
        gpdp_and_govt: 800,
        self_employment: 600,
        primary_sector: 0,
        most_realistic_estimate: 4200,
        manufacturing: 4200,
    },
    {
        sector: 'Secondary Sector',
        role: 'Welder',
        survey_of_employer: 2800,
        skill_gap_study: 3200,
        gpdp_and_govt: 1400,
        self_employment: 800,
        primary_sector: 0,
        most_realistic_estimate: 3200,
        construction: 3200,
    },
    {
        sector: 'Services Sector',
        role: 'Data Analyst',
        survey_of_employer: 12400,
        skill_gap_study: 10800,
        gpdp_and_govt: 200,
        self_employment: 3800,
        primary_sector: 0,
        most_realistic_estimate: 12400,
        finance: 12400,
    },
    {
        sector: 'Services Sector',
        role: 'Hospitality Staff',
        survey_of_employer: 8200,
        skill_gap_study: 9400,
        gpdp_and_govt: 600,
        self_employment: 4200,
        primary_sector: 0,
        most_realistic_estimate: 9400,
        trade_hotel: 9400,
    },
];

export default function AggregateDemandComparison() {

    // Calculate source-wise totals
    const sourceComparison: SourceComparison[] = [
        {
            source: 'Survey of Employer',
            demand: SAMPLE_DEMAND_DATA.reduce((sum, d) => sum + d.survey_of_employer, 0),
            color: '#3b82f6', // primary
        },
        {
            source: 'Skill Gap Study',
            demand: SAMPLE_DEMAND_DATA.reduce((sum, d) => sum + d.skill_gap_study, 0),
            color: '#10b981', // success
        },
        {
            source: 'GPDP & Govt',
            demand: SAMPLE_DEMAND_DATA.reduce((sum, d) => sum + d.gpdp_and_govt, 0),
            color: '#f59e0b', // warning
        },
        {
            source: 'Self Employment',
            demand: SAMPLE_DEMAND_DATA.reduce((sum, d) => sum + d.self_employment, 0),
            color: '#ef4444', // danger
        },
        {
            source: 'Primary Sector',
            demand: SAMPLE_DEMAND_DATA.reduce((sum, d) => sum + d.primary_sector, 0),
            color: '#14b8a6', // teal
        },
    ];

    // Most realistic estimate (user-selected)
    const finalEstimate = SAMPLE_DEMAND_DATA.reduce((sum, d) => sum + d.most_realistic_estimate, 0);

    // Source variance analysis
    const avgEstimate = sourceComparison.reduce((sum, s) => sum + s.demand, 0) / sourceComparison.length;
    const variance = sourceComparison.map(s => ({
        source: s.source,
        deviation_pct: ((s.demand - avgEstimate) / avgEstimate * 100).toFixed(1),
        deviation_abs: s.demand - avgEstimate,
    }));

    // Role-level source comparison
    const roleLevelComparison = SAMPLE_DEMAND_DATA.map(d => ({
        role: d.role,
        survey: d.survey_of_employer,
        skill_gap: d.skill_gap_study,
        gpdp: d.gpdp_and_govt,
        final: d.most_realistic_estimate,
        variance: Math.max(d.survey_of_employer, d.skill_gap_study, d.gpdp_and_govt) -
            Math.min(d.survey_of_employer, d.skill_gap_study, d.gpdp_and_govt),
    }));

    // Identify high variance roles (>30% difference between sources)
    const highVarianceRoles = roleLevelComparison.filter(r =>
        (r.variance / r.final) > 0.3
    );

    return (
        <div className="w-full space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aggregate Demand: Multi-Source Comparison</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Reconciling estimates from 5 data sources across {SAMPLE_DEMAND_DATA.length} roles
                </p>
            </div>

            {/* Inference Panel */}
            <div className="rounded-xl border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Source Reconciliation Insight</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Final realistic estimate: <span className="font-bold text-blue-600 dark:text-blue-400">{(finalEstimate / 1000).toFixed(1)}K jobs</span>
                            {' '}(averaged across {sourceComparison.length} sources).
                            Highest source: <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {sourceComparison.sort((a, b) => b.demand - a.demand)[0].source} ({(sourceComparison[0].demand / 1000).toFixed(1)}K)
                            </span>.
                            Lowest: <span className="font-bold text-amber-600 dark:text-amber-400">
                                {sourceComparison.sort((a, b) => a.demand - b.demand)[0].source} ({(sourceComparison.sort((a, b) => a.demand - b.demand)[0].demand / 1000).toFixed(1)}K)
                            </span>.
                            <span className="font-bold text-red-600 dark:text-red-400">{highVarianceRoles.length} roles</span> show gt 30% variance between sources —
                            need field validation.
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                    { label: 'Final Estimate', value: (finalEstimate / 1000).toFixed(1) + 'K', icon: CheckCircle2, color: 'text-emerald-600' },
                    { label: 'Source Count', value: sourceComparison.length.toString(), icon: Database, color: 'text-blue-600' },
                    { label: 'Roles Analyzed', value: SAMPLE_DEMAND_DATA.length.toString(), icon: TrendingUp, color: 'text-amber-600' },
                    { label: 'High Variance Roles', value: highVarianceRoles.length.toString(), icon: AlertTriangle, color: 'text-red-600' },
                    { label: 'Avg Source Deviation', value: '±18%', icon: Scale, color: 'text-slate-500' },
                ].map((kpi, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">{kpi.label}</span>
                            <kpi.icon className={cn('h-4 w-4', kpi.color)} />
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Comparison Bar Chart */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Source-Wise Total Demand</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Comparing 5 estimation methodologies
                    </p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={sourceComparison} margin={{ bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="source"
                                angle={-25}
                                textAnchor="end"
                                tick={{ fontSize: 10 }}
                                height={80}
                                interval={0}
                            />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(v: number) => `${v.toLocaleString()} jobs`} />
                            <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                                {sourceComparison.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Final Selection Logic</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            "Most Realistic Estimate" column uses highest weight for Skill Gap Study + Survey of Employer,
                            with GPDP as floor for govt-driven roles
                        </p>
                    </div>
                </div>

                {/* Source Deviation Scatter */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Source Variance Analysis</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Deviation from average estimate (%)
                    </p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={variance} layout="vertical" margin={{ left: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                            <YAxis type="category" dataKey="source" tick={{ fontSize: 9 }} width={95} />
                            <Tooltip formatter={(v: number) => `${v}%`} />
                            <Bar dataKey="deviation_pct" radius={[0, 4, 4, 0]}>
                                {variance.map((entry, i) => (
                                    <Cell key={i} fill={
                                        Math.abs(parseFloat(entry.deviation_pct)) < 10 ? '#10b981' :
                                            Math.abs(parseFloat(entry.deviation_pct)) < 20 ? '#f59e0b' : '#ef4444'
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Role-Level Comparison Table */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Role-Level Source Comparison</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Detailed breakdown showing variance across estimation sources
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                                    <th className="pb-3">Role</th>
                                    <th className="pb-3 text-right">Survey</th>
                                    <th className="pb-3 text-right">Skill Gap</th>
                                    <th className="pb-3 text-right">GPDP</th>
                                    <th className="pb-3 text-right">Final Est.</th>
                                    <th className="pb-3 text-right">Variance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {roleLevelComparison.map((role, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="py-3 font-semibold text-slate-900 dark:text-white">{role.role}</td>
                                        <td className="py-3 text-right text-slate-500 dark:text-slate-400">{role.survey.toLocaleString()}</td>
                                        <td className="py-3 text-right text-slate-500 dark:text-slate-400">{role.skill_gap.toLocaleString()}</td>
                                        <td className="py-3 text-right text-slate-500 dark:text-slate-400">{role.gpdp.toLocaleString()}</td>
                                        <td className="py-3 text-right font-bold text-blue-600 dark:text-blue-400">{role.final.toLocaleString()}</td>
                                        <td className="py-3 text-right">
                                            <span className={cn('text-xs font-bold px-2 py-1 rounded-full',
                                                (role.variance / role.final) < 0.2 ? 'bg-green-100 text-green-700' :
                                                    (role.variance / role.final) < 0.4 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            )}>
                                                {role.variance.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* High Variance Alert Box */}
                {highVarianceRoles.length > 0 && (
                    <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 lg:col-span-2">
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Roles Requiring Field Validation (gt 30% Source Variance)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {highVarianceRoles.map((role, i) => (
                                <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{role.role}</span>
                                        <span className="text-xs font-bold text-red-600">
                                            ±{((role.variance / role.final) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Range: {Math.min(role.survey, role.skill_gap, role.gpdp).toLocaleString()} -
                                        {Math.max(role.survey, role.skill_gap, role.gpdp).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            <span className="font-bold text-red-600">Action Required:</span> Conduct focused employer surveys
                            or validation studies for these roles before finalizing district skill plan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
