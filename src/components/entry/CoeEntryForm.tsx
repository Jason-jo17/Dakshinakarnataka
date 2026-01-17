import React, { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { CenterOfExcellence } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CheckCircle, Award, Users, TrendingUp, DollarSign, CheckSquare } from 'lucide-react';

interface CoeEntryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const CoeEntryForm: React.FC<CoeEntryFormProps> = ({ onSuccess, onCancel }) => {
    const addCoe = useDataStore(state => state.addCoe);
    const user = useAuthStore(state => state.user);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState<Partial<CenterOfExcellence>>({
        id: Date.now(),
        name: user?.name?.includes('User') ? '' : user?.name || '',
        location: '',
        focus_area: '',
        performance_score: 0,
        training_completion_rate: 0,
        status: 'Active',
        trainings_conducted: 0,
        students_trained: 0,
        placement_rate: 0,
        utilization_rate: 0,
        equipment_usage_score: 0,
        faculty_readiness_score: 0,
        industry_alignment_score: 0,
        budget_allocated: 0,
        budget_utilized: 0,
        notable_achievements: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCoe(formData as CenterOfExcellence);
        setSubmitted(true);
        // Call onSuccess to notify parent (App.tsx) which might redirect or show a toast
        if (onSuccess) onSuccess();

        setTimeout(() => {
            onCancel();
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Metrics Updated!</h2>
                <p className="text-slate-600 dark:text-slate-400">Your CoE performance data has been recorded.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">CoE Performance Reporting</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Submit your monthly/quarterly performance metrics.
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                        Cancel
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Award className="text-blue-600" size={20} /> Center Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Center Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Focus Area</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        placeholder="e.g. IoT, Robotics, AI"
                                        value={formData.focus_area}
                                        onChange={e => setFormData({ ...formData, focus_area: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location (Institution/City)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Training & Impact */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Users className="text-emerald-600" size={20} /> Training & Impact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trainings Conducted</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        value={formData.trainings_conducted}
                                        onChange={e => setFormData({ ...formData, trainings_conducted: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Students Trained</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        value={formData.students_trained}
                                        onChange={e => setFormData({ ...formData, students_trained: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Training Completion Rate (%)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        max="100"
                                        value={formData.training_completion_rate}
                                        onChange={e => setFormData({ ...formData, training_completion_rate: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Outcomes & Budget */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp className="text-purple-600" size={20} /> Outcomes & Budget
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Placement Rate (%)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        max="100"
                                        value={formData.placement_rate}
                                        onChange={e => setFormData({ ...formData, placement_rate: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry Alignment Score (0-100)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                        max="100"
                                        value={formData.industry_alignment_score}
                                        onChange={e => setFormData({ ...formData, industry_alignment_score: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget Allocated (Lakhs)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="number"
                                            className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                            value={formData.budget_allocated}
                                            onChange={e => setFormData({ ...formData, budget_allocated: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget Utilized (Lakhs)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="number"
                                            className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                            value={formData.budget_utilized}
                                            onChange={e => setFormData({ ...formData, budget_utilized: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notable Achievements</label>
                            <textarea
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 h-24"
                                placeholder="Key milestones, awards, or innovations..."
                                value={formData.notable_achievements}
                                onChange={e => setFormData({ ...formData, notable_achievements: e.target.value })}
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2"
                            >
                                <CheckSquare size={18} /> Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CoeEntryForm;
