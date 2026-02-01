import {
    Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Line, BarChart, Bar, ComposedChart, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, DollarSign, Activity, Building2, AlertTriangle, ArrowRight } from 'lucide-react';

// --- Data Structure ---
const data = {
    district: "Dakshina Kannada",
    base_year: "2023-24",
    projection_years: 5,
    macroeconomic_indicators: {
        district_gdp: { current: 45820, unit: "Crores INR", growth_rate_5yr: 6.8, projected_2029: 63650 },
        per_capita_income: { current: 219500, unit: "INR", growth_rate: 7.2, state_average: 245800 },
        unemployment_rate: { current: 3.8, unit: "%", trend: "Declining", state_average: 4.5 },
        urbanization_rate: { current: 42.5, unit: "%", annual_growth: 1.8, projected_2029: 51.5 }
    },
    five_year_demand_projection: [
        { year: '2024-25', gdp: 48920, total_demand: 28400, it_ites: 6200, healthcare: 4500, engineering: 9800, construction: 3850, services: 2450, agriculture: 1200, others: 400, lower: 27200, base: 28400, upper: 29600 },
        { year: '2025-26', gdp: 52250, total_demand: 30680, it_ites: 7130, healthcare: 4880, engineering: 10290, construction: 4010, services: 2600, agriculture: 1175, others: 595, lower: 29000, base: 30680, upper: 32500 },
        { year: '2026-27', gdp: 55800, total_demand: 33250, it_ites: 8200, healthcare: 5290, engineering: 10820, construction: 4180, services: 2750, agriculture: 1150, others: 860, lower: 30850, base: 33250, upper: 35650 },
        { year: '2027-28', gdp: 59595, total_demand: 36140, it_ites: 9450, healthcare: 5740, engineering: 11380, construction: 4360, services: 2910, agriculture: 1120, others: 1180, lower: 32600, base: 36140, upper: 39800 },
        { year: '2028-29', gdp: 63650, total_demand: 39380, it_ites: 10890, healthcare: 6230, engineering: 11980, construction: 4550, services: 3080, agriculture: 1090, others: 1560, lower: 34500, base: 39380, upper: 44260 }
    ],
    elasticity: [
        { sector: 'IT/ITES', elasticity: 1.85, fullMark: 2, description: "Highly elastic" },
        { sector: 'Healthcare', elasticity: 1.45, fullMark: 2, description: "Elastic" },
        { sector: 'Engineering', elasticity: 1.20, fullMark: 2, description: "Moderately elastic" },
        { sector: 'Construction', elasticity: 0.95, fullMark: 2, description: "Unit elastic" },
        { sector: 'Agriculture', elasticity: 0.35, fullMark: 2, description: "Inelastic" }
    ],
    sensitivity: [
        { scenario: "High Growth (9%)", demand: 46850, variance: 18.9, color: "#16a34a" },
        { scenario: "Base Case (6.8%)", demand: 39380, variance: 0, color: "#2563eb" },
        { scenario: "Low Growth (4%)", demand: 32150, variance: -18.4, color: "#eab308" },
        { scenario: "Recession (-2%)", demand: 23400, variance: -40.6, color: "#dc2626" }
    ],
    sector_shift: [
        { name: 'Services', current: 48.5, projected: 52.3 },
        { name: 'Manufacturing', current: 28.8, projected: 27.5 },
        { name: 'Agriculture', current: 12.5, projected: 9.2 },
        { name: 'Construction', current: 10.2, projected: 11.0 }
    ]
};

// Waterfall Data Preparation
const waterfallData = [
    { name: 'Base (2024)', value: 28400, fill: '#64748b' },
    { name: 'IT/ITES Growth', value: 4690, fill: '#22c55e' }, // 10890 - 6200
    { name: 'Healthcare', value: 1730, fill: '#22c55e' }, // 6230 - 4500
    { name: 'Engineering', value: 2180, fill: '#22c55e' }, // 11980 - 9800
    { name: 'Others Net', value: 2490, fill: '#22c55e' },
    { name: 'Agri Decline', value: -110, fill: '#ef4444', isNegative: true },
    { name: 'Total (2029)', value: 39380, fill: '#3b82f6', isTotal: true }
];

// Helper to make waterfall chart work with BarChart
const waterfallChartData = waterfallData.reduce((acc: any[], curr, idx) => {
    let start = 0;
    if (idx > 0 && idx < waterfallData.length - 1) {
        start = acc[idx - 1].end;
    }
    let end = start + curr.value;
    if (curr.isTotal) {
        start = 0;
        end = curr.value;
    }

    // For visualization we need [min, max]
    // If negative value, we bar from [end, start]
    // If positive value, we bar from [start, end]
    acc.push({
        name: curr.name,
        value: curr.value,
        barValue: [curr.isNegative ? end : start, curr.isNegative ? start : end],
        fill: curr.fill,
        end: end
    });
    return acc;
}, []);


export default function MacroEconomicDemandProjection() {
    // const [scenario, setScenario] = useState('Base Case (6.8%)');

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Macroeconomic Demand Projection</h1>
                    <p className="text-gray-500 text-sm">5-Year Forecast based on District Economic Indicators (2024-2029)</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-medium hover:bg-gray-50">Export Report</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Methodology</button>
                </div>
            </div>

            {/* Economic Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600"><TrendingUp size={24} /></div>
                    <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Proj. GDP (2029)</div>
                        <div className="text-xl font-bold text-gray-900">₹{data.macroeconomic_indicators.district_gdp.projected_2029.toLocaleString()} Cr</div>
                        <div className="text-xs text-green-600 font-medium">+{data.macroeconomic_indicators.district_gdp.growth_rate_5yr}% CAGR</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600"><DollarSign size={24} /></div>
                    <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Per Capita Income</div>
                        <div className="text-xl font-bold text-gray-900">₹{(data.macroeconomic_indicators.per_capita_income.current / 1000).toFixed(1)}k</div>
                        <div className="text-xs text-blue-600 font-medium font-medium">State Avg: ₹{(data.macroeconomic_indicators.per_capita_income.state_average / 1000).toFixed(1)}k</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full text-green-600"><Activity size={24} /></div>
                    <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Unemployment</div>
                        <div className="text-xl font-bold text-gray-900">{data.macroeconomic_indicators.unemployment_rate.current}%</div>
                        <div className="text-xs text-gray-400">Trend: {data.macroeconomic_indicators.unemployment_rate.trend}</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-full text-orange-600"><Building2 size={24} /></div>
                    <div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Urbanization</div>
                        <div className="text-xl font-bold text-gray-900">{data.macroeconomic_indicators.urbanization_rate.current}%</div>
                        <div className="text-xs text-gray-400">Proj: {data.macroeconomic_indicators.urbanization_rate.projected_2029}%</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Confidence Interval Projection */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">5-Year Skill Demand Forecast (Confidence Bands)</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.five_year_demand_projection} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(val: number) => `${val / 1000}k`} />
                                <Tooltip formatter={(val: number) => val.toLocaleString()} />
                                <Legend />
                                <Area type="monotone" dataKey="upper" stroke="none" fill="#dbeafe" name="Upper Bound (90%)" />
                                <Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" name="Lower Bound" />
                                <Line type="monotone" dataKey="base" stroke="#2563eb" strokeWidth={3} name="Base Projection" dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="it_ites" stroke="#16a34a" strokeDasharray="5 5" name="IT/ITES Trend" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demand Waterfall */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Demand Growth Drivers (2024-29)</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={waterfallChartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'transparent' }} formatter={(val: number | number[]) => Array.isArray(val) ? Math.abs(val[1] - val[0]) : val} />
                                <Bar dataKey="barValue" radius={[4, 4, 4, 4]}>
                                    {waterfallChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Elasticity Radar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Sectoral GDP Elasticity of Demand</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.elasticity}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="sector" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 2]} />
                                <Radar name="GDP Elasticity" dataKey="elasticity" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> &gt;1: High Growth Sector</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> &lt;1: Low Growth Sector</span>
                    </div>
                </div>

                {/* Sensitivity Tornado */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Sensitivity Analysis (2029 Scenarios)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.sensitivity} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[20000, 50000]} tickFormatter={(val: number) => `${val / 1000}k`} />
                                <YAxis dataKey="scenario" type="category" width={120} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(val: number) => val.toLocaleString()} />
                                <Bar dataKey="demand" radius={[0, 4, 4, 0]} barSize={40}>
                                    {data.sensitivity.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Confidence Level for Base Case is 75%. Recession scenario (-40% demand) assumes global economic downturn affecting IT/ITES exports.</p>
                    </div>
                </div>
            </div>

            {/* Sector Shift Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Structural Economic Shift (2024 vs 2029)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.sector_shift} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis label={{ value: '% Share', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="current" name="Current Share %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="projected" name="Proj. 2029 Share %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Key Insights</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                                <span><strong>Services Sector</strong> is projected to cross 52% of district GDP, driven by IT & Logistics.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-red-500 mt-0.5" />
                                <span><strong>Agriculture Share</strong> will decline to 9.2%, necessitating high-value crop training (see Primary Sector Tab).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5" />
                                <span><strong>Construction</strong> remains stable but shifts towards specialized infrastructure skills.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
