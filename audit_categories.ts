import fs from 'fs';
import { legacyInstitutions } from './src/data/legacy_institutions';
import { INSTITUTIONS } from './src/data/institutions';

const allInstitutions = [...legacyInstitutions, ...INSTITUTIONS];

const categories = new Set<string>();
const categoryCounts: Record<string, number> = {};

allInstitutions.forEach(inst => {
    categories.add(inst.category);
    categoryCounts[inst.category] = (categoryCounts[inst.category] || 0) + 1;
});

const output = {
    uniqueCategories: Array.from(categories).sort(),
    categoryCounts
};

fs.writeFileSync('audit_results.json', JSON.stringify(output, null, 2));
console.log('Audit complete. Results written to audit_results.json');
