import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface DropoutRow {
    id?: string;
    education_level: string;
    year1_m: string;
    year1_f: string;
    year1_total: string;
    year2_m: string;
    year2_f: string;
    year2_total: string;
    // Calculated locally
    dropout_analysis: string;
    dropout_percentage: string;
}

interface EducationDropoutAnalysisProps {
    isAlternate: boolean;
}

const EDUCATION_LEVELS = [
    'Class 5 to 6', 'Class 6 to 7', 'Class 7 to 8', 'Class 8 to 9',
    'Class 9 to 10', 'Class 10 to 11', 'Class 11 to 12', 'Class 12'
];

export const EducationDropoutAnalysis: React.FC<EducationDropoutAnalysisProps> = ({ isAlternate }) => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<DropoutRow[]>([]);
    const [year1Label, setYear1Label] = useState(isAlternate ? '2023-24' : '2015-16');
    const [year2Label, setYear2Label] = useState(isAlternate ? '2024-25' : '2016-17');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict, isAlternate]);

    const calculateDropout = (y1: string, y2: string) => {
        const v1 = parseFloat(y1) || 0;
        const v2 = parseFloat(y2) || 0;
        const diff = v1 - v2;
        // Logic: If (Year1 - Year2) < 0, return "NA"
        if (diff < 0) return "NA";
        return diff.toFixed(0);
    };

    const calculatePercentage = (dropout: string, y1: string) => {
        if (dropout === "NA") return "NA";
        const d = parseFloat(dropout);
        const v1 = parseFloat(y1);
        if (!v1 || v1 === 0) return "0%";

        const pct = (d / v1) * 100;
        // Logic: If result < 0, NA (though calculateDropout handles diff < 0 already)
        if (pct < 0) return "NA";
        return pct.toFixed(2) + '%';
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('scenario_education_dropout')
                .select('*')
                .eq('district_id', currentDistrict)
                .eq('source_type', isAlternate ? 'alternate' : 'dise');

            if (data && data.length > 0) {
                if (isAlternate && data[0].year1_label) setYear1Label(data[0].year1_label);
                if (isAlternate && data[0].year2_label) setYear2Label(data[0].year2_label);
            }

            const constructedRows = EDUCATION_LEVELS.map(level => {
                const existing = data?.find((d: any) => d.education_level === level);
                const r = existing ? {
                    ...existing,
                    year1_m: existing.year1_m?.toString() || '',
                    year1_f: existing.year1_f?.toString() || '',
                    year1_total: existing.year1_total?.toString() || '',
                    year2_m: existing.year2_m?.toString() || '',
                    year2_f: existing.year2_f?.toString() || '',
                    year2_total: existing.year2_total?.toString() || '',
                } : {
                    education_level: level,
                    year1_m: '', year1_f: '', year1_total: '',
                    year2_m: '', year2_f: '', year2_total: '',
                };

                // Recalculate on load
                r.dropout_analysis = calculateDropout(r.year1_total, r.year2_total);
                r.dropout_percentage = calculatePercentage(r.dropout_analysis, r.year1_total);
                return r;
            });

            setRows(constructedRows);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index: number, field: keyof DropoutRow, value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };

        // Auto-calc Total if M/F changed? User didn't ask, but let's stick to manual entry for now as per sheet,
        // unless User explicitly asks. But the screenshot shows Total. I'll let user enter Total manually to match Excel behavior usually.
        // Wait, formulas depend on Year1 Total and Year2 Total.

        // Recalculate Formulas
        const r = newRows[index];
        r.dropout_analysis = calculateDropout(r.year1_total, r.year2_total);
        r.dropout_percentage = calculatePercentage(r.dropout_analysis, r.year1_total);

        setRows(newRows);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const rowsToSave = rows.map(r => ({
                district_id: currentDistrict,
                source_type: isAlternate ? 'alternate' : 'dise',
                education_level: r.education_level,
                year1_label: year1Label,
                year2_label: year2Label,
                year1_m: r.year1_m || null,
                year1_f: r.year1_f || null,
                year1_total: r.year1_total || null,
                year2_m: r.year2_m || null,
                year2_f: r.year2_f || null,
                year2_total: r.year2_total || null,
                updated_at: new Date()
            }));

            const { error } = await supabase
                .from('scenario_education_dropout')
                .upsert(rowsToSave, { onConflict: 'district_id, source_type, education_level' });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Data saved successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: async (results) => {
                const data = results.data as any[];
                if (!data || data.length < 2) return;

                const newRows = [...rows];

                data.forEach((row: any) => {
                    // Try to match Map/Object from unparse
                    const level = row['Education Level'] || row['education_level'];
                    if (!level) return;

                    const index = newRows.findIndex(r => r.education_level === level);
                    if (index !== -1) {
                        // We need to map CSV columns to fields.
                        // Exporter uses dynamic keys like `${year1Label} (M)`.
                        // We will look for keys ending in (M), (F), (Total) for Year 1 and Year 2.
                        // This is tricky if years change. We'll use order or fuzzy matching if possible.

                        // Better approach: Since we have the row object, iterate keys.

                        const keys = Object.keys(row);
                        const mKeys = keys.filter(k => k.includes('(M)'));
                        const fKeys = keys.filter(k => k.includes('(F)'));
                        const tKeys = keys.filter(k => k.includes('(Total)'));

                        // Assume 1st occurence is Year 1, 2nd is Year 2 (since levels sort naturally?)
                        // Actually, year1Label and year2Label are in state. We should match those if possible.

                        const y1M = row[`${year1Label} (M)`] || (mKeys[0] ? row[mKeys[0]] : '');
                        const y1F = row[`${year1Label} (F)`] || (fKeys[0] ? row[fKeys[0]] : '');
                        const y1T = row[`${year1Label} (Total)`] || (tKeys[0] ? row[tKeys[0]] : '');

                        const y2M = row[`${year2Label} (M)`] || (mKeys[1] ? row[mKeys[1]] : '');
                        const y2F = row[`${year2Label} (F)`] || (fKeys[1] ? row[fKeys[1]] : '');
                        const y2T = row[`${year2Label} (Total)`] || (tKeys[1] ? row[tKeys[1]] : '');

                        const updatedRow = {
                            ...newRows[index],
                            year1_m: y1M?.toString() || '',
                            year1_f: y1F?.toString() || '',
                            year1_total: y1T?.toString() || '',
                            year2_m: y2M?.toString() || '',
                            year2_f: y2F?.toString() || '',
                            year2_total: y2T?.toString() || ''
                        };

                        // Recalculate
                        updatedRow.dropout_analysis = calculateDropout(updatedRow.year1_total, updatedRow.year2_total);
                        updatedRow.dropout_percentage = calculatePercentage(updatedRow.dropout_analysis, updatedRow.year1_total);

                        newRows[index] = updatedRow;
                    }
                });

                setRows(newRows);
                setMessage({ type: 'success', text: 'CSV imported successfully. Click Save to persist.' });
            },
            header: true,
            skipEmptyLines: true
        });
    };

    const handleExport = () => {
        const csv = Papa.unparse(rows.map(r => ({
            'Education Level': r.education_level,
            [`${year1Label} (M)`]: r.year1_m,
            [`${year1Label} (F)`]: r.year1_f,
            [`${year1Label} (Total)`]: r.year1_total,
            [`${year2Label} (M)`]: r.year2_m,
            [`${year2Label} (F)`]: r.year2_f,
            [`${year2Label} (Total)`]: r.year2_total,
            'Dropout Analysis': r.dropout_analysis,
            '% of Dropouts': r.dropout_percentage
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Dropout_Analysis_${isAlternate ? 'Alternate' : 'DISE'}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isAlternate ? 'Education Data (Alternate Source)' : 'School Data as per DISE website'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {isAlternate ? 'Enter data from alternate sources. You can edit the years.' : 'Dropout analysis based on DISE data.'}
                    </p>
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
                    <table className="w-full text-sm text-center border-collapse">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 border-r text-left bg-gray-50 w-48">Education Level</th>
                                <th colSpan={3} className="px-4 py-2 border-r bg-blue-50/50">
                                    {isAlternate ? (
                                        <input type="text" value={year1Label} onChange={e => setYear1Label(e.target.value)} className="bg-transparent border-b border-gray-400 text-center w-full focus:outline-none" />
                                    ) : `For year ${year1Label}`}
                                </th>
                                <th colSpan={3} className="px-4 py-2 border-r bg-green-50/50">
                                    {isAlternate ? (
                                        <input type="text" value={year2Label} onChange={e => setYear2Label(e.target.value)} className="bg-transparent border-b border-gray-400 text-center w-full focus:outline-none" />
                                    ) : `For year ${year2Label}`}
                                </th>
                                <th rowSpan={2} className="px-4 py-2 border-r bg-gray-50 w-32">Dropout Analysis</th>
                                <th rowSpan={2} className="px-4 py-2 bg-gray-50 w-32">% of Dropouts</th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 border-r bg-blue-50/50 w-20">M</th>
                                <th className="px-4 py-2 border-r bg-blue-50/50 w-20">F</th>
                                <th className="px-4 py-2 border-r bg-blue-50/50 w-20">Total</th>
                                <th className="px-4 py-2 border-r bg-green-50/50 w-20">M</th>
                                <th className="px-4 py-2 border-r bg-green-50/50 w-20">F</th>
                                <th className="px-4 py-2 border-r bg-green-50/50 w-20">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-left font-medium text-gray-900 border-r">{row.education_level}</td>

                                    {/* Year 1 */}
                                    {['year1_m', 'year1_f', 'year1_total'].map(field => (
                                        <td key={field} className="p-0 border-r bg-blue-50/10">
                                            <input
                                                type="text"
                                                className="w-full px-2 py-2 text-center bg-transparent outline-none border-none focus:bg-blue-100"
                                                value={(row as any)[field]}
                                                onChange={(e) => handleChange(index, field as keyof DropoutRow, e.target.value)}
                                            />
                                        </td>
                                    ))}

                                    {/* Year 2 */}
                                    {['year2_m', 'year2_f', 'year2_total'].map(field => (
                                        <td key={field} className="p-0 border-r bg-green-50/10">
                                            <input
                                                type="text"
                                                className="w-full px-2 py-2 text-center bg-transparent outline-none border-none focus:bg-green-100"
                                                value={(row as any)[field]}
                                                onChange={(e) => handleChange(index, field as keyof DropoutRow, e.target.value)}
                                            />
                                        </td>
                                    ))}

                                    <td className="px-4 py-2 border-r bg-gray-100/50 font-medium text-gray-700">
                                        {row.dropout_analysis === 'NA' ? (
                                            <span className="text-gray-400">NA</span>
                                        ) : row.dropout_analysis}
                                    </td>
                                    <td className="px-4 py-2 bg-gray-100/50 font-medium text-gray-700">
                                        {row.dropout_percentage === 'NA' ? (
                                            <span className="text-gray-400">NA</span>
                                        ) : row.dropout_percentage}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAlternate && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                    <strong>Tip:</strong> You can click on the Year headers (e.g., "2023-24") to edit them for your specific data period.
                </div>
            )}
        </div>
    );
};
