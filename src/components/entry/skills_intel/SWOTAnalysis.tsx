import React from 'react';
import { Target, AlertTriangle, TrendingUp, TrendingDown, Shield, Lightbulb } from 'lucide-react';

const swotData = {
    strengths: [
        "Dakshina Kannada's growth, fueled by engineering and IT sectors, boosts demand for housing and job opportunities.",
        "The district's educational focus and student migration underscore the need for technical training and expand career prospects in automotive, engineering, accounting, and HR fields."
    ],
    weaknesses: [
        "Migration of skilled workers and insufficient replacements are affecting industry productivity, though some sectors remain stable.",
        "Establishing additional training centers is crucial to fill the workforce gap, enhance local employment opportunities, and support industry growth."
    ],
    opportunities: [
        "Dakshina Kannada's strong economic and industrial growth, particularly in engineering and IT sectors, presents ample opportunities for further investment and job creation.",
        "The district's role as an educational hub underscores the need for vocational training to address skill gaps, providing a solid foundation for resilience."
    ],
    threats: [
        "The migration of skilled workers and the lack of suitable replacements are challenging local industries, necessitating more training centers.",
        "Retaining local talent and addressing employment gaps in key sectors like automotive and engineering are crucial for maintaining productivity."
    ],
    strategies: [
        {
            title: "Establish Comprehensive Training Centers",
            description: "Develop vocational programs tailored to industry needs and establish or enhance technical institutes in collaboration with educational institutions and private sectors."
        },
        {
            title: "Enhance Skill Development",
            description: "Launch initiatives focusing on both soft and technical skills, offer certifications, and provide training in emerging technologies like AI and cyber security."
        },
        {
            title: "Support Women's Workforce Participation",
            description: "Create women-centric training programs with flexible schedules and childcare support to boost participation in various industries."
        },
        {
            title: "Address Workforce Gaps and Retention",
            description: "Implement retention strategies, attract skilled workers with relocation incentives, and set up job placement services while promoting entrepreneurship."
        }
    ]
};

export const SWOTAnalysis: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* SWOT Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 transform group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-24 h-24 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-600 rounded-lg text-white">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Strengths</h3>
                    </div>
                    <ul className="space-y-3">
                        {swotData.strengths.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 transform group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-24 h-24 text-amber-600 transform rotate-180" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-600 rounded-lg text-white">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 uppercase tracking-tight">Weaknesses</h3>
                    </div>
                    <ul className="space-y-3">
                        {swotData.weaknesses.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Opportunities */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 transform group-hover:scale-110 transition-transform">
                        <Lightbulb className="w-24 h-24 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <Lightbulb className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 uppercase tracking-tight">Opportunities</h3>
                    </div>
                    <ul className="space-y-3">
                        {swotData.opportunities.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Threats */}
                <div className="bg-rose-50 dark:bg-rose-950/30 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 transform group-hover:scale-110 transition-transform">
                        <Shield className="w-24 h-24 text-rose-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-600 rounded-lg text-white">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100 uppercase tracking-tight">Threats</h3>
                    </div>
                    <ul className="space-y-3">
                        {swotData.threats.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-rose-800 dark:text-rose-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Strategies based on SWOT */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-900 dark:bg-white rounded-lg text-white dark:text-slate-900">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Strategies based on SWOT</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {swotData.strategies.map((strategy, i) => (
                        <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-200 dark:hover:border-blue-900">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-black">
                                    {i + 1}
                                </span>
                                {strategy.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                                {strategy.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SWOTAnalysis;
