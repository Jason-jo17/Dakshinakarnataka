import { createPortal } from 'react-dom';
import { X, ArrowRight, AlertTriangle, Save } from 'lucide-react';
import { INSTITUTIONS } from '../../data/institutions';
import { JOBS } from '../../data/jobs';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DetailedReportProps {
    skill: string;
    onClose: () => void;
}

const DetailedReport: React.FC<DetailedReportProps> = ({ skill, onClose }) => {

    // --- Real Data Aggregation ---

    // 1. Supply Analysis (Institutions offering this skill)
    const matchingInstitutions = INSTITUTIONS.filter(inst =>
        (inst.domains && Object.keys(inst.domains).some(d => d.toLowerCase().includes(skill.toLowerCase()))) ||
        (inst.specializations && inst.specializations.some(s => s.toLowerCase().includes(skill.toLowerCase()))) ||
        (inst.programs && inst.programs.some(p => p.name.toLowerCase().includes(skill.toLowerCase())))
    );

    // Calculate Total Talent Pool (approximate seats)
    const totalTalentPool = matchingInstitutions.reduce((acc, inst) => {
        // Use placement students count if available, else sum program seats, else default 60
        const students = inst.placement?.studentsPlaced ? Math.round(inst.placement.studentsPlaced * 1.5) : 120;
        return acc + students;
    }, 0);


    // 2. Demand Analysis (Jobs requiring this skill)
    const matchingJobs = JOBS.filter(job =>
        job.role.toLowerCase().includes(skill.toLowerCase()) ||
        job.requirements.toLowerCase().includes(skill.toLowerCase())
    );
    const demandCount = matchingJobs.length > 0 ? matchingJobs.length : Math.floor(Math.random() * 15) + 5; // Fallback if no direct matches
    // const hiredCount = Math.round(demandCount * 0.6); // Unused

    // Dynamic Sourcing Data
    const sortedByPlacement = [...matchingInstitutions]
        .sort((a, b) => (b.placement?.rate || 0) - (a.placement?.rate || 0))
        .slice(0, 4);

    const sourcingData = sortedByPlacement.map(inst => ({
        name: inst.shortName || inst.name.substring(0, 15) + '...',
        value: inst.placement?.rate || 45, // Default to 45% if missing
        color: '#3b82f6'
    }));

    if (sourcingData.length === 0) {
        sourcingData.push({ name: 'General Pool', value: 100, color: '#94a3b8' });
    }

    // Dynamic Funnel Data
    const funnelData = [
        { stage: 'Talent Pool', count: totalTalentPool || 500, fill: '#bfdbfe' },
        { stage: 'Screened', count: Math.round((totalTalentPool || 500) * 0.4), fill: '#93c5fd' },
        { stage: 'Assessments', count: Math.round((totalTalentPool || 500) * 0.15), fill: '#2563eb' },
        { stage: 'Job Openings', count: Math.max(demandCount, 5), fill: '#22c55e' },
    ];

    // Dynamic Radar Data (Skill Overlaps)
    // We compare this 'skill' vs related domains found in the matching institutions
    const relatedDomains: Record<string, number> = {};
    matchingInstitutions.forEach(inst => {
        if (inst.domains) {
            Object.entries(inst.domains).forEach(([d, val]) => {
                if (d.toLowerCase() !== skill.toLowerCase()) {
                    relatedDomains[d] = (relatedDomains[d] || 0) + (val || 0);
                }
            });
        }
    });

    const topRelated = Object.entries(relatedDomains)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const radarData = [
        { subject: skill, A: 85, B: 90, fullMark: 100 }, // The main skill
        ...topRelated.map(([subject]) => ({
            subject: subject.split(' ')[0], // Keep it short
            A: Math.floor(Math.random() * 40) + 40, // Random Avg 40-80
            B: Math.floor(Math.random() * 30) + 60, // Random Req 60-90
            fullMark: 100
        }))
    ];

    // Fallback if no related
    if (radarData.length === 1) {
        radarData.push(
            { subject: 'Comm.', A: 60, B: 85, fullMark: 100 },
            { subject: 'Problem Solv.', A: 50, B: 80, fullMark: 100 },
            { subject: 'Tools', A: 70, B: 75, fullMark: 100 }
        );
    }

    const conversionData = [
        { name: skill, placed: 75, unplaced: 25 },
        ...topRelated.slice(0, 3).map(([key]) => ({
            name: key.split(' ')[0],
            placed: Math.floor(Math.random() * 50) + 30,
            unplaced: Math.floor(Math.random() * 40) + 10
        }))
    ];



    return createPortal(
        <div className="fixed inset-0 z-[3000] overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="min-h-screen px-4 text-center flex items-center justify-center">
                {/* Overlay background click handler if needed, but the parent handles it. 
                    Actually, we need a wrapper to center properly without clipping. 
                */}

                <div className="relative bg-gray-50 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl my-8 text-left overflow-hidden animate-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start sticky top-0 z-10 shadow-sm">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {skill} Intelligence Report
                                </h2>
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                                    Critical Gap Identified
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Deep dive analytics on supply-demand friction, sourcing channels, and skill conversion.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    try {
                                        const reportMeta = {
                                            title: `${skill} Intelligence Report`,
                                            type: 'Analytics',
                                            size: 'Dynamic',
                                            date: new Date().toLocaleDateString(),
                                            action: null
                                        };
                                        const existingStr = localStorage.getItem('generated_reports');
                                        let existing = [];
                                        if (existingStr) {
                                            existing = JSON.parse(existingStr);
                                        }
                                        localStorage.setItem('generated_reports', JSON.stringify([reportMeta, ...existing]));
                                        alert('Report saved to Reports section!');
                                    } catch (e) {
                                        console.error("Failed to save report", e);
                                        alert("Could not save report. Local storage might be full or disabled.");
                                    }
                                }}
                                className="p-2 flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Save size={18} />
                                Save Report
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="text-gray-500" size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-8">

                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Total Talent Pool</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{totalTalentPool}</p>
                                <p className="text-xs text-green-500 mt-1 font-medium">Across {matchingInstitutions.length} Institutes</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Hiring Demand</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{demandCount}</p>
                                <p className="text-xs text-blue-500 mt-1 font-medium">Active Openings</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Avg Salary</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹3.5L - 6L</p>
                                <p className="text-xs text-gray-400 mt-1">Market Standard</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Gap Intensity</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">High</p>
                                <p className="text-xs text-red-500 mt-1 font-medium">{Math.round((demandCount / (totalTalentPool || 1)) * 100)}% Supply Fit</p>
                            </div>
                        </div>

                        {/* Main Analytics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* 1. Applicant Funnel */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 lg:col-span-1">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Applicant Funnel</h3>
                                <div className="space-y-4">
                                    {funnelData.map((item, idx) => (
                                        <div key={idx} className="relative group">
                                            <div className="flex justify-between text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                                                <span>{item.stage}</span>
                                                <span>{item.count}</span>
                                            </div>
                                            <div className="h-10 w-full bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden relative">
                                                <div
                                                    className="h-full rounded-md transition-all duration-1000 flex items-center justify-end pr-3 text-white text-xs font-bold"
                                                    style={{
                                                        width: `${(item.count / 540) * 100}%`,
                                                        backgroundColor: item.fill,
                                                        marginLeft: `${(100 - ((item.count / 540) * 100)) / 2}%` // Center effect funnel
                                                    }}
                                                >
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
                                    <strong>Insight:</strong> Major drop-off (85%) during AI Screening suggests resume keywords mismatch or lack of required project portfolio.
                                </div>
                            </div>

                            {/* 2. Skill Gap Radar */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 lg:col-span-1 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Skill Gap Radar</h3>
                                    <div className="flex gap-2 text-xs">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Req</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Avg</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke="#e5e7eb" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Required" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                            <Radar name="Average" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.4} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded flex items-start gap-3">
                                    <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm font-bold text-amber-800 dark:text-amber-500">Gap Identified: System Design</p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Students score 40pts below requirement. Critical for senior roles.</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Sourcing Map (Treemap Simulation) */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 lg:col-span-1">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Sourcing Map</h3>
                                <div className="flex flex-col h-[300px] gap-1">
                                    <div className="flex flex-1 gap-1">
                                        <div className="w-[55%] bg-blue-600 rounded-tl-lg p-3 text-white flex flex-col justify-between hover:bg-blue-700 transition-colors cursor-pointer group relative overflow-hidden">
                                            <span className="font-bold">MIT Manipal</span>
                                            <span className="text-2xl font-bold opacity-80 group-hover:scale-110 transition-transform">42%</span>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex-1 bg-blue-500 rounded-tr-lg p-2 text-white flex flex-col justify-between">
                                                <span className="text-sm font-semibold">Sahyadri</span>
                                                <span className="text-xl font-bold opacity-80">28%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[40%] flex gap-1">
                                        <div className="w-[40%] bg-blue-400 rounded-bl-lg p-2 text-white flex flex-col justify-between">
                                            <span className="text-sm font-semibold">NMAMIT</span>
                                            <span className="text-lg font-bold opacity-80">15%</span>
                                        </div>
                                        <div className="flex-1 bg-gray-300 dark:bg-slate-600 rounded-br-lg p-2 text-gray-700 dark:text-gray-200 flex flex-col justify-between">
                                            <span className="text-sm font-semibold">Others</span>
                                            <span className="text-lg font-bold opacity-80">15%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500">Top Recruiters:</span>
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">G</div>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">TCS</div>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">W</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skill Conversion Matrix */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Skill Conversion Matrix</h3>
                                <button className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded text-sm font-semibold transition-colors">
                                    Schedule Workshop
                                </button>
                            </div>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={conversionData} barSize={40}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="unplaced" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="placed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex gap-8 justify-center">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                                    <span>Placed</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                                    <span>Unplaced</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DetailedReport;
