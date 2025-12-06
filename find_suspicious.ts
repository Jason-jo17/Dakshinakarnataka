import fs from 'fs';
import { legacyInstitutions } from './src/data/legacy_institutions';
import { INSTITUTIONS } from './src/data/institutions';

const allInstitutions = [...legacyInstitutions, ...INSTITUTIONS];

const suspicious = [];

allInstitutions.forEach(inst => {
    const name = inst.name.toLowerCase();
    const category = inst.category;

    if (category === 'Engineering' && (name.includes('pu') || name.includes('pre-university'))) {
        suspicious.push({ reason: 'Engineering category but PU name', inst });
    }

    if (category === 'PU College' && (name.includes('engineering') || name.includes('technology'))) {
        suspicious.push({ reason: 'PU College category but Engineering name', inst });
    }
});

fs.writeFileSync('suspicious_institutions.json', JSON.stringify(suspicious, null, 2));
console.log(`Found ${suspicious.length} suspicious institutions.`);
