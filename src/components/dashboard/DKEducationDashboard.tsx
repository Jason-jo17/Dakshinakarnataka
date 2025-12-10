import { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, MapPin, GraduationCap, Briefcase, BookOpen, Sparkles } from 'lucide-react';
import KnowledgeGraph from './KnowledgeGraph';
import { INSTITUTIONS } from '../../data/institutions';
import SkillsRadarChart from './SkillsRadarChart';
import PlacementReport from './PlacementReport';
import InsightModal from './InsightModal';
import DetailedReport from './DetailedReport';
import DKRecommendations from './DKRecommendations';

interface DashboardProps {
    initialTab?: string;
    onNavigate?: (view: 'map' | 'institutions' | 'industry' | 'jobs' | 'dashboard', tab?: string) => void;
}

const DKEducationDashboard: React.FC<DashboardProps> = ({ initialTab = 'overview', onNavigate }) => {
    const [activeView, setActiveView] = useState(initialTab);
    const [selectedTaluk, setSelectedTaluk] = useState('All');
    const [selectedYear, setSelectedYear] = useState('2024-25');

    // Effect to update activeView if initialTab changes (for navigation from DC Search)
    useEffect(() => {
        if (initialTab) setActiveView(initialTab);
    }, [initialTab]);
    const [selectedInsight, setSelectedInsight] = useState<{ isOpen: boolean, data: any, type: 'skill' | 'industry' | 'education' | null }>({
        isOpen: false,
        data: null,
        type: null
    });

    // State for Detailed Report
    const [reportConfig, setReportConfig] = useState<{ isOpen: boolean, skill: string }>({
        isOpen: false,
        skill: ''
    });

    // State for Recommendations
    const [showRecommendations, setShowRecommendations] = useState(false);

    const openInsight = (data: any, type: 'skill' | 'industry' | 'education') => {
        setSelectedInsight({ isOpen: true, data, type });
    };

    const closeInsight = () => {
        setSelectedInsight({ ...selectedInsight, isOpen: false });
    };

    const handleViewReport = (skill: string) => {
        setReportConfig({ isOpen: true, skill });
    };

    const closeReport = () => {
        setReportConfig({ ...reportConfig, isOpen: false });
    };

    const taluks = ['All', 'Mangaluru', 'Bantwal', 'Puttur', 'Sullia', 'Belthangady'];
    const years = ['2021-22', '2022-23', '2023-24', '2024-25'];

    const getTalukMultiplier = (taluk: string) => {
        const multipliers: Record<string, number> = {
            'Mangaluru': 1.5, 'Bantwal': 0.9, 'Puttur': 1.0,
            'Sullia': 0.7, 'Belthangady': 0.8, 'All': 1.0
        };
        return multipliers[taluk] || 1.0;
    };

    const getYearMultiplier = (year: string) => {
        const multipliers: Record<string, number> = {
            '2021-22': 0.85, '2022-23': 0.92, '2023-24': 0.97, '2024-25': 1.0
        };
        return multipliers[year] || 1.0;
    };

    const multiplier = getTalukMultiplier(selectedTaluk) * getYearMultiplier(selectedYear);

    const stats = {
        totalStudents: Math.floor(156000 * multiplier),
        totalInstitutions: Math.floor(645 * multiplier),
        avgPassRate: 82.5,
        employmentRate: 68.3
    };

    const educationLevelData = [
        { level: '10th Std', students: Math.floor(45000 * multiplier), institutions: Math.floor(180 * multiplier), growth: 3.2, color: 'bg-rose-300/80' },
        { level: 'PU', students: Math.floor(32000 * multiplier), institutions: Math.floor(125 * multiplier), growth: 4.1, color: 'bg-orange-300/80' },
        { level: 'Degree', students: Math.floor(38000 * multiplier), institutions: Math.floor(85 * multiplier), growth: 5.3, color: 'bg-amber-300/80' },
        { level: 'Engineering', students: Math.floor(28000 * multiplier), institutions: Math.floor(45 * multiplier), growth: 2.8, color: 'bg-emerald-300/80' },
        { level: 'Diploma', students: Math.floor(8500 * multiplier), institutions: Math.floor(35 * multiplier), growth: 6.2, color: 'bg-sky-300/80' },
        { level: 'ITI', students: Math.floor(4500 * multiplier), institutions: Math.floor(28 * multiplier), growth: 7.5, color: 'bg-indigo-300/80' }
    ];

    const streamDistribution = {
        'Engineering': [
            { name: 'Computer Science', students: 9800, percentage: 35 },
            { name: 'Electronics', students: 5600, percentage: 20 },
            { name: 'Mechanical', students: 4760, percentage: 17 },
            { name: 'Civil', students: 3920, percentage: 14 },
            { name: 'Information Science', students: 2520, percentage: 9 },
            { name: 'Electrical', students: 1400, percentage: 5 }
        ],
        'Degree': [
            { name: 'B.Com', students: 12920, percentage: 34 },
            { name: 'B.Sc', students: 10640, percentage: 28 },
            { name: 'BA', students: 9120, percentage: 24 },
            { name: 'BBA', students: 3420, percentage: 9 },
            { name: 'BCA', students: 1900, percentage: 5 }
        ]
    };

    const skillGapData = [
        { skill: 'Programming', current: 42, required: 85, gap: 43, priority: 'High' },
        { skill: 'Data Analytics', current: 35, required: 80, gap: 45, priority: 'High' },
        { skill: 'Digital Marketing', current: 38, required: 75, gap: 37, priority: 'High' },
        { skill: 'Communication', current: 55, required: 90, gap: 35, priority: 'Medium' },
        { skill: 'Cloud Computing', current: 28, required: 78, gap: 50, priority: 'High' },
        { skill: 'Soft Skills', current: 60, required: 88, gap: 28, priority: 'Medium' },
        { skill: 'Financial Literacy', current: 45, required: 70, gap: 25, priority: 'Medium' },
        { skill: 'Project Management', current: 40, required: 75, gap: 35, priority: 'Medium' }
    ];

    const industryDemand = [
        { sector: 'IT Services', demand: 3500, avg_salary: 6.5, growth: 18, available: 2100 },
        { sector: 'Manufacturing', demand: 2800, avg_salary: 4.2, growth: 12, available: 1900 },
        { sector: 'Banking & Finance', demand: 1500, avg_salary: 5.8, growth: 8, available: 1100 },
        { sector: 'Healthcare', demand: 1200, avg_salary: 5.2, growth: 15, available: 800 },
        { sector: 'Education', demand: 980, avg_salary: 3.8, growth: 6, available: 750 },
        { sector: 'Retail', demand: 1800, avg_salary: 3.2, growth: 10, available: 1400 },
        { sector: 'Hospitality', demand: 950, avg_salary: 3.5, growth: 14, available: 680 },
        { sector: 'Logistics', demand: 850, avg_salary: 4.0, growth: 16, available: 600 }
    ];

    const talukData = [
        { name: 'Mangaluru', students: 68000, institutions: 285, employment: 72 },
        { name: 'Bantwal', students: 28000, institutions: 125, employment: 65 },
        { name: 'Puttur', students: 32000, institutions: 140, employment: 66 },
        { name: 'Sullia', students: 15000, institutions: 55, employment: 58 },
        { name: 'Belthangady', students: 13000, institutions: 40, employment: 60 }
    ];

    // Calculate Radar Data
    const companies = INSTITUTIONS.filter(i => i.category === 'Company');
    const colleges = INSTITUTIONS.filter(i => i.category !== 'Company');
    const companyCount = companies.length || 1;
    const collegeCount = colleges.length || 1;

    // Helper to normalize/group domains
    const normalizeDomain = (domain: string): string => {
        const d = domain.toLowerCase();
        if (d.includes('software') || d.includes('development') || d.includes('coding')) return 'Software Engineering';
        if (d.includes('ai') || d.includes('data') || d.includes('intelligence') || d.includes('analytics') || d.includes('rpa')) return 'AI & Data Science';
        if (d.includes('embedded') || d.includes('iot') || d.includes('vlsi') || d.includes('wireless') || d.includes('network')) return 'Embedded & IoT';
        if (d.includes('robotics') || d.includes('automation') || d.includes('mechatronics') || d.includes('electric mobility')) return 'Robotics & Automation';
        if (d.includes('chemical') || d.includes('process') || d.includes('material') || d.includes('polymer')) return 'Chemical & Material';
        if (d.includes('bio') || d.includes('health') || d.includes('pharma') || d.includes('medical') || d.includes('food')) return 'Biotech & Healthcare';
        if (d.includes('manufactur') || d.includes('construction') || d.includes('design') || d.includes('mechanic') || d.includes('aeronautical')) return 'Manufacturing & Design';
        return 'Other';
    };

    const companyDemandMap: Record<string, number> = {};
    companies.forEach(c => {
        Object.keys(c.domains || {}).forEach(d => {
            const normalized = normalizeDomain(d);
            if (normalized !== 'Other') {
                companyDemandMap[normalized] = (companyDemandMap[normalized] || 0) + 1;
            }
        });
    });

    const collegeSupplyMap: Record<string, number> = {};
    colleges.forEach(c => {
        Object.keys(c.domains || {}).forEach(d => {
            const normalized = normalizeDomain(d);
            if (normalized !== 'Other') {
                collegeSupplyMap[normalized] = (collegeSupplyMap[normalized] || 0) + 1;
            }
        });
    });

    const radarData = [
        'Software Engineering',
        'AI & Data Science',
        'Embedded & IoT',
        'Robotics & Automation',
        'Manufacturing & Design',
        'Chemical & Material',
        'Biotech & Healthcare'
    ].map(d => ({
        subject: d,
        A: Math.round(((collegeSupplyMap[d] || 0) / collegeCount) * 100), // Student Reality
        B: Math.round(((companyDemandMap[d] || 0) / companyCount) * 100), // Industry Expectation
        fullMark: 100
    }));

    const insights = [
        {
            title: "The Twin-Engine Economy",
            content: "Dakshina Kannada operates on a 'Twin-Engine' model: heavy industrialization (petrochemicals) in the coastal zone and a knowledge economy (IT, Fintech) in the hinterland."
        },
        {
            title: "Petrochemical & Heavy Industry",
            content: "The northern corridor (Panambur, Baikampady) is the industrial backbone. Recruitment is skewed toward core engineering (Chemical, Mechanical). GAT via GATE is a standard entry route."
        },
        {
            title: "IT & Knowledge Economy",
            content: "Mangalore's IT sector has matured from support to product engineering (Robosoft, Novigo). High demand for specific skills like Swift, UiPath, and Cloud Engineering."
        },
        {
            title: "Agro-Industrial Hub (Puttur)",
            content: "Puttur has industrialized agriculture (CAMPCO, Bindu), offering roles blending engineering with food tech and microbiology, reducing migration."
        }
    ];

    const OverviewDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 text-blue-900 dark:text-blue-100 shadow-sm border border-blue-100 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Total Students</p>
                            <h3 className="text-3xl font-bold mt-1">{(stats.totalStudents / 1000).toFixed(1)}K</h3>
                            <p className="text-xs mt-2 font-medium opacity-75">AY {selectedYear}</p>
                        </div>
                        <Users size={40} className="opacity-80" />
                    </div>
                </div>

                <div
                    className="bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6 text-indigo-900 dark:text-indigo-100 shadow-sm border border-indigo-100 dark:border-indigo-700 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    onClick={() => onNavigate?.('institutions')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Institutions</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.totalInstitutions}</h3>
                            <p className="text-xs mt-2 font-medium opacity-75">{selectedTaluk === 'All' ? '5 Taluks' : selectedTaluk}</p>
                        </div>
                        <GraduationCap size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-emerald-50/80 dark:bg-emerald-900/30 backdrop-blur-sm rounded-lg p-6 text-emerald-900 dark:text-emerald-100 shadow-sm border border-emerald-100 dark:border-emerald-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Avg Pass Rate</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.avgPassRate}%</h3>
                            <p className="text-xs mt-2 opacity-75">+2.3% YoY</p>
                        </div>
                        <TrendingUp size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-amber-50/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-lg p-6 text-amber-900 dark:text-amber-100 shadow-sm border border-amber-100 dark:border-amber-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Employment Rate</p>
                            <h3 className="text-3xl font-bold mt-1">{stats.employmentRate}%</h3>
                            <p className="text-xs mt-2 opacity-75">Post-graduation</p>
                        </div>
                        <Briefcase size={40} className="opacity-80" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen size={24} className="text-cyan-500 dark:text-cyan-400" />
                    Student Distribution by Education Level
                </h3>
                <div className="space-y-4">
                    {educationLevelData.map((item, index) => {
                        const maxStudents = Math.max(...educationLevelData.map(d => d.students));
                        const width = (item.students / maxStudents) * 100;
                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">{item.level}</span>
                                    <div className="flex gap-4 text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">{item.students.toLocaleString()} students</span>
                                        <span className="text-gray-600 dark:text-gray-400">{item.institutions} institutions</span>
                                        <span className="text-emerald-600 font-semibold">↑ {item.growth}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                                    <div
                                        className={`${item.color} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                                        style={{ width: `${width}%` }}
                                    >
                                        <span className="text-white text-xs font-semibold">
                                            {((item.students / stats.totalStudents) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin size={24} className="text-cyan-500 dark:text-cyan-400" />
                    Regional Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {talukData.map((taluk, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-slate-600 pb-2 text-center truncate" title={taluk.name}>{taluk.name}</h4>
                            <div className="space-y-3">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Students</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{(taluk.students / 1000).toFixed(1)}K</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold" title="Institutions">Insts.</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{taluk.institutions}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold" title="Employment Rate">Empl.</p>
                                    <p className="text-lg font-bold text-success">{taluk.employment}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const StreamAnalysis = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Engineering Streams</h3>
                    <div className="space-y-3">
                        {streamDistribution.Engineering.map((stream, index) => (
                            <div
                                key={index}
                                className="space-y-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                onClick={() => openInsight(stream, 'education')}
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-gray-700">{stream.name}</span>
                                    <span className="text-gray-600">{stream.students.toLocaleString()} ({stream.percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-300/80 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${stream.percentage * 2.5}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Degree Streams</h3>
                    <div className="space-y-3">
                        {streamDistribution.Degree.map((stream, index) => (
                            <div
                                key={index}
                                className="space-y-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                onClick={() => openInsight(stream, 'education')}
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-gray-700">{stream.name}</span>
                                    <span className="text-gray-600">{stream.students.toLocaleString()} ({stream.percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-rose-300/80 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${stream.percentage * 2.5}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Gender Distribution Across Levels</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {educationLevelData.map((level, index) => {
                        const malePercentage = 52 + (index * 3);
                        const femalePercentage = 100 - malePercentage;
                        return (
                            <div key={index} className="text-center">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">{level.level}</h4>
                                <div className="flex h-32 gap-2 items-end">
                                    <div className="flex-1 bg-blue-600 rounded-t-lg relative group transition-all duration-300 hover:opacity-90" style={{ height: `${malePercentage}%` }}>
                                        <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">{malePercentage}%</span>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            Male: {malePercentage}%
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-pink-400 rounded-t-lg relative group transition-all duration-300 hover:opacity-90" style={{ height: `${femalePercentage}%` }}>
                                        <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">{femalePercentage}%</span>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            Female: {femalePercentage}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-3 text-xs justify-center">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <span className="text-gray-600 font-medium">Male</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                                        <span className="text-gray-600 font-medium">Female</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const SkillGapDashboard = () => (
        <div className="space-y-6">
            {/* Radar Chart Section */}
            <SkillsRadarChart data={radarData} onInsightClick={(data) => openInsight(data, 'skill')} />

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* ... existing Skill Gap Analysis content ... */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Target size={24} className="text-cyan-500" />
                    Skill Gap Analysis
                </h3>
                <div className="space-y-4">
                    {skillGapData.map((skill, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                            {/* ... existing skill item ... */}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-gray-800">{skill.skill}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${skill.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-fuchsia-100 text-fuchsia-600'
                                        }`}>
                                        {skill.priority}
                                    </span>
                                </div>
                                <span className="text-orange-500 font-bold">Gap: {skill.gap}%</span>
                            </div>
                            <div
                                className="space-y-2 cursor-pointer hover:bg-gray-50 p-2 rounded -mx-2 transition-colors"
                                onClick={() => openInsight(skill, 'skill')}
                            >
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Current Proficiency</span>
                                        <span>{skill.current}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-cyan-500/60 h-3 rounded-full"
                                            style={{ width: `${skill.current}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Industry Requirement</span>
                                        <span>{skill.required}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-lime-500 h-3 rounded-full"
                                            style={{ width: `${skill.required}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-cyan-50 rounded-lg shadow-lg p-6 border border-cyan-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Skill Development Recommendations</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">1.</span>
                        <p className="text-gray-700">Prioritize Cloud Computing and Data Analytics training</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">2.</span>
                        <p className="text-gray-700">Establish industry partnerships for Programming workshops</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">3.</span>
                        <p className="text-gray-700">Integrate Communication skills across all levels</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-cyan-600 font-bold">4.</span>
                        <p className="text-gray-700">Create internship programs with local companies</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const IndustryDashboard = () => (
        <div className="space-y-6">
            {/* Insights Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={24} className="text-cyan-600" />
                    Regional Industry Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-cyan-600 mb-2">{insight.title}</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{insight.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* ... existing Industry Hiring Demand ... */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase size={24} className="text-cyan-600" />
                    Industry Hiring Demand
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="text-left p-3 text-sm font-semibold text-gray-700">Sector</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">Demand</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">Available</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">Gap</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">Salary</th>
                                <th className="text-center p-3 text-sm font-semibold text-gray-700">Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {industryDemand.map((industry, index) => {
                                const gap = industry.demand - industry.available;
                                const gapPct = ((gap / industry.demand) * 100).toFixed(0);
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => openInsight(industry, 'industry')}
                                    >
                                        <td className="p-3 font-semibold text-gray-800">{industry.sector}</td>
                                        <td className="p-3 text-center text-gray-700">{industry.demand.toLocaleString()}</td>
                                        <td className="p-3 text-center text-gray-700">{industry.available.toLocaleString()}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${Number(gapPct) > 40 ? 'bg-orange-100 text-orange-600' : 'bg-fuchsia-100 text-fuchsia-600'
                                                }`}>
                                                {gap.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center font-semibold text-lime-600">₹{industry.avg_salary}L</td>
                                        <td className="p-3 text-center text-cyan-600 font-semibold">↑{industry.growth}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ... existing stats grid ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-lime-500/90 backdrop-blur-sm rounded-lg p-6 text-white shadow-lg">
                    <h4 className="text-sm opacity-90 mb-2">Total Job Openings</h4>
                    <p className="text-4xl font-bold">14,580</p>
                    <p className="text-xs mt-2 opacity-75">Across all sectors</p>
                </div>

                <div className="bg-orange-400/90 backdrop-blur-sm rounded-lg p-6 text-white shadow-lg">
                    <h4 className="text-sm opacity-90 mb-2">Talent Shortage</h4>
                    <p className="text-4xl font-bold">5,250</p>
                    <p className="text-xs mt-2 opacity-75">36% gap</p>
                </div>

                <div className="bg-cyan-500/90 backdrop-blur-sm rounded-lg p-6 text-white shadow-lg">
                    <h4 className="text-sm opacity-90 mb-2">Avg Growth</h4>
                    <p className="text-4xl font-bold">12.4%</p>
                    <p className="text-xs mt-2 opacity-75">Year-over-year</p>
                </div>
            </div>

            {/* ... existing Action Plan ... */}
            <div className="bg-cyan-50/50 rounded-lg shadow-lg p-6 border border-cyan-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Action Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/80 rounded p-4">
                        <h4 className="font-semibold text-cyan-600 mb-2">For Academia</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li>• Align curriculum with IT demand</li>
                            <li>• Establish skill labs</li>
                            <li>• Industry interaction sessions</li>
                            <li>• Employability programs</li>
                        </ul>
                    </div>
                    <div className="bg-white/80 rounded p-4">
                        <h4 className="font-semibold text-cyan-600 mb-2">For Industry</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li>• Offer internships</li>
                            <li>• Guest lectures & mentorship</li>
                            <li>• Support infrastructure</li>
                            <li>• Apprenticeship programs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background dark:bg-slate-900 transition-colors duration-300">
            <div className="bg-cyan-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dakshina Kannada District</h1>
                        <p className="text-white/80">Education & Skills Development Dashboard</p>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="text-xs opacity-90 block mb-1">Academic Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-white text-gray-800 dark:bg-slate-800 dark:text-white rounded px-3 py-2 text-sm font-semibold"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs opacity-90 block mb-1">Taluk</label>
                            <select
                                value={selectedTaluk}
                                onChange={(e) => setSelectedTaluk(e.target.value)}
                                className="bg-white text-gray-800 dark:bg-slate-800 dark:text-white rounded px-3 py-2 text-sm font-semibold"
                            >
                                {taluks.map(taluk => (
                                    <option key={taluk} value={taluk}>{taluk}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setShowRecommendations(true)}
                            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors h-[38px]"
                        >
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="font-semibold text-sm">DK Intelligence</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'placement', label: 'Placement Analysis' },
                            { id: 'streams', label: 'Stream Analysis' },
                            { id: 'skills', label: 'Skill Gaps' },
                            { id: 'industry', label: 'Industry Demand' },
                            { id: 'graph', label: 'Knowledge Graph' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${activeView === tab.id
                                    ? 'border-b-3 border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400'
                                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {activeView === 'overview' && <OverviewDashboard />}
                {activeView === 'placement' && <PlacementReport />}
                {activeView === 'streams' && <StreamAnalysis />}
                {activeView === 'skills' && <SkillGapDashboard />}
                {activeView === 'industry' && <IndustryDashboard />}
                {activeView === 'graph' && <KnowledgeGraph />}
            </div>

            {/* Modals */}
            <InsightModal
                isOpen={selectedInsight.isOpen}
                onClose={closeInsight}
                title={selectedInsight.type === 'skill' ? 'Skill Gap Details' : selectedInsight.type === 'industry' ? 'Industry Sector Insights' : 'Education Stream Analytics'}
                data={selectedInsight.data}
                type={selectedInsight.type || 'skill'}
                onViewReport={
                    selectedInsight.type === 'skill'
                        ? () => handleViewReport(selectedInsight.data.skill)
                        : selectedInsight.type === 'industry'
                            ? () => handleViewReport(selectedInsight.data.sector)
                            : undefined
                }
            />

            {reportConfig.isOpen && (
                <DetailedReport
                    skill={reportConfig.skill}
                    onClose={closeReport}
                />
            )}

            {showRecommendations && (
                <DKRecommendations onClose={() => setShowRecommendations(false)} />
            )}

            {showRecommendations && (
                <DKRecommendations onClose={() => setShowRecommendations(false)} />
            )}
        </div >
    );
};

export default DKEducationDashboard;
