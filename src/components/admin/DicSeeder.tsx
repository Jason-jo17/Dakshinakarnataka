import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Papa from 'papaparse';
import { Save, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { toSlug } from '../../utils/slugUtils';

export default function DicSeeder({ onBack }: { onBack: () => void }) {
    const { user: authUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [seededCredentials, setSeededCredentials] = useState<any[]>([]);

    // Load from localStorage on mount
    useState(() => {
        const saved = localStorage.getItem('dic_last_seeded_credentials');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSeededCredentials(parsed);
                    setLogs(['📋 Loaded previous session credentials from storage.']);
                }
            } catch (e) {
                console.error("Failed to load saved credentials", e);
            }
        }
    });

    const handleSeed = async () => {
        setLoading(true);
        setLogs([]);
        setSeededCredentials([]);
        setProgress(0);

        try {
            // 1. Fetch CSV
            const response = await fetch('/dic_master_seed_data.csv');
            if (!response.ok) throw new Error('Failed to fetch CSV file');
            const csvText = await response.text();

            // 2. Parse CSV
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const rows = results.data as any[];
                    const total = rows.length;
                    let current = 0;
                    const newCredentials = [];

                    setLogs(prev => [...prev, `Found ${total} records. Starting seed...`]);

                    for (const row of rows) {
                        current++;
                        setProgress(Math.round((current / total) * 100));

                        const companyName = row['Name of the Enterprise'] || row['Enterprise Name'] || row['Company Name'] || '';
                        if (!companyName) continue;

                        try {
                            // Find the registration number (S.no variant)
                            const regNo = row['S.no'] || row['S.No'] || row['sno'] || row['Serial No'] || row['Id'] || '';
                            const address = row['Address'] || row['Registered Address'] || row['Office Address'] || '';

                            // 3. Generate Credential
                            // Create a username from company name (slugified)
                            const cleanName = companyName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 15);
                            const username = `dic_${cleanName}_${regNo}`;

                            // Check if user exists
                            const { data: existingUser } = await supabase
                                .from('users')
                                .select('id, username, password_hash')
                                .eq('username', username)
                                .maybeSingle();

                            let credentialId = existingUser?.id;
                            // For pilot: password_hash stores plain text, so we can retrieve it
                            let password = existingUser?.password_hash || 'ExistingUser (Password Hidden)';

                            if (!existingUser) {
                                // Create new user in users table (using plain text password as per pilot requirements)
                                const newPassword = Math.random().toString(36).slice(-8) + 'A1!';
                                password = newPassword;

                                const { data: newUser, error: userError } = await supabase
                                    .from('users')
                                    .insert({
                                        username: username,
                                        password_hash: newPassword, // Storing plain text as requested for pilot
                                        role: 'company',
                                        entity_name: companyName,
                                        email: row['Primary Contact Mail Id'],
                                        status: 'active'
                                    })
                                    .select()
                                    .single();

                                if (userError) throw userError;
                                credentialId = newUser.id;
                            }

                            // 4. Insert into DIC Master
                            // Check if exists
                            const { data: existingCompany } = await supabase
                                .from('dic_master_companies')
                                .select('id')
                                .eq('employer_name', companyName)
                                .maybeSingle();

                            if (!existingCompany) {
                                const { error: dicError } = await supabase
                                    .from('dic_master_companies')
                                    .insert({
                                        employer_name: companyName,
                                        sector: row['Sector'] || null,
                                        address: address,
                                        contact_person_name: row['Primary Contact 1'],
                                        contact_person_name_2: row['Primary Contact 2'] || null, 
                                        contact_person_email: row['Primary Contact Mail Id'],
                                        contact_person_phone: row['Primary Contact Number'],
                                        district_id: 'Dakshina Kannada',
                                        status: 'registered',
                                        credential_id: credentialId,
                                        registration_number: regNo
                                    });

                                if (dicError) {
                                    console.error('DIC Insert Error', dicError);
                                    setLogs(prev => [...prev, `❌ Error inserting ${companyName}: ${dicError.message}`]);
                                }

                                // 5. ALSO Sync to new Public Autofill Table
                                const { error: autofillError } = await supabase
                                    .from('dic_company_autofill')
                                    .upsert({
                                        slug: toSlug(companyName),
                                        employer_name: companyName,
                                        address: address,
                                        sector: row['Sector'] || null,
                                        registration_number: regNo,
                                        last_updated: new Date().toISOString()
                                    });

                                if (autofillError) {
                                    console.error('Autofill Sync Error', autofillError);
                                }
                            }

                            // Store credential for export
                            newCredentials.push({
                                s_no: regNo,
                                company_name: companyName,
                                username: username,
                                password: password,
                                status: existingUser ? 'Existing User' : 'New Account'
                            });

                        } catch (err: any) {
                            console.error(`Error processing ${companyName}:`, err);
                            setLogs(prev => [...prev, `⚠️ Failed ${companyName}: ${err.message}`]);
                        }
                    }

                    setSeededCredentials(newCredentials);
                    localStorage.setItem('dic_last_seeded_credentials', JSON.stringify(newCredentials));
                    setLoading(false);
                    setLogs(prev => [...prev, '✅ Seeding complete! Credentials saved to local storage.']);
                },
                error: (error: any) => {
                    setLoading(false);
                    setLogs(prev => [...prev, `❌ CSV Parse Error: ${error.message}`]);
                }
            });

        } catch (error: any) {
            setLoading(false);
            setLogs(prev => [...prev, `❌ Critical Error: ${error.message}`]);
        }
    };

    const downloadCredentials = () => {
        const csv = Papa.unparse(seededCredentials);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'dic_company_credentials.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DIC Master Database Seeder</h1>
                        <p className="text-slate-500 dark:text-slate-400">Import companies from CSV and generate credentials</p>
                        <div className="mt-2 text-xs font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded">
                            Status: {loading ? 'Processing...' : 'Ready'} |
                            User: {authUser?.id || 'Not Logged In'} |
                            Role: {authUser?.role || 'None'}
                        </div>
                    </div>
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-700">Close</button>
                </header>

                <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Warning</p>
                            <p className="text-sm">This process will create users in the seeding database. Ensure the `dic_master_companies` table has the `address` and `contact_person_phone` columns added via migration.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSeed}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {loading ? 'Seeding Database...' : 'Start Seeding'}
                        </button>

                        {seededCredentials.length > 0 && (
                            <button
                                onClick={downloadCredentials}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
                            >
                                <Download className="w-5 h-5" />
                                Download Credentials CSV
                            </button>
                        )}
                    </div>

                    {loading && (
                        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}

                    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                        {logs.length === 0 ? (
                            <span className="text-slate-400">Logs will appear here...</span>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="mb-1">{log}</div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
