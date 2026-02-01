
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadialBarChart, RadialBar
} from 'recharts';
import { Sprout, Sun, ArrowUp, AlertCircle, Leaf } from 'lucide-react';

const data = {
    total_farmers: 76780,
    yield_gap: [
        { crop: "Paddy", current: 38.5, potential: 65.0, gap: 26.5, gap_pct: 68 },
        { crop: "Arecanut", current: 12.8, potential: 22.0, gap: 9.2, gap_pct: 72 },
        { crop: "Coconut", current: 58.0, potential: 95.0, gap: 37.0, gap_pct: 64 },
        { crop: "Pepper", current: 3.2, potential: 6.5, gap: 3.3, gap_pct: 103 },
        { crop: "Cashew", current: 4.8, potential: 12.0, gap: 7.2, gap_pct: 150 }
    ],
    skill_needs: [
        { name: 'Disease Mgmt', value: 15800, fill: '#ef4444' }, // Red (Critical)
        { name: 'Root Wilt Mgmt', value: 9200, fill: '#f97316' }, // Orange
        { name: 'SRI Technique', value: 8500, fill: '#eab308' }, // Yellow
        { name: 'Soil Testing', value: 7800, fill: '#84cc16' }, // Lime
        { name: 'Drip Irrigation', value: 8900, fill: '#3b82f6' } // Blue
    ],
    economic_impact: {
        current_gdp: 572.8, // Cr
        potential_gdp: 842.0, // Cr
        roi: 9.45
    },
    interventions: [
        { crop: 'Arecanut', priority: 'High', skill: 'Yellow Leaf Mgmt', farmers: 15800, improvement: '30%' },
        { crop: 'Pepper', priority: 'High', skill: 'Quick Wilt Control', farmers: 5800, improvement: '35%' },
        { crop: 'Paddy', priority: 'Medium', skill: 'SRI Method', farmers: 8500, improvement: '25%' },
        { crop: 'Dairy', priority: 'Allied', skill: 'Breed Improvement', farmers: 5200, improvement: 'N/A' }
    ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded text-sm">
                <p className="font-bold mb-1">{label}</p>
                <p className="text-gray-600">Current: {payload[0].value} qtl/ha</p>
                <p className="text-blue-600 font-semibold">Potential: {payload[1].value} qtl/ha</p>
                <p className="text-red-500 mt-1">Gap: {payload[1].value - payload[0].value} qtl/ha</p>
            </div>
        );
    }
    return null;
};

export default function PrimarySectorSkilling() {
    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Primary Sector Skilling Strategy</h1>
                    <p className="text-gray-500 text-sm">Yield Gap Analysis & Training Interventions for {data.total_farmers.toLocaleString()} Farmers</p>
                </div>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium">
                            <Leaf className="w-5 h-5 text-green-600" /> Current Agri GDP
                        </div>
                        <div className="text-3xl font-bold text-gray-900">₹{data.economic_impact.current_gdp} Cr</div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10"><Sun size={80} /></div>
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-blue-600 font-medium">
                            <ArrowUp className="w-5 h-5" /> Potential GDP
                        </div>
                        <div className="text-3xl font-bold text-blue-700">₹{data.economic_impact.potential_gdp} Cr</div>
                        <p className="text-green-600 text-sm font-medium mt-1">+₹269.2 Cr Additional Income</p>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2 mt-4">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-purple-600 font-medium">
                            <Sprout className="w-5 h-5" /> Training ROI
                        </div>
                        <div className="text-3xl font-bold text-purple-700">{data.economic_impact.roi}x</div>
                        <p className="text-gray-400 text-sm mt-1">Payback Period: 1.2 Years</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yield Gap Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Yield Gap Analysis (Quintals/Ha)</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.yield_gap} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="crop" type="category" width={80} tick={{ fontWeight: 'bold' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="current" name="Current Yield" fill="#9ca3af" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="potential" name="Potential Yield" fill="#16a34a" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Demand Radial */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Training Needs (Farmers Count)</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={20} data={data.skill_needs}>
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="value"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Intervention Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Priority Skill Interventions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Crop / Sector</th>
                                <th className="px-6 py-3">Priority</th>
                                <th className="px-6 py-3">Key Skill Intervention</th>
                                <th className="px-6 py-3">Farmers Targeting</th>
                                <th className="px-6 py-3">Est. Yield Improve</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.interventions.map((item, idx) => (
                                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.crop}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.priority === 'High' ? 'bg-red-100 text-red-700' :
                                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{item.skill}</td>
                                    <td className="px-6 py-4">{item.farmers.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-green-600 font-bold">{item.improvement}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert / Insight */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex gap-3 text-orange-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                    <strong>Strategic Insight:</strong> Arecanut and Pepper show the highest ROI for training interventions due to significant "yield gaps" caused by preventable diseases (Yellow Leaf & Quick Wilt). Prioritizing these crops can unlock ₹100 Cr+ value in Year 1.
                </p>
            </div>
        </div>
    );
}
