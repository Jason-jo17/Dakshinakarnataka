import React, { useState, useEffect } from 'react';
import { Save, Download, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ITIRow {
    indicator: string; // 'Number of ITI', 'Number of Trades'
    category: 'Govt' | 'Pvt' | 'Total';
    rural: string;
    urban: string;
    total: string;
}

export const ITIDataAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ITIRow[]>([]);
    const [enrolmentNcvt, setEnrolmentNcvt] = useState('');
    const [enrolmentAlt, setEnrolmentAlt] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial Structure
    const INDICATORS = ['Number of ITI', 'Number of Trades', 'Number of Seats'];
    const CATEGORIES = ['Govt', 'Pvt', 'Total'] as const;

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Table Data
            const { data: tableData } = await supabase
                .from('scenario_iti_data')
                .select('*')
                .eq('district_id', currentDistrict);

            // Fetch Enrolment
            const { data: enrolData } = await supabase
                .from('scenario_iti_enrolment')
                .select('*')
                .eq('district_id', currentDistrict);

            // Construct Rows
            const constructedRows: ITIRow[] = [];
            INDICATORS.forEach(ind => {
                CATEGORIES.forEach(cat => {
                    const existing = tableData?.find((d: any) => d.indicator === ind && d.category === cat);
                    constructedRows.push(existing ? {
                        indicator: ind,
                        category: cat,
                        rural: existing.rural?.toString() || '',
                        urban: existing.urban?.toString() || '',
                        total: existing.total?.toString() || ''
                    } : {
                        indicator: ind,
                        category: cat,
                        rural: '', urban: '', total: ''
                    });
                });
            });
            setRows(constructedRows);

            if (enrolData) {
                setEnrolmentNcvt(enrolData.find((d: any) => d.source_type === 'ncvt')?.enrolment_number?.toString() || '');
                setEnrolmentAlt(enrolData.find((d: any) => d.source_type === 'alternate')?.enrolment_number?.toString() || '');
            }

        } catch (error) {
            console.error('Error fetching ITI data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index: number, field: keyof ITIRow, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            // Save Table Rows
            const rowsToSave = rows.map(r => ({
                district_id: currentDistrict,
                indicator: r.indicator,
                category: r.category,
                rural: r.rural || null,
                urban: r.urban || null,
                total: r.total || null,
                updated_at: new Date()
            }));

            const { error: err1 } = await supabase
                .from('scenario_iti_data')
                .upsert(rowsToSave, { onConflict: 'district_id, indicator, category' });
            if (err1) throw err1;

            // Save Enrolment
            const enrolsToSave = [
                { district_id: currentDistrict, source_type: 'ncvt', enrolment_number: enrolmentNcvt || null, updated_at: new Date() },
                { district_id: currentDistrict, source_type: 'alternate', enrolment_number: enrolmentAlt || null, updated_at: new Date() }
            ];
            const { error: err2 } = await supabase
                .from('scenario_iti_enrolment')
                .upsert(enrolsToSave, { onConflict: 'district_id, source_type' });
            if (err2) throw err2;

            setMessage({ type: 'success', text: 'Data saved successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const tableData: any[] = rows.map(r => ({
            'Indicator': r.indicator,
            'Category': r.category,
            'Rural': r.rural,
            'Urban': r.urban,
            'Total': r.total
        }));

        // Add Enrolment as special rows
        tableData.push({ 'Indicator': 'Total Enrolment', 'Category': 'NCVT MIS', 'Rural': '', 'Urban': '', 'Total': enrolmentNcvt });
        tableData.push({ 'Indicator': 'Total Enrolment', 'Category': 'Alternate', 'Rural': '', 'Urban': '', 'Total': enrolmentAlt });

        const csv = Papa.unparse(tableData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ITI_Data_${currentDistrict}.csv`;
        link.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: (results) => {
                const data = results.data as any[];
                if (!data || data.length < 2) return;

                const newRows = [...rows];
                let newNcvt = enrolmentNcvt;
                let newAlt = enrolmentAlt;

                data.forEach((row: any) => {
                    // Try to match Map/Object from unparse
                    // PapaParse results.data depends on header true/false. We'll use header:true
                    const indicator = row['Indicator'] || row[0];
                    const category = row['Category'] || row[1];
                    const rural = row['Rural'] || row[2];
                    const urban = row['Urban'] || row[3];
                    const total = row['Total'] || row[4];

                    if (!indicator) return;

                    if (indicator === 'Total Enrolment') {
                        if (category === 'NCVT MIS') newNcvt = total;
                        if (category === 'Alternate') newAlt = total;
                    } else {
                        const index = newRows.findIndex(r => r.indicator === indicator && r.category === category);
                        if (index !== -1) {
                            newRows[index] = {
                                ...newRows[index],
                                rural: rural?.toString() || '',
                                urban: urban?.toString() || '',
                                total: total?.toString() || ''
                            };
                        }
                    }
                });

                setRows(newRows);
                setEnrolmentNcvt(newNcvt);
                setEnrolmentAlt(newAlt);
                setMessage({ type: 'success', text: 'CSV imported successfully. Click Save to persist.' });
            },
            header: true,
            skipEmptyLines: true
        });
    };

    const renderTableSection = (indicatorTitle: string) => {
        const relevantRows = rows.map((r, i) => ({ ...r, originalIndex: i })).filter(r => r.indicator === indicatorTitle);

        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-800">
                    {indicatorTitle}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center border-collapse">
                        <thead className="bg-gray-100/50 text-xs uppercase text-gray-700 text-center">
                            <tr>
                                <th className="px-4 py-2 border-r bg-gray-50 w-32"></th>
                                <th className="px-4 py-2 border-r w-32">Rural</th>
                                <th className="px-4 py-2 border-r w-32">Urban</th>
                                <th className="px-4 py-2 w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {relevantRows.map((row) => (
                                <tr key={row.originalIndex}>
                                    <td className="px-4 py-2 font-medium text-left bg-gray-50 border-r">{row.category}</td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-2 py-2 text-center bg-transparent outline-none focus:bg-blue-50"
                                            value={row.rural}
                                            onChange={(e) => handleRowChange(row.originalIndex, 'rural', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-0 border-r">
                                        <input
                                            type="text"
                                            className="w-full px-2 py-2 text-center bg-transparent outline-none focus:bg-blue-50"
                                            value={row.urban}
                                            onChange={(e) => handleRowChange(row.originalIndex, 'urban', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-0">
                                        <input
                                            type="text"
                                            className="w-full px-2 py-2 text-center bg-transparent outline-none focus:bg-blue-50"
                                            value={row.total}
                                            onChange={(e) => handleRowChange(row.originalIndex, 'total', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const [showVisuals, setShowVisuals] = useState(false);
    // ... imports

    // ... fetchData

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">ITI Data</h2>
                    <p className="text-sm text-gray-500">Training and Vocational Education Summary</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowVisuals(!showVisuals)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showVisuals ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <PieChartIcon className="w-4 h-4" />
                        {showVisuals ? 'Hide Visuals' : 'Show Visuals'}
                    </button>
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

            {showVisuals && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                    {/* Chart 1: Distribution of ITIs & Seats */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">ITI & Seat Distribution (Govt vs Pvt)</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={['Number of ITI', 'Number of Seats'].map(ind => {
                                        const govtData = rows.find(r => r.indicator === ind && r.category === 'Govt');
                                        const pvtData = rows.find(r => r.indicator === ind && r.category === 'Pvt');
                                        return {
                                            name: ind,
                                            Govt: parseFloat(govtData?.total || '0'),
                                            Pvt: parseFloat(pvtData?.total || '0')
                                        };
                                    })}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Govt" fill="#3b82f6" name="Government" />
                                    <Bar dataKey="Pvt" fill="#10b981" name="Private" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Enrolment Comparison */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">Enrolment Comparison</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'NCVT MIS', value: parseFloat(enrolmentNcvt || '0') },
                                        { name: 'Alternate', value: parseFloat(enrolmentAlt || '0') }
                                    ]}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" name="Enrolment" radius={[4, 4, 0, 0]}>
                                        {
                                            [{ name: 'NCVT MIS', value: parseFloat(enrolmentNcvt || '0') }, { name: 'Alternate', value: parseFloat(enrolmentAlt || '0') }].map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#f59e0b'} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {INDICATORS.map(ind => renderTableSection(ind))}

            {/* Enrolment Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                <h3 className="text-md font-bold text-gray-800 mb-4">Total ITI Enrolment</h3>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">As per NCVT MIS</label>
                        <input
                            type="number"
                            value={enrolmentNcvt}
                            onChange={(e) => setEnrolmentNcvt(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter count"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Source</label>
                        <input
                            type="number"
                            value={enrolmentAlt}
                            onChange={(e) => setEnrolmentAlt(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter count"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
