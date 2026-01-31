import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface TownRow {
    id?: string;
    town_name: string;
    population: string;
    urban_body_type: string;
}

export const MajorTowns: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<TownRow[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('scenario_towns')
                .select('*')
                .eq('district_id', currentDistrict)
                .order('created_at', { ascending: true });

            if (data && data.length > 0) {
                setRows(data);
            } else {
                setRows(Array(7).fill(null).map(() => ({ town_name: '', population: '', urban_body_type: '' })));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const rowsToSave = rows.map(r => ({
                id: r.id,
                district_id: currentDistrict,
                town_name: r.town_name,
                population: r.population,
                urban_body_type: r.urban_body_type,
                updated_at: new Date()
            })).filter(r => r.town_name.trim() !== ''); // Only save rows with names

            if (rowsToSave.length === 0) {
                setMessage({ type: 'error', text: 'Please enter at least one town name.' });
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from('scenario_towns')
                .upsert(rowsToSave, { onConflict: 'district_id, town_name' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Towns saved successfully!' });
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof TownRow, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const addNewRow = () => {
        setRows([...rows, { town_name: '', population: '', urban_body_type: '' }]);
    };

    const deleteRow = async (index: number) => {
        const row = rows[index];
        if (row.id) {
            await supabase.from('scenario_towns').delete().eq('id', row.id);
        }
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: (results) => {
                const data = results.data as any[];
                if (!data) return;

                const newRows = [...rows];
                data.forEach((row: any) => {
                    const name = row['Name'] || row['town_name'];
                    if (!name) return;

                    const index = newRows.findIndex(r => r.town_name === name);
                    if (index !== -1) {
                        newRows[index] = {
                            ...newRows[index],
                            population: row['Population']?.toString() || '',
                            urban_body_type: row['Urban Body (Municipality/ City Board/ Cantonment Board etc)']?.toString() || ''
                        };
                    } else {
                        newRows.push({
                            town_name: name,
                            population: row['Population']?.toString() || '',
                            urban_body_type: row['Urban Body (Municipality/ City Board/ Cantonment Board etc)']?.toString() || ''
                        });
                    }
                });
                setRows(newRows);
                setMessage({ type: 'success', text: 'CSV imported! Click Save.' });
            },
            header: true,
            skipEmptyLines: true
        });
    };

    const handleExport = () => {
        const csv = Papa.unparse(rows.map((r, i) => ({
            'S.No': i + 1,
            'Name': r.town_name,
            'Population': r.population,
            'Urban Body (Municipality/ City Board/ Cantonment Board etc)': r.urban_body_type
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Major_Towns_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500" >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Blocks & Major Towns</h2>
                    <p className="text-sm text-gray-500">Population and administrative details of major urban centers.</p>
                </div>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 cursor-pointer border border-green-200">
                        <Download className="w-4 h-4 rotate-180" /> Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                    </label>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Major Towns / Cities</h3>
                    <button onClick={addNewRow} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                        <Plus className="w-3 h-3" /> Add Row
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-12 text-center border-r">S.No</th>
                                <th className="px-4 py-3 border-r min-w-[200px]">Name</th>
                                <th className="px-4 py-3 border-r w-40">Population</th>
                                <th className="px-4 py-3 border-r min-w-[300px]">Urban Body (Municipality/ City Board/ Cantonment Board etc)</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-gray-500 border-r">{index + 1}</td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.town_name}
                                            onChange={(e) => handleRowChange(index, 'town_name', e.target.value)}
                                            placeholder="Town Name"
                                        />
                                    </td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.population}
                                            onChange={(e) => handleRowChange(index, 'population', e.target.value)}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.urban_body_type}
                                            onChange={(e) => handleRowChange(index, 'urban_body_type', e.target.value)}
                                            placeholder="Type"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button onClick={() => deleteRow(index)} className="text-red-400 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};
