
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const data = {
    plan_year: "2024-25",
    total_budget: 318550000,
    pillars: [
        { name: "Primary Sector", budget: 285000000, progress: 15, status: "On Track" },
        { name: "Capacity Exp", budget: 8500000, progress: 40, status: "In Progress" },
        { name: "Quality Enh", budget: 6200000, progress: 25, status: "Delayed" },
        { name: "Geo Equity", budget: 5500000, progress: 10, status: "Planning" },
        { name: "GPDP & Govt", budget: 4200000, progress: 30, status: "In Progress" },
        { name: "Social Incl", budget: 3200000, progress: 20, status: "On Track" },
        { name: "Industry", budget: 2000000, progress: 50, status: "On Track" }
    ],
    funding: [
        { name: "State Budget", value: 145000000, color: "#3b82f6" },
        { name: "SDRF", value: 95000000, color: "#10b981" },
        { name: "Central", value: 48550000, color: "#8b5cf6" },
        { name: "Other/CSR", value: 30000000, color: "#f59e0b" }
    ],
    gap_closure: [
        { year: 'Start', gap: 100, label: '100%' },
        { year: 'Q1-24', gap: 92, label: '92%' },
        { year: 'Q3-24', gap: 78, label: '78%' },
        { year: 'Q1-25', gap: 65, label: '65%' },
        { year: 'Q3-25', gap: 52, label: '52%' },
        { year: 'End', gap: 40, label: 'Target Met' }
    ],
    risks: [
        { name: "Trainer Shortage", prob: "High", impact: "High", mitigation: "Fast-track hiring" },
        { name: "Funding Delay", prob: "Med", impact: "High", mitigation: "Phased release" },
        { name: "Low Enrollment", prob: "Low", impact: "Med", mitigation: "Career campaigns" }
    ],
    timeline: [
        { name: "Primary Sector Launch", start: 1, duration: 3, pillar: "Primary Sector" },
        { name: "IT Skilling Center", start: 1, duration: 6, pillar: "Capacity Exp" },
        { name: "Construction Trades", start: 2, duration: 5, pillar: "GPDP & Govt" },
        { name: "Rural ITI Upgrade", start: 4, duration: 8, pillar: "Geo Equity" }
    ]
};

export default function ConsolidatedWorkPlan() {
    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Consolidated Annual Work Plan</h1>
                    <p className="text-gray-500 text-sm">Integrated Roadmap: 7 Strategic Pillars • ₹31.8 Cr Budget • 2024-25</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <CheckCircle className="w-4 h-4 mr-1" /> Active
                    </span>
                </div>
            </div>

            {/* Key KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Budget</p>
                    <h2 className="text-2xl font-bold text-blue-700 mt-1">₹31.85 Cr</h2>
                    <p className="text-xs text-gray-400 mt-1">Allocated across 7 Pillars</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Initiatives</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">28</h2>
                    <p className="text-xs text-green-600 mt-1">12 In Progress</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase">Target Gap Closure</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">60%</h2>
                    <p className="text-xs text-gray-400 mt-1">By March 2026</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 bg-red-50 border-red-100">
                    <p className="text-xs font-bold text-red-700 uppercase">Critical Risks</p>
                    <h2 className="text-2xl font-bold text-red-800 mt-1">3</h2>
                    <p className="text-xs text-red-600 mt-1">Need Immediate Attn</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pillar Budget & Status */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Strategic Pillars Overview</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.pillars} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="progress" name="Progress %" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#eee' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funding Sources */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Funding Mix</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.funding}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {data.funding.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val: number) => `₹${(val / 10000000).toFixed(2)} Cr`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gap Closure Projection */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Projected Gap Closure</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.gap_closure} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="gap" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Register */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Risk Register</h3>
                    <div className="space-y-3">
                        {data.risks.map((risk, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-red-900">{risk.name}</h4>
                                    <div className="flex gap-2 text-xs mt-1">
                                        <span className="bg-white px-1.5 py-0.5 rounded border border-red-200 text-red-700">Prob: {risk.prob}</span>
                                        <span className="bg-white px-1.5 py-0.5 rounded border border-red-200 text-red-700">Imp: {risk.impact}</span>
                                    </div>
                                    <p className="text-xs text-red-600 mt-1">Mitigation: {risk.mitigation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
