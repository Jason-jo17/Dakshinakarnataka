import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Sparkles, TrendingUp, AlertTriangle, Target, Loader2 } from 'lucide-react';
import { getAIInsightGenerator, type InsightResponse, type DashboardMetrics } from '../../lib/ai-insights';

interface AIInsightPanelProps {
  context: string;
  metrics: DashboardMetrics;
  existingInsight?: string;
  variant?: 'primary' | 'warning' | 'danger' | 'success';
  icon?: React.ComponentType<any>;
  autoGenerate?: boolean;
}

export default function AIInsightPanel({
  context,
  metrics,
  existingInsight,
  variant = 'primary',
  icon: Icon,
  autoGenerate = false,
}: AIInsightPanelProps) {
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  
  const variantStyles = {
    primary: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
    warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10',
    danger: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
    success: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/10',
  };
  
  const iconColors = {
    primary: 'text-blue-600 dark:text-blue-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
    success: 'text-emerald-600 dark:text-emerald-400',
  };
  
  const DefaultIcon = Icon || (variant === 'warning' ? AlertTriangle : variant === 'danger' ? AlertTriangle : variant === 'success' ? TrendingUp : Target);
  
  useEffect(() => {
    if (autoGenerate) {
      generateAIInsight();
    }
  }, [autoGenerate]);
  
  const generateAIInsight = async () => {
    setLoading(true);
    try {
      const generator = getAIInsightGenerator();
      const result = await generator.generateInsight(context, metrics, existingInsight);
      setInsight(result);
      setShowAI(true);
    } catch (error) {
      console.error('Failed to generate AI insight:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={cn('rounded-xl border-l-4 p-4 transition-all', variantStyles[variant])}>
      <div className="flex items-start gap-3">
        <DefaultIcon className={cn('h-5 w-5 mt-0.5', iconColors[variant])} />
        <div className="flex-1 space-y-2">
          {/* Manual Insight (Always Show) */}
          {existingInsight && (
            <>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Key Insight</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{existingInsight}</p>
            </>
          )}
          
          {/* AI Insight Toggle */}
          {!autoGenerate && (
            <button
              onClick={() => {
                if (!showAI && !insight) {
                  generateAIInsight();
                } else {
                  setShowAI(!showAI);
                }
              }}
              disabled={loading}
              className={cn(
                'flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all mt-2',
                showAI ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600'
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Generating AI Insight...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  <span>{showAI ? 'Hide AI Insight' : 'Generate AI Insight'}</span>
                </>
              )}
            </button>
          )}
          
          {/* AI Generated Insight */}
          {showAI && insight && (
            <div className="mt-4 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">AI-Generated Analysis</p>
              </div>
              
              {insight.headline && (
                <p className="text-sm font-bold text-slate-900 dark:text-white">{insight.headline}</p>
              )}
              
              {insight.keyMetrics.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Key Metrics</p>
                  <ul className="space-y-1">
                    {insight.keyMetrics.map((metric, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insight.recommendations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommendations</p>
                  <ul className="space-y-1">
                    {insight.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insight.urgentActions.length > 0 && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Urgent Actions
                  </p>
                  <ul className="space-y-1">
                    {insight.urgentActions.map((action, i) => (
                      <li key={i} className="text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">!</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
