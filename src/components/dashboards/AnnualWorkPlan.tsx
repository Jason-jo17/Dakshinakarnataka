import { cn } from '../../lib/utils';
import { Calendar, CheckCircle2, Clock, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { AIInsights } from '../common/AIInsights';

const TASKS = [
  { id: 1, activity: 'Demand Aggregation', status: 'completed', progress: 100, startMonth: 0, endMonth: 2, owner: 'Rahul S.', dept: 'Industry & Commerce' },
  { id: 2, activity: 'TP Empanelment', status: 'in-progress', progress: 65, startMonth: 2, endMonth: 5, owner: 'Anita K.', dept: 'Higher Education' },
  { id: 3, activity: 'Batch Commencement', status: 'delayed', progress: 20, startMonth: 4, endMonth: 8, owner: 'Vikram P.', dept: 'Skill Dev Society' },
  { id: 4, activity: 'Center Audit - Phase 1', status: 'completed', progress: 100, startMonth: 1, endMonth: 3, owner: 'Rahul S.', dept: 'Industry & Commerce' },
  { id: 5, activity: 'Curriculum Validation', status: 'in-progress', progress: 78, startMonth: 2, endMonth: 6, owner: 'Anita K.', dept: 'Higher Education' },
  { id: 6, activity: 'Trainee Kits Distribution', status: 'delayed', progress: 35, startMonth: 3, endMonth: 5, owner: 'Vikram P.', dept: 'Skill Dev Society' },
  { id: 7, activity: 'Industry Linkage Workshops', status: 'in-progress', progress: 55, startMonth: 5, endMonth: 8, owner: 'Priya M.', dept: 'Industry & Commerce' },
  { id: 8, activity: 'Placement Drive - Q1', status: 'completed', progress: 100, startMonth: 8, endMonth: 9, owner: 'Suresh K.', dept: 'Employment Exchange' },
];

const DEPT_WORKLOAD = [
  { dept: 'Education', tasks: 28, pct: 40 },
  { dept: 'Labor', tasks: 42, pct: 85 },
  { dept: 'Industry', tasks: 52, pct: 100 },
  { dept: 'Agriculture', tasks: 31, pct: 60 },
  { dept: 'Tourism', tasks: 26, pct: 50 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnnualWorkPlan() {
  const completed = TASKS.filter(t => t.status === 'completed').length;
  const inProgress = TASKS.filter(t => t.status === 'in-progress').length;
  const delayed = TASKS.filter(t => t.status === 'delayed').length;

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Annual Work Plan 2024</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Strategic implementation monitoring for departmental skill goals</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:brightness-110 transition-all">
          <Calendar className="h-4 w-4" />
          <span>Export Timeline</span>
        </button>
      </div>

      {/* Inference Panel */}
      <div className="rounded-xl border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Implementation Status</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {completed} of {TASKS.length} tasks completed ({((completed / TASKS.length) * 100).toFixed(0)}%).
              <span className="font-bold text-red-500"> {delayed} tasks delayed</span> —
              "Batch Commencement" (20% complete) and "Trainee Kits Distribution" (35%) need immediate escalation.
              Industry & Commerce dept shows highest workload (100% capacity).
              Overall timeline: <span className="font-bold text-emerald-600">Q1-Q2 on track</span>, but Q3 activities at risk.
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Completed</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{completed}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">On schedule</p>
        </div>

        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase">In Progress</span>
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-700 dark:text-blue-400">{inProgress}</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Active now</p>
        </div>

        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase">Delayed</span>
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-700 dark:text-red-400">{delayed}</p>
          <p className="text-xs text-red-600 dark:text-red-500 mt-1">Needs escalation</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Tasks</span>
            <Users className="h-5 w-5 text-slate-900 dark:text-white" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{TASKS.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across 4 departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gantt Chart */}
        <div className="xl:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Implementation Timeline</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>FY 2024</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Gantt Header */}
              <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                <div className="col-span-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Activity</div>
                {MONTHS.slice(0, 9).map((month, i) => (
                  <div key={i} className="col-span-1 text-center text-xs font-bold text-slate-500 dark:text-slate-400">{month}</div>
                ))}
              </div>

              {/* Gantt Rows */}
              <div className="space-y-3">
                {TASKS.map((task) => (
                  <div key={task.id} className="grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg p-2 transition-colors">
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{task.activity}</p>
                      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded uppercase',
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}>
                        {task.status === 'completed' ? 'On Track' : task.status === 'in-progress' ? 'In Progress' : 'Delayed'}
                      </span>
                    </div>

                    {/* Timeline bars */}
                    <div className="col-span-9 relative flex">
                      {MONTHS.slice(0, 9).map((_, monthIdx) => (
                        <div key={monthIdx} className="flex-1 h-6 flex items-center justify-center">
                          {monthIdx >= task.startMonth && monthIdx <= task.endMonth && (
                            <div className={cn('h-6 w-full rounded-full overflow-hidden',
                              monthIdx === task.startMonth ? 'rounded-l-full' : '',
                              monthIdx === task.endMonth ? 'rounded-r-full' : '',
                              'bg-slate-100 dark:bg-slate-700'
                            )}>
                              <div className={cn('h-full transition-all',
                                task.status === 'completed' ? 'bg-emerald-500' :
                                  task.status === 'in-progress' ? 'bg-blue-500/70' : 'bg-red-500/70'
                              )} style={{ width: `${task.progress}%` }}>
                                {monthIdx === task.endMonth && (
                                  <span className="absolute right-2 text-[10px] font-bold text-white">{task.progress}%</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Responsibility Workload */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Responsibility Workload</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">128 Tasks across departments</p>
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
              <TrendingUp className="h-4 w-4" />
              <span>+12%</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-around gap-3">
            {DEPT_WORKLOAD.map((dept, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2">
                <div className={cn('w-full rounded-t transition-all',
                  dept.pct >= 80 ? 'bg-blue-600' : dept.pct >= 60 ? 'bg-blue-500' : 'bg-blue-400',
                  'hover:brightness-110'
                )} style={{ height: `${dept.pct}%` }} />
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase text-center">{dept.dept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Milestones & Activity Logs</h3>
          <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {TASKS.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full uppercase',
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                      {task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Review' : 'Delayed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{task.activity}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{task.dept}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-900 dark:text-white">{task.owner}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full',
                          task.status === 'completed' ? 'bg-emerald-500' :
                            task.status === 'in-progress' ? 'bg-blue-500' : 'bg-red-500'
                        )} style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{task.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights context="annual work plan and implementation monitoring" dataPoints={[
        `${completed} of ${TASKS.length} tasks completed (${((completed / TASKS.length) * 100).toFixed(0)}%)`,
        `${delayed} tasks delayed - requiring immediate attention`,
        'Industry & Commerce dept at 100% capacity',
        'Q1-Q2 on track, Q3 activities at risk',
        'Batch Commencement and Trainee Kits Distribution need escalation'
      ]} />
    </div>
  );
}
