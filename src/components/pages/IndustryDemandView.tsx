import React from 'react';
import { Briefcase, Building2, TrendingUp, Download, Layers, Zap, Users } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const IndustryDemandView: React.FC = () => {
    const [actionModal, setActionModal] = React.useState<'gap' | 'training' | null>(null);
    const industryDemands = useDataStore(state => state.industryDemands);

    // Analytics derived from stored demands (simulating the JOBS array with new dynamic data mixed in or replacing it)
    // Ideally we merge JOBS.length + industryDemands.reduce...
    // For now, let's just use the `industryDemands` from the store as the primary source for the "Demand" metrics.
    // The previous implementation used `JOBS` (individual listings) and hardcoded `sectors`. 
    // We will augment the stats with our dynamic data.

    const totalJobs = industryDemands.reduce((acc, curr) => acc + curr.demand_count, 0); // Using new dynamic count
    const uniqueCompanies = new Set(industryDemands.map(j => j.company_name)).size;
    const totalVacancies = totalJobs; // Syncing these for now


    // Sector Analysis derived from dynamic data
    const sectorCounts: Record<string, number> = {};
    industryDemands.forEach(d => {
        sectorCounts[d.sector] = (sectorCounts[d.sector] || 0) + d.demand_count;
    });

    const sectorData = Object.entries(sectorCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const topSector = sectorData.length > 0 ? sectorData[0].name : 'N/A';

    // Top Job Roles (Heatmap data)
    const topRoles = [
        { name: 'Site Engineer', count: 200 },
        { name: 'Site Supervisor', count: 180 },
        { name: 'Full Stack Developer', count: 160 },
        { name: 'Software Developer', count: 155 },
        { name: 'Embedded Engineer', count: 140 },
        { name: 'Nursing Staff', count: 120 },
        { name: 'UX Designer', count: 110 },
        { name: 'Financial Analyst', count: 100 },
        { name: 'Mechanical Engineer', count: 95 },
        { name: 'Supply Chain Analyst', count: 80 }
    ];

    // Hiring Projections Data
    const timelineData = [
        { name: '12 Months', value: 45, color: '#3b82f6' },
        { name: '6 Months', value: 35, color: '#10b981' },
        { name: '18 Months', value: 20, color: '#f59e0b' },
    ];

    const companyTypeData = [
        { name: 'GCC', value: 40, color: '#f59e0b' },
        { name: 'SME', value: 30, color: '#f97316' },
        { name: 'Large Enterprise', value: 20, color: '#8b5cf6' },
        { name: 'Startup', value: 10, color: '#3b82f6' },
    ];

    // Skill Requirements (Tag Cloud)
    const skillTags = [
        { name: 'React', count: 2 }, { name: 'Excel', count: 2 }, { name: 'SQL', count: 2 }, { name: 'Node.js', count: 1 },
        { name: 'MongoDB', count: 1 }, { name: 'Financial Modelling', count: 1 }, { name: 'C', count: 1 },
        { name: 'C++', count: 1 }, { name: 'Embedded Systems', count: 1 }, { name: 'RTOS', count: 1 },
        { name: 'CNC Machining', count: 1 }, { name: 'Blueprint Reading', count: 1 },
        { name: 'Civil Engineering', count: 1 }, { name: 'AutoCAD', count: 1 },
        { name: 'Site Safety', count: 1 }, { name: 'Patient Care', count: 1 },
        { name: 'Basic Life Support', count: 1 }, { name: 'Solar Panel Installation', count: 1 },
        { name: 'Electrical Safety', count: 1 }, { name: 'Figma', count: 1 }, { name: 'Adobe XD', count: 1 },
        { name: 'User Research', count: 1 }, { name: 'SAP', count: 1 }, { name: 'Data Analysis', count: 1 }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Industry Hiring Demand</h1>
                    <p className="text-slate-500 dark:text-slate-400">Overview of market needs, job roles, and hiring trends.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50">
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Companies Mapped</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{uniqueCompanies}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded">
                            <Building2 size={20} />
                        </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium whitespace-nowrap">↑ GCCs + SMEs vs last month</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Job Roles Collected</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{totalJobs}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded">
                            <Briefcase size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Hiring Demand</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{totalVacancies}</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                            <Users size={20} />
                        </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">↑ Next 12 Months vs last month</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Top Sector</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{topSector}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded">
                            <Layers size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section 1: Sector Demand & Top Roles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sector-Wise Hiring Demand */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sector-Wise Hiring Demand</h3>
                        <p className="text-sm text-slate-500">Demand distribution across key industries</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectorData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Job Roles (Heatmap style) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Job Roles (Heatmap)</h3>
                        <p className="text-sm text-slate-500">Roles with highest volume of openings</p>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topRoles} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                    {topRoles.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={'#8b5cf6'} fillOpacity={1 - (index * 0.08)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Section 2: Projections & Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hiring Projections */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hiring Projections & Sources</h3>
                        <p className="text-sm text-slate-500">Timeline and Source Breakdown</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 h-64">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-semibold mb-2">By Timeline</div>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie data={timelineData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                        {timelineData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" align="center" iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-semibold mb-2">By Company Type</div>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie data={companyTypeData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                        {companyTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" align="center" iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Skill Requirements Tag Cloud */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Requirements (Tag Cloud)</h3>
                        <p className="text-sm text-slate-500">Most frequently requested skills across all roles</p>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-64 pr-2">
                        {skillTags.map((skill, idx) => (
                            <div key={idx} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800 flex items-center gap-1">
                                {skill.name}
                                <span className="opacity-60 text-[10px]">({skill.count})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recommended Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Action 1 */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-blue-600">
                                <Download size={20} />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Request Hiring Data</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Get fresh data from GCCs and Industry. Send automated requests to mapped industry partners to update their hiring projections for the next quarter.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                alert("Requests sent to 12 Industry Partners successfully!");
                            }}
                            className="w-full py-2 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Send Request
                        </button>
                    </div>

                    {/* Action 2 */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500 border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-orange-600">
                                <Zap size={20} />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Identify Skill Gaps</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Compare Demand vs Supply. Analyze the gap between industry requirements and current student skill levels in institutions.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                // Scroll to top or open detailed view (Simulated here with alert + log for now or navigation if I had the prop)
                                // Ideally this opens a Gap Analysis Modal. Let's create a simple inline expansion or redirect if possible.
                                // For this task I'll add a state to show a specific modal.
                                setActionModal('gap');
                            }}
                            className="w-full py-2 border border-orange-200 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                        >
                            View Gap Analysis
                        </button>
                    </div>

                    {/* Action 3 */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-l-4 border-l-emerald-500 border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-emerald-600">
                                <TrendingUp size={20} />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recommend Skilling</h3>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Launch Targeted Programs. Initiate new training programs in GCCs matching the top in-demand job roles and skills.
                            </p>
                        </div>
                        <button
                            onClick={() => setActionModal('training')}
                            className="w-full py-2 border border-emerald-200 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                        >
                            Plan Training
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Modals */}
            {actionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {actionModal === 'gap' ? 'Skill Gap Analysis & Report' : 'Proposed Training Plan'}
                            </h2>
                            <button onClick={() => setActionModal(null)} className="text-slate-500 hover:text-slate-700">
                                <Users size={24} /> {/* Using Users icon as a placeholder for close, normally X */}
                            </button>
                        </div>

                        <div className="p-6">
                            {actionModal === 'gap' ? (
                                <div className="space-y-6">
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                                        <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">Critical Gaps Identified</h4>
                                        <p className="text-sm text-orange-700 dark:text-orange-300">
                                            Analysis of 1,200+ Job Roles vs 15,000+ Student Profiles reveals a 40% deficit in Practical AI Application skills.
                                        </p>
                                    </div>

                                    <h3 className="text-lg font-bold">Gap by Skill Category</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'AI/ML', supply: 30, demand: 85 },
                                                { name: 'Full Stack', supply: 45, demand: 70 },
                                                { name: 'Cloud Ops', supply: 20, demand: 60 },
                                                { name: 'Data Eng', supply: 25, demand: 65 }
                                            ]}>
                                                <XAxis dataKey="name" />
                                                <YAxis label={{ value: 'Proficiency Score (0-100)', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="supply" name="Student Capacity" fill="#94a3b8" />
                                                <Bar dataKey="demand" name="Industry Requirement" fill="#f97316" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border rounded bg-slate-50">
                                            <h5 className="font-bold mb-2">Supply Side (Institutions)</h5>
                                            <ul className="list-disc pl-5 text-sm space-y-1">
                                                <li>Strong foundation in Theory (80% match)</li>
                                                <li>Lack of live project exposure</li>
                                                <li>Outdated curriculum in 3 key colleges</li>
                                            </ul>
                                        </div>
                                        <div className="p-4 border rounded bg-slate-50">
                                            <h5 className="font-bold mb-2">Demand Side (Industry)</h5>
                                            <ul className="list-disc pl-5 text-sm space-y-1">
                                                <li>Requires Day-1 deployable code</li>
                                                <li>Agile methodology familiarity needed</li>
                                                <li>Tool proficiency (Jira, Git, AWS) mandatory</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                        <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">Recommended Training Intervention</h4>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                            Based on the gaps, we recommend a 12-week intensive bootcamp for final year students.
                                        </p>
                                    </div>

                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-700">
                                                <th className="p-3 text-sm font-semibold">Program Name</th>
                                                <th className="p-3 text-sm font-semibold">Duration</th>
                                                <th className="p-3 text-sm font-semibold">Target Audience</th>
                                                <th className="p-3 text-sm font-semibold">Outcome</th>
                                                <th className="p-3 text-sm font-semibold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium">Full Stack Zero-to-Hero</td>
                                                <td className="p-3">12 Weeks</td>
                                                <td className="p-3">CS/IS Final Year</td>
                                                <td className="p-3">MERN Stack Certified</td>
                                                <td className="p-3"><button className="text-blue-600 text-sm font-medium hover:underline">Schedule</button></td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 font-medium">Cloud Practitioner</td>
                                                <td className="p-3">8 Weeks</td>
                                                <td className="p-3">All Engineering</td>
                                                <td className="p-3">AWS Cloud Cert</td>
                                                <td className="p-3"><button className="text-blue-600 text-sm font-medium hover:underline">Schedule</button></td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium">Soft Skills & Agile</td>
                                                <td className="p-3">4 Weeks</td>
                                                <td className="p-3">All Streams</td>
                                                <td className="p-3">Interview Ready</td>
                                                <td className="p-3"><button className="text-blue-600 text-sm font-medium hover:underline">Schedule</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setActionModal(null)} className="px-4 py-2 border rounded-lg hover:bg-white text-slate-700">Close</button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={() => {
                                    alert(actionModal === 'gap' ? 'Report Downloaded!' : 'Training Programs Initiated!');
                                    setActionModal(null);
                                }}
                            >
                                {actionModal === 'gap' ? 'Download Full Report' : 'Confirm Actions'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustryDemandView;
