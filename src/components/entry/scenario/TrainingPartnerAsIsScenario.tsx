import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrainingPartnerRow {
    training_partner: string;
    scheme_name: string;
    sector_name: string;
    course_name: string;
    male_trained: number;
    male_placed: number;
    male_self_employed: number;
    male_avg_salary: number;
    female_trained: number;
    female_placed: number;
    female_self_employed: number;
    female_avg_salary: number;
}

export const TrainingPartnerAsIsScenario: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<TrainingPartnerRow[]>([]);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('training_partner_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (error) throw error;

            if (data) {
                // Map and sort by total trained descending
                const mappedRows = data.map((item: any) => ({
                    training_partner: item.training_partner || 'Unknown',
                    scheme_name: item.scheme_name || 'Unknown',
                    sector_name: item.sector_name || 'Unknown',
                    course_name: item.course_name || 'Unknown',
                    male_trained: Number(item.male_trained) || 0,
                    male_placed: Number(item.male_placed) || 0,
                    male_self_employed: Number(item.male_self_employed) || 0,
                    male_avg_salary: Number(item.male_avg_salary) || 0,
                    female_trained: Number(item.female_trained) || 0,
                    female_placed: Number(item.female_placed) || 0,
                    female_self_employed: Number(item.female_self_employed) || 0,
                    female_avg_salary: Number(item.female_avg_salary) || 0,
                })).sort((a, b) => {
                    const totalA = a.male_trained + a.female_trained;
                    const totalB = b.male_trained + b.female_trained;
                    return totalB - totalA;
                });
                
                setRows(mappedRows);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csvData = rows.map((r, index) => {
             const totals = {
                trained: r.male_trained + r.female_trained,
                placed: r.male_placed + r.female_placed,
                self_employed: r.male_self_employed + r.female_self_employed,
                avg_salary: (r.male_placed + r.female_placed) > 0 
                    ? Math.round(((r.male_avg_salary * r.male_placed) + (r.female_avg_salary * r.female_placed)) / (r.male_placed + r.female_placed))
                    : 0
            };
            return {
                'S.No': index + 1,
                'Training Partner': r.training_partner,
                'Scheme': r.scheme_name,
                'Sector': r.sector_name,
                'Course / QP NOS': r.course_name,
                'Male Trained': r.male_trained,
                'Male Placed': r.male_placed,
                'Male Self Emp': r.male_self_employed,
                'Male Avg Salary': r.male_avg_salary,
                'Female Trained': r.female_trained,
                'Female Placed': r.female_placed,
                'Female Self Emp': r.female_self_employed,
                'Female Avg Salary': r.female_avg_salary,
                'Total Trained': totals.trained,
                'Total Placed': totals.placed,
                'Total Self Emp': totals.self_employed,
                'Total Avg Salary': totals.avg_salary
            };
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Training_Partner_As_Is_${currentDistrict}.csv`;
        link.click();
    };

    const [showVisuals, setShowVisuals] = useState(false);
    // ... imports

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Training Partner As Is Scenario</h2>
                    <p className="text-sm text-gray-500">By Training Partner - Reference Data from Trainee Analysis</p>
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
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Refresh'}
                    </button>
                </div>
            </div>

            {showVisuals && rows.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 mb-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Top 15 Training Partners (Trained vs Placed)</h3>
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={rows.slice(0, 15).map(r => ({
                                    name: r.training_partner.length > 20 ? r.training_partner.substring(0, 20) + '...' : r.training_partner,
                                    Trained: r.male_trained + r.female_trained,
                                    Placed: r.male_placed + r.female_placed
                                }))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Trained" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-center min-w-[1200px]">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                            <th rowSpan={2} className="px-4 py-3 border-r w-12">S.No</th>
                            <th rowSpan={2} className="px-4 py-3 text-left border-r min-w-[200px]">Training Partner</th>
                            <th rowSpan={2} className="px-4 py-3 text-left border-r min-w-[120px]">Scheme</th>
                            <th rowSpan={2} className="px-4 py-3 text-left border-r min-w-[120px]">Sector</th>
                            <th rowSpan={2} className="px-4 py-3 text-left border-r min-w-[120px]">Course/ QP NOS</th>
                            
                            <th colSpan={4} className="px-4 py-2 border-r bg-blue-50">Male</th>
                            <th colSpan={4} className="px-4 py-2 border-r bg-pink-50">Female</th>
                            <th colSpan={4} className="px-4 py-2 bg-gray-200">Total</th>
                        </tr>
                        <tr>
                            <th className="px-2 py-2 border-r bg-blue-50/50">Trained</th>
                            <th className="px-2 py-2 border-r bg-blue-50/50">Placed</th>
                            <th className="px-2 py-2 border-r bg-blue-50/50">Self Emp</th>
                            <th className="px-2 py-2 border-r bg-blue-50/50">Avg Salary</th>
                            
                            <th className="px-2 py-2 border-r bg-pink-50/50">Trained</th>
                            <th className="px-2 py-2 border-r bg-pink-50/50">Placed</th>
                            <th className="px-2 py-2 border-r bg-pink-50/50">Self Emp</th>
                            <th className="px-2 py-2 border-r bg-pink-50/50">Avg Salary</th>
                            
                            <th className="px-2 py-2 border-r bg-gray-100">Trained</th>
                            <th className="px-2 py-2 border-r bg-gray-100">Placed</th>
                            <th className="px-2 py-2 border-r bg-gray-100">Self Emp</th>
                            <th className="px-2 py-2 bg-gray-100">Avg Salary</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row, index) => {
                            const totals = {
                                trained: row.male_trained + row.female_trained,
                                placed: row.male_placed + row.female_placed,
                                self_employed: row.male_self_employed + row.female_self_employed,
                                avg_salary: (row.male_placed + row.female_placed) > 0 
                                    ? Math.round(((row.male_avg_salary * row.male_placed) + (row.female_avg_salary * row.female_placed)) / (row.male_placed + row.female_placed))
                                    : 0
                            };
                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-r text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 text-left font-medium text-gray-900 border-r">{row.training_partner}</td>
                                    <td className="px-4 py-3 text-left border-r">{row.scheme_name}</td>
                                    <td className="px-4 py-3 text-left border-r">{row.sector_name}</td>
                                    <td className="px-4 py-3 text-left border-r">{row.course_name}</td>
                                    
                                    <td className="px-2 py-3 border-r text-gray-600">{row.male_trained}</td>
                                    <td className="px-2 py-3 border-r text-gray-600">{row.male_placed}</td>
                                    <td className="px-2 py-3 border-r text-gray-600">{row.male_self_employed}</td>
                                    <td className="px-2 py-3 border-r text-gray-600">{row.male_avg_salary}</td>
                                    
                                    <td className="px-2 py-3 border-r text-gray-600">{row.female_trained}</td>
                                    <td className="px-2 py-3 border-r text-gray-600">{row.female_placed}</td>
                                    <td className="px-2 py-3 border-r text-gray-600">{row.female_self_employed}</td>
                                    <td className="px-2 py-3 border-r text-gray-600">{row.female_avg_salary}</td>
                                    
                                    <td className="px-2 py-3 border-r bg-gray-50 font-bold">{totals.trained}</td>
                                    <td className="px-2 py-3 border-r bg-gray-50 font-bold">{totals.placed}</td>
                                    <td className="px-2 py-3 border-r bg-gray-50 font-bold">{totals.self_employed}</td>
                                    <td className="px-2 py-3 bg-gray-50 font-bold">{totals.avg_salary}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={17} className="px-6 py-8 text-center text-gray-500">
                                    No training partner data found in Trainee Analysis.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
