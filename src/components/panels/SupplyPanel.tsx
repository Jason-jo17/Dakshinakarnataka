import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Users, GraduationCap, Award, CheckCircle, MapPin } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

// Consolidated Data for 17 DK Institutions
const dashboardData = {
    // Supply metrics calculated dynamically below
    institutions: [
        { id: 1, name: "NITK Surathkal", taluk: "Surathkal", total_students: 4500, placed_students: 756, placement_rate: 93, highest_package: 55.0, swtt_level: 4, nirf_rank: 17 },
        { id: 2, name: "Alva's Inst. of Engg", taluk: "Moodbidri", total_students: 3200, placed_students: 680, placement_rate: 85, highest_package: 21.0, swtt_level: 3 },
        { id: 3, name: "St. Joseph Engg College", taluk: "Vamanjoor", total_students: 2800, placed_students: 546, placement_rate: 78, highest_package: 24.5, swtt_level: 3 },
        { id: 4, name: "Sahyadri College", taluk: "Adyar", total_students: 3000, placed_students: 585, placement_rate: 78, highest_package: 72.0, swtt_level: 3 }, // Updated to 72.0
        { id: 5, name: "Mangalore Inst. (MITE)", taluk: "Moodbidri", total_students: 2800, placed_students: 532, placement_rate: 76, highest_package: 28.0, swtt_level: 3 },
        { id: 6, name: "Srinivas Inst. (Valachil)", taluk: "Valachil", total_students: 2500, placed_students: 447, placement_rate: 86.9, highest_package: 18.0, swtt_level: 2 }, // Updated to 86.9
        { id: 7, name: "Yenepoya Inst. (YIT)", taluk: "Moodbidri", total_students: 1800, placed_students: 360, placement_rate: 65, highest_package: 12.0, swtt_level: 2 },
        { id: 8, name: "Canara Engineering", taluk: "Benjanapadavu", total_students: 2000, placed_students: 325, placement_rate: 65, highest_package: 15.0, swtt_level: 2 },
        { id: 9, name: "PA College of Engg", taluk: "Nadupadavu", total_students: 2200, placed_students: 385, placement_rate: 62, highest_package: 10.0, swtt_level: 2 },
        { id: 10, name: "AJ Inst. of Engg", taluk: "Boloor", total_students: 1800, placed_students: 270, placement_rate: 60, highest_package: 8.5, swtt_level: 2 },
        { id: 11, name: "Vivekananda (VCET)", taluk: "Puttur", total_students: 1600, placed_students: 240, placement_rate: 60, highest_package: 9.0, swtt_level: 2 },
        { id: 12, name: "SDM Inst. (SDMIT)", taluk: "Ujire", total_students: 1500, placed_students: 225, placement_rate: 60, highest_package: 10.0, swtt_level: 2 },
        { id: 13, name: "Srinivas Univ. (SUIET)", taluk: "Mukka", total_students: 1200, placed_students: 180, placement_rate: 60, highest_package: 10.0, swtt_level: 2 },
        { id: 14, name: "Shree Devi Inst.", taluk: "Kenjar", total_students: 1200, placed_students: 174, placement_rate: 58, highest_package: 6.5, swtt_level: 1 },
        { id: 15, name: "Bearys Inst. (BIT)", taluk: "Innoli", total_students: 800, placed_students: 110, placement_rate: 55, highest_package: 6.0, swtt_level: 1 },
        { id: 16, name: "KVG College", taluk: "Sullia", total_students: 1000, placed_students: 125, placement_rate: 50, highest_package: 5.0, swtt_level: 1 },
        { id: 17, name: "Karavali Inst.", taluk: "Neermarga", total_students: 800, placed_students: 90, placement_rate: 45, highest_package: 4.0, swtt_level: 1 },
    ]
};

// Internal StatCard component
const StatCard = ({ title, value, icon: Icon, color }: any) => {
    const colorClasses: any = {
        blue: "bg-blue-100 text-blue-600",
        indigo: "bg-indigo-100 text-indigo-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <Card>
            <CardContent className="flex items-center p-4 space-x-4">
                <div className={`p-3 rounded-full ${colorClasses[color] || "bg-slate-100 text-slate-600"}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
};


interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
}

export default function SupplyPanel({ filters }: PanelProps) {
    void filters;
    // Calculate dynamic stats
    const totalStudents = 34700;
    const annualGraduates = Math.round(totalStudents / 4); // Approx 4-year programs
    // Estimate: 60% of graduates get some form of certification/training
    const certifiedStudents = Math.round(annualGraduates * 0.6);
    const readinessScore = 65; // Static expert assessment
    const totalInstitutions = dashboardData.institutions.length;

    // Chart Data
    const outputData = dashboardData.institutions
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">Premier Institution</p>
                    <h3 className="text-lg font-bold text-blue-900">NITK Surathkal</h3>
                    <p className="text-xs text-blue-600 mt-1 pb-2 border-b border-blue-200">
                        NIRF Rank #17 | 93% Placement | ₹16.25 LPA Avg
                    </p>
                    <p className="text-xs text-blue-700 mt-2 font-medium">
                        Top Recruiters: Google, Microsoft, Amazon, Goldman Sachs
                    </p>
                </div>

                {/* Best Placement Rate */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-bold text-green-700 uppercase mb-1">Best Placement Rate</p>
                    <h3 className="text-lg font-bold text-green-900">Srinivas Institute</h3>
                    <p className="text-xs text-green-600 mt-1 pb-2 border-b border-green-200">
                        86.9% Placement Rate | 447 Students Placed
                    </p>
                    <p className="text-xs text-green-700 mt-2 font-medium">
                        Consistent performance in mass recruiting companies
                    </p>
                </div>

                {/* Highest Package */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-bold text-purple-700 uppercase mb-1">Highest Package</p>
                    <h3 className="text-lg font-bold text-purple-900">₹72 LPA</h3>
                    <p className="text-xs text-purple-600 mt-1 pb-2 border-b border-purple-200">
                        Sahyadri | Rolls Royce
                    </p>
                    <p className="text-xs text-purple-700 mt-2 font-medium">
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
                    title="Trained/Certified"
                    value={certifiedStudents.toLocaleString()}
                    icon={Award}
                    color="green"
                />
                <StatCard
                    title="Readiness Score"
                    value={`${readinessScore}/100`}
                    icon={CheckCircle}
                    color="orange"
                />
                <StatCard
                    title="Institutions"
                    value={totalInstitutions}
                    icon={MapPin}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Talent Output */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
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
                        <CardTitle className="text-sm font-medium text-slate-500">
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
                        <div className="text-xs text-center text-slate-500 mt-2">
                            Gap Analysis: Students trail industry requirements in Practical Skills and Digital Literacy
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Institution Performance Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-700">
                        Institution Performance Leaderboard (DK District)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-auto max-h-[600px]">
                    <Table>
                        <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                            <TableRow className="bg-slate-50">
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
                            {dashboardData.institutions
                                .sort((a, b) => b.placement_rate - a.placement_rate)
                                .map((inst, i) => (
                                    <TableRow key={inst.id} className={i < 1 ? 'bg-green-50/50' : i < 5 ? 'bg-blue-50/30' : ''}>
                                        <TableCell className="font-bold text-slate-600">#{i + 1}</TableCell>
                                        <TableCell className="font-medium text-slate-800">
                                            {inst.name}
                                            {inst.nirf_rank && (
                                                <div className="text-[10px] text-blue-600 font-semibold">NIRF #{inst.nirf_rank}</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {inst.taluk}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{inst.total_students.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-bold text-slate-700">{inst.placed_students}</TableCell>
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
                                                    inst.swtt_level === 4 ? "bg-green-100 text-green-700 border-green-300" :
                                                        inst.swtt_level === 3 ? "bg-blue-100 text-blue-700 border-blue-300" :
                                                            inst.swtt_level === 2 ? "bg-orange-100 text-orange-700 border-orange-300" :
                                                                "bg-red-100 text-red-700 border-red-300"
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
