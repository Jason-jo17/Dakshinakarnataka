import StatCard from '../StatCard';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Briefcase, Users, TrendingUp, DollarSign, Activity, Percent } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { dashboardData } from '../../data/dashboardData';

interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
}

export default function OverviewPanel({ filters }: PanelProps) {
    // Filter logic for Overview
    // Note: The static data below should ideally be computed from dashboardData based on filters.
    // For this refactor, we will implement simple filtering where applicable or show a filtered state.

    // Example: If 'Sector' is filtered, we only show that sector in the Demand/Supply chart.
    const rawDemandSupplyData = [
        { name: 'IT/ITES', demand: 850, supply: 620, sector: 'Primary' },
        { name: 'BPO/KPO', demand: 450, supply: 380, sector: 'Primary' },
        { name: 'Manufacturing', demand: 280, supply: 240, sector: 'Secondary' },
        { name: 'Automotive', demand: 150, supply: 110, sector: 'Secondary' },
        { name: 'Healthcare', demand: 95, supply: 65, sector: 'Tertiary' },
    ];

    const demandSupplyData = rawDemandSupplyData.filter(item => {
        // Filter by Sector
        if (filters.sector !== 'all') {
            // Simple mapping or check. The values in Select are "IT/ITES", "Manufacturing", etc.
            // Our data names match well.
            return item.name === filters.sector || item.sector === filters.sector;
        }
        return true;
    });

    // If Industry filter is active, further narrow down if possible, or just rely on Sector for this high-level view.
    // If Institution is filtered, this high-level view might not change much unless we aggregate from specific institution data.
    // For now, let's make sure at least Sector filters work visibly.

    const readinessData = [
        { name: 'Job Ready', value: 72, color: '#22c55e' },
        { name: 'Needs Training', value: 28, color: '#f59e0b' },
    ];

    const { overview } = dashboardData;

    return (
        <div className="space-y-6">
            {/* Header with District Name */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Dakshina Kannada District</h1>
                <p className="text-blue-100">Engineering Talent & Industry Demand Dashboard - Academic Year 2024-25</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="text-blue-200">Total Institutions</div>
                        <div className="text-2xl font-bold">{dashboardData.supply.totalInstitutions}</div>
                    </div>
                    <div>
                        <div className="text-blue-200">Engineering Students</div>
                        <div className="text-2xl font-bold">{dashboardData.supply.totalStudents.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-blue-200">Tech Companies</div>
                        <div className="text-2xl font-bold">225+</div>
                    </div>
                    <div>
                        <div className="text-blue-200">Tech Workforce</div>
                        <div className="text-2xl font-bold">30,000+</div>
                    </div>
                </div>
            </div>

            {/* KPI Cards with Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Active Job Openings"
                    value={overview.totalOpenings.toLocaleString()}
                    icon={Briefcase}
                    trend="up"
                    trendValue={`${overview.trends.openings.value}%`}
                    color="blue"
                />
                <StatCard
                    title="Students Placed (2024-25)"
                    value={overview.skilledTalent.toLocaleString()}
                    icon={Users}
                    color="purple"
                />
                <Card>
                    <CardContent className="flex items-center p-4 space-x-4">
                        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-icon">Skill Gap Index</p>
                            <h3 className="text-2xl font-bold text-text">{overview.skillGapPercentage}%</h3>
                            <p className="text-xs text-icon mt-1">Diff. between industry demand & student readiness</p>
                            <div className="flex items-center text-xs font-medium text-red-600 dark:text-red-400 mt-1">
                                <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                                -5% vs last year
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <StatCard
                    title="Avg Placement Rate"
                    value={`${overview.placementRate}%`}
                    icon={Percent}
                    color="green"
                    trend="up"
                    trendValue={`${overview.trends.placementRate.value}%`}
                />
                <StatCard
                    title="Avg Fresher Salary"
                    value={`₹${overview.avgFresherSalary} LPA`}
                    icon={DollarSign}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* District Skill Readiness Index */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            District Skill Readiness Index
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex flex-col items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={readinessData}
                                    cx="50%"
                                    cy="70%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={0}
                                    dataKey="value"
                                >
                                    {readinessData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-10 text-center">
                            <div className="text-4xl font-bold text-text">
                                {dashboardData.supply.readinessScore}/100
                            </div>
                            <div className="text-xs text-icon">Readiness Score</div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                                {readinessData[0].value}% Job Ready
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sector-wise Demand vs Supply */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Sector-wise Demand vs Supply (Current Openings vs Placed Students)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandSupplyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px' }}
                                    formatter={(value, name) => [value, name === 'Demand' ? 'Job Openings' : 'Students Placed']}
                                />
                                <Legend
                                    iconType="circle"
                                />
                                <Bar dataKey="demand" name="Demand" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="supply" name="Supply" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                            {dashboardData.supply.annualGraduates.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">Annual Engineering Graduates</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                            {dashboardData.supply.certifiedStudents.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-300 mt-1">Certified/Trained Students</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                            ₹72 LPA
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">Highest Package (Sahyadri)</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                            10
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">Centers of Excellence</div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Insights */}
            <Card className="bg-background border-slate-200 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-text">
                        Key Insights - Dakshina Kannada District
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex gap-3">
                            <div className="w-2 bg-blue-500 rounded"></div>
                            <div>
                                <div className="font-semibold text-text">Strong IT/ITES Demand</div>
                                <div className="text-icon text-xs mt-1">
                                    850+ openings in software development, with Python (398 jobs) leading demand
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-2 bg-green-500 rounded"></div>
                            <div>
                                <div className="font-semibold text-text">Premier Institution Leadership</div>
                                <div className="text-icon text-xs mt-1">
                                    NITK Surathkal (NIRF #17) drives ecosystem with 93% B.Tech placement rate
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-2 bg-orange-500 rounded"></div>
                            <div>
                                <div className="font-semibold text-text">Critical Skill Gaps</div>
                                <div className="text-icon text-xs mt-1">
                                    Cloud (63% gap) and DevOps (68% gap) skills severely undersupplied
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
