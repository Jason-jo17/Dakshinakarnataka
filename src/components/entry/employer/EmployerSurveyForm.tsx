import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Plus, Trash2, Phone, AlertCircle, ArrowRight, Pencil, ShieldCheck, Key, Check, Download, Printer, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
    const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

    // Initialize Guest Session
    useEffect(() => {
        if (!user) {
            let sid = localStorage.getItem('employer_survey_session_id');
            if (!sid) {
                sid = crypto.randomUUID();
                localStorage.setItem('employer_survey_session_id', sid);
            }
            setGuestSessionId(sid);
        }
    }, [user]);

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

    // Delegate State
    const [isDelegateMode, setIsDelegateMode] = useState(false);
    const [delegateEmail, setDelegateEmail] = useState('');
    const [delegationStatus, setDelegationStatus] = useState<'none' | 'pending' | 'filled' | 'approved'>('none');




    // Draft Persistence Logic (Database-backed)
    useEffect(() => {
        const loadDraftFromDB = async () => {
            const identifier = user?.id || localStorage.getItem('employer_survey_session_id');
            if (!identifier) return;

            const { data, error } = await supabase
                .from('user_drafts')
                .select('state')
                .eq(user ? 'user_id' : 'guest_id', identifier)
                .eq('form_type', 'employer_survey')
                .maybeSingle();

            if (error) {
                console.error('Failed to fetch draft:', error);
                return;
            }

            if (data && data.state) {
                try {
                    const { formData: savedForm, pastHiring: savedPast, futureHiring: savedFuture } = data.state;
                    if (savedForm) setFormData(prev => ({ ...prev, ...savedForm }));
                    if (savedPast) setPastHiring(savedPast);
                    if (savedFuture) setFutureHiring(savedFuture);
                    console.log('📬 Draft restored from database');
                    setDraftSavedAt('Restored');
                } catch (e) {
                    console.error('Failed to parse DB draft', e);
                }
            }
        };

        loadDraftFromDB();
    }, [user, guestSessionId]);

    // Auto-save to DB
    useEffect(() => {
        if (!isSubmitted) {
            const timer = setTimeout(async () => {
                const identifier = user?.id || guestSessionId;
                if (!identifier) return;

                const draftState = { formData, pastHiring, futureHiring };
                const { error } = await supabase
                    .from('user_drafts')
                    .upsert({
                        [user ? 'user_id' : 'guest_id']: identifier,
                        form_type: 'employer_survey',
                        state: draftState,
                        updated_at: new Date().toISOString()
                    }, { onConflict: user ? 'user_id,form_type' : 'guest_id,form_type' }); // Note: unique constraint needed on DB for this to work perfectly

                if (!error) {
                    setDraftSavedAt(new Date().toLocaleTimeString());
                } else {
                    console.error('Auto-save error:', error);
                }
            }, 2000); // 2 second delay
            return () => clearTimeout(timer);
        }
    }, [formData, pastHiring, futureHiring, isSubmitted, user, guestSessionId]);

    const clearDraft = async () => {
        const identifier = user?.id || guestSessionId;
        if (identifier) {
            await supabase
                .from('user_drafts')
                .delete()
                .eq(user ? 'user_id' : 'guest_id', identifier)
                .eq('form_type', 'employer_survey');
        }
        setDraftSavedAt(null);
    };

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

                // Load Delegation State
                if (data.is_delegated) {
                    setIsDelegateMode(true);
                    setDelegateEmail(data.delegate_email || '');
                    setDelegationStatus(data.delegation_status || 'pending');
                }
            } else {
                // FALLBACK: Try to fetch from DIC Master Sheet if no survey submission exists
                // We match by employer_name which effectively is the user.name for company logins
                const { data: masterData, error: masterError } = await supabase
                    .from('dic_master_companies')
                    .select('*')
                    .eq('employer_name', user.name)
                    .maybeSingle();

                if (masterData && !masterError) {
                    console.log("Auto-populating from DIC Master Data");
                    setFormData(prev => ({
                        ...prev,
                        companyName: masterData.employer_name || prev.companyName,
                        industrySector: masterData.sector || prev.industrySector,
                        district: masterData.district_id || prev.district,
                        contactName: masterData.contact_person_name || prev.contactName,
                        contactEmail: masterData.contact_person_email || prev.contactEmail,
                        registrationNumber: masterData.registration_number || prev.registrationNumber,
                        // Add address if available in master data in future
                    }));
                }
            }
        } catch (err) {
            console.error("Error auto-populating form:", err);
        }
    };

    const handleDelegate = async () => {
        if (!delegateEmail || !formData.companyName) return;

        try {
            // 1. Ensure we have credentials for the company
            let credentialsToShare = user;
            if (!credentialsToShare) {
                // Generate/Get credentials if guest
                const cred = await generateCredential({
                    role: 'company',
                    entityId: `company-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}`,
                    entityName: formData.companyName,
                    email: formData.contactEmail || delegateEmail // Fallback to delegate email if contact missing
                });
                credentialsToShare = { ...cred, id: cred.id } as any;
            }

            // 2. Save Delegation Status to DB
            // We need to upsert the record first to establish the ID/Record


            // Basic Upsert to ensure record exists
            const { error } = await supabase
                .from('ad_survey_employer')
                .upsert({
                    employer_name: formData.companyName,
                    // If guest, we might rely on created_by_credential_id if we have it, or just this flag
                    delegate_email: delegateEmail,
                    is_delegated: true,
                    delegation_status: 'pending',
                    created_by_credential_id: credentialsToShare?.id
                }, { onConflict: 'employer_name' }) // simplified assumption
                .select()
                .single();

            if (error) throw error;

            // 3. Send Email (Mocking the service call for now)
            console.log(`Sending delegation email to ${delegateEmail} with creds:`, credentialsToShare);
            await emailService.sendDelegationEmail(delegateEmail, formData.companyName, credentialsToShare);

            alert(`Delegation link sent to ${delegateEmail}!`);
            setDelegationStatus('pending');

        } catch (error: any) {
            console.error("Delegation failed:", error);
            alert("Failed to delegate: " + error.message);
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
                // Auto-advance delegation status
                delegation_status: delegationStatus === 'pending' ? 'filled' :
                    delegationStatus === 'filled' ? 'approved' :
                        delegationStatus,
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
        clearDraft(); // Clear local storage after successful submission
        setIsSubmitted(true); // Show acknowledgment screen
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const handleDownloadCSV = () => {
        const dataForExport = [
            { Field: 'Company Name', Value: formData.companyName },
            { Field: 'Registration Number', Value: formData.registrationNumber },
            { Field: 'Company Type', Value: formData.companyType },
            { Field: 'Industry Sector', Value: formData.industrySector },
            { Field: 'Sub Sector', Value: formData.subSector },
            { Field: 'Business Activity', Value: formData.businessActivity },
            { Field: 'Office Address', Value: formData.officeAddress },
            { Field: 'Manufacturing Location', Value: formData.manufacturingLocation },
            { Field: 'District', Value: formData.district },
            { Field: 'Contact Name', Value: formData.contactName },
            { Field: 'Contact Designation', Value: formData.contactDesignation },
            { Field: 'Contact Email', Value: formData.contactEmail },
            { Field: 'Contact Phone', Value: formData.contactPhone }
        ];

        const worksheet = XLSX.utils.json_to_sheet(dataForExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Survey_Data");
        XLSX.writeFile(workbook, `${formData.companyName.replace(/\s+/g, '_')}_Survey.xlsx`);
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    const SuccessView = () => (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-500 print:p-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden print:border-none print:shadow-none">
                <div className="p-8 md:p-12 text-center border-b border-slate-100 dark:border-slate-700 print:pb-4">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 print:w-12 print:h-12 print:mb-2">
                        <Check size={40} className="print:w-6 print:h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 print:text-xl">Submission Successful!</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto print:text-sm">
                        Thank you for contributing to the District Industrial Directory. Your organization's data has been securely recorded.
                    </p>
                </div>

                <div className="p-8 md:p-12">
                    {requestedCreds && (
                        <div className="mb-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 print:hidden">
                            <h2 className="text-blue-900 dark:text-blue-300 font-bold mb-4 flex items-center gap-2">
                                <Key size={20} />
                                Your Portal Credentials
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1 font-semibold">Username</span>
                                    <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">{requestedCreds.username}</span>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1 font-semibold">Password</span>
                                    <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">{requestedCreds.password}</span>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-blue-700/70 dark:text-blue-400/70 italic">
                                * Please safe guard these credentials for future updates to your organization profile.
                            </p>
                        </div>
                    )}

                    <div className="mb-10">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 print:text-base print:mb-2">
                            <FileText size={20} className="text-blue-500 print:w-4 print:h-4" />
                            Submission Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 print:grid-cols-2 print:gap-4">
                            {[
                                { label: 'Organization', value: formData.companyName },
                                { label: 'Sector', value: formData.industrySector },
                                { label: 'Type', value: formData.companyType },
                                { label: 'Contact', value: formData.contactName },
                                { label: 'Email', value: formData.contactEmail },
                                { label: 'Location', value: `${formData.district}, ${formData.state}` }
                            ].map((item, idx) => (
                                <div key={idx} className="border-b border-slate-100 dark:border-slate-700/50 pb-2 print:pb-1 print:border-slate-200">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1 font-medium">{item.label}</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-medium print:text-sm">{item.value || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-700 print:hidden">
                        <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold shadow-sm"
                        >
                            <Download size={18} />
                            Download CSV
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/20"
                        >
                            <Printer size={18} />
                            Download PDF / Print
                        </button>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="w-full md:w-auto px-6 py-3 text-slate-500 hover:text-slate-800 transition-colors font-medium"
                        >
                            Fill Another Response
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isSubmitted) {
        return <SuccessView />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 print:hidden">
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
                    <div className="flex items-center gap-4">
                        {draftSavedAt && (
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Draft Saved</span>
                                <span className="text-[10px] text-slate-500 font-bold">{draftSavedAt}</span>
                            </div>
                        )}
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
                <div className="flex items-center justify-between mb-12 px-4 relative">
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />
                    <div
                        className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
                        style={{ width: `${((activeSection - 1) / 4) * 100}%` }}
                    />
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex flex-col items-center relative z-10 w-1/5">
                            <button
                                onClick={() => step < activeSection || (step === activeSection) ? setActiveSection(step) : null}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all duration-300 ${activeSection === step
                                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/20 scale-110'
                                    : activeSection > step
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400'
                                    }`}
                            >
                                {activeSection > step ? <Check size={16} /> : step}
                            </button>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter text-center px-1 ${activeSection === step ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                                }`}>
                                {step === 1 ? 'Comp.' : step === 2 ? 'Loc.' : step === 3 ? 'Hiring' : step === 4 ? 'Cont.' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">

                    {/* Section 1: Company Information */}
                    {/* Delegate Workflow Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-indigo-100 dark:border-slate-700">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                    Delegate Form Filling
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    You can delegate this form to a colleague. They will receive a link to fill it out.
                                    You will review and approve it before final submission.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isDelegateMode}
                                        onChange={(e) => {
                                            setIsDelegateMode(e.target.checked);
                                            if (!e.target.checked) setDelegateEmail('');
                                        }}
                                        disabled={delegationStatus !== 'none'}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        {isDelegateMode && delegationStatus === 'none' && (
                            <div className="mt-4 p-4 bg-indigo-50 dark:bg-slate-900/50 rounded-lg border border-indigo-100 dark:border-slate-700 animate-in slide-in-from-top-2">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Delegate Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={delegateEmail}
                                                onChange={(e) => setDelegateEmail(e.target.value)}
                                                placeholder="colleague@company.com"
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDelegate}
                                        disabled={!delegateEmail || !formData.companyName}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Key className="w-4 h-4" />
                                        Send Access Link
                                    </button>
                                </div>
                                {!formData.companyName && (
                                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Please enter Company Name below first.
                                    </p>
                                )}
                            </div>
                        )}

                        {delegationStatus === 'pending' && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 text-amber-800 dark:text-amber-200 flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                <div>
                                    <p className="font-medium">Delegation Pending</p>
                                    <p className="text-sm opacity-90">Waiting for delegate ({delegateEmail}) to fill the form.</p>
                                </div>
                            </div>
                        )}

                        {delegationStatus === 'filled' && (
                            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-600" />
                                <div>
                                    <p className="font-medium">Ready for Approval</p>
                                    <p className="text-sm opacity-90">Delegate has completed the form. Please review and submit.</p>
                                </div>
                            </div>
                        )}
                    </div>

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
                                    onClick={() => setActiveSection(5)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium flex items-center gap-2"
                                >
                                    Preview Submission <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 5: Preview & Final Submission */}
                    {activeSection === 5 && (
                        <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    Review Your Submission
                                </h2>
                                <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Final Summary
                                </span>
                            </div>

                            <div className="space-y-8">
                                {/* Company Info Summary */}
                                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
                                            <Building2 size={18} className="text-blue-500" />
                                            Organization & Location
                                        </h3>
                                        <button onClick={() => setActiveSection(1)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                            <Pencil size={12} /> Edit
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Name', value: formData.companyName },
                                            { label: 'Sector', value: formData.industrySector },
                                            { label: 'Type', value: formData.companyType },
                                            { label: 'District', value: formData.district },
                                            { label: 'State', value: formData.state },
                                            { label: 'Registration', value: formData.registrationNumber || 'N/A' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1 tracking-wider">{item.label}</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate" title={item.value || ''}>{item.value || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hiring Summary */}
                                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
                                            <Briefcase size={18} className="text-blue-500" />
                                            Hiring Overview
                                        </h3>
                                        <button onClick={() => setActiveSection(3)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                            <Pencil size={12} /> Edit
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2 tracking-wider">Trainees Recruited (Past 12m)</span>
                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Total Count</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{pastHiring.reduce((sum, h) => sum + (h.num_trainees || 0), 0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Unique Job Roles</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{pastHiring.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2 tracking-wider">Future Demand (Next 12m)</span>
                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Planned Openings</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{futureHiring.reduce((sum, h) => sum + (h.num_people || 0), 0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Planned Roles</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{futureHiring.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Person Summary */}
                                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
                                            <Phone size={18} className="text-blue-500" />
                                            Contact Information
                                        </h3>
                                        <button onClick={() => setActiveSection(4)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                            <Pencil size={12} /> Edit
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Name', value: formData.contactName },
                                            { label: 'Designation', value: formData.contactDesignation },
                                            { label: 'Email', value: formData.contactEmail },
                                            { label: 'Phone', value: formData.contactPhone }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1 tracking-wider">{item.label}</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate" title={item.value || ''}>{item.value || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1 text-lg">Ready to final submit?</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-400">Please review your entries. You can go back and make changes if needed.</p>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => setActiveSection(4)}
                                        className="flex-1 md:flex-none px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
                                    >
                                        Back to Form
                                    </button>
                                    <button
                                    onClick={handleSubmitSurvey}
                                        disabled={saveStatus === 'saving'}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all font-bold shadow-lg shadow-blue-500/30 active:scale-95 disabled:bg-blue-400"
                                >
                                        <Check className="w-5 h-5" />
                                        {saveStatus === 'saving' ? 'Submitting...' :
                                            delegationStatus === 'filled' ? 'Approve & Final Submit' :
                                                delegationStatus === 'pending' ? 'Submit for Approval' :
                                                    'Confirm & Final Submit'}
                                </button>
                            </div>
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
