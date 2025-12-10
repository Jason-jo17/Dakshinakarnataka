import React from 'react';
import { Users, Trophy, Tv, Briefcase, TrendingUp } from 'lucide-react';
import { JOBS } from '../../data/jobs';
import { INSTITUTIONS } from '../../data/institutions';

const DistrictDashboard: React.FC<{ onNavigate: (view: 'map' | 'institutions' | 'industry' | 'jobs') => void }> = ({ onNavigate }) => {
    // Aggregated Stats
    const totalStudents = INSTITUTIONS.reduce((acc, curr) => {
        const seats = curr.academic?.programs?.reduce((pAcc, prog) => pAcc + (prog.seats || 0), 0) || 0;
        return acc + seats;
    }, 0);

    const placedCandidates = INSTITUTIONS.reduce((acc, curr) => {
        if (curr.placement?.studentsPlaced) return acc + curr.placement.studentsPlaced;
        const seats = curr.academic?.programs?.reduce((pAcc, prog) => pAcc + (prog.seats || 0), 0) || 0;
        return acc + Math.floor(seats * ((curr.placement?.rate || 0) / 100));
    }, 0);

    const ongoingTraining = 12; // Placeholder (Mock for now)
    const totalVacancies = JOBS.length;

    // Top Vacancies (Aggregated by Company)
    const vacanciesByCompany: Record<string, number> = {};
    JOBS.forEach(job => {
        vacanciesByCompany[job.company] = (vacanciesByCompany[job.company] || 0) + 1;
    });

    const topVacancies = Object.entries(vacanciesByCompany)
        .map(([company, count]) => ({ role: 'Various Roles', company, count })) // formatting for UI
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    // Top Skills Calculation (Refined for Tech Focus)
    const skillCounts: Record<string, number> = {};
    const techKeywords = ['Python', 'Java', 'React', 'SQL', 'Data', 'AI', 'Machine Learning', 'Cloud', 'Design', 'Communication'];

    JOBS.forEach(job => {
        // Extract words from requirements
        const text = (job.requirements || '') + ' ' + job.role;
        const words = text.split(/[\s,.]+/);

        words.forEach(w => {
            const clean = w.replace(/[\(\)]/g, '').trim();
            if (clean.length < 3) return;

            // Prioritize known tech keywords or count distinct significant words
            if (techKeywords.some(k => clean.toLowerCase().includes(k.toLowerCase()))) {
                skillCounts[clean] = (skillCounts[clean] || 0) + 2; // Boost tech terms
            } else if (!['experience', 'years', 'month', 'required', 'pass', 'english', 'license'].includes(clean.toLowerCase())) {
                skillCounts[clean] = (skillCounts[clean] || 0) + 0.5; // Lower weight for others
            }
        });
    });

    // Consolidate similar skills (simple normalization)
    const consolidatedSkills: Record<string, number> = {};
    Object.entries(skillCounts).forEach(([skill, count]) => {
        let key = skill;
        if (skill.toLowerCase().includes('react')) key = 'React/React Native';
        else if (skill.toLowerCase().includes('python')) key = 'Python';
        else if (skill.toLowerCase().includes('data')) key = 'Data Science';
        else if (skill.toLowerCase().includes('design')) key = 'Design (UI/UX)';
        else if (skill.toLowerCase().includes('sql')) key = 'SQL / Database';

        consolidatedSkills[key] = (consolidatedSkills[key] || 0) + count;
    });

    const topSkills = Object.entries(consolidatedSkills)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([skill, count]) => ({ skill, count: Math.round(count) }));

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">District Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Overview of student performance, placements, and industry demand.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Students</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalStudents.toLocaleString()}</h2>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>4% vs last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Placed Candidates</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{placedCandidates}</h2>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                            <Trophy size={20} />
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>12% vs last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Ongoing Training</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{ongoingTraining}</h2>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                            <Tv size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Vacancies</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalVacancies}</h2>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <Briefcase size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Job Vacancies */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top 5 Job Vacancies</h3>
                        <p className="text-sm text-slate-500">High demand roles across the district</p>
                    </div>

                    <div className="space-y-4">
                        {topVacancies.map((job, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{job.company}</h4>
                                        <p className="text-xs text-slate-500">Multiple Roles</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border px-2 py-1 rounded">
                                    {job.count} Openings
                                </span>
                            </div>
                        ))}
                        <button
                            onClick={() => onNavigate('industry')}
                            className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            View All Vacancies &rarr;
                        </button>
                    </div>
                </div>

                {/* Top In-Demand Skills */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top 5 In-Demand Skills</h3>
                        <p className="text-sm text-slate-500">Skills most requested by hiring partners</p>
                    </div>

                    <div className="space-y-4">
                        {topSkills.map((skill, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-300">{skill.skill}</span>
                                    <span className="text-xs text-slate-400">{skill.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((skill.count / (topSkills[0]?.count || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistrictDashboard;
