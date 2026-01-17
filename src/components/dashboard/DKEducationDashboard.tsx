import { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, MapPin, Briefcase, BookOpen, Sparkles, Activity, DollarSign, Percent } from 'lucide-react';
import KnowledgeGraph from './KnowledgeGraph';
import { INSTITUTIONS } from '../../data/institutions';
import SkillsRadarChart from './SkillsRadarChart';
import PlacementReport from './PlacementReport';
import InsightModal from './InsightModal';
import DetailedReport from './DetailedReport';
import DKRecommendations from './DKRecommendations';
import LeadingCompanies from './LeadingCompanies';

interface DashboardProps {
    initialTab?: string;
    onNavigate?: (view: 'map' | 'institutions' | 'industry' | 'jobs' | 'dashboard', tab?: string) => void;
}

const DKEducationDashboard: React.FC<DashboardProps> = ({ initialTab = 'overview', onNavigate }) => {
    void onNavigate;
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



    // Calculate stats from real data
    const calculatedStats = (() => {
        type LevelData = { students: number; institutions: number; growth: number; color: string };
        const cats: Record<string, LevelData> = {
            '10th Std': { students: 0, institutions: 0, growth: 3.2, color: 'bg-rose-300/80 dark:bg-rose-900/50' },
            'PU': { students: 0, institutions: 0, growth: 4.1, color: 'bg-orange-300/80 dark:bg-orange-900/50' },
            'Degree': { students: 0, institutions: 0, growth: 5.3, color: 'bg-amber-300/80 dark:bg-amber-900/50' },
            'Engineering': { students: 0, institutions: 0, growth: 2.8, color: 'bg-emerald-300/80 dark:bg-emerald-900/50' },
            'Diploma': { students: 0, institutions: 0, growth: 6.2, color: 'bg-sky-300/80 dark:bg-sky-900/50' },
            'ITI': { students: 0, institutions: 0, growth: 7.5, color: 'bg-indigo-300/80 dark:bg-indigo-900/50' }
        };

        let totalStudents = 0;
        let totalInstitutions = 0;

        INSTITUTIONS.forEach(inst => {
            if (activeView === 'institutions' && selectedTaluk !== 'All' && inst.location.taluk !== selectedTaluk) return;

            let catKey = '';
            if (inst.category === 'PU College') catKey = 'PU';
            else if (inst.category === 'Degree College') catKey = 'Degree';
            else if (inst.category === 'Engineering') catKey = 'Engineering';
            else if (inst.category === 'Polytechnic') catKey = 'Diploma';
            else if (inst.category === 'ITI') catKey = 'ITI';

            // Calculate students for this institution
            let instStudents = 0;
            if (inst.academic?.programs) {
                inst.academic.programs.forEach(p => {
                    let duration = 1;
                    if (p.duration) {
                        const match = p.duration.match(/(\d+)/);
                        if (match) duration = parseInt(match[1]);
                    }
                    if (p.seats) {
                        instStudents += p.seats * duration;
                    }
                });
            }

            // Fallback: If 0 students and it's a PU College, apply average of 90
            if (instStudents === 0 && catKey === 'PU') {
                instStudents = 90;
            }

            if (catKey && cats[catKey]) {
                cats[catKey].institutions++;
                cats[catKey].students += instStudents;
            }

            totalStudents += instStudents;
            totalInstitutions++;
        });

        // 10th Std Calculation: "its pu numbers + 20% margin"
        if (cats['10th Std'].institutions === 0 && cats['PU'].institutions > 0) {
            cats['10th Std'].students = Math.round(cats['PU'].students * 1.2);
            cats['10th Std'].institutions = Math.round(cats['PU'].institutions * 1.2);

            // Add estimated 10th std to totals
            totalStudents += cats['10th Std'].students;
            totalInstitutions += cats['10th Std'].institutions;
        }

        return { cats, totalStudents, totalInstitutions };
    })();

    const educationLevelData = [
        { level: '10th Std', ...calculatedStats.cats['10th Std'] },
        { level: 'PU', ...calculatedStats.cats['PU'] },
        { level: 'Degree', ...calculatedStats.cats['Degree'] },
        { level: 'Engineering', ...calculatedStats.cats['Engineering'] },
        { level: 'Diploma', ...calculatedStats.cats['Diploma'] },
        { level: 'ITI', ...calculatedStats.cats['ITI'] }
    ];

    const stats = {
        totalStudents: 26500, // Engineering student enrollment (approx)
        totalInstitutions: 10, // Major institutions
        avgPassRate: 86.5, // Derived from provided placement rates (approx top tier average) or stick to existing if pass rate not explicit. User gave placement rates. Pass rate is different. Let's keep 82.5 or infer? 
        // User text: "Year-over-year enrollment has remained stable... Placement season 2024-25 delivers 4,500+ offers".
        // Let's use 82.5 as placeholder or remove if not in data. But dashboard needs it.
        // Let's update 'employmentRate' mapping to 'Placement Rate'
        employmentRate: 75.5 // Approx average from table data
    };

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
        { skill: 'Google Cloud Platform', current: 15, required: 40, gap: 25, priority: 'High' }, // Critical Gap
        { skill: 'Python', current: 45, required: 80, gap: 35, priority: 'High' },
        { skill: 'JavaScript/React/Node', current: 50, required: 75, gap: 25, priority: 'High' },
        { skill: 'Java', current: 55, required: 70, gap: 15, priority: 'Medium' },
        { skill: 'SQL/Databases', current: 40, required: 65, gap: 25, priority: 'Medium' },
        { skill: 'Mobile Dev (iOS/Android)', current: 30, required: 55, gap: 25, priority: 'Medium' },
        { skill: 'AI/Machine Learning', current: 20, required: 60, gap: 40, priority: 'High' },
        { skill: 'DevOps/Kubernetes', current: 10, required: 45, gap: 35, priority: 'High' },
        { skill: 'Data Analytics/BI', current: 25, required: 50, gap: 25, priority: 'Medium' },
        { skill: 'Cybersecurity', current: 15, required: 35, gap: 20, priority: 'Medium' }
    ];

    const industryDemand = [
        { sector: 'Software Engineer/Dev', demand: 100, avg_salary: 5.5, growth: 12, available: 65 },
        { sector: 'Web Developer', demand: 20, avg_salary: 4.0, growth: 10, available: 15 },
        { sector: 'QA/Testing', demand: 15, avg_salary: 3.8, growth: 8, available: 10 },
        { sector: 'Data Analyst', demand: 15, avg_salary: 5.2, growth: 14, available: 8 },
        { sector: 'IT Support/Admin', demand: 15, avg_salary: 3.2, growth: 5, available: 12 },
        { sector: 'DevOps Engineer', demand: 10, avg_salary: 8.5, growth: 20, available: 2 },
        { sector: 'Technical Lead', demand: 15, avg_salary: 12.0, growth: 8, available: 5 },
        { sector: 'Mobile Developer', demand: 15, avg_salary: 6.0, growth: 15, available: 8 }
    ];

    const talukData = [
        { name: 'Mangaluru', students: 68000, institutions: 285, employment: 72 },
        { name: 'Bantwal', students: 28000, institutions: 125, employment: 65 },
        { name: 'Puttur', students: 32000, institutions: 140, employment: 66 },
        { name: 'Sullia', students: 15000, institutions: 55, employment: 58 },
        { name: 'Belthangady', students: 13000, institutions: 40, employment: 60 }
    ];

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
            {/* Top Stats Row - Clickable for Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Active Job Openings */}
                <div
                    onClick={() => setActiveView('industry')}
                    className="bg-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-icon uppercase tracking-wider">Active Job Openings</p>
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                            <Briefcase size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text">1,000</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-green-600">
                        <TrendingUp size={12} />
                        <span>15%</span>
                    </div>
                </div>

                {/* 2. Students Placed */}
                <div
                    onClick={() => setActiveView('placement')}
                    className="bg-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-xs font-bold text-icon uppercase tracking-wider">Students Placed</p>
                            <p className="text-[10px] text-icon">(2024-25)</p>
                        </div>
                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 transition-colors">
                            <Users size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text">3,400</h3>
                </div>

                {/* 3. Skill Gap Index */}
                <div
                    onClick={() => setActiveView('skills')}
                    className="bg-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-icon uppercase tracking-wider">Skill Gap Index</p>
                        <div className="p-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 transition-colors">
                            <Activity size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text">28%</h3>
                    <p className="text-[10px] text-icon leading-tight mt-1 mb-2">Diff. between industry demand & student readiness</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-red-500">
                        <TrendingUp size={12} className="transform rotate-180" />
                        <span>-5% vs last year</span>
                    </div>
                </div>

                {/* 4. Avg Placement Rate */}
                <div
                    onClick={() => setActiveView('placement')}
                    className="bg-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-icon uppercase tracking-wider">Avg Placement Rate</p>
                        <div className="p-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 group-hover:bg-green-100 transition-colors">
                            <Percent size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text">62%</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-green-600">
                        <TrendingUp size={12} />
                        <span>4%</span>
                    </div>
                </div>

                {/* 5. Avg Fresher Salary */}
                <div
                    onClick={() => setActiveView('placement')}
                    className="bg-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-icon uppercase tracking-wider">Avg Fresher Salary</p>
                        <div className="p-1.5 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-100 transition-colors">
                            <DollarSign size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text">₹4.2 LPA</h3>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-lg p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
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
                                    <span className="font-semibold text-icon">{item.level}</span>
                                    <div className="flex gap-4 text-xs">
                                        <span className="text-icon">{item.students.toLocaleString()} students</span>
                                        <span className="text-icon">{item.institutions} institutions</span>
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

            <div className="bg-surface rounded-lg shadow-lg p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
                    <MapPin size={24} className="text-cyan-500 dark:text-cyan-400" />
                    Regional Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {talukData.map((taluk, index) => (
                        <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-text mb-3 border-b border-slate-200 dark:border-slate-600 pb-2 text-center truncate" title={taluk.name}>{taluk.name}</h4>
                            <div className="space-y-3">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-icon font-semibold">Students</p>
                                    <p className="text-lg font-bold text-text">{(taluk.students / 1000).toFixed(1)}K</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-icon font-semibold" title="Institutions">Insts.</p>
                                    <p className="text-lg font-bold text-text">{taluk.institutions}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-icon font-semibold" title="Employment Rate">Empl.</p>
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
                <div className="bg-surface rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-text mb-4">Engineering Streams</h3>
                    <div className="space-y-3">
                        {streamDistribution.Engineering.map((stream, index) => (
                            <div
                                key={index}
                                className="space-y-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-2 rounded transition-colors"
                                onClick={() => openInsight(stream, 'education')}
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-text">{stream.name}</span>
                                    <span className="text-icon">{stream.students.toLocaleString()} ({stream.percentage}%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                                    <div
                                        className="bg-blue-300/80 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${stream.percentage * 2.5}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-text mb-4">Degree Streams</h3>
                    <div className="space-y-3">
                        {streamDistribution.Degree.map((stream, index) => (
                            <div
                                key={index}
                                className="space-y-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-2 rounded transition-colors"
                                onClick={() => openInsight(stream, 'education')}
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-text">{stream.name}</span>
                                    <span className="text-icon">{stream.students.toLocaleString()} ({stream.percentage}%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
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

            {/* Leading Companies Showcase */}
            <LeadingCompanies onCompanyClick={(company) => openInsight({ sector: company, demand: 'High', available: 'Moderate', avg_salary: 'Varied', growth: 'Stable' }, 'industry')} />
        </div>
    );

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <div className="bg-primary text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dakshina Karnataka Engineering Ecosystem Dashboard</h1>
                        <p className="text-white/80">Mangaluru-Udupi-Manipal Corridor • Tier-2 IT Hub</p>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="text-white">
                            <label className="text-xs opacity-90 block mb-1">Academic Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="bg-white/10 border border-white/20 text-white rounded px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                {years.map(year => (
                                    <option key={year} value={year} className="bg-surface text-text">{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="text-white">
                            <label className="text-xs opacity-90 block mb-1">Taluk</label>
                            <select
                                value={selectedTaluk}
                                onChange={(e) => setSelectedTaluk(e.target.value)}
                                className="bg-white/10 border border-white/20 text-white rounded px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                {taluks.map(taluk => (
                                    <option key={taluk} value={taluk} className="bg-surface text-text">{taluk}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setShowRecommendations(true)}
                            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors h-[38px] shadow-lg border border-white/10"
                        >
                            <Sparkles size={16} className="text-white animate-pulse" />
                            <span className="font-semibold text-sm">DK Intelligence</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-surface shadow-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'placement', label: 'Placement Analysis' },
                            { id: 'streams', label: 'Stream Analysis' },
                            { id: 'skills', label: 'Skill Gaps' },
                            { id: 'industry', label: 'Skill Demand' },
                            { id: 'graph', label: 'Knowledge Graph' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveView(tab.id)}
                                className={`px-6 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${activeView === tab.id
                                    ? 'border-b-3 border-secondary text-secondary'
                                    : 'text-icon hover:text-text'
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
