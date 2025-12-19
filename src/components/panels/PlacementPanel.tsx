import React from 'react';
import StatCard from '../StatCard';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { DollarSign, Briefcase, TrendingUp, Building, Trophy, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { dashboardData } from '../../data/dashboardData';

export default function PlacementPanel() {
    const placementTrend = dashboardData.placementTrends;
    const recruiters = dashboardData.topRecruiters;
    const salaryData = dashboardData.salaryBenchmarks.slice(0, 6);

    // Calculate stats
    const currentYear = placementTrend[placementTrend.length - 1];
    const previousYear = placementTrend[placementTrend.length - 2];
    const placementGrowth = ((currentYear.rate - previousYear.rate) / previousYear.rate * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <StatCard
                    title="Placement Rate"
                    value={`${currentYear.rate}%`}
                    icon={TrendingUp}
                    color="green"
                    trend="up"
                    trendValue={`${placementGrowth}%`}
                />
                <StatCard
                    title="Students Placed"
                    value={currentYear.studentsPlaced.toLocaleString()}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Avg Package"
                    value={`₹${currentYear.avgPackage} LPA`}
                    icon={DollarSign}
                    color="purple"
                />
                <StatCard
                    title="Highest Package"
                    value="₹72 LPA"
                    icon={Trophy}
                    color="orange"
                    subtitle="Sahyadri (Rolls Royce)"
                />
                <StatCard
                    title="Top Recruiter"
                    value="Infosys BPM"
                    icon={Building}
                    color="indigo"
                    subtitle="450 hires"
                />
                <StatCard
                    title="Top Sector"
                    value="IT/ITES"
                    icon={Briefcase}
                    color="blue"
                    subtitle="85% placements"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placement Trend (5 Years) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                            5-Year Placement Trends - Dakshina Kannada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={placementTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="year"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    label={{ value: 'Placement %', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    label={{ value: 'Package (LPA)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="rate"
                                    name="Placement Rate %"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ fill: '#16a34a', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="avgPackage"
                                    name="Avg Package (LPA)"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="text-xs text-center text-slate-500 mt-2">
                            Steady growth: +14% placement rate, +26% avg package (2020-2024)
                        </div>
                    </CardContent>
                </Card>

                {/* Top Recruiters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Top Recruiters - Dakshina Kannada (2024-25)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 h-[300px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white">
                                <TableRow>
                                    <TableHead className="font-semibold">Rank</TableHead>
                                    <TableHead className="font-semibold">Company</TableHead>
                                    <TableHead className="font-semibold">Sector</TableHead>
                                    <TableHead className="text-right font-semibold">Hires</TableHead>
                                    <TableHead className="text-right font-semibold">Avg Salary</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recruiters.map((r, i) => (
                                    <TableRow key={i} className={i < 3 ? 'bg-blue-50' : ''}>
                                        <TableCell>
                                            <Badge variant={i === 0 ? "default" : "outline"} className="font-bold">
                                                #{i + 1}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-800">
                                            {r.name}
                                            <div className="text-xs text-slate-500">{r.employees}+ employees</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-xs">{r.sector}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-blue-600 text-lg">{r.hires}</TableCell>
                                        <TableCell className="text-right text-slate-700 font-semibold">{r.avgSal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Salary Benchmark Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-500">
                        Salary Benchmarks by Role - Dakshina Kannada (LPA)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salaryData} layout="vertical" margin={{ left: 110 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" fontSize={12} tickLine={false} />
                            <YAxis dataKey="role" type="category" width={100} fontSize={11} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                formatter={(value) => `₹${value} LPA`}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Bar dataKey="min" fill="#93c5fd" name="Min Salary" barSize={18} radius={[2, 0, 0, 2]} />
                            <Bar dataKey="avg" fill="#3b82f6" name="Avg Salary" barSize={18} />
                            <Bar dataKey="max" fill="#1e40af" name="Max Salary" barSize={18} radius={[0, 2, 2, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="text-xs text-center text-slate-500 mt-2">
                        Salaries vary significantly: Premium tech roles (₹16-20L) vs traditional engineering (₹3-5L)
                    </div>
                </CardContent>
            </Card>

            {/* Institution-wise Placement Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-700">
                        Institution-wise Placement Performance (2024-25)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* NITK Surathkal */}
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-blue-800 text-base">NITK Surathkal</div>
                                        <Badge className="mt-1 text-xs bg-blue-600">NIRF #17</Badge>
                                    </div>
                                    <Trophy className="text-blue-600" size={24} />
                                </div>
                                <div className="space-y-2 text-sm mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Placement Rate:</span>
                                        <span className="font-bold text-blue-900">93%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Students Placed:</span>
                                        <span className="font-bold text-blue-900">756</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Avg Package:</span>
                                        <span className="font-bold text-blue-900">₹16.25 LPA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Highest:</span>
                                        <span className="font-bold text-blue-900">₹72 LPA</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-blue-700 bg-blue-200 p-2 rounded">
                                    Top: Google, Microsoft, Amazon
                                </div>
                            </CardContent>
                        </Card>

                        {/* Srinivas Institute */}
                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-green-800 text-base">Srinivas Institute</div>
                                        <Badge className="mt-1 text-xs bg-green-600">Best Rate</Badge>
                                    </div>
                                    <TrendingUp className="text-green-600" size={24} />
                                </div>
                                <div className="space-y-2 text-sm mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Placement Rate:</span>
                                        <span className="font-bold text-green-900">86.9%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Students Placed:</span>
                                        <span className="font-bold text-green-900">447</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Avg Package:</span>
                                        <span className="font-bold text-green-900">₹4.48 LPA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">Highest:</span>
                                        <span className="font-bold text-green-900">₹8 LPA</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-green-700 bg-green-200 p-2 rounded">
                                    Top: Infosys, TCS, Wipro
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sahyadri College */}
                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-purple-800 text-base">Sahyadri College</div>
                                        <Badge className="mt-1 text-xs bg-purple-600">Top Package</Badge>
                                    </div>
                                    <DollarSign className="text-purple-600" size={24} />
                                </div>
                                <div className="space-y-2 text-sm mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Placement Rate:</span>
                                        <span className="font-bold text-purple-900">71%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Students Placed:</span>
                                        <span className="font-bold text-purple-900">310</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Avg Package:</span>
                                        <span className="font-bold text-purple-900">₹6.3 LPA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Highest:</span>
                                        <span className="font-bold text-purple-900">₹72 LPA</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-purple-700 bg-purple-200 p-2 rounded">
                                    Top: Belc (Japan), TCS, Infosys
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-700">Positive Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                            <li>Placement rate improved from 58% (2020) to 72% (2024) - <strong>+24% growth</strong></li>
                            <li>Average package increased from ₹3.8L to ₹4.8L - <strong>+26% growth</strong></li>
                            <li>NITK maintaining premier 93% placement despite tech slowdown</li>
                            <li>Srinivas Institute leading private colleges with 86.9% rate</li>
                            <li>International placements growing (Sahyadri: ₹72L Japan offer)</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-700">Areas of Concern</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                            <li>28% students (~1,650) still unplaced across district</li>
                            <li>Heavy dependence on IT services (85%) limits diversification</li>
                            <li>Salary gap between NITK (₹16.25L) and tier-2 colleges (₹4-5L) widening</li>
                            <li>Non-CS branches struggle: Mechanical/Civil at 58-65% placement</li>
                            <li>Limited product company participation outside NITK</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
