
import { useState } from 'react';
import { Database, X, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

import { INSTITUTIONS } from '../data/institutions';
import { JOBS } from '../data/jobs';
import { DISTRICTS } from '../data/districts';

import { toSlug } from '../utils/slugUtils';

export function DataSeeder() {
    const [status, setStatus] = useState<string>('Ready to seed');
    const [isLoading, setIsLoading] = useState(false);

    const seedInstitutions = async () => {
        setIsLoading(true);
        setStatus('Seeding Institutions...');
        try {
            // Process data to ensure compatibility with Supabase types
            const cleanData = INSTITUTIONS.map(inst => {
                // Deep clone to avoid mutating original
                const data = JSON.parse(JSON.stringify(inst));

                // Ensure arrays are arrays? Supabase handles this well mostly.
                // The main potential issue is if optional fields are undefined; Supabase ignores them or sets null.
                // We might need to ensure 'domains' and 'tools' objects match jsonb structure.

                return data;
            });

            // Insert in chunks to avoid payload limits
            const chunkSize = 50;
            let insertedCount = 0;

            for (let i = 0; i < cleanData.length; i += chunkSize) {
                const chunk = cleanData.slice(i, i + chunkSize);

                // upsert allows us to run this multiple times without duplicate key errors
                const { error } = await supabase.from('institutions').upsert(chunk);

                if (error) {
                    console.error('Error inserting institution chunk:', error);
                    throw error;
                }
                insertedCount += chunk.length;
                setStatus(`Seeding Institutions... (${insertedCount}/${cleanData.length})`);
            }

            setStatus('Institutions Seeded Successfully!');
        } catch (err: any) {
            console.error(err);
            setStatus(`Error seeding institutions: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const seedJobs = async () => {
        setIsLoading(true);
        setStatus('Seeding Jobs...');
        try {
            const cleanData = JOBS.map(job => JSON.parse(JSON.stringify(job)));

            const { error } = await supabase.from('jobs').upsert(cleanData);

            if (error) {
                console.error('Error inserting jobs:', error);
                throw error;
            }

            setStatus('Jobs Seeded Successfully!');
        } catch (err: any) {
            console.error(err);
            setStatus(`Error seeding jobs: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const seedDistricts = async () => {
        setIsLoading(true);
        setStatus('Seeding Districts...');
        try {
            const districtData = DISTRICTS.map(name => ({
                id: toSlug(name),
                name: name
            }));

            const { error } = await supabase.from('districts').upsert(districtData);

            if (error) {
                console.error('Error inserting districts:', error);
                throw error;
            }

            setStatus('Districts Seeded Successfully!');
        } catch (err: any) {
            console.error(err);
            setStatus(`Error seeding districts: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const { seed: seedStateItiStats } = useItiSeeder(setIsLoading, setStatus);

    return (
        <div className="fixed bottom-6 right-6 z-[3000] flex flex-col items-end gap-4 pointer-events-auto">
            {/* Panel */}
            {isOpen && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 animate-in slide-in-from-right-4 fade-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-500" />
                            Seed Data
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-pre-wrap break-words">
                        {status}
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={seedInstitutions}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-between group"
                        >
                            <span>Seed Institutions</span>
                            {isLoading && status.includes('Institutions') ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                        </button>

                        <button
                            onClick={seedJobs}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-between group"
                        >
                            <span>Seed Jobs</span>
                            {isLoading && status.includes('Jobs') ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                        </button>

                        <button
                            onClick={seedDistricts}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-between group"
                        >
                            <span>Seed Districts</span>
                            {isLoading && status.includes('Districts') ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                        </button>

                        <button
                            onClick={seedStateItiStats}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-between group"
                        >
                            <span>Seed ITI Stats</span>
                            {isLoading && status.includes('ITI') ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center justify-center w-14 h-14 bg-slate-900 dark:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none ring-4 ring-white/20 dark:ring-black/20"
                title="Open Data Seeder"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Database className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                )}
            </button>
        </div>
    );
}

import { STATE_ITI_CSV } from '../data/stateItiData';

// Helper to seed ITI Stats
function useItiSeeder(setIsLoading: (v: boolean) => void, setStatus: (v: string) => void) {
    const seed = async () => {
        setIsLoading(true);
        setStatus('Seeding State ITI Stats...');
        try {
            const lines = STATE_ITI_CSV.split('\n').filter(l => l.trim());
            const payload = [];

            // Skip header (i=1)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Simple regex for CSV parsing dealing with quotes
                // 'matches' was unused, just using robust split below

                // Robust split:
                const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) || [];

                if (cols.length < 5) continue; // Basic check

                // Handle the case where Sector is empty (same as previous row? or just implicit?)
                // The provided data seems to have some rows with "Automobile" explicit, others implicit?
                // Actually in the provided data:
                // 1007-... (No sector?) -> Wait, the first few rows don't have a Sector column at index 0?
                // Header: Sector Name, Trade Name...
                // Row 1: 1007-MANUFACTURING..., 3.0, ...
                // It looks like the first few rows MISS the Sector Name column? Or is "1007-..." the Sector?
                // Wait, "1007-MANUFACTURING PROCESS CONTROL..." looks like a Trade Name, not a Sector. 
                // Let's check the CSV structure again.
                // Row 12: "Automobile","504-Mechanic..." 
                // It seems the first few rows are missing the Sector column value? Or is it merged?
                // The header has 15 columns.
                // Row 1: "1007-...", "3.0", "1 year", "150"... -> Count: 14?
                // If header is Sector, Trade... and Row 1 starts with Trade, then Sector is missing/empty.
                // I will assume empty Sector for those or use a default.

                let sector = cols[0];
                let trade = cols[1];
                let offset = 0;

                // Heuristic: If cols[0] looks like a Trade ID (starts with number), and we are missing a column...
                // Actually let's assume the CSV parser might be tricky.
                // Let's look at the counts.
                // Header: 15 cols.
                // Row 1: "1007...", "3.0", "1 year"... 
                // If I split Row 1 by comma:
                // [1007-..., 3.0, 1 year, 150, 0, 0, 0, 0, 0, 0, 6000, 0, 0, 0] -> 14 columns.
                // So it is missing the first column (Sector).

                if (cols.length === 14) {
                    sector = 'Unknown/General';
                    trade = cols[0];
                    offset = -1; // Shift reading index
                } else {
                    // Normal case 15 cols
                    sector = cols[0];
                    trade = cols[1];
                    offset = 0;
                }

                payload.push({
                    sector_name: sector,
                    trade_name: trade,
                    nsqf_level: cols[2 + offset],
                    duration: cols[3 + offset],
                    iti_count: parseInt(cols[4 + offset]) || 0,
                    seat_count_current: parseInt(cols[5 + offset]) || 0,
                    trainee_count_current: parseInt(cols[6 + offset]) || 0,
                    seat_utilization_current: cols[7 + offset],
                    seat_count_previous: parseInt(cols[8 + offset]) || 0,
                    trainee_count_previous: parseInt(cols[9 + offset]) || 0,
                    seat_utilization_previous: cols[10 + offset],
                    seat_count_total: parseInt(cols[11 + offset]) || 0,
                    trainee_count_total: parseInt(cols[12 + offset]) || 0,
                    seat_utilization_total: cols[13 + offset],
                    trainee_count_previous_2nd_year: parseInt(cols[14 + offset]) || 0
                });
            }

            // Clear existing? Or just upsert?
            // Let's truncate first to be clean since it's reference data
            await supabase.from('state_iti_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

            // Insert
            const { error } = await supabase.from('state_iti_stats').insert(payload);

            if (error) throw error;
            setStatus(`Successfully seeded ${payload.length} ITI stats records!`);

        } catch (err: any) {
            console.error(err);
            setStatus(`Error seeding ITI stats: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    return { seed };
}
