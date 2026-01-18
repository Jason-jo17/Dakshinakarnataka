import React, { useState, useMemo, useCallback } from 'react';
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
import SearchSuggestions from '../SearchSuggestions';
import { useDataStore } from '../../store/useDataStore';
import { getSearchSuggestions, type SearchSuggestion } from '../../utils/searchUtils';

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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    const [activeTab, setActiveTab] = useState("overview");

    // Get data from store
    const institutions = useDataStore(state => state.institutions);
    const industryDemands = useDataStore(state => state.industryDemands);

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

    // Get search suggestions
    const suggestions = useMemo(() => {
        if (!headerSearch || headerSearch.length < 2) return [];
        return getSearchSuggestions(headerSearch, institutions, industryDemands, filters);
    }, [headerSearch, institutions, industryDemands, filters]);

    // Handle search input change
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHeaderSearch(value);
        setShowSuggestions(value.length >= 2);
        setSelectedSuggestionIndex(-1);
    }, []);

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
        setHeaderSearch(suggestion.label);
        setShowSuggestions(false);

        // Apply filter based on suggestion type
        if (suggestion.type === 'institution') {
            setFilters(prev => ({ ...prev, institution: suggestion.label }));
        } else if (suggestion.type === 'company') {
            // Navigate to demand tab and set company filter
            setActiveTab('demand');
        } else if (suggestion.type === 'skill') {
            // Navigate to gap tab for skills
            setActiveTab('gap');
        }
    }, []);

    // Handle keyboard navigation
    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
            e.preventDefault();
            handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
        }
    }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSuggestionSelect]);

    return (
        <div className="min-h-screen bg-background relative">
            {/* Header */}
            <header className="bg-surface shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-text leading-tight flex items-baseline gap-2">
                                Karnataka Skill Development Corporation
                                <span className="text-[10px] font-normal text-icon opacity-80 relative -top-1">Powered by Inunity</span>
                            </h1>
                            <p className="text-xs text-icon">
                                Real-time insights on demand, supply & gaps
                            </p>
                        </div>

                        {/* Search Bar in Header - Negative Space */}
                        <div className="flex-1 max-w-xl mx-auto flex items-center gap-2">
                            <div className="relative flex-1 hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by college, skill, or company..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-full text-sm focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all placeholder:text-slate-400 text-text"
                                    value={headerSearch}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearchKeyDown}
                                    onFocus={() => headerSearch.length >= 2 && setShowSuggestions(true)}
                                />

                                {/* Search Suggestions Dropdown */}
                                {showSuggestions && (
                                    <SearchSuggestions
                                        suggestions={suggestions}
                                        query={headerSearch}
                                        selectedIndex={selectedSuggestionIndex}
                                        onSelect={handleSuggestionSelect}
                                        onClose={() => setShowSuggestions(false)}
                                    />
                                )}
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
                            <img
                                src="/assets/karnataka-emblem.png"
                                alt="Government of Karnataka"
                                className="h-14 w-auto object-contain drop-shadow-sm filter hover:brightness-110 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-6 pb-20">

                {/* Active Filter Chips Summary */}
                <div className="mb-6 min-h-[32px]">
                    {getActiveFilters().length > 0 ? (
                        <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1">
                            <span className="text-xs font-semibold text-icon mr-1">Active Filters:</span>
                            {getActiveFilters().map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border-blue-200 dark:border-blue-800 px-3 py-1 text-xs gap-1">
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
                            className="bg-surface p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-icon hover:text-primary hover:border-primary/50 shadow-sm transition-all md:hidden"
                            title="Open Filters"
                        >
                            <Search size={18} />
                        </button>

                        <div className="flex-1 overflow-x-auto">
                            <TabsList className="grid w-full min-w-[800px] grid-cols-8 gap-1 bg-surface p-1 rounded-lg shadow-sm h-auto border border-slate-200 dark:border-slate-700">
                                <TabsTrigger value="overview" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Overview</TabsTrigger>
                                <TabsTrigger value="demand" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Skill Demand</TabsTrigger>
                                <TabsTrigger value="supply" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Skill Supply</TabsTrigger>
                                <TabsTrigger value="gap" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Gap Analysis</TabsTrigger>
                                <TabsTrigger value="accelerator" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Accelerator</TabsTrigger>
                                <TabsTrigger value="placements" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Placements</TabsTrigger>
                                <TabsTrigger value="coe" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Infra (COE)</TabsTrigger>
                                <TabsTrigger value="insights" className="rounded-md py-2 text-xs font-medium data-[state=active]:bg-secondary data-[state=active]:text-white">Insights</TabsTrigger>
                            </TabsList>
                        </div>
                        {/* Desktop Secondary Filter Trigger near Tabs for convenience (User request) */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`hidden md:flex items-center gap-2 px-3 py-2 bg-surface border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-icon hover:text-primary hover:border-primary/50 shadow-sm transition-all ${isFilterOpen ? 'ring-2 ring-blue-100 border-primary' : ''}`}
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
                    <TabsContent value="insights" className="space-y-6"><InsightsPanel filters={filters} onTabChange={handleTabSwitch} /></TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="bg-surface border-t border-slate-200 dark:border-slate-700 mt-12 pb-8">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between text-xs text-icon">
                        <div>
                            <strong>Karnataka Skill Development Corporation</strong> • Karnataka Digital Economy Mission (KDEM)
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
