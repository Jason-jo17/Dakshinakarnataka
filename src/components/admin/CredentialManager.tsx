import React, { useState, useEffect } from 'react';
import { useCredentialStore, type UserRole } from '../../store/useCredentialStore';
import { userInstitutions } from '../../data/user_institutions';
import { COMPANIES } from '../../data/companies';
import { Copy, RefreshCw, Key, Shield, User, FileSpreadsheet, Building2, Briefcase, GraduationCap, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import * as XLSX from 'xlsx';
import { CredentialSeeder } from './CredentialSeeder';


const CredentialManager: React.FC = () => {
    const { credentials, generateCredential, revokeCredential, syncWithDatabase } = useCredentialStore();
    const [activeTab, setActiveTab] = useState<'generate' | 'master' | 'survey' | 'dic'>('generate');

    // Generation State
    const [selectedRole, setSelectedRole] = useState<UserRole>('institution');
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    const [traineeName, setTraineeName] = useState<string>('');
    const [generatedCred, setGeneratedCred] = useState<any>(null);
    const [dbCompanies, setDbCompanies] = useState<any[]>([]);
    const [dbInstitutions, setDbInstitutions] = useState<any[]>([]);

    // DIC Master Sheet State
    const [dicEntries, setDicEntries] = useState<any[]>([]);
    const [showDicForm, setShowDicForm] = useState(false);


    // Survey Data State
    const [surveyEntries, setSurveyEntries] = useState<any[]>([]);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log('[CredentialManager] Fetching data...');
            setErrorMsg(null);

            // 1. Fetch DIC Master Companies
            const { data: dicList, error: dicError } = await supabase
                .from('dic_master_companies')
                .select('*')
                .eq('district_id', 'Dakshina Kannada')
                .order('created_at', { ascending: false });

            if (dicError) {
                console.error('[CredentialManager] Error fetching DIC companies:', dicError);
                setErrorMsg(`Error fetching DIC companies: ${dicError.message} (${dicError.code})`);
            } else if (dicList) {
                setDicEntries(dicList);
                // For dropdowns, we might want to include both, or just DIC.
                // Let's start with DIC for now.
                setDbCompanies(dicList.map(c => ({ id: c.id, name: c.employer_name })));
            }

            // 2. Fetch Survey Companies (Aggregate Demand)
            const { data: surveyList, error: surveyError } = await supabase
                .from('ad_survey_employer')
                .select('id, employer_name, sector, contact_person_name, contact_person_email, district_id')
                .eq('district_id', 'Dakshina Kannada')
                .order('created_at', { ascending: false });

            if (surveyError) console.error('[CredentialManager] Error fetching survey companies:', surveyError);

            if (surveyList) {
                setSurveyEntries(surveyList);

                // If DIC list is empty, fallback to survey for generation dropdown
                if (!dicList || dicList.length === 0) {
                    setDbCompanies(surveyList.map(c => ({ id: c.id, name: c.employer_name })));
                } else {
                    // Option: Merge them for the dropdown? 
                    // Let's keep them separate in tabs, but maybe merge for "Company" role generation?
                    // User requested separation, so let's keep tabs separate. 
                    // But for generating credentials, we might want to pick from either.
                    // For now, let's append survey companies to dbCompanies with a marker or just merge.
                    const combined = [
                        ...dicList.map(c => ({ id: c.id, name: c.employer_name })),
                        ...surveyList.map(c => ({ id: c.id, name: `${c.employer_name} (Survey)` }))
                    ];
                    // Remove duplicates by ID if any
                    const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                    setDbCompanies(unique);
                }
            }

            // 3. Fetch Institutions
            const { data: institutions, error: instError } = await supabase
                .from('district_training_centers')
                .select('id, training_center_name')
                .eq('district', 'Dakshina Kannada');

            if (instError) console.error('[CredentialManager] Error fetching institutions:', instError);

            if (institutions) {
                setDbInstitutions(institutions.map(i => ({ id: i.id, name: i.training_center_name })));
            }
        };
        fetchData();
        syncWithDatabase();
    }, []);

    // Filtered Entities based on Role
    const getEntities = () => {
        switch (selectedRole) {
            case 'institution':
                return dbInstitutions.length > 0 ? dbInstitutions : userInstitutions.map(i => ({ id: i.id, name: i.name }));
            case 'company':
                return dbCompanies.length > 0 ? dbCompanies : COMPANIES.map(c => ({ id: c.id, name: c.name }));
            case 'trainee':
                return dbInstitutions; // For Trainee, we select the Institution as the Linked Entity
            default:
                return [];
        }
    };

    const handleGenerate = async () => {
        if (selectedRole !== 'trainee' && !selectedEntityId) return;
        if (selectedRole === 'trainee' && (!traineeName || !selectedEntityId)) return;

        let entityName = '';
        let entityId = selectedEntityId;
        let linkedEntityId = undefined;

        if (selectedRole === 'trainee') {
            entityName = traineeName;
            entityId = crypto.randomUUID(); // Generate a random ID for the trainee
            linkedEntityId = selectedEntityId; // The selected entity IS the linked institution
        } else {
            const entity = getEntities().find(e => e.id === selectedEntityId);
            if (!entity) return;
            entityName = entity.name;
        }

        const cred = await generateCredential({
            role: selectedRole,
            entityId: entityId,
            entityName: entityName,
            linkedEntityId: linkedEntityId
        });
        setGeneratedCred(cred);

        // Ensure Master Sheet is synced immediately
        syncWithDatabase();
    };

    const handleExport = () => {
        const worksheet = (XLSX.utils as any).json_to_sheet(credentials.map(c => ({
            "Institution/Company Name": c.entityName,
            "Role": c.role,
            "Username": c.username,
            "Values (Password)": c.password,
            "Email": c.email || 'N/A',
            "Status": c.status,
            "Generated At": new Date(c.generatedAt).toLocaleDateString()
        })));
        const workbook = (XLSX.utils as any).book_new();
        (XLSX.utils as any).book_append_sheet(workbook, worksheet, "Credentials");
        XLSX.writeFile(workbook, "Master_Credential_Sheet.xlsx");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const [newDicEntry, setNewDicEntry] = useState({
        companyName: '',
        sector: '',
        contactPersonName: '',
        contactPersonEmail: '',
        districtId: 'Dakshina Kannada'
    });

    const handleAddDicEntry = async () => {
        if (!newDicEntry.companyName) return;

        const { data, error } = await supabase
            .from('dic_master_companies')
            .insert({
                employer_name: newDicEntry.companyName,
                sector: newDicEntry.sector,
                contact_person_name: newDicEntry.contactPersonName,
                contact_person_email: newDicEntry.contactPersonEmail,
                district_id: newDicEntry.districtId
            })
            .select();

        if (!error && data) {
            setDicEntries([data[0], ...dicEntries]);
            setShowDicForm(false);
            setNewDicEntry({
                companyName: '',
                sector: '',
                contactPersonName: '',
                contactPersonEmail: '',
                districtId: 'Dakshina Kannada'
            });
            // Update companies list for credential generation
            setDbCompanies([{ id: data[0].id, name: data[0].employer_name }, ...dbCompanies]);

            // AUTOMATIC CREDENTIAL GENERATION
            await generateCredential({
                role: 'company',
                entityId: data[0].id,
                entityName: data[0].employer_name,
                email: data[0].contact_person_email
            });

            alert("Company and Credentials added successfully!");
        } else if (error) {
            alert("Error adding company: " + error.message);
        }
    };

    const handleDicExport = () => {
        const worksheet = (XLSX.utils as any).json_to_sheet(dicEntries.map(e => ({
            "Company Name": e.employer_name,
            "Sector": e.sector,
            "Contact Person": e.contact_person_name,
            "Contact Email": e.contact_person_email,
            "District": e.district_id
        })));
        const workbook = (XLSX.utils as any).book_new();
        (XLSX.utils as any).book_append_sheet(workbook, worksheet, "DIC_Companies");
        XLSX.writeFile(workbook, "DIC_Master_Sheet.xlsx");
    };

    const handleDicImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet);

            const entriesToInsert = json.map(row => ({
                employer_name: row["Company Name"],
                sector: row["Sector"],
                contact_person_name: row["Contact Person"],
                contact_person_email: row["Contact Email"],
                district_id: row["District"] || 'Dakshina Kannada'
            }));

            const { error } = await supabase
                .from('dic_master_companies')
                .insert(entriesToInsert);

            if (error) {
                alert("Error importing data: " + error.message);
            } else {
                // AUTOMATIC CREDENTIAL GENERATION FOR ALL ENTRIES
                for (const entry of entriesToInsert) {
                    await generateCredential({
                        role: 'company',
                        entityId: `imported_${Math.random().toString(36).substring(7)}`,
                        entityName: entry.employer_name,
                        email: entry.contact_person_email
                    });
                }

                alert("Imported " + entriesToInsert.length + " companies and generated credentials successfully!");
                // Refresh data
                syncWithDatabase();
                window.location.reload();
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Key className="w-8 h-8 text-blue-600" />
                        Credential Manager
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Generate and manage access credentials for verified ecosystem partners.
                    </p>
                </div>
                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                        <p>{errorMsg}</p>
                    </div>
                )}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generate'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        Generate Credentials
                    </button>
                    <button
                        onClick={() => setActiveTab('master')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'master'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        Master Sheet
                    </button>
                    <button
                        onClick={() => setActiveTab('survey')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'survey'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        Survey Companies
                    </button>
                    <button
                        onClick={() => setActiveTab('dic')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dic'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        DIC Master Sheet
                    </button>
                </div>
            </div>

            {activeTab === 'generate' ? (
                <div className="space-y-6">
                    <CredentialSeeder />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    Create New Access
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Partner Type
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                onClick={() => { setSelectedRole('institution'); setSelectedEntityId(''); }}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedRole === 'institution'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                                    }`}
                                            >
                                                <Building2 className="w-4 h-4" />
                                                Institution
                                            </button>
                                            <button
                                                onClick={() => { setSelectedRole('company'); setSelectedEntityId(''); }}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedRole === 'company'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                                    }`}
                                            >
                                                <Briefcase className="w-4 h-4" />
                                                Company
                                            </button>
                                            <button
                                                onClick={() => { setSelectedRole('trainee'); setSelectedEntityId(''); setTraineeName(''); }}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedRole === 'trainee'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                                    }`}
                                            >
                                                <GraduationCap className="w-4 h-4" />
                                                Trainee
                                            </button>
                                        </div>
                                    </div>

                                    {selectedRole === 'trainee' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Trainee Name
                                            </label>
                                            <input
                                                type="text"
                                                value={traineeName}
                                                onChange={(e) => setTraineeName(e.target.value)}
                                                placeholder="Enter Trainee Name"
                                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {selectedRole === 'trainee' ? 'Assign Training Center' : 'Select Entity'}
                                        </label>
                                        <select
                                            value={selectedEntityId}
                                            onChange={(e) => setSelectedEntityId(e.target.value)}
                                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">{selectedRole === 'trainee' ? "Select Training Center..." : "Select an entity..."}</option>
                                            {getEntities().map(e => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleGenerate}
                                        disabled={selectedRole === 'trainee' ? (!traineeName || !selectedEntityId) : !selectedEntityId}
                                        className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Generate Credentials
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            {generatedCred ? (
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-16 -mb-16"></div>

                                    <div className="relative">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                                <User className="w-8 h-8 text-blue-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-slate-300">Generated For</h3>
                                                <p className="text-xl font-bold">{generatedCred.entityName}</p>
                                                {generatedCred.role === 'trainee' && (
                                                    <p className="text-sm text-slate-400 mt-1">Role: Trainee</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4 bg-black/20 p-6 rounded-xl backdrop-blur-sm border border-white/5">
                                            <div>
                                                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Username</label>
                                                <div className="flex items-center justify-between mt-1 group">
                                                    <code className="text-lg font-mono text-blue-300">{generatedCred.username}</code>
                                                    <button onClick={() => copyToClipboard(generatedCred.username)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="border-t border-white/10 pt-4">
                                                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Password</label>
                                                <div className="flex items-center justify-between mt-1 group">
                                                    <code className="text-lg font-mono text-green-300">{generatedCred.password}</code>
                                                    <button onClick={() => copyToClipboard(generatedCred.password)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-400 mt-4 text-center">
                                            Share these credentials securely. They will be visible in the Master Sheet.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12">
                                    <Key className="w-12 h-12 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No credentials generated yet</p>
                                    <p className="text-sm">Select an entity and generate access to see details here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'master' ? (
                    // ... (Master Sheet Logic - kept same)
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Export to Excel
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entity Name</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Password</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {credentials.map((cred) => (
                                        <tr key={cred.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900 dark:text-slate-200">{cred.entityName}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${cred.role === 'institution' ? 'bg-blue-100 text-blue-700' :
                                                    cred.role === 'company' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {cred.role}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-sm">{cred.username}</td>
                                            <td className="p-4 font-mono text-sm text-slate-500">
                                                <span className="blur-[2px] hover:blur-none transition-all cursor-pointer">{cred.password}</span>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                                {cred.email || '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-1.5 text-xs font-medium ${cred.status === 'active' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cred.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                                                        }`}></span>
                                                    {cred.status === 'active' ? 'Active' : 'Revoked'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {cred.status === 'active' && (
                                                    <button
                                                        onClick={() => revokeCredential(cred.id)}
                                                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {credentials.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                                No credentials generated yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                ) : activeTab === 'survey' ? (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Survey Companies (Aggregate Demand)</h3>
                                <p className="text-sm text-slate-500 mt-1">Companies added via Employer Survey form</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sector</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Contact</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {surveyEntries.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900 dark:text-slate-200">{entry.employer_name}</td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {entry.sector || 'Not specified'}
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{entry.contact_person_name || 'N/A'}</div>
                                                    <div className="text-xs text-slate-500">{entry.contact_person_email || 'No email provided'}</div>
                                                </td>
                                                <td className="p-4 text-xs text-slate-500">
                                                    {entry.district_id}
                                                </td>
                                            </tr>
                                        ))}
                                        {surveyEntries.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                                    No survey data found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'dic' ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDicForm(!showDicForm)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                                >
                                    <Users className="w-4 h-4" />
                                    {showDicForm ? 'Cancel' : 'Add Company'}
                                </button>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".xlsx, .csv"
                                                onChange={handleDicImport} // Fixed: Correctly referencing the handler
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-colors border border-slate-200 dark:border-slate-700">
                                                <FileSpreadsheet className="w-4 h-4" />
                                                Import CSV
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDicExport}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Export DIC Sheet
                                    </button>
                                </div>

                                {showDicForm && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 animate-in slide-in-from-top duration-300">
                                        <h3 className="font-semibold mb-4">Add Registered Company (DIC Entry)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <input
                                                placeholder="Company Name"
                                                className="p-2 rounded border dark:bg-slate-800 dark:border-slate-700"
                                                value={newDicEntry.companyName}
                                                onChange={e => setNewDicEntry({ ...newDicEntry, companyName: e.target.value })}
                                            />
                                            <input
                                                placeholder="Sector (e.g. Automotive)"
                                                className="p-2 rounded border dark:bg-slate-800 dark:border-slate-700"
                                                value={newDicEntry.sector}
                                                onChange={e => setNewDicEntry({ ...newDicEntry, sector: e.target.value })}
                                            />
                                            <input
                                                placeholder="Contact Person Name"
                                                className="p-2 rounded border dark:bg-slate-800 dark:border-slate-700"
                                                value={newDicEntry.contactPersonName}
                                                onChange={e => setNewDicEntry({ ...newDicEntry, contactPersonName: e.target.value })}
                                            />
                                            <input
                                                placeholder="Contact Email"
                                                className="p-2 rounded border dark:bg-slate-800 dark:border-slate-700"
                                                value={newDicEntry.contactPersonEmail}
                                                onChange={e => setNewDicEntry({ ...newDicEntry, contactPersonEmail: e.target.value })}
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={handleAddDicEntry}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Save Entry
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sector</th>
                                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Contact</th>
                                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {dicEntries.map((entry) => (
                                                    <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="p-4 font-medium text-slate-900 dark:text-slate-200">{entry.employer_name}</td>
                                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                                            {entry.sector || 'Not specified'}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{entry.contact_person_name || 'N/A'}</div>
                                                            <div className="text-xs text-slate-500">{entry.contact_person_email || 'No email provided'}</div>
                                                        </td>
                                                        <td className="p-4 text-xs text-slate-500">
                                                            {entry.district_id}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {dicEntries.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                                            No companies found in the employer survey or DIC sheet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                </div >

            ) : null
            }
        </div>
    );
};

export default CredentialManager;
