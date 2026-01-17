import React from 'react';
import StatCard from '../StatCard';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Target, Zap, Settings, Award, Building2, GraduationCap, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
}

export default function CoePanel({ filters }: PanelProps) {
    void filters;
    // Expanded COEs and Training Infrastructure
    const coes = [
        // Academic COEs
        {
            id: 1,
            name: "NITK STEP Incubator",
            type: "Academic COE",
            location: "NITK Surathkal, Srinivasnagar",
            focus_area: "Technology Entrepreneurship",
            performance_score: 92,
            training_completion_rate: 88,
            status: "High Performing",
            trainings_conducted: 45,
            students_trained: 850,
            placement_rate: 85,
            utilization_rate: 78,
            equipment_usage_score: 82,
            faculty_readiness_score: 90,
            industry_alignment_score: 88,
            budget_allocated: 5.0,
            budget_utilized: 4.2,
            notable_achievements: "Produced unicorns: Practo, Delhivery, Nestaway"
        },
        {
            id: 2,
            name: "Sahyadri ACIC",
            type: "Academic COE",
            location: "Sahyadri College, N.H-48, Adyar",
            focus_area: "Innovation & Incubation (NITI Aayog)",
            performance_score: 78,
            training_completion_rate: 75,
            status: "High Performing",
            trainings_conducted: 28,
            students_trained: 420,
            placement_rate: 70,
            utilization_rate: 65,
            equipment_usage_score: 70,
            faculty_readiness_score: 75,
            industry_alignment_score: 72,
            budget_allocated: 2.3,
            budget_utilized: 1.8,
            notable_achievements: "22 startups incubated, 12 active, 100-seater facility"
        },
        {
            id: 3,
            name: "SJEC NAIN Center",
            type: "Academic COE",
            location: "St Joseph Engineering College, Vamanjoor",
            focus_area: "Industry Partnership & Skill Development",
            performance_score: 72,
            training_completion_rate: 68,
            status: "Average",
            trainings_conducted: 22,
            students_trained: 380,
            placement_rate: 68,
            utilization_rate: 58,
            equipment_usage_score: 65,
            faculty_readiness_score: 70,
            industry_alignment_score: 75,
            budget_allocated: 1.5,
            budget_utilized: 1.1,
            notable_achievements: "KCCI & IMTMA partnerships, Industry connect programs"
        },
        {
            id: 4,
            name: "MITE Innovation Lab",
            type: "Academic COE",
            location: "Mangalore Institute of Technology, Moodbidri - 574225",
            focus_area: "Engineering Innovation & Research",
            performance_score: 68,
            training_completion_rate: 65,
            status: "Average",
            trainings_conducted: 18,
            students_trained: 320,
            placement_rate: 65,
            utilization_rate: 55,
            equipment_usage_score: 60,
            faculty_readiness_score: 68,
            industry_alignment_score: 70,
            budget_allocated: 1.2,
            budget_utilized: 0.9,
            notable_achievements: "Focus on core engineering disciplines"
        },
        {
            id: 5,
            name: "Yenepoya Research Centre",
            type: "Academic COE",
            location: "Yenepoya Deemed University, Deralakatte",
            focus_area: "Healthcare Tech & Biomedical Engineering",
            performance_score: 70,
            training_completion_rate: 72,
            status: "Average",
            trainings_conducted: 15,
            students_trained: 250,
            placement_rate: 75,
            utilization_rate: 60,
            equipment_usage_score: 68,
            faculty_readiness_score: 72,
            industry_alignment_score: 78,
            budget_allocated: 2.8,
            budget_utilized: 2.2,
            notable_achievements: "Healthcare technology focus, Medical devices R&D"
        },

        // Government Training Centers
        {
            id: 6,
            name: "STPI Mangaluru",
            type: "Government Infrastructure",
            location: "Blueberry Hill, Derebail, Mangaluru",
            focus_area: "Software Technology Parks",
            performance_score: 85,
            training_completion_rate: 80,
            status: "High Performing",
            trainings_conducted: 35,
            students_trained: 650,
            placement_rate: 82,
            utilization_rate: 75,
            equipment_usage_score: 78,
            faculty_readiness_score: 82,
            industry_alignment_score: 85,
            budget_allocated: 12.0,
            budget_utilized: 10.5,
            notable_achievements: "250+ companies, ₹3,500 cr exports, 10,000 IT professionals"
        },
        {
            id: 7,
            name: "Govt Tool Room & Training Centre (GTTC)",
            type: "Government Training Center",
            location: "Polytechnic, Mangalore",
            focus_area: "Tool & Die Making, CNC, Advanced Manufacturing",
            performance_score: 75,
            training_completion_rate: 82,
            status: "High Performing",
            trainings_conducted: 48,
            students_trained: 580,
            placement_rate: 78,
            utilization_rate: 85,
            equipment_usage_score: 88,
            faculty_readiness_score: 80,
            industry_alignment_score: 82,
            budget_allocated: 3.5,
            budget_utilized: 3.2,
            notable_achievements: "Advanced CNC training, Tool design, Industry certifications"
        },

        // Industry Training Centers
        {
            id: 8,
            name: "MRPL Training Centre",
            type: "Industry Training Center",
            location: "Mangalore Refinery & Petrochemicals, Surathkal",
            focus_area: "Petroleum & Chemical Engineering, Process Safety",
            performance_score: 82,
            training_completion_rate: 88,
            status: "High Performing",
            trainings_conducted: 32,
            students_trained: 420,
            placement_rate: 85,
            utilization_rate: 70,
            equipment_usage_score: 85,
            faculty_readiness_score: 88,
            industry_alignment_score: 90,
            budget_allocated: 4.5,
            budget_utilized: 4.0,
            notable_achievements: "Refinery operations training, Safety certifications, PSM courses"
        },
        {
            id: 9,
            name: "Infosys Development Centre",
            type: "Industry Training Center",
            location: "Infosys Campus, Mudipu, Kamblapadavu",
            focus_area: "Software Development, Campus Connect Program",
            performance_score: 88,
            training_completion_rate: 90,
            status: "High Performing",
            trainings_conducted: 52,
            students_trained: 1200,
            placement_rate: 92,
            utilization_rate: 82,
            equipment_usage_score: 90,
            faculty_readiness_score: 92,
            industry_alignment_score: 95,
            budget_allocated: 8.0,
            budget_utilized: 7.5,
            notable_achievements: "Campus Connect 300+ colleges, Winternship program, 2,500+ workforce"
        },
        {
            id: 10,
            name: "Syngene Biotech Training Hub",
            type: "Industry Training Center",
            location: "Syngene International, Bajpe",
            focus_area: "Biotechnology, Pharmaceutical R&D",
            performance_score: 80,
            training_completion_rate: 85,
            status: "High Performing",
            trainings_conducted: 24,
            students_trained: 180,
            placement_rate: 88,
            utilization_rate: 68,
            equipment_usage_score: 82,
            faculty_readiness_score: 85,
            industry_alignment_score: 92,
            budget_allocated: 3.2,
            budget_utilized: 2.8,
            notable_achievements: "Biotech research training, Pharma quality certifications"
        }
    ];

    const stats = React.useMemo(() => {
        const total = coes.length;
        const highPerforming = coes.filter(c => c.status === 'High Performing').length;
        const avgUtilization = total ? Math.round(
            coes.reduce((acc, c) => acc + (c.utilization_rate || 0), 0) / total
        ) : 0;
        const totalTrained = coes.reduce((acc, c) => acc + (c.students_trained || 0), 0);
        return { total, highPerforming, avgUtilization, totalTrained };
    }, [coes]);

    const budgetData = coes.map(coe => ({
        name: coe.name.split(' ')[0], // Shortened name
        allocated: coe.budget_allocated || 0,
        utilized: coe.budget_utilized || 0,
        utilizationPct: coe.budget_allocated ?
            Math.round((coe.budget_utilized / coe.budget_allocated) * 100) : 0
    }));

    // Type-wise distribution
    const typeDistribution = [
        { type: 'Academic COE', count: coes.filter(c => c.type === 'Academic COE').length, color: '#3b82f6' },
        { type: 'Government', count: coes.filter(c => c.type.includes('Government')).length, color: '#10b981' },
        { type: 'Industry', count: coes.filter(c => c.type === 'Industry Training Center').length, color: '#f59e0b' }
    ];

    // Performance radar data
    const performanceRadar = [
        {
            category: 'Training Quality',
            academic: 75,
            government: 81,
            industry: 88,
            fullMark: 100
        },
        {
            category: 'Industry Alignment',
            academic: 77,
            government: 84,
            industry: 92,
            fullMark: 100
        },
        {
            category: 'Infrastructure',
            academic: 72,
            government: 82,
            industry: 86,
            fullMark: 100
        },
        {
            category: 'Placement',
            academic: 74,
            government: 80,
            industry: 88,
            fullMark: 100
        },
        {
            category: 'Innovation',
            academic: 80,
            government: 70,
            industry: 75,
            fullMark: 100
        }
    ];

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total COEs & Training Centers"
                    value={stats.total.toString()}
                    icon={Target}
                    color="blue"
                    subtitle="Academic + Govt + Industry"
                />
                <StatCard
                    title="High Performing"
                    value={stats.highPerforming.toString()}
                    icon={Zap}
                    color="green"
                    subtitle="Score > 80"
                />
                <StatCard
                    title="Students Trained (Annual)"
                    value={stats.totalTrained.toLocaleString()}
                    icon={Award}
                    color="purple"
                    subtitle="Across all centers"
                />
                <StatCard
                    title="Avg Utilization"
                    value={`${stats.avgUtilization}%`}
                    icon={Settings}
                    color="orange"
                    subtitle="Infrastructure usage"
                />
            </div>

            {/* Type Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {typeDistribution.map((type, i) => (
                    <Card key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4 text-center">
                            <div className="text-4xl font-bold mb-1" style={{ color: type.color }}>
                                {type.count}
                            </div>
                            <div className="text-sm font-medium text-text">{type.type}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {type.type === 'Academic COE' && '5 institutions'}
                                {type.type === 'Government' && '2 training centers'}
                                {type.type === 'Industry' && '3 corporate centers'}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Comparison Radar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Performance Comparison: Academic vs Government vs Industry
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={performanceRadar}>
                                <PolarGrid stroke="var(--color-border)" />
                                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--color-text)' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--color-icon)' }} />
                                <Radar
                                    name="Academic COEs"
                                    dataKey="academic"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Government Centers"
                                    dataKey="government"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.4}
                                />
                                <Radar
                                    name="Industry Centers"
                                    dataKey="industry"
                                    stroke="#f59e0b"
                                    fill="#f59e0b"
                                    fillOpacity={0.3}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--color-text)' }} />
                                <Tooltip contentStyle={{ fontSize: '11px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center text-icon mt-2">
                            <strong>Key Insight:</strong> Industry centers excel in alignment & placement; Academic COEs lead in innovation
                        </div>
                    </CardContent>
                </Card>

                {/* Budget Utilization */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Budget Utilization (₹ Crores) - Top 8 Centers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={budgetData.slice(0, 8)} margin={{ bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="name"
                                    fontSize={10}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    tickLine={false}
                                    tick={{ fill: 'var(--color-text)' }}
                                />
                                <YAxis fontSize={12} tickLine={false} tick={{ fill: 'var(--color-text)' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', fontSize: '12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    formatter={(value, name) => [
                                        `₹${value} Cr`,
                                        name === 'allocated' ? 'Allocated' : 'Utilized'
                                    ]}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--color-text)' }} />
                                <Bar dataKey="allocated" name="Allocated" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={18} />
                                <Bar dataKey="utilized" name="Utilized" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center text-icon">
                            Total: ₹{budgetData.reduce((sum, b) => sum + b.allocated, 0).toFixed(1)} Cr allocated,
                            ₹{budgetData.reduce((sum, b) => sum + b.utilized, 0).toFixed(1)} Cr utilized (
                            {Math.round(budgetData.reduce((sum, b) => sum + b.utilized, 0) / budgetData.reduce((sum, b) => sum + b.allocated, 0) * 100)}%)
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Comprehensive COE Inventory */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-text">
                        Complete COE & Training Infrastructure Inventory - Dakshina Kannada
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-800">
                                <TableRow>
                                    <TableHead className="font-semibold text-text">Name</TableHead>
                                    <TableHead className="font-semibold text-text">Type</TableHead>
                                    <TableHead className="font-semibold text-text">Location</TableHead>
                                    <TableHead className="font-semibold text-text">Focus Area</TableHead>
                                    <TableHead className="text-right font-semibold text-text">Score</TableHead>
                                    <TableHead className="text-right font-semibold text-text">Trained</TableHead>
                                    <TableHead className="text-center font-semibold text-text">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coes.map((coe, i) => (
                                    <TableRow key={i} className={coe.status === 'High Performing' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-yellow-50 dark:bg-yellow-900/10'}>
                                        <TableCell className="font-medium text-text max-w-[200px]">
                                            {coe.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${coe.type === 'Academic COE' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                                                    coe.type.includes('Government') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
                                                        'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                                                    }`}
                                            >
                                                {coe.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-text max-w-[180px]">
                                            {coe.location}
                                        </TableCell>
                                        <TableCell className="text-xs text-text max-w-[200px]">
                                            {coe.focus_area}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-bold text-lg ${coe.performance_score >= 85 ? 'text-green-600 dark:text-green-400' :
                                                coe.performance_score >= 75 ? 'text-blue-600 dark:text-blue-400' :
                                                    'text-orange-600 dark:text-orange-400'
                                                }`}>
                                                {coe.performance_score}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-purple-600 dark:text-purple-400">
                                            {coe.students_trained}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    coe.status === 'High Performing'
                                                        ? "text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 font-semibold"
                                                        : "text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20"
                                                }
                                            >
                                                {coe.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Highlights by Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Academic COEs */}
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <GraduationCap size={18} />
                            Academic COEs (5)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">🏆 NITK STEP</p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Score: 92 | 850 trained | Practo, Delhivery alumni</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">Sahyadri ACIC</p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Score: 78 | 420 trained | 22 startups</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">SJEC NAIN</p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Score: 72 | 380 trained | KCCI partnerships</p>
                            </div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                <strong>Total:</strong> 2,220 students trained annually
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Government Training Centers */}
                <Card className="border-t-4 border-t-green-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                            <Building2 size={18} />
                            Government Centers (2)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                <p className="font-bold text-green-900 dark:text-green-100 text-sm">🏆 STPI Mangaluru</p>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">Score: 85 | 650 trained | 250+ companies, ₹3,500 cr exports</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                <p className="font-bold text-green-900 dark:text-green-100 text-sm">🏆 GTTC Mangalore</p>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">Score: 75 | 580 trained | Advanced CNC, Tool & Die</p>
                            </div>
                            <div className="text-xs text-green-700 dark:text-green-300 mt-2">
                                <strong>Total:</strong> 1,230 students trained annually
                            </div>
                            <div className="text-xs text-green-700 dark:text-green-300">
                                <strong>Focus:</strong> Manufacturing excellence, IT infrastructure
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Industry Training Centers */}
                <Card className="border-t-4 border-t-orange-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-700 dark:text-orange-400 flex items-center gap-2">
                            <Building2 size={18} />
                            Industry Centers (3)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                                <p className="font-bold text-orange-900 dark:text-orange-100 text-sm">🏆 Infosys Mudipu</p>
                                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Score: 88 | 1,200 trained | Campus Connect, 2,500+ workforce</p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                                <p className="font-bold text-orange-900 dark:text-orange-100 text-sm">🏆 MRPL Surathkal</p>
                                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Score: 82 | 420 trained | Refinery ops, Process safety</p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                                <p className="font-bold text-orange-900 dark:text-orange-100 text-sm">🏆 Syngene Bajpe</p>
                                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Score: 80 | 180 trained | Biotech, Pharma R&D</p>
                            </div>
                            <div className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                                <strong>Total:</strong> 1,800 students trained annually
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Strategic Recommendations */}
            <Card className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp size={20} />
                        Strategic Recommendations for COE Network Expansion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-600 rounded-lg p-4">
                            <p className="font-bold mb-2 text-yellow-300">Academic COEs</p>
                            <ul className="text-xs space-y-1.5">
                                <li>• Launch Cloud/DevOps lab at SJEC (address 63% skill gap)</li>
                                <li>• Establish Data Science CoE at Sahyadri (leverage ACIC)</li>
                                <li>• Scale NITK STEP to 60 programs (from 45)</li>
                                <li>• Create MITE Advanced Manufacturing lab</li>
                            </ul>
                        </div>
                        <div className="bg-slate-600 rounded-lg p-4">
                            <p className="font-bold mb-2 text-green-300">Government Centers</p>
                            <ul className="text-xs space-y-1.5">
                                <li>• Expand STPI to 2 lakh sq.ft Innovation Hub</li>
                                <li>• Target: 90% utilization (from 75%)</li>
                                <li>• GTTC: Add IoT & Robotics certifications</li>
                                <li>• Leverage KDEM ₹1,000 cr for infrastructure</li>
                            </ul>
                        </div>
                        <div className="bg-slate-600 rounded-lg p-4">
                            <p className="font-bold mb-2 text-orange-300">Industry Partnerships</p>
                            <ul className="text-xs space-y-1.5">
                                <li>• Infosys: Expand Campus Connect to 500 colleges</li>
                                <li>• MRPL: Launch Chemical Engg certification program</li>
                                <li>• Syngene: Biotech research scholarships</li>
                                <li>• New: Partner with BOSE for Audio Engineering CoE</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-800 p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5,250</div>
                    <div className="text-xs text-icon mt-1">Total Students Trained/Year</div>
                </div>
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-800 p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">₹47.1 Cr</div>
                    <div className="text-xs text-icon mt-1">Total Budget Allocated</div>
                </div>
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-800 p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">79%</div>
                    <div className="text-xs text-icon mt-1">Avg Budget Utilization</div>
                </div>
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-800 p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">82%</div>
                    <div className="text-xs text-icon mt-1">Avg Placement Rate</div>
                </div>
            </div>
        </div>
    );
}
