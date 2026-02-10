import React, { useState } from 'react';
import { Save, Building2, MapPin, Users, Briefcase, Plus, Trash2, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

// TypeScript Interfaces based on requirements
interface JobRoleHistory {
    id: string;
    jobRole: string;
    numberOfPeople: number;
    averageSalary: number;
    skillGapsObserved?: string;
}

interface JobRoleFuture {
    id: string; // Add ID for list management
    jobRole: string;
    expectedNumber: number;
    salaryMin: number;
    salaryMax: number;
    requiredSkills: string; // Comma separated for input
    requiredCertifications?: string;
    placeOfDeployment: string;
}

interface EmployerSurveyData {
    // Company Information
    companyName: string;
    registrationNumber: string;
    companyType: 'Private Limited' | 'Public Limited' | 'MNC' | 'Proprietorship' | 'Partnership' | '';
    industrySector: string;
    subSector: string;
    businessActivity: string;

    // Location
    officeAddress: string;
    manufacturingLocation: string;
    district: string;
    state: string;

    // Company Size
    totalWorkforceSize: number;
    skilledWorkers: number;
    unskilledWorkers: number;

    // Contact Person
    contactName: string;
    contactDesignation: string;
    contactDepartment: string;
    contactPhone: string;
    contactEmail: string;
}

export default function EmployerSurveyForm() {
    const { logout, user } = useAuthStore();
    const [activeSection, setActiveSection] = useState<number>(1);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Form State
    const [formData, setFormData] = useState<EmployerSurveyData>({
        companyName: user?.name || '',
        registrationNumber: '',
        companyType: '',
        industrySector: '',
        subSector: '',
        businessActivity: '',
        officeAddress: '',
        manufacturingLocation: '',
        district: 'Dakshina Kannada',
        state: 'Karnataka',
        totalWorkforceSize: 0,
        skilledWorkers: 0,
        unskilledWorkers: 0,
        contactName: '',
        contactDesignation: '',
        contactDepartment: '',
        contactPhone: '',
        contactEmail: ''
    });

    // Dynamic Lists State
    const [pastHiring, setPastHiring] = useState<JobRoleHistory[]>([]);
    const [futureHiring, setFutureHiring] = useState<JobRoleFuture[]>([]);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addPastHiringRow = () => {
        setPastHiring([...pastHiring, {
            id: crypto.randomUUID(),
            jobRole: '',
            numberOfPeople: 0,
            averageSalary: 0,
            skillGapsObserved: ''
        }]);
    };

    const updatePastHiring = (id: string, field: keyof JobRoleHistory, value: any) => {
        setPastHiring(pastHiring.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addFutureHiringRow = () => {
        setFutureHiring([...futureHiring, {
            id: crypto.randomUUID(),
            jobRole: '',
            expectedNumber: 0,
            salaryMin: 0,
            salaryMax: 0,
            requiredSkills: '',
            placeOfDeployment: ''
        }]);
    };

    const updateFutureHiring = (id: string, field: keyof JobRoleFuture, value: any) => {
        setFutureHiring(futureHiring.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeRow = (listSetter: React.Dispatch<React.SetStateAction<any[]>>, id: string) => {
        listSetter(prev => prev.filter(item => item.id !== id));
    };

    const handleSaveDraft = () => {
        setSaveStatus('saving');
        // Simulate API call / Local Storage
        setTimeout(() => {
            localStorage.setItem('employer_survey_draft', JSON.stringify({ formData, pastHiring, futureHiring }));
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Employer Survey</h1>
                            <p className="text-xs text-slate-500">Update your organization's data • Est. time: 10-15 mins</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveDraft}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Draft Saved' : 'Save Draft'}
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 px-8">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex flex-col items-center relative z-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${activeSection >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                                }`}>
                                {step}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                                {step === 1 ? 'Company' : step === 2 ? 'Location' : step === 3 ? 'Workforce' : step === 4 ? 'Hiring' : 'Contact'}
                            </span>
                            {step < 5 && (
                                <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${activeSection > step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                                    }`} style={{ width: 'calc(100% * 4)' }} /> // Rough manual connector
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">

                    {/* Section 1: Company Information */}
                    {activeSection === 1 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                Company Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Company Name *</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full input-standard" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Registration Number</label>
                                    <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} className="w-full input-standard" placeholder="CIN / Udyam / GST" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Company Type *</label>
                                    <select name="companyType" value={formData.companyType} onChange={handleInputChange} className="w-full input-standard">
                                        <option value="">Select Type</option>
                                        <option value="Private Limited">Private Limited</option>
                                        <option value="Public Limited">Public Limited</option>
                                        <option value="MNC">MNC</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Industry Sector *</label>
                                    <input type="text" name="industrySector" value={formData.industrySector} onChange={handleInputChange} className="w-full input-standard" placeholder="e.g. IT, Manufacturing" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sub Sector</label>
                                    <input type="text" name="subSector" value={formData.subSector} onChange={handleInputChange} className="w-full input-standard" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Business Activity Description</label>
                                    <textarea name="businessActivity" value={formData.businessActivity} onChange={handleInputChange} className="w-full input-standard h-24" placeholder="Brief description of main business activities..." />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setActiveSection(2)} className="btn-primary">Next: Location</button>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Location */}
                    {activeSection === 2 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                Location Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Registered Office Address *</label>
                                    <textarea name="officeAddress" value={formData.officeAddress} onChange={handleInputChange} className="w-full input-standard h-24" required />
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium">Manufacturing / Plant Location</label>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, manufacturingLocation: prev.officeAddress }))}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Same as Office
                                        </button>
                                    </div>
                                    <textarea name="manufacturingLocation" value={formData.manufacturingLocation} onChange={handleInputChange} className="w-full input-standard h-24" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">District</label>
                                    <input type="text" name="district" value={formData.district} disabled className="w-full input-standard bg-slate-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">State</label>
                                    <input type="text" name="state" value={formData.state} disabled className="w-full input-standard bg-slate-100" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setActiveSection(1)} className="btn-secondary">Back</button>
                                <button onClick={() => setActiveSection(3)} className="btn-primary">Next: Workforce</button>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Workforce */}
                    {activeSection === 3 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                Workforce Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Workforce Size *</label>
                                    <input type="number" name="totalWorkforceSize" value={formData.totalWorkforceSize} onChange={handleInputChange} className="w-full input-standard" min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Skilled Workers</label>
                                    <input type="number" name="skilledWorkers" value={formData.skilledWorkers} onChange={handleInputChange} className="w-full input-standard" min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Unskilled Workers</label>
                                    <input type="number" name="unskilledWorkers" value={formData.unskilledWorkers} onChange={handleInputChange} className="w-full input-standard" min="0" />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setActiveSection(2)} className="btn-secondary">Back</button>
                                <button onClick={() => setActiveSection(4)} className="btn-primary">Next: Hiring Plans</button>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Hiring Plans */}
                    {activeSection === 4 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                Hiring Information
                            </h2>

                            {/* Past 12 Months */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-200">Recruited in Past 12 Months</h3>
                                <div className="space-y-4">
                                    {pastHiring.map((row) => (
                                        <div key={row.id} className="grid grid-cols-12 gap-2 items-start bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="col-span-3">
                                                <label className="text-xs text-slate-500 block mb-1">Job Role</label>
                                                <input type="text" value={row.jobRole} onChange={e => updatePastHiring(row.id, 'jobRole', e.target.value)} className="w-full input-standard text-sm" placeholder="e.g. Java Dev" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs text-slate-500 block mb-1">Hired</label>
                                                <input type="number" value={row.numberOfPeople} onChange={e => updatePastHiring(row.id, 'numberOfPeople', Number(e.target.value))} className="w-full input-standard text-sm" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs text-slate-500 block mb-1">Avg Salary (₹)</label>
                                                <input type="number" value={row.averageSalary} onChange={e => updatePastHiring(row.id, 'averageSalary', Number(e.target.value))} className="w-full input-standard text-sm" />
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-xs text-slate-500 block mb-1">Skill Gaps Observed</label>
                                                <input type="text" value={row.skillGapsObserved} onChange={e => updatePastHiring(row.id, 'skillGapsObserved', e.target.value)} className="w-full input-standard text-sm" placeholder="e.g. Communication" />
                                            </div>
                                            <div className="col-span-1 flex justify-center pt-6">
                                                <button onClick={() => removeRow(setPastHiring, row.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addPastHiringRow} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                                        <Plus size={16} /> Add Past Hiring Record
                                    </button>
                                </div>
                            </div>

                            {/* Coming Year */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-200">Expected Hiring (Next 12 Months)</h3>
                                <div className="space-y-4">
                                    {futureHiring.map((row) => (
                                        <div key={row.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                                                <div className="md:col-span-2">
                                                    <label className="text-xs text-slate-500 block mb-1">Job Role</label>
                                                    <input type="text" value={row.jobRole} onChange={e => updateFutureHiring(row.id, 'jobRole', e.target.value)} className="w-full input-standard text-sm" placeholder="Required Role" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Count</label>
                                                    <input type="number" value={row.expectedNumber} onChange={e => updateFutureHiring(row.id, 'expectedNumber', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Min Salary</label>
                                                    <input type="number" value={row.salaryMin} onChange={e => updateFutureHiring(row.id, 'salaryMin', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Max Salary</label>
                                                    <input type="number" value={row.salaryMax} onChange={e => updateFutureHiring(row.id, 'salaryMax', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="md:col-span-1 flex justify-end">
                                                    <button onClick={() => removeRow(setFutureHiring, row.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Required Skills (comma separated)</label>
                                                    <input type="text" value={row.requiredSkills} onChange={e => updateFutureHiring(row.id, 'requiredSkills', e.target.value)} className="w-full input-standard text-sm" placeholder="e.g. Python, SQL" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Place of Deployment</label>
                                                    <input type="text" value={row.placeOfDeployment} onChange={e => updateFutureHiring(row.id, 'placeOfDeployment', e.target.value)} className="w-full input-standard text-sm" placeholder="District / City" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addFutureHiringRow} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                                        <Plus size={16} /> Add Future Hiring Plan
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setActiveSection(3)} className="btn-secondary">Back</button>
                                <button onClick={() => setActiveSection(5)} className="btn-primary">Next: Contact Info</button>
                            </div>
                        </div>
                    )}

                    {/* Section 5: Contact Person */}
                    {activeSection === 5 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-500" />
                                Contact Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact Person Name *</label>
                                    <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full input-standard" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Designation *</label>
                                    <input type="text" name="contactDesignation" value={formData.contactDesignation} onChange={handleInputChange} className="w-full input-standard" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Department</label>
                                    <input type="text" name="contactDepartment" value={formData.contactDepartment} onChange={handleInputChange} className="w-full input-standard" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full input-standard" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Email ID *</label>
                                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="w-full input-standard" required />
                                </div>
                            </div>

                            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                    <h4 className="font-semibold mb-1">Ready to Submit?</h4>
                                    <p>Please review all sections before submitting. Once submitted, you cannot edit the survey without admin approval.</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setActiveSection(4)} className="btn-secondary">Back</button>
                                <button
                                    onClick={() => alert('Survey Submitted Successfully!')}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 font-medium flex items-center gap-2"
                                >
                                    Submit Survey <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Styles Injection for this component specifically if needed, or rely on global index.css */}
            <style>{`
        .input-standard {
          @apply px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all;
        }
        .btn-primary {
          @apply px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium;
        }
        .btn-secondary {
          @apply px-6 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium;
        }
      `}</style>
        </div>
    );
}
