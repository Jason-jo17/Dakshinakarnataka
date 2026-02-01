import React, { useState, useEffect } from 'react';
import { Download, Upload, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface AgriYieldData {
    id?: string;
    crop_name: string;
    area_hectares: number;
    production_tonnes: number;
    district_yield: number;
    state_max_yield: number;
    india_max_yield: number;
    yield_gap_state: number;
    yield_gap_india: number;
    people_involved: number | null;
    remarks: string;
}

export const AgriYieldAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<AgriYieldData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<AgriYieldData | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [newRow, setNewRow] = useState<AgriYieldData>({
        crop_name: '',
        area_hectares: 0,
        production_tonnes: 0,
        district_yield: 0,
        state_max_yield: 0,
        india_max_yield: 0,
        yield_gap_state: 0,
        yield_gap_india: 0,
        people_involved: null,
        remarks: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) {
            fetchData();
        }
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('agri_yield_analysis')
                .select('*')
                .eq('district_id', currentDistrict)
                .order('area_hectares', { ascending: false });

            if (error) throw error;
            setRows(data || []);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const calculateGaps = (row: AgriYieldData) => {
        const districtYield = row.area_hectares > 0 ? (row.production_tonnes / row.area_hectares) : row.district_yield;
        const gapState = Math.max(0, row.state_max_yield - districtYield);
        const gapIndia = Math.max(0, row.india_max_yield - districtYield);
        return {
            ...row,
            district_yield: Number(districtYield.toFixed(2)),
            yield_gap_state: Number(gapState.toFixed(2)),
            yield_gap_india: Number(gapIndia.toFixed(2))
        };
    };

    const handleSaveNew = async () => {
        if (!newRow.crop_name) return;
        setLoading(true);
        try {
            const rowToSave = calculateGaps(newRow);
            const { error } = await supabase
                .from('agri_yield_analysis')
                .insert([{ ...rowToSave, district_id: currentDistrict }]);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Saved successfully' });
            setIsAddMode(false);
            setNewRow({
                crop_name: '',
                area_hectares: 0,
                production_tonnes: 0,
                district_yield: 0,
                state_max_yield: 0,
                india_max_yield: 0,
                yield_gap_state: 0,
                yield_gap_india: 0,
                people_involved: null,
                remarks: ''
            });
            fetchData();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editForm || !editingId) return;
        setLoading(true);
        try {
            const rowToUpdate = calculateGaps(editForm);
            const { error } = await supabase
                .from('agri_yield_analysis')
                .update(rowToUpdate)
                .eq('id', editingId);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Updated successfully' });
            setEditingId(null);
            setEditForm(null);
            fetchData();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('agri_yield_analysis')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Deleted successfully' });
            fetchData();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const importedData = results.data.map((row: any) => ({
                    crop_name: row['Crop'],
                    area_hectares: Number(row['Crop Area District (Hectare)']) || 0,
                    production_tonnes: Number(row['District Crop Production (Tonnes)']) || 0,
                    district_yield: Number(row['Yield (Tonnes/ Hectare)']) || 0,
                    state_max_yield: Number(row['State Max Yield']) || 0,
                    india_max_yield: Number(row['India Max Yield']) || 0,
                    yield_gap_state: 0,
                    yield_gap_india: 0,
                    people_involved: row['Number of People involved'] ? Number(row['Number of People involved']) : null,
                    remarks: row['Remarks'] || '',
                    district_id: currentDistrict
                })).map(calculateGaps);

                try {
                    const { error } = await supabase
                        .from('agri_yield_analysis')
                        .insert(importedData);
                    if (error) throw error;
                    setMessage({ type: 'success', text: 'CSV Imported successfully' });
                    fetchData();
                } catch (error: any) {
                    setMessage({ type: 'error', text: error.message });
                }
            }
        });
    };

    const handleExportCSV = () => {
        const csvData = rows.map(r => ({
            'Crop': r.crop_name,
            'Crop Area District (Hectare)': r.area_hectares,
            'District Crop Production (Tonnes)': r.production_tonnes,
            'Yield (Tonnes/ Hectare)': r.district_yield,
            'State Max Yield': r.state_max_yield,
            'India Max Yield': r.india_max_yield,
            'Yield Gap State': r.yield_gap_state,
            'Yeild Gap wrt India': r.yield_gap_india,
            'Number of People involved': r.people_involved,
            'Remarks': r.remarks
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'agri_yield_analysis.csv';
        link.click();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Agri Yield Analysis</h2>
                    <p className="text-sm text-gray-500">Manage crop productivity and yield gaps</p>
                </div>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload size={18} />
                        <span className="text-sm font-medium">Import CSV</span>
                        <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                    </label>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download size={18} />
                        <span className="text-sm font-medium">Export CSV</span>
                    </button>
                    <button
                        onClick={() => setIsAddMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} />
                        <span className="text-sm font-medium">Add Crop</span>
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-lg flex justify-between items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)}><X size={18} /></button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-y border-gray-200">
                            <th className="p-3 font-semibold text-gray-700">Crop</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">Area (Ha)</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">Production (T)</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">Dist. Yield</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">State Max</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">India Max</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">Gap (State)</th>
                            <th className="p-3 font-semibold text-gray-700 text-right">Gap (India)</th>
                            <th className="p-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAddMode && (
                            <tr className="border-b border-gray-100 bg-blue-50/30">
                                <td className="p-2"><input type="text" className="w-full p-1 border rounded" value={newRow.crop_name} onChange={e => setNewRow({ ...newRow, crop_name: e.target.value })} placeholder="Crop Name" /></td>
                                <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={newRow.area_hectares} onChange={e => setNewRow({ ...newRow, area_hectares: Number(e.target.value) })} /></td>
                                <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={newRow.production_tonnes} onChange={e => setNewRow({ ...newRow, production_tonnes: Number(e.target.value) })} /></td>
                                <td className="p-2 text-right text-gray-400 font-mono italic">Auto</td>
                                <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={newRow.state_max_yield} onChange={e => setNewRow({ ...newRow, state_max_yield: Number(e.target.value) })} /></td>
                                <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={newRow.india_max_yield} onChange={e => setNewRow({ ...newRow, india_max_yield: Number(e.target.value) })} /></td>
                                <td className="p-2 text-right text-gray-400 font-mono italic">Auto</td>
                                <td className="p-2 text-right text-gray-400 font-mono italic">Auto</td>
                                <td className="p-2">
                                    <div className="flex gap-1 justify-center">
                                        <button onClick={handleSaveNew} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check size={18} /></button>
                                        <button onClick={() => setIsAddMode(false)} className="p-1 text-red-600 hover:bg-red-100 rounded"><X size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {rows.map((row) => (
                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                {editingId === row.id ? (
                                    <>
                                        <td className="p-2"><input type="text" className="w-full p-1 border rounded" value={editForm?.crop_name} onChange={e => setEditForm({ ...editForm!, crop_name: e.target.value })} /></td>
                                        <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={editForm?.area_hectares} onChange={e => setEditForm({ ...editForm!, area_hectares: Number(e.target.value) })} /></td>
                                        <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={editForm?.production_tonnes} onChange={e => setEditForm({ ...editForm!, production_tonnes: Number(e.target.value) })} /></td>
                                        <td className="p-2 text-right text-gray-400 font-mono italic">Auto</td>
                                        <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={editForm?.state_max_yield} onChange={e => setEditForm({ ...editForm!, state_max_yield: Number(e.target.value) })} /></td>
                                        <td className="p-2"><input type="number" className="w-full p-1 border rounded text-right" value={editForm?.india_max_yield} onChange={e => setEditForm({ ...editForm!, india_max_yield: Number(e.target.value) })} /></td>
                                        <td className="p-2 text-right text-gray-400 font-mono italic">Auto</td>
                                        <td className="p-2 text-right text-gray-400 font-mono italic">Auto</td>
                                        <td className="p-2">
                                            <div className="flex gap-1 justify-center">
                                                <button onClick={handleUpdate} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check size={18} /></button>
                                                <button onClick={() => { setEditingId(null); setEditForm(null); }} className="p-1 text-red-600 hover:bg-red-100 rounded"><X size={18} /></button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3 font-medium text-gray-900">{row.crop_name}</td>
                                        <td className="p-3 text-right">{row.area_hectares.toLocaleString()}</td>
                                        <td className="p-3 text-right">{row.production_tonnes.toLocaleString()}</td>
                                        <td className="p-3 text-right font-mono bg-blue-50/30">{row.district_yield}</td>
                                        <td className="p-3 text-right">{row.state_max_yield}</td>
                                        <td className="p-3 text-right">{row.india_max_yield}</td>
                                        <td className="p-3 text-right font-bold text-orange-600">{row.yield_gap_state}</td>
                                        <td className="p-3 text-right font-bold text-red-600">{row.yield_gap_india}</td>
                                        <td className="p-3">
                                            <div className="flex gap-1 justify-center">
                                                <button
                                                    onClick={() => { setEditingId(row.id!); setEditForm(row); }}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row.id!)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {rows.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No data found for this district. Add a crop or import a CSV to get started.
                </div>
            )}
        </div>
    );
};
