import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, Download, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { SECTORS, getTradesForSector } from '../../data/sectors';
import { useAuthStore } from '../../store/useAuthStore';

interface Trainer {
    id: string;
    sno: number;
    centre_name: string;
    title: string;
    first_name: string;
    last_name: string;
    dob: string;
    qualification: string;
    phone: string;
    email: string;
    industry_exp: string;
    doj: string;
    training_exp: string;
    sector: string;
    trade: string;
    certified_by: string;
    valid_till: string;
    portal_uploaded: string;
    remarks: string;
}

interface TrainerSectionProps {
    onBack: () => void;
}

export default function TrainerSection({ onBack }: TrainerSectionProps) {
    const { currentDistrict } = useAuthStore();
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initialFormState = {
        centre_name: '',
        title: 'Mr',
        first_name: '',
        last_name: '',
        dob: '',
        qualification: '',
        phone: '',
        email: '',
        industry_exp: '',
        doj: '',
        training_exp: '',
        sector: '',
        trade: '',
        certified_by: '',
        valid_till: '',
        portal_uploaded: '',
        remarks: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (currentDistrict) {
            fetchTrainers();
        }
    }, [currentDistrict]);

    const fetchTrainers = async () => {
        if (!currentDistrict) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('district_trainers')
                .select('*')
                .eq('district_name', currentDistrict)
                .order('sno', { ascending: true });

            if (error) throw error;
            setTrainers(data || []);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentDistrict) return;
        if (!formData.first_name || !formData.sector || !formData.trade) {
            alert('Please fill required fields: First Name, Sector, Trade');
            return;
        }

        try {
            const payload = {
                ...formData,
                district_name: currentDistrict,
                sno: isEditing ? trainers.find(t => t.id === isEditing)?.sno : trainers.length + 1
            };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('district_trainers')
                    .update(payload)
                    .eq('id', isEditing);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('district_trainers')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            await fetchTrainers();
            resetForm();
        } catch (error: any) {
            console.error('Error saving trainer:', error);
            alert('Error saving trainer: ' + error.message);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Delete this trainer?')) return;

        try {
            const { error } = await supabase.from('district_trainers').delete().eq('id', id);
            if (error) throw error;
            fetchTrainers();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleEdit = (trainer: Trainer) => {
        setIsEditing(trainer.id);
        setFormData({
            centre_name: trainer.centre_name,
            title: trainer.title,
            first_name: trainer.first_name,
            last_name: trainer.last_name,
            dob: trainer.dob,
            qualification: trainer.qualification,
            phone: trainer.phone,
            email: trainer.email,
            industry_exp: trainer.industry_exp,
            doj: trainer.doj,
            training_exp: trainer.training_exp,
            sector: trainer.sector,
            trade: trainer.trade,
            certified_by: trainer.certified_by,
            valid_till: trainer.valid_till,
            portal_uploaded: trainer.portal_uploaded,
            remarks: trainer.remarks
        });
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(null);
        setIsFormOpen(false);
    };

    // CSV Functions
    const handleDownloadCSV = () => {
        const headers = [
            'S.No', 'Centre Name', 'Title', 'First Name', 'Last Name', 'DOB',
            'Qualification', 'Phone', 'Email', 'Industry Exp', 'DOJ', 'Training Exp',
            'Sector', 'Trade', 'Certified By', 'Valid Till', 'Portal', 'Remarks'
        ];

        const csvContent = [
            headers.join(','),
            ...trainers.map(t => [
                t.sno,
                `"${(t.centre_name || '').replace(/"/g, '""')}"`,
                t.title,
                `"${(t.first_name || '').replace(/"/g, '""')}"`,
                `"${(t.last_name || '').replace(/"/g, '""')}"`,
                t.dob,
                `"${(t.qualification || '').replace(/"/g, '""')}"`,
                `"${t.phone}"`,
                `"${t.email}"`,
                `"${t.industry_exp}"`,
                t.doj,
                `"${t.training_exp}"`,
                `"${t.sector}"`,
                `"${t.trade}"`,
                `"${(t.certified_by || '').replace(/"/g, '""')}"`,
                t.valid_till,
                `"${(t.portal_uploaded || '').replace(/"/g, '""')}"`,
                `"${(t.remarks || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentDistrict}_Trainers.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentDistrict) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            setIsLoading(true);
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const newTrainersPayload = [];

                const currentMaxSno = trainers.length > 0 ? Math.max(...trainers.map(t => t.sno)) : 0;
                let nextSno = currentMaxSno + 1;

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
                    const cols = matches || line.split(',');

                    const clean = (val: string | undefined) => val ? val.trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';

                    if (cols && cols.length >= 18) {
                        newTrainersPayload.push({
                            district_name: currentDistrict,
                            sno: nextSno++,
                            centre_name: clean(cols[1]),
                            title: clean(cols[2]),
                            first_name: clean(cols[3]),
                            last_name: clean(cols[4]),
                            dob: clean(cols[5]),
                            qualification: clean(cols[6]),
                            phone: clean(cols[7]),
                            email: clean(cols[8]),
                            industry_exp: clean(cols[9]),
                            doj: clean(cols[10]),
                            training_exp: clean(cols[11]),
                            sector: clean(cols[12]),
                            trade: clean(cols[13]),
                            certified_by: clean(cols[14]),
                            valid_till: clean(cols[15]),
                            portal_uploaded: clean(cols[16]),
                            remarks: clean(cols[17])
                        });
                    }
                }

                if (newTrainersPayload.length > 0) {
                    const { error } = await supabase
                        .from('district_trainers')
                        .insert(newTrainersPayload);

                    if (error) throw error;

                    alert(`Successfully imported ${newTrainersPayload.length} trainers.`);
                    fetchTrainers();
                }
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Error uploading CSV: ' + error.message);
            } finally {
                setIsLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Trainer Data
                            {isLoading && <span className="ml-4 text-sm font-normal text-slate-400">Loading...</span>}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleUploadCSV}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            title="Upload CSV"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="hidden md:inline">Import</span>
                        </button>
                        <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            title="Download CSV"
                        >
                            <Download className="w-5 h-5" />
                            <span className="hidden md:inline">Export</span>
                        </button>

                        {!isFormOpen && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Trainer
                            </button>
                        )}
                    </div>
                </div>

                {isFormOpen && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                                {isEditing ? 'Edit Trainer' : 'Add New Trainer'}
                            </h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Centre Name</label>
                                <input type="text" value={formData.centre_name} onChange={e => setFormData({ ...formData, centre_name: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                                <select value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                                    <option value="Mr">Mr</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">First Name *</label>
                                <input type="text" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Last Name</label>
                                <input type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">DOB</label>
                                <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Qualification</label>
                                <input type="text" value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Industry Exp</label>
                                <input type="text" value={formData.industry_exp} onChange={e => setFormData({ ...formData, industry_exp: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">DOJ</label>
                                <input type="date" value={formData.doj} onChange={e => setFormData({ ...formData, doj: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Training Exp</label>
                                <input type="text" value={formData.training_exp} onChange={e => setFormData({ ...formData, training_exp: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>

                            <div className="col-span-full mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                <h4 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">Certification Details</h4>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Sector *</label>
                                <select value={formData.sector} onChange={e => setFormData({ ...formData, sector: e.target.value, trade: '' })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                                    <option value="">Select Sector</option>
                                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Trade *</label>
                                <select value={formData.trade} onChange={e => setFormData({ ...formData, trade: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" disabled={!formData.sector}>
                                    <option value="">Select Trade</option>
                                    {formData.sector && getTradesForSector(formData.sector).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Certified By</label>
                                <input type="text" value={formData.certified_by} onChange={e => setFormData({ ...formData, certified_by: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Valid Till</label>
                                <input type="date" value={formData.valid_till} onChange={e => setFormData({ ...formData, valid_till: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Portal Uploaded</label>
                                <input type="text" value={formData.portal_uploaded} onChange={e => setFormData({ ...formData, portal_uploaded: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Remarks</label>
                                <textarea value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" rows={2} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={resetForm} className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Trainer
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3 w-16 text-center">S.No</th>
                                <th className="p-3">Centre Name</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">DOB</th>
                                <th className="p-3">Qualification</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Industry Exp</th>
                                <th className="p-3">DOJ</th>
                                <th className="p-3">Training Exp</th>
                                <th className="p-3">Sector</th>
                                <th className="p-3">Trade</th>
                                <th className="p-3">Certified By</th>
                                <th className="p-3">Valid Till</th>
                                <th className="p-3">Portal Uploaded</th>
                                <th className="p-3 min-w-[200px]">Remarks</th>
                                <th className="p-3 w-24 text-center sticky right-0 bg-slate-50 dark:bg-slate-900 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {trainers.length === 0 ? (
                                <tr>
                                    <td colSpan={17} className="p-8 text-center text-slate-500">No trainers added yet. Click "Add New Trainer" to begin.</td>
                                </tr>
                            ) : (
                                trainers.map((trainer) => (
                                    <tr key={trainer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 text-center text-slate-500">{trainer.sno}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.centre_name}</td>
                                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                                            {trainer.title} {trainer.first_name} {trainer.last_name}
                                        </td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.dob}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.qualification}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.phone}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.email}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.industry_exp}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.doj}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.training_exp}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.sector}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.trade}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.certified_by}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.valid_till}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{trainer.portal_uploaded}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={trainer.remarks}>{trainer.remarks}</td>
                                        <td className="p-3 sticky right-0 bg-white dark:bg-slate-900 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(trainer)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={(e) => handleDelete(trainer.id, e)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
