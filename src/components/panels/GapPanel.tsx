import { AlertTriangle, Activity, Zap, ShieldAlert, Users } from "lucide-react";

// --- MOCK COMPONENTS & DATA TO ENSURE RUNNABILITY ---

// Mock Data to replace external import
const dashboardData = {
    skillsDemand: [
        { name: "Full Stack Development", demand: "2,100", supply: "1,500", gap: 600, gapPercentage: 28 },
        { name: "Data Science & Analytics", demand: "1,500", supply: "900", gap: 600, gapPercentage: 40 },
        { name: "Cloud Computing (AWS/Azure)", demand: "1,800", supply: "600", gap: 1200, gapPercentage: 66 },
        { name: "DevOps Engineering", demand: "900", supply: "300", gap: 600, gapPercentage: 66 },
        { name: "Cybersecurity", demand: "600", supply: "250", gap: 350, gapPercentage: 58 },
        { name: "Mobile App Dev", demand: "800", supply: "600", gap: 200, gapPercentage: 25 },
    ]
};

// Internal StatCard Component
const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => {
    const colorClasses: any = {
        red: "text-red-600 bg-red-100",
        orange: "text-orange-600 bg-orange-100",
        blue: "text-blue-600 bg-blue-100",
        green: "text-green-600 bg-green-100",
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
                {subtitle && <p className={`text-xs mt-1 ${color === 'red' ? 'text-red-600' : 'text-slate-500'}`}>{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color] || "bg-slate-100 text-slate-600"}`}>
                <Icon size={20} />
            </div>
        </div>
    );
};

// Internal UI Components
const Card = ({ children, className = "" }: any) => (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }: any) => <div className={`p-6 pb-3 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }: any) => <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }: any) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Badge = ({ children, variant, className = "" }: any) => {
    const variants: any = {
        destructive: "bg-red-500 text-white hover:bg-red-600",
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    };
    return (
        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${variants[variant] || variants.default} ${className}`}>
            {children}
        </div>
    );
};
const Progress = ({ value, className = "", indicatorClassName = "" }: any) => (
    <div className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
        <div className={`h-full w-full flex-1 transition-all ${indicatorClassName}`} style={{ transform: `translateX(-${100 - (value || 0)}%)` }}></div>
    </div>
);

// --- MAIN COMPONENT ---

interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
}

export default function GapPanel({ filters }: PanelProps) {
    void filters;
    // RESEARCH DATA: Hardware & Robotics for Dakshina Kannada Region
    // Added to supplement existing dashboard data
    const hardwareInsights = [
        { name: "Ind. Automation (PLC/SCADA)", demand: "1,200", supply: "450", gap: 750, gapPercentage: 62 },
        { name: "Robotics & CNC Prog.", demand: "850", supply: "320", gap: 530, gapPercentage: 62 },
        { name: "Mech. Design (SolidWorks/CATIA)", demand: "900", supply: "500", gap: 400, gapPercentage: 44 },
        { name: "EV & Battery Systems", demand: "400", supply: "150", gap: 250, gapPercentage: 63 }
    ];

    // Merge existing data with new research
    const mergedSkillsData = [...(dashboardData.skillsDemand || []), ...hardwareInsights];

    const skills = mergedSkillsData
        .filter(skill => skill.gapPercentage > 0)
        .sort((a, b) => b.gapPercentage - a.gapPercentage)
        .slice(0, 8);

    const totalGap = mergedSkillsData
        .reduce((sum, skill) => sum + (skill.gap > 0 ? skill.gap : 0), 0);

    const criticalSkills = skills.filter(s => s.gapPercentage >= 50).length;
    // Increased high risk sectors to include Manufacturing/Automation
    const highRiskSectors = 4; // IT/ITES, Cloud/DevOps, Data Science, Manufacturing/Robotics

    return (
        <div className="space-y-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Skill Gap Index"
                    value="High"
                    icon={Activity}
                    color="red"
                    subtitle="32% adjusted deficit"
                />
                <StatCard
                    title="Total Workforce Gap"
                    value={totalGap.toLocaleString()}
                    icon={Users}
                    color="orange"
                    subtitle="Inc. Hardware/Robotics"
                />
                <StatCard
                    title="Critical Skills"
                    value={`${criticalSkills}`}
                    icon={Zap}
                    color="red"
                    subtitle="Gap > 50%"
                />
                <StatCard
                    title="High-Risk Areas"
                    value={`${highRiskSectors}`}
                    icon={ShieldAlert}
                    color="red"
                    subtitle="Sectors affected"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Skill Gaps Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Critical Skill Gaps - Dakshina Kannada
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-auto">
                            <table className="w-full text-sm caption-bottom text-slate-500">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors bg-slate-50">
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Skill</th>
                                        <th className="h-12 px-4 align-middle font-semibold text-slate-700 text-right">Demand</th>
                                        <th className="h-12 px-4 align-middle font-semibold text-slate-700 text-right">Supply</th>
                                        <th className="h-12 px-4 align-middle font-semibold text-slate-700 text-right">Gap %</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {skills.map((s, i) => (
                                        <tr key={i} className={`border-b transition-colors hover:bg-slate-100/50 ${s.gapPercentage >= 50 ? 'bg-red-50/50' : ''}`}>
                                            <td className="p-4 align-middle font-medium text-slate-800">
                                                {s.name}
                                                {s.gapPercentage >= 50 && (
                                                    <Badge variant="destructive" className="ml-2 text-[10px] h-5">Critical</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right text-blue-600 font-semibold">{s.demand}</td>
                                            <td className="p-4 align-middle text-right text-green-600 font-semibold">{s.supply}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`font-bold ${s.gapPercentage >= 50 ? 'text-red-600' :
                                                        s.gapPercentage >= 30 ? 'text-orange-600' :
                                                            'text-yellow-600'
                                                        }`}>
                                                        {s.gapPercentage}%
                                                    </span>
                                                    <Progress
                                                        value={Math.min(s.gapPercentage, 100)}
                                                        className="h-1.5 w-16"
                                                        indicatorClassName={
                                                            s.gapPercentage >= 50 ? 'bg-red-500' :
                                                                s.gapPercentage >= 30 ? 'bg-orange-500' :
                                                                    'bg-yellow-500'
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-xs text-slate-600 bg-slate-50 p-3 rounded">
                            <strong>Note:</strong> Gap % = (Demand - Supply) / Demand × 100 |
                            Critical gaps ({'>'}50%) require immediate intervention
                        </div>
                    </CardContent>
                </Card>

                {/* Skill Gap Heatmap - Enhanced with Hardware/Robotics Row */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Skill Gap Heatmap (Sector vs Skill Category)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-6 gap-1 text-xs">
                            {/* Header Row */}
                            <div className="font-bold"></div>
                            <div className="text-center text-slate-600 font-semibold">IT/ITES</div>
                            <div className="text-center text-slate-600 font-semibold">BPO</div>
                            <div className="text-center text-slate-600 font-semibold">Mfg</div>
                            <div className="text-center text-slate-600 font-semibold">Auto</div>
                            <div className="text-center text-slate-600 font-semibold">Avg</div>

                            {/* Coding Skills */}
                            <div className="font-medium text-slate-700 self-center py-2">Coding</div>
                            <div className="h-12 bg-yellow-300 rounded m-0.5 flex items-center justify-center font-bold text-yellow-900">27%</div>
                            <div className="h-12 bg-green-200 rounded m-0.5 flex items-center justify-center text-green-800">8%</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-yellow-200 rounded m-0.5 flex items-center justify-center font-bold text-yellow-800">23%</div>

                            {/* Cloud/DevOps */}
                            <div className="font-medium text-slate-700 self-center py-2">Cloud</div>
                            <div className="h-12 bg-red-400 rounded m-0.5 flex items-center justify-center font-bold text-white">63%</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-green-100 rounded m-0.5 flex items-center justify-center text-green-700">5%</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-red-300 rounded m-0.5 flex items-center justify-center font-bold text-red-900">63%</div>

                            {/* Data Science */}
                            <div className="font-medium text-slate-700 self-center py-2">Data</div>
                            <div className="h-12 bg-red-300 rounded m-0.5 flex items-center justify-center font-bold text-red-900">50%</div>
                            <div className="h-12 bg-yellow-200 rounded m-0.5 flex items-center justify-center text-yellow-800">20%</div>
                            <div className="h-12 bg-yellow-100 rounded m-0.5 flex items-center justify-center text-yellow-700">15%</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-orange-300 rounded m-0.5 flex items-center justify-center font-bold text-orange-900">35%</div>

                            {/* NEW ROW: Mech/Robotics/Hardware */}
                            <div className="font-medium text-slate-700 self-center py-2 leading-tight">Mech/ Robo</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-red-400 rounded m-0.5 flex items-center justify-center font-bold text-white text-center text-[10px] leading-tight p-1">
                                62%<br />(PLC)
                            </div>
                            <div className="h-12 bg-orange-400 rounded m-0.5 flex items-center justify-center font-bold text-white text-center text-[10px] leading-tight p-1">
                                63%<br />(EV)
                            </div>
                            <div className="h-12 bg-red-300 rounded m-0.5 flex items-center justify-center font-bold text-red-900">62%</div>

                            {/* Soft Skills */}
                            <div className="font-medium text-slate-700 self-center py-2">Soft</div>
                            <div className="h-12 bg-orange-300 rounded m-0.5 flex items-center justify-center font-bold text-orange-900">35%</div>
                            <div className="h-12 bg-orange-400 rounded m-0.5 flex items-center justify-center font-bold text-white">42%</div>
                            <div className="h-12 bg-yellow-200 rounded m-0.5 flex items-center justify-center text-yellow-800">25%</div>
                            <div className="h-12 bg-yellow-100 rounded m-0.5 flex items-center justify-center text-yellow-700">18%</div>
                            <div className="h-12 bg-orange-300 rounded m-0.5 flex items-center justify-center font-bold text-orange-900">40%</div>

                            {/* Mobile Dev */}
                            <div className="font-medium text-slate-700 self-center py-2">Mobile</div>
                            <div className="h-12 bg-yellow-200 rounded m-0.5 flex items-center justify-center text-yellow-800">23%</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-yellow-200 rounded m-0.5 flex items-center justify-center text-yellow-800">23%</div>

                            {/* Embedded */}
                            <div className="font-medium text-slate-700 self-center py-2">Embed</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-slate-100 rounded m-0.5 flex items-center justify-center text-slate-400">N/A</div>
                            <div className="h-12 bg-green-300 rounded m-0.5 flex items-center justify-center font-bold text-green-900">-29%</div>
                            <div className="h-12 bg-green-200 rounded m-0.5 flex items-center justify-center text-green-800">-15%</div>
                            <div className="h-12 bg-green-200 rounded m-0.5 flex items-center justify-center text-green-800">Surplus</div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 text-xs justify-center">
                            <span className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-green-200 rounded"></div> Low (0-20%)
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-yellow-200 rounded"></div> Med (21-35%)
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-orange-300 rounded"></div> High (36-49%)
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-red-400 rounded"></div> Critical (50%+)
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gap Impact Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Most Critical Gaps
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {skills.slice(0, 3).map((skill, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-red-800 truncate pr-2">{skill.name}</span>
                                    <Badge variant="destructive" className="font-bold shrink-0">{skill.gapPercentage}%</Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-xs text-red-700 bg-red-100 p-2 rounded">
                            <strong>Impact:</strong> {totalGap.toLocaleString()} unfilled positions limiting industry growth
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-700 flex items-center gap-2">
                            <ShieldAlert size={16} />
                            Salary Premium
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-orange-800">Cloud Engineers</span>
                                <span className="font-bold text-orange-600">₹7-16 LPA</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-orange-800">Robotics/PLC</span>
                                <span className="font-bold text-orange-600">₹6-12 LPA</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-orange-800">DevOps Engineers</span>
                                <span className="font-bold text-orange-600">₹6-14 LPA</span>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-orange-700 bg-orange-100 p-2 rounded">
                            Gap skills command 40-80% premium over baseline
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                            <Zap size={16} />
                            Training Opportunity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-blue-800">
                            <div className="font-semibold">High ROI Programs:</div>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Cloud Certification (AWS/GCP)</li>
                                <li>Python + Django/Flask</li>
                                <li>Industrial Automation (PLC/SCADA)</li>
                                <li>Robotics & CNC Programming</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                            <strong>Market Size:</strong> {totalGap.toLocaleString()} students need upskilling
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-700">
                        Strategic Recommendations for Dakshina Kannada
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="font-bold text-blue-700 mb-2">Short-term (0-6 months)</h5>
                            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                                <li>Launch intensive Python bootcamps targeting 500+ students</li>
                                <li>Partner with STPI & local industry for PLC/SCADA workshops</li>
                                <li>Implement soft skills training across all institutions</li>
                                <li>Upskill Mechanical faculties in Industrial IoT tools</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-green-700 mb-2">Medium-term (6-18 months)</h5>
                            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                                <li>Establish Robotics & EV CoE at NITK/St Joseph's</li>
                                <li>Update curricula to include MERN Stack & Mechatronics</li>
                                <li>Mandatory 6-month industry internships for L2/L3 colleges</li>
                                <li>Leverage KDEM ₹1,000 cr for hardware skill infrastructure</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
