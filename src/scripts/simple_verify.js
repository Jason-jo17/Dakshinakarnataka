
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../../public/dic_master_seed_data.csv');

try {
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    // Regex matches lines starting with a number followed by a comma, e.g. "1,".
    // This is a rough heuristic for the CSV format "S.No,Name,..."
    const recordCount = lines.filter(l => /^\d+,/.test(l)).length;
    console.log(`Approximate record count based on regex: ${recordCount}`);
    console.log(`Total lines in file: ${lines.length}`);
} catch (err) {
    console.error(err);
}
