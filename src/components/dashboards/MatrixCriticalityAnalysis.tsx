import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '../../lib/utils';
import { Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

// Data Schema from Image 2
interface MatrixParameter {
  s_no: string; // e.g., "1.1", "2.1a"
  parameter: string;
  score: number; // 0-5 or #DIV/0! or other formula
  criticality: number; // 0-5, blank means not applicable
  indexed: number; // score × criticality
  component: string; // e.g., "Component 1", "Component 2"
}

interface ComponentScore {
  component: string;
  total_score: number;
  max_score: number;
  percentage: number;
  parameter_count: number;
}

// Sample data from Image 2 structure
const SAMPLE_MATRIX_DATA: MatrixParameter[] = [
  // Component 1: Institutional Strengthening
  { s_no: '1.1', parameter: 'DSC has been constituted and has started its functions of planning and monitoring skill', score: 0, criticality: 5, indexed: 0, component: 'Component 1' },
  { s_no: '1.1a', parameter: 'Planning', score: 0, criticality: 5, indexed: 0, component: 'Component 1' },
  { s_no: '1.1b', parameter: 'Monitoring', score: 0, criticality: 5, indexed: 0, component: 'Component 1' },
  { s_no: '1.2', parameter: 'DSC has capacity, infra and its utilisation, trades', score: 0, criticality: 4, indexed: 0, component: 'Component 1' },
  { s_no: '1.3a', parameter: 'Percentage of Centres operational in district', score: 4, criticality: 5, indexed: 20, component: 'Component 1' },
  { s_no: '1.3b', parameter: 'Percentage of Centres operational in district', score: 0, criticality: 4, indexed: 0, component: 'Component 1' },
  { s_no: '1.3c', parameter: 'Ratio of Cost per Candidate placed to Govt', score: 0, criticality: 3, indexed: 0, component: 'Component 1' },
  
  // Component 2: Improved Quality
  { s_no: '2.1', parameter: 'Ratio as Performance of VET Players', score: 0, criticality: 5, indexed: 0, component: 'Component 2' },
  { s_no: '2.1a', parameter: 'Percentage of Centres operational in district', score: 0, criticality: 5, indexed: 0, component: 'Component 2' },
  { s_no: '2.1b', parameter: 'Percentage of Centres operational in district', score: 4, criticality: 4, indexed: 16, component: 'Component 2' },
  { s_no: '2.2a', parameter: 'District has a functional mechanism for', score: 0, criticality: 4, indexed: 0, component: 'Component 2' },
  { s_no: '2.2b', parameter: 'District has a functional evidence to collect fee', score: 0, criticality: 3, indexed: 0, component: 'Component 2' },
  { s_no: '2.3', parameter: 'Data on students enrolled at TP, Faculty and', score: 0, criticality: 5, indexed: 0, component: 'Component 2' },
  { s_no: '2.3a', parameter: 'Placement Analysis', score: 0, criticality: 5, indexed: 0, component: 'Component 2' },
  { s_no: '2.3b', parameter: 'Wage gap between male and female trainees', score: 0, criticality: 4, indexed: 0, component: 'Component 2' },
  
  // Component 3: Training Development
  { s_no: '2.4', parameter: 'Training Development Initiatives', score: 0, criticality: 4, indexed: 0, component: 'Component 3' },
  { s_no: '2.4a', parameter: 'Data on facility, infra certification of building', score: 0, criticality: 4, indexed: 0, component: 'Component 3' },
  { s_no: '2.4b', parameter: 'Data has a mechanism for Facilitating', score: 0, criticality: 3, indexed: 0, component: 'Component 3' },
  
  // Component 4: Mobilisation and Aptitude
  { s_no: '2.5', parameter: 'Mobilisation and Aptitude Test', score: 0, criticality: 5, indexed: 0, component: 'Component 4' },
  { s_no: '2.5a', parameter: 'DSC has been able to coordinate mobilisation', score: 0, criticality: 5, indexed: 0, component: 'Component 4' },
  { s_no: '2.5b', parameter: 'DSC has been able to coordinate a process of', score: 4, criticality: 4, indexed: 16, component: 'Component 4' },
  
  // Improved Access sections
  { s_no: '3.1', parameter: 'Improved Access and Completion for SC', score: 0, criticality: 4, indexed: 0, component: 'Access - SC' },
  { s_no: '3.1a', parameter: 'Ratio between SC youth (16-25) share in', score: 0, criticality: 4, indexed: 0, component: 'Access - SC' },
  { s_no: '3.1b', parameter: 'Ratio between SC youth (16-25) share in', score: 0, criticality: 3, indexed: 0, component: 'Access - SC' },
  
  { s_no: '3.2', parameter: 'Improved Access and Completion for ST', score: 0, criticality: 4, indexed: 0, component: 'Access - ST' },
  { s_no: '3.2a', parameter: 'Ratio between ST youth (16-25) share in', score: 0, criticality: 4, indexed: 0, component: 'Access - ST' },
  { s_no: '3.2b', parameter: 'Ratio between ST youth (16-25) share in', score: 3, criticality: 3, indexed: 9, component: 'Access - ST' },
  
  { s_no: '3.3', parameter: 'Improved Access and Completion for Women', score: 0, criticality: 5, indexed: 0, component: 'Access - Women' },
  { s_no: '3.3a', parameter: "Pilot done/ New guidance taken for district's", score: 0, criticality: 5, indexed: 0, component: 'Access - Women' },
  { s_no: '3.3b', parameter: 'Ratio between minority youth (16-25) share in', score: 0, criticality: 4, indexed: 0, component: 'Access - Women' },
  
  { s_no: '3.4', parameter: 'Improved Access and Completion for PwD', score: 0, criticality: 4, indexed: 0, component: 'Access - PwD' },
  { s_no: '3.5', parameter: 'Improved Access and Completion for minorities', score: 0, criticality: 3, indexed: 0, component: 'Access - Minorities' },
];

export default function MatrixCriticalityAnalysis() {
  // Component-wise aggregation
  const componentScores: ComponentScore[] = [];
  const components = ['Component 1', 'Component 2', 'Component 3', 'Component 4', 'Access - SC', 'Access - ST', 'Access - Women', 'Access - PwD', 'Access - Minorities'];
  
  components.forEach(comp => {
    const params = SAMPLE_MATRIX_DATA.filter(p => p.component === comp);
    const totalScore = params.reduce((sum, p) => sum + p.score, 0);
    const maxScore = params.length * 5; // Assuming max score per parameter is 5
    
    componentScores.push({
      component: comp,
      total_score: totalScore,
      max_score: maxScore,
      percentage: maxScore > 0 ? (totalScore / maxScore) * 100 : 0,
      parameter_count: params.length,
    });
  });
  
  // Priority matrix: Score vs Criticality
  const priorityMatrix = SAMPLE_MATRIX_DATA.map(p => ({
    parameter: p.parameter.substring(0, 30) + '...', // Truncate for display
    score: p.score,
    criticality: p.criticality,
    indexed: p.indexed,
    quadrant: p.score >= 3 && p.criticality >= 4 ? 'strong' :
             p.score < 3 && p.criticality >= 4 ? 'urgent' :
             p.score >= 3 && p.criticality < 4 ? 'maintain' : 'low-priority',
  }));
  
  // Critical gaps (low score, high criticality)
  const criticalGaps = SAMPLE_MATRIX_DATA.filter(p => p.score <= 2 && p.criticality >= 4);
  const strengths = SAMPLE_MATRIX_DATA.filter(p => p.score >= 4 && p.criticality >= 3);
  
  // Indexed score (score × criticality) ranking
  const indexedRanking = [...SAMPLE_MATRIX_DATA]
    .sort((a, b) => b.indexed - a.indexed)
    .slice(0, 10);

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5A1 Matrix Criticality Analysis</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Prioritizing {SAMPLE_MATRIX_DATA.length} parameters across {components.length} components using Score × Criticality
        </p>
      </div>

      {/* Inference Panel */}
      <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Criticality-Weighted Insight</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-bold text-red-500">{criticalGaps.length} critical gaps</span> identified (score ≤2, criticality ≥4) 
              — these are high-impact areas with poor performance. 
              Top indexed score: <span className="font-bold text-emerald-600">
                {indexedRanking[0]?.parameter} ({indexedRanking[0]?.indexed})
              </span>. 
              Component performance: <span className="font-bold text-amber-500">
                {componentScores.sort((a,b) => b.percentage - a.percentage)[0]?.component}
              </span> leads at {componentScores.sort((a,b) => b.percentage - a.percentage)[0]?.percentage.toFixed(0)}%, 
              while <span className="font-bold text-red-500">
                {componentScores.sort((a,b) => a.percentage - b.percentage)[0]?.component}
              </span> trails at {componentScores.sort((a,b) => a.percentage - b.percentage)[0]?.percentage.toFixed(0)}%.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Parameters', value: SAMPLE_MATRIX_DATA.length.toString(), icon: Target, color: 'text-blue-600' },
          { label: 'Critical Gaps (≤2, ≥4)', value: criticalGaps.length.toString(), icon: AlertCircle, color: 'text-red-500' },
          { label: 'Strengths (≥4, ≥3)', value: strengths.length.toString(), icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Components Assessed', value: components.length.toString(), icon: TrendingUp, color: 'text-amber-500' },
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
        {/* Priority Matrix (Score vs Criticality) */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Priority Matrix: Score × Criticality</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            2×2 quadrant showing urgency (criticality) vs performance (score)
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="score" 
                domain={[0, 5]}
                tick={{ fontSize: 10 }}
                label={{ value: 'Current Score →', position: 'bottom', offset: 20, fontSize: 11, fontWeight: 'bold' }}
                stroke="#94a3b8"
              />
              <YAxis 
                type="number" 
                dataKey="criticality" 
                domain={[0, 5]}
                tick={{ fontSize: 10 }}
                label={{ value: '← Criticality (Importance)', angle: -90, position: 'left', offset: 40, fontSize: 11, fontWeight: 'bold' }}
                stroke="#94a3b8"
              />
              <ZAxis range={[60, 300]} />
              <Tooltip 
                content={({ payload }) => payload?.[0] ? (
                  <div className="rounded-lg border bg-white p-3 shadow-lg border-slate-200">
                    <p className="text-xs font-bold text-slate-900">{payload[0].payload.parameter}</p>
                    <div className="mt-1 space-y-1 text-xs text-slate-600">
                      <p>Score: <span className="font-bold">{payload[0].payload.score}</span></p>
                      <p>Criticality: <span className="font-bold">{payload[0].payload.criticality}</span></p>
                      <p>Indexed: <span className="font-bold text-blue-600">{payload[0].payload.indexed}</span></p>
                    </div>
                  </div>
                ) : null}
              />
              <Scatter data={priorityMatrix}>
                {priorityMatrix.map((entry, i) => (
                  <Cell key={i} fill={
                    entry.quadrant === 'urgent' ? '#ef4444' :
                    entry.quadrant === 'strong' ? '#10b981' :
                    entry.quadrant === 'maintain' ? '#f59e0b' : '#94a3b8'
                  } fillOpacity={0.7} stroke={
                    entry.quadrant === 'urgent' ? '#ef4444' :
                    entry.quadrant === 'strong' ? '#10b981' :
                    entry.quadrant === 'maintain' ? '#f59e0b' : '#94a3b8'
                  } strokeWidth={2} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-600 dark:text-slate-300">Urgent (low score, high criticality)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Strong (high score, high criticality)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600 dark:text-slate-300">Maintain (high score, low criticality)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-slate-600 dark:text-slate-300">Low Priority</span>
            </div>
          </div>
        </div>

        {/* Component Performance */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Component-Wise Performance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Aggregate score % across {components.length} major components
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={componentScores} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} stroke="#94a3b8" />
              <YAxis type="category" dataKey="component" tick={{ fontSize: 8 }} width={75} stroke="#94a3b8" />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="percentage" radius={[0,4,4,0]}>
                {componentScores.map((c, i) => (
                  <Cell key={i} fill={
                    c.percentage >= 70 ? '#10b981' :
                    c.percentage >= 50 ? '#f59e0b' : '#ef4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Indexed Score Ranking */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Top 10 by Indexed Score (Score × Criticality)</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Highest priority parameters considering both performance and importance
          </p>
          <div className="space-y-3">
            {indexedRanking.map((param, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">{i+1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{param.s_no}: {param.parameter}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Score: {param.score}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Criticality: {param.criticality}</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">{param.indexed}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" 
                      style={{ width: `${(param.indexed / (indexedRanking[0]?.indexed || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Gaps Alert */}
        {criticalGaps.length > 0 && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Critical Gaps Requiring Immediate Action
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {criticalGaps.map((gap, i) => (
                <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{gap.s_no}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{gap.parameter}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-2xl font-black text-red-500">{gap.score}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">/ 5</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Criticality: {gap.criticality}/5</span>
                    <span className="font-bold text-red-500">Indexed: {gap.indexed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
