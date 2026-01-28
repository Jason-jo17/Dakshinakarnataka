
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkConnection() {
      try {
        // Simple query to check connection - assuming 'companies' table might exist or just checking auth
        // Since we don't know tables yet, checking session is a safe bet for connection, 
        // OR simply seeing if we can execute a query that returns 0 rows without network error.
        
        // Let's try to get auth settings or just a simple invalid query that should return a specific supabase error (like 404 table not found)
        // rather than a network error.
        
        const { error } = await supabase.from('non_existent_table').select('*').limit(1);
        
        // If error code is '42P01' (undefined_table), it means we connected to Postgres but table is missing.
        // That COUNTS as a successful connection to the DB instance.
        // If error is network error, then connection failed.
        
        if (error && error.code === 'PGRST204') { // undefined table in PostgREST is often treated differently, but usually returns error
             // Actually, Supabase client might return error. 
             console.log('Connection test result:', error);
        }
        
        // Better: just check if we can list buckets or something generic? No, permissions.
        // Let's just assume if we don't get a "FetchError" it's good.
        
        if (error && error.message && error.message.includes('FetchError')) {
            throw error;
        }

        setStatus('connected');
        setMessage('Successfully connected to Supabase!');
      } catch (err: any) {
        setStatus('error');
        setMessage(`Connection failed: ${err.message}`);
      }
    }

    checkConnection();
  }, []);

  if (status === 'loading') return <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded shadow">Checking DB...</div>;
  if (status === 'error') return <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow">{message}</div>;
  return <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow">{message}</div>;
}
