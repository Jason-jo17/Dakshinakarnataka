import React, { useMemo } from 'react';
import { Plus, Calendar, Users, BarChart2, PlayCircle, CheckCircle, Activity } from 'lucide-react';

// --- Local UI Components ---
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 pb-3 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '', ...props }: any) => (
    <h3 className={`font-bold text-slate-900 dark:text-white ${className}`} {...props}>
        {children}
    </h3>
);

const CardDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-slate-950";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600",
        outline: "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
    };
    return (
        <button className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Badge = ({ children, variant = 'default', className = '' }: any) => {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    const variants = {
        default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        outline: "text-slate-500 border-slate-200 dark:border-slate-700"
    };
    return (
        <div className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}>
            {children}
        </div>
    );
};

const Progress = ({ value, className = '' }: { value: number, className?: string }) => (
    <div className={`relative w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700 ${className}`}>
        <div
            className="h-full w-full flex-1 bg-slate-900 dark:bg-slate-100 transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
);

// --- Helper Components ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Live: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Completed: "bg-slate-100 text-slate-700 border-slate-200",
        Scheduled: "bg-blue-100 text-blue-700 border-blue-200"
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-bold rounded border ${styles[status as keyof typeof styles] || styles.Completed}`}>
            {status}
        </span>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-start">
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            {trend && (
                <p className={`text-xs font-medium mt-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                </p>
            )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400`}>
            <Icon size={20} />
        </div>
    </div>
);


// ... imports
import { useState } from 'react';
import { INSTITUTIONS } from '../../data/institutions';
import { X } from 'lucide-react';

// ... existing components (Card, etc)

export default function AssessmentsView() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data state to allow adding new assessments visually
    const [assessments, setAssessments] = useState([
        {
            id: 1,
            title: 'District Tech Aptitude 2023',
            status: 'Live',
            type: 'Technical',
            start_date: '2023-11-15',
            completion_percentage: 85,
            participating_institutions: 12
        },
        // ... other mock items
        {
            id: 2,
            title: 'Employability Basics',
            status: 'Completed',
            type: 'Employability',
            start_date: '2023-10-01',
            completion_percentage: 100,
            participating_institutions: 8
        },
        {
            id: 3,
            title: 'Digital Literacy Drive',
            status: 'Scheduled',
            type: 'Digital Skills',
            start_date: '2024-01-20',
            completion_percentage: 0,
            participating_institutions: 15
        },
        {
            id: 4,
            title: 'AI Readiness Assessment',
            status: 'Live',
            type: 'Technical',
            start_date: '2023-12-01',
            completion_percentage: 45,
            participating_institutions: 5
        }
    ]);

    const [newAssessment, setNewAssessment] = useState({
        type: 'Skill Set',
        location: '',
        candidateType: 'Student',
        startDate: '',
        endDate: ''
    });

    const handleLaunch = (e: React.FormEvent) => {
        e.preventDefault();
        // Add to list
        const newItem = {
            id: assessments.length + 1,
            title: `${newAssessment.type} Assessment - ${newAssessment.location}`,
            status: 'Scheduled',
            type: newAssessment.type,
            start_date: newAssessment.startDate,
            completion_percentage: 0,
            participating_institutions: 1
        };
        setAssessments([newItem, ...assessments]);
        setIsModalOpen(false);
    };

    const isLoading = false;

    const stats = useMemo(() => {
        const total = assessments.length;
        const active = assessments.filter(a => a.status === 'Live').length;
        const avgCompletion = total ? Math.round(assessments.reduce((acc, curr) => acc + (curr.completion_percentage || 0), 0) / total) : 0;
        // Use real total participants if available, else sum mock
        const participants = assessments.reduce((acc, curr) => acc + (curr.participating_institutions || 0), 0) * 45; // Approx 45 students per inst
        return { total, active, avgCompletion, participants };
    }, [assessments]);

    // Unique Locations for Dropdown
    const uniqueLocations = useMemo(() => {
        const locs = new Set(INSTITUTIONS.map(i => i.location.district || 'Dakshina Kannada'));
        const areas = new Set(INSTITUTIONS.map(i => i.location.area || 'Unknown'));
        return [...Array.from(locs), ...Array.from(areas)].sort();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Launch New Assessment</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleLaunch} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assessment Type</label>
                                <select
                                    className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newAssessment.type}
                                    onChange={e => setNewAssessment({ ...newAssessment, type: e.target.value })}
                                >
                                    <option value="Skill Set">Skill Set</option>
                                    <option value="Tool Set">Tool Set</option>
                                    <option value="Mindset">Mindset</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Location</label>
                                <select
                                    className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newAssessment.location}
                                    onChange={e => setNewAssessment({ ...newAssessment, location: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Area --</option>
                                    {uniqueLocations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Candidate Type</label>
                                <select
                                    className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newAssessment.candidateType}
                                    onChange={e => setNewAssessment({ ...newAssessment, candidateType: e.target.value })}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Faculty">Faculty</option>
                                    <option value="Employee">Employee</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newAssessment.startDate}
                                        onChange={e => setNewAssessment({ ...newAssessment, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newAssessment.endDate}
                                        onChange={e => setNewAssessment({ ...newAssessment, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Launch Assessment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Assessments</h1>
                    <p className="text-slate-500 dark:text-slate-400">Create, track and manage district-wide assessments.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Launch New Assessment
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Assessments" value={stats.total} icon={BarChart2} color="blue" />
                <StatCard title="Live Now" value={stats.active} icon={Activity} color="green" trend="up" trendValue={`${stats.active} Active`} />
                <StatCard title="Avg Completion" value={`${stats.avgCompletion}%`} icon={CheckCircle} color="purple" />
                <StatCard title="Total Participants" value={stats.participants.toLocaleString()} icon={Users} color="orange" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>Loading assessments...</div>
                ) : assessments.map((assessment) => (
                    <Card key={assessment.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <StatusBadge status={assessment.status} />
                                <Badge variant="outline">{assessment.type}</Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-1" title={assessment.title}>{assessment.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Calendar size={14} />
                                Start Date: {new Date(assessment.start_date || Date.now()).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Completion</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{assessment.completion_percentage}%</span>
                                </div>
                                <Progress value={assessment.completion_percentage} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-2">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                        <Users size={12} /> Participating
                                    </div>
                                    <div className="font-semibold text-lg text-slate-900 dark:text-white text-center">{assessment.participating_institutions}</div>
                                    <div className="text-[10px] text-slate-400 text-center uppercase tracking-wider">Institutions</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                        <BarChart2 size={12} /> Avg Score
                                    </div>
                                    <div className="font-semibold text-lg text-slate-900 dark:text-white text-center">
                                        {assessment.status === 'Scheduled' ? '-' : '72%'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 text-center uppercase tracking-wider">Points</div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {assessment.status === 'Scheduled' ? (
                                <Button className="w-full" variant="outline">
                                    <PlayCircle size={16} className="mr-2" />
                                    Start Now
                                </Button>
                            ) : (
                                <Button className="w-full" variant="outline">
                                    View Detailed Report
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
