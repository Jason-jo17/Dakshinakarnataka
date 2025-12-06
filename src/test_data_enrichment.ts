import { INSTITUTIONS } from './data/institutions';
import * as fs from 'fs';

const nitk = INSTITUTIONS.find(i => i.id === 'nitk-surathkal');
const yenepoya = INSTITUTIONS.find(i => i.id === 'yenepoya-deemed-university');
const canara = INSTITUTIONS.find(i => i.id === 'canara-engineering');

const output = `Total Institutions: ${INSTITUTIONS.length}\n` +
    `NITK Seats: ${JSON.stringify(nitk?.programs)}\n` +
    `Yenepoya Seats: ${JSON.stringify(yenepoya?.programs)}\n` +
    `Canara Seats: ${JSON.stringify(canara?.programs)}\n`;

fs.writeFileSync('test_output_2.txt', output);
console.log('Done writing test_output_2.txt');
