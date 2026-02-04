import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import { TrendingDown, Users, Briefcase, Target } from 'lucide-react';

// Overall funnel (Visualization 7 from plan)
const OVERALL_FUNNEL = [
  { stage: 'Mobilization', value: 14200, pct: 100, color: '#3b82f6' },
  { stage: 'Counselling', value: 9840, pct: 69.3, color: '#60a5fa' },
  { stage: 'Training Started', value: 8200, pct: 57.7, color: '#93c5fd' },
  { stage: 'Training Completed', value: 7380, pct: 52.0, color: '#bfdbfe' },
  { stage: 'Placed', value: 5248, pct: 37.0, color: '#10b981' },
  { stage: 'Retained (90 days)', value: 4420, pct: 31.1, color: '#34d399' },
];

// By Gender
const GENDER_FUNNEL = [
  { category: 'Male', mobilized: 8520, trained: 5120, placed: 3280, retention: 64.1 },
  { category: 'Female', mobilized: 5680, trained: 3060, placed: 1968, retention: 64.3 },
];

// By Social Category
const CATEGORY_FUNNEL = [
  { category: 'General', mobilized: 8260, trained: 5180, placed: 3420, retention: 66.0 },
  { category: 'SC', mobilized: 3540, trained: 1840, placed: 1140, retention: 62.0 },
  { category: 'ST', mobilized: 2400, trained: 1180, placed: 688, retention: 58.3 },
];

// By Sector (Visualization 8: Pareto)
const SECTOR_TRAINING = [
  { sector: 'Manufacturing', trained: 2840, placed: 1680, placementPct: 59.2 },
  { sector: 'IT/ITES', trained: 1920, placed: 1344, placementPct: 70.0 },
  { sector: 'Healthcare', trained: 1580, placed: 1106, placementPct: 70.0 },
  { sector: 'Construction', trained: 1260, placed: 693, placementPct: 55.0 },
  { sector: 'Retail', trained: 600, placed: 348, placementPct: 58.0 },
];

// Training Partner Performance (Visualization 10)
const TP_PERFORMANCE = [
  { tp: 'SkillWorks India', trained: 1840, placed: 1472, placementPct: 80.0, avgSalary: 14200, rating: 'A' },
  { tp: 'Tech Training Hub', trained: 1560, placed: 1232, placementPct: 79.0, avgSalary: 13800, rating: 'A' },
  { tp: 'Karnataka Skills Ltd', trained: 1280, placed: 870, placementPct: 68.0, avgSalary: 12400, rating: 'B' },
  { tp: 'Rural Uplift Foundation', trained: 980, placed: 608, placementPct: 62.0, avgSalary: 11200, rating: 'B' },
  { tp: 'Global Skill Academy', trained: 840, placed: 420, placementPct: 50.0, avgSalary: 10800, rating: 'C' },
  { tp: 'District Training Centre', trained: 720, placed: 360, placementPct: 50.0, avgSalary: 10200, rating: 'C' },
];

export default function TrainingPlacementFunnel() {
  const overallConversion = ((OVERALL_FUNNEL[5].value / OVERALL_FUNNEL[0].value) * 100).toFixed(1);
  const genderGap = Math.abs(GENDER_FUNNEL[0].retention - GENDER_FUNNEL[1].retention).toFixed(1);
  const categoryGap = Math.max(...CATEGORY_FUNNEL.map(c => c.retention)) - Math.min(...CATEGORY_FUNNEL.map(c => c.retention));

  return (
    <div className="w-full space-y-6 pt-6 pb-6 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Training → Placement Conversion</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full funnel analysis by gender, category, sector & TP</p>
      </div>

      {/* Inference */}
      <div className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4">
        <div className="flex items-start gap-3">
          <TrendingDown className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Conversion & Retention Insight</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Overall mobilization → 90-day retention: <span className="font-bold text-amber-600">{overallConversion}%</span> (industry standard: 45%). 
              Biggest drop: <span className="font-bold text-red-500">counselling → training (820 lost)</span>. 
              Gender parity in retention ({genderGap}pp gap), but ST category lags by {categoryGap.toFixed(1)}pp. 
              IT/Healthcare have <span className="font-bold text-emerald-600">70% placement</span> vs Construction at 55%.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Mobilized', value: (OVERALL_FUNNEL[0].value/1000).toFixed(1) + 'K', icon: Users, color: 'text-blue-600' },
          { label: 'Final Retention Rate', value: overallConversion + '%', icon: Target, color: 'text-emerald-600' },
          { label: 'Placed & Working', value: (OVERALL_FUNNEL[5].value/1000).toFixed(1) + 'K', icon: Briefcase, color: 'text-emerald-600' },
          { label: 'ST Category Gap', value: categoryGap.toFixed(0) + 'pp', icon: TrendingDown, color: 'text-red-500' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">{kpi.label}</span>
              <kpi.icon className={cn('h-5 w-5', kpi.color)} />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Funnel */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Overall Conversion Funnel</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Mobilization → 90-day retention (6 stages)</p>
          <div className="space-y-3">
            {OVERALL_FUNNEL.map((stage, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{stage.value.toLocaleString()}</span>
                    <span className="text-xs font-bold text-blue-600">{stage.pct.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-12 rounded-lg overflow-hidden flex items-center justify-between px-4 transition-all group-hover:scale-[1.02]"
                  style={{ background: stage.color, width: `${(stage.value / OVERALL_FUNNEL[0].value) * 100}%` }}>
                  <span className="text-xs font-bold text-white drop-shadow-md">{stage.stage}</span>
                  <span className="text-xs font-bold text-white drop-shadow-md">{stage.value.toLocaleString()}</span>
                </div>
                {i < OVERALL_FUNNEL.length - 1 && (
                  <div className="flex items-center gap-2 mt-1.5 ml-2">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500 font-bold">
                      -{(OVERALL_FUNNEL[i].value - OVERALL_FUNNEL[i+1].value).toLocaleString()} lost
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gender & Category Breakdown */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">By Gender & Social Category</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Placement & retention rates</p>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Gender</p>
              {GENDER_FUNNEL.map((g, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{g.category}</span>
                    <span className="text-xs font-bold text-blue-600">{g.retention.toFixed(1)}% retention</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                      style={{ width: `${g.retention}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {g.mobilized.toLocaleString()} mobilized → {g.placed.toLocaleString()} placed
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Social Category</p>
              {CATEGORY_FUNNEL.map((c, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{c.category}</span>
                    <span className={cn('text-xs font-bold', 
                      c.retention >= 65 ? 'text-emerald-600' : c.retention >= 60 ? 'text-amber-600' : 'text-red-600'
                    )}>{c.retention.toFixed(1)}% retention</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full',
                      c.retention >= 65 ? 'bg-emerald-500' : c.retention >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    )} style={{ width: `${c.retention}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {c.mobilized.toLocaleString()} mobilized → {c.placed.toLocaleString()} placed
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">Action: ST Inclusion Support</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              ST category 8pp below General in retention — needs targeted placement assistance
            </p>
          </div>
        </div>

        {/* Sector Performance (Pareto) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Sector-Wise Placement Rates (Pareto)</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Identify high vs low-converting sectors</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SECTOR_TRAINING} margin={{ bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sector" tick={{ fontSize: 10, angle: -15 } as any} height={70} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="trained" fill="#3b82f6" name="Trained" radius={[4,4,0,0]} />
              <Bar yAxisId="left" dataKey="placed" fill="#10b981" name="Placed" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">Strong: IT, Healthcare</p>
              <p className="text-slate-600 dark:text-slate-300">70% placement</p>
            </div>
            <div className="p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="font-bold text-amber-700 dark:text-amber-400">Weak: Construction</p>
              <p className="text-slate-600 dark:text-slate-300">55% placement</p>
            </div>
          </div>
        </div>

        {/* Training Partner Scorecard */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Training Partner Performance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ranked by placement % & avg salary</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-2">TP Name</th>
                  <th className="pb-2 text-center">Grade</th>
                  <th className="pb-2 text-right">Placement %</th>
                  <th className="pb-2 text-right">Avg Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {TP_PERFORMANCE.map((tp, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-2.5 text-xs font-semibold text-slate-900 dark:text-white">{tp.tp}</td>
                    <td className="py-2.5 text-center">
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full',
                        tp.rating === 'A' ? 'bg-emerald-100 text-emerald-700' :
                        tp.rating === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      )}>{tp.rating}</span>
                    </td>
                    <td className="py-2.5 text-xs font-bold text-slate-900 dark:text-white text-right">{tp.placementPct.toFixed(0)}%</td>
                    <td className="py-2.5 text-xs text-slate-500 text-right">₹{tp.avgSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Blacklist Threshold:</p>
            <p className="text-xs text-slate-500 mt-1">
              TPs with &lt;50% placement for 2 consecutive years → renewal denied
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
