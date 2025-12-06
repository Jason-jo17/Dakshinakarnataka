import React, { useState } from 'react';
import type { Institution } from '../../types/institution';
import { Search, MapPin, Building2, Compass, Loader2, Wrench, Sun, Moon } from 'lucide-react';
import { ToolSearch } from '../search/ToolSearch';

interface SidebarProps {
    institutions: Institution[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategories: string[];
    onToggleCategory: (category: string) => void;
    onDiscover: (query: string) => Promise<void>;
    isKeySet: boolean;
    currentView: 'map' | 'dashboard';
    onViewChange: (view: 'map' | 'dashboard') => void;
    showHeatmap: boolean;
    onToggleHeatmap: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const CATEGORIES = ['Engineering', 'Polytechnic', 'ITI', 'Training', 'University', 'Research', 'Hospital', 'Company', 'PU College'];

const Sidebar: React.FC<SidebarProps> = ({
    institutions,
    selectedId,
    onSelect,
    searchQuery,
    onSearchChange,
    selectedCategories,
    onToggleCategory,
    onDiscover,
    isKeySet,
    currentView,
    onViewChange,
    showHeatmap,
    onToggleHeatmap,
    isDarkMode,
    onToggleTheme
}) => {
    const [discoveryQuery, setDiscoveryQuery] = useState('');
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [activeTab, setActiveTab] = useState<'institutions' | 'skills'>('institutions');

    const handleDiscoverSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!discoveryQuery.trim()) return;
        setIsDiscovering(true);
        await onDiscover(discoveryQuery);
        setIsDiscovering(false);
        setDiscoveryQuery('');
    };

    return (
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10 flex-shrink-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <MapPin className="w-6 h-6 text-primary" />
                            DK Directory
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 font-medium">Education & Industry Portal</p>
                    </div>
                    <button
                        onClick={onToggleTheme}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex gap-2 mt-4 bg-slate-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        onClick={() => onViewChange('map')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all ${currentView === 'map' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200 dark:bg-gray-600 dark:text-white dark:ring-0' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        <MapPin className="w-3 h-3" /> Map
                    </button>
                    <button
                        onClick={() => onViewChange('dashboard')}
                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all ${currentView === 'dashboard' ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200 dark:bg-gray-600 dark:text-white dark:ring-0' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        <Building2 className="w-3 h-3" /> Dashboard
                    </button>
                </div>

                {currentView === 'map' && (
                    <button
                        onClick={onToggleHeatmap}
                        className={`w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md border transition-colors ${showHeatmap
                            ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-orange-400'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full mr-2 ${showHeatmap ? 'bg-orange-500' : 'bg-slate-400'}`}></div>
                        {showHeatmap ? 'Heatmap Active' : 'Show Heatmap'}
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                    onClick={() => setActiveTab('institutions')}
                    className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'institutions' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
                >
                    Institutions
                </button>
                <button
                    onClick={() => setActiveTab('skills')}
                    className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1 ${activeTab === 'skills' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
                >
                    <Wrench className="w-3 h-3" /> Search by Skills
                </button>
            </div>

            {activeTab === 'skills' ? (
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-gray-900">
                    <ToolSearch
                        institutions={institutions}
                        onSelectInstitution={onSelect}
                    />
                </div>
            ) : (
                <>
                    <div className="p-3 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 space-y-3">
                        {/* Discovery Section */}
                        <div className="bg-white dark:bg-gray-800 p-2 rounded border border-slate-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-600 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                                <Compass className="w-3 h-3" /> AI Discovery
                            </h3>
                            <form onSubmit={handleDiscoverSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. 'Software companies in Mangalore'"
                                    className="flex-1 text-xs px-2 py-1.5 border border-slate-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 dark:text-white dark:bg-gray-700 placeholder:text-slate-400"
                                    value={discoveryQuery}
                                    onChange={(e) => setDiscoveryQuery(e.target.value)}
                                    disabled={!isKeySet || isDiscovering}
                                />
                                <button
                                    type="submit"
                                    disabled={!isKeySet || isDiscovering}
                                    className="bg-accent text-white p-1.5 rounded hover:bg-accent/90 disabled:opacity-50"
                                >
                                    {isDiscovering ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                                </button>
                            </form>
                            {!isKeySet && <p className="text-[10px] text-red-600 mt-1 font-semibold">API Key required</p>}
                        </div>

                        {/* Local Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Filter list..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white dark:bg-gray-700 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-1.5">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => onToggleCategory(cat)}
                                    className={`text-[10px] px-2 py-1 rounded-full border transition-colors font-medium ${selectedCategories.includes(cat)
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-300 dark:border-gray-600 hover:border-primary/50 hover:bg-slate-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-gray-400 px-1 font-medium">
                            <span>{institutions.length} results found</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
                        {institutions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No institutions found.
                            </div>
                        ) : (
                            institutions.map((inst) => (
                                <div
                                    key={inst.id}
                                    onClick={() => onSelect(inst.id)}
                                    className={`p-4 border-b border-slate-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-gray-700 ${selectedId === inst.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-sm ${selectedId === inst.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                            {inst.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-600 dark:text-gray-400 font-medium">
                                        <Building2 className="w-3 h-3" />
                                        <span>{inst.category}</span>
                                        <span className="mx-1">•</span>
                                        <span>{inst.location.area}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
