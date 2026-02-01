import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis,
    Legend
} from 'recharts';
import { Target, Zap } from 'lucide-react';

const data = {
    matrix_data: [
        { name: "Industry Linkages", ease: 8.2, impact: 9.5, cost: 80, priority: "Quick Win" },
        { name: "Curriculum", ease: 7.5, impact: 8.8, cost: 120, priority: "Quick Win" },
        { name: "Human Resources", ease: 5.8, impact: 9.2, cost: 320, priority: "Strategic" },
        { name: "Placement", ease: 7.8, impact: 9.0, cost: 150, priority: "Strategic" },
        { name: "Infrastructure", ease: 6.2, impact: 8.5, cost: 450, priority: "Major Project" },
        { name: "Innovation", ease: 5.5, impact: 8.0, cost: 550, priority: "Major Project" },
        { name: "Governance", ease: 6.5, impact: 7.2, cost: 95, priority: "Low Priority" }
    ],
    roi_analysis: [
        { dimension: "Industry Linkages", cost_per_point: 32000, roi: 4.2 },
        { dimension: "Curriculum", cost_per_point: 54545, roi: 3.8 },
        { dimension: "Placement", cost_per_point: 60000, roi: 3.5 },
        { dimension: "HR", cost_per_point: 85000, roi: 2.9 }
    ]
};

const QUADRANT_COLORS = {
    "Quick Win": "#10b981", // Green
    "Strategic": "#3b82f6", // Blue
    "Major Project": "#8b5cf6", // Purple
    "Low Priority": "#9ca3af" // Gray
};

export default function PriorityAssignmentReport() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Priority Assignment Matrix</h1>
                    <p className="text-gray-500 text-sm">Intervention Strategy & ROI Analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Priority Matrix Scatter Plot */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Impact vs Ease of Implementation</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 10 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="ease" name="Ease (1-10)" domain={[4, 10]} label={{ value: 'Ease of Implementation', position: 'bottom', offset: 0 }} />
                                <YAxis type="number" dataKey="impact" name="Impact (1-10)" domain={[6, 10]} label={{ value: 'Impact on Outcomes', angle: -90, position: 'insideLeft' }} />
                                <ZAxis type="number" dataKey="cost" range={[100, 500]} name="Cost Scale" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                {Object.keys(QUADRANT_COLORS).map((priority) => (
                                    <Scatter
                                        key={priority}
                                        name={priority}
                                        data={data.matrix_data.filter(d => d.priority === priority)}
                                        fill={(QUADRANT_COLORS as any)[priority]}
                                    />
                                ))}

                                {/* Quadrant Lines (Approx) */}
                                <Scatter data={[{ ease: 7, impact: 8 }]} fill="none" line={{ stroke: '#e5e7eb', strokeWidth: 2 }} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ROI Sidebar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top ROI Interventions</h3>
                    <div className="space-y-4">
                        {data.roi_analysis.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-900">{item.dimension}</h4>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded flex items-center">
                                        <Zap className="w-3 h-3 mr-1" /> {item.roi}x ROI
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Cost per Point: <span className="font-medium text-gray-700">₹{item.cost_per_point.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommendation</h4>
                            <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                                <Target className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>
                                    Prioritize <strong>Industry Linkages</strong> and <strong>Curriculum Reform</strong> ("Quick Wins") for immediate impact in Q1-Q2 with lowest cost per outcome.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Implementation Roadmap Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(QUADRANT_COLORS).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: color }}>
                                {data.matrix_data.filter(d => d.priority === name).length}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{name}</div>
                                <div className="text-xs text-gray-500">Projects</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
