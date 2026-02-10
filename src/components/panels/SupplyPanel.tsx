import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Users, GraduationCap, Award, CheckCircle, MapPin } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useEffect } from "react";
import StatCard from "../StatCard";



// Internal StatCard component
// Internal StatCard component removed in favor of shared component


interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
}

interface InstitutionData {
    id: string;
    name: string;
    taluk: string;
    total_students: number;
    placed_students: number;
    placement_rate: number;
    highest_package: number;
    swtt_level: number;
    nirf_rank?: number;
}

export default function SupplyPanel({ filters }: PanelProps) {
    const { currentDistrict } = useAuthStore();
    const [schemeCapacity, setSchemeCapacity] = useState<number>(0);
    const [institutions, setInstitutions] = useState<InstitutionData[]>([]);

    useEffect(() => {
        const fetchInstitutionData = async () => {
            // Fetch from district_training_centers
            // Note: real table might not have 'highest_package' or 'nirf_rank' yet, so we'll mock or default them
            const { data } = await supabase
                .from('district_training_centers')
                .select('*')
                .eq('district', currentDistrict || 'Dakshina Kannada');

            if (data) {
                const mapped = data.map((d: any) => {
                    const total = d.trained_last_year || 0;
                    const placed = d.placed_last_year || 0;
                    const rate = total > 0 ? Math.round((placed / total) * 100) : 0;

                    // Mocking some fields for visualization richness if they don't exist in the simple table yet
                    const mockPackage = rate > 80 ? 12.5 : rate > 60 ? 6.5 : 3.5;
                    const level = rate > 80 ? 4 : rate > 60 ? 3 : rate > 40 ? 2 : 1;

                    return {
                        id: d.id,
                        name: d.training_center_name,
                        taluk: d.block || 'Mangaluru', // Default if missing
                        total_students: total,
                        placed_students: placed,
                        placement_rate: rate,
                        highest_package: mockPackage, // Placeholder
                        swtt_level: level,
                        nirf_rank: d.training_center_name.includes('NITK') ? 17 : undefined
                    };
                });
                setInstitutions(mapped);
            }
        };

        const fetchSchemeData = async () => {
            if (!currentDistrict) return;

            const { data, error } = await supabase
                .from('district_schemes')
                .select('annual_intake')
                .eq('district_name', currentDistrict);

            if (error) {
                console.error('Error fetching scheme data:', error);
                return;
            }

            if (data) {
                const total = data.reduce((sum, row) => sum + (row.annual_intake || 0), 0);
                setSchemeCapacity(total);
            }
        };

        fetchSchemeData();
        fetchInstitutionData();
    }, [currentDistrict]);

    // Filter institutions
    const filteredInstitutions = institutions.filter(inst => {
        if (filters.institution !== 'all' && inst.name !== filters.institution) return false;
        return true;
    });

    // Recalculate dynamic stats based on filtered list
    const totalStudents = filteredInstitutions.reduce((acc, curr) => acc + curr.total_students, 0);
    const annualGraduates = Math.round(totalStudents / 4);
    // const certifiedStudents = Math.round(annualGraduates * 0.6); // Replaced with real scheme data

    // Average placement rate for the filtered set
    const avgReadiness = filteredInstitutions.length > 0
        ? Math.round(filteredInstitutions.reduce((acc, curr) => acc + (curr.placement_rate || 0), 0) / filteredInstitutions.length)
        : 0;

    // Chart Data uses the filtered list
    const outputData = filteredInstitutions
        .sort((a, b) => b.total_students - a.total_students)
        .slice(0, 8)
        .map(inst => ({
            name: inst.name.split('(')[0].trim().substring(0, 15),
            students: Math.round(inst.total_students / 4),
            placed: inst.placed_students,
            placementRate: inst.placement_rate
        }));

    const skillRadarData = [
        { subject: 'Technical', student: 65, industry: 85, fullMark: 100 },
        { subject: 'Communication', student: 72, industry: 90, fullMark: 100 },
        { subject: 'Aptitude', student: 68, industry: 80, fullMark: 100 },
        { subject: 'Practical', student: 58, industry: 85, fullMark: 100 },
        { subject: 'Digital', student: 62, industry: 88, fullMark: 100 },
        { subject: 'Teamwork', student: 70, industry: 82, fullMark: 100 },
    ];

    return (
        <div className="space-y-6">
            {/* HIGHLIGHT VISUALS (Premier, Best Placement, Highest Package) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Premier Institution */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">Premier Institution</p>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">NITK Surathkal</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 pb-2 border-b border-blue-200 dark:border-blue-700">
                        NIRF Rank #17 | 93% Placement | ₹16.25 LPA Avg
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-2 font-medium">
                        Top Recruiters: Google, Microsoft, Amazon, Goldman Sachs
                    </p>
                </div>

                {/* Best Placement Rate */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1">Best Placement Rate</p>
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100">Srinivas Institute</h3>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1 pb-2 border-b border-green-200 dark:border-green-700">
                        86.9% Placement Rate | 447 Students Placed
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-2 font-medium">
                        Consistent performance in mass recruiting companies
                    </p>
                </div>

                {/* Highest Package */}
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase mb-1">Highest Package</p>
                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">₹72 LPA</h3>
                    <p className="text-xs text-purple-600 dark:text-purple-300 mt-1 pb-2 border-b border-purple-200 dark:border-purple-700">
                        Sahyadri | Rolls Royce
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-2 font-medium">
                        District's premium package demonstrates talent quality
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatCard
                    title="Total Students"
                    value={totalStudents.toLocaleString()}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Annual Graduates"
                    value={annualGraduates.toLocaleString()}
                    icon={GraduationCap}
                    color="indigo"
                />
                <StatCard
                    title="Govt. Scheme Capacity"
                    value={schemeCapacity.toLocaleString()}
                    icon={Award}
                    color="green"
                />
                <StatCard
                    title="Readiness Score"
                    value={`${avgReadiness}/100`}
                    icon={CheckCircle}
                    color="orange"
                />
                <StatCard
                    title="Institutions"
                    value={filteredInstitutions.length.toString()}
                    icon={MapPin}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Talent Output */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Talent Output by Institution (Top 8 by Volume)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={outputData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                                <XAxis
                                    dataKey="name"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="students" name="Annual Grads" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="placed" name="Placed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Skill Readiness Radar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Skill Readiness: Student Capability vs Industry Requirement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                                <Radar
                                    name="Student Proficiency"
                                    dataKey="student"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Industry Requirement"
                                    dataKey="industry"
                                    stroke="#ef4444"
                                    fill="#ef4444"
                                    fillOpacity={0.3}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                <Tooltip contentStyle={{ fontSize: '11px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center text-icon mt-2">
                            Gap Analysis: Students trail industry requirements in Practical Skills and Digital Literacy
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Institution Performance Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-text">
                        Institution Performance Leaderboard (DK District)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-auto max-h-[600px]">
                    <Table>
                        <TableHeader className="sticky top-0 bg-surface z-10 shadow-sm">
                            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                <TableHead className="font-semibold w-[50px]">Rank</TableHead>
                                <TableHead className="font-semibold">Institution Name</TableHead>
                                <TableHead className="font-semibold">Location</TableHead>
                                <TableHead className="text-right font-semibold">Total Students</TableHead>
                                <TableHead className="text-right font-semibold">Placed (24-25)</TableHead>
                                <TableHead className="text-right font-semibold">Placement %</TableHead>
                                <TableHead className="text-right font-semibold">Highest (LPA)</TableHead>
                                <TableHead className="text-center font-semibold">Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInstitutions
                                .sort((a, b) => b.placement_rate - a.placement_rate)
                                .map((inst, i) => (
                                    <TableRow key={inst.id} className={i < 1 ? 'bg-green-50/50 dark:bg-green-900/10' : i < 5 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}>
                                        <TableCell className="font-bold text-icon">#{i + 1}</TableCell>
                                        <TableCell className="font-medium text-text">
                                            {inst.name}
                                            {inst.nirf_rank && (
                                                <div className="text-[10px] text-blue-600 font-semibold">NIRF #{inst.nirf_rank}</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-icon">
                                            {inst.taluk}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{inst.total_students.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-bold text-text">{inst.placed_students}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-bold ${inst.placement_rate >= 90 ? 'text-green-700' :
                                                inst.placement_rate >= 75 ? 'text-blue-600' :
                                                    inst.placement_rate >= 60 ? 'text-orange-600' :
                                                        'text-red-600'
                                                }`}>
                                                {inst.placement_rate}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-purple-600">
                                            ₹{inst.highest_package}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    inst.swtt_level === 4 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800" :
                                                        inst.swtt_level === 3 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800" :
                                                            inst.swtt_level === 2 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800" :
                                                                "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800"
                                                }
                                            >
                                                L{inst.swtt_level}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
