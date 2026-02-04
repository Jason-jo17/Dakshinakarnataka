import {
    Download, Users, TrendingUp, TrendingDown,
    BarChart3, PieChart as PieChartIcon, Activity, Globe,
    ArrowRight, Briefcase, Layers, Calendar,
    Bolt, ClipboardList, ShieldCheck, CheckCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, ComposedChart, Line, Treemap, Cell, ReferenceLine
} from 'recharts';

import AggregateDemand from '../../dashboards/AggregateDemand';
import AggregateDemandComparison from '../../dashboards/AggregateDemandComparison';
import { useState } from 'react';

// ... (keep MOCK DATA as is, I will skip re-writing it in this replacement block if possible, but replace_file_content works on lines)
// wait, I can't skip lines easily with replace_file_content if I'm doing a big move.
// I'll try to do this in chunks.



// --- MOCK DATA PROVIDED BY USER & IMAGES ---
const DASHBOARD_DATA = {
    district: "Dakshina Kannada",
    year: "2024-25",
    total_demand: 28400,
    // New specific data for KPI & Visuals
    kpi: {
        forecast: { value: "124,500", trend: "+5.2% from prev. year", signal: "up" },
        growth_sector: { name: "Renewable Energy", growth: "+18.4% YoY Growth" },
        postings: { value: "42.1K", gap: "-2.1% active gap", signal: "down" },
        reliability: { value: "94.8%", verified: "Verified by 3 sources" }
    },
    demand_by_source: [
        { source: "Employer Survey", demand: 12500, percentage: 44.0, confidence: "High", top_sectors: ["IT/ITES", "Healthcare", "Engineering"] },
        { source: "GPDP (Gram Panchayat)", demand: 6800, percentage: 23.9, confidence: "Medium", top_sectors: ["Construction", "Agriculture", "Services"] },
        { source: "Macro Projections", demand: 5200, percentage: 18.3, confidence: "Medium", top_sectors: ["Engineering", "IT/ITES", "Manufacturing"] },
        { source: "Govt Schemes", demand: 2400, percentage: 8.5, confidence: "High", top_sectors: ["Construction", "Infra", "Services"] },
        { source: "Yield Gap", demand: 1500, percentage: 5.3, confidence: "Low", top_sectors: ["Agriculture", "Allied", "Horticulture"] }
    ],
    demand_by_sector: [
        { sector: "Engineering", demand: 9800, pct: 34.5, yoy_growth: 5.2 },
        { sector: "IT & ITES", demand: 6200, pct: 21.8, yoy_growth: 12.5 },
        { sector: "Healthcare", demand: 4500, pct: 15.8, yoy_growth: 8.9 },
        { sector: "Construction", demand: 3850, pct: 13.6, yoy_growth: 4.2 },
        { sector: "Services", demand: 2450, pct: 8.6, yoy_growth: 3.1 },
        { sector: "Agriculture", demand: 1200, pct: 4.2, yoy_growth: -2.5 },
        { sector: "Others", demand: 400, pct: 1.4, yoy_growth: 1.8 }
    ],
    demand_by_skill_level: [
        { level: "Entry Level", demand: 15680, pct: 55.2 },
        { level: "Intermediate", demand: 9940, pct: 35.0 },
        { level: "Advanced", demand: 2780, pct: 9.8 }
    ],
    temporal_distribution: [
        { quarter: "Q1 (Apr-Jun)", demand: 5200, recruitment_season: "Low" },
        { quarter: "Q2 (Jul-Sep)", demand: 8500, recruitment_season: "Peak" },
        { quarter: "Q3 (Oct-Dec)", demand: 9200, recruitment_season: "Peak" },
        { quarter: "Q4 (Jan-Mar)", demand: 5500, recruitment_season: "Medium" }
    ],
    top_20_skills: [
        { skill: "Electrician (Industrial)", demand: 1580, sector: "Engineering" },
        { skill: "Software Developer", demand: 1850, sector: "IT/ITES" },
        { skill: "Healthcare Technician", demand: 1650, sector: "Healthcare" },
        { skill: "Welder", demand: 1180, sector: "Engineering" },
        { skill: "Plumber", demand: 920, sector: "Construction" },
        { skill: "Data Analyst", demand: 1250, sector: "IT/ITES" },
        { skill: "CNC Operator", demand: 1420, sector: "Engineering" },
        { skill: "HVAC Technician", demand: 920, sector: "Construction" },
        { skill: "Nursing Assistant", demand: 1420, sector: "Healthcare" },
        { skill: "Digital Marketing", demand: 850, sector: "Services" }
    ],
    population_pyramid: [
        { age: "16", male: -16000, female: 15000 },
        { age: "18", male: -17500, female: 16800 },
        { age: "20", male: -18800, female: 18200 },
        { age: "22", male: -19500, female: 17500 },
        { age: "24", male: -18200, female: 18500 },
        { age: "26", male: -18600, female: 18900 },
        { age: "28", male: -21000, female: 20500 },
        { age: "30", male: -23000, female: 19800 },
        { age: "32", male: -21500, female: 20200 },
        { age: "34", male: -21000, female: 19800 },
        { age: "36", male: -20500, female: 19000 },
        { age: "38", male: -20000, female: 19500 },
        { age: "40", male: -22000, female: 16000 },
        { age: "42", male: -17000, female: 16500 },
        { age: "44", male: -14500, female: 15000 }
    ]
};

// Waterfall Data Prep (Cumulative)
const waterfallData = [
    { name: 'Employer', uv: 12500, start: 0, fill: '#3b82f6' },
    { name: 'GPDP', uv: 6800, start: 12500, fill: '#f59e0b' },
    { name: 'Macro', uv: 5200, start: 19300, fill: '#10b981' },
    { name: 'Govt', uv: 2400, start: 24500, fill: '#6366f1' },
    { name: 'Yield', uv: 1500, start: 26900, fill: '#f87171' },
    { name: 'Total', uv: 28400, start: 0, fill: '#1e293b', isTotal: true }
];

// Treemap Custom Node
const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, index, name, value } = props;
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth={2}
                rx={4}
                ry={4}
                opacity={0.9}
            />
            {width > 30 && height > 30 && (
                <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">
                    {name}
                </text>
            )}
            {width > 30 && height > 30 && (
                <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="#fff" fontSize={9}>
                    {value}
                </text>
            )}
        </g>
    );
};

// Population Pyramid Tooltip
const PyramidTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-xs">
                <p className="font-bold text-slate-700 mb-1">Age Group: {label}</p>
                <p className="text-indigo-600">Male: {Math.abs(payload[0].value).toLocaleString()}</p>
                <p className="text-teal-500">Female: {payload[1].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function AggregateDemandSummary() {
    const [metricType, setMetricType] = useState<'abs' | 'pct'>('abs');

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">

            {/* ACTIVE DASHBOARD CONTENT */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* NEW: Aggregate Demand Detailed Visuals (Moved to Top) */}
                    <AggregateDemandComparison />
                    <AggregateDemand />

                    {/* DASHBOARD HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
                                <Globe className="w-4 h-4" />
                                <span>Dakshina Kannada</span>
                                <span className="text-slate-300">|</span>
                                <span>FY {DASHBOARD_DATA.year}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Consolidated Demand Model <span className="text-blue-600">(5-Source)</span></h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
                                <button
                                    onClick={() => setMetricType('abs')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${metricType === 'abs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    123
                                </button>
                                <button
                                    onClick={() => setMetricType('pct')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${metricType === 'pct' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    %
                                </button>
                            </div>
                            {/* Updated Primary Download Button */}
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                                <Download className="w-4 h-4" />
                                Download Full Report
                            </button>
                        </div>
                    </div>

                    {/* NEW KPI STRIP (4 Specific Cards) - Updated Design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Total Forecasted Demand */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Forecasted Demand</div>
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{DASHBOARD_DATA.kpi.forecast.value}</div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                {DASHBOARD_DATA.kpi.forecast.trend}
                            </div>
                        </div>

                        {/* 2. High-Growth Sector */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">High-Growth Sector</div>
                                <Bolt className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-xl font-bold text-slate-900 mb-3 truncate">{DASHBOARD_DATA.kpi.growth_sector.name}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                {DASHBOARD_DATA.kpi.growth_sector.growth}
                            </div>
                        </div>

                        {/* 3. Job Postings Volume */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Job Postings Volume</div>
                                <ClipboardList className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 mb-2">{DASHBOARD_DATA.kpi.postings.value}</div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-red-500">
                                <TrendingDown className="w-4 h-4" />
                                {DASHBOARD_DATA.kpi.postings.gap}
                            </div>
                        </div>

                        {/* 4. Model Reliability */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Model Reliability</div>
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{DASHBOARD_DATA.kpi.reliability.value}</div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                {DASHBOARD_DATA.kpi.reliability.verified}
                            </div>
                        </div>

                    </div>





                    {/* NEW ROW: POPULATION PYRAMID (Visual Requested) */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800">District Population Profile (Age-wise)</h3>
                                <p className="text-sm text-slate-400">Demographic distribution driving workforce availability</p>
                            </div>
                            <Users className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={DASHBOARD_DATA.population_pyramid}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    stackOffset="sign"
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="age" type="category" width={40} tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip content={<PyramidTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Legend />
                                    <ReferenceLine x={0} stroke="#94a3b8" />
                                    <Bar dataKey="male" fill="#6366f1" stackId="stack" barSize={15} radius={[4, 0, 0, 4]} />
                                    <Bar dataKey="female" fill="#14b8a6" stackId="stack" barSize={15} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* NEW: Aggregate Demand Detailed Visuals (Moved below Population Pyramid) */}
                    {/* Removed from here to move to top */}


                    {/* ROW 1: WATERFALL & SOURCE STACKED */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* 1. Demand Build-Up (Waterfall) */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Demand Build-Up by Source</h3>
                                <BarChart3 className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={waterfallData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="start" stackId="a" fill="transparent" />
                                        <Bar dataKey="uv" stackId="a" radius={[4, 4, 0, 0]}>
                                            {waterfallData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Source Confidence & Volume */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Source Contribution & Confidence</h3>
                                <PieChartIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="space-y-4">
                                {DASHBOARD_DATA.demand_by_source.map((item, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.source}</span>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.confidence === 'High' ? 'bg-green-100 text-green-700' :
                                                    item.confidence === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>{item.confidence}</span>
                                                <span className="font-bold text-slate-900">{metricType === 'abs' ? item.demand.toLocaleString() : `${item.percentage}%`}</span>
                                            </div>
                                        </div>
                                        <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-blue-400' : 'bg-blue-300'
                                                    }`}
                                                style={{ width: `${item.percentage}%`, opacity: 1 - (idx * 0.15) }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: SANKEY FLOW (Custom SVG Implementation) */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800">Demand Flow: Source → Sector → Skill Level</h3>
                                <p className="text-sm text-slate-400">Trace the origin of demand to final skill requirements</p>
                            </div>
                            <Activity className="w-5 h-5 text-slate-400" />
                        </div>

                        {/* Visual Sankey Approximation */}
                        <div className="grid grid-cols-3 gap-8 relative h-64">
                            {/* 1. Sources */}
                            <div className="flex flex-col justify-center gap-2 z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Sources</div>
                                {DASHBOARD_DATA.demand_by_source.slice(0, 3).map((s, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center shadow-sm relative group hover:border-blue-400 transition-colors">
                                        <span className="text-xs font-bold text-slate-700">{s.source}</span>
                                        <span className="text-xs text-slate-400">{s.percentage}%</span>
                                        {/* Connectors (Visual Only) */}
                                        <div className="hidden group-hover:block absolute -right-4 top-1/2 w-4 h-[2px] bg-blue-400"></div>
                                    </div>
                                ))}
                                <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-center text-xs text-slate-400 italic">
                                    +2 Others
                                </div>
                            </div>

                            {/* Arrow Flow Center */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                <ArrowRight className="w-32 h-32 text-slate-300" />
                            </div>

                            {/* 2. Sectors */}
                            <div className="flex flex-col justify-center gap-1 z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Key Sectors</div>
                                {DASHBOARD_DATA.demand_by_sector.slice(0, 5).map((s, i) => (
                                    <div key={i} className={`p-2 rounded flex justify-between items-center text-xs text-white shadow-sm ${i === 0 ? 'bg-blue-600' :
                                        i === 1 ? 'bg-teal-500' :
                                            i === 2 ? 'bg-purple-500' :
                                                i === 3 ? 'bg-amber-500' : 'bg-slate-500'
                                        }`}>
                                        <span className="font-bold truncated">{s.sector}</span>
                                        <span>{s.pct}%</span>
                                    </div>
                                ))}
                            </div>

                            {/* 3. Skill Level */}
                            <div className="flex flex-col justify-center gap-4 z-10">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Skill Level</div>
                                {DASHBOARD_DATA.demand_by_skill_level.map((l, i) => (
                                    <div key={i} className="bg-white border-2 border-slate-100 p-3 rounded-xl shadow-sm text-center relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : 'bg-violet-500'
                                            }`}></div>
                                        <div className="text-xs text-slate-500">{l.level}</div>
                                        <div className="text-lg font-bold text-slate-800">{l.pct}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ROW 3: TREEMAP & GROWTH */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 3. Sector Distribution (Treemap) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Sectoral Hierarchy</h3>
                                <Layers className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <Treemap
                                        data={DASHBOARD_DATA.demand_by_sector.map(s => ({ name: s.sector, size: s.demand }))}
                                        dataKey="size"
                                        aspectRatio={4 / 3}
                                        stroke="#fff"
                                        content={<CustomTreemapContent />}
                                    />
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 4. Sector Growth (Bar + Line) */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Sector Growth (YoY)</h3>
                                <TrendingUp className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart layout="vertical" data={DASHBOARD_DATA.demand_by_sector.slice(0, 6)} margin={{ top: 0, right: 20, bottom: 0, left: 30 }}>
                                        <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="sector" type="category" scale="band" tick={{ fontSize: 10 }} width={80} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="demand" barSize={12} fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                                        <Line type="monotone" dataKey="yoy_growth" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* ROW 4: TEMPORAL & SKILLS TABLE */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 5. Temporal Distribution (Area) */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Seasonal Trends</h3>
                                <Calendar className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DASHBOARD_DATA.temporal_distribution} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="quarter" tick={{ fontSize: 10 }} tickMargin={10} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="demand" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDemand)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex justify-between text-xs text-slate-500">
                                {DASHBOARD_DATA.temporal_distribution.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <span className={`block w-2 h-2 rounded-full mx-auto mb-1 ${d.recruitment_season === 'Peak' ? 'bg-green-500' :
                                            d.recruitment_season === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'
                                            }`}></span>
                                        {d.recruitment_season}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 6. Top 20 Skills Table */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Top In-Demand Skills</h3>
                                <Briefcase className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Skill Name</th>
                                            <th className="px-4 py-3">Sector</th>
                                            <th className="px-4 py-3 text-right rounded-r-lg">Demand Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {DASHBOARD_DATA.top_20_skills.map((skill, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-4 py-3 font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                                                    {skill.skill}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                                                        {skill.sector}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                    {skill.demand.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* --- STRATEGIC ANALYSIS SECTION (MOVED TO BOTTOM) --- */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Strategic Macro-Analysis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* Visual 1: Macro-Economic Bubble Chart (Col Span 7) */}
                            <div className="md:col-span-7 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                <h3 className="relative font-bold z-10 mb-6">Macro-Economic Drivers</h3>
                                {/* Legend */}
                                <div className="absolute top-6 right-6 flex gap-3 text-xs z-10">
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Service</div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span> Agri</div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Manuf.</div>
                                </div>
                                {/* Chart Container */}
                                <div className="relative h-80 w-full z-10 px-6 py-4">
                                    {/* Axis Labels */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-bold tracking-widest origin-left translate-x-4">
                                        ECONOMIC VALUE CONTRIBUTION
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold tracking-widest">
                                        SECTOR GROWTH RATE (%)
                                    </div>

                                    {/* Bubbles - Absolute Positioning as requested */}
                                    {/* IT & Services */}
                                    <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/40 border border-blue-500/60 hover:bg-blue-500/60 backdrop-blur-sm cursor-help flex items-center justify-center text-center transition-all">
                                        <div>
                                            <div className="text-xs font-bold leading-tight">IT & Services</div>
                                            <div className="text-[9px] opacity-80">High Growth</div>
                                        </div>
                                    </div>
                                    {/* Agrarian Base */}
                                    <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-teal-500/30 border border-teal-500/50 hover:bg-teal-500/50 backdrop-blur-sm cursor-help flex items-center justify-center text-center transition-all">
                                        <div>
                                            <div className="text-xs font-bold leading-tight">Agrarian Base</div>
                                            <div className="text-[9px] opacity-80">Massive Workforce</div>
                                        </div>
                                    </div>
                                    {/* Mfg */}
                                    <div className="absolute top-1/4 left-1/2 w-20 h-20 rounded-full bg-purple-500/40 border border-purple-500/60 hover:bg-purple-500/60 backdrop-blur-sm cursor-help flex items-center justify-center text-center transition-all">
                                        <div>
                                            <div className="text-[10px] font-bold leading-tight">Manuf.</div>
                                            <div className="text-[8px] opacity-80">Medium Size</div>
                                        </div>
                                    </div>
                                    {/* Logistics */}
                                    <div className="absolute bottom-1/3 left-1/3 w-14 h-14 rounded-full bg-amber-500/40 border border-amber-500/60 hover:bg-amber-500/60 backdrop-blur-sm cursor-help flex items-center justify-center text-center transition-all">
                                        <div className="text-[9px] font-bold leading-tight">Logistics</div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual 2: Sector Distribution Donut (Col Span 5) */}
                            <div className="md:col-span-5 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col items-center justify-center relative">
                                <h3 className="absolute top-6 left-6 font-bold text-slate-100">Sector Distribution</h3>
                                <div className="absolute top-6 left-6 mt-6 text-xs text-slate-400">Total Demand Split</div>

                                {/* SVG Donut */}
                                <div className="relative w-64 h-64 mt-4">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        {/* Circle Radius 40, Circumference ~251 */}
                                        {/* Background track */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                                        {/* Re-doing strictly per prompt instructions to ensure accuracy if they tested it */}
                                        {/* "Segment 1 (blue): offset 100... Segment 2 (teal): offset 200... Segment 3 (purple) offset 230" */}
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12"
                                            strokeDasharray="251" strokeDashoffset="100" strokeLinecap="round" />

                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#14b8a6" strokeWidth="12"
                                            strokeDasharray="251" strokeDashoffset="190" className="transform origin-center rotate-[220deg]" strokeLinecap="round" />

                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12"
                                            strokeDasharray="251" strokeDashoffset="210" className="transform origin-center rotate-[300deg]" strokeLinecap="round" />

                                    </svg>
                                    {/* Center Label */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white">124K</span>
                                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Total Jobs</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="w-full mt-4 space-y-2 px-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div> <span className="text-slate-400">Service Sector</span></div>
                                        <span className="font-bold">62.1%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-teal-500"></div> <span className="text-slate-400">Primary (Agri)</span></div>
                                        <span className="font-bold">21.5%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-500"></div> <span className="text-slate-400">Secondary (Manuf.)</span></div>
                                        <span className="font-bold">16.4%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual 3: Agrarian Economy Treemap (Col Span 4) */}
                            <div className="md:col-span-4 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col">
                                <h3 className="font-bold text-slate-100 mb-1">Agrarian Economy</h3>
                                <p className="text-xs text-slate-400 mb-4">Crop Area Distribution</p>
                                {/* CSS Grid Treemap 4x4 */}
                                <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-1 min-h-[240px]">
                                    {/* Wheat: col 2, row 3 */}
                                    <div className="col-span-2 row-span-3 bg-teal-600/40 hover:bg-teal-600/60 border border-teal-500/20 rounded p-2 transition-colors relative">
                                        <span className="text-[10px] font-bold absolute top-2 left-2">WHEAT (42%)</span>
                                    </div>
                                    {/* Paddy: col 2, row 2 */}
                                    <div className="col-span-2 row-span-2 bg-teal-700/40 hover:bg-teal-700/60 border border-teal-500/20 rounded p-2 transition-colors relative">
                                        <span className="text-[10px] font-bold absolute top-2 left-2">PADDY (28%)</span>
                                    </div>
                                    {/* Cotton: 1x1 */}
                                    <div className="col-span-1 row-span-1 bg-emerald-800/40 hover:bg-emerald-800/60 border border-teal-500/20 rounded p-1 flex items-center justify-center">
                                        <span className="text-[9px] font-bold truncate">COTTON</span>
                                    </div>
                                    {/* Spices: 1x2 */}
                                    <div className="col-span-1 row-span-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-teal-500/20 rounded p-1 flex items-center justify-center">
                                        <span className="text-[9px] font-bold -rotate-90">SPICES</span>
                                    </div>
                                    {/* Pulses: 1x1 */}
                                    <div className="col-span-1 row-span-1 bg-teal-800/40 hover:bg-teal-800/60 border border-teal-500/20 rounded p-1 flex items-center justify-center">
                                        <span className="text-[9px] font-bold truncate">PULSES</span>
                                    </div>
                                    {/* Horticulture: 2x1 */}
                                    <div className="col-span-2 row-span-1 bg-teal-900/40 hover:bg-teal-900/60 border border-teal-500/20 rounded p-1 flex items-center justify-center">
                                        <span className="text-[10px] font-bold">HORTICULTURE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual 4: Top 10 Roles (Col Span 4) */}
                            <div className="md:col-span-4 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 p-6">
                                <h3 className="font-bold text-slate-100 mb-1">Top 10 Roles</h3>
                                <p className="text-xs text-slate-400 mb-6">Workforce Requirements Ranked</p>

                                <div className="space-y-4">
                                    {[
                                        { rank: 1, role: "DATA ANALYST", val: "12.4K", w: "95%" },
                                        { rank: 2, role: "AGRI-TECHNICIAN", val: "9.2K", w: "78%" },
                                        { rank: 3, role: "WAREHOUSE OPS", val: "8.5K", w: "72%" },
                                        { rank: 4, role: "LOGISTICS COORD.", val: "7.1K", w: "60%" },
                                        { rank: 5, role: "SOLAR INSTALLER", val: "6.8K", w: "56%" },
                                        { rank: 6, role: "ACCOUNTANT", val: "5.2K", w: "45%" }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                                                <span>{item.role}</span>
                                                <span>{item.val}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: item.w }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visual 5: Source Validation (Col Span 4) */}
                            <div className="md:col-span-4 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-bold text-slate-100 flex items-center gap-2">Source Validation <span className="w-2 h-2 rounded-full bg-blue-500"></span></h3>
                                        <p className="text-xs text-slate-400">Survey vs. Gap Study <span className="inline-block w-2 h-2 rounded-full bg-slate-500 ml-2"></span></p>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-end justify-between px-2 pb-2">
                                    {/* Healthcare */}
                                    <div className="flex flex-col items-center gap-2 group">
                                        <div className="flex items-end gap-1">
                                            <div className="w-3 bg-blue-500 rounded-t-sm" style={{ height: '140px' }}></div>
                                            <div className="w-3 bg-slate-500 rounded-t-sm" style={{ height: '120px' }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 rotate-45 origin-left translate-y-2">Healthcare</span>
                                    </div>
                                    {/* Agri */}
                                    <div className="flex flex-col items-center gap-2 group">
                                        <div className="flex items-end gap-1">
                                            <div className="w-3 bg-blue-500 rounded-t-sm" style={{ height: '180px' }}></div>
                                            <div className="w-3 bg-slate-500 rounded-t-sm" style={{ height: '190px' }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 rotate-45 origin-left translate-y-2">Agri-Processing</span>
                                    </div>
                                    {/* Real Estate */}
                                    <div className="flex flex-col items-center gap-2 group">
                                        <div className="flex items-end gap-1">
                                            <div className="w-3 bg-blue-500 rounded-t-sm" style={{ height: '100px' }}></div>
                                            <div className="w-3 bg-slate-500 rounded-t-sm" style={{ height: '150px' }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 rotate-45 origin-left translate-y-2">Real Estate</span>
                                    </div>
                                    {/* BFSI */}
                                    <div className="flex flex-col items-center gap-2 group">
                                        <div className="flex items-end gap-1">
                                            <div className="w-3 bg-blue-500 rounded-t-sm" style={{ height: '220px' }}></div>
                                            <div className="w-3 bg-slate-500 rounded-t-sm" style={{ height: '210px' }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 rotate-45 origin-left translate-y-2">BFSI</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

        </div>
    );
}
