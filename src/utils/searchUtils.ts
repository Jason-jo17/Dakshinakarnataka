// Search utility functions for autocomplete suggestions

import type { Institution } from '../types/institution';
import type { IndustryDemand } from '../store/useDataStore';

export type SuggestionType = 'institution' | 'skill' | 'company';

export interface SearchSuggestion {
    id: string;
    type: SuggestionType;
    label: string;
    category?: string; // For institutions
    sector?: string; // For companies
    metadata?: string; // Additional info to display
}

/**
 * Extract unique skills from industry demand data
 */
export function extractSkills(industryDemands: IndustryDemand[]): string[] {
    const skillsSet = new Set<string>();

    industryDemands.forEach(demand => {
        if (demand.skills_required) {
            // Split by comma and clean up
            const skills = demand.skills_required.split(',').map(s => s.trim());
            skills.forEach(skill => {
                if (skill) skillsSet.add(skill);
            });
        }
    });

    return Array.from(skillsSet).sort();
}

/**
 * Extract unique companies from industry demand data
 */
export function extractCompanies(industryDemands: IndustryDemand[]): SearchSuggestion[] {
    const companiesMap = new Map<string, SearchSuggestion>();

    industryDemands.forEach(demand => {
        if (demand.company_name && !companiesMap.has(demand.company_name)) {
            companiesMap.set(demand.company_name, {
                id: `company-${demand.id}`,
                type: 'company',
                label: demand.company_name,
                sector: demand.sector,
                metadata: `${demand.sector} • ${demand.company_type}`
            });
        }
    });

    return Array.from(companiesMap.values()).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Filter institutions based on query and active filters
 */
export function filterInstitutions(
    institutions: Institution[],
    query: string,
    filters?: { sector?: string; institution?: string }
): SearchSuggestion[] {
    const lowerQuery = query.toLowerCase();

    return institutions
        .filter(inst => {
            // Match query
            const matchesQuery = inst.name.toLowerCase().includes(lowerQuery);
            if (!matchesQuery) return false;

            // Apply filters if provided
            if (filters?.sector && filters.sector !== 'all') {
                // Assuming institutions have a category or type field
                // For now, we'll skip sector filtering for institutions
            }

            return true;
        })
        .slice(0, 4) // Limit to 4 suggestions
        .map(inst => ({
            id: `institution-${inst.id}`,
            type: 'institution' as SuggestionType,
            label: inst.name,
            category: inst.category,
            metadata: `${inst.category} • ${inst.location.area}`
        }));
}

/**
 * Filter skills based on query and active filters
 */
export function filterSkills(
    skills: string[],
    query: string,
    filters?: { domain?: string; industry?: string }
): SearchSuggestion[] {
    void filters; // Filters can be used for future enhancement
    const lowerQuery = query.toLowerCase();

    return skills
        .filter(skill => skill.toLowerCase().includes(lowerQuery))
        .slice(0, 3) // Limit to 3 suggestions
        .map((skill, idx) => ({
            id: `skill-${idx}`,
            type: 'skill' as SuggestionType,
            label: skill,
            metadata: 'Skill'
        }));
}

/**
 * Filter companies based on query and active filters
 */
export function filterCompanies(
    companies: SearchSuggestion[],
    query: string,
    filters?: { sector?: string; industry?: string; companyType?: string }
): SearchSuggestion[] {
    const lowerQuery = query.toLowerCase();

    return companies
        .filter(company => {
            // Match query
            const matchesQuery = company.label.toLowerCase().includes(lowerQuery);
            if (!matchesQuery) return false;

            // Apply filters if provided
            if (filters?.sector && filters.sector !== 'all') {
                if (company.sector && company.sector !== filters.sector) return false;
            }

            return true;
        })
        .slice(0, 3); // Limit to 3 suggestions
}

/**
 * Get all search suggestions based on query and filters
 */
export function getSearchSuggestions(
    query: string,
    institutions: Institution[],
    industryDemands: IndustryDemand[],
    filters: {
        sector?: string;
        industry?: string;
        domain?: string;
        institution?: string;
        companyType?: string;
    }
): SearchSuggestion[] {
    if (!query || query.length < 2) return [];

    const skills = extractSkills(industryDemands);
    const companies = extractCompanies(industryDemands);

    const institutionSuggestions = filterInstitutions(institutions, query, filters);
    const skillSuggestions = filterSkills(skills, query, filters);
    const companySuggestions = filterCompanies(companies, query, filters);

    return [
        ...institutionSuggestions,
        ...skillSuggestions,
        ...companySuggestions
    ].slice(0, 10); // Maximum 10 total suggestions
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, query: string): { before: string; match: string; after: string } | null {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return null;

    return {
        before: text.slice(0, index),
        match: text.slice(index, index + query.length),
        after: text.slice(index + query.length)
    };
}
