import { INSTITUTIONS } from './data/institutions';

const checkInstitution = (id: string) => {
    const inst = INSTITUTIONS.find(i => i.id === id);
    if (!inst) {
        console.log(`Institution ${id} not found`);
        return;
    }
    console.log(`Institution: ${inst.name} (${inst.id})`);
    console.log(`Programs: ${inst.academic?.programs?.length || 0}`);
    inst.academic?.programs?.forEach(p => {
        console.log(`  - ${p.name}: ${p.seats || 'No seats'}`);
    });
};

console.log('--- Checking Seat Data ---');
checkInstitution('pace-nadupadavu'); // User provided, missing seats originally
checkInstitution('sjec-vamanjoor'); // Legacy ID, should be merged into st-joseph-engineering
checkInstitution('st-joseph-engineering'); // User ID
