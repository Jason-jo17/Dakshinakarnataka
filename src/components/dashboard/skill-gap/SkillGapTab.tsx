

import { Card } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import SectorGapChart from './components/SectorGapChart';
import GapHeatmap from './components/GapHeatmap';
import AIForecastPanel from './components/AIForecastPanel';
import FieldStudyProgress from './components/FieldStudyProgress';
import JobRoleTable from './components/JobRoleTable';

export default function SkillGapTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          District Skill Gap Study & Demand Assessment
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Comprehensive field study with AI-enabled forecasting model | Updated: January 2025
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-slate-600">Overall Skill Gap</div>
          <div className="text-4xl font-bold text-red-600 mt-2">28%</div>
          <div className="text-xs text-red-600 mt-1">↓ 3% vs last year</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600">Workforce Gap</div>
          <div className="text-4xl font-bold text-orange-600 mt-2">650+</div>
          <div className="text-xs text-slate-600 mt-1">Unfilled positions</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600">Critical Skills ({'>'}50%)</div>
          <div className="text-4xl font-bold text-red-600 mt-2">2</div>
          <div className="text-xs text-slate-600 mt-1">Cloud, Data Science</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-600">Field Studies</div>
          <div className="text-4xl font-bold text-blue-600 mt-2">31</div>
          <div className="text-xs text-slate-600 mt-1">ITIs surveyed</div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start border-b border-slate-200 bg-transparent p-0 h-auto rounded-none gap-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 py-2">Gap Overview</TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 py-2">AI Forecast</TabsTrigger>
          <TabsTrigger value="field" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 py-2">Field Studies</TabsTrigger>
          <TabsTrigger value="jobroles" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 py-2">Job Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          {/* Sector Gap Chart - Use exact data */}
          <SectorGapChart data={[
            { sector: 'IT/ITES', demand: 850, supply: 620, gap: 230 },
            { sector: 'BPO/KPO', demand: 450, supply: 580, gap: -130 },
            { sector: 'Manufacturing', demand: 180, supply: 240, gap: -60 },
            { sector: 'Logistics', demand: 120, supply: 85, gap: 35 },
            { sector: 'Construction', demand: 180, supply: 240, gap: -60 },
            { sector: 'Tourism', demand: 85, supply: 65, gap: 20 },
            { sector: 'Healthcare', demand: 65, supply: 45, gap: 20 },
            { sector: 'Retail', demand: 200, supply: 250, gap: -50 },
          ]} />

          {/* Gap Heatmap - 8 sectors × 10 skills */}
          <GapHeatmap
            sectors={['IT/ITES', 'BPO', 'Manufacturing', 'Logistics', 'Construction', 'Tourism', 'Healthcare', 'Retail']}
            skills={['Python', 'Java', 'Cloud', 'Data Science', 'MERN', 'Soft Skills', 'CAD/CAM', 'Embedded', 'Mobile', 'React']}
            gapData={[
              // IT/ITES row
              [30, 23, 63, 50, 33, 40, 15, -10, 23, 27],
              // BPO row
              [8, 5, 20, 18, 10, 42, 5, 0, 8, 12],
              // Manufacturing row
              [5, 8, 15, 10, 5, 25, 54, -29, 10, 8],
              // Logistics
              [10, 5, 30, 15, 5, 35, 10, 5, 15, 8],
              // Construction
              [5, 5, 10, 5, 5, 30, 45, 5, 5, 5],
              // Tourism
              [15, 10, 10, 15, 10, 55, 5, 5, 25, 10],
              // Healthcare
              [10, 5, 20, 35, 5, 45, 10, 15, 15, 5],
              // Retail
              [10, 5, 15, 25, 5, 50, 5, 5, 10, 5],
            ]}
          />
        </TabsContent>

        <TabsContent value="forecast" className="pt-4">
          <AIForecastPanel
            projections={{
              baseline: [
                { year: 2025, gap: 28 },
                { year: 2026, gap: 24 },
                { year: 2027, gap: 21 },
                { year: 2028, gap: 18 },
                { year: 2029, gap: 16 },
                { year: 2030, gap: 15 },
              ],
              optimistic: [
                { year: 2025, gap: 28 },
                { year: 2026, gap: 22 },
                { year: 2027, gap: 17 },
                { year: 2028, gap: 13 },
                { year: 2029, gap: 10 },
                { year: 2030, gap: 8 },
              ],
              pessimistic: [
                { year: 2025, gap: 28 },
                { year: 2026, gap: 27 },
                { year: 2027, gap: 26 },
                { year: 2028, gap: 25 },
                { year: 2029, gap: 24 },
                { year: 2030, gap: 23 },
              ],
            }}
            modelAccuracy={{ rmse: 2.3, r2: 0.89 }}
          />
        </TabsContent>

        <TabsContent value="field" className="pt-4">
          <FieldStudyProgress
            taluks={[
              { name: 'Mangaluru', surveysCompleted: 12, surveysTarget: 12, completion: 100 },
              { name: 'Bantwal', surveysCompleted: 4, surveysTarget: 4, completion: 100 },
              { name: 'Puttur', surveysCompleted: 5, surveysTarget: 5, completion: 100 },
              { name: 'Belthangadi', surveysCompleted: 3, surveysTarget: 3, completion: 100 },
              { name: 'Sulya', surveysCompleted: 2, surveysTarget: 2, completion: 100 },
              { name: 'Moodbidri', surveysCompleted: 3, surveysTarget: 3, completion: 100 },
              { name: 'Kadaba', surveysCompleted: 1, surveysTarget: 1, completion: 100 },
              { name: 'Ullal', surveysCompleted: 1, surveysTarget: 1, completion: 100 },
              { name: 'Mulki', surveysCompleted: 2, surveysTarget: 2, completion: 100 },
            ]}
            totalSurveys={33}
            targetSurveys={33}
            lastUpdated="December 2024"
            nextScheduled="December 2029"
          />
        </TabsContent>

        <TabsContent value="jobroles" className="pt-4">
          <JobRoleTable
            roles={[
              { id: 1, role: 'Python Developer', nsqfLevel: 6, currentGap: 118, projectedGap2030: 85, avgWage: 7.5, trainingHours: 400 },
              { id: 2, role: 'Cloud Engineer', nsqfLevel: 6, currentGap: 75, projectedGap2030: 45, avgWage: 11.5, trainingHours: 500 },
              { id: 3, role: 'Data Scientist', nsqfLevel: 7, currentGap: 75, projectedGap2030: 50, avgWage: 10.0, trainingHours: 600 },
              { id: 4, role: 'Java Developer', nsqfLevel: 6, currentGap: 65, projectedGap2030: 40, avgWage: 9.0, trainingHours: 450 },
              { id: 5, role: 'MERN Stack Dev', nsqfLevel: 5, currentGap: 60, projectedGap2030: 35, avgWage: 6.0, trainingHours: 350 },
              { id: 6, role: 'React Developer', nsqfLevel: 5, currentGap: 65, projectedGap2030: 40, avgWage: 7.5, trainingHours: 300 },
              { id: 7, role: 'DevOps Engineer', nsqfLevel: 6, currentGap: 65, projectedGap2030: 40, avgWage: 10.0, trainingHours: 450 },
              { id: 8, role: 'CAD/CAM Operator', nsqfLevel: 4, currentGap: 35, projectedGap2030: 20, avgWage: 4.5, trainingHours: 250 },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
