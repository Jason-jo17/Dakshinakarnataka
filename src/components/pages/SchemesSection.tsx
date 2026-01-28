import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, Download, Upload, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { SECTORS, getTradesForSector } from '../../data/sectors';
import { useAuthStore } from '../../store/useAuthStore';

interface Scheme {
    id: string;
    sno: number;
    scheme_name: string;
    scheme_url: string;
    affiliated_centers: string;
    sector: string;
    trade: string;
    annual_intake: number;
    center_contact_person: string;
    center_contact_phone: string;
    district_contact_person: string;
    district_contact_phone: string;
    funding_source: string;
    remarks: string;
    is_active: boolean;
}

interface SchemesSectionProps {
    onBack: () => void;
}

export default function SchemesSection({ onBack }: SchemesSectionProps) {
    const { currentDistrict } = useAuthStore();
    const [schemes, setSchemes] = useState<Scheme[]>([]);

    const [isEditing, setIsEditing] = useState<string | null>(null); // ID of scheme being edited
    const [isFormOpen, setIsFormOpen] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Form State
    const initialFormState = {
        scheme_name: '',
        scheme_url: '',
        affiliated_centers: '',
        sector: '',
        trade: '',
        annual_intake: '',
        center_contact_person: '',
        center_contact_phone: '',
        district_contact_person: '',
        district_contact_phone: '',
        funding_source: 'Central',
        remarks: '',
        is_active: true
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (currentDistrict) {
            fetchSchemes();
        }
    }, [currentDistrict]);

    const fetchSchemes = async () => {
        try {
            const { data, error } = await supabase
                .from('district_schemes')
                .select('*')
                .eq('district_name', currentDistrict)
                .order('sno', { ascending: true });

            if (error) throw error;
            setSchemes(data || []);
        } catch (error) {
            console.error('Error fetching schemes:', error);
        }
    };

    const handleSave = async () => {
        if (!currentDistrict) return;
        if (!formData.scheme_name || !formData.sector || !formData.trade) {
            alert('Please fill required fields: Name, Sector, Trade');
            return;
        }

        try {
            const payload = {
                ...formData,
                annual_intake: parseInt(formData.annual_intake) || 0,
                district_name: currentDistrict,
                // For new items, SNO is manually calculated if not provided
                sno: isEditing ? schemes.find(s => s.id === isEditing)?.sno : schemes.length + 1
            };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('district_schemes')
                    .update(payload)
                    .eq('id', isEditing);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('district_schemes')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            await fetchSchemes();
            resetForm();
        } catch (error: any) {
            console.error('Error saving scheme:', error);
            alert('Error saving scheme: ' + error.message);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Delete this scheme?')) return;

        try {
            const { error } = await supabase.from('district_schemes').delete().eq('id', id);
            if (error) throw error;
            fetchSchemes();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleDownloadCSV = () => {
        const headers = [
            'S.No', 'Scheme Name', 'Scheme URL', 'Affiliated Centers',
            'Sector', 'Trade', 'Annual Intake', 'Funding Source', 'Status',
            'Center Contact Name', 'Center Contact Phone',
            'District Contact Name', 'District Contact Phone', 'Remarks'
        ];

        const csvContent = [
            headers.join(','),
            ...schemes.map(s => [
                s.sno,
                `"${s.scheme_name.replace(/"/g, '""')}"`,
                `"${(s.scheme_url || '').replace(/"/g, '""')}"`,
                `"${(s.affiliated_centers || '').replace(/"/g, '""')}"`,
                `"${s.sector}"`,
                `"${s.trade}"`,
                s.annual_intake || 0,
                s.funding_source,
                s.is_active ? 'Active' : 'Inactive',
                `"${(s.center_contact_person || '').replace(/"/g, '""')}"`,
                `"${(s.center_contact_phone || '').replace(/"/g, '""')}"`,
                `"${(s.district_contact_person || '').replace(/"/g, '""')}"`,
                `"${(s.district_contact_phone || '').replace(/"/g, '""')}"`,
                `"${(s.remarks || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentDistrict}_Schemes.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentDistrict) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const newSchemesPayload = [];

                // Get current max S.NO to increment from
                const currentMaxSno = schemes.length > 0 ? Math.max(...schemes.map(s => s.sno)) : 0;
                let nextSno = currentMaxSno + 1;

                // Skip header (i=1)
                for (let i = 1; i < lines.length; i++) {
                    // Simple CSV parser for quoted strings
                    // Matches: "quoted value" OR value,

                    // Actually, a simpler split usually works for simple CSVs, but let's try a regex for quoted fields
                    // Or simpler: just split by comma if we assume standard format. 
                    // Let's use a slightly more robust regex split or just naive split for now.
                    // Naive split with basic quote handling:

                    const line = lines[i].trim();
                    if (!line) continue;

                    // Helper to split CSV line respecting quotes
                    const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
                    const cols = matches || line.split(',');

                    // Clean quotes
                    const clean = (val: string | undefined) => val ? val.trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';

                    // Map columns based on our download format
                    // 0: SNo (Ignore), 1: Name, 2: Url, 3: Centers, 4: Sector, 5: Trade...
                    if (cols && cols.length >= 6) {
                        newSchemesPayload.push({
                            district_name: currentDistrict,
                            sno: nextSno++,
                            scheme_name: clean(cols[1]), // Name *
                            scheme_url: clean(cols[2]),
                            affiliated_centers: clean(cols[3]),
                            sector: clean(cols[4]), // Sector *
                            trade: clean(cols[5]), // Trade *
                            annual_intake: parseInt(clean(cols[6])) || 0,
                            funding_source: clean(cols[7]) || 'Central',
                            is_active: clean(cols[8])?.toLowerCase() === 'inactive' ? false : true,
                            center_contact_person: clean(cols[9]),
                            center_contact_phone: clean(cols[10]),
                            district_contact_person: clean(cols[11]),
                            district_contact_phone: clean(cols[12]),
                            remarks: clean(cols[13])
                        });
                    }
                }

                if (newSchemesPayload.length > 0) {
                    const { error } = await supabase
                        .from('district_schemes')
                        .insert(newSchemesPayload);

                    if (error) throw error;

                    alert(`Successfully imported ${newSchemesPayload.length} schemes.`);
                    fetchSchemes();
                }
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Error uploading CSV: ' + error.message);
            } finally {
                // Loading finished
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    // ... rest of logic ... (Edit, Reset, Toggle)

    const handleEdit = (scheme: Scheme) => {
        setIsEditing(scheme.id);
        setFormData({
            scheme_name: scheme.scheme_name,
            scheme_url: scheme.scheme_url || '',
            affiliated_centers: scheme.affiliated_centers || '',
            sector: scheme.sector,
            trade: scheme.trade,
            annual_intake: scheme.annual_intake?.toString() || '',
            center_contact_person: scheme.center_contact_person || '',
            center_contact_phone: scheme.center_contact_phone || '',
            district_contact_person: scheme.district_contact_person || '',
            district_contact_phone: scheme.district_contact_phone || '',
            funding_source: scheme.funding_source || 'Central',
            remarks: scheme.remarks || '',
            is_active: scheme.is_active
        });
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(null);
        setIsFormOpen(false);
    };

    const handleToggleStatus = async (scheme: Scheme, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await supabase
                .from('district_schemes')
                .update({ is_active: !scheme.is_active })
                .eq('id', scheme.id);
            fetchSchemes();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            District Schemes
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleUploadCSV}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            title="Upload CSV"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="hidden md:inline">Import</span>
                        </button>
                        <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            title="Download CSV"
                        >
                            <Download className="w-5 h-5" />
                            <span className="hidden md:inline">Export</span>
                        </button>

                        {!isFormOpen && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Scheme
                            </button>
                        )}
                    </div>
                </div>

                {/* Form */}
                {isFormOpen && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                                {isEditing ? 'Edit Scheme' : 'Add New Scheme'}
                            </h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Row 1 */}
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Scheme Name *</label>
                                <input
                                    type="text"
                                    value={formData.scheme_name}
                                    onChange={e => setFormData({ ...formData, scheme_name: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    placeholder="e.g. PMKVY"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Scheme URL</label>
                                <input
                                    type="text"
                                    value={formData.scheme_url}
                                    onChange={e => setFormData({ ...formData, scheme_url: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Row 2 */}
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Affiliated Centers</label>
                                <input
                                    type="text"
                                    value={formData.affiliated_centers}
                                    onChange={e => setFormData({ ...formData, affiliated_centers: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    placeholder="Names of centers..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Annual Intake</label>
                                <input
                                    type="number"
                                    value={formData.annual_intake}
                                    onChange={e => setFormData({ ...formData, annual_intake: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                />
                            </div>

                            {/* Row 3 - Dropdowns */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Sector *</label>
                                <select
                                    value={formData.sector}
                                    onChange={e => setFormData({ ...formData, sector: e.target.value, trade: '' })} // Reset trade on sector change
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                >
                                    <option value="">Select Sector</option>
                                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Trade/Occupation *</label>
                                <select
                                    value={formData.trade}
                                    onChange={e => setFormData({ ...formData, trade: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    disabled={!formData.sector}
                                >
                                    <option value="">Select Trade</option>
                                    {formData.sector && getTradesForSector(formData.sector).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Funding Source</label>
                                <select
                                    value={formData.funding_source}
                                    onChange={e => setFormData({ ...formData, funding_source: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                >
                                    <option value="Central">Central</option>
                                    <option value="State">State</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>

                            {/* Row 4 - Contacts */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Center Contact Name</label>
                                <input
                                    type="text"
                                    value={formData.center_contact_person}
                                    onChange={e => setFormData({ ...formData, center_contact_person: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Center Phone</label>
                                <input
                                    type="text"
                                    value={formData.center_contact_phone}
                                    onChange={e => setFormData({ ...formData, center_contact_phone: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Active Status</label>
                                <div
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className="flex items-center gap-2 cursor-pointer mt-2"
                                >
                                    {formData.is_active ?
                                        <ToggleRight className="w-8 h-8 text-green-500" /> :
                                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                                    }
                                    <span className="text-sm font-medium">{formData.is_active ? 'Open to Public' : 'Hidden'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">District Contact Name</label>
                                <input
                                    type="text"
                                    value={formData.district_contact_person}
                                    onChange={e => setFormData({ ...formData, district_contact_person: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">District Phone</label>
                                <input
                                    type="text"
                                    value={formData.district_contact_phone}
                                    onChange={e => setFormData({ ...formData, district_contact_phone: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Remarks</label>
                                <textarea
                                    value={formData.remarks}
                                    onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                    rows={2}
                                />
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Scheme
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3 w-16 text-center">S.No</th>
                                <th className="p-3">Scheme Name</th>
                                <th className="p-3">Affiliated Centers</th>
                                <th className="p-3">Sector</th>
                                <th className="p-3">Trade</th>
                                <th className="p-3">Intake</th>
                                <th className="p-3">Funding</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 w-24 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {schemes.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-slate-500">
                                        No schemes added yet. Click "Add Scheme" to begin.
                                    </td>
                                </tr>
                            ) : (
                                schemes.map((scheme) => (
                                    <tr key={scheme.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 text-center text-slate-500">{scheme.sno}</td>
                                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                                            <div className="flex flex-col">
                                                <span>{scheme.scheme_name}</span>
                                                {scheme.scheme_url && (
                                                    <a href={scheme.scheme_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                        View Link <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{scheme.affiliated_centers}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{scheme.sector}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{scheme.trade}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{scheme.annual_intake}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                                                {scheme.funding_source}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={(e) => handleToggleStatus(scheme, e)}>
                                                {scheme.is_active ?
                                                    <ToggleRight className="w-6 h-6 text-green-500 mx-auto" /> :
                                                    <ToggleLeft className="w-6 h-6 text-slate-300 mx-auto" />
                                                }
                                            </button>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(scheme)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(scheme.id, e)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
