
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
// In root, .env.local is in same dir
const envPath = path.resolve(__dirname, '.env.local');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDicData() {
    console.log('Checking DIC Master Companies...');
    
    const { count, error } = await supabase
        .from('dic_master_companies')
        .select('*', { count: 'exact', head: true });
        
    if (error) console.error('Error:', error);
    else console.log(`Total rows: ${count}`);

    const { data: sample } = await supabase
        .from('dic_master_companies')
        .select('id, employer_name, district_id')
        .limit(3);
    console.log('Sample:', sample);

    const { count: filteredCount } = await supabase
        .from('dic_master_companies')
        .select('*', { count: 'exact', head: true })
        .eq('district_id', 'Dakshina Kannada');
    console.log(`Filtered count (Dakshina Kannada): ${filteredCount}`);
}

checkDicData();
