import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
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
import CredentialManager from './components/admin/CredentialManager';


import InstitutionDataWizard from './components/entry/institution/InstitutionDataWizard';
import CompanyEntryForm from './components/entry/CompanyEntryForm';
import CoeEntryForm from './components/entry/CoeEntryForm';

import DistrictLobby from './components/pages/DistrictLobby';
import DataEntryPortal from './components/pages/DataEntryPortal';

import DistrictSkillPlan from './components/pages/DistrictSkillPlan';
import DistrictAssignWork from './components/pages/DistrictAssignWork';
import DistrictPlanList from './components/pages/DistrictPlanList';
import SchemesSection from './components/pages/SchemesSection';
import TrainerSection from './components/pages/TrainerSection';
import ItiTradeSection from './components/pages/ItiTradeSection';
import TrainingCenterSection from './components/pages/TrainingCenterSection';
import TraineeDetailsSection from './components/pages/TraineeDetailsSection';
import { TraineeDataAnalysis } from './components/entry/analysis/TraineeDataAnalysis';
import SkillsIntelligenceHub from './components/entry/skills_intel/SkillsIntelligenceHub';
import DistrictSkillMatrix from './components/pages/DistrictSkillMatrix';
import AggregateDemandView from './components/entry/aggregate_demand/AggregateDemandView';
import EmployerSurveyForm from './components/entry/employer/EmployerSurveyForm';
import DicSeeder from './components/admin/DicSeeder';



import { useAuthStore } from './store/useAuthStore';
import { useCredentialStore } from './store/useCredentialStore';
import { seedAllCredentials } from './utils/seedCredentials';
import { toSlug } from './utils/slugUtils';


function App() {
  // Auto-seed credentials if empty (for Vercel/fresh installs)
  useEffect(() => {
    const { credentials } = useCredentialStore.getState();
    if (credentials.length === 0) {
      console.log('📦 No credentials found, auto-seeding test accounts...');
      seedAllCredentials();
    }
  }, []);

  const navigate = useNavigate();
  const institutions = useDataStore(state => state.institutions);
  const { isAuthenticated, user, currentDistrict } = useAuthStore();


  const [showEntryForm, setShowEntryForm] = useState<'institution' | 'company' | 'coe' | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [discoveredData, setDiscoveredData] = useState<Institution[]>([]); // Unused
  const [isKeySet, setIsKeySet] = useState(false);

  const [currentView, setCurrentView] = useState<'map' | 'dashboard' | 'eee-overview' | 'institutions' | 'assessments' | 'industry' | 'coe' | 'centers' | 'ai-search' | 'reports' | 'analytics' | 'forecast' | 'skills-intel' | 'credential-manager'>('dashboard');
  const [adminMode, setAdminMode] = useState<'lobby' | 'dashboard' | 'portal' | 'plan' | 'plan-list' | 'plan-edit' | 'schemes' | 'trainer' | 'iti-trade' | 'training-center' | 'trainee-details' | 'trainee-analysis' | 'district-skill-matrix' | 'aggregate-demand' | 'assign-work' | 'institution-wizard' | 'dic-seeder'>('lobby');

  const [dashboardTab, setDashboardTab] = useState('overview'); // Control dashboard tab
  // const [aiInitialQuery, setAiInitialQuery] = useState(''); // Unused after sidebar cleanup

  const [isMapCollapsed, setIsMapCollapsed] = useState(true);
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




  // Handle Entry Forms - MOVED TO TOP to fix Hook Error
  const { view: routeView, adminPath, planId: routePlanId } = useParams<{ view?: string, adminPath?: string, planId?: string }>();

  useEffect(() => {
    if (routeView && (routeView as any) !== currentView) {
      setCurrentView(routeView as any);
    }
  }, [routeView]);

  useEffect(() => {
    if (routePlanId && routePlanId !== selectedId) {
      setSelectedId(routePlanId);
      setAdminMode('plan-edit');
    }
  }, [routePlanId]);

  // Auth Guard
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'institution') {
        setAdminMode('institution-wizard'); // Direct access for institutions to the full suite
      } else if (user?.role === 'trainee') {
        setAdminMode('trainee-details'); // Direct access for trainees

      } else if (user?.role === 'company') {
        // Company user - no specific admin mode needed as we intercept in render
      } else {
        setAdminMode('lobby');
      }
    }
  }, [isAuthenticated, user]);


  if (!isAuthenticated) {
    // If the user arrived at the survey route, show a focused login
    const isSurveyPath = window.location.pathname.startsWith('/company-survey');

    return (
      <CentralLoginPage forceTab={isSurveyPath ? 'company' : undefined} />
    );
  }


  // Super Admin District Selection
  if (user?.role === 'super_admin' && !currentDistrict) {
    return <SuperAdminDashboard />;
  }



  // District Admin Lobby Flow
  if (adminMode === 'lobby' && user?.role !== 'company') {
    return (
      <>
        <DistrictLobby
          onSelectOption={(option) => {
            setAdminMode(option as any);
          }}
          userName={user?.name}
        />
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

  // Assign Work View
  if (adminMode === 'assign-work') {
    return (
      <DistrictAssignWork
        onBack={() => setAdminMode('lobby')}
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
            else if (action === 'trainee-details') {
              setAdminMode('trainee-details');
            }
            else if (action === 'trainee-analysis') {
              setAdminMode('trainee-analysis');
            }
            else if (action === 'district-skill-matrix') {
              setAdminMode('district-skill-matrix');
            }
            else if (action === 'aggregate-demand') {
              setAdminMode('aggregate-demand');
            }
            else if (action === 'dic-seeder') {
              setAdminMode('dic-seeder');
            }
            else {
              setShowEntryForm(action);
            }
          }}
        />
        {/* Render Entry Forms as Modals if triggered */}
        {showEntryForm === 'institution' && (
          <InstitutionDataWizard
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
      <TrainingCenterSection
        onBack={() => setAdminMode('portal')}
        isRestricted={false}
      />
    );
  }

  if (adminMode === 'institution-wizard') {
    return (
      <InstitutionDataWizard
        onSuccess={() => { }}
        onCancel={() => useAuthStore.getState().logout()}
      />
    );
  }


  // Trainee Details Section
  if (adminMode === 'trainee-details') {
    return (
      <TraineeDetailsSection
        onBack={user?.role === 'trainee' ? undefined : () => setAdminMode('portal')}
        isRestricted={user?.role === 'trainee'}
      />
    );
  }

  // Trainee Data Analysis Section
  if (adminMode === 'trainee-analysis') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setAdminMode('portal')}
            className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
            Close Analysis
          </button>
          <TraineeDataAnalysis />
        </div>
      </div>
    );
  }
  // District Skill Matrix Section
  if (adminMode === 'district-skill-matrix') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="mx-auto max-w-[1800px]">
          <button
            onClick={() => setAdminMode('portal')}
            className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
            Back to Portal
          </button>
          <DistrictSkillMatrix />
        </div>
      </div>
    );
  }

  // Aggregate Demand Section
  if (adminMode === 'aggregate-demand') {
    return (
      <AggregateDemandView onBack={() => setAdminMode('portal')} />
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
      case 'skills-intel':
        return <SkillsIntelligenceHub />;
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
      case 'forecast':
        return <DistrictDashboard
          initialTab="forecasting"
          onNavigate={(view, tab) => {
            setCurrentView(view as any);
            if (view === 'analytics' && tab) setDashboardTab(tab);
          }}
        />;
      case 'credential-manager':
        return <CredentialManager />;
      default:
        return null;
    }
  };




  const renderMainContent = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (user?.role === 'super_admin' && !currentDistrict) {
      return <SuperAdminDashboard />;
    }

    if (user?.role === 'company') {
      const slug = user.name ? toSlug(user.name) : 'company';
      return <Navigate to={`/company-survey/${slug}`} replace />;
    }

    // Handle Admin Paths via Route or State
    const effectiveAdminMode = adminPath || (routePlanId ? 'plan-edit' : adminMode);

    switch (effectiveAdminMode as string) {
      case 'lobby':
        return <DistrictLobby onSelectOption={(option) => {
          setAdminMode(option as any);
          navigate(`/admin/${option}`);
        }} userName={user?.name} />;
      case 'plan-list':
        return (
          <DistrictPlanList
            onBack={() => {
              setAdminMode('lobby');
              navigate('/admin/lobby');
            }}
            onSelectPlan={(id) => {
              setSelectedId(id);
              navigate(`/admin/plan/${id}`);
            }}
          />
        );
      case 'plan-edit':
        const currentPlanId = routePlanId || selectedId;
        return <DistrictSkillPlan planId={currentPlanId} onBack={() => {
          setAdminMode('plan-list');
          navigate('/admin/plan-list');
        }} />;
      case 'assign-work':
        return <DistrictAssignWork onBack={() => {
          setAdminMode('lobby');
          navigate('/admin/lobby');
        }} />;
      case 'institution-wizard':
        return <InstitutionDataWizard onSuccess={() => { }} onCancel={() => {
          setAdminMode('lobby');
          navigate('/admin/lobby');
        }} />;
      case 'schemes':
        return <SchemesSection onBack={() => {
          setAdminMode('portal');
          navigate('/admin/portal');
        }} />;
      case 'trainer':
        return <TrainerSection onBack={() => {
          setAdminMode('portal');
          navigate('/admin/portal');
        }} />;
      case 'iti-trade':
        return <ItiTradeSection onBack={() => {
          setAdminMode('portal');
          navigate('/admin/portal');
        }} />;
      case 'training-center':
        return <TrainingCenterSection onBack={() => {
          setAdminMode('portal');
          navigate('/admin/portal');
        }} isRestricted={false} />;
      case 'trainee-details':
        return (
          <TraineeDetailsSection
            onBack={user?.role === 'trainee' ? undefined : () => {
              setAdminMode('portal');
              navigate('/admin/portal');
            }}
            isRestricted={user?.role === 'trainee'}
          />
        );
      case 'trainee-analysis':
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
              <button onClick={() => {
                setAdminMode('portal');
                navigate('/admin/portal');
              }} className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
                Close Analysis
              </button>
              <TraineeDataAnalysis />
            </div>
          </div>
        );
      case 'district-skill-matrix':
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="mx-auto max-w-[1800px]">
              <button onClick={() => {
                setAdminMode('portal');
                navigate('/admin/portal');
              }} className="flex items-center gap-2 text-slate-600 mb-6 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
                Back to Portal
              </button>
              <DistrictSkillMatrix />
            </div>
          </div>
        );
      case 'aggregate-demand':
        return <AggregateDemandView onBack={() => {
          setAdminMode('portal');
          navigate('/admin/portal');
        }} />;
      case 'dic-seeder':
        return <DicSeeder onBack={() => {
          setAdminMode('portal');
          navigate('/admin/portal');
        }} />;
      default:
        if (showEntryForm === 'institution') return <InstitutionDataWizard onSuccess={() => setShowEntryForm(null)} onCancel={() => setShowEntryForm(null)} />;
        if (showEntryForm === 'company') return <CompanyEntryForm onSuccess={() => setShowEntryForm(null)} onCancel={() => setShowEntryForm(null)} />;
        if (showEntryForm === 'coe') return <CoeEntryForm onSuccess={() => setShowEntryForm(null)} onCancel={() => setShowEntryForm(null)} />;

        return (
          <div className="flex h-screen w-full bg-background overflow-hidden text-slate-900">
            <button
              className="md:hidden fixed top-4 left-4 z-[2001] p-2 bg-white rounded-md shadow-lg border border-slate-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>

            {isMobileMenuOpen && (
              <div
                className="md:hidden fixed inset-0 z-[1999] bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

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
                currentView={currentView}
                onViewChange={(view) => {
                  setCurrentView(view);
                  setIsMobileMenuOpen(false);
                  navigate(`/${view}`);
                }}
                showHeatmap={showHeatmap}
                onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                searchQuery={filters.search}
                onSearchChange={setSearch}
                selectedCategories={filters.categories}
                onToggleCategory={toggleCategory}
                onLogin={() => setIsMobileMenuOpen(false)}
              />
            </div>

            <div className="flex-1 relative overflow-hidden h-full">
              {currentView !== 'map' && (
                <div className="absolute inset-0 z-20 overflow-y-auto bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300 scrollbar-hide">
                  {renderCurrentView()}
                </div>
              )}

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
                      {currentView !== 'map' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMapCollapsed(true);
                          }}
                          className="absolute top-2 right-2 z-50 p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Minimize2 size={16} className="text-slate-600 dark:text-slate-300" />
                        </button>
                      )}

                      {currentView !== 'map' && !isMapCollapsed && (
                        <div className="absolute inset-0 bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors pointer-events-none">
                          <div className="bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            Click to Expand
                          </div>
                        </div>
                      )}

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
          </div>
        );
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<CentralLoginPage />} />
      <Route path="/company-survey" element={<EmployerSurveyForm />} />
      <Route path="/company-survey/:companyName" element={<EmployerSurveyForm />} />
      <Route path="/company_survey" element={<Navigate to="/company-survey" replace />} />
      <Route path="/admin/plan/:planId" element={renderMainContent()} />
      <Route path="/admin/:adminPath" element={renderMainContent()} />
      <Route path="/:view" element={renderMainContent()} />
      <Route path="/" element={
        user?.role === 'company'
          ? <Navigate to={`/company-survey/${user.name ? toSlug(user.name) : 'company'}`} replace />
          : <Navigate to="/dashboard" replace />
      } />
    </Routes>
  );
}

export default App;
