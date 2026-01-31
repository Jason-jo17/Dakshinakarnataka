import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface OverviewRow {
    id?: string;
    parameter: string;
    source: string;
    total_value: string;
    male_value: string;
    female_value: string;
}

const DEFAULT_PARAMETERS = [
    "Population (Census2011)",
    "Post 2011 estimate",
    "Area (sq.km)",
    "Gram Panchayats",
    "Total",
    "Plans available online"
];

export const DistrictOverview: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<OverviewRow[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) {
            fetchData();
        }
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Rows
            const { data } = await supabase
                .from('scenario_district_overview')
                .select('*')
                .eq('district_id', currentDistrict);

            const mergedRows = DEFAULT_PARAMETERS.map(param => {
                const existing = data?.find((d: any) => d.parameter === param);
                return existing ? existing : {
                    parameter: param,
                    source: '',
                    total_value: '',
                    male_value: '',
                    female_value: ''
                };
            });
            setRows(mergedRows);

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
                parameter: r.parameter,
                source: r.source,
                total_value: r.total_value,
                male_value: r.male_value,
                female_value: r.female_value,
                updated_at: new Date()
            }));

            const { error } = await supabase
                .from('scenario_district_overview')
                .upsert(rowsToSave, { onConflict: 'district_id, parameter' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Overview saved successfully!' });
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof OverviewRow, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
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
                    const param = row['Parameter'] || row['parameter'];
                    if (!param) return;

                    const index = newRows.findIndex(r => r.parameter === param);
                    if (index !== -1) {
                        newRows[index] = {
                            ...newRows[index],
                            source: row['Source']?.toString() || '',
                            total_value: row['Total']?.toString() || '',
                            male_value: row['Male']?.toString() || '',
                            female_value: row['Female']?.toString() || ''
                        };
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
        const csv = Papa.unparse(rows.map((r) => ({
            'Parameter': r.parameter,
            'Source': r.source,
            'Total': r.total_value,
            'Male': r.male_value,
            'Female': r.female_value
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `District_Overview_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Overview of District</h2>
                    <p className="text-sm text-gray-500">Key demographic and administrative statistics.</p>
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

            {/* Disclaimer for specific district visibility if needed */}
            {/* <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                This data is primarily relevant for Dakshina Kannada.
            </div> */}

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 min-w-[200px] border-r"></th>
                                <th className="px-4 py-3 border-r min-w-[150px]">Source</th>
                                <th className="px-4 py-3 border-r w-32 bg-gray-200/50">Total</th>
                                <th className="px-4 py-3 border-r w-32 text-center">M</th>
                                <th className="px-4 py-3 w-32 text-center">F</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 border-r bg-gray-50/30">{row.parameter}</td>

                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.source}
                                            onChange={(e) => handleRowChange(index, 'source', e.target.value)}
                                            placeholder={row.parameter === 'Post 2011 estimate' ? 'mention source' : ''}
                                        />
                                    </td>

                                    <td className="p-0 border-r bg-blue-50/30">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-transparent outline-none border-none focus:bg-blue-100 font-medium text-gray-900"
                                            value={row.total_value}
                                            onChange={(e) => handleRowChange(index, 'total_value', e.target.value)}
                                        />
                                    </td>

                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-center bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.male_value}
                                            onChange={(e) => handleRowChange(index, 'male_value', e.target.value)}
                                        />
                                    </td>

                                    <td className="p-0">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-center bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.female_value}
                                            onChange={(e) => handleRowChange(index, 'female_value', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
