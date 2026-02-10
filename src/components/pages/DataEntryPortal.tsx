
import {
  Building2,
  GraduationCap,
  Network,
  ArrowLeft,
  Plus,
  FileText,
  Calculator
} from 'lucide-react';

interface DataEntryPortalProps {
  onBack: () => void;
  onAction: (action: 'institution' | 'company' | 'coe' | 'plan' | 'schemes' | 'trainer' | 'iti-trade' | 'training-center' | 'trainee-details' | 'trainee-analysis' | 'district-skill-matrix' | 'aggregate-demand') => void;
}

export default function DataEntryPortal({ onBack, onAction }: DataEntryPortalProps) {
  const actions = [
    {
      id: 'schemes',
      title: 'Schemes (1.b)',
      description: 'Manage individual government schemes and their details.',
      icon: FileText, // Using same icon, or import a new one like Scroll or Book
      color: 'bg-orange-100 text-orange-600',
      actionId: 'schemes'
    },
    {
      id: 'plan',
      title: 'District Skill Plan',
      description: 'Manage the annual skill development plan and committee details.',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      actionId: 'plan'
    },
    {
      id: 'institution',
      title: 'Add Institution',
      description: 'Register a new college, school, or training center.',
      icon: GraduationCap,
      color: 'bg-emerald-100 text-emerald-600',
      actionId: 'institution'
    },
    {
      id: 'company',
      title: 'Add Company',
      description: 'Register a new industry partner or recruiter.',
      icon: Building2,
      color: 'bg-blue-100 text-blue-600',
      actionId: 'company'
    },

    {
      id: 'coe',
      title: 'Add CoE',
      description: 'Register a Center of Excellence or Research Hub.',
      icon: Network,
      color: 'bg-amber-100 text-amber-600',
      actionId: 'coe'
    },
    {
      id: 'trainer',
      title: 'Trainer Data',
      description: 'Manage trainer profiles and certifications.',
      icon: GraduationCap, // Reusing GraduationCap or similar
      color: 'bg-teal-100 text-teal-600',
      actionId: 'trainer'
    },
    {
      id: 'iti-trade',
      title: 'ITI Trade Data',
      description: 'Manage ITI trade statistics and view state averages.',
      icon: GraduationCap, // Reusing icon or specific one if available
      color: 'bg-cyan-100 text-cyan-600',
      actionId: 'iti-trade'
    },
    {
      id: 'training-center',
      title: 'Training Center Info (1E.1)',
      description: 'Manage details regarding Training Centers, Capacity, and Facilities.',
      icon: Building2,
      color: 'bg-indigo-100 text-indigo-600',
      actionId: 'training-center'
    },
    {
      id: 'trainee-details',
      title: 'Trainee Details (1F.1)',
      description: 'Manage Candidate, Training, and Post-Training details entry.',
      icon: GraduationCap,
      color: 'bg-rose-100 text-rose-600',
      actionId: 'trainee-details'
    },
    {
      id: 'trainee-analysis',
      title: 'Trainee Data Analysis',
      description: 'Analyze social categories, sectors, schemes, and more.',
      icon: FileText, // Using FileText or similar, imported above
      color: 'bg-indigo-100 text-indigo-600',
      actionId: 'trainee-analysis'
    },
    {
      id: 'district-skill-matrix',
      title: 'District Skill Matrix',
      description: 'Fill self-scoring grid and calculate district score.',
      icon: Calculator,
      color: 'bg-teal-100 text-teal-600',
      actionId: 'district-skill-matrix'
    },
    {
      id: 'aggregate-demand',
      title: 'Aggregate Demand',
      description: 'Surveys, Skill Gap Studies, and Macro Analysis.',
      icon: Building2,
      color: 'bg-blue-100 text-blue-600',
      actionId: 'aggregate-demand'
    }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Data Entry Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and update the district's skill intelligence database
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                console.log('Button clicked:', action.actionId);
                onAction(action.actionId as any);
              }}
              className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all text-left flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
