import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Lightbulb, AlertTriangle, ArrowRight, Zap, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

export default function InsightsPanel() {
    return (
        <div className="space-y-6">
            {/* Main Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Priority Skills - Real DK Data */}
                <Card className="border-t-4 border-t-red-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-red-600">
                            <AlertTriangle size={20} /> Critical Skill Gaps
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="p-2 bg-red-50 rounded text-sm font-medium text-red-800">
                                1. Cloud/DevOps (63% gap)
                                <div className="text-xs text-red-600 mt-0.5">120 demand, 45 supply</div>
                            </li>
                            <li className="p-2 bg-red-50 rounded text-sm font-medium text-red-800">
                                2. Data Science (50% gap)
                                <div className="text-xs text-red-600 mt-0.5">150 demand, 75 supply</div>
                            </li>
                            <li className="p-2 bg-red-50 rounded text-sm font-medium text-red-800">
                                3. Soft Skills (40% gap)
                                <div className="text-xs text-red-600 mt-0.5">Affects all sectors</div>
                            </li>
                        </ul>
                        <Button variant="link" className="mt-3 text-red-600 p-0 h-auto text-xs">
                            View Complete Gap Analysis <ArrowRight size={12} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Recommended Programs - Real Programs */}
                <Card className="border-t-4 border-t-blue-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-blue-600">
                            <Lightbulb size={20} /> Recommended Programs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="p-2 bg-blue-50 rounded text-sm font-medium text-blue-800">
                                AWS/GCP Cloud Certification
                                <div className="text-xs text-blue-600 mt-0.5">Address 63% Cloud gap</div>
                            </li>
                            <li className="p-2 bg-blue-50 rounded text-sm font-medium text-blue-800">
                                Python + Django Bootcamp
                                <div className="text-xs text-blue-600 mt-0.5">398 job openings</div>
                            </li>
                            <li className="p-2 bg-blue-50 rounded text-sm font-medium text-blue-800">
                                MERN Stack Development
                                <div className="text-xs text-blue-600 mt-0.5">180 openings, 33% gap</div>
                            </li>
                        </ul>
                        <Button variant="link" className="mt-3 text-blue-600 p-0 h-auto text-xs">
                            Launch Training Program <ArrowRight size={12} className="ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* COE Activation - Real DK COE Data */}
                <Card className="border-t-4 border-t-orange-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-orange-600">
                            <Zap size={20} /> COE Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-700 font-semibold mb-1">SJEC NAIN Center</p>
                                <p className="text-xs text-slate-600">
                                    73% utilization • <span className="font-semibold text-orange-600">Opportunity:</span> Launch Cloud/DevOps lab with AWS partnership
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-700 font-semibold mb-1">STPI Mangaluru</p>
                                <p className="text-xs text-slate-600">
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
                        <CardTitle className="flex items-center gap-2 text-base text-green-600">
                            <TrendingUp size={20} /> Funding Opportunities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="p-2 bg-green-50 rounded">
                                <p className="text-sm font-semibold text-green-800">KDEM Mangaluru Cluster</p>
                                <p className="text-xs text-green-700 mt-0.5">
                                    ₹1,000 cr investment • Beyond Bengaluru initiative
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded">
                                <p className="text-sm font-semibold text-green-800">Karnataka Startup Policy</p>
                                <p className="text-xs text-green-700 mt-0.5">
                                    ₹518 cr budget (2025-30) • Seed funding available
                                </p>
                            </div>
                        </div>
                        <Button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-xs">
                            Apply for Grant
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Branch-Specific Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Computer Science & IT */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-blue-800">Computer Science & IT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-blue-900">Highest Demand Skills</span>
                                    <span className="text-xs text-blue-700">850+ openings</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-800">Python</span>
                                        <span className="font-bold text-blue-600">398 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-800">Java/Spring</span>
                                        <span className="font-bold text-blue-600">285 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-800">React/Frontend</span>
                                        <span className="font-bold text-blue-600">245 jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-blue-200">
                                <p className="text-xs text-blue-800">
                                    <strong>Salary Range:</strong> ₹3.5-16 LPA
                                </p>
                                <p className="text-xs text-blue-800 mt-1">
                                    <strong>Top Companies:</strong> Infosys BPM, Cognizant, EG Danmark, Winman
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Electronics & Communication */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-purple-800">Electronics & Communication</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-purple-900">Core Skills in Demand</span>
                                    <span className="text-xs text-purple-700">180+ openings</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-purple-800">Embedded Systems</span>
                                        <span className="font-bold text-purple-600">85 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-purple-800">IoT Development</span>
                                        <span className="font-bold text-purple-600">55 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-purple-800">PCB Design</span>
                                        <span className="font-bold text-purple-600">40 jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-purple-200">
                                <p className="text-xs text-purple-800">
                                    <strong>Salary Range:</strong> ₹3.5-9 LPA
                                </p>
                                <p className="text-xs text-purple-800 mt-1">
                                    <strong>Top Company:</strong> BOSE Professional (Audio Systems)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mechanical & Civil Engineering */}
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-orange-800">Mechanical & Civil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-orange-900">Key Skill Areas</span>
                                    <span className="text-xs text-orange-700">140+ openings</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-orange-800">CAD/CAM (SolidWorks)</span>
                                        <span className="font-bold text-orange-600">65 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-orange-800">CNC Programming</span>
                                        <span className="font-bold text-orange-600">45 jobs</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-orange-800">AutoCAD Civil 3D</span>
                                        <span className="font-bold text-orange-600">30 jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-orange-200">
                                <p className="text-xs text-orange-800">
                                    <strong>Salary Range:</strong> ₹2.5-6 LPA
                                </p>
                                <p className="text-xs text-orange-800 mt-1">
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
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">650+</div>
                    <div className="text-xs text-slate-600 mt-1">Unfilled Positions</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">3,400</div>
                    <div className="text-xs text-slate-600 mt-1">Students Need Upskilling</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">₹1,000 Cr</div>
                    <div className="text-xs text-slate-600 mt-1">KDEM Investment</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">10,000+</div>
                    <div className="text-xs text-slate-600 mt-1">Job Target by 2026</div>
                </div>
            </div>
        </div>
    );
}
