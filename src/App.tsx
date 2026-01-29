import { useState, useEffect } from 'react';
import { Menu, X, Minimize2, Map as MapIcon } from 'lucide-react';
import MapView from './components/map/MapView';
import Sidebar from './components/layout/Sidebar';
import InstitutionDetail from './components/institution/InstitutionDetail';
import DKEducationDashboard from './components/dashboard/DKEducationDashboard';
import DistrictDashboard from './components/pages/DistrictDashboard';
import EEEOverview from './components/pages/EEEOverview';
import InstitutionsView from './components/pages/InstitutionsView';
import AssessmentsView from './components/pages/AssessmentsView';
import IndustryDemandView from './components/pages/IndustryDemandView';
import COEView from './components/pages/COEView';
import CareerCentersView from './components/pages/CareerCentersView';
import ReportsView from './components/pages/ReportsView';
import { useFilters } from './hooks/useFilters';
import { initializeGenAI } from './services/geminiService';
import { FloatingFilterPanel } from './components/map/FloatingFilterPanel';
import { JOBS } from './data/jobs';
import { DCSearch } from './components/dashboard/DCSearch';
import { useDataStore } from './store/useDataStore';
import CentralLoginPage from './components/auth/CentralLoginPage';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';

import InstitutionEntryForm from './components/entry/InstitutionEntryForm';
import CompanyEntryForm from './components/entry/CompanyEntryForm';
import CoeEntryForm from './components/entry/CoeEntryForm';

import DistrictLobby from './components/pages/DistrictLobby';
import DataEntryPortal from './components/pages/DataEntryPortal';

import DistrictSkillPlan from './components/pages/DistrictSkillPlan';
import DistrictPlanList from './components/pages/DistrictPlanList';
import SchemesSection from './components/pages/SchemesSection';
import TrainerSection from './components/pages/TrainerSection';
import ItiTradeSection from './components/pages/ItiTradeSection';
import TrainingCenterSection from './components/pages/TrainingCenterSection';



import { useAuthStore } from './store/useAuthStore';
import { DataSeeder } from './components/DataSeeder';

function App() {

  const institutions = useDataStore(state => state.institutions);
  const { isAuthenticated, user, currentDistrict } = useAuthStore();


  const [showEntryForm, setShowEntryForm] = useState<'institution' | 'company' | 'coe' | 'job' | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [discoveredData, setDiscoveredData] = useState<Institution[]>([]); // Unused
  const [isKeySet, setIsKeySet] = useState(false);

  const [currentView, setCurrentView] = useState<'map' | 'dashboard' | 'eee-overview' | 'institutions' | 'assessments' | 'industry' | 'coe' | 'centers' | 'ai-search' | 'reports' | 'analytics' | 'forecast'>('dashboard');
  const [adminMode, setAdminMode] = useState<'lobby' | 'dashboard' | 'portal' | 'plan' | 'plan-list' | 'plan-edit' | 'schemes' | 'trainer' | 'iti-trade' | 'training-center'>('lobby');

  const [dashboardTab, setDashboardTab] = useState('overview'); // Control dashboard tab
  // const [aiInitialQuery, setAiInitialQuery] = useState(''); // Unused after sidebar cleanup

  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPopulationView, setShowPopulationView] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from system preference
  useEffect(() => {
    // Disabled auto-detection to default to light mode as per user request
    // if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   setIsDarkMode(true);
    // }
  }, []);

  // Update HTML class when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Combine static and discovered data
  const allData = [...institutions];

  const { filteredData, filters, setSearch, toggleCategory, toggleDomain, toggleTool, toggleDegree, toggleCoe } = useFilters(allData);

  const selectedInstitution = allData.find(i => i.id === selectedId);

  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) {
      initializeGenAI(envKey);
      setIsKeySet(true);
    }
  }, []);



  // Auth Guard
  useEffect(() => {
    if (isAuthenticated) {
      setAdminMode('lobby');
    }
  }, [isAuthenticated]);


  if (!isAuthenticated) {
    return (
      <>
        <CentralLoginPage />
      </>
    );
  }


  // Super Admin District Selection
  if (user?.role === 'super_admin' && !currentDistrict) {
    return <SuperAdminDashboard />;
  }

  // District Admin Lobby Flow
  if (adminMode === 'lobby') {
    return (
      <>
        <DistrictLobby
          onSelectOption={(option) => {
            setAdminMode(option as any);
          }}
          userName={user?.name}
        />
        <DataSeeder />
      </>
    );
  }

  // Plan List View
  if (adminMode === 'plan-list') {
    return (
      <>
        <DistrictPlanList
          onBack={() => setAdminMode('lobby')}
          onSelectPlan={(id: string | null) => {
            setSelectedId(id); // Using the existing selectedId state for convenience, or create a new one
            setAdminMode('plan-edit');
          }}
        />
        <DataSeeder />
      </>
    );
  }

  // Plan Edit View
  if (adminMode === 'plan-edit') {
    return (
      <DistrictSkillPlan
        planId={selectedId}
        onBack={() => setAdminMode('plan-list')}
      />
    );
  }

  if (adminMode === 'portal') {
    return (
      <>
        <DataEntryPortal
          onBack={() => setAdminMode('lobby')}
          onAction={(action) => {
            console.log('DataEntryPortal action:', action);
            if (action === 'plan') {
              console.log('Switching to plan-list');
              setAdminMode('plan-list');
            }
            else if (action === 'schemes') {
              console.log('Switching to schemes');
              setAdminMode('schemes');
            }
            else if (action === 'trainer') {
              setAdminMode('trainer');
            }
            else if (action === 'iti-trade') {
              setAdminMode('iti-trade');
            }
            else if (action === 'training-center') {
              setAdminMode('training-center');
            }
            else {
              setShowEntryForm(action);
            }
          }}
        />
        {/* Render Entry Forms as Modals if triggered */}
        {showEntryForm === 'institution' && (
          <InstitutionEntryForm
            onSuccess={() => setShowEntryForm(null)}
            onCancel={() => setShowEntryForm(null)}
          />
        )}
        {showEntryForm === 'company' && (
          <CompanyEntryForm
            onSuccess={() => setShowEntryForm(null)}
            onCancel={() => setShowEntryForm(null)}
          />
        )}
        {showEntryForm === 'coe' && (
          <CoeEntryForm
            onSuccess={() => setShowEntryForm(null)}
            onCancel={() => setShowEntryForm(null)}
          />
        )}
        {/* Job Form Placeholder - reusing Company or need new one? User said "we will do this part soon" */}
        <DataSeeder />
      </>
    );
  }

  if (adminMode === 'schemes') {
    return (
      <SchemesSection onBack={() => setAdminMode('portal')} />
    );
  }

  if (adminMode === 'trainer') {
    return (
      <TrainerSection onBack={() => setAdminMode('portal')} />
    );
  }

  if (adminMode === 'iti-trade') {
    return (
      <ItiTradeSection onBack={() => setAdminMode('portal')} />
    );
  }

  if (adminMode === 'training-center') {
    return (
      <TrainingCenterSection onBack={() => setAdminMode('portal')} />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DistrictDashboard onNavigate={(view, tab) => {
          setCurrentView(view as any);
          if (view === 'analytics' && tab) setDashboardTab(tab);
        }} />;
      case 'eee-overview':
        return <EEEOverview onNavigate={(view, tab) => {
          setCurrentView(view as any);
          if (view === 'analytics' && tab) setDashboardTab(tab);
        }} />;
      case 'analytics':
        return <DKEducationDashboard
          initialTab={dashboardTab}
          onNavigate={(view, tab) => {
            setCurrentView(view as any);
            if (tab && view as any === 'analytics') setDashboardTab(tab);
          }}
        />;
      case 'ai-search':
        return <DCSearch
          initialQuery=""
          onNavigate={(view, tab) => {
            setCurrentView(view);
            setDashboardTab(tab);
          }} />;
      case 'institutions':
        return <InstitutionsView onNavigate={(view, id) => {
          setCurrentView(view);
          if (id) setSelectedId(id);
        }} />;
      case 'assessments':
        return <AssessmentsView />;
      case 'industry':
        return <IndustryDemandView />;
      case 'coe':
        return <COEView onNavigate={(view, id) => {
          setCurrentView(view);
          if (id) setSelectedId(id);
        }} />;
      case 'centers':
        return <CareerCentersView />;
      case 'reports':
        return <ReportsView />;
      case 'forecast':
        return <DistrictDashboard
          initialTab="forecasting"
          onNavigate={(view, tab) => {
            setCurrentView(view as any);
            if (view === 'analytics' && tab) setDashboardTab(tab);
          }}
        />;
      default:
        return null;
    }
  };


  // Handle Entry Forms
  if (showEntryForm === 'institution') {
    return (
      <InstitutionEntryForm
        onSuccess={() => {
          setShowEntryForm(null);
          // Optional: Show success notification or navigate to specific view
        }}
        onCancel={() => setShowEntryForm(null)}
      />
    );
  }

  if (showEntryForm === 'company') {
    return (
      <CompanyEntryForm
        onSuccess={() => setShowEntryForm(null)}
        onCancel={() => setShowEntryForm(null)}
      />
    );
  }

  if (showEntryForm === 'coe') {
    return (
      <CoeEntryForm
        onSuccess={() => setShowEntryForm(null)}
        onCancel={() => setShowEntryForm(null)}
      />
    );
  }




  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile Menu Button */}


      <button
        className="md:hidden fixed top-4 left-4 z-[2001] p-2 bg-white rounded-md shadow-lg border border-slate-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[1999] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`
        fixed md:relative top-0 bottom-0 z-[2000] flex flex-col h-full bg-white shadow-xl md:shadow-none transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          institutions={currentView === 'map' ? filteredData : institutions}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setIsMobileMenuOpen(false);
          }}
          currentView={currentView as any}
          onViewChange={(view) => {
            setCurrentView(view);
            setIsMobileMenuOpen(false);
          }}
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          // Pass Filters
          searchQuery={filters.search}
          onSearchChange={setSearch}
          selectedCategories={filters.categories}
          onToggleCategory={toggleCategory}

          // Partner Login
          onLogin={() => {
            // setShowLogin(true); // Replaced by global auth guard
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      <div className="flex-1 relative overflow-hidden h-full">

        {/* Main View Area */}
        {currentView !== 'map' && (
          <div className="absolute inset-0 z-20 overflow-y-auto bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300 scrollbar-hide">
            {renderCurrentView()}
          </div>
        )}

        {/* Map Container - Acts as Main View, Pop-out, or Collapsed Pill */}
        <div
          className={`
            transition-all duration-500 ease-in-out bg-white dark:bg-slate-800 shadow-2xl
            ${currentView !== 'map'
              ? isMapCollapsed
                ? 'absolute bottom-6 right-6 w-auto h-auto z-30 rounded-full border-2 border-white dark:border-slate-700 overflow-hidden cursor-pointer hover:scale-105'
                : 'absolute bottom-6 right-6 w-80 h-56 z-30 rounded-xl border-4 border-white dark:border-slate-700 overflow-hidden group cursor-pointer hover:scale-105 hover:shadow-3xl'
              : 'absolute inset-0 w-full h-full z-10'
            }
          `}
          onClick={() => {
            if (currentView !== 'map') {
              if (isMapCollapsed) setIsMapCollapsed(false);
              else setCurrentView('map');
            }
          }}
        >
          {currentView !== 'map' && isMapCollapsed ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <MapIcon size={18} />
              <span className="font-semibold text-sm whitespace-nowrap">Show Map</span>
            </div>
          ) : (
            <>
              <div className="w-full h-full relative pointer-events-auto">
                <MapView
                  institutions={filteredData}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  showHeatmap={showHeatmap}
                  showPopulationView={showPopulationView}
                  showJobs={showJobs}
                  jobs={JOBS}
                  hideLegend={currentView !== 'map'}
                />
              </div>

              {/* Minimize Button - visible only when floating and expanded */}
              {currentView !== 'map' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMapCollapsed(true);
                  }}
                  className="absolute top-2 right-2 z-50 p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Minimize Map"
                >
                  <Minimize2 size={16} className="text-slate-600 dark:text-slate-300" />
                </button>
              )}

              {/* Overlay for Expand Prompt in Minimized Mode */}
              {currentView !== 'map' && !isMapCollapsed && (
                <div className="absolute inset-0 bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors pointer-events-none">
                  <div className="bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Click to Expand
                  </div>
                </div>
              )}

              {/* Map Controls - Only visible in Full Map Mode */}
              {currentView === 'map' && (
                <>
                  <FloatingFilterPanel
                    selectedDomains={filters.domains}
                    onToggleDomain={toggleDomain}
                    selectedTools={filters.tools}
                    onToggleTool={toggleTool}
                    selectedDegrees={filters.degrees}
                    onToggleDegree={toggleDegree}
                    showCoeOnly={filters.coe}
                    onToggleCoe={toggleCoe}
                    showPopulationView={showPopulationView}
                    onTogglePopulationView={() => setShowPopulationView(!showPopulationView)}
                    showJobs={showJobs}
                    onToggleJobs={() => setShowJobs(!showJobs)}
                  />

                  {selectedInstitution && (
                    <InstitutionDetail
                      institution={selectedInstitution}
                      onClose={() => setSelectedId(null)}
                      isKeySet={isKeySet}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>

      </div>
      <DataSeeder />
    </div>
  );
}

export default App;
