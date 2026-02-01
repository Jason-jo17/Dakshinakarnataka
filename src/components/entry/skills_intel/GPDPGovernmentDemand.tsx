
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Building, MapPin, Briefcase, Users, Calendar } from 'lucide-react';

const data = {
    total_gpdp_demand: 6800,
    total_govt_schemes_demand: 2400,
    coverage_pct: 97.3,
    gpdp_phases: [
        { name: 'Construction Phase', value: 4850, color: '#1e3a8a' }, // Dark Blue
        { name: 'O&M Phase', value: 1950, color: '#3b82f6' }     // Light Blue
    ],
    asset_types: [
        { name: 'Roads & Drainage', construction: 1850, om: 420 },
        { name: 'Water Supply', construction: 1580, om: 680 },
        { name: 'Community Halls', construction: 1120, om: 280 },
        { name: 'Solar Lights', construction: 420, om: 350 },
        { name: 'Waste Mgmt', construction: 180, om: 120 }
    ],
    top_skills: [
        { name: 'Mason', value: 2925, category: 'Construction', color: '#f97316' },
        { name: 'Plumber', value: 2155, category: 'Both', color: '#3b82f6' },
        { name: 'Electrician', value: 1530, category: 'Both', color: '#eab308' },
        { name: 'Helper', value: 1205, category: 'Construction', color: '#94a3b8' },
        { name: 'Solar Tech', value: 605, category: 'O&M', color: '#22c55e' }
    ],
    temporal: [
        { quarter: 'Q1-24', construction: 850, om: 420 },
        { quarter: 'Q2-24', construction: 1850, om: 450 },
        { quarter: 'Q3-24', construction: 2580, om: 480 }, // Peak
        { quarter: 'Q4-24', construction: 1970, om: 510 },
        { quarter: 'Q1-25', construction: 450, om: 520 }
    ],
    schemes: [
        { name: 'PMAY Housing', target: '8,500 Units', demand: 1280, top_skill: 'Mason' },
        { name: 'Jal Jeevan', target: '42k Connects', demand: 420, top_skill: 'Plumber' },
        { name: 'PM Kusum', target: '1,250 Pumps', demand: 180, top_skill: 'Solar Tech' },
        { name: 'Smart City', target: '28 Projects', demand: 350, top_skill: 'IT Tech' }
    ],
    taluk_distribution: [
        { name: 'Mangalore', value: 2180 },
        { name: 'Bantwal', value: 1580 },
        { name: 'Puttur', value: 1420 },
        { name: 'Belthangady', value: 1050 },
        { name: 'Sullia', value: 570 }
    ]
};

export default function GPDPGovernmentDemand() {
    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">GPDP & Government Projects Demand</h1>
                    <p className="text-gray-500 text-sm">Aggregated Skill Requirements from 187 Gram Panchayats & Central Schemes</p>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-blue-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Total Demand</p>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">9,200</h2>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 font-medium">+15% vs Last Year</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-green-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">GPDP Coverage</p>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">97.3%</h2>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><MapPin size={20} /></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">182/187 GPs Active</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-orange-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Construction Phase</p>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">71%</h2>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Building size={20} /></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Short-term Demand</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-purple-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Govt Schemes</p>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">2,400</h2>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Briefcase size={20} /></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Driven by PMAY/JJM</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Construction vs O&M Split */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Demand Components</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.gpdp_phases}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {data.gpdp_phases.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val: number) => val.toLocaleString()} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-[-10px]">
                        <p>Total GPDP Demand: <strong>{data.total_gpdp_demand.toLocaleString()}</strong></p>
                    </div>
                </div>

                {/* Asset Type Breakdown */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Demand by Asset Type (Construction vs O&M)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.asset_types} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="construction" name="Construction" stackId="a" fill="#1e3a8a" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="om" name="O&M" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temporal Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Projected Demand Timeline</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.temporal} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="construction" stackId="1" stroke="#1e3a8a" fill="#1e3a8a" name="Construction" />
                                <Area type="monotone" dataKey="om" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="O&M" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        <Calendar className="w-4 h-4" />
                        <strong>Peak Demand Warning:</strong> Q3-2024 requires 3,060 workers (Post-Monsoon).
                    </div>
                </div>

                {/* Top Skills */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Critical Skills Required</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.top_skills} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                    {data.top_skills.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Scheme Cards */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Major Government Schemes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.schemes.map((scheme, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900">{scheme.name}</h4>
                                <div className="p-1.5 bg-gray-100 rounded text-gray-600"><Briefcase size={16} /></div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Target</span>
                                    <span className="font-semibold text-gray-900">{scheme.target}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Skilled Demand</span>
                                    <span className="font-semibold text-blue-600">{scheme.demand}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-100 mt-2">
                                    <span className="text-xs text-gray-400">Top Skill Requirement</span>
                                    <p className="font-medium text-gray-800">{scheme.top_skill}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
