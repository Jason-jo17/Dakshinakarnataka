
import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import Papa from 'papaparse';

interface QPNOSData {
    id?: string;
    course_name: string;
    total_duration_hours: number;
}

interface QPNOSDurationManagerProps {
    onBack: () => void;
}

export const QPNOSDurationManager: React.FC<QPNOSDurationManagerProps> = ({ onBack }) => {
    const [data, setData] = useState<QPNOSData[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [newEntry, setNewEntry] = useState<Omit<QPNOSData, 'id'>>({ course_name: '', total_duration_hours: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: fetchedData, error } = await supabase
                .from('qp_nos_duration')
                .select('*')
                .order('course_name', { ascending: true });

            if (error) throw error;

            if (fetchedData) {
                setData(fetchedData.map((d: any) => ({
                    id: d.id,
                    course_name: d.course_name,
                    total_duration_hours: Number(d.total_duration_hours)
                })));
            }
        } catch (err: any) {
            console.error('Error fetching QP NOS data:', err);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = () => {
        if (!newEntry.course_name.trim()) {
            setMessage({ type: 'error', text: 'Course Name is required.' });
            return;
        }
        setData([...data, { ...newEntry }]);
        setNewEntry({ course_name: '', total_duration_hours: 0 });
    };

    const handleDeleteRow = async (index: number) => {
        const row = data[index];
        if (row.id) {
            const { error } = await supabase.from('qp_nos_duration').delete().eq('id', row.id);
            if (error) {
                setMessage({ type: 'error', text: 'Failed to delete row.' });
                return;
            }
        }
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const handleInputChange = (index: number, field: keyof QPNOSData, value: string | number) => {
        const newData = [...data];
        (newData[index] as any)[field] = value;
        setData(newData);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const payload = data.map(d => ({
                id: d.id,
                course_name: d.course_name,
                total_duration_hours: d.total_duration_hours
            }));
            const { error } = await supabase.from('qp_nos_duration').upsert(payload, { onConflict: 'course_name' }).select();
            if (error) throw error;
            setMessage({ type: 'success', text: 'Data saved successfully!' });
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to save data. ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleExportCSV = () => {
        const csv = Papa.unparse(data.map((d, i) => ({
            'S.No': i + 1,
            'Course/QP NOS': d.course_name,
            'Total Duration (Hrs)': d.total_duration_hours
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'qp_nos_durations.csv');
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
                    course_name: row['Course/QP NOS'] || '',
                    total_duration_hours: Number(row['Total Duration (Hrs)']) || 0
                })).filter((d: any) => d.course_name);
                setData(prev => [...prev, ...imported]);
                setMessage({ type: 'success', text: `Imported ${imported.length} rows.` });
            },
            error: () => setMessage({ type: 'error', text: 'Failed to parse CSV.' })
        });
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">QP NOS Duration Reference</h3>
                    <p className="text-sm text-gray-500">Manage standardized durations for courses.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer">
                        <Upload className="w-4 h-4" /> Import <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                    </label>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / QP NOS Name</label>
                    <input type="text" value={newEntry.course_name} onChange={e => setNewEntry({ ...newEntry, course_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Java Full Stack" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Duration (Hours)</label>
                    <div className="flex gap-2">
                        <input type="number" value={newEntry.total_duration_hours} onChange={e => setNewEntry({ ...newEntry, total_duration_hours: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                        <button onClick={handleAddEntry} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}


            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-12">S.No</th>
                                <th className="px-4 py-3">Course / QP NOS</th>
                                <th className="px-4 py-3">Duration (Hours)</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                    <td className="px-2 py-2"><input type="text" className="w-full px-2 py-1 bg-transparent focus:bg-white focus:ring-1 hover:bg-gray-100 rounded" value={row.course_name} onChange={(e) => handleInputChange(idx, 'course_name', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input type="number" className="w-full px-2 py-1 bg-transparent focus:bg-white focus:ring-1 hover:bg-gray-100 rounded" value={row.total_duration_hours} onChange={(e) => handleInputChange(idx, 'total_duration_hours', Number(e.target.value))} /></td>
                                    <td className="px-2 py-2">
                                        <button onClick={() => handleDeleteRow(idx)} className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No data available</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
