import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../../lib/utils';
import { Target, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IndicatorScore {
  row_id: string;
  title: string;
  component: string;
  current_score: number;
  max_score: number;
  percentage: number;
  criticality: number;
}

interface ComponentScore {
  component: string;
  current: number;
  max: number;
  percentage: number;
  indicator_count: number;
}

interface MatrixVisualizationProps {
  scores?: IndicatorScore[]; // Optional - comes from the data entry form
}

// Sample data structure (this will come from your form submissions)
const SAMPLE_SCORES: IndicatorScore[] = [
  { row_id: '1.1a', title: 'Planning Evidence', component: 'Planning & Governance', current_score: 3, max_score: 5, percentage: 60, criticality: 5 },
  { row_id: '1.1b', title: 'DSC Meeting Frequency', component: 'Planning & Governance', current_score: 4, max_score: 5, percentage: 80, criticality: 4 },
  { row_id: '2.1a', title: 'ITI Seat Availability', component: 'Institutional Capacity', current_score: 2, max_score: 5, percentage: 40, criticality: 5 },
  { row_id: '2.2a', title: 'Trainer Quality Index', component: 'Quality & Delivery', current_score: 1, max_score: 5, percentage: 20, criticality: 5 },
  { row_id: '2.3a', title: 'Placement Rate', component: 'Quality & Delivery', current_score: 2, max_score: 5, percentage: 40, criticality: 5 },
  { row_id: '3.1a', title: 'SC/ST Inclusion Ratio', component: 'Access & Inclusion', current_score: 3, max_score: 5, percentage: 60, criticality: 3 },
  { row_id: '3.2a', title: 'Women Participation', component: 'Access & Inclusion', current_score: 3, max_score: 5, percentage: 60, criticality: 3 },
  { row_id: '3.3a', title: 'Rural Training Centers', component: 'Access & Inclusion', current_score: 2, max_score: 5, percentage: 40, criticality: 4 },
  { row_id: '4.1a', title: 'MIS Data Completeness', component: 'Governance & Data', current_score: 1, max_score: 5, percentage: 20, criticality: 4 },
  { row_id: '4.2a', title: 'Budget Utilization', component: 'Governance & Data', current_score: 4, max_score: 5, percentage: 80, criticality: 3 },
];

export default function DistrictSkillMatrixVisualization({ scores = SAMPLE_SCORES }: MatrixVisualizationProps) {
  const [componentScores, setComponentScores] = useState<ComponentScore[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [grade, setGrade] = useState('');

  useEffect(() => {
    // Calculate component-wise aggregates
    const components = ['Planning & Governance', 'Institutional Capacity', 'Quality & Delivery', 'Access & Inclusion', 'Governance & Data'];
    const compScores: ComponentScore[] = components.map(comp => {
      const compIndicators = scores.filter(s => s.component === comp);
      const currentSum = compIndicators.reduce((sum, ind) => sum + ind.current_score, 0);
      const maxSum = compIndicators.reduce((sum, ind) => sum + ind.max_score, 0);
      return {
        component: comp,
        current: currentSum,
        max: maxSum,
        percentage: maxSum > 0 ? (currentSum / maxSum) * 100 : 0,
        indicator_count: compIndicators.length,
      };
    });
    setComponentScores(compScores);

    // Prepare radar data
    const radarDataset = compScores.map(c => ({
      component: c.component.split(' ')[0], // Shorten for radar
      current: c.percentage,
      target: 100,
    }));
    setRadarData(radarDataset);

    // Overall score
    const totalCurrent = scores.reduce((sum, s) => sum + s.current_score, 0);
    const totalMax = scores.reduce((sum, s) => sum + s.max_score, 0);
    const overall = totalMax > 0 ? (totalCurrent / totalMax) * 100 : 0;
    setOverallScore(overall);

    // Grade assignment
    if (overall >= 80) setGrade('A - Mature');
    else if (overall >= 60) setGrade('B - Developing');
    else if (overall >= 40) setGrade('C - Basic');
    else setGrade('D - Emerging');
  }, [scores]);

  // Quick Win identification
  const quickWins = scores.filter(s => s.current_score <= 2 && s.criticality >= 4);
  const strengths = scores.filter(s => s.current_score >= 4);

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 dark:bg-slate-900">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">District Skill Matrix Assessment Results</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Self-evaluation scores across {scores.length} indicators & {componentScores.length} components</p>
      </div>

      {/* Inference Panel */}
      <div className="rounded-xl border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Maturity Insight</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Overall district maturity: <span className="font-bold text-blue-600 dark:text-blue-400">{overallScore.toFixed(1)}% (Grade: {grade})</span>.
              Strongest component: <span className="font-bold text-emerald-600 dark:text-emerald-400">{[...componentScores].sort((a, b) => b.percentage - a.percentage)[0]?.component || 'N/A'}</span> ({[...componentScores].sort((a, b) => b.percentage - a.percentage)[0]?.percentage.toFixed(0) || 0}%).
              Weakest: <span className="font-bold text-red-500">{[...componentScores].sort((a, b) => a.percentage - b.percentage)[0]?.component || 'N/A'}</span> ({[...componentScores].sort((a, b) => a.percentage - b.percentage)[0]?.percentage.toFixed(0) || 0}%).
              <span className="font-bold text-amber-500">{quickWins.length} Quick Wins</span> identified (critical gaps scoring ≤2).
            </p>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="rounded-xl border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/40 border-4 border-blue-600 mb-4">
          <div>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{overallScore.toFixed(1)}</p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Out of 100</p>
          </div>
        </div>
        <p className="text-2xl font-black text-slate-900 dark:text-white mb-2">District Maturity Grade: {grade}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Based on {scores.length} indicator assessments across {componentScores.length} components</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Indicators', value: scores.length.toString(), icon: Target, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Quick Wins (≤2, critical)', value: quickWins.length.toString(), icon: AlertCircle, color: 'text-red-500' },
          { label: 'Strengths (≥4)', value: strengths.length.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Components Assessed', value: componentScores.length.toString(), icon: Award, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{kpi.label}</span>
              <kpi.icon className={cn('h-5 w-5', kpi.color)} />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5-Dimension Maturity Radar</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Current state vs 100% target</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="component" tick={{ fontSize: 10, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Radar name="Target" dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Component Breakdown */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Component Score Breakdown</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Progress toward max score per component</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={componentScores} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="component" tick={{ fontSize: 9 }} width={115} />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {componentScores.map((c, i) => (
                  <Cell key={i} fill={
                    c.percentage >= 70 ? '#22c55e' :
                      c.percentage >= 50 ? '#f59e0b' : '#ef4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indicator Heatmap */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Indicator-Level Heatmap</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">All {scores.length} indicators color-coded by score</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scores.map((score, i) => (
            <div key={i} className={cn(
              'p-4 rounded-lg border transition-all hover:scale-[1.02]',
              score.percentage >= 70 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :
                score.percentage >= 50 ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                  score.percentage >= 30 ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/30' : 'border-red-500 bg-red-100 dark:bg-red-900/30'
            )}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{score.row_id}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{score.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{score.component}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-2xl font-black',
                    score.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                      score.percentage >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                  )}>{score.current_score}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">/ {score.max_score}</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full',
                  score.percentage >= 70 ? 'bg-emerald-500' :
                    score.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                )} style={{ width: `${score.percentage}%` }} />
              </div>
              {score.criticality >= 4 && score.current_score <= 2 && (
                <div className="mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Quick Win</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-red-500 bg-red-50 dark:bg-red-900/20 p-6">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Quick Wins (Critical & Low Score)
          </h3>
          <div className="space-y-3">
            {quickWins.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No critical gaps with low scores. Good job!</p>
            ) : (
              quickWins.map((qw, i) => (
                <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-red-300 dark:border-red-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{qw.title}</span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">{qw.current_score}/{qw.max_score}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{qw.component} • Criticality: {qw.criticality}/5</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-6">
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Strengths (Score ≥ 4)
          </h3>
          <div className="space-y-3">
            {strengths.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No indicators with score ≥4 yet. Keep improving!</p>
            ) : (
              strengths.map((st, i) => (
                <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{st.title}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{st.current_score}/{st.max_score}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{st.component}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
