import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Share, TrendingUp } from 'lucide-react';
import GapAnalysis from '../../dashboards/GapAnalysis';
const data = {
    district: "Dakshina Kannada",
    year: "2023-24",
    executive_summary: {
        total_demand: 28400,
        current_supply: 4174,
        gap: 24226,
        gap_percentage: 85.3,
        critical_gaps: 15,
        moderate_gaps: 8,
        low_gaps: 5
    },

    sector_wise_gaps: [
        { sector: "IT & ITES", demand: 6200, supply: 650, gap: 5550, gap_pct: 89.5, severity: "Critical", growth_rate: 12.5 },
        { sector: "Healthcare", demand: 4500, supply: 720, gap: 3780, gap_pct: 84.0, severity: "Critical", growth_rate: 8.9 },
        { sector: "Engineering", demand: 9800, supply: 2260, gap: 7540, gap_pct: 76.9, severity: "High", growth_rate: 5.2 },
        { sector: "Construction", demand: 3850, supply: 280, gap: 3570, gap_pct: 92.7, severity: "Critical", growth_rate: 4.2 },
        { sector: "Services", demand: 2450, supply: 245, gap: 2205, gap_pct: 90.0, severity: "Critical", growth_rate: 3.1 },
        { sector: "Agriculture", demand: 1200, supply: 19, gap: 1181, gap_pct: 98.4, severity: "Critical", growth_rate: -2.5 }
    ],

    top_skill_gaps: [
        { skill: "Python Developer", demand: 1850, supply: 85, gap: 1765, gap_pct: 95.4, investment: 1200000 },
        { skill: "Healthcare Tech", demand: 1650, supply: 142, gap: 1508, gap_pct: 91.4, investment: 2800000 },
        { skill: "CNC Operator", demand: 1420, supply: 185, gap: 1235, gap_pct: 87.0, investment: 950000 }
    ],

    infrastructure_gaps: [
        { category: "ITI Seats", required: 8520, available: 5290 },
        { category: "Trainers", required: 245, available: 187 },
        { category: "Equipment", required: 450, available: 285 },
        { category: "Hostel Beds", required: 950, available: 700 }
    ],

    gap_closure: [
        { year: "2024-25", total_gap: 24226, projected: 22376 },
        { year: "2025-26", total_gap: 22376, projected: 19956 },
        { year: "2026-27", total_gap: 19956, projected: 16806 }
    ]
};



export default function GapAnalysisReport() {



    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gap Report Analysis</h1>
                    <p className="text-gray-500 text-sm">Demand-Supply Mismatch Analysis for {data.year}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 text-sm font-medium hover:brightness-110 transition-all">
                        <Share className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* NEW: KPI Strip (4 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Card 1: Critical Skill Gaps */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Critical Skill Gaps</h3>
                        <div className="bg-red-50 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12%
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">42</div>
                    <p className="text-xs text-red-400 mt-1 font-medium">Urgent intervention needed</p>
                </div>

                {/* Card 2: Underutilized Hubs */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Underutilized Hubs</h3>
                        <div className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 transform rotate-180" /> -5%
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">12</div>
                    <p className="text-xs text-orange-500 mt-1 font-medium">Capacity wastage alert</p>
                </div>

                {/* Card 3: Budget Shortfall */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Budget Shortfall</h3>
                        <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +8%
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">₹4.2 Cr</div>
                    <p className="text-xs text-blue-500 mt-1 font-medium">Allocation revision pending</p>
                </div>

                {/* Card 4: Action Required */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Action Required</h3>
                        <span className="bg-red-400 text-white px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">07</div>
                    <p className="text-xs text-gray-400 mt-1">Pending approvals</p>
                </div>
            </div>

            {/* NEW: Gap Analysis Matrix (Supply vs Demand) */}
            <GapAnalysis />

            {/* NEW: Specialized Gap Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Visual 1: Infrastructure Balance (Butterfly Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Infrastructure Balance</h3>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Excess</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Needed</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Healthcare', left: '20%', right: '85%' },
                            { label: 'Retail', left: '75%', right: '10%' },
                            { label: 'IT-ITES', left: '60%', right: '45%' },
                            { label: 'Construction', left: '15%', right: '90%' },
                            { label: 'Automotive', left: '50%', right: '30%' },
                        ].map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 items-center gap-4 text-xs">
                                <div className="col-span-5 flex justify-end">
                                    <div className="bg-blue-100 h-4 rounded-l-md relative transition-all hover:bg-blue-200" style={{ width: item.left }}></div>
                                </div>
                                <div className="col-span-2 text-center text-gray-500 font-bold">{item.label}</div>
                                <div className="col-span-5 flex justify-start">
                                    <div className="bg-red-100 h-4 rounded-r-md relative transition-all hover:bg-red-200" style={{ width: item.right }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual 2: Trainer Shortage (Progress Bars) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-6">Trainer Shortage By Trade</h3>
                    <div className="flex-1 space-y-5">
                        {[
                            { label: 'Solar Technician', val: '24', pct: '85%', color: 'bg-red-400' },
                            { label: 'AI Developers', val: '18', pct: '70%', color: 'bg-red-400' },
                            { label: 'CNC Operator', val: '12', pct: '55%', color: 'bg-orange-500' },
                            { label: 'Paramedics', val: '10', pct: '45%', color: 'bg-orange-500' },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs mb-1 font-medium">
                                    <span className="text-gray-700">{item.label}</span>
                                    <span className="text-gray-900 font-bold">{item.val} Openings</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.pct }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 text-center text-xs text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-colors mt-4">
                        View All Shortages
                    </button>
                </div>

                {/* Visual 3: Agriculture Skill Gaps (Heatmap) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Agriculture Skill Gaps</h3>
                        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-blue-900 via-blue-500 to-red-500"></div>
                    </div>
                    <div className="w-full">
                        <div className="grid grid-cols-5 text-[10px] font-bold text-gray-400 uppercase text-center mb-2">
                            <div></div>
                            <div>Direct</div>
                            <div>Hybrid</div>
                            <div>Digital</div>
                            <div>Field</div>
                        </div>
                        {['Rice', 'Wheat', 'Cotton', 'Spices'].map((crop, rIdx) => (
                            <div key={rIdx} className="grid grid-cols-5 items-center gap-2 mb-2 h-10">
                                <div className="text-xs font-bold text-gray-700">{crop}</div>
                                <div className={`h-full rounded bg-blue-900 opacity-20 hover:opacity-100 transition-opacity`}></div>
                                <div className={`h-full rounded ${rIdx === 1 ? 'bg-red-400' : 'bg-blue-500'} opacity-80 hover:opacity-100 transition-opacity`}></div>
                                <div className={`h-full rounded ${rIdx === 3 ? 'bg-red-400' : 'bg-blue-100'} hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold`}>
                                    {rIdx === 3 && 'Crucial'}
                                </div>
                                <div className={`h-full rounded ${rIdx === 0 ? 'bg-red-400' : 'bg-blue-200'} flex items-center justify-center text-white text-xs font-bold shadow-sm hover:scale-105 transition-transform`}>
                                    {rIdx === 0 && '92%'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual 4: Critical Compliance (Traffic Light List) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Critical Compliance Flags</h3>
                    <div className="space-y-4">
                        {/* Red Item */}
                        <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-300 shadow-sm">
                            <div className="relative">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-red-800">Block-A Assessment Delay</h4>
                                <p className="text-xs text-red-700">Overdue 14 days, 450 students affected</p>
                            </div>
                            <button className="px-3 py-1 bg-white text-red-400 text-xs font-bold rounded shadow-sm border border-red-300 hover:bg-red-50">Escalate</button>
                        </div>
                        {/* Orange Item */}
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900">Certification Pending</h4>
                                <p className="text-xs text-gray-500">5 hubs awaiting digital sign-off</p>
                            </div>
                            <button className="text-orange-500 text-xs font-bold hover:underline">Remind</button>
                        </div>
                        {/* Green Item (muted) */}
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 opacity-60">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900">Placement Drive Scheduled</h4>
                                <p className="text-xs text-gray-500">Zone-C confirmed next month</p>
                            </div>
                            <button className="text-gray-400 text-xs font-bold">Details</button>
                        </div>
                    </div>
                </div>

                {/* Visual 5: Wage vs Employment (Bubble Chart - Illustrative) */}
                <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[300px] relative">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900">Wage vs. Employment Analysis</h3>
                        <div className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded">Bubble Size = Skill Gap Magnitude</div>
                    </div>

                    {/* Chart Area */}
                    <div className="absolute inset-0 top-16 bottom-8 left-12 right-6 border-l border-b border-gray-200">
                        {/* Grid Lines */}
                        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gray-100"></div>
                        <div className="absolute bottom-2/4 left-0 w-full h-px bg-gray-100"></div>
                        <div className="absolute bottom-3/4 left-0 w-full h-px bg-gray-100"></div>

                        {/* Bubbles - positioned absolutely as per design request */}

                        {/* Logistics: High Vol, Mid Salary, Big Gap (Red) */}
                        <div className="absolute bottom-[50%] left-[70%] w-20 h-20 bg-red-400 rounded-full opacity-80 flex items-center justify-center text-white text-xs font-bold shadow-lg ring-4 ring-red-100 hover:scale-110 transition-transform cursor-pointer" title="Logistics: High Gap">
                            Logistics
                        </div>

                        {/* Pharma: Low Vol, High Salary, Small Gap (Blue) */}
                        <div className="absolute bottom-[80%] left-[20%] w-10 h-10 bg-blue-400 rounded-full opacity-90 flex items-center justify-center text-white text-[10px] font-bold shadow-md hover:scale-110 transition-transform cursor-pointer" title="Pharma">
                            Pharma
                        </div>

                        {/* Apparel: Mid Vol, Mid Salary, Med Gap (Orange) */}
                        <div className="absolute bottom-[40%] left-[45%] w-16 h-16 bg-orange-400 rounded-full opacity-80 flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-110 transition-transform cursor-pointer" title="Apparel">
                            Apparel
                        </div>

                        {/* IT-ITES: Low Vol, Low-Mid Salary, Small Gap (Blue - surprisingly small per prompt) */}
                        <div className="absolute bottom-[25%] left-[15%] w-12 h-12 bg-blue-600 rounded-full opacity-80 flex items-center justify-center text-white text-[10px] font-bold shadow-md hover:scale-110 transition-transform cursor-pointer" title="IT-ITES">
                            IT-ITES
                        </div>
                    </div>

                    {/* Axis Labels */}
                    <div className="absolute bottom-2 w-full text-center text-xs text-gray-400 font-medium uppercase tracking-wider">Placement Volume</div>
                    <div className="absolute top-1/2 -left-6 transform -rotate-90 text-xs text-gray-400 font-medium uppercase tracking-wider">Avg Salary</div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sector Gap Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Sector Gap Analysis (Demand vs Supply)</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.sector_wise_gaps} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="sector" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="supply" name="Supply" stackId="a" fill="#10b981" />
                                <Bar dataKey="gap" name="Gap" stackId="a" fill="#f87171" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Infrastructure Gap Radar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Infrastructure Gap Analysis</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.infrastructure_gaps}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="category" />
                                <PolarRadiusAxis />
                                <Radar name="Required" dataKey="required" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="Available" dataKey="available" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Skill Gaps */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Skill Gaps & Investment Needed</h3>
                    <div className="space-y-4">
                        {data.top_skill_gaps.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 border border-gray-50 rounded-lg hover:bg-gray-50">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-400 font-bold text-xs ring-4 ring-red-50">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                                        <span className="text-sm font-bold text-red-400">{skill.gap.toLocaleString()} Gap</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-red-400 h-2 rounded-full" style={{ width: `${skill.gap_pct}%` }}></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>Supply: {skill.supply}</span>
                                        <span>Est. Investment: ₹{(skill.investment / 100000).toFixed(1)}L</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gap Closure Projection */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Gap Closure Projection</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.gap_closure} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total_gap" stroke="#ef4444" strokeWidth={2} name="Total Gap" />
                                <Line type="monotone" dataKey="projected" stroke="#10b981" strokeDasharray="5 5" name="Projected" />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-center text-gray-400 mt-2">Projected reduction based on current interventions</p>
                    </div>
                </div>
            </div>

        </div>

    );
}
