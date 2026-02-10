import { useState } from 'react';
import { ArrowLeft, Building2, Users, FileText, Briefcase, Tractor, TrendingUp } from 'lucide-react';
import SurveyEmployerForm from './SurveyEmployerForm';
import SkillGapStudyForm from './SkillGapStudyForm';
import MacroAnalysisForm from './MacroAnalysisForm';
import DemandGPDPForm from './DemandGPDPForm';
import SelfEmploymentForm from './SelfEmploymentForm';
import PrimaryDemandForm from './PrimaryDemandForm';

import AggregateDemandSummary from './AggregateDemandSummary';

interface AggregateDemandViewProps {
  onBack: () => void;
}

type Tab = 'employer' | 'skill-gap' | 'macro' | 'gpdp' | 'self-emp' | 'primary' | 'summary';

export default function AggregateDemandView({ onBack }: AggregateDemandViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('employer');

  const tabs = [
    { id: 'employer', label: 'Survey of Employer (2A)', icon: Building2 },
    { id: 'skill-gap', label: 'Skill Gap Study (2B)', icon: FileText },
    { id: 'macro', label: 'Macro Analysis (2C)', icon: TrendingUp },
    { id: 'gpdp', label: 'Demand GPDP & Govt', icon: Users },
    { id: 'self-emp', label: 'Self Employment', icon: Briefcase },
    { id: 'primary', label: 'Primary Demand', icon: Tractor },
    { id: 'summary', label: 'Summary', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Aggragate Demand Analysis
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Data entry for demand analysis, employer surveys, and macro-economic indicators.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          {activeTab === 'employer' && <SurveyEmployerForm />}
          {activeTab === 'skill-gap' && <SkillGapStudyForm />}
          {activeTab === 'macro' && <MacroAnalysisForm />}
          {activeTab === 'gpdp' && <DemandGPDPForm />}
          {activeTab === 'self-emp' && <SelfEmploymentForm />}
          {activeTab === 'primary' && <PrimaryDemandForm />}
          {activeTab === 'summary' && <AggregateDemandSummary />}
        </div>
      </div>
    </div>
  );
}
