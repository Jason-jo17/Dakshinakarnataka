import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Lightbulb, AlertTriangle, ArrowRight, Zap, TrendingUp, Briefcase } from "lucide-react";
import { Button } from "../ui/button";

interface PanelProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
    };
    onTabChange?: (tab: string) => void;
}

export default function InsightsPanel({ filters, onTabChange }: PanelProps) {
    void filters;
    return (
        <div className="space-y-6">
            {/* Main Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Priority Skills - Real DK Data */}
                <Card className="border-t-4 border-t-red-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400">
                            <AlertTriangle size={20} /> Critical Skill Gaps
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm font-medium text-red-800 dark:text-red-200">
                                1. Cloud/DevOps (63% gap)
                                <div className="text-xs text-red-600 dark:text-red-400 mt-0.5">120 demand, 45 supply</div>
                            </li>
                            <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm font-medium text-red-800 dark:text-red-200">
                                2. Data Science (50% gap)
                                <div className="text-xs text-red-600 dark:text-red-400 mt-0.5">150 demand, 75 supply</div>
                            </li>
                            <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm font-medium text-red-800 dark:text-red-200">
                                3. Soft Skills (40% gap)
                                <div className="text-xs text-red-600 dark:text-red-400 mt-0.5">Affects all sectors</div>
                            </li>
                        </ul>
                        <Button
                            variant="link"
                            className="mt-3 text-red-600 dark:text-red-400 p-0 h-auto text-xs"
                            onClick={() => onTabChange?.('gap')}
                        >
                            View Complete Gap Analysis <ArrowRight size={12} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Recommended Programs - Real Programs */}
                <Card className="border-t-4 border-t-blue-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-blue-600 dark:text-blue-400">
                            <Lightbulb size={20} /> Recommended Programs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm font-medium text-blue-800 dark:text-blue-200">
                                AWS/GCP Cloud Certification
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Address 63% Cloud gap</div>
                            </li>
                            <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm font-medium text-blue-800 dark:text-blue-200">
                                Python + Django Bootcamp
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">398 job openings</div>
                            </li>
                            <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm font-medium text-blue-800 dark:text-blue-200">
                                MERN Stack Development
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">180 openings, 33% gap</div>
                            </li>
                        </ul>
                        <Button variant="link" className="mt-3 text-blue-600 dark:text-blue-400 p-0 h-auto text-xs">
                            Launch Training Program <ArrowRight size={12} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* COE Activation - Real DK COE Data */}
                <Card className="border-t-4 border-t-orange-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-orange-600 dark:text-orange-400">
                            <Zap size={20} /> COE Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-text font-semibold mb-1">SJEC NAIN Center</p>
                                <p className="text-xs text-icon">
                                    73% utilization • <span className="font-semibold text-orange-600 dark:text-orange-400">Opportunity:</span> Launch Cloud/DevOps lab with AWS partnership
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-text font-semibold mb-1">STPI Mangaluru</p>
                                <p className="text-xs text-icon">
                                    75% utilization • Target 90% with 50 new startups by Q2 2025
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                            Create Action Plan
                        </Button>
                    </CardContent>
                </Card>

                {/* Policy & Funding - Real KDEM Data */}
                <Card className="border-t-4 border-t-green-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-green-600 dark:text-green-400">
                            <TrendingUp size={20} /> Funding Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">KDEM Mangaluru Cluster</p>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                                    ₹1,000 cr investment • Beyond Bengaluru initiative
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <p className="text-sm font-semibold text-green-800 dark:text-green-200">Karnataka Startup Policy</p>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                                    ₹518 cr budget (2025-30) • Seed funding available
                                </p>
                            </div>
                        </div>
                        <Button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-xs text-white">
                            Apply for Grant
                        </Button>
                    </CardContent>
                </Card>

                {/* Placements Insights - New Card */}
                <Card className="border-t-4 border-t-purple-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-purple-600 dark:text-purple-400">
                            <Briefcase size={20} /> Placements Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">2024 Placement Rate</p>
                                <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                                    78% overall • 1,240 students placed
                                </p>
                            </div>
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Top Recruiters</p>
                                <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                                    Infosys, TCS, Cognizant, Accenture
                                </p>
                            </div>
                        </div>
                        <Button
                            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-xs text-white"
                            onClick={() => window.open('https://inpulse-staging-recruitment.web.app/signin', '_blank')}
                        >
                            View Recruitment Portal <ArrowRight size={12} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Branch-Specific Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Computer Science & IT */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-blue-800 dark:text-blue-200">Computer Science & IT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Highest Demand Skills</span>
                                    <span className="text-xs text-blue-700 dark:text-blue-300">850+ openings</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-800 dark:text-blue-200">Python</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">398 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-800 dark:text-blue-200">Java/Spring</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">285 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-800 dark:text-blue-200">React/Frontend</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">245 jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                    <strong>Salary Range:</strong> ₹3.5-16 LPA
                                </p>
                                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                                    <strong>Top Companies:</strong> Infosys BPM, Cognizant, EG Danmark, Winman
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Electronics & Communication */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-purple-800 dark:text-purple-200">Electronics & Communication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Core Skills in Demand</span>
                                    <span className="text-xs text-purple-700 dark:text-purple-300">180+ openings</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-purple-800 dark:text-purple-200">Embedded Systems</span>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">85 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-purple-800 dark:text-purple-200">IoT Development</span>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">55 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-purple-800 dark:text-purple-200">PCB Design</span>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">40 jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                                <p className="text-xs text-purple-800 dark:text-purple-200">
                                    <strong>Salary Range:</strong> ₹3.5-9 LPA
                                </p>
                                <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">
                                    <strong>Top Company:</strong> BOSE Professional (Audio Systems)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mechanical & Civil Engineering */}
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-orange-800 dark:text-orange-200">Mechanical & Civil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-orange-900 dark:text-orange-100">Key Skill Areas</span>
                                    <span className="text-xs text-orange-700 dark:text-orange-300">140+ openings</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-orange-800 dark:text-orange-200">CAD/CAM (SolidWorks)</span>
                                        <span className="font-bold text-orange-600 dark:text-orange-400">65 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-orange-800 dark:text-orange-200">CNC Programming</span>
                                        <span className="font-bold text-orange-600 dark:text-orange-400">45 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-orange-800 dark:text-orange-200">AutoCAD Civil 3D</span>
                                        <span className="font-bold text-orange-600 dark:text-orange-400">30 jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
                                <p className="text-xs text-orange-800 dark:text-orange-200">
                                    <strong>Salary Range:</strong> ₹2.5-6 LPA
                                </p>
                                <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                                    <strong>Note:</strong> Lower placement rates (58-65%) - needs upskilling focus
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Strategic Recommendations Banner */}
            <Card className="bg-gradient-to-r from-slate-700 to-slate-800 border-slate-700 text-white">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="text-slate-900" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Key Strategic Recommendations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div className="bg-slate-600 rounded-lg p-4">
                                    <p className="font-bold text-sm mb-1">Short-term (0-6 months)</p>
                                    <ul className="text-xs space-y-1 text-slate-200">
                                        <li>• Launch Python bootcamps (500+ students)</li>
                                        <li>• Partner with STPI for Cloud certification</li>
                                        <li>• Implement soft skills training district-wide</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-600 rounded-lg p-4">
                                    <p className="font-bold text-sm mb-1">Medium-term (6-18 months)</p>
                                    <ul className="text-xs space-y-1 text-slate-200">
                                        <li>• Establish Cloud/DevOps CoE at St Joseph's</li>
                                        <li>• Update curricula: Add MERN Stack</li>
                                        <li>• Mandatory 6-month industry internships</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-600 rounded-lg p-4">
                                    <p className="font-bold text-sm mb-1">Long-term (18+ months)</p>
                                    <ul className="text-xs space-y-1 text-slate-200">
                                        <li>• Leverage KDEM ₹1,000 cr investment</li>
                                        <li>• Target: 10,000+ new tech jobs by 2026</li>
                                        <li>• Reduce skill gap from 28% to 15%</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">650+</div>
                    <div className="text-xs text-icon mt-1">Unfilled Positions</div>
                </div>
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3,400</div>
                    <div className="text-xs text-icon mt-1">Students Need Upskilling</div>
                </div>
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹1,000 Cr</div>
                    <div className="text-xs text-icon mt-1">KDEM Investment</div>
                </div>
                <div className="bg-surface rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10,000+</div>
                    <div className="text-xs text-icon mt-1">Job Target by 2026</div>
                </div>
            </div>
        </div>
    );
}
