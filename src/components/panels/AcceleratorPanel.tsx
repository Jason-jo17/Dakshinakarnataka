import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { GraduationCap, Trophy, Target, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';
import { Badge } from "../ui/badge";

import StatCard from "../StatCard";
import { Progress } from "../ui/progress";

interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
}

export default function AcceleratorPanel({ filters }: PanelProps) {
    void filters;
    // Data for 17 Unique Dakshina Kannada Institutions (Excluding Udupi/Manipal/Nitte)
    const funnelData = [
        { value: 24500, name: 'Total Students', fill: '#94a3b8' },
        { value: 6200, name: 'Annual Graduates', fill: '#60a5fa' },
        { value: 4500, name: 'Assessed', fill: '#3b82f6' },
        { value: 3800, name: 'Certified/Trained', fill: '#2563eb' },
        { value: 3400, name: 'Placed', fill: '#16a34a' },
    ];

    return (
        <div className="space-y-6">
            {/* DK SWTT Level Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Institutions at L2"
                    value="8"
                    icon={Target}
                    color="orange"
                    subtitle="Developing Tier"
                />
                <StatCard
                    title="Institutions at L3"
                    value="4"
                    icon={Target}
                    color="blue"
                    subtitle="High Performing"
                />
                <StatCard
                    title="Institutions at L4"
                    value="1"
                    icon={Trophy}
                    color="green"
                    subtitle="Premier (NITK)"
                />
                <StatCard
                    title="Avg Placement Rate"
                    value="62%"
                    icon={TrendingUp}
                    color="green"
                    subtitle="DK District Avg"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Talent Pipeline Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Dakshina Kannada Talent Pipeline (17 Institutions)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip
                                    contentStyle={{ fontSize: '12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    formatter={(value) => value.toLocaleString()}
                                />
                                <Funnel
                                    dataKey="value"
                                    data={funnelData}
                                    isAnimationActive
                                >
                                    <LabelList
                                        position="right"
                                        fill="#000"
                                        stroke="none"
                                        dataKey="name"
                                        style={{ fontSize: '12px' }}
                                    />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                        <div className="mt-4 text-xs text-center text-slate-600">
                            <strong>Conversion Rate:</strong> ~55% of graduates placed (excluding Manipal/Nitte data)
                        </div>
                    </CardContent>
                </Card>

                {/* Strategic Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-icon">
                            Strategic Recommendations for Dakshina Kannada
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-r">
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                                    Priority: Rural & L1 Support
                                </h5>
                                <p className="text-xs text-text mt-1">
                                    <strong>Target:</strong> KVG Sullia, Karavali, Bearys, Shree Devi
                                </p>
                                <p className="text-xs text-text mt-1">
                                    <strong>Action:</strong> Digital Infrastructure Grant & Faculty Upskilling
                                </p>
                            </div>

                            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r">
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                    <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                                    Hub & Spoke Model
                                </h5>
                                <p className="text-xs text-text mt-1">
                                    <strong>Hubs (L3/L4):</strong> NITK, SJEC, Sahyadri to mentor L1 colleges
                                </p>
                                <p className="text-xs text-text mt-1">
                                    <strong>Goal:</strong> Shared placement drives and lab access
                                </p>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-r">
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                    <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                                    Placement Activation
                                </h5>
                                <p className="text-xs text-text mt-1">
                                    <strong>Gap:</strong> ~2,500 unplaced graduates in district
                                </p>
                                <p className="text-xs text-text mt-1">
                                    <strong>Action:</strong> District-level mega job fair in Mangalore (Q2 2025)
                                </p>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-r">
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                                    <GraduationCap size={16} className="text-orange-600 dark:text-orange-400" />
                                    Curriculum Update
                                </h5>
                                <p className="text-xs text-text mt-1">
                                    <strong>Focus:</strong> Align L2 college curriculum with Mangalore tech cluster needs
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Institution-wise SWTT Level Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-text">
                        Institution Performance Matrix (17 DK Colleges)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Level 4 - Premier */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-600">Level 4 - Premier</Badge>
                                <span className="text-xs text-icon">1 institution • Global Standard</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-green-900 dark:text-green-100">NITK Surathkal</p>
                                            <p className="text-xs text-green-700 dark:text-green-300">NIRF #17 | 93% placement | ₹16.25 LPA avg</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-600 dark:text-green-400">756 placed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Level 3 - High Performing */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-600">Level 3 - High Performing</Badge>
                                <span className="text-xs text-icon">4 institutions • 75-80% placement</span>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Alva's Inst. of Engg (Moodbidri)</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">85% placement | Major Placement Hub</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">680 placed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">St Joseph Engineering (Vamanjoor)</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">78% placement | ₹5.6 LPA avg</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">546 placed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Sahyadri College (Adyar)</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">78% placement | Start-up Ecosystem</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">585 placed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">MITE (Moodbidri)</p>
                                            <p className="text-xs text-blue-700 dark:text-blue-300">76% placement | Industry Tie-ups</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">532 placed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Level 2 - Developing */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-orange-600">Level 2 - Developing</Badge>
                                <span className="text-xs text-icon">8 institutions • 60-70% placement</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Srinivas Inst. (Valachil)</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">68% | ₹3.8 LPA | 447 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Yenepoya Inst. (YIT)</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">65% | ₹4.0 LPA | 360 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Canara Engineering</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">65% | ₹4.0 LPA | 325 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">PA College (PACE)</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">62% | ₹3.8 LPA | 385 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">AJ Institute</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">60% | ₹3.8 LPA | 270 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Vivekananda (Puttur)</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">60% | ₹3.5 LPA | 240 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">SDM Institute (Ujire)</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">60% | ₹3.5 LPA | 225 placed</p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2">
                                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Srinivas Univ. (Mukka)</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">60% | ₹3.5 LPA | 180 placed</p>
                                </div>
                            </div>
                        </div>

                        {/* Level 1 - Needs Support */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-red-600">Level 1 - Needs Support</Badge>
                                <span className="text-xs text-icon">4 institutions • &lt;60% placement</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                                    <p className="font-semibold text-red-900 dark:text-red-100 text-sm">Bearys Institute (BIT)</p>
                                    <p className="text-xs text-red-700 dark:text-red-300">55% | ₹3.5 LPA | Needs Infra</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                                    <p className="font-semibold text-red-900 dark:text-red-100 text-sm">Shree Devi Institute</p>
                                    <p className="text-xs text-red-700 dark:text-red-300">58% | ₹3.5 LPA | Skill Gap</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                                    <p className="font-semibold text-red-900 dark:text-red-100 text-sm">KVG College (Sullia)</p>
                                    <p className="text-xs text-red-700 dark:text-red-300">50% | ₹3.2 LPA | Remote Loc</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                                    <p className="font-semibold text-red-900 dark:text-red-100 text-sm">Karavali Institute</p>
                                    <p className="text-xs text-red-700 dark:text-red-300">45% | ₹3.0 LPA | Data Gap</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* Branch-Specific Performance Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-text">
                        Branch-wise Placement Performance (DK District)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Computer Science & IT */}
                        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="font-bold text-blue-900 dark:text-blue-100">Computer Science & IT</h5>
                                <Badge className="bg-blue-600">82-90% placement</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-800 dark:text-blue-200">Avg Placement Rate:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">85%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-800 dark:text-blue-200">Avg Salary:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">₹4.8 LPA</span>
                                </div>
                                <Progress value={85} className="h-2 bg-blue-200 dark:bg-blue-900/50" indicatorClassName="bg-blue-600 dark:bg-blue-500" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                    <strong>Top Skills:</strong> Python, Java, Web Dev
                                </p>
                            </div>
                        </div>

                        {/* Electronics & Communication */}
                        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="font-bold text-purple-900 dark:text-purple-100">Electronics & Communication</h5>
                                <Badge className="bg-purple-600">70-75% placement</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-800 dark:text-purple-200">Avg Placement Rate:</span>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">72%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-800 dark:text-purple-200">Avg Salary:</span>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">₹4.2 LPA</span>
                                </div>
                                <Progress value={72} className="h-2 bg-purple-200 dark:bg-purple-900/50" indicatorClassName="bg-purple-600 dark:bg-purple-500" />
                                <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                                    <strong>Top Skills:</strong> IoT, Embedded Systems
                                </p>
                            </div>
                        </div>

                        {/* Mechanical Engineering */}
                        <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="font-bold text-orange-900 dark:text-orange-100">Mechanical Engineering</h5>
                                <Badge className="bg-orange-600">50-60% placement</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-orange-800 dark:text-orange-200">Avg Placement Rate:</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">55%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-orange-800 dark:text-orange-200">Avg Salary:</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">₹3.2 LPA</span>
                                </div>
                                <Progress value={55} className="h-2 bg-orange-200 dark:bg-orange-900/50" indicatorClassName="bg-orange-600 dark:bg-orange-500" />
                                <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                                    <strong>Priority:</strong> AutoCAD, CNC, Design Tools
                                </p>
                            </div>
                        </div>

                        {/* Civil Engineering */}
                        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="font-bold text-amber-900 dark:text-amber-100">Civil Engineering</h5>
                                <Badge className="bg-amber-600">45-50% placement</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-800 dark:text-amber-200">Avg Placement Rate:</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">48%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-800 dark:text-amber-200">Avg Salary:</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">₹3.0 LPA</span>
                                </div>
                                <Progress value={48} className="h-2 bg-amber-200 dark:bg-amber-900/50" indicatorClassName="bg-amber-600 dark:bg-amber-500" />
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                                    <strong>Priority:</strong> Site Mgmt, Surveying, CAD
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Plan Timeline */}
            <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white">
                <CardHeader>
                    <CardTitle className="text-base text-gray-100">Recommended Action Plan - Dakshina Kannada</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                            <p className="font-bold mb-2 text-yellow-400">Q1 2025 (Immediate)</p>
                            <ul className="text-xs space-y-1 text-slate-300">
                                <li>• Launch Python/Cloud bootcamps for L1/L2</li>
                                <li>• Partner with local Mangalore IT firms</li>
                                <li>• Upgrade L1 institutions infrastructure</li>
                            </ul>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                            <p className="font-bold mb-2 text-blue-400">Q2-Q3 2025 (Short-term)</p>
                            <ul className="text-xs space-y-1 text-slate-300">
                                <li>• Establish shared placement cells</li>
                                <li>• Mandatory internships for all L2 colleges</li>
                                <li>• Update curricula with Industry electives</li>
                            </ul>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                            <p className="font-bold mb-2 text-green-400">Q4 2025+ (Long-term)</p>
                            <ul className="text-xs space-y-1 text-slate-300">
                                <li>• Target: Move 2 colleges from L1 to L2</li>
                                <li>• Goal: 75% district placement rate by 2026</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
