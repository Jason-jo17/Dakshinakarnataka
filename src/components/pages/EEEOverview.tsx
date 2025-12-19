import React from 'react';
import { Users, Trophy, Tv, Briefcase, TrendingUp } from 'lucide-react';
import RegionalMasteryCommandCenter from '../dashboard/RegionalMasteryCommandCenter';
import LeadingCompanies from '../dashboard/LeadingCompanies';


const EEEOverview: React.FC<{ onNavigate: (view: 'map' | 'institutions' | 'industry' | 'jobs' | 'analytics' | 'reports' | 'coe', tab?: string) => void }> = ({ onNavigate }) => {
    // Aggregated Stats
    const totalStudents = "26,500+";
    const placedCandidates = "4,500+";
    const ongoingTraining = "12 Stations";
    const totalVacancies = "850-900";

    // Top Vacancies (Source: provided ecosystem data)
    const topVacancies = [
        { company: 'Infosys BPM', role: 'Process Executive, Finance', count: '38+' },
        { company: 'Cognizant', role: 'Biz Analyst, Process', count: '32+' },
        { company: 'Robosoft', role: 'Data Analyst, Roku Dev', count: '12' },
        { company: 'Niveus Solutions', role: 'Cloud Engineer, AI/ML', count: '4+' },
        { company: 'Winman Software', role: 'Software Dev, Testing', count: '8' }
    ];

    // Top Skills Calculation (Source: provided ecosystem data)
    // "Top 10 In-Demand Skills Ranked by Frequency"
    const topSkills = [
        { skill: 'Google Cloud Platform', count: 40 }, // Using Demand % as a proxy for visual bar
        { skill: 'Python', count: 35 },
        { skill: 'JavaScript/React/Node', count: 30 },
        { skill: 'Java', count: 28 },
        { skill: 'SQL/Databases', count: 25 }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dakshina Karnataka Network</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Energy Ecosystem & Employment (EEE) Overview</p>
                    <button
                        onClick={() => onNavigate('reports')}
                        className="mt-4 text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                    >
                        View Full Ecosystem Report &rarr;
                    </button>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Region-04 / Mangaluru-Udupi Corridor</p>
                    <p className="text-xs text-slate-500">Last updated: Dec 18, 2024</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    onClick={() => onNavigate('analytics', 'overview')}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40 group hover:shadow-md transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Engineering Students</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalStudents}</h2>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Approx. Total Enrollment</span>
                    </div>
                </div>

                <div
                    onClick={() => onNavigate('analytics', 'placements')}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40 group hover:shadow-md transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Placed Candidates</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{placedCandidates}</h2>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Trophy size={20} />
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>2024-25 Season</span>
                    </div>
                </div>

                <div
                    onClick={() => onNavigate('coe')}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40 group hover:shadow-md transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Innovation Hubs</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{ongoingTraining}</h2>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Tv size={20} />
                        </div>
                    </div>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <span>Incubators & Training Centers</span>
                    </div>
                </div>

                <div
                    onClick={() => onNavigate('industry')}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40 group hover:shadow-md transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Job Vacancies</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalVacancies}</h2>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Briefcase size={20} />
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Rising Demand in AI/Cloud</span>
                    </div>
                </div>
            </div>

            {/* Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Job Vacancies */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Hiring Companies</h3>
                            <p className="text-sm text-slate-500">Leading tech employers in the region</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded">Live Data</span>
                    </div>

                    <div className="space-y-4">
                        {topVacancies.map((job, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-white text-blue-600 shadow-sm flex items-center justify-center font-bold text-sm border border-slate-100">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{job.company}</h4>
                                        <p className="text-xs text-slate-500">{job.role}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border px-2 py-1 rounded shadow-sm">
                                    {job.count} Openings
                                </span>
                            </div>
                        ))}
                        <button
                            onClick={() => onNavigate('industry')}
                            className="w-full py-3 text-sm text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            View All 850+ Vacancies <TrendingUp size={14} />
                        </button>
                    </div>
                </div>

                {/* Top In-Demand Skills */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top In-Demand Skills</h3>
                            <p className="text-sm text-slate-500">Skills most requested by hiring partners</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-600 rounded">Dec 2024</span>
                    </div>

                    <div className="space-y-5">
                        {topSkills.map((skill, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{skill.skill}</span>
                                    <span className="text-xs font-bold text-indigo-600">{skill.count}% Demand</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${skill.count}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>*Based on frequency in job descriptions</span>
                                <span className="flex items-center gap-1 text-emerald-600 font-medium"><TrendingUp size={12} /> AI/ML demand +60% YoY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Regional Mastery Command Center - Replaces old Widget Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <RegionalMasteryCommandCenter onNavigate={onNavigate} />
            </div>

            {/* Leading Companies Section */}
            <div className="pt-4">
                <LeadingCompanies onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default EEEOverview;
