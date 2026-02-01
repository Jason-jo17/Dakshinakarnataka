import React, { useState } from 'react';
import { LayoutDashboard, Map, Building2, Users, Calculator } from 'lucide-react';
import { DSCStructureFunctioning } from './DSCStructureFunctioning.tsx';
import { DSCOperations } from './DSCOperations.tsx';
import { DistrictOverview } from './DistrictOverview.tsx';
import { MajorTowns } from './MajorTowns.tsx';
import { PopulationDataEntry } from './PopulationDataEntry.tsx';
import { YouthShareAnalysis } from './YouthShareAnalysis.tsx';
import { EducationDropoutAnalysis } from './EducationDropoutAnalysis.tsx';
import { ITIDataAnalysis } from './ITIDataAnalysis.tsx';
import { ShareAnalysis } from './ShareAnalysis.tsx';
import { SectorwiseScenario } from './SectorwiseScenario.tsx';
import { ProgramwiseScenario } from './ProgramwiseScenario.tsx';
import { SocialCategorySummary } from './SocialCategorySummary.tsx';
import { PlacementAsIsScenario } from './PlacementAsIsScenario.tsx';
import { SectorwiseAsIsScenario } from './SectorwiseAsIsScenario.tsx';
import { TrainingPartnerAsIsScenario } from './TrainingPartnerAsIsScenario.tsx';
import { CollegeEnrollmentAnalysis } from './CollegeEnrollmentAnalysis.tsx';
import { AgriYieldAnalysis } from './AgriYieldAnalysis.tsx';

type View = 'dsc_structure' | 'dsc_operations' | 'district_overview' | 'major_towns' | 'population_census' | 'population_alternate' | 'youth_share' | 'education_dise' | 'education_alternate' | 'iti_data' | 'share_analysis' | 'sector_scenario' | 'program_scenario' | 'social_summary' | 'placement_asis' | 'sector_asis' | 'tp_asis' | 'college_enrollments' | 'agri_yield';

export const ScenarioAnalysisHub: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('dsc_structure');

    const renderView = () => {
        switch (currentView) {
            case 'dsc_structure':
                return <DSCStructureFunctioning />;
            case 'dsc_operations':
                return <DSCOperations />;
            case 'district_overview':
                return <DistrictOverview />;
            case 'major_towns':
                return <MajorTowns />;
            case 'population_census':
                return <PopulationDataEntry
                    sourceType="census_2011"
                    title="Population Data (Census 2011)"
                    subtitle="Demographic breakup of youth population based on Census 2011."
                />;
            case 'population_alternate':
                return <PopulationDataEntry
                    sourceType="alternate"
                    title="Population Data (Alternate)"
                    subtitle="Update this section if using alternate population data sources."
                />;
            case 'youth_share':
                return <YouthShareAnalysis />;
            case 'education_dise':
                return <EducationDropoutAnalysis isAlternate={false} />;
            case 'education_alternate':
                return <EducationDropoutAnalysis isAlternate={true} />;
            case 'iti_data':
                return <ITIDataAnalysis />;
            case 'share_analysis':
                return <ShareAnalysis />;
            case 'sector_scenario':
                return <SectorwiseScenario />;
            case 'program_scenario':
                return <ProgramwiseScenario />;
            case 'social_summary':
                return <SocialCategorySummary />;
            case 'placement_asis':
                return <PlacementAsIsScenario title="Placement As Is Scenario" />;
            case 'sector_asis':
                return <SectorwiseAsIsScenario />;
            case 'tp_asis':
                return <TrainingPartnerAsIsScenario />;
            case 'college_enrollments':
                return <CollegeEnrollmentAnalysis />;
            case 'agri_yield':
                return <AgriYieldAnalysis />;
            default:
                return <DSCStructureFunctioning />;
        }
    };

    const navItems = [
        { id: 'dsc_structure', label: 'DSC Structure & Functioning', icon: Users },
        { id: 'dsc_operations', label: 'Overview of DSC Operations', icon: LayoutDashboard },
        { id: 'district_overview', label: 'Overview of District', icon: Map },
        { id: 'population_census', label: 'Population Data (Census 2011)', icon: Users },
        { id: 'population_alternate', label: 'Population Data (Alternate)', icon: Users },
        { id: 'youth_share', label: 'Share of Youth Population', icon: Users },
        { id: 'education_dise', label: 'School Education (DISE)', icon: Calculator },
        { id: 'education_alternate', label: 'School Education (Alternate)', icon: Calculator },
        { id: 'iti_data', label: 'ITI Data', icon: Building2 },
        { id: 'share_analysis', label: 'Share Analysis (Trainee/Placement)', icon: Calculator },
        { id: 'social_summary', label: 'Social Category Summary (Actuals)', icon: Users },
        { id: 'placement_asis', label: 'Placement As Is Scenario', icon: Calculator },
        { id: 'sector_asis', label: 'Sectorwise As Is Scenario', icon: Calculator },
        { id: 'program_scenario', label: 'Program wise As Is Scenario', icon: Calculator },
        { id: 'tp_asis', label: 'Training Partner As Is Scenario', icon: Building2 },
        { id: 'college_enrollments', label: 'Major Colleges & Enrollments', icon: Building2 },
        { id: 'agri_yield', label: 'Agri Yield Analysis', icon: Calculator },
        { id: 'major_towns', label: 'Major Towns / Cities', icon: Building2 },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Scenario Analysis</h2>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id as View)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === item.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {renderView()}
            </div>
        </div>
    );
};
