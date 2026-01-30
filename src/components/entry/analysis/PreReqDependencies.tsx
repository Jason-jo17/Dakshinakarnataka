import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, Database, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import Papa from 'papaparse';

interface CcnDependencyData {
    id?: string;
    category: string;
    cost_per_hour: number;
    valid_from: string; // Date string YYYY-MM-DD
}

interface PreReqDependenciesProps {
    onBack: () => void;
}

export const PreReqDependencies: React.FC<PreReqDependenciesProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'ccn'>('ccn');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Analysis Menu
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 flex overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('ccn')}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ccn'
                            ? 'border-blue-500 text-blue-600 bg-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Database className="w-4 h-4" />
                        CCN Cost Categories
                    </button>
                    {/* Add more tabs here in future */}
                </div>

                <div className="p-6">
                    {activeTab === 'ccn' && <CcnDependencyManager />}
                </div>
            </div>
        </div>
    );
};

const CcnDependencyManager: React.FC = () => {
    const [data, setData] = useState<CcnDependencyData[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // New Entry State
    const [newEntry, setNewEntry] = useState<Omit<CcnDependencyData, 'id'>>({
        category: '',
        cost_per_hour: 0,
        valid_from: new Date().toISOString().split('T')[0] // Default to today
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: fetchedData, error } = await supabase
                .from('ccn_dependency')
                .select('*')
                .order('category', { ascending: true });

            if (error) throw error;

            if (fetchedData) {
                setData(fetchedData.map((d: any) => ({
                    id: d.id,
                    category: d.category,
                    cost_per_hour: Number(d.cost_per_hour),
                    valid_from: d.valid_from
                })));
            }
        } catch (err: any) {
            console.error('Error fetching CCN data:', err);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = () => {
        if (!newEntry.category.trim()) {
            setMessage({ type: 'error', text: 'Category is required.' });
            return;
        }

        setData([...data, { ...newEntry }]);
        setNewEntry({
            category: '',
            cost_per_hour: 0,
            valid_from: new Date().toISOString().split('T')[0]
        });
    };

    const handleDeleteRow = async (index: number) => {
        const row = data[index];
        if (row.id) {
            const { error } = await supabase
                .from('ccn_dependency')
                .delete()
                .eq('id', row.id);

            if (error) {
                console.error('Error deleting:', error);
                setMessage({ type: 'error', text: 'Failed to delete row.' });
                return;
            }
        }

        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const handleInputChange = (index: number, field: keyof CcnDependencyData, value: string | number) => {
        const newData = [...data];
        (newData[index] as any)[field] = value;
        setData(newData);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // Filter out rows that might be empty or invalid if strict validation needed
            const payload = data.map(d => ({
                id: d.id, // Include ID for upserting existing rows if Supabase supports it, else we might need separate logic
                category: d.category,
                cost_per_hour: d.cost_per_hour,
                valid_from: d.valid_from
            }));

            // Using upsert. Note: conflict resolution requires a unique constraint. 
            // If 'id' is present, it updates. If not, it inserts.
            const { error } = await supabase
                .from('ccn_dependency')
                .upsert(payload)
                .select();

            if (error) throw error;

            setMessage({ type: 'success', text: 'Data saved successfully!' });
            fetchData(); // Refresh to get new IDs
        } catch (err: any) {
            console.error('Error saving:', err);
            setMessage({ type: 'error', text: 'Failed to save data. ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleExportCSV = () => {
        const csv = Papa.unparse(data.map((d, i) => ({
            'S.No': i + 1,
            'Category': d.category,
            'Cost per hr INR': d.cost_per_hour,
            'Valid From': d.valid_from
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'ccn_dependency_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const imported = results.data.map((row: any) => ({
                    category: row['Category'] || '',
                    cost_per_hour: Number(row['Cost per hr INR']) || 0,
                    valid_from: row['Valid From'] || new Date().toISOString().split('T')[0]
                })).filter((d: any) => d.category); // Simple validation

                setData(prev => [...prev, ...imported]);
                setMessage({ type: 'success', text: `Imported ${imported.length} rows.` });
            },
            error: () => setMessage({ type: 'error', text: 'Failed to parse CSV.' })
        });
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">CCN Cost Category Reference</h3>
                    <p className="text-sm text-gray-500">Manage cost categories and rates for analysis.</p>
                </div>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        Import
                        <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                    </label>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Add Form */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                    <input
                        type="text"
                        value={newEntry.category}
                        onChange={e => setNewEntry({ ...newEntry, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Category I"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cost per hr INR</label>
                    <input
                        type="number"
                        value={newEntry.cost_per_hour}
                        onChange={e => setNewEntry({ ...newEntry, cost_per_hour: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Valid From</label>
                    <input
                        type="date"
                        value={newEntry.valid_from}
                        onChange={e => setNewEntry({ ...newEntry, valid_from: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <button
                    onClick={handleAddEntry}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-12">S.No</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Cost per hr INR</th>
                                <th className="px-4 py-3">Valid From</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No data available</td></tr>
                            ) : (
                                data.map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 bg-transparent focus:bg-white focus:ring-1 hover:bg-gray-100 rounded"
                                                value={row.category}
                                                onChange={(e) => handleInputChange(idx, 'category', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="number"
                                                className="w-full px-2 py-1 bg-transparent focus:bg-white focus:ring-1 hover:bg-gray-100 rounded"
                                                value={row.cost_per_hour}
                                                onChange={(e) => handleInputChange(idx, 'cost_per_hour', Number(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input
                                                type="date"
                                                className="w-full px-2 py-1 bg-transparent focus:bg-white focus:ring-1 hover:bg-gray-100 rounded"
                                                value={row.valid_from}
                                                onChange={(e) => handleInputChange(idx, 'valid_from', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <button
                                                onClick={() => handleDeleteRow(idx)}
                                                className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
