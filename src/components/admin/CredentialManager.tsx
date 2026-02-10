import React, { useState, useEffect } from 'react';
import { useCredentialStore, type UserRole } from '../../store/useCredentialStore';
import { userInstitutions } from '../../data/user_institutions';
import { COMPANIES } from '../../data/companies';
import { Copy, RefreshCw, Key, Shield, User, FileSpreadsheet, Building2, Briefcase, GraduationCap } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import * as XLSX from 'xlsx';
import { CredentialSeeder } from './CredentialSeeder';


const CredentialManager: React.FC = () => {
    const { credentials, generateCredential, revokeCredential, syncWithDatabase } = useCredentialStore();
    const [activeTab, setActiveTab] = useState<'generate' | 'master'>('generate');

    // Generation State
    const [selectedRole, setSelectedRole] = useState<UserRole>('institution');
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    const [traineeName, setTraineeName] = useState<string>('');
    const [generatedCred, setGeneratedCred] = useState<any>(null);
    const [dbCompanies, setDbCompanies] = useState<any[]>([]);
    const [dbInstitutions, setDbInstitutions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('[CredentialManager] Fetching data...');

            // Fetch Companies
            const { data: companies, error: companyError } = await supabase
                .from('ad_survey_employer')
                .select('id, employer_name')
                .eq('district_id', 'Dakshina Kannada');

            console.log('[CredentialManager] Companies:', companies, 'Error:', companyError);

            if (companies) {
                setDbCompanies(companies.map(c => ({ id: c.id, name: c.employer_name })));
            }

            // Fetch Institutions
            const { data: institutions, error: instError } = await supabase
                .from('district_training_centers')
                .select('id, training_center_name')
                .eq('district', 'Dakshina Kannada');

            console.log('[CredentialManager] Institutions:', institutions, 'Error:', instError);

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

    const handleGenerate = () => {
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

        const cred = generateCredential({
            role: selectedRole,
            entityId: entityId,
            entityName: entityName,
            linkedEntityId: linkedEntityId
        });
        setGeneratedCred(cred);
    };

    const handleExport = () => {
        const worksheet = (XLSX.utils as any).json_to_sheet(credentials.map(c => ({
            "Institution/Company Name": c.entityName,
            "Role": c.role,
            "Username": c.username,
            "Values (Password)": c.password,
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
                                                <Building2 className="w-4 h-4" /> Institution
                                            </button>
                                            <button
                                                onClick={() => { setSelectedRole('company'); setSelectedEntityId(''); }}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedRole === 'company'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                                    }`}
                                            >
                                                <Briefcase className="w-4 h-4" /> Company
                                            </button>
                                            <button
                                                onClick={() => { setSelectedRole('trainee'); setSelectedEntityId(''); setTraineeName(''); }}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${selectedRole === 'trainee'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                                    }`}
                                            >
                                                <GraduationCap className="w-4 h-4" /> Trainee
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
            ) : (
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
            )}
        </div>
    );
};

export default CredentialManager;
