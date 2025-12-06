import { useState } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Trophy, TrendingDown, Globe, Activity, ChevronRight } from 'lucide-react';

// --- DATA ---
const ecosystemData = [
    {
        id: 'nitk',
        name: 'NITK Surathkal',
        category: 'Elite National',
        color: '#2563eb', // Blue 600
        median: 14.21,
        avg: 16.25,
        highest: 55.00,
        rate: 93,
        strength: 'National Benchmark / PSUs',
        narrative: "The Apex Fortress: NITK remains the benchmark, insulated from the worst of the downturn by strong PSU hiring (Chemical/Mech) and elite tech retention. However, even here, IT placement rates dipped from ~100% to 74%, signaling that the 'mass-premium' segment is freezing even for IIT/NIT graduates.",
        chartType: 'bar',
        chartLabel: 'Salary Distribution (LPA)',
        chartData: [
            { name: 'Median', value: 14.21 },
            { name: 'Average', value: 16.25 },
            { name: 'CSE Avg', value: 25.00 },
            { name: 'IT Avg', value: 24.56 }
        ]
    },
    {
        id: 'manipal',
        name: 'MIT Manipal (MAHE)',
        category: 'Private University',
        color: '#f97316', // Orange 500
        median: 10.05,
        avg: 12.31,
        highest: 69.25,
        rate: 80,
        strength: 'Scale & Alumni Network',
        narrative: "The V-Shaped Recovery: MIT saw a sharp correction in 2024 (dropping to 73%) but rebounded to 80% in 2025. It exhibits a classic 'Barbell' profile: The top 5% secure massive 50LPA+ offers (Microsoft/Amazon), while the median has finally corrected upwards to 10LPA, distancing itself from regional peers.",
        chartType: 'line',
        chartLabel: 'Placement Rate Trend (%)',
        chartData: [
            { name: '2023', value: 92.9 },
            { name: '2024', value: 73.0 },
            { name: '2025', value: 80.1 }
        ]
    },
    {
        id: 'sjec',
        name: 'St. Joseph (SJEC)',
        category: 'Tier-2 Stable',
        color: '#10b981', // Emerald 500
        median: 5.60,
        avg: 6.00,
        highest: 24.00,
        rate: 77,
        strength: 'Median Stability',
        narrative: "The Bell Curve Leader: SJEC prioritizes consistency. It boasts the highest median (5.6 LPA) among affiliated colleges, outperforming Sahyadri and MITE in this metric. It avoided the massive rate drops of peers (holding ~77%), suggesting a loyal recruiter base that values disciplined graduates over flash.",
        chartType: 'pie',
        chartLabel: 'Recruiter Mix Est.',
        chartData: [
            { name: 'High Value', value: 15 },
            { name: 'Mass/Core', value: 65 },
            { name: 'Service', value: 20 }
        ]
    },
    {
        id: 'sahyadri',
        name: 'Sahyadri (SCEM)',
        category: 'High Variance',
        color: '#f59e0b', // Amber 500
        median: 4.75,
        avg: 6.30,
        highest: 72.00,
        rate: 57,
        strength: 'Japanese Corridor',
        narrative: "The Record Breaker: Sahyadri has shattered regional records with a massive 72 LPA top offer. While its general placement rate (57%) shows a 'Barbell' distribution, the Japanese corridor (Belc, Aisan) combined with this new peak confirms it as the top destination for high-risk, high-reward outliers.",
        chartType: 'bar',
        chartLabel: 'Top Recruiter Packages (LPA)',
        chartData: [
            { name: 'Top Global', value: 72.00 },
            { name: 'Belc', value: 47.24 },
            { name: 'Microsoft', value: 40.00 },
            { name: 'IMV', value: 36.04 },
            { name: 'Aisan', value: 34.42 }
        ]
    },
    {
        id: 'nmamit',
        name: 'NMAMIT (Nitte)',
        category: 'Private University',
        color: '#8b5cf6', // Violet 500
        median: 5.50,
        avg: 7.50,
        highest: 52.00,
        rate: 70,
        strength: 'Core Engineering',
        narrative: "Bridging the Gap: NMAMIT sits between the regional colleges and Manipal. Its median has risen to 5.5 LPA (UG) and 8.5 LPA (PG). Like Sahyadri, it has a Japanese channel, but maintains a more balanced engineering profile. Note the drop in total offers (-27%) despite more companies visiting.",
        chartType: 'bar',
        chartLabel: 'Median Growth (LPA)',
        chartData: [
            { name: '21-22', value: 4.5 },
            { name: '22-23', value: 4.5 },
            { name: '23-24', value: 5.5 }
        ]
    },
    {
        id: 'mite',
        name: 'MITE Moodbidri',
        category: 'Tier-2 Stable',
        color: '#06b6d4', // Cyan 500
        median: 4.60,
        avg: 5.00,
        highest: 50.00,
        rate: 86,
        strength: 'Rate Retention',
        narrative: "The Retention Anomaly: MITE reported an 86% placement rate when others fell to 60%. This retention is its key strength, alongside breaking the 50LPA barrier in 2024. Strong ties with the 'Big 4' (EY, PWC) indicate a focus on Tech-Consulting roles.",
        chartType: 'bar',
        chartLabel: 'Placement Rate Comparison (%)',
        chartData: [
            { name: 'MITE', value: 86 },
            { name: 'Peer Avg', value: 65 }
        ]
    }
];

const PlacementReport = () => {
    const [selectedInstId, setSelectedInstId] = useState('nitk');
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

            {/* 1. Executive Summary */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-4 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Market Correction Overview (2024-25)</h2>
                    <p className="text-gray-600">The "Tech Winter" has bifurcated the region's outcomes. While elite talent secures global pay, mass recruitment has contracted, placing a premium on <strong>Median Stability</strong> over headline numbers.</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Regional Highest Offer</p>
                            <h3 className="text-2xl font-bold text-blue-600">72.00 LPA</h3>
                            <p className="text-xs text-gray-400 mt-1">Sahyadri (SCEM) 2025</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Trophy size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Top Tier-2 Median</p>
                            <h3 className="text-2xl font-bold text-emerald-600">5.60 LPA</h3>
                            <p className="text-xs text-gray-400 mt-1">SJEC (Stability Leader)</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Activity size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Placement Rate Volatility</p>
                            <h3 className="text-2xl font-bold text-red-500">-15% to -30%</h3>
                            <p className="text-xs text-gray-400 mt-1">Drop in Pvt. Colleges (2024)</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg text-red-500">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Japanese Packages</p>
                            <h3 className="text-2xl font-bold text-amber-500">30-47 LPA</h3>
                            <p className="text-xs text-gray-400 mt-1">Sahyadri & Nitte Corridor</p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                            <Globe size={20} />
                        </div>
                    </div>
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
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Elite</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Stable</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">High Variance</span>
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
                                        ? 'bg-gray-50 border-indigo-500 ring-1 ring-indigo-500'
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
                                    <Bar dataKey="Median" fill="#3b82f6" name="Median Salary" />
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
