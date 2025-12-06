import { useState, useEffect } from 'react';
import MapView from './components/map/MapView';
import Sidebar from './components/layout/Sidebar';
import InstitutionDetail from './components/institution/InstitutionDetail';
import DKEducationDashboard from './components/dashboard/DKEducationDashboard';
import { INSTITUTIONS } from './data/institutions';
import { useFilters } from './hooks/useFilters';
import { initializeGenAI, discoverPlaces } from './services/geminiService';
import type { Institution } from './types/institution';

import { FloatingFilterPanel } from './components/map/FloatingFilterPanel';

import { JOBS } from './data/jobs';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [discoveredData, setDiscoveredData] = useState<Institution[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPopulationView, setShowPopulationView] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  // Combine static and discovered data
  const allData = [...INSTITUTIONS, ...discoveredData];

  const { filteredData, filters, setSearch, toggleCategory, toggleDomain, toggleTool, toggleDegree, toggleCoe } = useFilters(allData);

  const selectedInstitution = allData.find(i => i.id === selectedId);

  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      initializeGenAI(envKey);
      setIsKeySet(true);
    }
  }, []);



  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar
        institutions={filteredData}
        selectedId={selectedId}
        onSelect={setSelectedId}
        searchQuery={filters.search}
        onSearchChange={setSearch}
        selectedCategories={filters.categories}
        onToggleCategory={toggleCategory}
        apiKey={apiKey}
        onSetApiKey={(key) => {
          setApiKey(key);
          setIsKeySet(!!key);
          if (key) initializeGenAI(key);
        }}
        onDiscover={async (query) => {
          const results = await discoverPlaces(query);
          setDiscoveredData(prev => [...prev, ...results]);
        }}
        isKeySet={isKeySet}
        currentView={showDashboard ? 'dashboard' : 'map'}
        onViewChange={(view) => setShowDashboard(view === 'dashboard')}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
      />

      <div className="flex-1 relative overflow-hidden flex">
        {/* Map is always rendered but might be partially covered or resized if needed */}
        <div className={`flex-1 h-full relative transition-all duration-300 ${showDashboard ? 'w-1/2' : 'w-full'}`}>
          <MapView
            institutions={filteredData}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showHeatmap={showHeatmap}
            showPopulationView={showPopulationView}
            showJobs={showJobs}
            jobs={JOBS}
            hideLegend={showDashboard}
          />

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

          {selectedInstitution && !showDashboard && (
            <InstitutionDetail
              institution={selectedInstitution}
              onClose={() => setSelectedId(null)}
              isKeySet={isKeySet}
            />
          )}
        </div>

        {/* Dashboard Side Panel */}
        {showDashboard && (
          <div className="w-[600px] h-full bg-white shadow-2xl overflow-y-auto border-l border-gray-200 z-20 absolute right-0 top-0 bottom-0 animate-in slide-in-from-right duration-300">
            <div className="p-2 sticky top-0 bg-white z-10 border-b flex justify-end">
              <button
                onClick={() => setShowDashboard(false)}
                className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1 bg-gray-100 rounded"
              >
                Close Dashboard
              </button>
            </div>
            <DKEducationDashboard />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
