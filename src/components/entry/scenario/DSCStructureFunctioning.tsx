import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface DSCGeneral {
    meetings_2019_20: string;
    meetings_2020_21: string;
}

interface SubcommitteeRow {
    id?: string;
    subcommittee_name: string;
    meetings_held: string;
    member_1: string;
    member_2: string;
    member_3: string;
    member_4: string;
    member_5: string;
}

export const DSCStructureFunctioning: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [generalData, setGeneralData] = useState<DSCGeneral>({ meetings_2019_20: '', meetings_2020_21: '' });
    const [rows, setRows] = useState<SubcommitteeRow[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch General Info
            const { data: genData } = await supabase
                .from('scenario_dsc_general')
                .select('meetings_2019_20, meetings_2020_21')
                .eq('district_id', currentDistrict)
                .single();

            if (genData) {
                setGeneralData(genData);
            } else {
                setGeneralData({ meetings_2019_20: '', meetings_2020_21: '' });
            }

            // Fetch Subcommittees
            const { data: subData } = await supabase
                .from('scenario_dsc_subcommittees')
                .select('*')
                .eq('district_id', currentDistrict)
                .order('created_at', { ascending: true });

            if (subData) {
                setRows(subData);
            } else {
                // Seed empty rows if none exist, matching user template (14 rows)
                const emptyRows = Array(14).fill(null).map(() => ({
                    subcommittee_name: '',
                    meetings_held: '',
                    member_1: '', member_2: '', member_3: '', member_4: '', member_5: ''
                }));
                setRows(emptyRows);
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
            // Save General
            const { error: genError } = await supabase
                .from('scenario_dsc_general')
                .upsert({
                    district_id: currentDistrict,
                    ...generalData,
                    updated_at: new Date()
                }, { onConflict: 'district_id' });

            if (genError) throw genError;

            // Save Rows
            // Filter out empty rows to keep DB clean, or save all? User template has fixed 14 rows usually.
            // We'll upsert all rows that have at least a name or ID.
            const rowsToSave = rows.map(r => ({
                ...r,
                district_id: currentDistrict,
                updated_at: new Date()
            }));

            const { error: subError } = await supabase
                .from('scenario_dsc_subcommittees')
                .upsert(rowsToSave);

            if (subError) throw subError;

            setMessage({ type: 'success', text: 'Data saved successfully!' });
            fetchData(); // Refresh to get IDs
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof SubcommitteeRow, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const addNewRow = () => {
        setRows([...rows, { subcommittee_name: '', meetings_held: '', member_1: '', member_2: '', member_3: '', member_4: '', member_5: '' }]);
    };

    const deleteRow = async (index: number) => {
        const row = rows[index];
        if (row.id) {
            await supabase.from('scenario_dsc_subcommittees').delete().eq('id', row.id);
        }
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    // CSV Import
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: (results) => {
                const data = results.data as any[];
                if (!data) return;

                const newRows = [...rows];
                data.forEach((row: any) => {
                    const name = row['Sub-Committee Name'] || row['subcommittee_name'];
                    if (!name) return;

                    const index = newRows.findIndex(r => r.subcommittee_name === name);
                    if (index !== -1) {
                        newRows[index] = {
                            ...newRows[index],
                            meetings_held: row['Number of Meetings']?.toString() || '',
                            member_1: row['Member 1']?.toString() || '',
                            member_2: row['Member 2']?.toString() || '',
                            member_3: row['Member 3']?.toString() || '',
                            member_4: row['Member 4']?.toString() || '',
                            member_5: row['Member 5']?.toString() || ''
                        };
                    } else {
                        newRows.push({
                            subcommittee_name: name,
                            meetings_held: row['Number of Meetings']?.toString() || '',
                            member_1: row['Member 1']?.toString() || '',
                            member_2: row['Member 2']?.toString() || '',
                            member_3: row['Member 3']?.toString() || '',
                            member_4: row['Member 4']?.toString() || '',
                            member_5: row['Member 5']?.toString() || ''
                        });
                    }
                });

                setRows(newRows);
                setMessage({ type: 'success', text: 'CSV imported! Click Save to continue.' });
            },
            header: true,
            skipEmptyLines: true
        });
    };

    // CSV Export
    const handleExport = () => {
        const csv = Papa.unparse(rows.map((r, i) => ({
            'S.No': i + 1,
            'Sub-Committee Name': r.subcommittee_name,
            'Number of Meetings': r.meetings_held,
            'Member 1': r.member_1,
            'Member 2': r.member_2,
            'Member 3': r.member_3,
            'Member 4': r.member_4,
            'Member 5': r.member_5
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `DSC_Structure_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">DSC Structure and Functioning</h2>
                    <p className="text-sm text-gray-500">Manage committee meetings and member details.</p>
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

            {/* Part 1: General Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">DSC Meeting Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Number of DSC meetings held in 2019-2020</label>
                        <input
                            type="text"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={generalData.meetings_2019_20}
                            onChange={(e) => setGeneralData({ ...generalData, meetings_2019_20: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Number of DSC meetings held in 2020-2021</label>
                        <input
                            type="text"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={generalData.meetings_2020_21}
                            onChange={(e) => setGeneralData({ ...generalData, meetings_2020_21: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Part 2: Sub-Committees Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Sub-committees & Members</h3>
                    <button onClick={addNewRow} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                        <Plus className="w-3 h-3" /> Add Row
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-bold">
                            <tr>
                                <th className="px-4 py-3 w-12 text-center border-r">S.No</th>
                                <th className="px-4 py-3 border-r min-w-[200px]">Names of sub-committees</th>
                                <th className="px-4 py-3 border-r w-32">Number of meetings</th>
                                <th colSpan={5} className="px-4 py-3 text-center border-r">Members (Names)</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-center text-gray-500 border-r bg-white sticky left-0">{index + 1}</td>

                                    <td className="p-0 border-r">
                                        <input type="text" className="w-full px-4 py-2 bg-transparent outline-none border-none focus:bg-blue-50"
                                            value={row.subcommittee_name}
                                            onChange={(e) => handleRowChange(index, 'subcommittee_name', e.target.value)}
                                            placeholder="Committee Name"
                                        />
                                    </td>

                                    <td className="p-0 border-r">
                                        <input type="text" className="w-full px-4 py-2 bg-transparent outline-none border-none focus:bg-blue-50 text-center"
                                            value={row.meetings_held}
                                            onChange={(e) => handleRowChange(index, 'meetings_held', e.target.value)}
                                        />
                                    </td>

                                    {['member_1', 'member_2', 'member_3', 'member_4', 'member_5'].map((field) => (
                                        <td key={field} className="p-0 border-r">
                                            <input type="text" className="w-full px-4 py-2 bg-transparent outline-none border-none focus:bg-blue-50"
                                                value={(row as any)[field]}
                                                onChange={(e) => handleRowChange(index, field as keyof SubcommitteeRow, e.target.value)}
                                                placeholder={`Member`}
                                            />
                                        </td>
                                    ))}

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
        </div>
    );
};
