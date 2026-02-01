import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Download } from 'lucide-react';

// Mock Data from User Prompt
const data = {
    district: "Dakshina Kannada",
    assessment_date: "2023-24",
    dimensions: [
        {
            category: "Infrastructure Capacity",
            score: 72,
            max_score: 100,
            indicators: [
                { name: "ITI Buildings Quality", score: 78, weight: 0.3 },
                { name: "Workshop Equipment", score: 68, weight: 0.4 },
                { name: "Hostel Facilities", score: 70, weight: 0.3 }
            ]
        },
        {
            category: "Human Resources",
            score: 65,
            max_score: 100,
            indicators: [
                { name: "Trainer Availability", score: 60, weight: 0.4 },
                { name: "Trainer Qualification", score: 75, weight: 0.35 },
                { name: "Support Staff", score: 58, weight: 0.25 }
            ]
        },
        {
            category: "Curriculum & Pedagogy",
            score: 58,
            max_score: 100,
            indicators: [
                { name: "Industry Alignment", score: 62, weight: 0.4 },
                { name: "Practical Training %", score: 55, weight: 0.35 },
                { name: "Assessment Quality", score: 57, weight: 0.25 }
            ]
        },
        {
            category: "Industry Linkages",
            score: 48,
            max_score: 100,
            indicators: [
                { name: "MoUs with Industry", score: 45, weight: 0.3 },
                { name: "Guest Lectures", score: 52, weight: 0.3 },
                { name: "Internship Placement", score: 47, weight: 0.4 }
            ]
        },
        {
            category: "Placement Services",
            score: 62,
            max_score: 100,
            indicators: [
                { name: "Placement Cell Active", score: 68, weight: 0.4 },
                { name: "Job Fair Frequency", score: 55, weight: 0.3 },
                { name: "Alumni Network", score: 62, weight: 0.3 }
            ]
        },
        {
            category: "Governance & Management",
            score: 55,
            max_score: 100,
            indicators: [
                { name: "Committee Meetings", score: 60, weight: 0.3 },
                { name: "Financial Management", score: 58, weight: 0.4 },
                { name: "Data Systems", score: 48, weight: 0.3 }
            ]
        },
        {
            category: "Innovation & Technology",
            score: 42,
            max_score: 100,
            indicators: [
                { name: "Digital Learning", score: 38, weight: 0.4 },
                { name: "Modern Equipment", score: 45, weight: 0.35 },
                { name: "R&D Activities", score: 43, weight: 0.25 }
            ]
        },
        {
            category: "Social Inclusion",
            score: 68,
            max_score: 100,
            indicators: [
                { name: "SC/ST Enrollment", score: 72, weight: 0.35 },
                { name: "Women Enrollment", score: 65, weight: 0.35 },
                { name: "PWD Facilities", score: 67, weight: 0.3 }
            ]
        }
    ],
    overall_score: 58.8,
    maturity_level: "Developing",
    benchmark_scores: {
        state_average: 52.3,
        top_district: 74.2,
        bottom_district: 38.5
    },
    priority_matrix: [
        { name: "Industry Linkages", effort: 80, impact: 90 },
        { name: "Digital Learning", effort: 60, impact: 75 },
        { name: "Workshop Equipment", effort: 90, impact: 85 },
        { name: "Placement Cell", effort: 40, impact: 60 },
        { name: "Trainer Qual.", effort: 50, impact: 40 },
    ]
};

export default function DistrictSkillMatrix() {

    const getScoreColor = (score: number) => {
        if (score >= 70) return '#10b981'; // Green
        if (score >= 50) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    // Prepare data for Radar Chart
    const radarData = data.dimensions.map(d => ({
        subject: d.category,
        A: d.score,
        B: data.benchmark_scores.state_average, // Comparative
        fullMark: 100,
    }));

    // Prepare data for Gauge (Pie Chart simulation)
    const gaugeData = [
        { name: 'Score', value: data.overall_score, fill: getScoreColor(data.overall_score) },
        { name: 'Remaining', value: 100 - data.overall_score, fill: '#e5e7eb' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">District Skill Matrix Dashboard</h1>
                    <p className="text-gray-500 text-sm">TVET Capacity & Process Maturity Analysis for {data.district}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Gauge Chart for Maturity */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Overall Maturity Level</h3>
                    <div className="relative h-32 w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    startAngle={180}
                                    endAngle={0}
                                    data={gaugeData}
                                    cx="50%"
                                    cy="100%"
                                    innerRadius={60}
                                    outerRadius={80}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-0 text-center">
                            <span className="text-3xl font-bold text-gray-800">{data.overall_score}</span>
                            <p className={`text-sm font-bold`} style={{ color: getScoreColor(data.overall_score) }}>{data.maturity_level}</p>
                        </div>
                    </div>
                </div>

                {/* Benchmark Comparison */}
                <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-4">Benchmark Comparison (Score vs State Avg & Peers)</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={[
                                    { name: "Bottom District", score: data.benchmark_scores.bottom_district, fill: "#f87171" },
                                    { name: "State Average", score: data.benchmark_scores.state_average, fill: "#6b7280" },
                                    { name: "Dakshina Kannada", score: data.overall_score, fill: "#3b82f6" },
                                    { name: "Top District", score: data.benchmark_scores.top_district, fill: "#10b981" },
                                ]}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                barSize={20}
                            >
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} background={{ fill: '#f3f4f6' }}>
                                    {
                                        [
                                            { fill: "#f87171" },
                                            { fill: "#94a3b8" },
                                            { fill: "#3b82f6" },
                                            { fill: "#10b981" },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">8-Dimension Capacity Analysis</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="District Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                                <Radar name="State Average" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                                <Legend />
                                <RechartsTooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Horizontal Bar Chart (Dimensions) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Dimension Performance</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={data.dimensions}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                barSize={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="category" type="category" width={140} tick={{ fontSize: 11 }} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Score">
                                    {data.dimensions.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heat Map Matrix (Simulated with Grouped List) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Indicator Heat Map</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.dimensions.map((dim, idx) => (
                            <div key={idx} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-sm text-gray-700">{dim.category}</h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-opacity-10`} style={{ color: getScoreColor(dim.score), backgroundColor: `${getScoreColor(dim.score)}20` }}>
                                        {dim.score}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {dim.indicators.map((ind, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">{ind.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${ind.score}%`, backgroundColor: getScoreColor(ind.score) }}
                                                    />
                                                </div>
                                                <span className="w-6 text-right font-medium text-gray-700">{ind.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Improvement Priority Matrix (Bubble/Scatter) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Improvement Priority Matrix</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="effort" name="Effort" unit="%" label={{ value: 'Effort', position: 'insideBottomRight', offset: -10 }} />
                                <YAxis type="number" dataKey="impact" name="Impact" unit="%" label={{ value: 'Impact', angle: -90, position: 'insideLeft' }} />
                                <ZAxis range={[100, 300]} />
                                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Projects" data={data.priority_matrix} fill="#8884d8">
                                    {data.priority_matrix.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.impact > 80 && entry.effort < 60 ? '#10b981' : '#3b82f6'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-center text-gray-500 mt-2">High Impact, Low Effort = Quick Wins (Green)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
