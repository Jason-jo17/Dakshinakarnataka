
import React, { useState } from 'react';
import { ArrowLeft, Users, Briefcase, FileText, Building2, Wallet, MapPin, Banknote, Building, PieChart } from 'lucide-react';
import { SocialCategoryAnalysis } from './SocialCategoryAnalysis';
import { SectorwiseAnalysis } from './SectorwiseAnalysis';
import { SchemewiseAnalysis } from './SchemewiseAnalysis';
import { TrainingPartnerAnalysis } from './TrainingPartnerAnalysis';
import { CostCategoryAnalysis } from './CostCategoryAnalysis';

type AnalysisView =
  | 'home'
  | 'social-category'
  | 'sectorwise'
  | 'schemewise'
  | 'training-partner'
  | 'cost-category'
  | 'placement-location'
  | 'wage'
  | 'key-employers'
  | 'social-category-sector';

export const TraineeDataAnalysis: React.FC = () => {
  const [currentView, setCurrentView] = useState<AnalysisView>('home');

  const analysisOptions = [
    { id: 'social-category', label: 'Social Category Analysis', icon: Users, color: 'bg-blue-500' },
    { id: 'sectorwise', label: 'Sectorwise Analysis', icon: Briefcase, color: 'bg-green-500' },
    { id: 'schemewise', label: 'Schemewise Analysis', icon: FileText, color: 'bg-purple-500' },
    { id: 'training-partner', label: 'Training Partner Analysis', icon: Building2, color: 'bg-orange-500' },
    { id: 'cost-category', label: 'Cost Category Analysis', icon: Wallet, color: 'bg-teal-500' },
    { id: 'placement-location', label: 'Placement Location Analysis', icon: MapPin, color: 'bg-red-500' },
    { id: 'wage', label: 'Wage Analysis', icon: Banknote, color: 'bg-yellow-500' },
    { id: 'key-employers', label: 'List of Key Employers', icon: Building, color: 'bg-indigo-500' },
    { id: 'social-category-sector', label: 'Social Category Analysis by Sector', icon: PieChart, color: 'bg-pink-500' },
  ] as const;

  if (currentView === 'social-category') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Analysis Menu
        </button>
        <SocialCategoryAnalysis />
      </div>
    );
  }

  if (currentView === 'sectorwise') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Analysis Menu
        </button>
        <SectorwiseAnalysis />
      </div>
    );
  }

  if (currentView === 'schemewise') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Analysis Menu
        </button>
        <SchemewiseAnalysis />
      </div>
    );
  }

  if (currentView === 'training-partner') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Analysis Menu
        </button>
        <TrainingPartnerAnalysis />
      </div>
    );
  }

  if (currentView === 'cost-category') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Analysis Menu
        </button>
        <CostCategoryAnalysis />
      </div>
    );
  }

  if (currentView !== 'home') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Analysis Menu
        </button>
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
          <p className="text-gray-600">This analysis module is currently under development.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Trainee Data Analysis</h2>
        <p className="text-gray-600">Select an analysis category below to view detailed reports and enter data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analysisOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setCurrentView(option.id as AnalysisView)}
            className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${option.color} opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500`} />

            <div className="relative z-10">
              <div className={`w-12 h-12 ${option.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <option.icon className={`w-6 h-6 ${option.color.replace('bg-', 'text-')}`} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {option.label}
              </h3>
              <p className="text-sm text-gray-500">
                View detailed analysis and manage data
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
