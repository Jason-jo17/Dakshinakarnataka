import { useState, useMemo } from 'react';
import type { Institution } from '../types/institution';

export interface FilterState {
    search: string;
    categories: string[];
    types: string[];
    districts: string[];
    domains: string[];
    tools: string[];
    degrees: string[];
    coe: boolean;
}

export const useFilters = (data: Institution[]) => {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categories: [],
        types: [],
        districts: [],
        domains: [],
        tools: [],
        degrees: [],
        coe: false
    });

    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchName = item.name.toLowerCase().includes(searchLower);
                const matchAddress = item.location.address.toLowerCase().includes(searchLower);
                const matchArea = item.location.area.toLowerCase().includes(searchLower);
                if (!matchName && !matchAddress && !matchArea) return false;
            }

            // Category
            if (filters.categories.length > 0) {
                if (!filters.categories.includes(item.category)) return false;
            }

            // Type
            if (filters.types.length > 0) {
                if (!filters.types.includes(item.type)) return false;
            }

            // COE
            if (filters.coe) {
                if (!item.coe) return false;
            }

            // Domain
            if (filters.domains.length > 0) {
                // Check if institution has ANY of the selected domains with score > 5
                const hasDomain = filters.domains.some(d => {
                    // @ts-ignore - dynamic key access
                    const score = item.domains?.[d];
                    return score && score > 5;
                });
                if (!hasDomain) return false;
            }

            // Tool
            if (filters.tools.length > 0) {
                const hasTool = filters.tools.some(t =>
                    item.tools?.some(instTool => instTool.name === t)
                );
                if (!hasTool) return false;
            }

            // Degree
            if (filters.degrees.length > 0) {
                const hasDegree = filters.degrees.some(d => {
                    // Normalize degree for comparison
                    const normalize = (str: string) => str.toLowerCase().replace(/\./g, '').replace(/ /g, '');
                    const target = normalize(d);

                    // Handle synonyms
                    const synonyms: { [key: string]: string[] } = {
                        'be': ['btech', 'bachelorofengineering', 'bacheloroftechnology'],
                        'btech': ['be', 'bachelorofengineering', 'bacheloroftechnology'],
                        'me': ['mtech', 'masterofengineering', 'masteroftechnology'],
                        'mtech': ['me', 'masterofengineering', 'masteroftechnology'],
                        'mba': ['masterofbusinessadministration', 'pgdm'],
                        'mca': ['masterofcomputerapplications'],
                        'bba': ['bachelorofbusinessadministration', 'bbm'],
                        'bca': ['bachelorofcomputerapplications']
                    };

                    return item.academic?.programs?.some(p => {
                        const progName = normalize(p.name);
                        // Direct match
                        if (progName.includes(target)) return true;
                        // Synonym match
                        if (synonyms[target]) {
                            return synonyms[target].some(syn => progName.includes(syn));
                        }
                        return false;
                    });
                });
                if (!hasDegree) return false;
            }

            return true;
        });
    }, [data, filters]);

    const setSearch = (search: string) => setFilters(prev => ({ ...prev, search }));
    const toggleCategory = (category: string) => {
        setFilters(prev => {
            const exists = prev.categories.includes(category);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter(c => c !== category)
                    : [...prev.categories, category]
            };
        });
    };

    const toggleDomain = (domain: string) => {
        setFilters(prev => {
            const exists = prev.domains.includes(domain);
            return {
                ...prev,
                domains: exists
                    ? prev.domains.filter(d => d !== domain)
                    : [...prev.domains, domain]
            };
        });
    };

    const toggleTool = (tool: string) => {
        setFilters(prev => {
            const exists = prev.tools.includes(tool);
            return {
                ...prev,
                tools: exists
                    ? prev.tools.filter(t => t !== tool)
                    : [...prev.tools, tool]
            };
        });
    };

    const toggleDegree = (degree: string) => {
        setFilters(prev => {
            const exists = prev.degrees.includes(degree);
            return {
                ...prev,
                degrees: exists
                    ? prev.degrees.filter(d => d !== degree)
                    : [...prev.degrees, degree]
            };
        });
    };

    const toggleCoe = () => {
        setFilters(prev => ({ ...prev, coe: !prev.coe }));
    };

    return {
        filters,
        filteredData,
        setSearch,
        toggleCategory,
        toggleDomain,
        toggleTool,
        toggleDegree,
        toggleCoe,
        setFilters
    };
};
