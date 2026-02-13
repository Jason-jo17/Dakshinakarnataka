
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
// Note: windows path separation might be an issue, use forward slashes or path.join
const envPath = path.resolve(__dirname, '../../.env.local');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    console.error('VITE_SUPABASE_URL:', supabaseUrl);
    // Don't log full key for security, just presence
    console.error('VITE_SUPABASE_ANON_KEY present:', !!supabaseAnonKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDicData() {
    console.log('Checking DIC Master Companies...');

    // 1. Check total count
    const { count, error: countError } = await supabase
        .from('dic_master_companies')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting rows:', countError);
    } else {
        console.log(`Total rows in dic_master_companies: ${count}`);
    }

    // 2. Check sample data without filter
    const { data: allData, error: allError } = await supabase
        .from('dic_master_companies')
        .select('id, employer_name, district_id')
        .limit(5);

    if (allError) {
        console.error('Error fetching all data:', allError);
    } else {
        console.log('Sample data (no filter):', JSON.stringify(allData, null, 2));
    }

    // 3. Check with filter
    const FILTER_DISTRICT = 'Dakshina Kannada';
    const { data: filteredData, error: filteredError } = await supabase
        .from('dic_master_companies')
        .select('*')
        .eq('district_id', FILTER_DISTRICT);

    if (filteredError) {
        console.error('Error fetching filtered data:', filteredError);
    } else {
        console.log(`Rows matching '${FILTER_DISTRICT}': ${filteredData?.length}`);
    }
}

checkDicData();
