import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SocialCategoryRow {
    category: string;
    male_trained: number;
    female_trained: number;
    male_placed: number;
    female_placed: number;
}

export const SocialCategorySummary: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<SocialCategoryRow[]>([]);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('social_category_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (error) throw error;

            if (data) {
                // Initialize map with default categories to ensure they always appear
                const textNormalizer = (str: string) => str.trim().toLowerCase();
                const defaults = ['General', 'SC', 'ST'];
                const map = new Map<string, SocialCategoryRow>();

                defaults.forEach(cat => {
                    map.set(textNormalizer(cat), {
                        category: cat,
                        male_trained: 0, female_trained: 0,
                        male_placed: 0, female_placed: 0
                    });
                });

                data.forEach((item: any) => {
                    const originalCat = item.category || 'Unknown';
                    const key = textNormalizer(originalCat);

                    // If it's a known category, use the canonical name, otherwise use original
                    const existing = map.get(key);
                    const categoryDisplay = existing ? existing.category : originalCat;

                    const current = existing || {
                        category: categoryDisplay,
                        male_trained: 0, female_trained: 0,
                        male_placed: 0, female_placed: 0
                    };

                    map.set(key, {
                        ...current,
                        male_trained: current.male_trained + (Number(item.male_trained) || 0),
                        female_trained: current.female_trained + (Number(item.female_trained) || 0),
                        male_placed: current.male_placed + (Number(item.male_placed) || 0),
                        female_placed: current.female_placed + (Number(item.female_placed) || 0),
                    });
                });

                // Convert map to array, ensuring order: General, SC, ST, then others
                const orderedRows: SocialCategoryRow[] = [];
                defaults.forEach(cat => {
                    const key = textNormalizer(cat);
                    const row = map.get(key);
                    if (row) orderedRows.push(row);
                    map.delete(key);
                });
                // Add any remaining categories
                map.forEach(row => orderedRows.push(row));

                setRows(orderedRows);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTotals = () => {
        return rows.reduce((acc, row) => ({
            male_trained: acc.male_trained + row.male_trained,
            female_trained: acc.female_trained + row.female_trained,
            male_placed: acc.male_placed + row.male_placed,
            female_placed: acc.female_placed + row.female_placed,
        }), { male_trained: 0, female_trained: 0, male_placed: 0, female_placed: 0 });
    };

    const totals = getTotals();

    const handleExport = () => {
        const csv = Papa.unparse([
            ...rows.map(r => ({
                'Category': r.category,
                'Male Trained': r.male_trained,
                'Female Trained': r.female_trained,
                'Male Placed': r.male_placed,
                'Female Placed': r.female_placed
            })),
            {
                'Category': 'Total',
                'Male Trained': totals.male_trained,
                'Female Trained': totals.female_trained,
                'Male Placed': totals.male_placed,
                'Female Placed': totals.female_placed
            }
        ]);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Social_Category_Summary_${currentDistrict}.csv`;
        link.click();
    };

    const [showVisuals, setShowVisuals] = useState(false);
    // ... imports

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Social Category Summary</h2>
                    <p className="text-sm text-gray-500">Overview based on data entered in Trainee Analysis.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowVisuals(!showVisuals)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showVisuals ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <PieChartIcon className="w-4 h-4" />
                        {showVisuals ? 'Hide Visuals' : 'Show Visuals'}
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {showVisuals && rows.length > 0 && (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                    {/* Chart: Gender Distribution per Category */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">Trained & Placed (Gender Split)</h3>
                        <div className="h-[450px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={rows}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="male_trained" fill="#3b82f6" name="Male Trained" stackId="trained" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="female_trained" fill="#60a5fa" name="Female Trained" stackId="trained" radius={[4, 4, 0, 0]} />

                                    <Bar dataKey="male_placed" fill="#10b981" name="Male Placed" stackId="placed" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="female_placed" fill="#34d399" name="Female Placed" stackId="placed" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-yellow-50 text-gray-800 font-bold uppercase text-xs">
                        <tr>
                            <th rowSpan={2} className="px-6 py-4 text-left border-r bg-yellow-100">Category</th>
                            <th colSpan={2} className="px-6 py-2 border-r bg-gray-100">Total Trained</th>
                            <th colSpan={2} className="px-6 py-2 bg-gray-100">Total Placed</th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 border-r bg-gray-50">Male</th>
                            <th className="px-4 py-2 border-r bg-gray-50">Female</th>
                            <th className="px-4 py-2 border-r bg-gray-50">Male</th>
                            <th className="px-4 py-2 bg-gray-50">Female</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row) => (
                            <tr key={row.category} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-left font-bold text-gray-900 border-r">{row.category}</td>
                                <td className="px-4 py-4 border-r">{row.male_trained}</td>
                                <td className="px-4 py-4 border-r">{row.female_trained}</td>
                                <td className="px-4 py-4 border-r">{row.male_placed}</td>
                                <td className="px-4 py-4">{row.female_placed}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No data found in Trainee Analysis.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-blue-50 font-bold text-gray-900">
                        <tr>
                            <td className="px-6 py-4 text-left border-r">Total</td>
                            <td className="px-4 py-4 border-r">{totals.male_trained}</td>
                            <td className="px-4 py-4 border-r">{totals.female_trained}</td>
                            <td className="px-4 py-4 border-r">{totals.male_placed}</td>
                            <td className="px-4 py-4">{totals.female_placed}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
