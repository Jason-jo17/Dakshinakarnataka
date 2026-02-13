
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
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
        console.log('Sample data (no filter):', allData);
    }

    // 3. Check with filter
    const { data: filteredData, error: filteredError } = await supabase
        .from('dic_master_companies')
        .select('*')
        .eq('district_id', 'Dakshina Kannada');
        
    if (filteredError) {
        console.error('Error fetching filtered data:', filteredError);
    } else {
        console.log(`Rows matching 'Dakshina Kannada': ${filteredData?.length}`);
    }
}

checkDicData();
