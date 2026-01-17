import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { IndustryDemand } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CheckCircle, Building2, Briefcase, Users, DollarSign, MapPin, Send } from 'lucide-react';

interface CompanyEntryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const CompanyEntryForm: React.FC<CompanyEntryFormProps> = ({ onSuccess, onCancel }) => {
    const addIndustryDemand = useDataStore(state => state.addIndustryDemand);
    const user = useAuthStore(state => state.user);
    const [submitted, setSubmitted] = useState(false);

    // Form specifically for adding meaningful data: Industry Demand / Jobs
    const [formData, setFormData] = useState<Partial<IndustryDemand>>({
        company_name: user?.name?.includes('User') ? '' : user?.name || '',
        company_type: 'Private',
        sector: 'IT/ITES',
        job_role: '',
        demand_count: 0,
        projection_period: '6 Months',
        skills_required: '',
        avg_salary: '',
        location: 'Mangaluru',
        id: Date.now() // Simple ID gen
    });

    const sectors = ['IT/ITES', 'Manufacturing', 'Healthcare', 'Construction', 'Logistics', 'Education', 'Retail', 'Banking'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure data is saved
            addIndustryDemand(formData as IndustryDemand);
            setSubmitted(true);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (error) {
            console.error(error);
            alert("Failed to submit.");
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Requirement Posted!</h2>
                <p className="text-slate-600 dark:text-slate-400">Your industry demand has been recorded.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Industry Hiring Demand</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Share your hiring projections to align skill development.
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                        Cancel
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Info - Auto-filled from Auth preferably */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        value={formData.company_name}
                                        onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                    value={formData.company_type}
                                    onChange={e => setFormData({ ...formData, company_type: e.target.value })}
                                >
                                    <option>Large Enterprise</option>
                                    <option>GCC</option>
                                    <option>SME</option>
                                    <option>Startup</option>
                                </select>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Role / Designation</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        placeholder="e.g. Full Stack Developer"
                                        value={formData.job_role}
                                        onChange={e => setFormData({ ...formData, job_role: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sector</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                    value={formData.sector}
                                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                    required
                                >
                                    <option value="">Select Sector</option>
                                    {sectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Demand Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Openings</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        min="1"
                                        value={formData.demand_count}
                                        onChange={e => setFormData({ ...formData, demand_count: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timeline</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                    value={formData.projection_period}
                                    onChange={e => setFormData({ ...formData, projection_period: e.target.value })}
                                >
                                    <option>Immediate</option>
                                    <option>3 Months</option>
                                    <option>6 Months</option>
                                    <option>12 Months</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Avg Salary (LPA)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        placeholder="e.g. 4.5 - 6.0"
                                        value={formData.avg_salary}
                                        onChange={e => setFormData({ ...formData, avg_salary: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Skills Required</label>
                            <textarea
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 h-24"
                                placeholder="List key technical and soft skills..."
                                value={formData.skills_required}
                                onChange={e => setFormData({ ...formData, skills_required: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2"
                            >
                                <Send size={18} /> Submit Projection
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyEntryForm;
