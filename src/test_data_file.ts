import { INSTITUTIONS } from './data/institutions';
import * as fs from 'fs';

const output = `Total Institutions: ${INSTITUTIONS.length}\n` +
    `NITK Source: ${INSTITUTIONS.find(i => i.id === 'nitk-surathkal')?.metadata?.source}\n` +
    `Canara College Source: ${INSTITUTIONS.find(i => i.id === 'canara-college')?.metadata?.source}\n`;

fs.writeFileSync('test_output.txt', output);
console.log('Done writing test_output.txt');
