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
        color: '#60A5FACC', // Mellow Blue-400
        median: 14.21,
        avg: 16.25,
        highest: 55.00,
        rate: 93,
        strength: 'National Benchmark',
        narrative: "The Apex Fortress: NITK demonstrated resilience with a 93% placement rate (up from 75% in previous dip), reinforced by PSU hiring and elite tech retention. Average packages consolidated at ₹16.25 LPA, reflecting market realism.",
        chartType: 'bar',
        chartLabel: 'Salary Distribution (LPA)',
        chartData: [
            { name: 'Median', value: 14.21 },
            { name: 'Average', value: 16.25 },
            { name: 'Highest', value: 55.00 }
        ]
    },
    {
        id: 'manipal',
        name: 'MIT Manipal',
        category: 'Private University',
        color: '#FDBA74CC', // Mellow Orange-300
        median: 10.05,
        avg: 12.31,
        highest: 69.25,
        rate: 80.1,
        strength: 'Scale & Network',
        narrative: "Strong Recovery: MIT improved its placement rate to 80.1%, with a massive ₹69.25 LPA top offer. The institution maintains a 'Barbell' profile, balancing elite tech offers with mass recruitment volume.",
        chartType: 'line',
        chartLabel: 'Placement Rate Trend (%)',
        chartData: [
            { name: '2023', value: 92.9 },
            { name: '2024', value: 73.0 },
            { name: '2025', value: 80.1 }
        ]
    },
    {
        id: 'nmamit',
        name: 'NMAMIT (Nitte)',
        category: 'Private University',
        color: '#818CF8CC', // Mellow Indigo-400
        median: 8.5, // Estimated from Avg 10
        avg: 10.00,
        highest: 52.00,
        rate: 88, // Midpoint of 75-100%
        strength: 'Core & Tech Mix',
        narrative: "Quality Leap: NMAMIT has seen average packages rise to ₹10 LPA, bridging the gap with top-tier peers. With offers up to ₹52 LPA and a strong placement rate range (75-100%), it cements its status as a premier regional choice.",
        chartType: 'bar',
        chartLabel: 'Salary Growth (LPA)',
        chartData: [
            { name: 'Prior Avg', value: 7.5 },
            { name: 'Curr Avg', value: 10.0 },
            { name: 'Highest', value: 52.0 }
        ]
    },
    {
        id: 'sjec',
        name: 'St. Joseph (SJEC)',
        category: 'Tier-2 Stable',
        color: '#86EFACCC', // Mellow Green-300
        median: 5.60,
        avg: 5.60,
        highest: 24.50,
        rate: 71,
        strength: 'Consistency',
        narrative: "Disciplined Output: SJEC continues to deliver consistent results with a 71% placement rate and average packages around ₹5.6 LPA. Top offers reached ₹24.50 LPA, showcasing access to high-value roles.",
        chartType: 'pie',
        chartLabel: 'Recruiter Mix Est.',
        chartData: [
            { name: 'Product/Core', value: 25 },
            { name: 'Services', value: 60 },
            { name: 'Other', value: 15 }
        ]
    },
    {
        id: 'sahyadri',
        name: 'Sahyadri (SCEM)',
        category: 'High Variance',
        color: '#FCA5A5CC', // Mellow Red-300
        median: 4.75,
        avg: 6.30,
        highest: 47.24,
        rate: 53,
        strength: 'Innovation Hub',
        narrative: "The Outlier Factory: Sahyadri continues to produce high-value outliers with a ₹47.24 LPA top package and an average of ₹6.30 LPA. While the overall rate is 53%, the focus remains on high-quality, specialized placements.",
        chartType: 'bar',
        chartLabel: 'Top Packages (LPA)',
        chartData: [
            { name: 'Top Offer', value: 47.24 },
            { name: 'Microsoft', value: 40.00 },
            { name: 'Avg Top 10', value: 28.00 }
        ]
    },
    {
        id: 'srinivas',
        name: 'Srinivas Institute',
        category: 'Volume Leader',
        color: '#A78BFA', // Purple 400
        median: 4.0,
        avg: 4.48,
        highest: 5.0,
        rate: 86.9,
        strength: 'High Placement Rate',
        narrative: "Mass Consistency: Srinivas Institute boasts a remarkable 86.9% placement rate, focusing on high employability for mass-recruiting roles with consistent packages averaging ₹4.48 LPA.",
        chartType: 'bar',
        chartLabel: 'Placement Stats',
        chartData: [
            { name: 'Avg', value: 4.48 },
            { name: 'Highest', value: 5.0 }
        ]
    },
    {
        id: 'canara',
        name: 'Canara Engineering',
        category: 'Tier-2 Stable',
        color: '#2DD4BF', // Teal 400
        median: 5.0,
        avg: 5.95,
        highest: 23.68,
        rate: 58,
        strength: 'Core Focus',
        narrative: "Value Engineering: Canara Engineering delivers solid value with a ₹5.95 LPA average and offers peaking at ₹23.68 LPA, maintaining a 58% placement rate in a challenging market.",
        chartType: 'bar',
        chartLabel: 'Salary Stats',
        chartData: [
            { name: 'Avg', value: 5.95 },
            { name: 'Highest', value: 23.68 }
        ]
    },
    {
        id: 'alvas',
        name: 'Alva\'s Institute',
        category: 'Rural Champion',
        color: '#F472B6', // Pink 400
        median: 4.5,
        avg: 5.0,
        highest: 21.0,
        rate: 80,
        strength: 'Rural Outreach',
        narrative: "Talent Hub: Alva's Institute achieves a strong 80% placement rate with top offers reaching ₹21 LPA, proving that rural-located institutes can compete with city-based peers.",
        chartType: 'bar',
        chartLabel: 'Performance',
        chartData: [
            { name: 'Avg', value: 5.0 },
            { name: 'Highest', value: 21.0 }
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
                <div className="col-span-1 md:col-span-4 mb-2 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Market Correction Overview (2024-25)</h2>
                        <p className="text-gray-600">The "Tech Winter" has bifurcated the region's outcomes. While elite talent secures global pay, mass recruitment has contracted, placing a premium on <strong>Median Stability</strong> over headline numbers.</p>
                    </div>
                    <button
                        onClick={() => {
                            try {
                                const reportMeta = {
                                    title: 'Placement Market Correction 2024-25',
                                    type: 'Analytics',
                                    size: '1.2 MB',
                                    date: new Date().toLocaleDateString(),
                                    action: null
                                };
                                const existingStr = localStorage.getItem('generated_reports');
                                let existing = [];
                                if (existingStr) {
                                    existing = JSON.parse(existingStr);
                                }
                                localStorage.setItem('generated_reports', JSON.stringify([reportMeta, ...existing]));
                                alert('Placement Analysis Report saved to Reports!');
                            } catch (e) {
                                alert("Could not save report.");
                            }
                        }}
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        Save Analysis Report
                    </button>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Regional Highest Offer</p>
                            <h3 className="text-2xl font-bold text-primary">72.00 LPA</h3>
                            <p className="text-xs text-gray-400 mt-1">Sahyadri (SCEM) 2025</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Trophy size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Top Tier-2 Median</p>
                            <h3 className="text-2xl font-bold text-success">5.60 LPA</h3>
                            <p className="text-xs text-gray-400 mt-1">SJEC (Stability Leader)</p>
                        </div>
                        <div className="p-2 bg-success/10 rounded-lg text-success">
                            <Activity size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Placement Rate Volatility</p>
                            <h3 className="text-2xl font-bold text-danger">-15% to -30%</h3>
                            <p className="text-xs text-gray-400 mt-1">Drop in Pvt. Colleges (2024)</p>
                        </div>
                        <div className="p-2 bg-danger/10 rounded-lg text-danger">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Japanese Packages</p>
                            <h3 className="text-2xl font-bold text-warning">30-47 LPA</h3>
                            <p className="text-xs text-gray-400 mt-1">Sahyadri & Nitte Corridor</p>
                        </div>
                        <div className="p-2 bg-warning/10 rounded-lg text-warning">
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
