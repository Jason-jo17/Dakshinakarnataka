
import React, { useState, useEffect, useMemo } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface SocialCategoryData {
    id?: string;
    category: 'SC' | 'ST' | 'Minority' | 'General';
    male_trained: number;
    male_placed: number;
    female_trained: number;
    female_placed: number;
}

const CATEGORIES = ['SC', 'ST', 'Minority', 'General'] as const;

export const SocialCategoryAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    // Force re-index

    const [data, setData] = useState<SocialCategoryData[]>(
        CATEGORIES.map(category => ({
            category,
            male_trained: 0,
            male_placed: 0,
            female_trained: 0,
            female_placed: 0
        }))
    );

    useEffect(() => {
        fetchData();
    }, [currentDistrict, year]);

    const fetchData = async () => {
        if (!currentDistrict) return;

        setLoading(true);
        try {
            const { data: existingData, error } = await supabase
                .from('social_category_analysis')
                .select('*')
                .eq('district_id', currentDistrict)
                .eq('time_period', year);

            if (error) throw error;

            if (existingData && existingData.length > 0) {
                // Merge existing data with the structure to ensure all categories are present
                const mergedData = CATEGORIES.map(cat => {
                    const found = existingData.find((d: any) => d.category === cat);
                    return found ? {
                        ...found,
                        // Ensure numbers need to be parsed if they come as strings
                        male_trained: Number(found.male_trained),
                        male_placed: Number(found.male_placed),
                        female_trained: Number(found.female_trained),
                        female_placed: Number(found.female_placed),
                    } : {
                        category: cat,
                        male_trained: 0,
                        male_placed: 0,
                        female_trained: 0,
                        female_placed: 0
                    };
                });
                setData(mergedData);
            } else {
                // Reset to zeros if no data found for this year/district
                setData(CATEGORIES.map(category => ({
                    category,
                    male_trained: 0,
                    male_placed: 0,
                    female_trained: 0,
                    female_placed: 0
                })));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index: number, field: keyof SocialCategoryData, value: string) => {
        const newData = [...data];
        // Allow empty string for editing, but store/calc as number
        const numValue = value === '' ? 0 : Number(value);

        // Check if it's a valid number
        if (isNaN(numValue)) return;

        (newData[index] as any)[field] = numValue;
        setData(newData);
    };

    const handleSave = async () => {
        if (!currentDistrict) {
            setMessage({ type: 'error', text: 'District not identified.' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const payload = data.map(row => ({
                district_id: currentDistrict,
                time_period: year,
                category: row.category,
                male_trained: row.male_trained,
                male_placed: row.male_placed,
                female_trained: row.female_trained,
                female_placed: row.female_placed
            }));

            // Upsert data
            const { error } = await supabase
                .from('social_category_analysis')
                .upsert(payload, { onConflict: 'district_id, time_period, category' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Data saved successfully!' });

            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            console.error('Error saving data:', err);
            setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
        } finally {
            setSaving(false);
        }
    };

    const totals = useMemo(() => {
        return data.reduce((acc, curr) => ({
            male_trained: acc.male_trained + curr.male_trained,
            male_placed: acc.male_placed + curr.male_placed,
            female_trained: acc.female_trained + curr.female_trained,
            female_placed: acc.female_placed + curr.female_placed,
        }), { male_trained: 0, male_placed: 0, female_trained: 0, female_placed: 0 });
    }, [data]);

    const handleExportCSV = () => {
        const csvData = data.map((row, index) => ({
            'S.No': index + 1,
            'Category': row.category,
            'Male Trained': row.male_trained,
            'Male Placed': row.male_placed,
            'Female Trained': row.female_trained,
            'Female Placed': row.female_placed,
        }));

        // Add totals row
        csvData.push({
            'S.No': 'Total' as any,
            'Category': 'Total' as unknown as any,
            'Male Trained': totals.male_trained,
            'Male Placed': totals.male_placed,
            'Female Trained': totals.female_trained,
            'Female Placed': totals.female_placed,
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Social_Category_Analysis_${currentDistrict}_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const parsedData = results.data;
                const newData = [...data];
                let updatedCount = 0;

                parsedData.forEach((row: any) => {
                    const category = row['Category'];
                    if (!category) return; // Skip invalid or total rows

                    const index = newData.findIndex(d => d.category === category);
                    if (index !== -1) {
                        newData[index] = {
                            ...newData[index],
                            male_trained: Number(row['Male Trained']) || 0,
                            male_placed: Number(row['Male Placed']) || 0,
                            female_trained: Number(row['Female Trained']) || 0,
                            female_placed: Number(row['Female Placed']) || 0,
                        };
                        updatedCount++;
                    }
                });

                if (updatedCount > 0) {
                    setData(newData);
                    setMessage({ type: 'success', text: `Imported ${updatedCount} rows.` });
                } else {
                    setMessage({ type: 'error', text: 'No matching categories found in CSV.' });
                }
            },
            error: () => {
                setMessage({ type: 'error', text: 'Error parsing CSV.' });
            }
        });

        // Reset input
        event.target.value = '';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Table A: Social Category Analysis</h2>
                    <p className="text-sm text-gray-500">Enter training and placement data for {currentDistrict}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-24 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Year"
                        />
                    </div>

                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                    </label>

                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Data
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th rowSpan={2} className="px-6 py-3 border-r border-gray-200">S.No</th>
                                <th rowSpan={2} className="px-6 py-3 border-r border-gray-200">Category</th>
                                <th colSpan={2} className="px-6 py-3 border-r border-gray-200 text-center bg-blue-50/50">Male</th>
                                <th colSpan={2} className="px-6 py-3 text-center bg-pink-50/50">Female</th>
                            </tr>
                            <tr>
                                {/* Male headers */}
                                <th className="px-6 py-3 border-r border-gray-200 bg-blue-50/50">Trained</th>
                                <th className="px-6 py-3 border-r border-gray-200 bg-blue-50/50">Placed</th>
                                {/* Female headers */}
                                <th className="px-6 py-3 border-r border-gray-200 bg-pink-50/50">Trained</th>
                                <th className="px-6 py-3 bg-pink-50/50">Placed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row, index) => (
                                <tr key={row.category} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-500 border-r border-gray-200">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900 border-r border-gray-200">
                                        {row.category}
                                    </td>
                                    <td className="px-2 py-2 border-r border-gray-200">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.male_trained || ''}
                                            onChange={(e) => handleInputChange(index, 'male_trained', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </td>
                                    <td className="px-2 py-2 border-r border-gray-200">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.male_placed || ''}
                                            onChange={(e) => handleInputChange(index, 'male_placed', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </td>
                                    <td className="px-2 py-2 border-r border-gray-200">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.female_trained || ''}
                                            onChange={(e) => handleInputChange(index, 'female_trained', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.female_placed || ''}
                                            onChange={(e) => handleInputChange(index, 'female_placed', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-bold text-gray-900">
                            <tr>
                                <td className="px-6 py-4 border-r border-gray-200"></td>
                                <td className="px-6 py-4 border-r border-gray-200">Total</td>
                                <td className="px-6 py-4 border-r border-gray-200 text-center">{totals.male_trained}</td>
                                <td className="px-6 py-4 border-r border-gray-200 text-center">{totals.male_placed}</td>
                                <td className="px-6 py-4 border-r border-gray-200 text-center">{totals.female_trained}</td>
                                <td className="px-6 py-4 text-center">{totals.female_placed}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};
