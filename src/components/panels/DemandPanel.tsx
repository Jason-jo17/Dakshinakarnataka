import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Briefcase, Building2, Layers, TrendingUp } from "lucide-react";
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import StatCard from '../StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { dashboardData } from '../../data/dashboardData';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 rounded shadow-lg text-xs">
                <p className="font-bold text-slate-800">{payload[0].payload.name}</p>
                <p className="text-slate-600">Openings: <span className="font-bold text-blue-600">{payload[0].value}</span></p>
                {payload[0].payload.companies && (
                    <p className="text-slate-500 text-[10px] mt-1">{payload[0].payload.companies}</p>
                )}
            </div>
        );
    }
    return null;
};

const CustomContent = (props: any) => {
    const { x, y, width, height, name, size } = props;
    if (width < 50 || height < 40) return null;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={props.fill || '#3b82f6'}
                stroke="#fff"
                strokeWidth={2}
            />
            <text
                x={x + width / 2}
                y={y + height / 2 - 8}
                textAnchor="middle"
                fill="#fff"
                fontSize={Math.max(12, Math.min(width / 8, height / 5, 14))}
                fontWeight="700"
                style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.4)' }}
            >
                {name}
            </text>
            <text
                x={x + width / 2}
                y={y + height / 2 + 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize={Math.max(10, Math.min(width / 10, height / 6, 12))}
                fontWeight="500"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.4)' }}
            >
                {size} jobs
            </text>
        </g>
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

export default function DemandPanel({ filters }: PanelProps) {
    // Suppress unused warning until filter logic is fully implemented
    void filters;

    // Tree map data from actual Dakshina Kannada job market
    const treeMapData = [
        { name: 'Python Dev', size: 398, fill: '#3b82f6', companies: 'UniCourt, Winman, Bix Bytes' },
        { name: 'Java/Spring', size: 285, fill: '#1e40af', companies: 'EG Danmark, Infosys, Cognizant' },
        { name: 'React/Frontend', size: 245, fill: '#60a5fa', companies: 'Winman, Bix Bytes, Idaksh' },
        { name: 'MERN Stack', size: 180, fill: '#93c5fd', companies: 'Bix Bytes, Winman, Startups' },
        { name: 'BPO/Voice', size: 450, fill: '#f59e0b', companies: 'Infosys BPM, Cognizant' },
        { name: 'Data Science', size: 150, fill: '#8b5cf6', companies: 'Cognizant, Analytics firms' },
        { name: 'Cloud (AWS/GCP)', size: 120, fill: '#ec4899', companies: 'UniCourt, EG Danmark' },
        { name: 'DevOps', size: 95, fill: '#06b6d4', companies: 'Tech MNCs, GCCs' },
        { name: 'Mobile Dev', size: 110, fill: '#14b8a6', companies: 'Product Companies' },
    ];

    // Actual companies with job openings
    const companyDemand = dashboardData.industryDemand.slice(0, 10);

    // Top trending job roles with actual data
    const jobRoles = [
        {
            title: "Python Developer",
            skills: ["Python", "Django", "Flask", "AWS"],
            exp: "0-3 yrs",
            salary: "₹5-10 LPA",
            openings: 398,
            companies: "UniCourt, Winman, Bix Bytes"
        },
        {
            title: "Process Executive (BPO)",
            skills: ["MS Excel", "Communication", "Voice Process"],
            exp: "0-2 yrs",
            salary: "₹2.5-4.5 LPA",
            openings: 450,
            companies: "Infosys BPM, Cognizant"
        },
        {
            title: "Java Developer",
            skills: ["Java", "Spring Boot", "Microservices"],
            exp: "1-4 yrs",
            salary: "₹6-12 LPA",
            openings: 285,
            companies: "EG Danmark, Infosys"
        },
        {
            title: "Full Stack (MERN)",
            skills: ["MongoDB", "Express", "React", "Node.js"],
            exp: "1-3 yrs",
            salary: "₹4-8 LPA",
            openings: 180,
            companies: "Bix Bytes, Winman"
        },
        {
            title: "React.js Developer",
            skills: ["React", "JavaScript", "Redux", "HTML/CSS"],
            exp: "1-3 yrs",
            salary: "₹5-10 LPA",
            openings: 245,
            companies: "Winman, Idaksh"
        },
        {
            title: "Cloud Engineer",
            skills: ["AWS/GCP", "Terraform", "Docker", "Kubernetes"],
            exp: "2-5 yrs",
            salary: "₹7-16 LPA",
            openings: 120,
            companies: "UniCourt, EG Danmark"
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Active Companies" value="225+" icon={Building2} color="blue" />
                <StatCard title="Tech Companies" value="150+" icon={Building2} color="indigo" />
                <StatCard title="Job Roles" value="85+" icon={Briefcase} color="purple" />
                <StatCard title="Open Positions" value="1,000+" icon={Briefcase} color="orange" />
                <StatCard title="Avg Openings/Co" value="6.5" icon={TrendingUp} color="green" />
                <StatCard title="Top Sector" value="IT/ITES" icon={Layers} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demand Volume Tree Map */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Job Demand by Skill (Tree Map)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                                data={treeMapData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#8884d8"
                                content={<CustomContent />}
                            >
                                <Tooltip content={<CustomTooltip />} />
                            </Treemap>
                        </ResponsiveContainer>
                        <div className="text-xs text-center text-slate-500 mt-2">
                            Size represents number of active job postings • Data: Dec 2024
                        </div>
                    </CardContent>
                </Card>

                {/* Company Demand Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Top Hiring Companies - Dakshina Kannada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] overflow-auto p-0">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white">
                                <TableRow>
                                    <TableHead className="font-semibold">Company</TableHead>
                                    <TableHead className="font-semibold">Sector</TableHead>
                                    <TableHead className="font-semibold">Top Role</TableHead>
                                    <TableHead className="text-right font-semibold">Openings</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {companyDemand.map((co, i) => (
                                    <TableRow key={i} className={i < 3 ? 'bg-blue-50' : ''}>
                                        <TableCell className="font-medium text-slate-800">
                                            {co.company_name}
                                            <div className="text-xs text-slate-500">{co.company_type}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {co.sector}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-700">{co.job_role}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold text-blue-600 text-lg">{co.demand_count}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Trending Job Roles */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Trending Job Roles in Dakshina Kannada</h3>
                    <Badge variant="secondary" className="text-xs">Based on 1,000+ active listings</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobRoles.map((role, i) => (
                        <Card key={i} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">{role.title}</h4>
                                        <div className="text-xs text-slate-500 mt-1">{role.companies}</div>
                                    </div>
                                    <Badge className="bg-blue-600 text-white font-bold">
                                        {role.openings}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {role.skills.map(s => (
                                        <Badge key={s} variant="secondary" className="text-xs py-0.5">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600">Exp: <span className="font-semibold">{role.exp}</span></span>
                                    <span className="text-green-600 font-bold">{role.salary}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                            <TrendingUp size={16} />
                            Highest Demand Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-800">1. Python</span>
                                <Badge className="bg-blue-600">398 jobs</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-800">2. BPO/Voice</span>
                                <Badge className="bg-blue-600">450 jobs</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-800">3. Java/Spring Boot</span>
                                <Badge className="bg-blue-600">285 jobs</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-700 flex items-center gap-2">
                            <Building2 size={16} />
                            Major Employers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">Infosys BPM</span>
                                <span className="text-green-600 text-xs">2,500+ employees</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">Cognizant</span>
                                <span className="text-green-600 text-xs">2,000+ employees</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">STPI Registered</span>
                                <span className="text-green-600 text-xs">250+ companies</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SWOT Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-700">
                        Dakshina Kannada Job Market - SWOT Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <h5 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                                <span className="text-xl">✓</span> Strengths
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-green-800 space-y-1">
                                <li>Strong BPO/IT services sector (1,300+ openings)</li>
                                <li>Growing tech ecosystem (225+ companies)</li>
                                <li>Lower cost advantage vs Bengaluru (10-25%)</li>
                                <li>Premier talent from NITK Surathkal</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                            <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                                <span className="text-xl">✗</span> Weaknesses
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-red-800 space-y-1">
                                <li>Limited advanced tech roles (Cloud: 120, DevOps: 95)</li>
                                <li>Heavy dependence on IT services/BPO</li>
                                <li>Product company presence still nascent</li>
                                <li>Salary levels lower than tier-1 cities</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <h5 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                                <span className="text-xl">◐</span> Opportunities
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                                <li>KDEM ₹1,000 cr investment committed</li>
                                <li>Beyond Bengaluru initiative targeting 10k+ jobs</li>
                                <li>Growing GCC interest (BOSE, EG Danmark)</li>
                                <li>Python/Cloud skill demand creates training market</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                            <h5 className="font-bold text-orange-700 mb-2 flex items-center gap-2">
                                <span className="text-xl">⚠</span> Threats
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-orange-800 space-y-1">
                                <li>Competition from Bengaluru for talent</li>
                                <li>Global tech slowdown affecting hiring</li>
                                <li>Skill gaps in emerging tech (Cloud: 63% gap)</li>
                                <li>Infrastructure constraints vs metro cities</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
