
import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface TrainingPartnerData {
    id?: string;
    training_partner: string;
    scheme_name: string;
    sector_name: string;
    course_name: string;

    // Male
    male_trained: number;
    male_placed: number;
    male_self_employed: number;
    male_avg_salary: number;

    // Female
    female_trained: number;
    female_placed: number;
    female_self_employed: number;
    female_avg_salary: number;
}

export const TrainingPartnerAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [data, setData] = useState<TrainingPartnerData[]>([]);

    // Form State
    const [newEntry, setNewEntry] = useState<Omit<TrainingPartnerData, 'id'>>({
        training_partner: '',
        scheme_name: '',
        sector_name: '',
        course_name: '',

        male_trained: 0,
        male_placed: 0,
        male_self_employed: 0,
        male_avg_salary: 0,
        female_trained: 0,
        female_placed: 0,
        female_self_employed: 0,
        female_avg_salary: 0,
    });

    /* State for dropdown options */
    const [availableSchemes, setAvailableSchemes] = useState<string[]>([]);
    const [availableSectors, setAvailableSectors] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, [currentDistrict, year]);

    const fetchData = async () => {
        if (!currentDistrict) return;

        setLoading(true);
        try {
            // 1. Fetch Main Data
            const { data: existingData, error } = await supabase
                .from('training_partner_analysis')
                .select('*')
                .eq('district_id', currentDistrict)
                .eq('time_period', year)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (existingData) {
                setData(existingData.map((d: any) => ({
                    ...d,
                    male_trained: Number(d.male_trained),
                    male_placed: Number(d.male_placed),
                    male_self_employed: Number(d.male_self_employed),
                    male_avg_salary: Number(d.male_avg_salary),
                    female_trained: Number(d.female_trained),
                    female_placed: Number(d.female_placed),
                    female_self_employed: Number(d.female_self_employed),
                    female_avg_salary: Number(d.female_avg_salary),
                })));
            } else {
                setData([]);
            }

            // 2. Fetch Schemes for Dropdown (from schemewise_analysis)
            const { data: schemes } = await supabase
                .from('schemewise_analysis')
                .select('scheme_name')
                .eq('district_id', currentDistrict)
                .eq('time_period', year);

            if (schemes) {
                const uniqueSchemes = Array.from(new Set(schemes.map((s: any) => s.scheme_name))) as string[];
                setAvailableSchemes(uniqueSchemes.sort());
            }

            // 3. Fetch Sectors for Dropdown (from sectorwise_analysis)
            const { data: sectors } = await supabase
                .from('sectorwise_analysis')
                .select('sector_name')
                .eq('district_id', currentDistrict)
                .eq('time_period', year);

            if (sectors) {
                const uniqueSectors = Array.from(new Set(sectors.map((s: any) => s.sector_name))) as string[];
                setAvailableSectors(uniqueSectors.sort());
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (field: keyof Omit<TrainingPartnerData, 'id'>, value: string) => {
        // Text fields are strings, numeric fields are numbers
        let val: string | number = value;
        if (['training_partner', 'scheme_name', 'sector_name', 'course_name'].includes(field)) {
            val = value;
        } else {
            val = value === '' ? 0 : Number(value);
        }
        setNewEntry(prev => ({ ...prev, [field]: val }));
    };

    const handleAddEntry = () => {
        if (!newEntry.training_partner.trim()) {
            setMessage({ type: 'error', text: 'Please enter a training partner name.' });
            return;
        }
        if (!newEntry.scheme_name.trim()) {
            setMessage({ type: 'error', text: 'Please enter a scheme name.' });
            return;
        }

        setData([...data, newEntry]);

        // Reset form
        setNewEntry({
            training_partner: '',
            scheme_name: '',
            sector_name: '',
            course_name: '',

            male_trained: 0,
            male_placed: 0,
            male_self_employed: 0,
            male_avg_salary: 0,
            female_trained: 0,
            female_placed: 0,
            female_self_employed: 0,
            female_avg_salary: 0,
        });
    }

    const handleDeleteRow = async (index: number) => {
        const rowToDelete = data[index];

        if (rowToDelete.id) {
            const { error } = await supabase
                .from('training_partner_analysis')
                .delete()
                .eq('id', rowToDelete.id);

            if (error) {
                console.error('Error deleting row:', error);
                setMessage({ type: 'error', text: 'Failed to delete row from database.' });
                return;
            }
        }

        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    }

    const handleInputChange = (index: number, field: keyof TrainingPartnerData, value: string) => {
        const newData = [...data];

        // Check if field is numeric or string
        if (['training_partner', 'scheme_name', 'sector_name', 'course_name'].includes(field)) {
            (newData[index] as any)[field] = value;
        } else {
            const numValue = value === '' ? 0 : Number(value);
            if (isNaN(numValue)) return;
            (newData[index] as any)[field] = numValue;
        }

        setData(newData);
    };

    // Calculate Totals for a single row
    const getRowTotals = (row: TrainingPartnerData) => {
        return {
            total_trained: row.male_trained + row.female_trained,
            total_placed: row.male_placed + row.female_placed,
            total_self_employed: row.male_self_employed + row.female_self_employed,
            // Avg Salary Logic: (Male Avg + Female Avg) / 2
            total_avg_salary: (row.male_avg_salary + row.female_avg_salary) / 2
        }
    }

    // Calculate totals for the form preview
    const formTotals = {
        total_trained: newEntry.male_trained + newEntry.female_trained,
        total_placed: newEntry.male_placed + newEntry.female_placed,
        total_self_employed: newEntry.male_self_employed + newEntry.female_self_employed,
        total_avg_salary: (newEntry.male_avg_salary + newEntry.female_avg_salary) / 2
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
                id: row.id,
                district_id: currentDistrict,
                time_period: year,

                training_partner: row.training_partner,
                scheme_name: row.scheme_name,
                sector_name: row.sector_name,
                course_name: row.course_name,

                male_trained: row.male_trained,
                male_placed: row.male_placed,
                male_self_employed: row.male_self_employed,
                male_avg_salary: row.male_avg_salary,

                female_trained: row.female_trained,
                female_placed: row.female_placed,
                female_self_employed: row.female_self_employed,
                female_avg_salary: row.female_avg_salary,
            }));

            const { data: savedData, error } = await supabase
                .from('training_partner_analysis')
                .upsert(payload, { onConflict: 'district_id, time_period, training_partner, scheme_name, sector_name, course_name' })
                .select();

            if (error) throw error;

            if (savedData) {
                fetchData();
            }

            setMessage({ type: 'success', text: 'Data saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            console.error('Error saving data:', err);
            setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
        } finally {
            setSaving(false);
        }
    };

    const handleExportCSV = () => {
        const csvData = data.map((row, index) => {
            const totals = getRowTotals(row);
            return {
                'S.No': index + 1,
                'Training Partner': row.training_partner,
                'Scheme': row.scheme_name,
                'Sector': row.sector_name,
                'Course': row.course_name,

                'Male Trained': row.male_trained,
                'Male Placed': row.male_placed,
                'Male Self Emp': row.male_self_employed,
                'Male Avg Salary': row.male_avg_salary,

                'Female Trained': row.female_trained,
                'Female Placed': row.female_placed,
                'Female Self Emp': row.female_self_employed,
                'Female Avg Salary': row.female_avg_salary,

                'Total Trained': totals.total_trained,
                'Total Placed': totals.total_placed,
                'Total Self Emp': totals.total_self_employed,
                'Total Avg Salary': totals.total_avg_salary,
            }
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Training_Partner_Analysis_${currentDistrict}_${year}.csv`);
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

                const mergedData = [...data];

                let newCount = 0;
                let updateCount = 0;

                parsedData.forEach((row: any) => {
                    const partner = row['Training Partner'];
                    const scheme = row['Scheme'];
                    const sector = row['Sector'];
                    const course = row['Course'];

                    if (!partner || !scheme) return;

                    // Find match base on composite key? 
                    // Ideally match on all 4 text fields.
                    const existingIndex = mergedData.findIndex(d =>
                        d.training_partner.toLowerCase() === partner.toLowerCase() &&
                        d.scheme_name.toLowerCase() === scheme.toLowerCase() &&
                        d.sector_name.toLowerCase() === (sector || '').toLowerCase() &&
                        d.course_name.toLowerCase() === (course || '').toLowerCase()
                    );

                    const newEntry = {
                        training_partner: partner,
                        scheme_name: scheme,
                        sector_name: sector || '',
                        course_name: course || '',

                        male_trained: Number(row['Male Trained']) || 0,
                        male_placed: Number(row['Male Placed']) || 0,
                        male_self_employed: Number(row['Male Self Emp']) || 0,
                        male_avg_salary: Number(row['Male Avg Salary']) || 0,
                        female_trained: Number(row['Female Trained']) || 0,
                        female_placed: Number(row['Female Placed']) || 0,
                        female_self_employed: Number(row['Female Self Emp']) || 0,
                        female_avg_salary: Number(row['Female Avg Salary']) || 0,
                    };

                    if (existingIndex !== -1) {
                        mergedData[existingIndex] = { ...mergedData[existingIndex], ...newEntry };
                        updateCount++;
                    } else {
                        mergedData.push(newEntry);
                        newCount++;
                    }
                });

                setData(mergedData);
                setMessage({ type: 'success', text: `Imported: ${newCount} new, ${updateCount} updated.` });
            },
            error: () => {
                setMessage({ type: 'error', text: 'Error parsing CSV.' });
            }
        });

        event.target.value = '';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Table D: Training Partner Analysis</h2>
                    <p className="text-sm text-gray-500">Data for {currentDistrict} - Year {year}</p>
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

            {/* Add New Entry Form */}
            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Add New Training Partner Entry</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Training Partner</label>
                        <input
                            type="text"
                            value={newEntry.training_partner}
                            onChange={(e) => handleFormChange('training_partner', e.target.value)}
                            placeholder="Enter Training Partner Name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Scheme</label>
                        <input
                            type="text"
                            list="scheme-options"
                            value={newEntry.scheme_name}
                            onChange={(e) => handleFormChange('scheme_name', e.target.value)}
                            placeholder="Select or Enter Scheme Name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                        <datalist id="scheme-options">
                            {availableSchemes.map(scheme => (
                                <option key={scheme} value={scheme} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sector</label>
                        <input
                            type="text"
                            list="sector-options"
                            value={newEntry.sector_name}
                            onChange={(e) => handleFormChange('sector_name', e.target.value)}
                            placeholder="Select or Enter Sector Name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                        <datalist id="sector-options">
                            {availableSectors.map(sector => (
                                <option key={sector} value={sector} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / QP NOS</label>
                        <input
                            type="text"
                            value={newEntry.course_name}
                            onChange={(e) => handleFormChange('course_name', e.target.value)}
                            placeholder="Enter Course Code/Name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Male Section */}
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Male Candidates
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Trained</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newEntry.male_trained || ''} onChange={(e) => handleFormChange('male_trained', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Placed</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newEntry.male_placed || ''} onChange={(e) => handleFormChange('male_placed', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Self Employed</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newEntry.male_self_employed || ''} onChange={(e) => handleFormChange('male_self_employed', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Avg Salary</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newEntry.male_avg_salary || ''} onChange={(e) => handleFormChange('male_avg_salary', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Female Section */}
                    <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
                        <h4 className="text-sm font-bold text-pink-800 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-500"></span> Female Candidates
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Trained</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                                    value={newEntry.female_trained || ''} onChange={(e) => handleFormChange('female_trained', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Placed</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                                    value={newEntry.female_placed || ''} onChange={(e) => handleFormChange('female_placed', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Self Employed</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                                    value={newEntry.female_self_employed || ''} onChange={(e) => handleFormChange('female_self_employed', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Avg Salary</label>
                                <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                                    value={newEntry.female_avg_salary || ''} onChange={(e) => handleFormChange('female_avg_salary', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Totals Preview Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-500"></span> Total (Auto-Calculated)
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-2 rounded border border-gray-200">
                                <span className="block text-xs text-gray-400">Total Trained</span>
                                <span className="font-bold text-gray-900">{formTotals.total_trained}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-gray-200">
                                <span className="block text-xs text-gray-400">Total Placed</span>
                                <span className="font-bold text-gray-900">{formTotals.total_placed}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-gray-200">
                                <span className="block text-xs text-gray-400">Total Self Emp</span>
                                <span className="font-bold text-gray-900">{formTotals.total_self_employed}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-gray-200">
                                <span className="block text-xs text-gray-400">Avg Salary</span>
                                <span className="font-bold text-gray-900">{formTotals.total_avg_salary.toFixed(0)}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleAddEntry}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Entry to Table
                            </button>
                        </div>
                    </div>
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
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 w-12">S.No</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[200px]">Training Partner</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[150px]">Scheme</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[150px]">Sector</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[150px]">Course</th>

                                <th colSpan={4} className="px-4 py-3 border-r border-gray-200 text-center bg-blue-50/50">Male</th>
                                <th colSpan={4} className="px-4 py-3 border-r border-gray-200 text-center bg-pink-50/50">Female</th>
                                <th colSpan={4} className="px-4 py-3 text-center bg-gray-100">Total</th>
                                <th rowSpan={2} className="px-2 py-3 w-10"></th>
                            </tr>
                            <tr>
                                {/* Male headers */}
                                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50/50 min-w-[70px]">Trained</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50/50 min-w-[70px]">Placed</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50/50 min-w-[70px]">Self Emp</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50/50 min-w-[70px]">Avg Salary</th>

                                {/* Female headers */}
                                <th className="px-2 py-2 border-r border-gray-200 bg-pink-50/50 min-w-[70px]">Trained</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-pink-50/50 min-w-[70px]">Placed</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-pink-50/50 min-w-[70px]">Self Emp</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-pink-50/50 min-w-[70px]">Avg Salary</th>

                                {/* Total headers */}
                                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[70px]">Trained</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[70px]">Placed</th>
                                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[70px]">Self Emp</th>
                                <th className="px-2 py-2 bg-gray-100 min-w-[70px]">Avg Salary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row, index) => {
                                const totals = getRowTotals(row);
                                return (
                                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors group">
                                        <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200">
                                            {index + 1}
                                        </td>
                                        {/* Text Inputs */}
                                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.training_partner} onChange={(e) => handleInputChange(index, 'training_partner', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.scheme_name} onChange={(e) => handleInputChange(index, 'scheme_name', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.sector_name} onChange={(e) => handleInputChange(index, 'sector_name', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.course_name} onChange={(e) => handleInputChange(index, 'course_name', e.target.value)} /></td>

                                        {/* Male Inputs */}
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.male_trained || ''} onChange={(e) => handleInputChange(index, 'male_trained', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.male_placed || ''} onChange={(e) => handleInputChange(index, 'male_placed', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.male_self_employed || ''} onChange={(e) => handleInputChange(index, 'male_self_employed', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.male_avg_salary || ''} onChange={(e) => handleInputChange(index, 'male_avg_salary', e.target.value)} /></td>

                                        {/* Female Inputs */}
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-pink-50 rounded" value={row.female_trained || ''} onChange={(e) => handleInputChange(index, 'female_trained', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-pink-50 rounded" value={row.female_placed || ''} onChange={(e) => handleInputChange(index, 'female_placed', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-pink-50 rounded" value={row.female_self_employed || ''} onChange={(e) => handleInputChange(index, 'female_self_employed', e.target.value)} /></td>
                                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-pink-50 rounded" value={row.female_avg_salary || ''} onChange={(e) => handleInputChange(index, 'female_avg_salary', e.target.value)} /></td>

                                        {/* Calculated Totals */}
                                        <td className="px-2 py-3 text-center bg-gray-50 border-r border-gray-200 text-gray-700 font-medium">{totals.total_trained}</td>
                                        <td className="px-2 py-3 text-center bg-gray-50 border-r border-gray-200 text-gray-700 font-medium">{totals.total_placed}</td>
                                        <td className="px-2 py-3 text-center bg-gray-50 border-r border-gray-200 text-gray-700 font-medium">{totals.total_self_employed}</td>
                                        <td className="px-2 py-3 text-center bg-gray-50 text-gray-700 font-medium">{totals.total_avg_salary.toFixed(0)}</td>

                                        <td className="px-2 py-2 text-center">
                                            <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={17} className="px-6 py-12 text-center text-gray-500 italic">
                                        No training partner data added yet. Use the form above to add a new entry.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
