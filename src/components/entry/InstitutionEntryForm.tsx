import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CheckCircle, Save } from 'lucide-react';
import type { Institution } from '../../types/institution';

interface InstitutionEntryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const InstitutionEntryForm: React.FC<InstitutionEntryFormProps> = ({ onSuccess, onCancel }) => {
    const addInstitution = useDataStore(state => state.addInstitution);
    const user = useAuthStore(state => state.user);
    const [submitted, setSubmitted] = useState(false);

    // Initial State derived from Institution Interface
    const [formData, setFormData] = useState<Partial<Institution>>({
        id: `INST-${Date.now()}`, // Auto-generate ID
        name: user?.name?.includes('User') ? '' : user?.name || '', // Pre-fill if name available
        category: 'Engineering',
        type: 'Private',
        location: {
            address: '',
            landmark: '',
            area: '',
            taluk: '',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '',
            coordinates: { lat: 12.9141, lng: 74.8560 }, // Default to Mangalore
            googleMapsUrl: ''
        },
        contact: {
            phone: '',
            email: '',
            website: ''
        },
        academic: {
            programs: [],
            facilities: []
        },
        placement: {
            rate: 0,
            year: new Date().getFullYear().toString(),
            packages: { highest: 0, average: 0 },
            topRecruiters: []
        },
        metadata: {
            verified: false,
            lastUpdated: new Date().toISOString(),
            source: 'Partner Portal'
        }
    });

    const categories = ['Engineering', 'Polytechnic', 'ITI', 'Training', 'University', 'Degree College', 'PU College'];
    const taluks = ['Mangaluru', 'Bantwal', 'Puttur', 'Belthangady', 'Sullia', 'Moodbidri', 'Kadaba', 'Ullal', 'Mulki'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation could go here

        // Ensure required fields are present (casting for now as it's a new entry)
        addInstitution(formData as Institution);
        setSubmitted(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
            onCancel(); // Go back to dashboard/login
        }, 2000);
    };

    const updateLocation = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location!, [field]: value }
        }));
    };

    const updateContact = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            contact: { ...prev.contact!, [field]: value }
        }));
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Submission Successful!</h2>
                <p className="text-slate-600 dark:text-slate-400">Your institution data has been added to the directory.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 min-h-screen">
            <div className="max-w-3xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institution Data Entry</h1>
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-800">Cancel</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Info */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="label">Institution Name</label>
                                <input
                                    className="input-field"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Category</label>
                                <select
                                    className="input-field"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Type</label>
                                <select
                                    className="input-field"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    {['Government', 'Private', 'Aided', 'Deemed'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="label">Address</label>
                                <textarea
                                    className="input-field"
                                    rows={2}
                                    value={formData.location?.address}
                                    onChange={e => updateLocation('address', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">Taluk</label>
                                <select
                                    className="input-field"
                                    value={formData.location?.taluk}
                                    onChange={e => updateLocation('taluk', e.target.value)}
                                >
                                    <option value="">Select Taluk</option>
                                    {taluks.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Area / Locality</label>
                                <input
                                    className="input-field"
                                    value={formData.location?.area}
                                    onChange={e => updateLocation('area', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Website</label>
                                <input
                                    className="input-field"
                                    value={formData.contact?.website}
                                    onChange={e => updateContact('website', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    className="input-field"
                                    type="email"
                                    value={formData.contact?.email}
                                    onChange={e => updateContact('email', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:text-slate-800">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Save size={18} /> Save Institution
                        </button>
                    </div>

                </form>
            </div>
            <style>{`
                .label { display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 0.25rem; }
                .dark .label { color: #cbd5e1; }
                .input-field { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background-color: white; color: #1e293b; outline: none; transition: border-color 0.2s; }
                .dark .input-field { background-color: #334155; border-color: #475569; color: white; }
                .input-field:focus { border-color: #3b82f6; ring: 2px solid #3b82f6; }
            `}</style>
        </div>
    );
};

export default InstitutionEntryForm;
