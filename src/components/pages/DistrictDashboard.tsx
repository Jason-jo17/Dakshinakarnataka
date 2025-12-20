import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HeaderFilter from '../HeaderFilter';
import { Search, X, Filter } from "lucide-react";
import { Badge } from "../ui/badge";
import OverviewPanel from '../panels/OverviewPanel';
import FilterContextBanner from '../dashboard/FilterContextBanner';
import SupplyPanel from '../panels/SupplyPanel';
import DemandPanel from '../panels/DemandPanel';
import GapPanel from '../panels/GapPanel';
import PlacementPanel from '../panels/PlacementPanel';
import CoePanel from '../panels/CoePanel';
import AcceleratorPanel from '../panels/AcceleratorPanel';
import InsightsPanel from '../panels/InsightsPanel';

const DistrictDashboard: React.FC<{ onNavigate: (view: any, tab?: string) => void }> = ({ onNavigate }) => {
    const [filters, setFilters] = useState({
        sector: 'all',
        industry: 'all',
        domain: 'all',
        institution: 'all',
        branch: 'all',
        companyType: 'all'
    });

    const [headerSearch, setHeaderSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("overview");

    const handleTabSwitch = (tabValue: string) => {
        setActiveTab(tabValue);
    };

    // Helper to get active filters for display chips
    const getActiveFilters = () => {
        return Object.entries(filters).filter(([, value]) => value !== 'all' && value !== undefined);
    };

    const removeFilter = (key: string) => {
        setFilters(prev => ({ ...prev, [key]: 'all' }));
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                                District Skill Command Center
                            </h1>
                            <p className="text-xs text-slate-500">
                                Real-time insights on demand, supply & gaps
                            </p>
                        </div>

                        {/* Search Bar in Header - Negative Space */}
                        <div className="flex-1 max-w-xl mx-auto flex items-center gap-2">
                            <div className="relative flex-1 hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by college, skill, or company..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all placeholder:text-slate-400"
                                    value={headerSearch}
                                    onChange={(e) => setHeaderSearch(e.target.value)}
                                />
                            </div>

                            {/* Header Filter Button (Next to Search) */}
                            <HeaderFilter
                                currentFilters={filters}
                                onApply={setFilters}
                                isOpen={isFilterOpen}
                                onOpenChange={setIsFilterOpen}
                            />
                        </div>

                        {/* Logo/Badge */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">DK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-6 pb-20">

                {/* Active Filter Chips Summary */}
                <div className="mb-6 min-h-[32px]">
                    {getActiveFilters().length > 0 ? (
                        <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1">
                            <span className="text-xs font-semibold text-slate-500 mr-1">Active Filters:</span>
                            {getActiveFilters().map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1 text-xs gap-1">
                                    <span className="capitalize opacity-70 mr-1">{key}:</span>
                                    <span className="font-medium">{value}</span>
                                    <button onClick={() => removeFilter(key)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                </Badge>
                            ))}
                            <button
                                onClick={() => setFilters({ sector: 'all', industry: 'all', domain: 'all', institution: 'all', branch: 'all', companyType: 'all' })}
                                className="text-xs text-slate-400 hover:text-slate-600 underline ml-2"
                            >
                                Clear All
                            </button>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 italic">No filters active.</div>
                    )}
                </div>

                {/* Rich Context Banner */}
                <FilterContextBanner filters={filters} onNavigate={onNavigate} onTabChange={handleTabSwitch} />

                {/* Tab Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="bg-white p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all md:hidden"
                            title="Open Filters"
                        >
                            <Search size={18} />
                        </button>

                        <div className="flex-1 overflow-x-auto">
                            <TabsList className="grid w-full min-w-[800px] grid-cols-8 gap-1 bg-white p-1 rounded-lg shadow-sm h-auto">
                                <TabsTrigger value="overview" className="rounded-md py-2 text-xs font-medium">Overview</TabsTrigger>
                                <TabsTrigger value="demand" className="rounded-md py-2 text-xs font-medium">Skill Demand</TabsTrigger>
                                <TabsTrigger value="supply" className="rounded-md py-2 text-xs font-medium">Skill Supply</TabsTrigger>
                                <TabsTrigger value="gap" className="rounded-md py-2 text-xs font-medium">Gap Analysis</TabsTrigger>
                                <TabsTrigger value="accelerator" className="rounded-md py-2 text-xs font-medium">Accelerator</TabsTrigger>
                                <TabsTrigger value="placements" className="rounded-md py-2 text-xs font-medium">Placements</TabsTrigger>
                                <TabsTrigger value="coe" className="rounded-md py-2 text-xs font-medium">Infra (COE)</TabsTrigger>
                                <TabsTrigger value="insights" className="rounded-md py-2 text-xs font-medium">Insights</TabsTrigger>
                            </TabsList>
                        </div>
                        {/* Desktop Secondary Filter Trigger near Tabs for convenience (User request) */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all ${isFilterOpen ? 'ring-2 ring-blue-100 border-blue-400' : ''}`}
                        >
                            <Filter size={14} />
                            <span className="hidden lg:inline">Filters</span>
                        </button>
                    </div>

                    {/* Tab Contents */}
                    <TabsContent value="overview" className="space-y-6"><OverviewPanel filters={filters} /></TabsContent>
                    <TabsContent value="demand" className="space-y-6"><DemandPanel filters={filters} /></TabsContent>
                    <TabsContent value="supply" className="space-y-6"><SupplyPanel filters={filters} /></TabsContent>
                    <TabsContent value="gap" className="space-y-6"><GapPanel filters={filters} /></TabsContent>
                    <TabsContent value="accelerator" className="space-y-6"><AcceleratorPanel filters={filters} /></TabsContent>
                    <TabsContent value="placements" className="space-y-6"><PlacementPanel filters={filters} /></TabsContent>
                    <TabsContent value="coe" className="space-y-6"><CoePanel filters={filters} /></TabsContent>
                    <TabsContent value="insights" className="space-y-6"><InsightsPanel filters={filters} /></TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12 pb-8">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                        <div>
                            <strong>Dakshina Kannada District</strong> • Karnataka Digital Economy Mission (KDEM)
                        </div>
                        <div>
                            Last Updated: December 2024 • Data Source: Official Placement Reports & Industry Surveys
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DistrictDashboard;
