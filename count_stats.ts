
import { INSTITUTIONS } from './src/data/institutions';

const stats: Record<string, { students: number, institutions: number }> = {
    '10th Std': { students: 0, institutions: 0 },
    'PU': { students: 0, institutions: 0 },
    'Degree': { students: 0, institutions: 0 },
    'Engineering': { students: 0, institutions: 0 },
    'Diploma': { students: 0, institutions: 0 },
    'ITI': { students: 0, institutions: 0 },
    'Other': { students: 0, institutions: 0 }
};

const categoryMap: Record<string, string> = {
    'PU College': 'PU',
    'Degree College': 'Degree',
    'Polytechnic': 'Diploma',
    'Engineering': 'Engineering',
    'ITI': 'ITI',
    'High School': '10th Std'
};

const unknownCategories = new Set<string>();

INSTITUTIONS.forEach(inst => {
    let category = inst.category;
    let mappedCategory = categoryMap[category];

    if (!mappedCategory) {
        unknownCategories.add(category);
        mappedCategory = 'Other';
    }

    let students = 0;
    if (inst.academic && inst.academic.programs) {
        inst.academic.programs.forEach(p => {
            let duration = 1;
            if (p.duration) {
                const match = p.duration.match(/(\d+)/);
                if (match) duration = parseInt(match[1]);
            }
            // Fallback default durations if parsing fails or duration missing
            if (duration === 1 && p.duration) {
                if (p.duration.toLowerCase().includes('year')) duration = 1; // already 1
                // Check for 'Semester'
            }

            if (p.seats) {
                students += p.seats * duration;
            }
        });
    } else if (inst.category === 'Company' && inst.company?.employees) {
        // Companies might not bestudents but employees
        // The chart is about students, so Company employees shouldn't count
    } else if (inst.category === 'School' || inst.category === 'High School') {
        // Estimate if no programs
        students = 500; // rough estimate
    }

    if (stats[mappedCategory]) {
        stats[mappedCategory].institutions++;
        stats[mappedCategory].students += students;
    }
});

console.log('Stats:', JSON.stringify(stats, null, 2));
console.log('Unknown Categories:', Array.from(unknownCategories));

console.log('Total Institutions:', INSTITUTIONS.length);
import { legacyInstitutions } from './src/data/legacy_institutions';
console.log('Legacy Institutions Length:', legacyInstitutions.length);

