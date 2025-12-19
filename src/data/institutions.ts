import type { Institution } from '../types/institution';
import { inferSkills } from '../utils/inference';
import { userInstitutions } from './user_institutions';
import { legacyInstitutions } from './legacy_institutions';
import { COMPANIES } from './companies';

// ID Mapping from User ID to Legacy ID
const legacyIdMap: Record<string, string> = {
    'st-joseph-engineering': 'sjec-vamanjoor',
    'mite-moodbidri': 'mite-moodabidri',
    'sahyadri-college': 'sahyadri-adyar',
    'alvas-engineering': 'alva-s-institute-of-engg-tech',
    'canara-engineering': 'canara-engineering-college', // Hypothetical, but we rely on deduplication primarily
    'nitte-university': 'nitte-university-deemed',
    'aj-institute-engineering': 'ajiet-kottara',
    'govt-polytechnic-mangalore': 'karnataka-govt-polytechnic',
    'st-aloysius-deemed-university': 'st-aloysius-university',
    'yenepoya-deemed-university': 'yenepoya-university'
};

// Helper to merge programs and preserve seats
const mergePrograms = (userPrograms: any[], legacyPrograms: any[]) => {
    if (!userPrograms) return legacyPrograms || [];
    if (!legacyPrograms) return userPrograms;

    return userPrograms.map(uProg => {
        // Try to find matching legacy program
        const lProg = legacyPrograms.find(l =>
            l.name.toLowerCase().includes(uProg.name.toLowerCase()) ||
            uProg.name.toLowerCase().includes(l.name.toLowerCase())
        );

        if (lProg && !uProg.seats) {
            return { ...uProg, seats: lProg.seats };
        }
        return uProg;
    });
};

// 1. Process User Institutions and Merge with Legacy
// Deduplicate userInstitutions by ID first
const uniqueUserInstitutions = Array.from(
    new Map(userInstitutions.map(item => [item.id, item])).values()
);

const mergedUserInstitutions = uniqueUserInstitutions.map(userInst => {
    const legacyId = legacyIdMap[userInst.id] || userInst.id;
    const legacyInst = legacyInstitutions.find(l => l.id === legacyId);

    if (legacyInst) {
        // Merge logic: User data takes precedence, but fill gaps from legacy
        return {
            ...legacyInst, // Start with legacy (has address, contacts, etc if missing in user)
            ...userInst,   // Override with user data
            academic: {
                ...legacyInst.academic,
                ...userInst.academic,
                programs: mergePrograms(userInst.programs || userInst.academic?.programs || [], legacyInst.academic?.programs || [])
            },
            // Ensure location is merged deep enough if needed, but user location usually preferred
            location: { ...legacyInst.location, ...userInst.location }
        };
    }
    return userInst;
});

// 2. Identify IDs that have been processed
const processedIds = new Set(mergedUserInstitutions.map(i => i.id));
const processedLegacyIds = new Set(Object.values(legacyIdMap)); // Also track the legacy IDs we mapped from

// 3. Filter Legacy Institutions (exclude those merged)
const remainingLegacyInstitutions = legacyInstitutions.filter(l =>
    !processedIds.has(l.id) &&
    !processedLegacyIds.has(l.id) &&
    !userInstitutions.some(u => u.id === l.id) // Double check direct ID matches
);

const rawInstitutions = [
    ...mergedUserInstitutions,
    ...remainingLegacyInstitutions,

    ...COMPANIES
];

console.log('Institutions Debug:', {
    user: mergedUserInstitutions.length,
    legacy: legacyInstitutions.length,
    remaining: remainingLegacyInstitutions.length,
    raw: rawInstitutions.length
});

export const INSTITUTIONS: Institution[] = rawInstitutions.map(inst => {
    try {
        const inferred = inferSkills(inst);

        // Safety check for tools
        const manualTools = inst.tools || [];
        const inferredTools = inferred.tools || [];
        const allTools = [...inferredTools, ...manualTools].filter(t => t && t.name); // Filter out invalid tools

        const uniqueTools = Array.from(new Map(allTools.map(item => [item.name, item])).values());

        // Safety check for specializations
        const manualSpecs = inst.specializations || [];
        const inferredSpecs = inferred.specializations || [];
        const allSpecs = [...inferredSpecs, ...manualSpecs].filter(s => s); // Filter out empty strings/undefined

        const uniqueSpecs = Array.from(new Set(allSpecs));

        return {
            ...inst,
            domains: { ...(inferred.domains || {}), ...(inst.domains || {}) },
            tools: uniqueTools,
            specializations: uniqueSpecs
        };
    } catch (error) {
        console.error(`Error processing institution ${inst.id}:`, error);
        // Return safe object with defaults to prevent UI crashes
        return {
            ...inst,
            domains: inst.domains || {},
            tools: inst.tools || [],
            specializations: inst.specializations || []
        };
    }
});
