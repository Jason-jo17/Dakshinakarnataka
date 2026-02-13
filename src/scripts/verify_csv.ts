
import fs from 'fs';
import Papa from 'papaparse';

const csvFilePath = 'public/dic_master_seed_data.csv';

try {
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log(`Parsed ${results.data.length} records.`);
      if (results.errors.length > 0) {
        console.error('Errors:', results.errors);
      } else {
        console.log('No parsing errors found.');
        // Log first 3 records to verify structure
        console.log('First 3 records:', results.data.slice(0, 3));
      }
    }
  });
} catch (err) {
  console.error('Error reading file:', err);
}
