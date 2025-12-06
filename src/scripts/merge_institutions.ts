import * as fs from 'fs';
import * as path from 'path';
import { INSTITUTIONS } from '../data/institutions';
import { userInstitutions } from '../data/user_institutions';

const aictePath = path.join(process.cwd(), 'src/data/aicte_parsed.json');
const aicteData: { name: string; address: string; programs: { name: string; seats: number }[] }[] = JSON.parse(fs.readFileSync(aictePath, 'utf-8'));

// Helper to normalize names for matching
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Map AICTE data to existing institutions
const mergedUserInstitutions = userInstitutions.map(inst => {
    const match = aicteData.find(a => normalize(a.name).includes(normalize(inst.name)) || normalize(inst.name).includes(normalize(a.name)));
    if (match) {
        console.log(`Matched User Inst: ${inst.name} -> ${match.name}`);
        // Update programs
        // Map AICTE programs to Institution programs structure
        const newPrograms = match.programs.map(p => ({
            name: p.name,
            duration: p.name.includes('M.Tech') || p.name.includes('MBA') || p.name.includes('MCA') ? '2 Years' : '4 Years', // Heuristic
            seats: p.seats,
            specializations: [] // AICTE data doesn't have specializations per course in the same way, or does it?
            // The AICTE data has "CSE (Artificial Intelligence)" which is a course name.
            // My previous data had "B.Tech" with specializations.
            // The new data lists each specialization as a separate course with intake.
            // This is BETTER.
        }));

        return {
            ...inst,
            academic: {
                ...inst.academic,
                programs: newPrograms
            },
            // Update address if AICTE has it (it does)
            location: {
                ...inst.location,
                address: match.address // Use the detailed address from AICTE
            }
        };
    }
    return inst;
});

// Identify legacy institutions (those in INSTITUTIONS but not in userInstitutions)
// We match by ID.
const userIds = new Set(userInstitutions.map(u => u.id));
const legacyInstitutions = INSTITUTIONS.filter(i => !userIds.has(i.id));

const mergedLegacyInstitutions = legacyInstitutions.map(inst => {
    const match = aicteData.find(a => normalize(a.name).includes(normalize(inst.name)) || normalize(inst.name).includes(normalize(a.name)));
    if (match) {
        console.log(`Matched Legacy Inst: ${inst.name} -> ${match.name}`);
        const newPrograms = match.programs.map(p => ({
            name: p.name,
            duration: p.name.includes('M.Tech') || p.name.includes('MBA') || p.name.includes('MCA') ? '2 Years' : '3-4 Years',
            seats: p.seats,
            specializations: []
        }));

        return {
            ...inst,
            academic: {
                ...inst.academic,
                programs: newPrograms
            },
            location: {
                ...inst.location,
                address: match.address
            }
        };
    }
    return inst;
});

// Also check for NEW institutions in AICTE data that are not in either list
// const allIds = new Set([...userInstitutions.map(u => u.id), ...legacyInstitutions.map(l => l.id)]);
const newAicteInstitutions = aicteData.filter(a => {
    const matchedUser = userInstitutions.some(u => normalize(a.name).includes(normalize(u.name)) || normalize(u.name).includes(normalize(a.name)));
    const matchedLegacy = legacyInstitutions.some(l => normalize(a.name).includes(normalize(l.name)) || normalize(l.name).includes(normalize(a.name)));
    return !matchedUser && !matchedLegacy;
});

console.log(`Found ${newAicteInstitutions.length} new institutions in AICTE list.`);

// Create new entries for them
const brandNewInstitutions = newAicteInstitutions.map(a => {
    const id = a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
        id,
        name: a.name,
        category: a.name.includes('Polytechnic') ? 'Polytechnic' : (a.name.includes('Engineering') || a.name.includes('Tech') ? 'Engineering' : 'Degree College'),
        type: a.name.includes('Govt') ? 'Government' : 'Private',
        location: {
            address: a.address,
            landmark: '',
            area: 'Mangalore', // Default
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001', // Default
            coordinates: { lat: 12.9141, lng: 74.8560 }, // Default
            googleMapsUrl: ''
        },
        contact: { website: '' },
        academic: {
            programs: a.programs.map(p => ({
                name: p.name,
                duration: '3-4 Years',
                seats: p.seats
            }))
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'AICTE List' }
    };
});

// Write user_institutions.ts
const userContent = `import type { Institution } from '../types/institution';

export const userInstitutions: Institution[] = ${JSON.stringify(mergedUserInstitutions, null, 4)};
`;
fs.writeFileSync(path.join(process.cwd(), 'src/data/user_institutions.ts'), userContent);

// Write legacy_institutions.ts
// We combine legacy + brand new ones into this file
const finalLegacyList = [...mergedLegacyInstitutions, ...brandNewInstitutions];
const legacyContent = `import type { Institution } from '../types/institution';

export const legacyInstitutions: Institution[] = ${JSON.stringify(finalLegacyList, null, 4)};
`;
fs.writeFileSync(path.join(process.cwd(), 'src/data/legacy_institutions.ts'), legacyContent);

console.log('Done merging.');
