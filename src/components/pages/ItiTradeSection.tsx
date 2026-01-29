import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, Download, Upload, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';

// Type for District Data (Editable)
interface DistrictItiStat {
    id: string;
    district_name: string;
    sno: number;
    sector_name: string;
    trade_name: string;
    nsqf_level: string;
    duration: string;
    iti_count: number;
    seat_count_current: number;
    trainee_count_current: number;
    seat_count_previous: number;
    trainee_count_previous: number;
    seat_utilization_previous: string; // "Seat Utilization Previous (2nd Year)"
    number_passed: number;
    number_placed: number;
    avg_salary: string;
    self_employed: number;
    not_eligible: number;
}

// Type for State Data (Read-Only Comprehensive)
interface StateItiStat {
    id: string;
    sector_name: string;
    trade_name: string;
    nsqf_level: string;
    duration: string;
    iti_count: number;
    seat_count_current: number;
    trainee_count_current: number;
    seat_utilization_current: string;
    seat_count_previous: number;
    trainee_count_previous: number;
    seat_utilization_previous: string;
    seat_count_total: number;
    trainee_count_total: number;
    seat_utilization_total: string;
    trainee_count_previous_2nd_year: number;
}

interface ItiTradeSectionProps {
    onBack: () => void;
}

export default function ItiTradeSection({ onBack }: ItiTradeSectionProps) {
    const { currentDistrict } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'district' | 'state'>('district');

    // District Data State
    const [districtStats, setDistrictStats] = useState<DistrictItiStat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State Data State
    const [stateStats, setStateStats] = useState<StateItiStat[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const initialFormState = {
        sector_name: '',
        trade_name: '',
        nsqf_level: '',
        duration: '',
        iti_count: '',
        seat_count_current: '',
        trainee_count_current: '',
        seat_count_previous: '',
        trainee_count_previous: '',
        seat_utilization_previous: '',
        number_passed: '',
        number_placed: '',
        avg_salary: '',
        self_employed: '',
        not_eligible: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (currentDistrict) {
            fetchDistrictData();
        }
        fetchStateData();
    }, [currentDistrict]);

    const fetchDistrictData = async () => {
        if (!currentDistrict) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('district_iti_stats')
                .select('*')
                .eq('district_name', currentDistrict)
                .order('sno', { ascending: true });

            if (error) throw error;
            setDistrictStats(data || []);
        } catch (error) {
            console.error('Error fetching district ITI stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStateData = async () => {
        try {
            const { data, error } = await supabase
                .from('state_iti_stats')
                .select('*')
                .order('sector_name', { ascending: true });

            if (error) throw error;
            setStateStats(data || []);
        } catch (error) {
            console.error('Error fetching state ITI stats:', error);
        }
    };

    const handleSave = async () => {
        if (!currentDistrict) return;

        try {
            const payload = {
                district_name: currentDistrict,
                sno: isEditing ? districtStats.find(s => s.id === isEditing)?.sno : districtStats.length + 1,
                sector_name: formData.sector_name,
                trade_name: formData.trade_name,
                nsqf_level: formData.nsqf_level,
                duration: formData.duration,
                iti_count: parseInt(formData.iti_count) || 0,
                seat_count_current: parseInt(formData.seat_count_current) || 0,
                trainee_count_current: parseInt(formData.trainee_count_current) || 0,
                seat_count_previous: parseInt(formData.seat_count_previous) || 0,
                trainee_count_previous: parseInt(formData.trainee_count_previous) || 0,
                seat_utilization_previous: formData.seat_utilization_previous,
                number_passed: parseInt(formData.number_passed) || 0,
                number_placed: parseInt(formData.number_placed) || 0,
                avg_salary: formData.avg_salary,
                self_employed: parseInt(formData.self_employed) || 0,
                not_eligible: parseInt(formData.not_eligible) || 0
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('district_iti_stats')
                    .update(payload)
                    .eq('id', isEditing);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('district_iti_stats')
                    .insert([payload]);
                if (error) throw error;
            }

            await fetchDistrictData();
            handleReset();
        } catch (error: any) {
            alert('Error saving data: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            const { error } = await supabase.from('district_iti_stats').delete().eq('id', id);
            if (error) throw error;
            fetchDistrictData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = () => {
        setFormData(initialFormState);
        setIsEditing(null);
        setIsFormOpen(false);
    };

    const handleEdit = (item: DistrictItiStat) => {
        setFormData({
            sector_name: item.sector_name,
            trade_name: item.trade_name,
            nsqf_level: item.nsqf_level,
            duration: item.duration,
            iti_count: item.iti_count.toString(),
            seat_count_current: item.seat_count_current.toString(),
            trainee_count_current: item.trainee_count_current.toString(),
            seat_count_previous: item.seat_count_previous.toString(),
            trainee_count_previous: item.trainee_count_previous.toString(),
            seat_utilization_previous: item.seat_utilization_previous,
            number_passed: item.number_passed.toString(),
            number_placed: item.number_placed.toString(),
            avg_salary: item.avg_salary,
            self_employed: item.self_employed.toString(),
            not_eligible: item.not_eligible.toString()
        });
        setIsEditing(item.id);
        setIsFormOpen(true);
    };

    // CSV Handlers (Simplified for brevity, similar logic to other components)
    const handleDownloadCSV = () => {
        // Implementation for downloading districtStats
        if (districtStats.length === 0) return alert('No data to export');

        const headers = [
            'S.No', 'Sector', 'Trade', 'NSQF', 'Duration', 'ITI Count',
            'Seats (Cur)', 'Trainees (Cur)', 'Seats (Prev)', 'Trainees (Prev)',
            'Util (Prev 2nd Yr)', 'Passed', 'Placed', 'Salary', 'Self Emp', 'Not Eligible'
        ];

        const csvContent = [
            headers.join(','),
            ...districtStats.map(d => [
                d.sno,
                `"${d.sector_name}"`,
                `"${d.trade_name}"`,
                d.nsqf_level,
                d.duration,
                d.iti_count,
                d.seat_count_current,
                d.trainee_count_current,
                d.seat_count_previous,
                d.trainee_count_previous,
                d.seat_utilization_previous,
                d.number_passed,
                d.number_placed,
                d.avg_salary,
                d.self_employed,
                d.not_eligible
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ITI_Stats_${currentDistrict}.csv`;
        a.click();
    };

    const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentDistrict) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(l => l.trim());
                // Skip header, process lines...
                // Ideally reuse the robust parser from SchemesSection or TrainerSection
                // For now, basic implementation:

                const payload = [];
                let sno = (districtStats.length > 0 ? Math.max(...districtStats.map(d => d.sno)) : 0) + 1;

                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
                    if (cols.length < 5) continue;

                    // Check column mapping based on standard template
                    payload.push({
                        district_name: currentDistrict,
                        sno: sno++,
                        sector_name: cols[1] || '',
                        trade_name: cols[2] || '',
                        nsqf_level: cols[3] || '',
                        duration: cols[4] || '',
                        iti_count: parseInt(cols[5]) || 0,
                        seat_count_current: parseInt(cols[6]) || 0,
                        trainee_count_current: parseInt(cols[7]) || 0,
                        seat_count_previous: parseInt(cols[8]) || 0,
                        trainee_count_previous: parseInt(cols[9]) || 0,
                        seat_utilization_previous: cols[10] || '',
                        number_passed: parseInt(cols[11]) || 0,
                        number_placed: parseInt(cols[12]) || 0,
                        avg_salary: cols[13] || '',
                        self_employed: parseInt(cols[14]) || 0,
                        not_eligible: parseInt(cols[15]) || 0
                    });
                }

                if (payload.length > 0) {
                    const { error } = await supabase.from('district_iti_stats').insert(payload);
                    if (error) throw error;
                    alert(`Imported ${payload.length} records`);
                    fetchDistrictData();
                }
            } catch (err: any) {
                alert('Import failed: ' + err.message);
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };


    const filteredStateStats = stateStats.filter(s =>
        s.sector_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.trade_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                ITI Trade Statistics
                                {isLoading && <span className="ml-4 text-sm font-normal text-slate-400">Loading...</span>}
                            </h1>
                            <p className="text-slate-500 text-sm">Manage district data and view state averages</p>
                        </div>
                    </div>

                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setActiveTab('district')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'district' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                        >
                            My District Data
                        </button>
                        <button
                            onClick={() => setActiveTab('state')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'state' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                        >
                            Comprehensive View
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

                    {activeTab === 'district' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">District Entries</h2>
                                <div className="flex gap-2">
                                    <input type="file" ref={fileInputRef} onChange={handleUploadCSV} className="hidden" accept=".csv" />
                                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                        <Upload className="w-4 h-4" /> Import CSV
                                    </button>
                                    <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                        <Download className="w-4 h-4" /> Export CSV
                                    </button>
                                    <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                        <Plus className="w-4 h-4" /> Add Record
                                    </button>
                                </div>
                            </div>

                            {/* Add/Edit Form */}
                            {isFormOpen && (
                                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{isEditing ? 'Edit Record' : 'Add New Record'}</h3>
                                        <button onClick={handleReset}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {Object.keys(initialFormState).map((key) => (
                                            <div key={key}>
                                                <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                                                <input
                                                    type={['sector_name', 'trade_name', 'nsqf_level', 'duration', 'seat_utilization_previous', 'avg_salary'].includes(key) ? 'text' : 'number'}
                                                    className="w-full p-2 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                                    value={(formData as any)[key]}
                                                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button onClick={handleReset} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm">Cancel</button>
                                        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                                            <Save className="w-4 h-4" /> Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                                        <tr>
                                            <th className="p-3 w-16 text-center">S.No</th>
                                            <th className="p-3">Sector</th>
                                            <th className="p-3">Trade</th>
                                            <th className="p-3">Level</th>
                                            <th className="p-3">Duration</th>
                                            <th className="p-3">ITI Count</th>
                                            <th className="p-3">Seats (Cur)</th>
                                            <th className="p-3">Trainees (Cur)</th>
                                            <th className="p-3">Seats (Prev)</th>
                                            <th className="p-3">Trainees (Prev)</th>
                                            <th className="p-3">Util (Prev 2nd Yr)</th>
                                            <th className="p-3">Passed</th>
                                            <th className="p-3">Placed</th>
                                            <th className="p-3">Avg Salary</th>
                                            <th className="p-3">Self Emp</th>
                                            <th className="p-3">Not Eligible</th>
                                            <th className="p-3 text-center sticky right-0 bg-slate-50 dark:bg-slate-900 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {districtStats.map((stat) => (
                                            <tr key={stat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 text-center text-slate-500">{stat.sno}</td>
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{stat.sector_name}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.trade_name}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.nsqf_level}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.duration}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.iti_count}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.seat_count_current}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.trainee_count_current}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.seat_count_previous}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.trainee_count_previous}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.seat_utilization_previous}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.number_passed}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.number_placed}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.avg_salary}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.self_employed}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{stat.not_eligible}</td>
                                                <td className="p-3 sticky right-0 bg-white dark:bg-slate-900 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => handleEdit(stat)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDelete(stat.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {districtStats.length === 0 && <div className="p-8 text-center text-slate-500">No records found. Import CSV or Add New.</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'state' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">State Comprehensive Data</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search Sector or Trade..."
                                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                                        <tr>
                                            <th className="p-3">Sector</th>
                                            <th className="p-3">Trade</th>
                                            <th className="p-3">Level</th>
                                            <th className="p-3">Duration</th>
                                            <th className="p-3 text-right">ITI Count</th>
                                            <th className="p-3 text-right">Seats (Total)</th>
                                            <th className="p-3 text-right">Trainees (Total)</th>
                                            <th className="p-3 text-right">Util %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {filteredStateStats.map((stat) => (
                                            <tr key={stat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 font-medium">{stat.sector_name}</td>
                                                <td className="p-3">{stat.trade_name}</td>
                                                <td className="p-3">{stat.nsqf_level}</td>
                                                <td className="p-3">{stat.duration}</td>
                                                <td className="p-3 text-right">{stat.iti_count}</td>
                                                <td className="p-3 text-right">{stat.seat_count_total}</td>
                                                <td className="p-3 text-right">{stat.trainee_count_total}</td>
                                                <td className="p-3 text-right">{stat.seat_utilization_total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredStateStats.length === 0 && <div className="p-8 text-center text-slate-500">No matching records found.</div>}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
