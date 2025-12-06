import { INSTITUTIONS } from './data/institutions';

console.log(`Total Institutions: ${INSTITUTIONS.length}`);
const nitk = INSTITUTIONS.find(i => i.id === 'nitk-surathkal');
console.log('NITK Source:', nitk?.metadata?.source);
const oldInst = INSTITUTIONS.find(i => i.id === 'canara-college'); // An old one
console.log('Canara College Source:', oldInst?.metadata?.source);
