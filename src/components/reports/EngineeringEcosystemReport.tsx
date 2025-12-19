import React from 'react';
import { ArrowLeft, Download, School, Trophy, Briefcase, TrendingUp, Cpu, AlertTriangle } from 'lucide-react';

interface ReportProps {
    onBack: () => void;
}

const EngineeringEcosystemReport: React.FC<ReportProps> = ({ onBack }) => {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Reports
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-8 space-y-12">
                {/* Title Section */}
                <section className="text-center space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Dakshina Karnataka Engineering Ecosystem</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Comprehensive analysis of the Mangaluru-Udupi-Manipal corridor: Enrollment, Placements, and Industry Trends (2024-25).
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">Tier-2 IT Hub</span>
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold">26,500+ Students</span>
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">Optimization Phase</span>
                    </div>
                </section>

                {/* Executive Summary */}
                <section className="prose dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                        The Mangaluru-Udupi-Manipal corridor houses approximately <strong>26,500+ engineering students</strong> across 10+ colleges, with <strong>4,500+ placements</strong> in 2024-25 and <strong>850-900 active tech job openings</strong>. This tier-2 region is emerging as Karnataka's second-largest IT hub outside Bengaluru, with KDEM targeting <strong>100,000 new jobs by 2026</strong> and companies like Niveus Solutions building India's largest tier-3 city cloud engineering workforce.
                    </p>
                </section>

                {/* Enrollment Data */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <School size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Student Enrollment & Intake</h2>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <tr>
                                    <th className="p-4 font-semibold">College</th>
                                    <th className="p-4 font-semibold">Total Enrollment</th>
                                    <th className="p-4 font-semibold">Annual Intake</th>
                                    <th className="p-4 font-semibold">Key Programs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {[
                                    { name: 'MIT Manipal', enrollment: '6,000+', intake: '1,400+', progs: 'CSE, IT, Electronics, Mechanical' },
                                    { name: 'NITK Surathkal', enrollment: '5,500', intake: '479 BTech', progs: '14 engineering departments' },
                                    { name: 'NMAMIT Nitte', enrollment: '3,000+', intake: '720', progs: 'CSE, AI/ML, Electronics' },
                                    { name: 'Srinivas Institute', enrollment: '3,000', intake: '540', progs: '9 UG programs' },
                                    { name: 'St Joseph Engineering', enrollment: '2,300', intake: '540', progs: 'CSE, AI, ECE' },
                                    { name: "Alva's Institute", enrollment: '1,800+', intake: '420', progs: 'Engineering & Technology' },
                                    { name: 'Sahyadri College', enrollment: '1,500+', intake: '780', progs: '7 BE courses' },
                                    { name: 'Canara Engineering', enrollment: '1,200', intake: '300', progs: 'CSE, Mechanical' },
                                    { name: 'PA College of Engineering', enrollment: '1,450', intake: '300', progs: 'Core engineering' },
                                    { name: 'Bearys Institute', enrollment: '1,200', intake: '300', progs: 'Multi-disciplinary' }
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{row.enrollment}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{row.intake}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{row.progs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                        <strong>Year-wise breakdown:</strong> First-year (~6,800), Second-year (~6,600), Third-year (~6,500), Fourth-year (~6,600). Growth is steady at 2-3% annually.
                    </div>
                </section>

                {/* Placement Data */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                            <Trophy size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Placement Season 2024-25</h2>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <tr>
                                    <th className="p-4 font-semibold">College</th>
                                    <th className="p-4 font-semibold">Placed</th>
                                    <th className="p-4 font-semibold">Rate</th>
                                    <th className="p-4 font-semibold">Highest Package</th>
                                    <th className="p-4 font-semibold">Average Package</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {[
                                    { name: 'NITK Surathkal', placed: '1,350', rate: '93% (BTech)', high: '₹55 LPA', avg: '₹16.25 LPA' },
                                    { name: 'MIT Manipal', placed: '~4,800', rate: '80.1%', high: '₹69.25 LPA', avg: '₹12.31 LPA' },
                                    { name: 'NMAMIT Nitte', placed: '878 offers', rate: '75-100%', high: '₹52 LPA', avg: '₹10 LPA' },
                                    { name: 'St Joseph Engineering', placed: '424', rate: '71%', high: '₹24.50 LPA', avg: '₹5.60 LPA' },
                                    { name: 'Sahyadri College', placed: '310', rate: '53% (UG)', high: '₹72 LPA', avg: '₹6.30 LPA' },
                                    { name: 'Canara Engineering', placed: '201', rate: '58%', high: '₹23.68 LPA', avg: '₹5.95 LPA' },
                                    { name: 'Srinivas Institute', placed: '447', rate: '86.9%', high: '₹5 LPA', avg: '₹4.48 LPA' },
                                    { name: "Alva's Institute", placed: '314', rate: '80%', high: '₹21 LPA', avg: '₹4-6 LPA' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{row.placed}</td>
                                        <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">{row.rate}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{row.high}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">{row.avg}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Company & Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Top Hiring Companies</h2>
                        </div>
                        <ul className="space-y-3">
                            {[
                                { name: 'Infosys BPM', loc: 'Mangaluru', open: '38+', role: 'Process Executive, Finance' },
                                { name: 'Cognizant', loc: 'Mangaluru', open: '25-32', role: 'Business Analyst, Process' },
                                { name: 'Robosoft', loc: 'Udupi (HQ)', open: '12', role: 'Data Analyst, Roku Dev' },
                                { name: 'Niveus Solutions', loc: 'Udupi', open: '4+', role: 'Cloud, AI/ML, DevOps' },
                                { name: 'Novigo Solutions', loc: 'Mangaluru', open: 'Multiple', role: 'Low Code, RPA, .NET' },
                                { name: 'Winman Software', loc: 'Mangaluru', open: '5-8', role: 'Dev, Testing' }
                            ].map((c, i) => (
                                <li key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{c.name}</h4>
                                        <p className="text-xs text-slate-500">{c.loc} • {c.role}</p>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">{c.open} Open</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                <Cpu size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Top In-Demand Skills</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { skill: 'Google Cloud Platform', val: 40, employer: 'Niveus' },
                                { skill: 'Python', val: 35, employer: 'Robosoft, Winman' },
                                { skill: 'JavaScript/React/Node', val: 30, employer: 'Robosoft, Idaksh' },
                                { skill: 'Java', val: 28, employer: 'EG Danmark' },
                                { skill: 'SQL/Databases', val: 25, employer: 'Winman, Niveus' },
                                { skill: 'Mobile Dev (iOS/Android)', val: 25, employer: 'Robosoft' }
                            ].map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{s.skill}</span>
                                        <span className="text-xs text-slate-500">Target: {s.employer}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: `${(s.val / 40) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Skill Gap Analysis */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                            <AlertTriangle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { skill: 'Cloud Platforms (GCP/AWS)', gap: 'Critical', desc: 'Rarely taught in curriculum despite High Demand.' },
                            { skill: 'AI/ML (Applied)', gap: 'High', desc: 'Basic theory covered, but industry needs applied skills.' },
                            { skill: 'DevOps/Kubernetes', gap: 'High', desc: 'Completely missing from standard curriculum.' },
                            { skill: 'Modern Web (React/Node)', gap: 'High', desc: 'Limited exposure compared to legacy web tech.' },
                            { skill: 'Cybersecurity', gap: 'Medium', desc: 'Growing need, minimal academic coverage.' },
                            { skill: 'Soft Skills', gap: 'Medium', desc: 'Essential for client-facing roles, often inadequate.' }
                        ].map((gap, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 dark:text-white">{gap.skill}</h4>
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${gap.gap === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        gap.gap === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>{gap.gap} Gap</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {gap.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Conclusion */}
                <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border-l-4 border-blue-600">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Strategic Outlook</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Dakshina Karnataka's ecosystem is robust but requires targeted intervention in <strong>Cloud and AI/ML</strong> training to bridge the gap between academic output and industry requirements. With <strong>10,000+ new jobs projected by 2026</strong>, alignment with companies like Niveus, Robosoft, and global GCCs is critical for future growth.
                    </p>
                </section>

                <div className="text-center pt-8 text-sm text-slate-400">
                    Generated on {new Date().toLocaleDateString()} • KDEM / District Administration
                </div>
            </div>
        </div>
    );
};

export default EngineeringEcosystemReport;
