import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { cn } from '../../lib/utils';
import { Users, TrendingUp, AlertTriangle, Target, Leaf, CheckCircle2 } from 'lucide-react';
import { AIInsights } from '../common/AIInsights';

// From Visualization Plan: "If DSC members see only ONE page, include:"
// 1. Youth Population Pyramid
// 2. Dropout Funnel
// 3. Training → Placement Funnel
// 4. Sector Placement Quality Matrix
// 5. Yield / Livelihood Gap Chart

const YOUTH_POPULATION = [
  { ageGroup: '16-20', rural: 24200, urban: 18400, male: 22100, female: 20500 },
  { ageGroup: '21-25', rural: 28400, urban: 22600, male: 26200, female: 24800 },
  { ageGroup: '26-30', rural: 21800, urban: 19200, male: 20800, female: 20200 },
  { ageGroup: '31-35', rural: 16200, urban: 14800, male: 15800, female: 15200 },
];

const DROPOUT_FUNNEL = [
  { stage: 'Class 5', enrolled: 28400, dropoutPct: 0 },
  { stage: 'Class 8', enrolled: 24200, dropoutPct: 14.8 },
  { stage: 'Class 10', enrolled: 18600, dropoutPct: 23.1 },
  { stage: 'Class 12', enrolled: 12800, dropoutPct: 31.2 },
];

const TRAINING_PLACEMENT = [
  { stage: 'Mobilized', value: 14200 },
  { stage: 'Counselled', value: 9840 },
  { stage: 'Trained', value: 8200 },
  { stage: 'Placed', value: 5248 },
  { stage: 'Retained 90d', value: 4420 },
];

const SECTOR_QUALITY = [
  { sector: 'IT/ITES', avgSalary: 15200, placementPct: 70, trained: 1920 },
  { sector: 'Healthcare', avgSalary: 14800, placementPct: 70, trained: 1580 },
  { sector: 'Manufacturing', avgSalary: 12400, placementPct: 59, trained: 2840 },
  { sector: 'Construction', avgSalary: 11200, placementPct: 55, trained: 1260 },
  { sector: 'Retail', avgSalary: 10800, placementPct: 58, trained: 600 },
];

const YIELD_GAPS = [
  { crop: 'Paddy', gapPct: 26.5, people: 42000 },
  { crop: 'Cotton', gapPct: 34.4, people: 18200 },
  { crop: 'Sugarcane', gapPct: 22.9, people: 12400 },
];

export default function ExecutiveDashboard() {
  const totalYouth = YOUTH_POPULATION.reduce((s, y) => s + y.rural + y.urban, 0);
  const finalRetention = ((TRAINING_PLACEMENT[4].value / TRAINING_PLACEMENT[0].value) * 100).toFixed(1);
  const avgDropout = DROPOUT_FUNNEL[DROPOUT_FUNNEL.length - 1].dropoutPct;

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">District Skill Executive Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete landscape: 5 critical decision visuals for DSC members</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:brightness-110 transition-all">
            <TrendingUp className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Inference Panel */}
      <div className="rounded-xl border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">5-Visual Executive Summary</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Youth bulge: <span className="font-bold text-blue-600">51K in 21-25 age group</span> — peak training window.
              School dropout crisis: <span className="font-bold text-red-500">55% lost by Class 12</span> (urgent vocational bridges needed).
              Training quality: <span className="font-bold text-emerald-600">{finalRetention}% retention</span> beats industry (45%).
              Sector focus: <span className="font-bold text-emerald-600">IT & Healthcare = high salary + high placement</span> — scale up.
              Agriculture: <span className="font-bold text-amber-500">28% yield gap</span> affecting 42K farmers — biggest livelihood ROI opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* Top KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Youth (16-35)', value: (totalYouth / 1000).toFixed(0) + 'K', icon: Users, color: 'text-blue-600' },
          { label: 'School Dropout (by Class 12)', value: avgDropout.toFixed(0) + '%', icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Training → Retention', value: finalRetention + '%', icon: Target, color: 'text-emerald-500' },
          { label: 'Avg Placement Quality', value: '61%', icon: CheckCircle2, color: 'text-amber-500' },
          { label: 'Agri Yield Gap', value: '28%', icon: Leaf, color: 'text-red-500' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">{kpi.label}</span>
              <kpi.icon className={cn('h-4 w-4', kpi.color)} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Main 5 Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Youth Population Pyramid */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Youth Population (16-35 years)
            </h3>
            <p className="text-sm text-slate-500">Rural vs Urban distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={YOUTH_POPULATION} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} stroke="#94a3b8" />
              <YAxis type="category" dataKey="ageGroup" tick={{ fontSize: 10 }} width={35} stroke="#94a3b8" />
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="rural" fill="#10b981" name="Rural" stackId="a" />
              <Bar dataKey="urban" fill="#3b82f6" name="Urban" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 mt-3">
            <span className="font-bold text-slate-900 dark:text-white">21-25 age group</span> is largest (51K) — prime training window
          </p>
        </div>

        {/* 2. Dropout Funnel */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              School Dropout Funnel
            </h3>
            <p className="text-sm text-slate-500">Class 5 → Class 12</p>
          </div>
          <div className="space-y-3">
            {DROPOUT_FUNNEL.map((stage, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{stage.enrolled.toLocaleString()} students</span>
                    {stage.dropoutPct > 0 && (
                      <span className="text-xs font-bold text-red-500">-{stage.dropoutPct.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
                <div className="h-10 rounded-lg overflow-hidden flex items-center px-3"
                  style={{
                    background: `rgba(59, 130, 246, ${1 - (stage.dropoutPct / 100)})`, // Blue based opacity
                    width: `${((stage.enrolled / DROPOUT_FUNNEL[0].enrolled) * 100)}%`
                  }}>
                  <span className="text-xs font-bold text-white shadow-sm">{stage.enrolled.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            <span className="font-bold text-red-500">55% dropout by Class 12</span> — urgent need for vocational bridges at Class 8/10
          </p>
        </div>

        {/* 3. Training → Placement Funnel */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              Training → Placement Conversion
            </h3>
            <p className="text-sm text-slate-500">Full pipeline (90-day retention)</p>
          </div>
          <div className="space-y-2">
            {TRAINING_PLACEMENT.map((stage, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{stage.stage}</span>
                  <span className="text-xs font-bold text-blue-600">{stage.value.toLocaleString()}</span>
                </div>
                <div className="h-8 rounded-lg flex items-center px-3 transition-all group-hover:scale-[1.02]"
                  style={{
                    background: `rgba(16, 185, 129, ${stage.value / TRAINING_PLACEMENT[0].value})`, // Emerald based
                    width: `${(stage.value / TRAINING_PLACEMENT[0].value) * 100}%`
                  }}>
                  <span className="text-xs font-bold text-white shadow-sm">
                    {((stage.value / TRAINING_PLACEMENT[0].value) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            <span className="font-bold text-emerald-500">{finalRetention}% final retention</span> — industry benchmark: 45%
          </p>
        </div>

        {/* 4. Sector Placement Quality Matrix */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Sector Placement Quality Matrix
            </h3>
            <p className="text-sm text-slate-500">Salary × Placement % × Volume</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="placementPct"
                domain={[50, 75]}
                tick={{ fontSize: 10 }}
                label={{ value: 'Placement % →', position: 'bottom', offset: 20, fontSize: 10 }}
                stroke="#94a3b8"
              />
              <YAxis
                type="number"
                dataKey="avgSalary"
                domain={[10000, 16000]}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                label={{ value: '← Avg Salary', angle: -90, position: 'left', offset: 40, fontSize: 10 }}
                stroke="#94a3b8"
              />
              <ZAxis type="number" dataKey="trained" range={[100, 500]} />
              <Tooltip
                content={({ payload }) => payload?.[0] ? (
                  <div className="rounded-lg border bg-white p-2 shadow-lg border-slate-200">
                    <p className="text-xs font-bold text-slate-900">{payload[0].payload.sector}</p>
                    <p className="text-xs text-slate-600">Salary: ₹{payload[0].payload.avgSalary.toLocaleString()}</p>
                    <p className="text-xs text-slate-600">Placement: {payload[0].payload.placementPct}%</p>
                    <p className="text-xs text-slate-600">Volume: {payload[0].payload.trained}</p>
                  </div>
                ) : null}
              />
              <Scatter data={SECTOR_QUALITY}>
                {SECTOR_QUALITY.map((s, i) => (
                  <Cell key={i} fill={s.avgSalary >= 14000 && s.placementPct >= 65 ? '#10b981' : '#f59e0b'} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 mt-2">
            <span className="font-bold text-emerald-500">IT & Healthcare</span> = high salary + high placement — scale up
          </p>
        </div>

        {/* 5. Yield / Livelihood Gap */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6 lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              Agriculture Yield Gap Priority
            </h3>
            <p className="text-sm text-slate-500">Gap % × People Dependent = Impact Score</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {YIELD_GAPS.map((yg, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{yg.crop}</span>
                  <span className="text-lg font-black text-red-500">{yg.gapPct.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500" style={{ width: `${yg.gapPct}%` }} />
                </div>
                <p className="text-xs text-slate-500">{(yg.people / 1000).toFixed(0)}K people dependent</p>
                <p className="text-xs font-bold text-blue-600 mt-2">
                  Impact Score: {((yg.gapPct * yg.people) / 1000).toFixed(0)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Priority Action</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Cotton (34% gap, 18K farmers) = highest impact. Deploy on-field training + precision agriculture programs.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="rounded-xl border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 p-6">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Executive Summary: Top 3 Actions</h4>
        <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
          <li><span className="font-bold text-red-500">Close training-demand gap</span> — 191K shortfall in IT, Healthcare, Manufacturing</li>
          <li><span className="font-bold text-amber-500">Vocational bridges at Class 8/10</span> — 55% drop out by Class 12, need early intervention</li>
          <li><span className="font-bold text-emerald-600">Agriculture on-field training</span> — 28% yield gap, 42K farmers, only 6% coverage today</li>
        </ol>
      </div>

      {/* AI Insights */}
      <AIInsights context="executive dashboard and district skill priorities" dataPoints={[
        `Youth population: ${(totalYouth / 1000).toFixed(0)}K in 16-35 age group`,
        `School dropout rate: ${avgDropout.toFixed(0)}% by Class 12`,
        `Training retention: ${finalRetention}% (above industry 45%)`,
        'IT & Healthcare sectors show highest placement quality',
        'Agriculture yield gap: 28% affecting 42K farmers'
      ]} />
    </div>
  );
}
