
import React, { useState } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip
} from 'recharts';
import {
    ShieldCheck, Zap, Activity, Clock, Building2,
    Target,
    Briefcase
} from 'lucide-react';

// --- Data Constants ---
const JOBS_DATA = [
    {
        id: 'infy-java',
        company: 'Infosys',
        role: 'Senior Java Full Stack',
        sector: 'IT Services',
        domain: 'FinTech',
        salary: '₹6L - ₹12L',
        roles: 38,
        swtt: {
            skill: [
                { subject: 'Java/Spring', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Microservices', benchmark: 4, current: 2, fullMark: 4 },
                { subject: 'React/Angular', benchmark: 3, current: 3, fullMark: 4 },
                { subject: 'Cloud/AWS', benchmark: 3, current: 1, fullMark: 4 },
                { subject: 'DB/SQL', benchmark: 4, current: 3.5, fullMark: 4 },
                { subject: 'System Design', benchmark: 3, current: 1.5, fullMark: 4 },
            ],
            will: [
                { subject: 'Adaptability', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Ownership', benchmark: 4, current: 2.5, fullMark: 4 },
                { subject: 'Teamwork', benchmark: 4, current: 3.5, fullMark: 4 },
                { subject: 'Resilience', benchmark: 3, current: 3, fullMark: 4 },
                { subject: 'Curiosity', benchmark: 4, current: 2, fullMark: 4 },
            ],
            time: [
                { subject: 'Onboarding Speed', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Deliv. Velocity', benchmark: 4, current: 2.5, fullMark: 4 },
                { subject: 'Debug Speed', benchmark: 3, current: 2, fullMark: 4 },
                { subject: 'Learning Curve', benchmark: 4, current: 3, fullMark: 4 },
            ],
            tasks: [
                { level: 'L3', name: 'Microservices Migration', desc: 'Deconstruct monolithic legacy banking apps.' },
                { level: 'L2', name: 'API Integration', desc: 'Connect 3rd party payment gateways securely.' },
                { level: 'L4', name: 'System Optimization', desc: 'Reduce latency by 40% in transaction flow.' }
            ]
        }
    },
    {
        id: 'lamina-mech',
        company: 'Lamina',
        role: 'Precision Engineer',
        sector: 'Manufacturing',
        domain: 'Precision Engg',
        salary: '₹4L - ₹8L',
        roles: 15,
        swtt: {
            skill: [
                { subject: 'CAD/CAM', benchmark: 4, current: 3.5, fullMark: 4 },
                { subject: 'CNC Prog', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Materials', benchmark: 3, current: 3, fullMark: 4 },
                { subject: 'Quality Ctrl', benchmark: 4, current: 2.5, fullMark: 4 },
                { subject: 'Safety Stds', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Robotics', benchmark: 2, current: 1, fullMark: 4 },
            ],
            will: [
                { subject: 'Precision', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Safety Focus', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Problem Solving', benchmark: 3, current: 2.5, fullMark: 4 },
                { subject: 'Discipline', benchmark: 4, current: 3.5, fullMark: 4 },
                { subject: 'Innovation', benchmark: 2, current: 2, fullMark: 4 },
            ],
            time: [
                { subject: 'Prod. Efficiency', benchmark: 4, current: 3.5, fullMark: 4 },
                { subject: 'Setup Time', benchmark: 3, current: 3, fullMark: 4 },
                { subject: 'QC Cycle', benchmark: 4, current: 3, fullMark: 4 },
            ],
            tasks: [
                { level: 'L3', name: 'Auto-Component Design', desc: 'Design high-tolerance brake components.' },
                { level: 'L4', name: 'Line Automation', desc: 'Implement sensor-based quality rejection.' }
            ]
        }
    },
    {
        id: 'yenepoya-bio',
        company: 'Yenepoya',
        role: 'Biomedical Tech',
        sector: 'Healthcare',
        domain: 'Medical Devices',
        salary: '₹5L - ₹9L',
        roles: 12,
        swtt: {
            skill: [
                { subject: 'Electronics', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Biology', benchmark: 3, current: 3.5, fullMark: 4 },
                { subject: 'Sensors', benchmark: 4, current: 2, fullMark: 4 },
                { subject: 'Compliance', benchmark: 4, current: 2.5, fullMark: 4 },
                { subject: 'Data Analysis', benchmark: 3, current: 2, fullMark: 4 },
            ],
            will: [
                { subject: 'Empathy', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Precision', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Ethics', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Patience', benchmark: 4, current: 3.5, fullMark: 4 },
            ],
            time: [
                { subject: 'Response Time', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Maintenance', benchmark: 3, current: 3, fullMark: 4 },
                { subject: 'Diagnosis', benchmark: 4, current: 2.5, fullMark: 4 },
            ],
            tasks: [
                { level: 'L3', name: 'Device Calibration', desc: 'Calibrate MRI/CT sensors for <1% error.' },
                { level: 'L2', name: 'Preventive Maint.', desc: 'Schedule maintenance for critical ICU units.' }
            ]
        }
    },
    {
        id: 'campco-agri',
        company: 'Campco',
        role: 'Agri-Tech Analyst',
        sector: 'Agriculture',
        domain: 'Supply Chain',
        salary: '₹3.5L - ₹7L',
        roles: 8,
        swtt: {
            skill: [
                { subject: 'IoT/Sensors', benchmark: 3, current: 1.5, fullMark: 4 },
                { subject: 'Logistics', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'SAP/ERP', benchmark: 3, current: 2.5, fullMark: 4 },
                { subject: 'Quality Grading', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Mobile Apps', benchmark: 2, current: 3, fullMark: 4 },
            ],
            will: [
                { subject: 'Hard Work', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Community', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Sustainability', benchmark: 4, current: 3, fullMark: 4 },
                { subject: 'Adaptability', benchmark: 3, current: 2, fullMark: 4 },
            ],
            time: [
                { subject: 'Procurement', benchmark: 4, current: 4, fullMark: 4 },
                { subject: 'Distribution', benchmark: 3, current: 3.5, fullMark: 4 },
                { subject: 'Tech Adoption', benchmark: 3, current: 1.5, fullMark: 4 },
            ],
            tasks: [
                { level: 'L2', name: 'Arecanut Grading', desc: 'Automated grading using image processing.' },
                { level: 'L3', name: 'Route Opt.', desc: 'Optimize collection routes for 500+ farmers.' }
            ]
        }
    }
];

const PLACEMENT_DATA = [
    { name: 'Placed', value: 3100, color: '#10B981' },
    { name: 'Training', value: 450, color: '#F59E0B' },
    { name: 'Looking', value: 950, color: '#6366F1' },
];

// --- Components ---

const RadarSection = ({ title, data, color }: { title: string, data: any[], color: string }) => (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            {title === 'Skill' ? <Zap size={20} className="text-amber-500" /> :
                title === 'Will' ? <ShieldCheck size={20} className="text-emerald-500" /> :
                    <Clock size={20} className="text-blue-500" />}
            {title} Mastery
        </h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 4]} tick={false} />
                    <Radar
                        name="Benchmark"
                        dataKey="benchmark"
                        stroke={color}
                        strokeWidth={2}
                        fill={color}
                        fillOpacity={0.1}
                    />
                    <Radar
                        name="Current Talent"
                        dataKey="current"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        fill="#94a3b8"
                        fillOpacity={0.4}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#475569', fontWeight: 600 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 text-xs font-semibold">
            <div className="flex items-center gap-1 text-slate-500">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div> Current
            </div>
            <div className="flex items-center gap-1" style={{ color: color }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div> Benchmark
            </div>
        </div>
    </div>
);

const RegionalMasteryCommandCenter: React.FC<{ onNavigate: (view: 'map' | 'institutions' | 'industry' | 'jobs' | 'analytics' | 'reports' | 'coe', tab?: string) => void }> = ({ onNavigate }) => {
    const [selectedJobId, setSelectedJobId] = useState<string>(JOBS_DATA[0].id);
    const job = JOBS_DATA.find(j => j.id === selectedJobId) || JOBS_DATA[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. Demand Forecasting Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Target className="text-blue-600" />
                            Demand Forecasting
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Select a role to analyze talent gaps and mastery requirements.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100 animate-pulse">
                        <Activity size={16} /> Live Data: Dec 2024
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-sm text-slate-400 border-b border-slate-100 dark:border-slate-700">
                                <th className="p-3 font-semibold">Company</th>
                                <th className="p-3 font-semibold">Role</th>
                                <th className="p-3 font-semibold">Sector</th>
                                <th className="p-3 font-semibold">Openings</th>
                                <th className="p-3 font-semibold">Salary Range</th>
                                <th className="p-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {JOBS_DATA.map((j) => (
                                <tr
                                    key={j.id}
                                    onClick={() => setSelectedJobId(j.id)}
                                    className={`cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg group ${selectedJobId === j.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                                >
                                    <td className="p-3 font-bold text-slate-800 dark:text-white">{j.company}</td>
                                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{j.role}</td>
                                    <td className="p-3 text-slate-500 text-sm">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                                            {j.sector}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-600 dark:text-slate-300 font-bold">{j.roles}</td>
                                    <td className="p-3 text-slate-500 text-sm">{j.salary}</td>
                                    <td className="p-3 text-right">
                                        <div className={`w-4 h-4 rounded-full border-2 ml-auto ${selectedJobId === j.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 2. SWTT Framework Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RadarSection title="Skill" data={job.swtt.skill} color="#F59E0B" />
                <RadarSection title="Will" data={job.swtt.will} color="#10B981" />
                <RadarSection title="Time" data={job.swtt.time} color="#3B82F6" />
            </div>

            {/* 3. Task Insight Cards */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                    <Briefcase className="text-indigo-400" />
                    Task Complexity & Benchmark Deliverables
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {job.swtt.tasks.map((task, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-bold text-lg">{task.name}</span>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${task.level === 'L4' ? 'bg-indigo-500' :
                                    task.level === 'L3' ? 'bg-blue-500' : 'bg-emerald-500'
                                    }`}>
                                    {task.level}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{task.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Regional Context */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COE Stats */}
                <div
                    onClick={() => onNavigate('coe')}
                    className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Institutional State (COEs)</h3>
                            <p className="text-sm text-slate-500">14 Total Centers (11 Active, 3 Initiated) &rarr;</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Allocations</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹7.3 Cr</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Programs</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">42</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Graduation Rate</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">82%</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">G</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Govt / College COEs</h4>
                                    <p className="text-xs text-slate-500">Government Polytechnic, NITK STEP</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">8 Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">P</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Private For-Profit</h4>
                                    <p className="text-xs text-slate-500">Robosoft Academy, Niveus Labs</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">3 Active</span>
                        </div>
                    </div>
                </div>

                {/* Placement Pipeline */}
                <div
                    onClick={() => onNavigate('analytics', 'placements')}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group"
                >
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Placement Pipeline &rarr;</h3>
                        <p className="text-sm text-slate-500">Region-04 Talent Flow</p>
                    </div>

                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PLACEMENT_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {PLACEMENT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">4,500</p>
                            <p className="text-xs text-slate-400">Total Pool</p>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        {PLACEMENT_DATA.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    {item.name}
                                </span>
                                <span className="font-bold text-slate-800 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegionalMasteryCommandCenter;
