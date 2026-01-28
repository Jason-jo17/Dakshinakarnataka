
import { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';

interface PlanSummary {
  id: string;
  title: string;
  created_at: string;
}

interface DistrictPlanListProps {
  onBack: () => void;
  onSelectPlan: (planId: string | null) => void; // null means create new
}

export default function DistrictPlanList({ onBack, onSelectPlan }: DistrictPlanListProps) {
  const { currentDistrict } = useAuthStore();
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentDistrict) {
      fetchPlans();
    }
  }, [currentDistrict]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('district_plans')
        .select('id, title, created_at')
        .eq('district_name', currentDistrict)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const { error } = await supabase
        .from('district_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                District Skill Plans
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Manage skill plans for {currentDistrict}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => onSelectPlan(null)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Plan
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border dashed border-2 border-slate-200 dark:border-slate-700">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No Plans Found</h3>
            <p className="text-slate-500 mb-6">Start by creating your first district skill plan.</p>
            <button 
              onClick={() => onSelectPlan(null)}
              className="text-blue-600 font-medium hover:underline"
            >
              Create New Plan
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => onSelectPlan(plan.id)}
                className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                      {plan.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      Created on {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button
                     onClick={(e) => handleDelete(plan.id, e)}
                     className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                     title="Delete Plan"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
