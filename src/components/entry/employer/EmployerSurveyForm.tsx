import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Building2, MapPin, Briefcase, Plus, Trash2, Phone, AlertCircle, ArrowRight, Pencil, ShieldCheck, Key, Check } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCredentialStore } from '../../../store/useCredentialStore';
import type { GeneratedCredential } from '../../../store/useCredentialStore';
import { supabase } from '../../../lib/supabaseClient';
import { emailService } from '../../../services/emailService';

// TypeScript Interfaces based on requirements
interface JobRoleHistory {
    id: string;
    num_trainees: number;
    avg_salary: number;
    job_roles: string;
    has_skill_gaps: boolean;
    skill_gaps: string;
}

interface JobRoleFuture {
    id: string;
    num_people: number;
    job_role: string;
    salary: number;
    qualification: string;
    place_of_deployment: string;
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


    // Contact Person
    contactName: string;
    contactDesignation: string;
    contactDepartment: string;
    contactPhone: string;
    contactEmail: string;
}

export default function EmployerSurveyForm() {
    const { logout, user, setVerified } = useAuthStore();
    const { generateCredential } = useCredentialStore();
    const { companyName: urlCompanyName, role: urlRole } = useParams();
    const [activeSection, setActiveSection] = useState<number>(1);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isVerifying, setIsVerifying] = useState(false);
    const [requestedCreds, setRequestedCreds] = useState<GeneratedCredential | null>(null);
    const [isRequestingCreds, setIsRequestingCreds] = useState(false);

    const handleRequestCredentials = async () => {
        if (!formData.companyName || !formData.contactEmail) {
            alert("Please fill in the Company Name and Contact Email first.");
            return;
        }

        setIsRequestingCreds(true);
        try {
            const cred = await generateCredential({
                role: 'company',
                entityId: `company-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}`,
                entityName: formData.companyName,
                email: formData.contactEmail
            });
            setRequestedCreds(cred);
        } catch (error) {
            console.error("Failed to request credentials:", error);
            alert("Failed to generate credentials. Please try again.");
        } finally {
            setIsRequestingCreds(false);
        }
    };

    // Form State
    const [formData, setFormData] = useState<EmployerSurveyData>({
        companyName: urlCompanyName || user?.name || '',
        registrationNumber: '',
        companyType: '',
        industrySector: '',
        subSector: '',
        businessActivity: '',
        officeAddress: '',
        manufacturingLocation: '',
        district: 'Dakshina Kannada',
        state: 'Karnataka',
        contactName: '',
        contactDesignation: urlRole || '',
        contactDepartment: '',
        contactPhone: '',
        contactEmail: ''
    });

    // Dynamic Lists State
    const [pastHiring, setPastHiring] = useState<JobRoleHistory[]>([]);
    const [futureHiring, setFutureHiring] = useState<JobRoleFuture[]>([]);

    // Master Table State
    const [surveyData, setSurveyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sessionSubmissionIds, setSessionSubmissionIds] = useState<string[]>([]);

    useEffect(() => {
        fetchSurveyData();
        if (user?.role === 'company') {
            fetchExistingCompanyData();
        }
    }, [user]);

    const fetchExistingCompanyData = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('ad_survey_employer')
                .select('*')
                .eq('created_by_credential_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data && !error) {
                setFormData({
                    companyName: data.employer_name || '',
                    registrationNumber: data.registration_number || '',
                    companyType: data.company_type || '',
                    industrySector: data.sector || '',
                    subSector: data.sub_sector || '',
                    businessActivity: data.business_activity || '',
                    officeAddress: data.employer_address || '',
                    manufacturingLocation: data.manufacturing_location || '',
                    district: data.district_id || 'Dakshina Kannada',
                    state: data.state || 'Karnataka',
                    contactName: data.contact_person_name || '',
                    contactDesignation: data.contact_person_designation || '',
                    contactDepartment: data.contact_department || '',
                    contactPhone: data.contact_person_phone || '',
                    contactEmail: data.contact_person_email || ''
                });
                // Also set editingId if we want to update this record instead of creating a new one?
                // For now, let's just pre-fill.
            }
        } catch (err) {
            console.error("Error auto-populating form:", err);
        }
    };

    const fetchSurveyData = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('ad_survey_employer')
                .select('*')
                .order('created_at', { ascending: false });

            // GUEST USER: Can ONLY see submissions from this session
            if (!user) {
                if (sessionSubmissionIds.length === 0) {
                    setSurveyData([]);
                    setLoading(false);
                    return;
                }
                // Filter to only show session IDs
                query = query.in('id', sessionSubmissionIds);
            }
            // LOGGED IN USER: RLS-like logic for Company role
            else if (user?.role === 'company') {
                const filters = [`created_by_credential_id.eq.${user.id}`];
                if (user.managedEntityId) {
                    filters.push(`id.eq.${user.managedEntityId}`);
                }
                // Also include any session IDs (e.g. if they just created one that hasn't synced yet or similar, though created_by covers it)
                if (sessionSubmissionIds.length > 0) {
                    filters.push(`id.in.(${sessionSubmissionIds.join(',')})`);
                }
                query = query.or(filters.join(','));
            }

            const { data, error } = await query;

            if (error) throw error;
            setSurveyData(data || []);
        } catch (error) {
            console.error('Error fetching survey data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addPastHiringRow = () => {
        setPastHiring([...pastHiring, {
            id: crypto.randomUUID(),
            num_trainees: 0,
            avg_salary: 0,
            job_roles: '',
            has_skill_gaps: false,
            skill_gaps: ''
        }]);
    };

    const updatePastHiring = (id: string, field: keyof JobRoleHistory, value: any) => {
        setPastHiring(pastHiring.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addFutureHiringRow = () => {
        setFutureHiring([...futureHiring, {
            id: crypto.randomUUID(),
            num_people: 0,
            job_role: '',
            salary: 0,
            qualification: '',
            place_of_deployment: ''
        }]);
    };

    const updateFutureHiring = (id: string, field: keyof JobRoleFuture, value: any) => {
        setFutureHiring(futureHiring.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeRow = (listSetter: React.Dispatch<React.SetStateAction<any[]>>, id: string) => {
        listSetter(prev => prev.filter(item => item.id !== id));
    };

    const handleEdit = (record: any) => {
        setEditingId(record.id);

        // Populate Company & Contact Info
        setFormData({
            companyName: record.employer_name,
            registrationNumber: record.registration_number || '',
            companyType: record.company_type || '',
            industrySector: record.sector || '',
            subSector: record.sub_sector || '',
            businessActivity: record.business_activity || '',
            officeAddress: record.employer_address || '',
            manufacturingLocation: record.manufacturing_location || '',
            district: record.district_id,
            state: record.state || 'Karnataka',
            contactName: record.contact_person_name || '',
            contactDesignation: record.contact_person_designation || '',
            contactDepartment: record.contact_department || '',
            contactPhone: record.contact_person_phone || '',
            contactEmail: record.contact_person_email || ''
        });

        // Populate Hiring Data (Single Row)
        setPastHiring([{
            id: crypto.randomUUID(),
            num_trainees: record.recruited_past_12m_num || 0,
            avg_salary: record.recruited_past_12m_avg_salary || 0,
            job_roles: record.recruited_job_roles || '',
            has_skill_gaps: !!record.skill_gaps_observed,
            skill_gaps: record.skill_gaps_observed || ''
        }]);

        setFutureHiring([{
            id: crypto.randomUUID(),
            num_people: record.expected_recruit_num || 0,
            salary: record.expected_recruit_salary || 0,
            job_role: record.expected_recruit_job_role || '',
            qualification: record.expected_recruit_qualification || '',
            place_of_deployment: record.place_of_recruitment || ''
        }]);

        setActiveSection(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVerifyInformation = async () => {
        if (!user?.email) {
            alert("Please ensure your account has an email address associated with it.");
            return;
        }

        setIsVerifying(true);
        try {
            await emailService.sendVerificationEmail(user.email, user.name);
            setVerified(true);
            alert("Information verified and confirmation email sent!");
        } catch (error) {
            console.error("Verification failed:", error);
            alert("Failed to send verification email. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        const { error } = await supabase.from('ad_survey_employer').delete().eq('id', id);

        if (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete record');
        } else {
            fetchSurveyData();
        }
    };

    const handleSubmitSurvey = async () => {
        setSaveStatus('saving');

        if (editingId) {
            // For edit, we update the specific record with the first item from the lists
            // (Assuming edit mode focuses on one row at a time as per table structure)
            const pastItem = pastHiring[0];
            const futureItem = futureHiring[0];

            const updateData = {
                employer_name: formData.companyName,
                employer_address: formData.officeAddress,
                registration_number: formData.registrationNumber,
                company_type: formData.companyType,
                sector: formData.industrySector,
                sub_sector: formData.subSector,
                business_activity: formData.businessActivity,
                manufacturing_location: formData.manufacturingLocation,
                state: formData.state,

                recruited_past_12m_num: pastItem?.num_trainees || 0,
                recruited_past_12m_avg_salary: pastItem?.avg_salary || 0,
                recruited_job_roles: pastItem?.job_roles || '',
                skill_gaps_observed: pastItem?.has_skill_gaps ? (pastItem?.skill_gaps || '') : '',

                contact_person_name: formData.contactName,
                contact_person_designation: formData.contactDesignation,
                contact_person_phone: formData.contactPhone,
                contact_person_email: formData.contactEmail,
                contact_department: formData.contactDepartment,

                expected_recruit_num: futureItem?.num_people || 0,
                expected_recruit_salary: futureItem?.salary || 0,
                expected_recruit_job_role: futureItem?.job_role || '',
                expected_recruit_qualification: futureItem?.qualification || '',
                place_of_recruitment: futureItem?.place_of_deployment || ''
            };

            const { error } = await supabase
                .from('ad_survey_employer')
                .update(updateData)
                .eq('id', editingId);

            if (error) {
                console.error('Submission error:', error);
                alert('Failed to update survey: ' + error.message);
                setSaveStatus('idle');
                return;
            }
        } else {
            // Group hiring records.
            const maxRecords = Math.max(pastHiring.length, futureHiring.length, 1);
            const submissionData = [];

            for (let i = 0; i < maxRecords; i++) {
                const pastItem = pastHiring[i];
                const futureItem = futureHiring[i];

                submissionData.push({
                    district_id: 'Dakshina Kannada',
                    employer_name: formData.companyName,
                    employer_address: formData.officeAddress,
                    registration_number: formData.registrationNumber,
                    company_type: formData.companyType,
                    sector: formData.industrySector,
                    sub_sector: formData.subSector,
                    business_activity: formData.businessActivity,
                    manufacturing_location: formData.manufacturingLocation,
                    state: formData.state,
                    created_by_credential_id: user?.id,

                    // Recruited Past (if exists)
                    recruited_past_12m_num: pastItem?.num_trainees || 0,
                    recruited_past_12m_avg_salary: pastItem?.avg_salary || 0,
                    recruited_job_roles: pastItem?.job_roles || '',
                    skill_gaps_observed: pastItem?.has_skill_gaps ? (pastItem?.skill_gaps || '') : '',

                    // Contact Person
                    contact_person_name: formData.contactName,
                    contact_person_designation: formData.contactDesignation,
                    contact_person_phone: formData.contactPhone,
                    contact_person_email: formData.contactEmail,
                    contact_department: formData.contactDepartment,

                    // Expected Future (if exists)
                    expected_recruit_num: futureItem?.num_people || 0,
                    expected_recruit_salary: futureItem?.salary || 0,
                    expected_recruit_job_role: futureItem?.job_role || '',
                    expected_recruit_qualification: futureItem?.qualification || '',
                    place_of_recruitment: futureItem?.place_of_deployment || ''
                });
            }

            const { data, error } = await supabase.from('ad_survey_employer').insert(submissionData).select();

            if (data) {
                const newIds = data.map(d => d.id);
                setSessionSubmissionIds(prev => [...prev, ...newIds]);
            }
            if (error) {
                console.error('Submission error:', error);
                alert('Failed to submit survey: ' + error.message);
                setSaveStatus('idle');
                return;
            }
        }

        setSaveStatus('saved');

        // AUTOMATIC CREDENTIAL GENERATION for new submissions/guests
        if (!user && !requestedCreds && formData.companyName && formData.contactEmail) {
            try {
                const cred = await generateCredential({
                    role: 'company',
                    entityId: `company-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}`,
                    entityName: formData.companyName,
                    email: formData.contactEmail
                });
                setRequestedCreds(cred);
            } catch (error) {
                console.error("Automatic credential generation failed:", error);
            }
        }

        alert(editingId ? 'Survey Updated Successfully!' : 'Survey Submitted Successfully!');

        // Send survey completion email if user has email
        if (user?.email) {
            emailService.sendSurveyCompletionEmail(user.email, formData.companyName).catch(err => {
                console.error("Failed to send survey completion email:", err);
            });
        }

        fetchSurveyData();
        if (editingId) setEditingId(null);
        setTimeout(() => setSaveStatus('idle'), 2000);
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
                            onClick={handleSubmitSurvey}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {saveStatus === 'saving' ? 'Submitting...' : saveStatus === 'saved' ? 'Submitted' : 'Submit Survey'}
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
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center relative z-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${activeSection >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                                }`}>
                                {step}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                                {step === 1 ? 'Company' : step === 2 ? 'Location' : step === 3 ? 'Hiring' : 'Contact'}
                            </span>
                            {step < 4 && (
                                <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${activeSection > step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                                    }`} style={{ width: 'calc(100% * 5.3)' }} /> // Adjusted connector
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
                            <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleVerifyInformation}
                                        disabled={user?.isVerified || isVerifying}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${user?.isVerified
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        {user?.isVerified ? 'Verified' : isVerifying ? 'Verifying...' : 'Verify Information'}
                                    </button>

                                    {!user && !requestedCreds && (
                                        <button
                                            onClick={handleRequestCredentials}
                                            disabled={isRequestingCreds}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors text-sm font-medium shadow-sm border border-purple-200"
                                        >
                                            <Key className="w-4 h-4" />
                                            {isRequestingCreds ? 'Generating...' : 'Request Credentials'}
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => setActiveSection(2)}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm transition-all hover:translate-x-1"
                                >
                                    Next: Location
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {requestedCreds && (
                                <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl animate-in zoom-in-95 duration-300">
                                    <h3 className="text-emerald-800 dark:text-emerald-300 font-bold mb-2 flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        Credentials Generated Successfully!
                                    </h3>
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4">
                                        You can now use these credentials to log in to your official Company Portal later.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 shadow-sm font-mono text-sm">
                                        <div>
                                            <span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider">Username</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{requestedCreds.username}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider">Password</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{requestedCreds.password}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 italic">
                                        <Check className="w-3 h-3" />
                                        Credentials saved to Master Sheet
                                    </div>
                                </div>
                            )}
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
                                <button onClick={() => setActiveSection(3)} className="btn-primary">Next: Hiring Plans</button>
                            </div>
                        </div>
                    )}


                    {/* Section 3: Hiring Plans */}
                    {activeSection === 3 && (
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
                                        <div key={row.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="grid grid-cols-12 gap-3 items-start mb-3">
                                                <div className="col-span-3">
                                                    <label className="text-xs text-slate-500 block mb-1">Number of Trainees</label>
                                                    <input type="number" value={row.num_trainees} onChange={e => updatePastHiring(row.id, 'num_trainees', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-xs text-slate-500 block mb-1">Average Salary</label>
                                                    <input type="number" value={row.avg_salary} onChange={e => updatePastHiring(row.id, 'avg_salary', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="col-span-5">
                                                    <label className="text-xs text-slate-500 block mb-1">Job Roles</label>
                                                    <input type="text" value={row.job_roles} onChange={e => updatePastHiring(row.id, 'job_roles', e.target.value)} className="w-full input-standard text-sm" placeholder="e.g. Java Dev" />
                                                </div>
                                                <div className="col-span-1 flex justify-center pt-6">
                                                    <button onClick={() => removeRow(setPastHiring, row.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`gap-toggle-${row.id}`}
                                                        checked={row.has_skill_gaps}
                                                        onChange={e => updatePastHiring(row.id, 'has_skill_gaps', e.target.checked)}
                                                        className="w-4 h-4 rounded border-slate-300"
                                                    />
                                                    <label htmlFor={`gap-toggle-${row.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Have you identified skill gaps?
                                                    </label>
                                                </div>
                                                {row.has_skill_gaps && (
                                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                                        <label className="text-xs text-slate-500 block mb-1">Skill Gaps Observed</label>
                                                        <textarea
                                                            value={row.skill_gaps}
                                                            onChange={e => updatePastHiring(row.id, 'skill_gaps', e.target.value)}
                                                            className="w-full input-standard text-sm h-20"
                                                            placeholder="Describe the gaps observed (e.g. Communication, Problem Solving)"
                                                        />
                                                    </div>
                                                )}
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
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Number of people</label>
                                                    <input type="number" value={row.num_people} onChange={e => updateFutureHiring(row.id, 'num_people', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Job Role</label>
                                                    <input type="text" value={row.job_role} onChange={e => updateFutureHiring(row.id, 'job_role', e.target.value)} className="w-full input-standard text-sm" placeholder="Required Role" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Salary</label>
                                                    <input type="number" value={row.salary} onChange={e => updateFutureHiring(row.id, 'salary', Number(e.target.value))} className="w-full input-standard text-sm" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Qualification</label>
                                                    <input type="text" value={row.qualification} onChange={e => updateFutureHiring(row.id, 'qualification', e.target.value)} className="w-full input-standard text-sm" placeholder="Degree/Cert" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Place of Deployment</label>
                                                    <input type="text" value={row.place_of_deployment} onChange={e => updateFutureHiring(row.id, 'place_of_deployment', e.target.value)} className="w-full input-standard text-sm" placeholder="District / City" />
                                                </div>
                                                <div className="flex justify-end col-span-5">
                                                    <button onClick={() => removeRow(setFutureHiring, row.id)} className="text-red-500 hover:bg-red-50 p-2 rounded flex items-center gap-1 text-xs"><Trash2 size={14} /> Remove Row</button>
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
                                <button onClick={() => setActiveSection(2)} className="btn-secondary">Back</button>
                                <button onClick={() => setActiveSection(4)} className="btn-primary">Next: Contact Info</button>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Contact Person */}
                    {activeSection === 4 && (
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
                                <button onClick={() => setActiveSection(3)} className="btn-secondary">Back</button>
                                <button
                                    onClick={handleSubmitSurvey}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 font-medium flex items-center gap-2"
                                >
                                    {saveStatus === 'saving' ? 'Submitting...' : 'Submit Survey'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Master Table Section */}
                <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Survey Submissions</h3>
                            <p className="text-sm text-slate-500">View and manage all employer survey entries</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={fetchSurveyData} className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">S.no</th>
                                    <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600 min-w-[150px]">Enterprise Name</th>
                                    <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600 min-w-[200px]">Address</th>
                                    <th colSpan={5} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold">Company Details</th>
                                    <th colSpan={4} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold">Recruited (Past 12m)</th>
                                    <th colSpan={4} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold">Contact Person</th>
                                    <th colSpan={5} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-200 dark:bg-slate-800 font-bold">Expected (This Year)</th>
                                    <th rowSpan={2} className="px-4 py-3 align-middle text-center">Actions</th>
                                </tr>
                                <tr>
                                    {/* Company Sub-columns */}
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Reg No</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Type</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Sector</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Sub Sector</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Activity</th>

                                    {/* Recruited Sub-columns */}
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Count</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Avg Salary</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Job Roles</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Skill Gaps</th>

                                    {/* Contact Sub-columns */}
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Name</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Role</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Email</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Phone</th>

                                    {/* Expected Sub-columns */}
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Count</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Job Role</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Salary</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Qual.</th>
                                    <th className="px-4 py-2 border-r dark:border-slate-600 whitespace-nowrap">Place</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={22} className="px-4 py-8 text-center text-slate-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                Loading data...
                                            </div>
                                        </td>
                                    </tr>
                                ) : surveyData.length === 0 ? (
                                    <tr>
                                        <td colSpan={22} className="px-4 py-8 text-center text-slate-500">
                                            No survey data found. Submit the form above to add records.
                                        </td>
                                    </tr>
                                ) : (
                                    surveyData.map((item, index) => (
                                        <tr key={item.id} className={`border-b dark:border-slate-700 transition-colors ${editingId === item.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                            <td className="px-4 py-3 text-center border-r dark:border-slate-700">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium border-r dark:border-slate-700 max-w-xs">{item.employer_name}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.employer_address}>{item.employer_address}</td>

                                            {/* Company Details */}
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.registration_number}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.company_type}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.sector}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.sub_sector}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.business_activity}>{item.business_activity}</td>

                                            {/* Recruited */}
                                            <td className="px-4 py-3 text-center border-r dark:border-slate-700 font-bold text-blue-600">{item.recruited_past_12m_num}</td>
                                            <td className="px-4 py-3 text-center border-r dark:border-slate-700">₹{item.recruited_past_12m_avg_salary?.toLocaleString()}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.recruited_job_roles}>{item.recruited_job_roles}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.skill_gaps_observed}>{item.skill_gaps_observed}</td>

                                            {/* Contact */}
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.contact_person_name}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.contact_person_designation}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.contact_person_email}>{item.contact_person_email}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.contact_person_phone}</td>

                                            {/* Expected */}
                                            <td className="px-4 py-3 text-center border-r dark:border-slate-700 font-bold text-green-600">{item.expected_recruit_num}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.expected_recruit_job_role}>{item.expected_recruit_job_role}</td>
                                            <td className="px-4 py-3 text-center border-r dark:border-slate-700">₹{item.expected_recruit_salary?.toLocaleString()}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.expected_recruit_qualification}>{item.expected_recruit_qualification}</td>
                                            <td className="px-4 py-3 border-r dark:border-slate-700 text-center">{item.place_of_recruitment}</td>

                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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
