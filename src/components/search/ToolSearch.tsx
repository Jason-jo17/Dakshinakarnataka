import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import type { Institution } from '../../types/institution';

interface ToolSearchProps {
    institutions: Institution[];
    onSelectInstitution: (id: string) => void;
}

export const ToolSearch: React.FC<ToolSearchProps> = ({ institutions, onSelectInstitution }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProficiencies, setSelectedProficiencies] = useState<string[]>(['Advanced', 'Intermediate']);
    const [showResults, setShowResults] = useState(false);

    // Extract all unique tools and domains
    const allItems = useMemo(() => {
        const items = new Set<string>();
        institutions.forEach(inst => {
            inst.tools?.forEach(t => items.add(t.name));
            if (inst.domains) {
                Object.keys(inst.domains).forEach(d => items.add(d));
            }
            inst.primaryDomains?.forEach(d => items.add(d));
        });
        return Array.from(items).sort();
    }, [institutions]);

    // Filter items for autocomplete
    const suggestedItems = useMemo(() => {
        if (!searchTerm) return [];
        return allItems.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 8);
    }, [searchTerm, allItems]);

    // Filter institutions based on search
    const results = useMemo(() => {
        if (!searchTerm) return [];

        return institutions.filter(inst => {
            const searchLower = searchTerm.toLowerCase();

            // Check tools
            const tool = inst.tools?.find(t => t.name.toLowerCase() === searchLower);
            if (tool) {
                // Check proficiency if tool found
                if (selectedProficiencies.length > 0 && !selectedProficiencies.includes(tool.proficiency)) {
                    return false;
                }
                return true;
            }

            // Check domains
            const hasDomain = (inst.domains && Object.keys(inst.domains).some(d => d.toLowerCase() === searchLower)) ||
                inst.primaryDomains?.some(d => d.toLowerCase() === searchLower);

            if (hasDomain) return true;

            return false;
        }).map(inst => ({
            ...inst,
            matchedTool: inst.tools?.find(t => t.name.toLowerCase() === searchTerm.toLowerCase())
        }));
    }, [searchTerm, institutions, selectedProficiencies]);

    const toggleProficiency = (level: string) => {
        setSelectedProficiencies(prev =>
            prev.includes(level) ? prev.filter(p => p !== level) : [...prev, level]
        );
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowResults(true);
                        }}
                        placeholder="Search for skills or domains (e.g. Python, AI, Robotics)"
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Autocomplete Dropdown */}
                {showResults && searchTerm && suggestedItems.length > 0 && !results.length && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestedItems.map(item => (
                            <button
                                key={item}
                                onClick={() => {
                                    setSearchTerm(item);
                                    setShowResults(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Proficiency Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proficiency (Tools Only)</label>
                <div className="flex flex-wrap gap-2">
                    {['Basic', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                        <button
                            key={level}
                            onClick={() => toggleProficiency(level)}
                            className={`text-xs px-2 py-1 rounded-md border transition-colors flex items-center gap-1 ${selectedProficiencies.includes(level)
                                ? 'bg-primary/5 border-primary/20 text-primary font-medium'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                        >
                            {selectedProficiencies.includes(level) && <Check className="w-3 h-3" />}
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {searchTerm && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">
                            {results.length} Institutions found
                        </span>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {results.map(inst => (
                            <div
                                key={inst.id}
                                onClick={() => onSelectInstitution(inst.id)}
                                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-slate-900 text-sm group-hover:text-primary transition-colors">
                                        {inst.name}
                                    </h4>
                                    {inst.matchedTool ? (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${inst.matchedTool.proficiency === 'Advanced' || inst.matchedTool.proficiency === 'Expert'
                                            ? 'bg-success/5 text-success border-success/20'
                                            : inst.matchedTool.proficiency === 'Intermediate'
                                                ? 'bg-warning/5 text-warning border-warning/20'
                                                : 'bg-slate-50 text-slate-600 border-slate-200'
                                            }`}>
                                            {inst.matchedTool.proficiency}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded border bg-primary/5 text-primary border-primary/20">
                                            Domain Match
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="truncate">{inst.location.area}</span>
                                    <span>•</span>
                                    <span>{inst.category}</span>
                                </div>
                            </div>
                        ))}

                        {results.length === 0 && searchTerm && (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                No institutions found for "{searchTerm}".
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
