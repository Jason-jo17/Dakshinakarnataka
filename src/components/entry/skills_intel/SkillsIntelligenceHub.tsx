import React, { useState } from 'react';
import DistrictSkillMatrix from './DistrictSkillMatrix';
import AggregateDemandSummary from './AggregateDemandSummary';
import GapAnalysisReport from './GapAnalysisReport';
import AnnualWorkPlanReport from './AnnualWorkPlanReport';
import PriorityAssignmentReport from './PriorityAssignmentReport';
import ComprehensiveGapAnalysis from './ComprehensiveGapAnalysis';
import MacroEconomicDemandProjection from './MacroEconomicDemandProjection';
import GPDPGovernmentDemand from './GPDPGovernmentDemand';
import PrimarySectorSkilling from './PrimarySectorSkilling';
import ConsolidatedWorkPlan from './ConsolidatedWorkPlan';
import { AsIsAnalysis } from './AsIsAnalysis';
import AsIsScenario from '../../dashboards/AsIsScenario';
import MacroGPDP from '../../dashboards/MacroGPDP';
import PrimarySector from '../../dashboards/PrimarySector';
import AnnualWorkPlan from '../../dashboards/AnnualWorkPlan';
import ExecutiveDashboard from '../../dashboards/ExecutiveDashboard';
import { LayoutDashboard, BarChart3, PieChart, Calendar, Target, ShieldAlert, TrendingUp, Sprout, ClipboardCheck, History, Crown } from 'lucide-react';

export const SkillsIntelligenceHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'executive' | 'matrix' | 'demand' | 'gap' | 'priority' | 'comprehensive' | 'macro_govt' | 'primary' | 'plan' | 'consolidated' | 'asis'>('executive');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Top Navigation / Tab Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-orange-600" />
                        Intelligence Hub
                    </h1>
                    <div className="text-sm text-gray-500">
                        Dakshina Kannada • 2024-25
                    </div>
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('executive')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'executive'
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <Crown className="w-4 h-4" />
                        Executive
                    </button>
                    <button
                        onClick={() => setActiveTab('asis')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'asis'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        As Is
                    </button>
                    <button
                        onClick={() => setActiveTab('matrix')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'matrix'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Matrix
                    </button>
                    <button
                        onClick={() => setActiveTab('demand')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'demand'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Demand
                    </button>
                    <button
                        onClick={() => setActiveTab('gap')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'gap'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <PieChart className="w-4 h-4" />
                        Gap
                    </button>
                    <button
                        onClick={() => setActiveTab('comprehensive')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'comprehensive'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Consolidated
                    </button>
                    <button
                        onClick={() => setActiveTab('macro_govt')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'macro_govt'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Macro & Govt
                    </button>
                    <button
                        onClick={() => setActiveTab('primary')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'primary'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <Sprout className="w-4 h-4" />
                        Primary
                    </button>
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'plan'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Annual Plan
                    </button>
                    <button
                        onClick={() => setActiveTab('consolidated')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'consolidated'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        Master Plan
                    </button>
                    <button
                        onClick={() => setActiveTab('priority')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === 'priority'
                            ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <Target className="w-4 h-4" />
                        Priority
                    </button>

                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-6 pb-10">
                {activeTab === 'executive' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ExecutiveDashboard />
                    </div>
                )}
                {activeTab === 'matrix' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <DistrictSkillMatrix />
                    </div>
                )}
                {activeTab === 'demand' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AggregateDemandSummary />
                    </div>
                )}
                {activeTab === 'gap' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <GapAnalysisReport />
                    </div>
                )}
                {activeTab === 'comprehensive' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ComprehensiveGapAnalysis />
                    </div>
                )}
                {activeTab === 'macro_govt' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        <MacroGPDP />
                        <div className="border-t border-slate-200 dark:border-slate-700 my-8"></div>
                        <MacroEconomicDemandProjection />
                        <div className="border-t border-slate-200 dark:border-slate-700 my-8"></div>
                        <GPDPGovernmentDemand />
                    </div>
                )}
                {activeTab === 'primary' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PrimarySector />
                        <div className="border-t border-slate-200 dark:border-slate-700 my-8"></div>
                        <PrimarySectorSkilling />
                    </div>
                )}
                {activeTab === 'plan' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AnnualWorkPlanReport />
                        <div className="border-t border-slate-200 dark:border-slate-700 my-8"></div>
                        <AnnualWorkPlan />
                    </div>
                )}
                {activeTab === 'consolidated' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ConsolidatedWorkPlan />
                    </div>
                )}
                {activeTab === 'priority' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PriorityAssignmentReport />
                    </div>
                )}
                {activeTab === 'asis' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <AsIsScenario />
                        <AsIsAnalysis />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsIntelligenceHub;
