import React, { useState } from 'react';
import { Search, Loader2, Target, Users, Briefcase, ExternalLink, Bot, Sparkles, ChevronDown, ChevronRight, LayoutDashboard, ArrowRight, Building2, MapPin } from 'lucide-react';
import { performIntelligentSearch } from '../../services/geminiService';
import { INSTITUTIONS } from '../../data/institutions';
import { JOBS } from '../../data/jobs';
import { ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

interface DCSearchProps {
    onNavigate: (view: 'dashboard', tab: string) => void;
    initialQuery?: string;
}

const PRESET_QUERIES = [
    {
        text: "AI & Tech Opportunities in Mangaluru",
        type: "market"
    },
    {
        text: "Overview of Education Sector in DK",
        type: "edu"
    },
    {
        text: "Skill Gaps in Core Engineering",
        type: "skill"
    }
];

const PRESET_RESPONSES: Record<string, any> = {
    "AI & Tech Opportunities in Mangaluru": {
        thoughtProcess: [
            "Step 1: Identify intent: User is looking for high-tech job market data.",
            "Step 2: Key entities: 'AI', 'Tech', 'Mangaluru', 'Opportunities'.",
            "Step 3: Determine View: Market Analysis is best to show the ecosystem of companies and jobs.",
            "Step 4: Filter Strategy: Filter for 'Company' category and 'software/AI' skills."
        ],
        answer: "Mangaluru's tech ecosystem is growing rapidly beyond traditional services. I've identified key hubs like Novigo Solutions, CodeCraft, and frantic hiring in AI/ML roles. There is a verified surge in demand for Python and Data Science skills.",
        recommendedView: 'market_analysis',
        filters: {
            skills: ['AI', 'Machine Learning', 'Python', 'Data Science'],
            location: 'Mangaluru',
            category: null,
            type: 'Company'
        }
    },
    "Overview of Education Sector in DK": {
        thoughtProcess: [
            "Step 1: Identify intent: User wants a broad summary of the region's educational landscape.",
            "Step 2: Key entities: 'Education Sector', 'Overview', 'DK' (District).",
            "Step 3: Determine View: Institutions view provides the aggregate statistics needed.",
            "Step 4: Filter Strategy: Include all distinct educational categories (Engineering, Medical, etc.)."
        ],
        answer: "Dakshina Kannada is a premier educational hub. The district boasts a high concentration of Engineering and Medical institutions, with over 150+ identified major campuses. The data shows a strong bias towards technical and healthcare education.",
        recommendedView: 'institutions',
        filters: {
            skills: [],
            location: null,
            category: null,
            type: 'Education'
        }
    },
    "Skill Gaps in Core Engineering": {
        thoughtProcess: [
            "Step 1: Identify intent: Analyze mismatch in traditional engineering sectors.",
            "Step 2: Key entities: 'Skill Gaps', 'Core Engineering' (Mechanical/Civil).",
            "Step 3: Determine View: Skill Gap view to visualize supply vs demand.",
            "Step 4: Filter Strategy: Focus on Mechanical, Civil, and Electrical domains."
        ],
        answer: "My analysis indicates a widening gap in core engineering. While graduate supply is high, industry-ready skills in advanced CAD, automation, and site management are in short supply compared to market requirements.",
        recommendedView: 'skill_gap',
        filters: {
            skills: ['Mechanical', 'Civil', 'Automation', 'CAD'],
            location: null,
            category: null,
            type: null
        }
    }
};

export const DCSearch: React.FC<DCSearchProps> = ({ onNavigate, initialQuery }) => {
    const [query, setQuery] = useState(initialQuery || '');
    const [loading, setLoading] = useState(false);
    const [showThoughts, setShowThoughts] = useState(false);

    // Effect to trigger search if initialQuery is provided
    React.useEffect(() => {
        if (initialQuery) {
            executeSearch(initialQuery);
        }
    }, [initialQuery]);

    // New State for Enhanced Response
    const [aiResponse, setAiResponse] = useState<{
        thoughtProcess: string[];
        answer: string;
        recommendedView: 'institutions' | 'jobs' | 'market_analysis' | 'skill_gap';
        filters: any;
        data: {
            institutions: typeof INSTITUTIONS;
            jobs: typeof JOBS;
        }
    } | null>(null);

    const executeSearch = async (searchQuery: string, isPreset: boolean = false) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setAiResponse(null);
        setShowThoughts(true);

        try {
            let result;

            if (isPreset && PRESET_RESPONSES[searchQuery]) {
                // Simulate network delay for effect
                await new Promise(resolve => setTimeout(resolve, 800));
                result = PRESET_RESPONSES[searchQuery];
            } else {
                // Generate Data Context
                // We inject the FULL jobs list to ensure the AI can find specific roles like 'Retail Sales Executive'.
                const contextSummary = `
                Total Institutions: ${INSTITUTIONS.length}
                Sample Institutions: ${INSTITUTIONS.slice(0, 10).map(i => `${i.name} (${i.category}, ${i.location.area})`).join(', ')}...
                
                FULL ACTIVE JOBS LIST:
                ${JSON.stringify(JOBS.map(j => ({
                    role: j.role,
                    company: j.company,
                    location: j.location,
                    salary: j.salary,
                    requirements: j.requirements
                })), null, 2)}
                `;

                result = await performIntelligentSearch(searchQuery, contextSummary);
            }

            const filters = result.filters;

            // Refined Filtering Logic
            const filteredInsts = INSTITUTIONS.filter(inst => {
                let matches = true;

                // Type Filter (Company vs Education)
                if (filters.type) {
                    const isCompany = inst.category === 'Company' || inst.type === 'Private'; // Simplified check
                    if (filters.type === 'Company' && !isCompany) matches = false;
                    if (filters.type === 'Education' && isCompany) matches = false;
                }

                // Skill Filter
                if (filters.skills?.length) {
                    const skillMatch = filters.skills.some((skill: string) =>
                        (inst.domains && Object.keys(inst.domains).some(d => d.toLowerCase().includes(skill.toLowerCase()))) ||
                        inst.programs?.some(p => p.name.toLowerCase().includes(skill.toLowerCase())) ||
                        inst.specializations?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
                    );
                    if (!skillMatch) matches = false;
                }

                // Location Filter
                if (filters.location) {
                    const locMatch = inst.location.address.toLowerCase().includes(filters.location.toLowerCase()) ||
                        inst.location.taluk.toLowerCase().includes(filters.location.toLowerCase());
                    if (!locMatch) matches = false;
                }

                // Category Filter
                if (filters.category) {
                    if (inst.category.toLowerCase() !== filters.category.toLowerCase()) matches = false;
                }

                return matches;
            });

            const filteredJobs = JOBS.filter(job => {
                let matches = true;

                // Skill Filter
                if (filters.skills?.length) {
                    const skillMatch = filters.skills.some((skill: string) =>
                        job.role.toLowerCase().includes(skill.toLowerCase()) ||
                        job.requirements.toLowerCase().includes(skill.toLowerCase()) ||
                        job.company.toLowerCase().includes(skill.toLowerCase())
                    );
                    if (!skillMatch) matches = false;
                } else {
                    // Fallback: If no skills extracted, but we have a query, 
                    // ensuring we don't return EVERYTHING for a specific query.
                    // We check if the query keywords match the job.
                    const searchTerms = searchQuery.toLowerCase().split(' ').filter(t => t.length > 2);
                    if (searchTerms.length > 0) {
                        const jobText = `${job.role} ${job.company} ${job.requirements} ${job.location}`.toLowerCase();
                        // If the query is specific (e.g. "AI jobs"), acts as a filter.
                        // If at least one significant term matches, we keep it. 
                        // But if NONE match, we exclude it.
                        const someTermMatches = searchTerms.some(term => jobText.includes(term));
                        if (!someTermMatches) matches = false;
                    }
                }

                // Location Filter (Added)
                if (filters.location) {
                    const locMatch = job.location.toLowerCase().includes(filters.location.toLowerCase());
                    if (!locMatch) matches = false;
                }

                return matches;
            });

            setAiResponse({
                thoughtProcess: result.thoughtProcess,
                answer: result.answer,
                recommendedView: result.recommendedView,
                filters: result.filters,
                data: {
                    institutions: filteredInsts,
                    jobs: filteredJobs
                }
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        executeSearch(query, false);
    };

    const handlePresetClick = (presetText: string) => {
        setQuery(presetText);
        executeSearch(presetText, true);
    };

    // --- Dynamic Widget Rendering ---
    const renderWidget = () => {
        if (!aiResponse) return null;
        const { recommendedView, data } = aiResponse;

        // 1. Skill Gap View
        if (recommendedView === 'skill_gap') {
            return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="flex items-center gap-2 font-semibold mb-6 text-purple-600">
                            <Target size={20} /> Skill Supply vs Demand
                        </h3>
                        <div className="h-[200px] flex items-end justify-center gap-8">
                            <div className="w-24 flex flex-col items-center gap-2 group">
                                <div className="text-sm font-bold text-slate-500">Demand</div>
                                <div className="w-full bg-purple-100 rounded-t-xl relative transition-all duration-500 hover:bg-purple-200" style={{ height: '180px' }}>
                                    <div className="absolute bottom-0 w-full bg-purple-600 rounded-t-xl flex items-center justify-center text-white font-bold" style={{ height: '80%' }}>High</div>
                                </div>
                            </div>
                            <div className="w-24 flex flex-col items-center gap-2 group">
                                <div className="text-sm font-bold text-slate-500">Supply</div>
                                <div className="w-full bg-slate-100 rounded-t-xl relative transition-all duration-500 hover:bg-slate-200" style={{ height: '180px' }}>
                                    <div className="absolute bottom-0 w-full bg-slate-400 rounded-t-xl flex items-center justify-center text-white font-bold" style={{ height: '30%' }}>Low</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-4">
                            Critical shortage detected in <b>{aiResponse.filters.skills[0] || 'Target'}</b> domain.
                        </p>
                    </div>
                </div>
            );
        }

        // 2. Job Market / Company View
        if (recommendedView === 'jobs' || recommendedView === 'market_analysis') {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="flex items-center gap-2 font-semibold mb-4 text-emerald-600">
                                <Briefcase size={18} /> Market Opportunities
                            </h3>
                            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                                {data.jobs.length} <span className="text-sm font-normal text-slate-500">Active Roles</span>
                            </div>
                            <p className="text-xs text-slate-400">Matching your specific criteria</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="flex items-center gap-2 font-semibold mb-4 text-blue-600">
                                <Building2 size={18} /> Key Companies
                            </h3>
                            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                                {data.institutions.filter(i => i.category === 'Company').length} <span className="text-sm font-normal text-slate-500">Identified</span>
                            </div>
                            <p className="text-xs text-slate-400">Hiring or operating in this domain</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                            <h3 className="font-semibold text-sm">Relevant Openings & Companies</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[300px] overflow-y-auto">
                            {data.jobs.slice(0, 5).map((job, idx) => (
                                <div key={idx} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">{job.role}</h4>
                                        <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600">{job.salary}</span>
                                </div>
                            ))}
                            {data.jobs.length === 0 && (
                                <div className="p-4 text-center text-slate-400 text-sm">No specific job listings found.</div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // 3. Default: Educational/Institutional View
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="flex items-center gap-2 font-semibold mb-4 text-blue-600">
                            <Users size={18} /> Education Providers
                        </h3>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                            {data.institutions.filter(i => i.category !== 'Company').length} <span className="text-sm font-normal text-slate-500">Institutions</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="flex items-center gap-2 font-semibold mb-4 text-purple-600">
                            <Target size={18} /> Skill Distribution
                        </h3>
                        <div className="h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.institutions.slice(0, 5)}>
                                    <Bar dataKey="placement.rate" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                        <h3 className="font-semibold text-sm">Top Matched Institutions</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[300px] overflow-y-auto">
                        {data.institutions.slice(0, 5).map(inst => (
                            <div key={inst.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">{inst.name}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <MapPin size={10} /> {inst.location.address}
                                    </p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full ${inst.category === 'Company' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {inst.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Search Header */}
            <div className="bg-white dark:bg-slate-800 p-8 shadow-sm text-center shrink-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    DC Intelligence Search
                </h1>
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask anything (e.g., 'Find AI talent in Mangaluru colleges')"
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/50 outline-none text-lg shadow-inner"
                    />
                    <Search className="absolute left-5 top-5 text-slate-400" size={20} />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-2 bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                    </button>

                    {/* Preset Suggestions */}
                    {!loading && !aiResponse && (
                        <div className="mt-6 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                            {PRESET_QUERIES.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handlePresetClick(preset.text)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 text-sm rounded-full transition-all border border-transparent hover:border-blue-200"
                                >
                                    <Sparkles size={14} className="opacity-50" />
                                    {preset.text}
                                </button>
                            ))}
                        </div>
                    )}
                </form>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="max-w-5xl mx-auto p-6 space-y-6">

                    {/* 1. Thinking Process (Collapsible) */}
                    {(loading || aiResponse) && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
                            <button
                                onClick={() => setShowThoughts(!showThoughts)}
                                className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className={loading ? "animate-pulse text-purple-500" : "text-purple-500"} />
                                    <span>{loading ? "Analyzing request & selecting tools..." : "Analysis Chain"}</span>
                                </div>
                                {showThoughts ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {showThoughts && (
                                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="space-y-2 mt-2">
                                        {loading ? (
                                            <div className="space-y-2">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                                            </div>
                                        ) : (
                                            aiResponse?.thoughtProcess.map((step, idx) => (
                                                <div key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                                                    <span className="text-slate-400 font-mono text-xs mt-0.5">{idx + 1}.</span>
                                                    <span>{step}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {aiResponse && (
                        <>
                            {/* 2. AI Text Answer */}
                            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                                    <Bot className="text-white" size={20} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed max-w-3xl">
                                    <p>{aiResponse.answer}</p>
                                </div>
                            </div>

                            {/* 3. Generated Dashboard Widget */}
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 mt-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-14">
                                    <LayoutDashboard size={14} />
                                    Generated Dashboard View: <span className="text-primary">{aiResponse.recommendedView.replace('_', ' ')}</span>
                                </div>

                                <div className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    {renderWidget()}

                                    {/* Action Bar */}
                                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700/50 pt-4">
                                        <button
                                            onClick={() => onNavigate('dashboard', 'overview')}
                                            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                                        >
                                            View Full Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (aiResponse.recommendedView === 'jobs' || aiResponse.recommendedView === 'market_analysis') onNavigate('dashboard', 'industry');
                                                else if (aiResponse.recommendedView === 'skill_gap') onNavigate('dashboard', 'skills');
                                                else onNavigate('dashboard', 'streams');
                                            }}
                                            className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                        >
                                            Deep Dive into {aiResponse.recommendedView.split('_')[0]} <ExternalLink size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!aiResponse && !loading && (
                        <div className="text-center text-slate-400 py-20 opacity-50">
                            <Bot size={48} className="mx-auto mb-4" />
                            <p>Ask me about education, skills, or companies in DK.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
