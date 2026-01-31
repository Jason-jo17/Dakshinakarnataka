import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface PopulationRow {
    id?: string;
    group_name: string; // 'Main', 'Population', 'Male', 'Female'
    row_label: string;
    total_total: string;
    total_rural: string;
    total_urban: string;
    sc_total: string;
    sc_rural: string;
    sc_urban: string;
    st_total: string;
    st_rural: string;
    st_urban: string;
}

interface PopulationDataEntryProps {
    sourceType: 'census_2011' | 'alternate';
    title: string;
    subtitle: string;
}

const GROUPS = [
    { name: 'Main', labels: ['India', 'Karnataka', 'Dakshina Kannada'] },
    { name: 'Population', labels: ['16-20 Years', '21-25 Years', '26-30 Years', '30-34 Years'] },
    { name: 'Male', labels: ['16-20 Years', '21-25 Years', '26-30 Years', '30-34 Years'] },
    { name: 'Female', labels: ['16-20 Years', '21-25 Years', '26-30 Years', '30-34 Years'] },
];

export const PopulationDataEntry: React.FC<PopulationDataEntryProps> = ({ sourceType, title, subtitle }) => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<PopulationRow[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict, sourceType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('scenario_population_data')
                .select('*')
                .eq('district_id', currentDistrict)
                .eq('source_type', sourceType);

            // Construct rows based on GROUPS structure
            const constructedRows: PopulationRow[] = [];

            GROUPS.forEach(group => {
                group.labels.forEach(label => {
                    const existing = data?.find((d: any) => d.group_name === group.name && d.row_label === label);
                    constructedRows.push(existing ? {
                        ...existing,
                        total_total: existing.total_total?.toString() || '',
                        total_rural: existing.total_rural?.toString() || '',
                        total_urban: existing.total_urban?.toString() || '',
                        sc_total: existing.sc_total?.toString() || '',
                        sc_rural: existing.sc_rural?.toString() || '',
                        sc_urban: existing.sc_urban?.toString() || '',
                        st_total: existing.st_total?.toString() || '',
                        st_rural: existing.st_rural?.toString() || '',
                        st_urban: existing.st_urban?.toString() || '',
                    } : {
                        group_name: group.name,
                        row_label: label,
                        total_total: '', total_rural: '', total_urban: '',
                        sc_total: '', sc_rural: '', sc_urban: '',
                        st_total: '', st_rural: '', st_urban: ''
                    });
                });
            });

            setRows(constructedRows);

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
                district_id: currentDistrict,
                source_type: sourceType,
                group_name: r.group_name,
                row_label: r.row_label,
                total_total: r.total_total || null,
                total_rural: r.total_rural || null,
                total_urban: r.total_urban || null,
                sc_total: r.sc_total || null,
                sc_rural: r.sc_rural || null,
                sc_urban: r.sc_urban || null,
                st_total: r.st_total || null,
                st_rural: r.st_rural || null,
                st_urban: r.st_urban || null,
                updated_at: new Date()
            }));

            const { error } = await supabase
                .from('scenario_population_data')
                .upsert(rowsToSave, { onConflict: 'district_id, source_type, group_name, row_label' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Data saved successfully!' });
            fetchData();
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof PopulationRow, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: async (results) => {
                const data = results.data as string[][];
                if (!data || data.length < 3) {
                    setMessage({ type: 'error', text: 'Invalid CSV format.' });
                    return;
                }

                const newRows = [...rows];
                let currentGroup = 'Main';

                // Helper to normalize labels from CSV to Component standard
                const normalizeLabel = (label: string) => {
                    const clean = label.trim().toLowerCase();
                    if (clean.includes('16-20')) return '16-20 Years';
                    if (clean.includes('21') && clean.includes('25')) return '21-25 Years';
                    if (clean.includes('26') && clean.includes('30')) return '26-30 Years';
                    if (clean.includes('30') && clean.includes('34')) return '30-34 Years';
                    return label.trim(); // Fallback for India, Karnataka, etc.
                };

                // Helper to find index in current rows
                const findRowIndex = (group: string, label: string) => {
                    return newRows.findIndex(r => r.group_name === group && r.row_label === label);
                };

                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const firstCell = row[0]?.trim();

                    // Detect Group Headers in the CSV
                    if (!firstCell && row[2]?.toLowerCase().includes('population')) {
                        currentGroup = 'Population';
                        continue;
                    }
                    if (firstCell?.toLowerCase() === 'male') {
                        currentGroup = 'Male';
                        continue;
                    }
                    if (firstCell?.toLowerCase() === 'female') {
                        currentGroup = 'Female';
                        continue;
                    }
                    if (firstCell === 'India' || firstCell === 'Karnataka' || firstCell === 'Dakshina Kannada') {
                        currentGroup = 'Main';
                    }

                    // Skip empty rows or header-only rows
                    if (!firstCell || firstCell.toLowerCase() === 'source census 2011' || row[2] === 'Total') continue;

                    const normalizedLabel = normalizeLabel(firstCell);
                    const rowIndex = findRowIndex(currentGroup, normalizedLabel);

                    if (rowIndex !== -1) {
                        // Map CSV columns (index 2 onwards) to our fields
                        // CSV Structure based on user input:
                        // Col 0: Label
                        // Col 1: Empty
                        // Col 2: Total-Total, 3: Total-Rural, 4: Total-Urban
                        // Col 5: SC-Total, 6: SC-Rural, 7: SC-Urban
                        // Col 8: ST-Total, 9: ST-Rural, 10: ST-Urban

                        newRows[rowIndex] = {
                            ...newRows[rowIndex],
                            total_total: row[2]?.replace(/,/g, '') || '',
                            total_rural: row[3]?.replace(/,/g, '') || '',
                            total_urban: row[4]?.replace(/,/g, '') || '',
                            sc_total: row[5]?.replace(/,/g, '') || '',
                            sc_rural: row[6]?.replace(/,/g, '') || '',
                            sc_urban: row[7]?.replace(/,/g, '') || '',
                            st_total: row[8]?.replace(/,/g, '') || '',
                            st_rural: row[9]?.replace(/,/g, '') || '',
                            st_urban: row[10]?.replace(/,/g, '') || '',
                        };
                    }
                }

                setRows(newRows);
                setMessage({ type: 'success', text: 'CSV imported! Review formatting and click Save.' });
            },
            header: false,
            skipEmptyLines: true
        });
    };

    const handleExport = () => {
        const csv = Papa.unparse(rows.map(r => ({
            'Group': r.group_name,
            'Category': r.row_label,
            'Total Population - Total': r.total_total,
            'Total Population - Rural': r.total_rural,
            'Total Population - Urban': r.total_urban,
            'SC - Total': r.sc_total,
            'SC - Rural': r.sc_rural,
            'SC - Urban': r.sc_urban,
            'ST - Total': r.st_total,
            'ST - Rural': r.st_rural,
            'ST - Urban': r.st_urban
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Population_${sourceType}_${currentDistrict}.csv`;
        link.click();
    };

    // Helper to render group headers or spacers
    const renderGroupHeader = (groupName: string, index: number) => {
        if (index === 0 || rows[index - 1].group_name !== groupName) {
            if (groupName === 'Main') return null; // No header for main
            return (
                <tr className="bg-gray-100">
                    <td colSpan={11} className="px-4 py-2 font-bold text-gray-700 uppercase kv-header">{groupName}</td>
                </tr>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500">{subtitle}</p>
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
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 border-r min-w-[200px] bg-gray-50 text-left">Category</th>
                                <th colSpan={3} className="px-4 py-2 border-r text-center bg-blue-50/50">Total Population</th>
                                <th colSpan={3} className="px-4 py-2 border-r text-center bg-orange-50/50">SC</th>
                                <th colSpan={3} className="px-4 py-2 text-center bg-green-50/50">ST</th>
                                <th className="w-4"></th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 border-r text-center w-24 bg-blue-50/50">Total</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-blue-50/50">Rural</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-blue-50/50">Urban</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-orange-50/50">Total</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-orange-50/50">Rural</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-orange-50/50">Urban</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-green-50/50">Total</th>
                                <th className="px-4 py-2 border-r text-center w-24 bg-green-50/50">Rural</th>
                                <th className="px-4 py-2 text-center w-24 bg-green-50/50">Urban</th>
                                <th className="w-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <React.Fragment key={index}>
                                    {renderGroupHeader(row.group_name, index)}
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-2 font-medium text-gray-900 border-r bg-gray-50/30">
                                            {row.row_label}
                                        </td>

                                        {['total_total', 'total_rural', 'total_urban'].map(field => (
                                            <td key={field} className="p-0 border-r bg-blue-50/10">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-2 text-center bg-transparent outline-none border-none focus:bg-blue-100"
                                                    value={(row as any)[field]}
                                                    onChange={(e) => handleRowChange(index, field as keyof PopulationRow, e.target.value)}
                                                />
                                            </td>
                                        ))}

                                        {['sc_total', 'sc_rural', 'sc_urban'].map(field => (
                                            <td key={field} className="p-0 border-r bg-orange-50/10">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-2 text-center bg-transparent outline-none border-none focus:bg-orange-100"
                                                    value={(row as any)[field]}
                                                    onChange={(e) => handleRowChange(index, field as keyof PopulationRow, e.target.value)}
                                                />
                                            </td>
                                        ))}

                                        {['st_total', 'st_rural', 'st_urban'].map(field => (
                                            <td key={field} className="p-0 border-r bg-green-50/10">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-2 text-center bg-transparent outline-none border-none focus:bg-green-100"
                                                    value={(row as any)[field]}
                                                    onChange={(e) => handleRowChange(index, field as keyof PopulationRow, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
