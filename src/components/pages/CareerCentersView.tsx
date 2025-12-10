import React, { useMemo } from 'react';
import {
    Building2,
    Users,
    Briefcase,
    Target,
    CheckCircle,
    AlertCircle,
    Globe,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

// Mock Data for GCCs (replacing API call)
const MOCK_GCCS = [
    {
        id: 1,
        name: "TechVision Global GCC",
        sector: "IT/ITES",
        engagement_status: "Active",
        hiring_requirement: 450,
        skill_match_percentage: 85,
        top_roles: "Full Stack Developer, DevOps Engineer, Cloud Architect, Data Scientist",
        required_skill_clusters: "Full Stack Development, Cloud Computing, CI/CD"
    },
    {
        id: 2,
        name: "FinServe Capabilities",
        sector: "BFSI",
        engagement_status: "Active",
        hiring_requirement: 280,
        skill_match_percentage: 92,
        top_roles: "Financial Analyst, Risk Manager, Security Analyst, Compliance Officer",
        required_skill_clusters: "Data Analytics, Financial Modelling, Cyber Security"
    },
    {
        id: 3,
        name: "AutoTech Innovation Hub",
        sector: "Automotive",
        engagement_status: "Active",
        hiring_requirement: 320,
        skill_match_percentage: 78,
        top_roles: "Embedded Engineer, CAD Designer, EV Systems Specialist, QA Engineer",
        required_skill_clusters: "Embedded Systems, CAD/CAM, EV Technology"
    },
    {
        id: 4,
        name: "MediCare Analytics",
        sector: "Healthcare",
        engagement_status: "Needs Follow-up",
        hiring_requirement: 150,
        skill_match_percentage: 65,
        top_roles: "Bioinformatics Analyst, Lab Technician, Data Entry",
        required_skill_clusters: "Bioinformatics, Data Management"
    },
    {
        id: 5,
        name: "Global Engineering R&D",
        sector: "ER&D",
        engagement_status: "Active",
        hiring_requirement: 200,
        skill_match_percentage: 88,
        top_roles: "Mechanical Engineer, Civil Engineer, Structure Analyst",
        required_skill_clusters: "Structural Analysis, Fluid Dynamics"
    }
];

// Reusable Components to mimic shadcn/ui
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 pb-2 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <h3 className={`font-bold text-slate-900 dark:text-white ${className}`}>
        {children}
    </h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 pt-2 ${className}`}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'outline', className?: string }) => {
    const baseStyle = "px-2.5 py-0.5 rounded-md text-xs font-semibold";
    const variants = {
        default: "bg-blue-100 text-blue-800",
        outline: "border border-slate-200 text-slate-600"
    };
    return (
        <span className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

const Button = ({ children, className = '', variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'ghost' }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4 shadow-sm",
        ghost: "hover:bg-slate-100 hover:text-slate-900 h-10 px-4"
    };
    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const Progress = ({ value, className = '', indicatorClassName = '' }: { value: number, className?: string, indicatorClassName?: string }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700 ${className}`}>
        <div
            className={`h-full w-full flex-1 bg-slate-900 transition-all ${indicatorClassName}`}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
);

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: { title: string, value: string | number, icon: any, color: string, trend?: 'up' | 'down' | 'neutral', trendValue?: string }) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color] || 'bg-slate-50 text-slate-600'}`}>
                    <Icon size={20} />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-medium">
                    {trend === 'up' && <TrendingUp size={12} className="text-green-600" />}
                    <span className={trend === 'up' ? 'text-green-600' : 'text-slate-500'}>{trendValue}</span>
                    <span className="text-slate-400 ml-1">vs last year</span>
                </div>
            )}
        </Card>
    );
};


export default function GCC() {
    const gccs = MOCK_GCCS; // Use mock data

    const stats = useMemo(() => {
        const totalGCCs = gccs.length;
        const totalDemand = gccs.reduce((acc, curr) => acc + (curr.hiring_requirement || 0), 0);
        const avgMatch = totalGCCs ? Math.round(gccs.reduce((acc, curr) => acc + (curr.skill_match_percentage || 0), 0) / totalGCCs) : 0;

        // Engagement
        const active = gccs.filter(g => g.engagement_status === 'Active').length;
        const pending = gccs.filter(g => g.engagement_status === 'Needs Follow-up').length;

        // Top Roles aggregation
        const allRoles = gccs.flatMap(g => g.top_roles ? g.top_roles.split(',') : []);
        const roleCounts: Record<string, number> = {};
        allRoles.forEach(r => {
            const role = r.trim();
            if (role) roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
        const topRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(r => r[0]);

        return { totalGCCs, totalDemand, avgMatch, active, pending, topRoles };
    }, [gccs]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Capability Centers (GCC)</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage partnerships, hiring demands, and skill alignment with GCCs.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                    <Building2 className="mr-2 h-4 w-4" />
                    Onboard New GCC
                </Button>
            </div>

            {/* SECTION A: Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total GCCs Mapped"
                    value={stats.totalGCCs}
                    icon={Globe}
                    color="blue"
                />
                <StatCard
                    title="Hiring Demand (Next Year)"
                    value={stats.totalDemand.toLocaleString()}
                    icon={TrendingUp}
                    color="green"
                    trend="up"
                    trendValue="12%"
                />
                <StatCard
                    title="Avg Skill Alignment"
                    value={`${stats.avgMatch}%`}
                    icon={Target}
                    color="purple"
                />
                <StatCard
                    title="Engagement Status"
                    value={`${stats.active} Active`}
                    icon={CheckCircle}
                    color="orange"
                    trend="neutral"
                    trendValue={`${stats.pending} Pending`}
                />
            </div>

            {/* SECTION B: GCC Partner Cards (Grid) */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    Partner Ecosystem
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gccs.map((gcc) => (
                        <Card key={gcc.id} className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{gcc.name}</CardTitle>
                                        <Badge variant="outline" className="mt-1 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                            {gcc.sector}
                                        </Badge>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gcc.engagement_status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        gcc.engagement_status === 'Needs Follow-up' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                        {gcc.engagement_status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-center py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="border-r border-slate-200 dark:border-slate-600">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Hiring Demand</p>
                                        <p className="font-bold text-lg text-slate-900 dark:text-white">{gcc.hiring_requirement}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Skill Match</p>
                                        <p className={`font-bold text-lg ${gcc.skill_match_percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                                            gcc.skill_match_percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600'
                                            }`}>{gcc.skill_match_percentage}%</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Briefcase size={12} /> Top Roles
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {gcc.top_roles && gcc.top_roles.split(',').slice(0, 3).map((role, i) => (
                                            <span key={i} className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-slate-700 dark:text-slate-300 shadow-sm">
                                                {role.trim()}
                                            </span>
                                        ))}
                                        {gcc.top_roles && gcc.top_roles.split(',').length > 3 && (
                                            <span className="text-xs px-2 py-1 text-slate-400">+ {gcc.top_roles.split(',').length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Target size={12} /> Required Skills
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate bg-slate-50 dark:bg-slate-700/30 p-2 rounded">
                                        {gcc.required_skill_clusters}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <button className="w-full py-2.5 flex items-center justify-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg text-sm font-medium transition-all group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 dark:hover:bg-blue-600">
                                    View GCC Dashboard
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Add New Placeholder */}
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-8 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group min-h-[300px]">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Building2 size={32} className="text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Add New Partner</h3>
                        <p className="text-sm text-center mt-2 text-slate-500 max-w-[200px]">Onboard a new Global Capability Center to the district network</p>
                    </div>
                </div>
            </div>

            {/* SECTION C: Insight Cards */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-600" />
                    Strategic Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-red-100 dark:border-red-900/30 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-3">
                            <AlertCircle size={18} /> Skill Shortages
                        </div>
                        <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex justify-between items-center bg-white dark:bg-slate-900/50 p-2 rounded border border-red-50 dark:border-red-900/20">
                                <span>Cloud Security</span>
                                <span className="font-bold text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Critical</span>
                            </li>
                            <li className="flex justify-between items-center bg-white dark:bg-slate-900/50 p-2 rounded border border-red-50 dark:border-red-900/20">
                                <span>Embedded C</span>
                                <span className="font-bold text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">High</span>
                            </li>
                            <li className="flex justify-between items-center bg-white dark:bg-slate-900/50 p-2 rounded border border-red-50 dark:border-red-900/20">
                                <span>German Lang</span>
                                <span className="font-bold text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Med</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-3">
                            <TrendingUp size={18} /> Demand Growth
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium">
                                    <span className="text-slate-700 dark:text-slate-300">Full Stack Dev</span>
                                    <span className="text-green-600 bg-green-50 px-1 rounded">+25%</span>
                                </div>
                                <Progress value={85} className="bg-blue-100 dark:bg-slate-700 h-1.5" indicatorClassName="bg-blue-600" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium">
                                    <span className="text-slate-700 dark:text-slate-300">Data Engineering</span>
                                    <span className="text-green-600 bg-green-50 px-1 rounded">+18%</span>
                                </div>
                                <Progress value={65} className="bg-blue-100 dark:bg-slate-700 h-1.5" indicatorClassName="bg-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-green-100 dark:border-green-900/30 p-4 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-3">
                            <Users size={18} /> Talent Readiness
                        </div>
                        <div className="text-center py-2">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white block mb-1">1,240</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Students Ready for Deployment</p>
                        </div>
                        <div className="mt-auto text-xs text-center text-green-700 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
                            85% passed final assessment
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-purple-100 dark:border-purple-900/30 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold mb-3">
                            <Target size={18} /> Recommended COEs
                        </div>
                        <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300 h-full">
                            <li className="flex items-center gap-2 p-2 rounded hover:bg-white dark:hover:bg-slate-900/50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                                AI & Robotics Center
                            </li>
                            <li className="flex items-center gap-2 p-2 rounded hover:bg-white dark:hover:bg-slate-900/50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                                Auto-Component Hub
                            </li>
                            <li className="flex items-center gap-2 p-2 rounded hover:bg-white dark:hover:bg-slate-900/50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                                FinTech Lab
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
