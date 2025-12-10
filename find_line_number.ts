import fs from 'fs';

const content = fs.readFileSync('./src/data/legacy_institutions.ts', 'utf-8');
const lines = content.split('\n');

const output: string[] = [];
lines.forEach((line, index) => {
    if (line.includes('nitk')) {
        output.push(`Found 'nitk' at line ${index + 1}`);
    }
    if (line.includes('sahyadri-college')) {
        output.push(`Found 'sahyadri-college' at line ${index + 1}`);
    }
    if (line.includes('mite-moodabidri')) {
        output.push(`Found 'mite-moodabidri' at line ${index + 1}`);
    }
});
fs.writeFileSync('line_numbers.txt', output.join('\n'));
console.log('Done.');
