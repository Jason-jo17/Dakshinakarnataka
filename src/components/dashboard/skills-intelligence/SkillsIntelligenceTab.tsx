

import { useState } from 'react';
import { Card } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import LaborMarketKPIs from './components/LaborMarketKPIs';
import SectorTreemap from './components/SectorTreemap';
import TrainingFunnel from './components/TrainingFunnel';
import SupplyDemandChart from './components/SupplyDemandChart';
import RealTimeTicker from './components/RealTimeTicker';
import WageTrendChart from './components/WageTrendChart';

export default function SkillsIntelligenceTab() {
    const [stakeholderView, setStakeholderView] = useState('policymaker');

    return (
        <div className="space-y-6">
            {/* Header with Stakeholder Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Skills Intelligence Framework & Dashboard
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Real-time labor market intelligence for data-driven decisions
                    </p>
                </div>
                <Select
                    value={stakeholderView}
                    onValueChange={setStakeholderView}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select View" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="policymaker">Policymaker View</SelectItem>
                        <SelectItem value="trainingProvider">Training Provider View</SelectItem>
                        <SelectItem value="trainee">Trainee View</SelectItem>
                        <SelectItem value="employer">Employer View</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Real-Time Ticker */}
            <RealTimeTicker
                metrics={{
                    activeTrainees: 13200,
                    placementsThisMonth: 287,
                    openVacancies: 1045,
                    newRegistrations: 412,
                }}
            />

            {/* Labor Market KPIs - Use REAL data */}
            <LaborMarketKPIs
                kpis={[
                    {
                        label: 'LFPR',
                        value: '60.1%',
                        trend: { direction: 'up', value: 2.3 },
                        sparklineData: [58.2, 58.8, 59.1, 59.7, 60.1],
                    },
                    {
                        label: 'Unemployment Rate',
                        value: '6.2%',
                        trend: { direction: 'down', value: 0.8 },
                        sparklineData: [7.8, 7.2, 6.9, 6.5, 6.2],
                    },
                    {
                        label: 'Vocational Training Rate',
                        value: '80/1000',
                        trend: { direction: 'up', value: 5 },
                        sparklineData: [70, 73, 75, 78, 80],
                    },
                    {
                        label: 'Placement Rate',
                        value: '72%',
                        trend: { direction: 'up', value: 4 },
                        sparklineData: [58, 62, 68, 64, 72],
                    },
                    {
                        label: 'Avg Wage',
                        value: '₹4.8 LPA',
                        trend: { direction: 'up', value: 6.3 },
                        sparklineData: [3.8, 4.0, 4.3, 4.5, 4.8],
                    },
                    {
                        label: 'Job Openings',
                        value: '1,045',
                        trend: { direction: 'up', value: 15 },
                        sparklineData: [780, 820, 890, 910, 1045],
                    },
                ]}
            />

            {/* Main Content - Stakeholder Dependent */}
            {stakeholderView === 'policymaker' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sector Analytics Treemap */}
                    <SectorTreemap
                        sectors={[
                            { id: 'IT', name: 'IT/ITES', value: 30000, growth: 15.0, color: '#3b82f6' },
                            { id: 'BPO', name: 'BPO/KPO', value: 25000, growth: 12.0, color: '#10b981' },
                            { id: 'Retail', name: 'Retail', value: 25000, growth: 5.0, color: '#f59e0b' },
                            { id: 'Construction', name: 'Construction', value: 18000, growth: 5.5, color: '#ef4444' },
                            { id: 'Logistics', name: 'Logistics', value: 15000, growth: 8.5, color: '#8b5cf6' },
                            { id: 'Tourism', name: 'Tourism', value: 12000, growth: 7.2, color: '#ec4899' },
                            { id: 'Manufacturing', name: 'Manufacturing', value: 8000, growth: 4.5, color: '#f97316' },
                            { id: 'Maritime', name: 'Maritime', value: 5000, growth: 6.0, color: '#06b6d4' },
                        ]}
                    />

                    {/* Training Funnel - REAL numbers */}
                    <TrainingFunnel
                        stages={[
                            { stage: 'Enrolled', value: 24700, percentage: 100 },
                            { stage: 'Attending', value: 21000, percentage: 85 },
                            { stage: 'Completed', value: 17784, percentage: 72 },
                            { stage: 'Certified', value: 16796, percentage: 68 },
                            { stage: 'Placed', value: 12844, percentage: 52 },
                        ]}
                    />

                    {/* Supply-Demand Balance */}
                    <div className="lg:col-span-2">
                        <SupplyDemandChart
                            data={[
                                { month: 'Jan', supply: 4800, demand: 5200 },
                                { month: 'Feb', supply: 4900, demand: 5300 },
                                { month: 'Mar', supply: 5100, demand: 5400 },
                                { month: 'Apr', supply: 5200, demand: 5500 },
                                { month: 'May', supply: 5400, demand: 5600 },
                                { month: 'Jun', supply: 5500, demand: 5700 },
                                { month: 'Jul', supply: 5600, demand: 5800 },
                                { month: 'Aug', supply: 5700, demand: 5900 },
                                { month: 'Sep', supply: 5800, demand: 6000 },
                                { month: 'Oct', supply: 5900, demand: 6100 },
                                { month: 'Nov', supply: 6000, demand: 6200 },
                                { month: 'Dec', supply: 6100, demand: 6300 },
                            ]}
                        />
                    </div>

                    {/* Wage Trends */}
                    <div className="lg:col-span-2">
                        <WageTrendChart
                            data={[
                                { year: 2020, entrylevel: 3.2, midlevel: 5.5, senior: 9.0 },
                                { year: 2021, entrylevel: 3.4, midlevel: 5.8, senior: 9.5 },
                                { year: 2022, entrylevel: 3.6, midlevel: 6.2, senior: 10.2 },
                                { year: 2023, entrylevel: 3.9, midlevel: 6.8, senior: 11.0 },
                                { year: 2024, entrylevel: 4.2, midlevel: 7.5, senior: 12.0 },
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* Training Provider View */}
            {stakeholderView === 'trainingProvider' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Batch Capacity</div>
                        <div className="text-4xl font-bold text-blue-600 mt-2">2,470</div>
                        <div className="text-xs text-slate-600 mt-1">31 ITIs + 10 Colleges</div>
                    </Card>
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Completion Rate</div>
                        <div className="text-4xl font-bold text-green-600 mt-2">72%</div>
                        <div className="text-xs text-green-600 mt-1">↑ 4% vs last year</div>
                    </Card>
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Placement Rate</div>
                        <div className="text-4xl font-bold text-purple-600 mt-2">52%</div>
                        <div className="text-xs text-slate-600 mt-1">Within 90 days</div>
                    </Card>
                </div>
            )}

            {/* Trainee View */}
            {stakeholderView === 'trainee' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Skill Courses</div>
                        <div className="text-4xl font-bold text-blue-600 mt-2">45+</div>
                        <div className="text-xs text-slate-600 mt-1">Across 8 sectors</div>
                    </Card>
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Jobs Available</div>
                        <div className="text-4xl font-bold text-green-600 mt-2">1,045</div>
                        <div className="text-xs text-slate-600 mt-1">Live vacancies</div>
                    </Card>
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Avg Starting Salary</div>
                        <div className="text-4xl font-bold text-purple-600 mt-2">₹4.8 LPA</div>
                        <div className="text-xs text-slate-600 mt-1">+6% growth</div>
                    </Card>
                </div>
            )}

            {/* Employer View */}
            {stakeholderView === 'employer' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Candidates Available</div>
                        <div className="text-4xl font-bold text-blue-600 mt-2">3,400</div>
                        <div className="text-xs text-slate-600 mt-1">Certified & Job-ready</div>
                    </Card>
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Avg Skill Score</div>
                        <div className="text-4xl font-bold text-green-600 mt-2">68/100</div>
                        <div className="text-xs text-slate-600 mt-1">District average</div>
                    </Card>
                    <Card className="p-6">
                        <div className="text-sm text-slate-600">Hiring Trend</div>
                        <div className="text-4xl font-bold text-purple-600 mt-2">+15%</div>
                        <div className="text-xs text-slate-600 mt-1">Growth YoY</div>
                    </Card>
                </div>
            )}
        </div>
    );
}
