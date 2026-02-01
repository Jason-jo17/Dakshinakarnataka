import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type EducationLevel = 'Graduate' | 'PostGraduate' | 'Diploma';

interface EnrollmentRow {
    id?: string;
    college_name: string;
    course_name: string;
    duration_years: number;
    male_count: number;
    female_count: number;
}

export const CollegeEnrollmentAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [activeTab, setActiveTab] = useState<EducationLevel>('Graduate');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [rows, setRows] = useState<EnrollmentRow[]>([]);

    // Determine table name based on tab
    const getTableName = (tab: EducationLevel) => {
        switch (tab) {
            case 'Graduate': return 'college_enrollments_graduate';
            case 'PostGraduate': return 'college_enrollments_postgraduate';
            case 'Diploma': return 'college_enrollments_diploma';
        }
    };

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const table = getTableName(activeTab);
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('district_id', currentDistrict)
                .order('male_count', { ascending: false }); // Sort by size initially or created_at? User asked for largest enrollment first. 
            // Sorting by total (male+female) requires client side sort or generated column.

            if (error) throw error;

            if (data) {
                const mapped = data.map((d: any) => ({
                    id: d.id,
                    college_name: d.college_name,
                    course_name: d.course_name,
                    duration_years: Number(d.duration_years),
                    male_count: Number(d.male_count),
                    female_count: Number(d.female_count),
                }));
                // Client-side sort by total enrollment desc
                mapped.sort((a: EnrollmentRow, b: EnrollmentRow) => (b.male_count + b.female_count) - (a.male_count + a.female_count));
                setRows(mapped);
            } else {
                setRows([]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index: number, field: keyof EnrollmentRow, value: string | number) => {
        const newRows = [...rows];
        (newRows[index] as any)[field] = value;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, {
            college_name: '',
            course_name: '',
            duration_years: 0,
            male_count: 0,
            female_count: 0
        }]);
    };

    const handleDeleteRow = async (index: number) => {
        const row = rows[index];
        if (row.id) {
            const table = getTableName(activeTab);
            const { error } = await supabase.from(table).delete().eq('id', row.id);
            if (error) {
                setMessage({ type: 'error', text: 'Failed to delete row from DB.' });
                return;
            }
        }
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const handleSave = async () => {
        if (!currentDistrict) return;
        setSaving(true);
        setMessage(null);

        try {
            const table = getTableName(activeTab);
            const payload = rows.map(r => ({
                id: r.id, // Include ID for upsert
                district_id: currentDistrict,
                college_name: r.college_name,
                course_name: r.course_name,
                duration_years: r.duration_years,
                male_count: r.male_count,
                female_count: r.female_count
            }));

            const { error } = await supabase
                .from(table)
                .upsert(payload, { onConflict: 'district_id, college_name, course_name' })
                .select();

            if (error) throw error;

            fetchData(); // Refresh to get IDs
            setMessage({ type: 'success', text: 'Data saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            console.error('Error saving:', err);
            setMessage({ type: 'error', text: 'Failed to save data.' });
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        const csvData = rows.map((r, i) => ({
            'S.No': i + 1,
            'College': r.college_name,
            'Course Name': r.course_name,
            'Duration(yrs)': r.duration_years,
            'Male': r.male_count,
            'Female': r.female_count,
            'Total': r.male_count + r.female_count
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `College_Enrollments_${activeTab}_${currentDistrict}.csv`;
        link.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const imported = results.data.map((r: any) => ({
                    college_name: r['College'] || '',
                    course_name: r['Course Name'] || '',
                    duration_years: Number(r['Duration(yrs)']) || 0,
                    male_count: Number(r['Male']) || 0,
                    female_count: Number(r['Female']) || 0,
                })).filter((r: any) => r.college_name && r.course_name);

                setRows([...rows, ...imported]); // Append imported rows
                setMessage({ type: 'success', text: `Imported ${imported.length} rows.` });
            }
        });
        e.target.value = '';
    };

    // Calculations
    const totalMale = rows.reduce((sum, r) => sum + (r.male_count || 0), 0);
    const totalFemale = rows.reduce((sum, r) => sum + (r.female_count || 0), 0);
    const grandTotal = totalMale + totalFemale;

    const TabButton = ({ label, value }: { label: string, value: EducationLevel }) => (
        <button
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === value
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
        >
            {label}
        </button>
    );

    const [showVisuals, setShowVisuals] = useState(false);
    // ... imports

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Major Colleges & Enrollments</h2>
                    <p className="text-sm text-gray-500">Enter enrollment details by college and course.</p>
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
                        <Upload className="w-4 h-4" /> Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                    </label>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Data
                    </button>
                </div>
            </div>

            {showVisuals && rows.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 mb-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Top 10 Colleges by Enrollment (Gender Split)</h3>
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={rows.slice(0, 10).map(r => ({
                                    name: r.college_name.length > 20 ? r.college_name.substring(0, 20) + '...' : r.college_name,
                                    Male: r.male_count,
                                    Female: r.female_count
                                }))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Male" fill="#3b82f6" stackId="a" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Female" fill="#ec4899" stackId="a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-4 pt-2">
                    <TabButton label="7.1 Graduate Level" value="Graduate" />
                    <TabButton label="7.2 Post Graduate Level" value="PostGraduate" />
                    <TabButton label="7.3 Diploma/Certificate" value="Diploma" />
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-center">
                                <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                                    <tr>
                                        <th rowSpan={2} className="px-4 py-3 border-r w-12">S.No</th>
                                        <th rowSpan={2} className="px-4 py-3 text-left border-r min-w-[200px]">College</th>
                                        <th rowSpan={2} className="px-4 py-3 text-left border-r min-w-[200px]">Course Name</th>
                                        <th rowSpan={2} className="px-4 py-3 border-r w-24">Duration (yrs)</th>
                                        <th colSpan={3} className="px-4 py-2 bg-gray-200">Grand Total</th>
                                        <th rowSpan={2} className="px-2 w-10"></th>
                                    </tr>
                                    <tr>
                                        <th className="px-4 py-2 border-r bg-blue-50">Male</th>
                                        <th className="px-4 py-2 border-r bg-pink-50">Female</th>
                                        <th className="px-4 py-2 bg-gray-200">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rows.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50 group">
                                            <td className="px-4 py-3 border-r text-gray-500">{index + 1}</td>
                                            <td className="p-1 border-r"><input type="text" className="w-full px-2 py-1 bg-transparent outline-none focus:bg-yellow-50 rounded" value={row.college_name} onChange={(e) => handleInputChange(index, 'college_name', e.target.value)} placeholder="College Name" /></td>
                                            <td className="p-1 border-r"><input type="text" className="w-full px-2 py-1 bg-transparent outline-none focus:bg-yellow-50 rounded" value={row.course_name} onChange={(e) => handleInputChange(index, 'course_name', e.target.value)} placeholder="Course" /></td>
                                            <td className="p-1 border-r"><input type="number" min="0" step="0.5" className="w-full px-2 py-1 bg-transparent outline-none focus:bg-yellow-50 rounded text-center" value={row.duration_years || ''} onChange={(e) => handleInputChange(index, 'duration_years', Number(e.target.value))} /></td>
                                            <td className="p-1 border-r bg-blue-50/30"><input type="number" min="0" className="w-full px-2 py-1 bg-transparent outline-none focus:bg-blue-100 rounded text-center font-medium" value={row.male_count || ''} onChange={(e) => handleInputChange(index, 'male_count', Number(e.target.value))} /></td>
                                            <td className="p-1 border-r bg-pink-50/30"><input type="number" min="0" className="w-full px-2 py-1 bg-transparent outline-none focus:bg-pink-100 rounded text-center font-medium" value={row.female_count || ''} onChange={(e) => handleInputChange(index, 'female_count', Number(e.target.value))} /></td>
                                            <td className="px-4 py-3 bg-gray-100 font-bold">{row.male_count + row.female_count}</td>
                                            <td className="px-2 text-center">
                                                <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Grand Total Row */}
                                    <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                                        <td colSpan={4} className="px-6 py-3 text-right text-gray-800">Grand Total</td>
                                        <td className="px-4 py-3 text-center text-blue-800">{totalMale}</td>
                                        <td className="px-4 py-3 text-center text-pink-800">{totalFemale}</td>
                                        <td className="px-4 py-3 text-center text-gray-900 text-lg">{grandTotal}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <button onClick={handleAddRow} className="w-full py-3 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 transition border-t border-gray-200">
                                <Plus className="w-4 h-4" /> Add Row
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
