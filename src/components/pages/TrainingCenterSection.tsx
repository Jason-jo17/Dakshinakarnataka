import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Download, Upload, ArrowLeft } from 'lucide-react';
import * as Papa from 'papaparse';
import { supabase } from '../../lib/supabaseClient';

interface TrainingCenter {
    id: string;
    sno: number;
    training_center_name: string;
    center_address1: string;
    center_address2: string;
    block: string;
    district: string;
    pincode: string;
    year_started: string;
    class_room_count: string;
    seating_capacity: string;
    capacity_of_lab: string;
    is_residential: 'Y' | 'N';
    hostel_capacity_men: string;
    hostel_capacity_women: string;
    distance_hostel_center: string;
    contact_person_name: string;
    contact_role: string;
    contact_phone: string;
    contact_email: string;
    schemes_empanelled: string;
    funding_source: string;
    scheme_url: string;
    trades_offered: string;
    sectors: string;
    trained_last_year: string;
    placed_last_year: string;
}

const initialFormState = {
    training_center_name: '',
    center_address1: '',
    center_address2: '',
    block: '',
    district: 'Dakshina Kannada',
    pincode: '',
    year_started: '',
    class_room_count: '',
    seating_capacity: '',
    capacity_of_lab: '',
    is_residential: 'N' as 'Y' | 'N',
    hostel_capacity_men: '',
    hostel_capacity_women: '',
    distance_hostel_center: '',
    contact_person_name: '',
    contact_role: '',
    contact_phone: '',
    contact_email: '',
    schemes_empanelled: '',
    funding_source: '',
    scheme_url: '',
    trades_offered: '',
    sectors: '',
    trained_last_year: '',
    placed_last_year: ''
};

const TrainingCenterSection: React.FC<{ onBack?: () => void; isRestricted?: boolean }> = ({ onBack, isRestricted }) => {
    const [centers, setCenters] = useState<TrainingCenter[]>([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchCenters();
    }, []);

    const fetchCenters = async () => {
        const { data } = await supabase
            .from('district_training_centers')
            .select('*')
            .order('created_at', { ascending: true });

        if (data) {
            setCenters(data.map((item: any, index: number) => ({
                id: item.id,
                sno: index + 1,
                training_center_name: item.training_center_name,
                center_address1: item.center_address1 || '',
                center_address2: item.center_address2 || '',
                block: item.block || '',
                district: item.district || 'Dakshina Kannada',
                pincode: item.pincode || '',
                year_started: item.year_started || '',
                class_room_count: item.class_room_count?.toString() || '',
                seating_capacity: item.seating_capacity?.toString() || '',
                capacity_of_lab: item.capacity_of_lab?.toString() || '',
                is_residential: item.is_residential || 'N',
                hostel_capacity_men: item.hostel_capacity_men?.toString() || '',
                hostel_capacity_women: item.hostel_capacity_women?.toString() || '',
                distance_hostel_center: item.distance_hostel_center || '',
                contact_person_name: item.contact_person_name || '',
                contact_role: item.contact_role || '',
                contact_phone: item.contact_phone || '',
                contact_email: item.contact_email || '',
                schemes_empanelled: item.schemes_empanelled || '',
                funding_source: item.funding_source || '',
                scheme_url: item.scheme_url || '',
                trades_offered: item.trades_offered || '',
                sectors: item.sectors || '',
                trained_last_year: item.trained_last_year?.toString() || '',
                placed_last_year: item.placed_last_year?.toString() || ''
            })));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSave = {
            training_center_name: formData.training_center_name,
            center_address1: formData.center_address1,
            center_address2: formData.center_address2,
            block: formData.block,
            district: formData.district,
            pincode: formData.pincode,
            year_started: formData.year_started,
            class_room_count: parseInt(formData.class_room_count) || 0,
            seating_capacity: parseInt(formData.seating_capacity) || 0,
            capacity_of_lab: parseInt(formData.capacity_of_lab) || 0,
            is_residential: formData.is_residential,
            hostel_capacity_men: parseInt(formData.hostel_capacity_men) || 0,
            hostel_capacity_women: parseInt(formData.hostel_capacity_women) || 0,
            distance_hostel_center: formData.distance_hostel_center,
            contact_person_name: formData.contact_person_name,
            contact_role: formData.contact_role,
            contact_phone: formData.contact_phone,
            contact_email: formData.contact_email,
            schemes_empanelled: formData.schemes_empanelled,
            funding_source: formData.funding_source,
            scheme_url: formData.scheme_url,
            trades_offered: formData.trades_offered,
            sectors: formData.sectors,
            trained_last_year: parseInt(formData.trained_last_year) || 0,
            placed_last_year: parseInt(formData.placed_last_year) || 0
        };

        if (isEditing && editId) {
            const { error } = await supabase
                .from('district_training_centers')
                .update(dataToSave)
                .eq('id', editId);

            if (!error) {
                fetchCenters();
                setIsEditing(false);
                setEditId(null);
            } else {
                console.error("Error updating center:", error);
                alert("Failed to update center.");
            }
        } else {
            const { error } = await supabase
                .from('district_training_centers')
                .insert([dataToSave]);

            if (!error) {
                fetchCenters();
            } else {
                console.error("Error adding center:", error);
                alert("Failed to add center.");
            }
        }
        setFormData(initialFormState);
    };

    const handleEdit = (item: TrainingCenter) => {
        setFormData({
            training_center_name: item.training_center_name,
            center_address1: item.center_address1,
            center_address2: item.center_address2,
            block: item.block,
            district: item.district,
            pincode: item.pincode,
            year_started: item.year_started,
            class_room_count: item.class_room_count,
            seating_capacity: item.seating_capacity,
            capacity_of_lab: item.capacity_of_lab,
            is_residential: item.is_residential,
            hostel_capacity_men: item.hostel_capacity_men,
            hostel_capacity_women: item.hostel_capacity_women,
            distance_hostel_center: item.distance_hostel_center,
            contact_person_name: item.contact_person_name,
            contact_role: item.contact_role,
            contact_phone: item.contact_phone,
            contact_email: item.contact_email,
            schemes_empanelled: item.schemes_empanelled,
            funding_source: item.funding_source,
            scheme_url: item.scheme_url,
            trades_offered: item.trades_offered,
            sectors: item.sectors,
            trained_last_year: item.trained_last_year,
            placed_last_year: item.placed_last_year
        });
        setIsEditing(true);
        setEditId(item.id);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            const { error } = await supabase
                .from('district_training_centers')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchCenters();
            } else {
                console.error("Error deleting center:", error);
                alert("Failed to delete center.")
            }
        }
    };

    const handleExport = () => {
        const csv = Papa.unparse(centers);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'training_centers_data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results: Papa.ParseResult<any>) => {
                    const importedData = results.data as any[];
                    const newCenters = importedData.map((item, index) => ({
                        ...initialFormState,
                        ...item,
                        id: Date.now().toString() + index,
                        sno: centers.length + index + 1
                    }));
                    setCenters(prev => [...prev, ...newCenters]);
                }
            });
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Training Center Information (1E.1)</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage training center details and infrastructure</p>
                        </div>
                    </div>
                    {!isRestricted && (
                        <div className="flex gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-slate-700 dark:text-slate-200">
                                <Upload size={16} />
                                <span>Import CSV</span>
                                <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
                            </label>
                            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Download size={16} />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                        {isEditing ? 'Edit Center Details' : 'Add New Training Center'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* About Center */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">About Center</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Training Center Name</label>
                                    <input type="text" name="training_center_name" value={formData.training_center_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address 1</label>
                                    <input type="text" name="center_address1" value={formData.center_address1} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address 2</label>
                                    <input type="text" name="center_address2" value={formData.center_address2} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Block</label>
                                    <input type="text" name="block" value={formData.block} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">District</label>
                                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Year Started</label>
                                    <input type="number" name="year_started" value={formData.year_started} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="YYYY" />
                                </div>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Capacity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Class Rooms</label>
                                    <input type="number" name="class_room_count" value={formData.class_room_count} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Seating Capacity</label>
                                    <input type="number" name="seating_capacity" value={formData.seating_capacity} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lab Capacity</label>
                                    <input type="number" name="capacity_of_lab" value={formData.capacity_of_lab} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>

                        {/* Residential */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Residential Facilities</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Is Center Residential?</span>
                                    <select name="is_residential" value={formData.is_residential} onChange={handleInputChange} className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="N">No</option>
                                        <option value="Y">Yes</option>
                                    </select>
                                </div>

                                {formData.is_residential === 'Y' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hostel Capacity (Men)</label>
                                            <input type="number" name="hostel_capacity_men" value={formData.hostel_capacity_men} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hostel Capacity (Women)</label>
                                            <input type="number" name="hostel_capacity_women" value={formData.hostel_capacity_women} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Distance to Center (km)</label>
                                            <input type="text" name="distance_hostel_center" value={formData.distance_hostel_center} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Person Name</label>
                                    <input type="text" name="contact_person_name" value={formData.contact_person_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                                    <input type="text" name="contact_role" value={formData.contact_role} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                                    <input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email ID</label>
                                    <input type="email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>

                        {/* Training Offered */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Training Offered</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Schemes Empanelled</label>
                                    <input type="text" name="schemes_empanelled" value={formData.schemes_empanelled} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="e.g. PMKVY, CMKKY" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Funding Source</label>
                                    <select name="funding_source" value={formData.funding_source} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="">Select Source</option>
                                        <option value="Central">Central</option>
                                        <option value="State">State</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Scheme URL</label>
                                    <input type="url" name="scheme_url" value={formData.scheme_url} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="https://" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Trades Offered</label>
                                    <input type="text" name="trades_offered" value={formData.trades_offered} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sectors</label>
                                    <input type="text" name="sectors" value={formData.sectors} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>

                        {/* Performance LY */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Performance (Last Year)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Trained Last Year</label>
                                    <input type="number" name="trained_last_year" value={formData.trained_last_year} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Number Placed LY</label>
                                    <input type="number" name="placed_last_year" value={formData.placed_last_year} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => { setFormData(initialFormState); setIsEditing(false); }} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                <Save size={18} />
                                {isEditing ? 'Update Center' : 'Save Center'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                {!isRestricted && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Registered Training Centers</h3>

                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                                    <tr>
                                        <th className="p-3 w-16 text-center border-r border-slate-200 dark:border-slate-700">1E.1</th>
                                        <th colSpan={7} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">About Center</th>
                                        <th colSpan={3} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Capacity</th>
                                        <th colSpan={5} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Residential</th>
                                        <th colSpan={4} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Contact Details</th>
                                        <th colSpan={5} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Training Offered</th>
                                        <th colSpan={2} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Performance LY</th>
                                        <th className="p-3 sticky right-0 bg-slate-50 dark:bg-slate-900 z-10"></th>
                                    </tr>
                                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-3 min-w-[60px] border-r border-slate-200 dark:border-slate-700">S.no</th>
                                        <th className="p-3 min-w-[200px]">Training Center</th>
                                        <th className="p-3 min-w-[200px]">Center Address1</th>
                                        <th className="p-3 min-w-[200px]">Center Address2</th>
                                        <th className="p-3 min-w-[120px]">Block</th>
                                        <th className="p-3 min-w-[120px]">District</th>
                                        <th className="p-3 min-w-[100px]">Pincode</th>
                                        <th className="p-3 min-w-[80px] border-r border-slate-200 dark:border-slate-700">Started</th>

                                        <th className="p-3 min-w-[100px]">Class Room</th>
                                        <th className="p-3 min-w-[100px]">Seating</th>
                                        <th className="p-3 min-w-[100px] border-r border-slate-200 dark:border-slate-700">Capacity of Lab</th>

                                        <th className="p-3 min-w-[100px]">Is center Residential</th>
                                        <th className="p-3 min-w-[100px]">Hostel (Men)</th>
                                        <th className="p-3 min-w-[100px]">Hostel (Women)</th>
                                        <th className="p-3 min-w-[100px] border-r border-slate-200 dark:border-slate-700">Distance</th>
                                        <th className="hidden"></th>

                                        <th className="p-3 min-w-[150px]">Contact Person</th>
                                        <th className="p-3 min-w-[120px]">Role</th>
                                        <th className="p-3 min-w-[120px]">Phone</th>
                                        <th className="p-3 min-w-[200px] border-r border-slate-200 dark:border-slate-700">Email</th>

                                        <th className="p-3 min-w-[150px]">Schemes</th>
                                        <th className="p-3 min-w-[100px]">Funding</th>
                                        <th className="p-3 min-w-[200px]">Scheme URL</th>
                                        <th className="p-3 min-w-[150px]">Trades</th>
                                        <th className="p-3 min-w-[150px] border-r border-slate-200 dark:border-slate-700">Sectors</th>

                                        <th className="p-3 min-w-[100px]">Trained</th>
                                        <th className="p-3 min-w-[100px] border-r border-slate-200 dark:border-slate-700">Placed</th>

                                        <th className="p-3 sticky right-0 bg-slate-50 dark:bg-slate-900 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {centers.length === 0 ? (
                                        <tr>
                                            <td colSpan={28} className="p-8 text-center text-slate-500">No centers added yet.</td>
                                        </tr>
                                    ) : (
                                        centers.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 text-center text-slate-500 border-r border-slate-200 dark:border-slate-700">{item.sno}</td>

                                                <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{item.training_center_name}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.center_address1}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.center_address2}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.block}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.district}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.pincode}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">{item.year_started}</td>

                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.class_room_count}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.seating_capacity}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">{item.capacity_of_lab}</td>

                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_residential === 'Y' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {item.is_residential}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.hostel_capacity_men}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.hostel_capacity_women}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">{item.distance_hostel_center}</td>
                                                <td className="hidden"></td>

                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.contact_person_name}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.contact_role}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.contact_phone}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">{item.contact_email}</td>

                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.schemes_empanelled}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.funding_source}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">
                                                    <a href={item.scheme_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block max-w-[200px]">
                                                        {item.scheme_url}
                                                    </a>
                                                </td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.trades_offered}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">{item.sectors}</td>

                                                <td className="p-3 text-slate-600 dark:text-slate-400">{item.trained_last_year}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">{item.placed_last_year}</td>

                                                <td className="p-3 sticky right-0 bg-white dark:bg-slate-900 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainingCenterSection;
