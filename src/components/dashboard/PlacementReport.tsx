import { useState } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Trophy, TrendingDown, TrendingUp, Globe, Activity, ChevronRight, Users, DollarSign, Building, Briefcase } from 'lucide-react';
import { dashboardData } from '../../data/dashboardData';

// --- RICH DATA OVERRIDES (Narratives & Colors) ---
const richDataOverrides: Record<string, any> = {
    "NITK Surathkal": {
        color: '#60A5FACC',
        narrative: "The Apex Fortress: NITK demonstrated resilience with a 93% placement rate, reinforced by PSU hiring and elite tech retention. Average packages consolidated at ₹16.25 LPA."
    },
    "Srinivas Institute of Technology": {
        color: '#A78BFA',
        narrative: "Mass Consistency: Srinivas Institute boasts a remarkable placement rate, focusing on high employability for mass-recruiting roles with consistent packages."
    },
    "St Joseph Engineering College": {
        color: '#86EFACCC',
        narrative: "Disciplined Output: SJEC continues to deliver consistent results with stable placement rates and average packages around ₹5.6 LPA."
    },
    "Sahyadri College of Engineering": {
        color: '#FCA5A5CC',
        narrative: "The Outlier Factory: Sahyadri continues to produce high-value outliers with a ₹72.00 LPA top package (Rolls Royce). Focus remains on high-quality, specialized placements."
    },
    "Yenepoya Institute of Technology": {
        color: '#FDBA74CC',
        narrative: "Emerging Contender: Yenepoya is rapidly gaining traction with improved placement metrics and growing recruiter interest."
    },
    "Canara Engineering College": {
        color: '#2DD4BF',
        narrative: "Value Engineering: Canara Engineering delivers solid value with consistent average packages and competitive top offers."
    },
    "Alva's Institute of Engineering": {
        color: '#F472B6',
        narrative: "Rural Champion: Alva's achieves strong placement rates, proving that rural-located institutes can effectively compete with city-based peers."
    }
};

// --- MERGED DATA ---
const ecosystemData = dashboardData.institutions.map(inst => {
    const override = richDataOverrides[inst.name] || {};
    // Use override color or generate one based on ID
    const color = override.color || `hsl(${inst.id * 40}, 70%, 60%)`;

    return {
        id: inst.id.toString(),
        name: inst.name,
        category: inst.type,
        color: color,
        median: inst.median_package,
        avg: inst.average_package,
        highest: inst.highest_package,
        rate: inst.placement_rate,
        strength: override.narrative ? "Established" : "Growing",
        narrative: override.narrative || `${inst.name} reports a placement rate of ${inst.placement_rate}% with an average package of ₹${inst.average_package} LPA. Top recruiters include ${inst.top_recruiters.slice(0, 2).join(', ')}.`,
        chartType: 'bar',
        chartLabel: 'Salary Distribution (LPA)',
        chartData: [
            { name: 'Median', value: inst.median_package },
            { name: 'Average', value: inst.average_package },
            { name: 'Highest', value: inst.highest_package }
        ]
    };
});

const PlacementReport = () => {
    const [selectedInstId, setSelectedInstId] = useState(ecosystemData[0]?.id || '1');
    const selectedInst = ecosystemData.find(i => i.id === selectedInstId) || ecosystemData[0];

    // Data for Risk/Reward Scatter
    const scatterData = ecosystemData.map(inst => ({
        x: inst.median,
        y: inst.rate,
        z: Math.sqrt(inst.highest) * 50, // Bubble size
        name: inst.name,
        fill: inst.color
    }));

    // Data for Gap Chart
    const gapData = [...ecosystemData].sort((a, b) => b.highest - a.highest).map(inst => ({
        name: inst.name.split(' ')[0], // Short name
        Highest: inst.highest,
        Median: inst.median,
        color: inst.color
    }));

    return (
        <div className="space-y-8 animate-fade-in">

            {/* 1. Statistics Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Card 1: Placement Rate */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Placement Rate</p>
                        <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">62%</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-green-600">
                        <TrendingUp size={12} />
                        <span>4%</span>
                    </div>
                </div>

                {/* Card 2: Students Placed */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Students Placed</p>
                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                            <Users size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">3,400</h3>
                </div>

                {/* Card 3: Avg Package */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Package</p>
                        <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                            <DollarSign size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹4.2 LPA</h3>
                </div>

                {/* Card 4: Highest Package */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Highest Package</p>
                        <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
                            <Trophy size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹72 LPA</h3>
                    <p className="text-xs text-gray-400 mt-1">Sahyadri (Rolls Royce)</p>
                </div>

                {/* Card 5: Top Recruiter */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Recruiter</p>
                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <Building size={16} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Infosys BPM</h3>
                    <p className="text-xs text-gray-400 mt-1">450 hires</p>
                </div>

                {/* Card 6: Top Sector */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Sector</p>
                        <div className="p-1.5 bg-cyan-50 rounded-lg text-cyan-600">
                            <Briefcase size={16} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">IT/ITES</h3>
                    <p className="text-xs text-gray-400 mt-1">85% placements</p>
                </div>
            </section>

            {/* 2. Strategic Matrix */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">The "Risk vs. Reward" Matrix</h3>
                        <p className="text-sm text-gray-500">Analyzing institutions by <strong>Placement Reliability</strong> (Y-Axis) vs <strong>Median Outcomes</strong> (X-Axis). Bubble size represents the <strong>Highest Package</strong>.</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Elite</span>
                        <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">Stable</span>
                        <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-semibold rounded-full">High Variance</span>
                    </div>
                </div>
                <div className="p-6 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="x" name="Median Salary" unit=" LPA" domain={[3, 16]} label={{ value: 'Median Salary (LPA)', position: 'bottom', offset: 0 }} />
                            <YAxis type="number" dataKey="y" name="Placement Rate" unit="%" domain={[40, 100]} label={{ value: 'Placement Rate (%)', angle: -90, position: 'insideLeft' }} />
                            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Highest Package Score" />
                            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
                                            <p className="font-bold text-gray-800">{data.name}</p>
                                            <p className="text-sm text-gray-600">Rate: {data.y}%</p>
                                            <p className="text-sm text-gray-600">Median: {data.x} LPA</p>
                                        </div>
                                    );
                                }
                                return null;
                            }} />
                            <Scatter name="Institutions" data={scatterData} fill="#8884d8">
                                {scatterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* 3. Detailed Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4 px-2">Select Institution Profile</h3>
                        <div className="space-y-2">
                            {ecosystemData.map(inst => (
                                <button
                                    key={inst.id}
                                    onClick={() => setSelectedInstId(inst.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${selectedInstId === inst.id
                                        ? 'bg-gray-50 border-primary ring-1 ring-primary'
                                        : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: inst.color }}></div>
                                        <span className={`font-medium ${selectedInstId === inst.id ? 'text-gray-900' : 'text-gray-700'}`}>{inst.name}</span>
                                    </div>
                                    <ChevronRight size={16} className={`text-gray-300 ${selectedInstId === inst.id ? 'text-indigo-500' : 'group-hover:text-gray-500'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Detail View */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-xl shadow-md border-t-4 p-6 animate-fade-in transition-all" style={{ borderColor: selectedInst.color }}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded" style={{ color: selectedInst.color, backgroundColor: `${selectedInst.color}15` }}>
                                    {selectedInst.category}
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2">{selectedInst.name}</h2>
                                <p className="text-gray-500 text-lg">Detailed placement dynamics analysis.</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-400">Primary Strength</p>
                                <p className="font-semibold text-gray-800">{selectedInst.strength}</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6 border-y border-gray-100 py-6">
                            <div className="text-center border-r border-gray-100">
                                <p className="text-xs text-gray-400 uppercase">Median Salary</p>
                                <p className="text-xl font-bold text-gray-800">₹{selectedInst.median} L</p>
                            </div>
                            <div className="text-center border-r border-gray-100">
                                <p className="text-xs text-gray-400 uppercase">Placement Rate</p>
                                <p className="text-xl font-bold text-gray-800">{selectedInst.rate}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400 uppercase">Highest Package</p>
                                <p className="text-xl font-bold text-gray-800">₹{selectedInst.highest} L</p>
                            </div>
                        </div>

                        {/* Narrative */}
                        <div className="mb-8">
                            <h4 className="font-bold text-gray-800 mb-2">Strategic Insight</h4>
                            <p className="text-gray-600 leading-relaxed">{selectedInst.narrative}</p>
                        </div>

                        {/* Chart for this section */}
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {selectedInst.chartType === 'bar' ? (
                                    <BarChart data={selectedInst.chartData} layout={selectedInst.id === 'sahyadri' ? 'vertical' : 'horizontal'}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        {selectedInst.id === 'sahyadri' ? <XAxis type="number" /> : <XAxis dataKey="name" />}
                                        {selectedInst.id === 'sahyadri' ? <YAxis dataKey="name" type="category" width={100} /> : <YAxis />}
                                        <RechartsTooltip />
                                        <Bar dataKey="value" fill={selectedInst.color} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                ) : selectedInst.chartType === 'line' ? (
                                    <LineChart data={selectedInst.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <RechartsTooltip />
                                        <Line type="monotone" dataKey="value" stroke={selectedInst.color} strokeWidth={3} />
                                    </LineChart>
                                ) : (
                                    <PieChart>
                                        <Pie data={selectedInst.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={selectedInst.color} label>
                                            {selectedInst.chartData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#0f172a' : index === 1 ? '#3b82f6' : '#94a3b8'} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Comparative Chart: The Inequality Gap */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800">The "Marketing vs. Reality" Gap</h3>
                            <p className="text-sm text-gray-500">Comparing the <strong>Highest Package</strong> (often 1 student) vs the <strong>Median Salary</strong> (the typical student). Note the massive multiples in "Barbell" colleges like Sahyadri and Manipal.</p>
                        </div>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gapData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Salary (LPA)', angle: -90, position: 'insideLeft' }} />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Bar dataKey="Highest" fill="#94a3b8" name="Highest Package" />
                                    <Bar dataKey="Median" fill="#0D47A1" name="Median Salary" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementReport;
