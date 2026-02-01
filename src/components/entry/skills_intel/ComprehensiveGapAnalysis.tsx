
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell
} from 'recharts';
import { AlertTriangle, Shield, Zap, AlertOctagon } from 'lucide-react';

const data = {
    ten_gap_areas: [
        { id: 1, area: "Quantity Gap", gap_pct: 62.7, severity: "Critical", description: "Enrollment Capacity" },
        { id: 2, area: "Quality Gap", gap_pct: 27.1, severity: "High", description: "Training Standards" },
        { id: 3, area: "Sectoral Gap", gap_pct: 52, severity: "Critical", description: "Demand Alignment" },
        { id: 4, area: "Geographic Gap", gap_pct: 28, severity: "Medium", description: "Spatial Distribution" },
        { id: 5, area: "Gender Gap", gap_pct: 53.8, severity: "High", description: "Female Participation" },
        { id: 6, area: "Skill Level Gap", gap_pct: 97.3, severity: "Critical", description: "Advanced Skills" },
        { id: 7, area: "Trainer Gap", gap_pct: 45.3, severity: "Critical", description: "Human Resources" },
        { id: 8, area: "Infrastructure Gap", gap_pct: 31.8, severity: "High", description: "Physical Facilities" },
        { id: 9, area: "Partnership Gap", gap_pct: 75.0, severity: "High", description: "Industry Linkages" },
        { id: 10, area: "Placement Gap", gap_pct: 21.9, severity: "Medium", description: "Employment Outcomes" }
    ],
    swot: {
        strengths: [
            { factor: "High Literacy (88.6%)", score: 9.2 },
            { factor: "Industrial Hub (MSEZ)", score: 8.5 },
            { factor: "Edu Infrastructure", score: 8.0 },
            { factor: "Placement Rate (62.5%)", score: 7.8 }
        ],
        weaknesses: [
            { factor: "Advanced Skills Gap", score: 9.1 },
            { factor: "IT Skills Shortage", score: 8.9 },
            { factor: "Healthcare Gap", score: 8.5 },
            { factor: "Trainer Shortage", score: 8.2 }
        ],
        opportunities: [
            { factor: "IT/ITES Growth", score: 9.0 },
            { factor: "Healthcare Expansion", score: 8.5 },
            { factor: "Govt Schemes", score: 7.5 },
            { factor: "Smart City", score: 7.0 }
        ],
        threats: [
            { factor: "Migration to Blr", score: 7.5 },
            { factor: "Automation", score: 7.2 },
            { factor: "Economic Slowdown", score: 6.8 },
            { factor: "Funding Cuts", score: 6.5 }
        ]
    }
};

const SEVERITY_COLORS = {
    "Critical": "#f87171",
    "High": "#f97316",
    "Medium": "#eab308",
    "Low": "#22c55e"
};

export default function ComprehensiveGapAnalysis() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Comprehensive Gap Analysis</h1>
                    <p className="text-gray-500 text-sm">10 Critical Areas & Strategic SWOT Assessment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">10 Critical Gap Areas Severity</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={[...data.ten_gap_areas].sort((a, b) => b.gap_pct - a.gap_pct)}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="area" type="category" width={110} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ payload, label }) => {
                                        if (payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-2 border border-gray-200 shadow-lg rounded text-xs">
                                                    <p className="font-bold">{label}</p>
                                                    <p>{data.description}</p>
                                                    <p className="font-semibold" style={{ color: (SEVERITY_COLORS as any)[data.severity] }}>
                                                        {data.gap_pct}% Gap - {data.severity}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="gap_pct" name="Gap %" radius={[0, 4, 4, 0]}>
                                    {[...data.ten_gap_areas].sort((a, b) => b.gap_pct - a.gap_pct).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={(SEVERITY_COLORS as any)[entry.severity]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Strategic SWOT Analysis</h3>
                    <div className="grid grid-cols-2 gap-4 h-[400px]">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 overflow-y-auto">
                            <h4 className="flex items-center gap-2 font-bold text-green-800 mb-3 text-sm uppercase tracking-wider">
                                <Shield className="w-4 h-4" /> Strengths
                            </h4>
                            <ul className="space-y-2">
                                {data.swot.strengths.map((item, i) => (
                                    <li key={i} className="flex justify-between text-xs bg-white p-2 rounded shadow-sm">
                                        <span>{item.factor}</span>
                                        <span className="font-bold text-green-600">{item.score}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 overflow-y-auto">
                            <h4 className="flex items-center gap-2 font-bold text-red-800 mb-3 text-sm uppercase tracking-wider">
                                <AlertOctagon className="w-4 h-4" /> Weaknesses
                            </h4>
                            <ul className="space-y-2">
                                {data.swot.weaknesses.map((item, i) => (
                                    <li key={i} className="flex justify-between text-xs bg-white p-2 rounded shadow-sm">
                                        <span>{item.factor}</span>
                                        <span className="font-bold text-red-600">{item.score}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 overflow-y-auto">
                            <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-3 text-sm uppercase tracking-wider">
                                <Zap className="w-4 h-4" /> Opportunities
                            </h4>
                            <ul className="space-y-2">
                                {data.swot.opportunities.map((item, i) => (
                                    <li key={i} className="flex justify-between text-xs bg-white p-2 rounded shadow-sm">
                                        <span>{item.factor}</span>
                                        <span className="font-bold text-blue-600">{item.score}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 overflow-y-auto">
                            <h4 className="flex items-center gap-2 font-bold text-orange-800 mb-3 text-sm uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4" /> Threats
                            </h4>
                            <ul className="space-y-2">
                                {data.swot.threats.map((item, i) => (
                                    <li key={i} className="flex justify-between text-xs bg-white p-2 rounded shadow-sm">
                                        <span>{item.factor}</span>
                                        <span className="font-bold text-orange-600">{item.score}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Gap Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.ten_gap_areas.map((gap) => (
                        <div key={gap.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 text-sm">{gap.id}. {gap.area}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white`} style={{ backgroundColor: (SEVERITY_COLORS as any)[gap.severity] }}>
                                    {gap.severity}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{gap.description}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                <div className="h-1.5 rounded-full" style={{ width: `${gap.gap_pct}%`, backgroundColor: (SEVERITY_COLORS as any)[gap.severity] }}></div>
                            </div>
                            <div className="text-right text-xs font-bold text-gray-700">{gap.gap_pct}% Gap</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
