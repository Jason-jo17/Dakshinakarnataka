import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface ActivityRow {
    id?: string;
    activity_name: string;
    count_2019_20: string;
    count_2020_21_h1: string;
    remarks: string;
}

const DEFAULT_ACTIVITIES = [
    "Mobilisation Camps done",
    "Rozgar Melas Done",
    "Industry Meet",
    "TP Meetings Done",
    "Trainer Meeting Done",
    "Student Feedback Interactions",
    "Community Interactions",
    "Placed Student Feedback",
    "Employer Feedback",
    "Other activities done by DSC"
];

export const DSCOperations: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ActivityRow[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('scenario_dsc_activities')
                .select('*')
                .eq('district_id', currentDistrict);

            // Merge with default list to ensure all rows appear
            const mergedRows = DEFAULT_ACTIVITIES.map(activityName => {
                const existing = data?.find((d: any) => d.activity_name === activityName);
                return existing ? existing : {
                    activity_name: activityName,
                    count_2019_20: '',
                    count_2020_21_h1: '',
                    remarks: ''
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
                activity_name: r.activity_name,
                count_2019_20: r.count_2019_20,
                count_2020_21_h1: r.count_2020_21_h1,
                remarks: r.remarks,
                updated_at: new Date()
            }));

            const { error } = await supabase
                .from('scenario_dsc_activities')
                .upsert(rowsToSave, { onConflict: 'district_id, activity_name' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Activities saved successfully!' });
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof ActivityRow, value: string) => {
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
                    const name = row['Activities'] || row['activity_name'];
                    if (!name) return;

                    const index = newRows.findIndex(r => r.activity_name === name);
                    if (index !== -1) {
                        newRows[index] = {
                            ...newRows[index],
                            count_2019_20: row['2019-2020']?.toString() || '',
                            count_2020_21_h1: row['20-21(H1)']?.toString() || '',
                            remarks: row['Remarks']?.toString() || ''
                        };
                    } else {
                        newRows.push({
                            activity_name: name,
                            count_2019_20: row['2019-2020']?.toString() || '',
                            count_2020_21_h1: row['20-21(H1)']?.toString() || '',
                            remarks: row['Remarks']?.toString() || ''
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
            'Activities': r.activity_name,
            '2019-2020': r.count_2019_20,
            '20-21(H1)': r.count_2020_21_h1,
            'Remarks': r.remarks
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `DSC_Operations_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Overview of DSC Operations</h2>
                    <p className="text-sm text-gray-500">Track key activities and performance metrics.</p>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 w-12 text-center border-r">S.No</th>
                                <th rowSpan={2} className="px-4 py-3 border-r min-w-[250px]">Activities</th>
                                <th colSpan={2} className="px-4 py-2 text-center border-r border-b">Enter number of activities done</th>
                                <th rowSpan={2} className="px-4 py-3 min-w-[200px]">Remarks</th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 border-r w-32 text-center bg-gray-50">2019-2020</th>
                                <th className="px-4 py-2 border-r w-32 text-center bg-gray-50">20-21(H1)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-gray-500 border-r">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 border-r">{row.activity_name}</td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-center bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.count_2019_20}
                                            onChange={(e) => handleRowChange(index, 'count_2019_20', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 text-center bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.count_2020_21_h1}
                                            onChange={(e) => handleRowChange(index, 'count_2020_21_h1', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-0">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.remarks}
                                            onChange={(e) => handleRowChange(index, 'remarks', e.target.value)}
                                            placeholder="Add remarks..."
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
