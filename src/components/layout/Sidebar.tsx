import React from 'react';
import type { Institution } from '../../types/institution';
import { MapPin, Building2, Compass, Sun, Moon, LayoutDashboard, GraduationCap, Briefcase, Award, Bot, FileText, PieChart, Search, Zap } from 'lucide-react';

interface SidebarProps {
    institutions: Institution[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    currentView: 'map' | 'dashboard' | 'eee-overview' | 'institutions' | 'assessments' | 'industry' | 'coe' | 'centers' | 'ai-search' | 'reports' | 'analytics';
    onViewChange: (view: 'map' | 'dashboard' | 'eee-overview' | 'institutions' | 'assessments' | 'industry' | 'coe' | 'centers' | 'ai-search' | 'reports' | 'analytics') => void;
    showHeatmap: boolean;
    onToggleHeatmap: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    // Optional filters for Map view
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    selectedCategories?: string[];
    onToggleCategory?: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    institutions,
    selectedId,
    onSelect,
    currentView,
    onViewChange,
    showHeatmap,
    onToggleHeatmap,
    isDarkMode,
    onToggleTheme,
    searchQuery,
    onSearchChange,
    selectedCategories,
    onToggleCategory
}) => {

    const MenuItem = ({ view, icon: Icon, label }: { view: any, icon: any, label: string }) => (
        <button
            onClick={() => onViewChange(view)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-r-full mr-2 ${currentView === view
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 border-l-4 border-transparent'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-lg z-10 flex-shrink-0 text-slate-900 dark:text-white transition-colors duration-300">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <div className="bg-blue-600 p-1 rounded">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        Dakshina Kannada Directory
                    </h1>
                    <button
                        onClick={onToggleTheme}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-slate-500 text-xs mt-2 pl-9">District Education Portal</p>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {/* Search & Filters Section Removed as per request */}



                <MenuItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                <MenuItem view="eee-overview" icon={Zap} label="EEE Overview" />

                <div className="my-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Map Control</div>
                <MenuItem view="map" icon={MapPin} label="Interactive Map" />

                <div className="my-2 border-t border-slate-200 dark:border-slate-800 mx-4"></div>

                <MenuItem view="analytics" icon={PieChart} label="Education Analytics" />
                <MenuItem view="institutions" icon={Building2} label="Institutions" />
                <MenuItem view="assessments" icon={GraduationCap} label="Assessments" />
                <MenuItem view="industry" icon={Briefcase} label="Industry Demand" />
                <MenuItem view="coe" icon={Award} label="Centers of Excellence" />
                <MenuItem view="centers" icon={MapPin} label="Career Centers (GCC)" />
                <MenuItem view="reports" icon={FileText} label="Reports" />

                <div className="my-2 border-t border-slate-200 dark:border-slate-800 mx-4"></div>
                <div className="my-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">AI Assistance</div>
                <MenuItem view="ai-search" icon={Bot} label="AI Assistant" />


                {/* Map View Specific Controls: Search & Filters */}
                {currentView === 'map' && (
                    <div className="px-4 py-2 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search institutions..."
                                value={searchQuery || ''}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {['Engineering', 'Polytechnic', 'Medical', 'Degree', 'PU College'].map(category => (
                                <button
                                    key={category}
                                    onClick={() => onToggleCategory?.(category)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCategories?.includes(category)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-2"></div>

                        {/* Heatmap Toggle */}
                        <button
                            onClick={onToggleHeatmap}
                            className={`w-full flex items-center justify-between p-2 rounded-lg border transition-colors ${showHeatmap
                                ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/50 dark:text-orange-400'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                        >
                            <span className="text-sm font-medium flex items-center gap-2">
                                <Compass size={16} /> Heatmap
                            </span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${showHeatmap ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showHeatmap ? 'left-4.5' : 'left-0.5'}`} style={{ left: showHeatmap ? '18px' : '2px' }} />
                            </div>
                        </button>

                        {/* Institutions List (Map Mode Only) */}
                        <div className="mt-4 space-y-2">
                            <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Result List ({institutions.length})
                            </h3>
                            {institutions.map(inst => (
                                <button
                                    key={inst.id}
                                    onClick={() => onSelect(inst.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedId === inst.id
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    <h4 className="font-semibold text-sm line-clamp-1">{inst.name}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                                        <span className={`px-1.5 py-0.5 rounded bg-black/5 dark:bg-black/20 text-xs`}>
                                            {inst.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={10} /> {inst.location.area}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom User Profile Section (Mock) */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                        DA
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">District Admin</div>
                        <div className="text-xs text-slate-500">admin@dist.gov.in</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
