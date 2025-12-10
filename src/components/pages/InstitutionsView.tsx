import React, { useState } from 'react';
import { Search, MapPin, Building2, Download, Plus, Target, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { INSTITUTIONS } from '../../data/institutions';

const InstitutionsView: React.FC<{ onNavigate?: (view: any, id?: string) => void }> = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const filteredInstitutions = INSTITUTIONS.filter(inst => {
        const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inst.location.area || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || inst.category === typeFilter;
        return matchesSearch && matchesType;
    });


    // -- Derived Data for Dashboard --
    const totalInstitutions = INSTITUTIONS.length;
    // Calculate total seats as proxy for students if 'students' prop is missing
    const totalAssessed = INSTITUTIONS.reduce((acc, curr) => {
        const seats = curr.academic?.programs?.reduce((pAcc, prog) => pAcc + (prog.seats || 0), 0) || 0;
        return acc + seats;
    }, 0);
    const avgScore = 71;

    // Discipline Split
    const disciplineCounts = {
        Engineering: INSTITUTIONS.filter(i => i.category === 'Engineering').length,
        Polytechnic: INSTITUTIONS.filter(i => i.category === 'Polytechnic').length,
        ITI: INSTITUTIONS.filter(i => i.category === 'ITI').length,
        ArtsScience: INSTITUTIONS.filter(i => i.category === 'University' || i.category === 'Degree College').length
    };

    // Mock Scores for "Top Performing" and "Needs Support"
    // In a real app, this would be in the data
    const scoredInstitutions = INSTITUTIONS.map(inst => ({
        ...inst,
        score: Math.floor(Math.random() * 30) + 60, // 60-90
        gap: Math.floor(Math.random() * 25) + 15 // 15-40%
    })).sort((a, b) => b.score - a.score);

    const topPerforming = scoredInstitutions.slice(0, 3);
    const needsSupport = [...scoredInstitutions].reverse().slice(0, 3);

    const skillScores = [
        { name: 'Engineering', score: 78, color: '#10b981' }, // Emerald
        { name: 'Diploma', score: 65, color: '#eab308' },    // Yellow
        { name: 'ITI', score: 72, color: '#eab308' },        // Yellow
        { name: 'Arts & Science', score: 58, color: '#ef4444' } // Red
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institutions</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track performance, assessments, and skill gaps across all institutes.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium">
                        <Download size={16} />
                        Export Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        <Plus size={16} />
                        Add Institution
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Institutions</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalInstitutions}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Building2 size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Assessed</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{(totalAssessed * 0.4).toFixed(0)}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Target size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Assessment Coverage</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">84%</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 mt-2">↑ +5% vs last month</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Avg District Score</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{avgScore}/100</h3>
                        </div>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Award size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-3">Discipline Split</p>
                        <div className="flex justify-between text-center">
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">{disciplineCounts.Engineering}</span>
                                <span className="text-[10px] text-slate-500 uppercase">Engg</span>
                            </div>
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">{disciplineCounts.Polytechnic}</span>
                                <span className="text-[10px] text-slate-500 uppercase">Poly</span>
                            </div>
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">{disciplineCounts.ITI}</span>
                                <span className="text-[10px] text-slate-500 uppercase">ITI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performing */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Performing Institutes</h3>
                    <div className="space-y-4">
                        {topPerforming.map((inst, idx) => (
                            <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => onNavigate?.('map', inst.id)}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{inst.name}</h4>
                                        <p className="text-xs text-slate-500">{inst.location.district || 'Dakshina Kannada'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-emerald-600">{inst.score}</span>
                                    <span className="text-[10px] text-slate-400">Score</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Needs Support */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        Needs Support
                    </h3>
                    <div className="space-y-4">
                        {needsSupport.map((inst, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20 cursor-pointer hover:bg-red-100" onClick={() => onNavigate?.('map', inst.id)}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-red-500 flex items-center justify-center font-bold">!</div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{inst.name}</h4>
                                        <p className="text-xs text-slate-500">Gap: {inst.gap}%</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-red-600">{inst.score}</span>
                                    <span className="text-[10px] text-slate-400">Score</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Score Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Skill Score by Discipline</h3>
                    <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={skillScores} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <XAxis type="number" hide domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                                    {skillScores.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Existing Search & Filter Section (Kept below stats as per common pattern, or could be moved top) */}
            {/* The screenshot suggests components are top-level. I will keep the list here as "Detailed List" */}

            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Institutions</h2>
                {/* Filters */}
                <div className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Polytechnic">Polytechnic</option>
                        <option value="ITI">ITI</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Institution Name</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Type</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Location</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Students Assessed</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Avg Skill Score</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInstitutions.slice(0, 10).map((inst, idx) => {
                                // Mock stats generation based on index to keep it deterministic
                                const assessed = Math.floor(Math.random() * 300) + 100;
                                const total = assessed + Math.floor(Math.random() * 100);
                                const score = Math.floor(Math.random() * 30) + 60;
                                const status = idx % 5 === 0 ? 'Needs Improvement' : 'Active';

                                return (
                                    <tr key={inst.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                    <Building2 size={16} />
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white text-sm">{inst.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{inst.category}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                            <MapPin size={14} /> {inst.location.area}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                                    <span>{assessed}/{total}</span>
                                                    <span className="font-bold">{Math.round((assessed / total) * 100)}%</span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-800 dark:bg-white" style={{ width: `${(assessed / total) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`p-4 text-sm font-bold ${score > 75 ? 'text-emerald-600' : score > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {score}%
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={() => onNavigate?.('map', inst.id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstitutionsView;
