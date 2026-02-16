import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing ENV variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
  const { data, error } = await supabase
    .from('ad_survey_employer')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching data:", error);
  } else if (data && data.length > 0) {
    console.log("Columns found in ad_survey_employer:");
    console.log(Object.keys(data[0]));
  } else {
    console.log("No data found in table, but let's try to get columns via RPC or just query an empty select");
     const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'ad_survey_employer' });
     if (colError) {
         console.log("RPC failed, trying empty select keys");
         const { data: emptyData } = await supabase.from('ad_survey_employer').select('*').limit(0);
         // Often select('*').limit(0) doesn't return keys if empty, but we'll see
     } else {
         console.log("Columns via RPC:", cols);
     }
  }
}

inspectTable();
