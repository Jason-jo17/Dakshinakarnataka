import fs from 'fs';
import { legacyInstitutions } from './src/data/legacy_institutions';
import { INSTITUTIONS } from './src/data/institutions';

const allInstitutions = [...legacyInstitutions, ...INSTITUTIONS];

const coeInstitutions = allInstitutions.filter(inst => inst.coe);

const missingData = coeInstitutions.filter(inst => {
    const hasPrograms = inst.academic?.programs && inst.academic.programs.length > 0;
    const hasSeats = inst.academic?.programs?.some(p => p.seats && p.seats > 0);
    return !hasPrograms || !hasSeats;
});

const report = missingData.map(inst => ({
    id: inst.id,
    name: inst.name,
    category: inst.category,
    hasPrograms: !!(inst.academic?.programs && inst.academic.programs.length > 0),
    hasSeats: !!(inst.academic?.programs?.some(p => p.seats && p.seats > 0))
}));

fs.writeFileSync('coe_audit.json', JSON.stringify(report, null, 2));
console.log(`Found ${missingData.length} COE institutions with missing data.`);
