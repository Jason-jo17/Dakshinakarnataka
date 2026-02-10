import { cn } from '../../lib/utils';
import { Users, Database, GraduationCap, TrendingDown, Leaf, UserX, AlertCircle, Shield, Zap } from 'lucide-react';
import { AIInsights } from '../common/AIInsights';


// From Image 8: 5. Gap Analysis - Demand Supply Gap Manufacturing Service
const MANUFACTURING_GAPS = [
    { sector: 'Capital Goods', trade: 'Fitter Fabrication', capacityNeeded: 60 },
    { sector: 'Domestic Worker', trade: 'Household Multipurpose Executive', capacityNeeded: 150 },
    { sector: 'Capital Goods', trade: 'Resistance Spot Welding Machine Operator', capacityNeeded: 200 },
    { sector: 'Apparel, Made-Ups & Home Furnishing', trade: 'Sewing machine Operator', capacityNeeded: 300 },
    { sector: 'Automotive', trade: 'Automation Specialist', capacityNeeded: 50 },
];

// From Image 9: 3B.2 Primary Sector Gaps - UPDATED from Skill Gaps table
const PRIMARY_GAPS = [
    { crop: 'Focus Crop-Paddy', category: 'Regular/RPL/SHG/FPO Training', gap: 92, severity: 'critical', people: 12400 },
    { crop: 'Horticulture', category: 'Regular/RPL/SHG/FPO Training', gap: 78, severity: 'high', people: 8600 },
    { crop: 'NTFP', category: 'Regular/RPL/SHG/FPO Training', gap: 85, severity: 'critical', people: 6200 },
];

// From Image 9: 3B.4 Inclusion Gaps - UPDATED with Image 10 Inclusion Gaps
const INCLUSION_GAPS_DETAILED = {
    pwd: [
        { sector: 'BFSI', trade: 'Operations executive lending' },
        { sector: 'Others', trade: 'Distributor salesman' },
        { sector: 'Media & Entertainment', trade: 'Graphic designer' },
    ],
    women: [
        { sector: 'Domestic Worker', trade: 'Housekeeping General' },
        { sector: 'Apparel', trade: 'Sewing Operator' },
        { sector: 'Management & Entrepreneurship', trade: 'Plan for basic entrepreneurial activity' },
    ]
};

// From Image 10: 5. Data Collection Gap
const DATA_GAPS = [
    { scheme: 'CMKKY', level: 'State Govt', status: 'Pending MIS Integration' },
    { scheme: 'PMKVY', level: 'Central Govt', status: 'Pending MIS Integration' },
    { scheme: 'Other Department Training', level: 'Others', status: 'Untracked' },
];

// From Image 11: 6. Gaps in Skill Delivery
const TRAINER_GAPS = [
    { sector: 'Apparel, Made-Ups & Home Furnishing', trainersNeeded: 40 },
    { sector: 'Beauty & Wellness', trainersNeeded: 60 },
    { sector: 'Capital Goods', trainersNeeded: 50 },
    { sector: 'Domestic Worker', trainersNeeded: 80 },
];

const GEOGRAPHIC_GAPS = ['Sulliya', 'Puttur', 'Beltangadi', 'Kadaba'];

const GAP_AREAS = [
    { id: 1, area: 'Demand-Supply Mismatch', severity: 'critical', affected: 191000, gapPct: 48, timeline: 'Immediate', icon: AlertCircle, color: 'danger' },
    { id: 2, area: 'Primary Sector Skills (Agri)', severity: 'critical', affected: 22000, gapPct: 85, timeline: 'Immediate', icon: Leaf, color: 'danger' },
    { id: 3, area: 'Trainer Shortage', severity: 'high', affected: 8400, gapPct: 45, timeline: '3-6 months', icon: GraduationCap, color: 'warning' },
    { id: 4, area: 'Inclusion (Women/PWD)', severity: 'high', affected: 39000, gapPct: 34, timeline: 'Ongoing', icon: Users, color: 'warning' },
    { id: 5, area: 'Data Collection Gaps', severity: 'high', affected: null, gapPct: 75, timeline: 'Immediate', icon: Database, color: 'warning' },
    { id: 6, area: 'Geographic Access (Sulliya/Puttur)', severity: 'medium', affected: 51000, gapPct: 42, timeline: '12+ months', icon: UserX, color: 'warning' },
];

export default function ComprehensiveGap() {
    return (
        <div className="w-full space-y-8 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Consolidated Gap Analysis</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        District Skill Development Plan 2024-25 • Templates 3B.2–3B.8 & 5.0
                    </p>
                </div>
                <div className="bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg">
                    Gap Assessment Matrix
                </div>
            </div>

            {/* 1. SECTORAL GAPS: MANUFACTURING & SERVICE (Image 8) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            Demand-Supply Gap: Manufacturing & Service
                        </h3>
                        <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">Image 8: 5.1</span>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Sector</th>
                                    <th className="px-4 py-3">Trade</th>
                                    <th className="px-4 py-3 text-right">Incremental Capacity Needed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {MANUFACTURING_GAPS.map((gap, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{gap.sector}</td>
                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{gap.trade}</td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold rounded-lg border border-red-100 dark:border-red-800">
                                                {gap.capacityNeeded}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Trainer Shortage Summary (Image 11) */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-amber-500" />
                            Trainer Shortage
                        </h3>
                        <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase">Image 11: 6.0</span>
                    </div>
                    <div className="p-6 flex-1 space-y-6">
                        {TRAINER_GAPS.map((tg, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate pr-4">{tg.sector}</span>
                                    <span className="text-amber-600 font-black">{tg.trainersNeeded} Needed</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-sm"
                                        style={{ width: `${(tg.trainersNeeded / 80) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 mt-4 text-xs text-amber-800 dark:text-amber-400 leading-relaxed italic">
                            Overall trainee-trainer ratio currently stands at 24:1 against the ideal norm of 15:1.
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PRIMARY SECTOR & GEOGRAPHIC GAPS (Image 9) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Primary Sector Table-like View */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 border-b border-emerald-100 dark:border-emerald-900/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                            <Leaf className="h-5 w-5" />
                            Skill Gaps: Primary Sector
                        </h3>
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase font-mono">Image 9: 3B.2</span>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-2 py-3">Focus Crop</th>
                                    <th className="px-2 py-3">Training Type</th>
                                    <th className="px-2 py-3">Regular</th>
                                    <th className="px-2 py-3">RPL</th>
                                    <th className="px-2 py-3">SHG/FPO</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {PRIMARY_GAPS.map((pg, i) => (
                                    <tr key={i} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
                                        <td className="px-2 py-4 font-black text-slate-900 dark:text-white">{pg.crop}</td>
                                        <td className="px-2 py-4 text-slate-500 italic">Essential Gaps</td>
                                        <td className="px-2 py-4 text-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mx-auto" /></td>
                                        <td className="px-2 py-4 text-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mx-auto opacity-50" /></td>
                                        <td className="px-2 py-4 text-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mx-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Geographic & Inclusion Gaps */}
                <div className="space-y-6">
                    {/* Geographic Access */}
                    <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/20 p-6 flex items-start gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/50">
                            <UserX className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Geographical Coverage Gaps</h4>
                                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Image 9: 3B.3</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium italic">Training Centers critically needed in:</p>
                            <div className="flex flex-wrap gap-2">
                                {GEOGRAPHIC_GAPS.map(block => (
                                    <span key={block} className="px-4 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        {block}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Inclusion Gaps (PWD & Women) */}
                    <div className="rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-900/20 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Inclusion Gaps (Image 10: 4.0)
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-black text-purple-600 uppercase tracking-widest px-2">PWD Inclusion</h5>
                                {INCLUSION_GAPS_DETAILED.pwd.map((g, i) => (
                                    <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm group hover:border-purple-400 transition-colors">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{g.trade}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{g.sector}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-black text-pink-600 uppercase tracking-widest px-2">Women Inclusion</h5>
                                {INCLUSION_GAPS_DETAILED.women.map((g, i) => (
                                    <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-pink-100 dark:border-pink-800 shadow-sm group hover:border-pink-400 transition-colors">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{g.trade}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{g.sector}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. DATA & ACTION MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Data Collection Gap Indicator (Image 10) */}
                <div className="lg:col-span-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10 p-6 flex flex-col items-center">
                    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-6 w-full flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <Database className="w-5 h-5" /> Data Gaps
                        </span>
                        <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded">Image 10: 5.0</span>
                    </h4>
                    <div className="flex-1 space-y-4 w-full">
                        {DATA_GAPS.map((dg, i) => (
                            <div key={dg.scheme} className="flex items-center gap-4">
                                <div className={`w-3 h-12 rounded-full ${i === 2 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-400 opacity-60'}`} />
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{dg.scheme}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{dg.level}</p>
                                    <p className="text-[10px] text-red-600 font-black mt-1 italic">{dg.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* High Level Conclusion / AI Summary */}
                <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-slate-900 dark:border-white bg-slate-900 dark:bg-slate-800 p-8 text-white h-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-1/4 -translate-y-1/4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                            <Shield className="w-32 h-32" />
                        </div>
                        <h4 className="text-2xl font-bold mb-4 relative z-10 flex items-center gap-3">
                            Strategic Insight Summary
                            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                        </h4>
                        <div className="space-y-4 text-slate-300 text-sm leading-relaxed relative z-10">
                            <p>
                                The gap assessment for <span className="text-white font-bold">DK District (2024-25)</span> reveals a high-severity deficit in <span className="text-emerald-400 font-bold">Primary Sector training (85%)</span> and critical trainer shortages in <span className="text-amber-400 font-bold">Apparel and Domestic services</span>.
                            </p>
                            <p>
                                Geographical silos in <span className="text-white font-bold">Sulliya and Kadaba</span> are preventing equitable skill distribution, while inclusion gaps for PWD and Women remain unaddressed in high-growth sectors like BFSI and Media.
                            </p>
                            <div className="pt-4 flex gap-4">
                                <div className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl border border-white/20 backdrop-blur-sm">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Priority Gaps</p>
                                    <p className="text-lg font-bold text-white">42 Indicators</p>
                                </div>
                                <div className="px-4 py-2 bg-red-500/20 rounded-xl border border-red-500/30 backdrop-blur-sm">
                                    <p className="text-[10px] font-black uppercase text-red-400 mb-1">Critical Urgency</p>
                                    <p className="text-lg font-bold text-red-400">7 Active Flags</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Dimensions Visualizer (Retained but hidden in main view to reduce clutter) */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Multi-Dimensional Gap Metric (Image 2-5 Reference Data)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {GAP_AREAS.map((gap) => (
                        <div key={gap.id} className={cn(
                            'rounded-xl border p-5 transition-all hover:shadow-lg',
                            gap.color === 'danger' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                        )}>
                            <div className="flex items-start justify-between mb-3">
                                <gap.icon className={cn('h-6 w-6', gap.color === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400')} />
                                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono tracking-tighter',
                                    gap.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                                )}>{gap.severity}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{gap.area}</h3>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">Timeline</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{gap.timeline}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{gap.gapPct}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AIInsights context="district comprehensive gap analysis including manufacturing, agrarial, inclusion, and data collection gaps" />
        </div>
    );
}
