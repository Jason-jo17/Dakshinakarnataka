import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Plus, Trash2, Phone, AlertCircle, ArrowRight, Pencil, ShieldCheck, Key, Check, Download, Printer, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCredentialStore } from '../../../store/useCredentialStore';
import type { GeneratedCredential } from '../../../store/useCredentialStore';
import { supabase } from '../../../lib/supabaseClient';
import { emailService } from '../../../services/emailService';
import { toSlug } from '../../../utils/slugUtils';

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
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { generateCredential } = useCredentialStore();
    const { companyName: urlCompanyName, role: urlRole } = useParams();
    const [activeSection, setActiveSection] = useState<number>(1);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [requestedCreds, setRequestedCreds] = useState<GeneratedCredential | null>(null);
    const [isRequestingCreds, setIsRequestingCreds] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
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

    // Auto-slugging for authenticated users
    useEffect(() => {
        if (user && !urlCompanyName && window.location.pathname === '/company-survey') {
            const slug = user.name ? toSlug(user.name) : 'company';
            navigate(`/company-survey/${slug}`, { replace: true });
        }
    }, [user, urlCompanyName, navigate]);

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





    // Unified Initialization Logic
    useEffect(() => {
        const initForm = async () => {
            setIsInitialLoading(true);
            try {
                // 1. Fetch autofill data
                const autofillData = await fetchCompanyAutofillData();

                // 2. Load draft data
                const draftData = await loadDraftFromDB();

                // 3. Merge and set state exactly once
                setFormData(prev => {
                    let finalForm = { ...prev };

                    // Apply Autofill if found
                    if (autofillData) {
                        finalForm = {
                            ...finalForm,
                            ...autofillData
                        };
                    }

                    // Apply Draft if found (Surgical merge)
                    if (draftData && draftData.formData) {
                        const savedForm = draftData.formData;
                        const isSameCompany = urlCompanyName && savedForm.companyName &&
                            (toSlug(savedForm.companyName) === urlCompanyName);

                        // Priority: URL Company Name > Draft Company Name
                        const finalCompanyName = (urlCompanyName && !isSameCompany)
                            ? finalForm.companyName
                            : (savedForm.companyName || finalForm.companyName);

                        // Merge draft fields but PROTECT non-empty autofilled fields from being emptied by draft
                        Object.keys(savedForm).forEach(key => {
                            const k = key as keyof EmployerSurveyData;
                            if (savedForm[k]) {
                                (finalForm as any)[k] = savedForm[k];
                            }
                        });

                        finalForm.companyName = finalCompanyName;
                    }

                    return finalForm;
                });

                if (draftData?.pastHiring) setPastHiring(draftData.pastHiring);
                if (draftData?.futureHiring) setFutureHiring(draftData.futureHiring);

                // 4. Fetch sidebar history
                await fetchSurveyData(sessionSubmissionIds);
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setIsInitialLoading(false);
            }
        };

        if (user !== undefined) {
            initForm();
        }
    }, [user, urlCompanyName]);

    const loadDraftFromDB = async () => {
        const identifier = user?.id || localStorage.getItem('employer_survey_session_id');
        if (!identifier) return null;

        const { data, error } = await supabase
            .from('user_drafts')
            .select('state')
            .eq('form_type', 'employer_survey')
            .or(`user_id.eq.${identifier},guest_id.eq.${identifier},user_id.eq.${user?.name || ''}`)
            .maybeSingle();

        if (error || !data?.state) return null;
        return data.state as { formData: EmployerSurveyData, pastHiring: any[], futureHiring: any[] };
    };

    const handleSaveDraft = async (manual = false) => {
        const identifier = user?.id || guestSessionId;
        if (!identifier) return;

        if (manual) setSaveStatus('saving');
        const draftState = { formData, pastHiring, futureHiring };
        const { error } = await supabase
            .from('user_drafts')
            .upsert({
                [user ? 'user_id' : 'guest_id']: identifier,
                form_type: 'employer_survey',
                state: draftState,
                updated_at: new Date().toISOString()
            }, { onConflict: user ? 'user_id,form_type' : 'guest_id,form_type' });

        if (!error) {
            setDraftSavedAt(new Date().toLocaleTimeString());
            if (manual) {
                setTimeout(() => setSaveStatus('idle'), 2000);
                alert("Draft saved successfully!");
            }
        } else {
            console.error('Save draft error:', error);
            if (manual) {
                setSaveStatus('idle');
                alert("Failed to save draft. Check console for details.");
            }
        }
    };

    // Auto-save to DB
    useEffect(() => {
        if (!isSubmitted && !isInitialLoading) {
            const timer = setTimeout(() => handleSaveDraft(false), 2000); // 2 second delay
            return () => clearTimeout(timer);
        }
    }, [formData, pastHiring, futureHiring, isSubmitted, user, guestSessionId, isInitialLoading]);

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
                entityId: `company-${toSlug(formData.companyName)}`,
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

    // Debug state changes
    useEffect(() => {
        if (surveyData.length > 0) {
            console.log("📈 surveyData updated with", surveyData.length, "items.");
        }
    }, [surveyData]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sessionSubmissionIds, setSessionSubmissionIds] = useState<string[]>(() => {
        const saved = localStorage.getItem('employer_survey_session_ids');
        return saved ? JSON.parse(saved) : [];
    });

    // Finalize Autofill Function
    const fetchCompanyAutofillData = async () => {
        try {
            if (!user && !urlCompanyName) return null;
            console.log("🔍 Fetching Autofill Data...");

            // 1. Check New Public Autofill Table (FAST & Guest Friendly)
            if (urlCompanyName) {
                const { data: autofillMatch } = await supabase
                    .from('dic_company_autofill')
                    .select('*')
                    .eq('slug', urlCompanyName)
                    .limit(1)
                    .maybeSingle();

                if (autofillMatch) {
                    console.log("✅ Found match in dic_company_autofill");
                    return {
                        companyName: autofillMatch.employer_name,
                        industrySector: autofillMatch.sector,
                        registrationNumber: autofillMatch.registration_number,
                        officeAddress: autofillMatch.address
                    };
                }
            }

            // 2. Fallback: Search Master Data & Previous Surveys (Industrial Strength)
            if (user) {
                const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

                // TIER 1: Match by Unique Registration Number (Highest Precision)
                if (user.managedEntityId) {
                    const { data: idMatch } = await supabase
                        .from('dic_master_companies')
                        .select('*')
                        .eq('registration_number', user.managedEntityId)
                        .limit(1)
                        .maybeSingle();

                    if (idMatch) {
                        console.log("🎯 Tier 1 Match: Found by registration_number");
                        return {
                            companyName: idMatch.employer_name,
                            industrySector: idMatch.sector,
                            district: idMatch.district_id,
                            contactName: idMatch.contact_person_name,
                            contactEmail: idMatch.contact_person_email,
                            contactPhone: idMatch.contact_person_phone,
                            registrationNumber: idMatch.registration_number,
                            officeAddress: idMatch.address
                        };
                    }
                }

                // TIER 2: Match by Exact Name
                const { data: exactMatch } = await supabase
                    .from('dic_master_companies')
                    .select('*')
                    .eq('employer_name', user.name)
                    .limit(1)
                    .maybeSingle();

                if (exactMatch) {
                    console.log("🎯 Tier 2 Match: Found by exact name");
                    return {
                        companyName: exactMatch.employer_name,
                        industrySector: exactMatch.sector,
                        district: exactMatch.district_id,
                        contactName: exactMatch.contact_person_name,
                        contactEmail: exactMatch.contact_person_email,
                        contactPhone: exactMatch.contact_person_phone,
                        registrationNumber: exactMatch.registration_number,
                        officeAddress: exactMatch.address
                    };
                }

                // TIER 3: Fallback to Tokenized/Email Match (Industrial Strength)
                const cleanName = user.name?.replace(/[().,&-]/g, ' ')?.replace(/\bEngg\b/gi, 'Engineering')?.replace(/\s+/g, ' ')?.trim();
                const noiseWords = ['PVT', 'LTD', 'LIMITED', 'PRIVATE', 'CO', 'CORP', 'INC', 'AND', 'THE', 'FOR', 'WITH'];
                const tokens = cleanName?.split(' ')?.filter(t =>
                    t.length > 2 && !noiseWords.includes(t.toUpperCase())
                ) || [];
                const wildcard = tokens.length > 0 ? `%${tokens.join('%')}%` : `%${user.name}%`;

                console.log(`🔍 Tier 3 Fallback: Checking broad matches for: ${wildcard}`);
                const { data: broadMatch } = await supabase
                    .from('dic_master_companies')
                    .select('*')
                    .or(`employer_name.ilike.${wildcard},contact_person_email.ilike.${user.email || 'none'}`)
                    .limit(1)
                    .maybeSingle();

                if (broadMatch) {
                    console.log("✅ Tier 3 Match: Found by broad token/email");
                    return {
                        companyName: broadMatch.employer_name,
                        industrySector: broadMatch.sector,
                        district: broadMatch.district_id,
                        contactName: broadMatch.contact_person_name,
                        contactEmail: broadMatch.contact_person_email,
                        contactPhone: broadMatch.contact_person_phone,
                        registrationNumber: broadMatch.registration_number,
                        officeAddress: broadMatch.address
                    };
                }

                // CHECK PREVIOUS SURVEYS (Last Resort)
                const filters = [`employer_name.eq."${user.name}"`]; // Prioritize exact name in survey table
                if (user.email) filters.push(`contact_person_email.ilike.${user.email}`);
                if (isUUID(user.id)) filters.push(`created_by_credential_id.eq.${user.id}`);

                const { data: lastSurvey } = await supabase
                    .from('ad_survey_employer')
                    .select('*')
                    .or(filters.join(','))
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (lastSurvey) {
                    console.log("✅ Found previous submission in survey table");
                    return {
                        companyName: lastSurvey.employer_name,
                        registrationNumber: lastSurvey.registration_number || '',
                        companyType: lastSurvey.company_type || '',
                        industrySector: lastSurvey.sector || '',
                        subSector: lastSurvey.sub_sector || '',
                        businessActivity: lastSurvey.business_activity || '',
                        officeAddress: lastSurvey.employer_address || '',
                        manufacturingLocation: lastSurvey.manufacturing_location || '',
                        district: lastSurvey.district_id,
                        state: lastSurvey.state || 'Karnataka',
                        contactName: lastSurvey.contact_person_name || '',
                        contactDesignation: lastSurvey.contact_person_designation || '',
                        contactDepartment: lastSurvey.contact_department || '',
                        contactPhone: lastSurvey.contact_person_phone || '',
                        contactEmail: lastSurvey.contact_person_email || ''
                    };
                }
            }
            return null;
        } catch (err) {
            console.error("Autofill fetch failed:", err);
            return null;
        }
    };

    const fetchSurveyData = async (manualIds?: string[]) => {
        try {
            setLoading(true);
            const currentIds = manualIds || sessionSubmissionIds;
            console.log("🔍 Fetching Survey Data...");

            let query = supabase.from('ad_survey_employer').select('*').order('created_at', { ascending: false });

            // GUEST USER
            if (!user) {
                if (currentIds.length === 0) {
                    setSurveyData([]);
                    setLoading(false);
                    return;
                }
                query = query.in('id', currentIds);
            }
                // LOGGED IN USER
            else if (user?.role === 'company') {
                const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
                const filters = [];

                // 1. Always prioritize exact name visibility
                filters.push(`employer_name.eq."${user.name}"`);

                // 2. Prioritize exact ID match
                if (user.managedEntityId && String(user.managedEntityId).length > 3) {
                    filters.push(`registration_number.eq."${user.managedEntityId}"`);
                }

                // 3. Credential ID match (Absolute security)
                if (isUUID(user.id)) {
                    filters.push(`created_by_credential_id.eq.${user.id}`);
                }

                // 4. Tokenized Fallback (Use ONLY if no exact matches exist to avoid confusion)
                // We make these more restrictive for "Unit" cases
                const cleanName = user.name?.replace(/[().,&-]/g, ' ')?.replace(/\bEngg\b/gi, 'Engineering')?.replace(/\s+/g, ' ')?.trim();
                const noiseWords = ['PVT', 'LTD', 'LIMITED', 'PRIVATE', 'CO', 'CORP', 'INC', 'AND', 'THE', 'FOR', 'WITH', 'UNIT'];
                const tokens = cleanName?.split(' ')?.filter(t =>
                    t.length > 2 && !noiseWords.includes(t.toUpperCase())
                ) || [];

                if (tokens.length > 0) {
                    const wildcardName = tokens.join('%');
                    // Only use broad filter if name is unique enough (more than 2 tokens)
                    if (tokens.length >= 2) {
                        filters.push(`employer_name.ilike.%${wildcardName}%`);
                    }
                }

                // 5. Email matching
                if (user.email) {
                    filters.push(`contact_person_email.ilike.${user.email}`);
                }

                if (currentIds.length > 0) {
                    const validIds = currentIds.filter(id => isUUID(id));
                    if (validIds.length > 0) filters.push(`id.in.(${validIds.join(',')})`);
                }

                console.log("🛠️ Data Visibility Filters Applied:", filters.length);
                query = query.or(filters.join(','));
            }
            // ADMINS
            else { console.log("👑 Admin/Default view"); }

            const { data, error } = await query;
            if (error) {
                if (error.code === '22P02' && user?.role === 'company') {
                    const nameFilter = user.name.replace(/[()]/g, '');
                    const { data: retryData } = await supabase.from('ad_survey_employer').select('*').ilike('employer_name', `%${nameFilter}%`).order('created_at', { ascending: false });
                    setSurveyData(Array.from(new Map((retryData || []).map(item => [item.id, item])).values()));
                    return;
                }
                throw error;
            }
            setSurveyData(Array.from(new Map((data || []).map(item => [item.id, item])).values()));
        } catch (error) {
            console.error('Error fetching survey data:', error);
        } finally {
            setLoading(false);
        }
    };
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


    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        console.log("🗑️ Deleting record ID:", id);
        const { error } = await supabase.from('ad_survey_employer').delete().eq('id', id);

        if (error) {
            console.error('Error deleting:', error);
            alert(`Failed to delete record: ${error.message}`);
        } else {
            // Optimistic update
            setSurveyData(prev => prev.filter(item => item.id !== id));
            console.log("✅ Record deleted successfully from state.");
            alert("Record deleted successfully!");
            // Full refresh to be sure
            fetchSurveyData();
        }
    };

    const handleSubmitSurvey = async () => {
        if (saveStatus === 'saving') return;
        setSaveStatus('saving');

        if (editingId) {
            // For edit, we update the primary record (the one clicked)
            // and if there are more records in the list, we insert them as NEW rows
            const pastItem = pastHiring[0];
            const futureItem = futureHiring[0];

            const primaryUpdateData = {
                employer_name: formData.companyName,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
                employer_address: formData.officeAddress,
                registration_number: formData.registrationNumber,
                company_type: formData.companyType,
                sector: formData.industrySector,
                sub_sector: formData.subSector,
                business_activity: formData.businessActivity,
                manufacturing_location: formData.manufacturingLocation,
                state: formData.state,
                created_by_credential_id: user?.id, // Ensure this is captured/updated

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

            // 1. Update the original row
            const { error: updateError } = await supabase
                .from('ad_survey_employer')
                .update(primaryUpdateData)
                .eq('id', editingId);

            if (updateError) {
                console.error('Update error:', updateError);
                alert('Failed to update survey: ' + updateError.message);
                setSaveStatus('idle');
                return;
            }

            // 2. Handle ADDITIONAL rows if user added more during edit session
            const maxRecords = Math.max(pastHiring.length, futureHiring.length);
            if (maxRecords > 1) {
                const additionalData = [];
                for (let i = 1; i < maxRecords; i++) {
                    const pH = pastHiring[i];
                    const fH = futureHiring[i];
                    additionalData.push({
                        ...primaryUpdateData,
                        id: undefined, // Let DB generate new UUID
                        recruited_past_12m_num: pH?.num_trainees || 0,
                        recruited_past_12m_avg_salary: pH?.avg_salary || 0,
                        recruited_job_roles: pH?.job_roles || '',
                        skill_gaps_observed: pH?.has_skill_gaps ? (pH?.skill_gaps || '') : '',
                        expected_recruit_num: fH?.num_people || 0,
                        expected_recruit_salary: fH?.salary || 0,
                        expected_recruit_job_role: fH?.job_role || '',
                        expected_recruit_qualification: fH?.qualification || '',
                        place_of_recruitment: fH?.place_of_deployment || ''
                    });
                }
                const { data: newInserted, error: insertError } = await supabase.from('ad_survey_employer').insert(additionalData).select();
                if (newInserted) {
                    const newIds = newInserted.map(d => d.id);
                    setSessionSubmissionIds(prev => [...prev, ...newIds]);
                }
                if (insertError) console.error("Error inserting additional rows during edit:", insertError);
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
                    status: 'submitted',
                    submitted_at: new Date().toISOString(),

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
                setSessionSubmissionIds(prev => {
                    const updated = [...prev, ...newIds];
                    localStorage.setItem('employer_survey_session_ids', JSON.stringify(updated));
                    fetchSurveyData(updated); // Immediate fetch with new IDs
                    return updated;
                });
            }
            if (error) {
                console.error('Submission error:', error);
                alert('Failed to submit survey: ' + error.message);
                setSaveStatus('idle');
                return;
            }
        }

        setSaveStatus('saved');

        // COMREHENSIVE DATA SYNC: Update all master tables and user profile
        if (user && formData.companyName) {
            console.log("♻️ Syncing updated company information to master tables...");

            // 1. Update User Profile
            const userUpdate: any = { entity_name: formData.companyName };
            if (formData.contactEmail) userUpdate.email = formData.contactEmail;

            await supabase.from('users').update(userUpdate).eq('id', user.id);

            // Update local session immediately
            useAuthStore.getState().login({
                ...user,
                name: formData.companyName,
                email: formData.contactEmail || user.email
            });

            // 2. Update dic_master_companies (The primary source for autofill)
            // Use registration number or old name as anchors
            const masterUpdate = {
                employer_name: formData.companyName,
                address: formData.officeAddress,
                sector: formData.industrySector,
                contact_person_name: formData.contactName,
                contact_person_email: formData.contactEmail,
                contact_person_phone: formData.contactPhone,
                registration_number: formData.registrationNumber
            };

            if (formData.registrationNumber) {
                await supabase.from('dic_master_companies')
                    .update(masterUpdate)
                    .eq('registration_number', formData.registrationNumber);
            } else {
                // Fallback to original name if registration number is missing
                await supabase.from('dic_master_companies')
                    .update(masterUpdate)
                    .eq('employer_name', user.name);
            }

            // 3. Update or Insert into dic_company_autofill (For guest/public access)
            const slug = toSlug(formData.companyName);
            const autofillData = {
                employer_name: formData.companyName,
                address: formData.officeAddress,
                sector: formData.industrySector,
                registration_number: formData.registrationNumber,
                slug: slug,
                updated_at: new Date().toISOString()
            };

            await supabase.from('dic_company_autofill').upsert(autofillData, {
                onConflict: 'employer_name'
            });
        }

        alert(editingId ? 'Survey Updated Successfully!' : 'Survey Submitted Successfully!');

        // Send survey completion email if user has email
        if (user?.email) {
            emailService.sendSurveyCompletionEmail(user.email, formData.companyName).catch(err => {
                console.error("Failed to send survey completion email:", err);
            });
        }

        if (editingId) setEditingId(null);
        clearDraft(); // Clear local storage after successful submission
        setIsSubmitted(true); // Show acknowledgment screen
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const handleDownloadCSV = () => {
        const dataForExport = [
            // Section 1: Company
            { Field: '--- SECTION 1: COMPANY INFORMATION ---', Value: '' },
            { Field: 'Company Name', Value: formData.companyName },
            { Field: 'Registration Number', Value: formData.registrationNumber },
            { Field: 'Company Type', Value: formData.companyType },
            { Field: 'Industry Sector', Value: formData.industrySector },
            { Field: 'Sub Sector', Value: formData.subSector },
            { Field: 'Business Activity', Value: formData.businessActivity },

            // Section 2: Location
            { Field: '', Value: '' },
            { Field: '--- SECTION 2: LOCATION ---', Value: '' },
            { Field: 'Office Address', Value: formData.officeAddress },
            { Field: 'Manufacturing Location', Value: formData.manufacturingLocation },
            { Field: 'District', Value: formData.district },
            { Field: 'State', Value: formData.state },

            // Section 3: Past Hiring
            { Field: '', Value: '' },
            { Field: '--- SECTION 3: RECRUITED IN PAST 12 MONTHS ---', Value: '' },
            ...pastHiring.flatMap((row, index) => [
                { Field: `Past Hiring Record #${index + 1}`, Value: '' },
                { Field: '  No. Trainees', Value: row.num_trainees },
                { Field: '  Avg Salary', Value: row.avg_salary },
                { Field: '  Job Roles', Value: row.job_roles },
                { Field: '  Skill Gaps?', Value: row.has_skill_gaps ? 'Yes' : 'No' },
                { Field: '  Gap Description', Value: row.has_skill_gaps ? row.skill_gaps : 'N/A' },
            ]),

            // Section 3: Future Hiring
            { Field: '', Value: '' },
            { Field: '--- SECTION 3: EXPECTED HIRING (NEXT 12M) ---', Value: '' },
            ...futureHiring.flatMap((row, index) => [
                { Field: `Future Hiring Plan #${index + 1}`, Value: '' },
                { Field: '  No. People', Value: row.num_people },
                { Field: '  Job Role', Value: row.job_role },
                { Field: '  Salary', Value: row.salary },
                { Field: '  Qualification', Value: row.qualification },
                { Field: '  Place of Deployment', Value: row.place_of_deployment },
            ]),

            // Section 4: Contact
            { Field: '', Value: '' },
            { Field: '--- SECTION 4: CONTACT PERSON ---', Value: '' },
            { Field: 'Contact Name', Value: formData.contactName },
            { Field: 'Contact Designation', Value: formData.contactDesignation },
            { Field: 'Contact Email', Value: formData.contactEmail },
            { Field: 'Contact Phone', Value: formData.contactPhone },
            { Field: 'Contact Department', Value: formData.contactDepartment }
        ];

        const worksheet = XLSX.utils.json_to_sheet(dataForExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Full_Survey_Report");
        XLSX.writeFile(workbook, `${formData.companyName.replace(/\s+/g, '_')}_Full_Report.xlsx`);
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
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 print:text-base print:mb-2 border-b-2 border-slate-100 dark:border-slate-700/50 pb-2">
                            <FileText size={20} className="text-blue-500 print:w-4 print:h-4" />
                            Complete Submission Report
                        </h2>

                        <div className="space-y-8">
                            {/* Section 1 & 2 */}
                            <section>
                                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider print:text-xs">1. Organization & Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 print:grid-cols-2 print:gap-4">
                                    {[
                                        { label: 'Organization', value: formData.companyName },
                                        { label: 'Registration', value: formData.registrationNumber },
                                        { label: 'Type', value: formData.companyType },
                                        { label: 'Sector', value: formData.industrySector },
                                        { label: 'Sub Sector', value: formData.subSector },
                                        { label: 'Activity', value: formData.businessActivity },
                                        { label: 'Office Address', value: formData.officeAddress },
                                        { label: 'Plant Location', value: formData.manufacturingLocation },
                                    ].map((item, idx) => (
                                        <div key={idx} className="border-b border-slate-50 dark:border-slate-700/30 pb-2 print:pb-1">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5 font-medium">{item.label}</span>
                                            <span className="text-slate-800 dark:text-slate-200 font-medium print:text-sm">{item.value || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section 3: Past */}
                            {pastHiring.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider print:text-xs">2. Records: Past 12 Months</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm print:text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-700">
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Trainees</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Salary</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Roles</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Skill Gaps</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {pastHiring.map((row, idx) => (
                                                    <tr key={idx}>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">{row.num_trainees}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">₹{row.avg_salary}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">{row.job_roles}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">
                                                            {row.has_skill_gaps ? row.skill_gaps : 'None'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            )}

                            {/* Section 3: Future */}
                            {futureHiring.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider print:text-xs">3. Future Hiring Plans</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm print:text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-700">
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">People</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Role</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Salary</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Qualif.</th>
                                                    <th className="p-2 font-bold text-slate-600 dark:text-slate-400">Location</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {futureHiring.map((row, idx) => (
                                                    <tr key={idx}>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">{row.num_people}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300 font-medium">{row.job_role}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">₹{row.salary}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">{row.qualification}</td>
                                                        <td className="p-2 text-slate-700 dark:text-slate-300">{row.place_of_deployment}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            )}

                            {/* Section 4 */}
                            <section>
                                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider print:text-xs">4. Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 print:grid-cols-2 print:gap-4">
                                    {[
                                        { label: 'Contact Name', value: formData.contactName },
                                        { label: 'Designation', value: formData.contactDesignation },
                                        { label: 'Department', value: formData.contactDepartment },
                                        { label: 'Email', value: formData.contactEmail },
                                        { label: 'Phone', value: formData.contactPhone },
                                    ].map((item, idx) => (
                                        <div key={idx} className="border-b border-slate-50 dark:border-slate-700/30 pb-2 print:pb-1">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5 font-medium">{item.label}</span>
                                            <span className="text-slate-800 dark:text-slate-200 font-medium print:text-sm">{item.value || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
                            onClick={handleLogout}
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
                                        onClick={() => handleSaveDraft(true)}
                                        disabled={saveStatus === 'saving'}
                                        className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Save Draft
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
                                    Next
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
                            <div className="mt-8 flex justify-between items-center">
                                <button onClick={() => setActiveSection(1)} className="btn-secondary">Back</button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleSaveDraft(true)}
                                        disabled={saveStatus === 'saving'}
                                        className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Save Draft
                                    </button>
                                    <button onClick={() => setActiveSection(3)} className="btn-primary">Next</button>
                                </div>
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

                            <div className="mt-8 flex justify-between items-center">
                                <button onClick={() => setActiveSection(2)} className="btn-secondary">Back</button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleSaveDraft(true)}
                                        disabled={saveStatus === 'saving'}
                                        className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Save Draft
                                    </button>
                                    <button onClick={() => setActiveSection(4)} className="btn-primary">Next</button>
                                </div>
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

                            <div className="mt-8 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <button onClick={() => setActiveSection(3)} className="btn-secondary">Back</button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleSaveDraft(true)}
                                        disabled={saveStatus === 'saving'}
                                        className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Save Draft
                                    </button>
                                    <button
                                        onClick={() => setActiveSection(5)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium flex items-center gap-2"
                                    >
                                        Preview Submission <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
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
                                            { label: 'Registration', value: formData.registrationNumber || 'N/A' },
                                            { label: 'Office Address', value: formData.officeAddress },
                                            { label: 'Plant Location', value: formData.manufacturingLocation || 'N/A' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1 tracking-wider">{item.label}</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200" title={item.value || ''}>{item.value || 'N/A'}</span>
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
                                            <div className="flex flex-wrap gap-6 text-sm mb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Total Count</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{pastHiring.reduce((sum, h) => sum + (h.num_trainees || 0), 0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Unique Job Roles</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{pastHiring.length}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                {pastHiring.map((h, i) => h.job_roles && (
                                                    <div key={i} className="text-xs flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{h.num_trainees}x</span> {h.job_roles}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-2 tracking-wider">Future Demand (Next 12m)</span>
                                            <div className="flex flex-wrap gap-6 text-sm mb-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Planned Openings</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{futureHiring.reduce((sum, h) => sum + (h.num_people || 0), 0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-500">Planned Roles</span>
                                                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{futureHiring.length}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                {futureHiring.map((h, i) => h.job_role && (
                                                    <div key={i} className="text-xs flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{h.num_people}x</span> {h.job_role}
                                                    </div>
                                                ))}
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
                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => setActiveSection(4)}
                                        className="flex-1 md:flex-none px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
                                    >
                                        Back to Form
                                    </button>
                                    <button
                                        onClick={() => handleSaveDraft(true)}
                                        disabled={saveStatus === 'saving'}
                                        className="flex-1 md:flex-none px-6 py-3 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-semibold shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck className="w-5 h-5" />
                                        {saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
                                    </button>
                                    <button
                                        onClick={handleSubmitSurvey}
                                        disabled={saveStatus === 'saving'}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-10 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all font-bold shadow-lg shadow-blue-500/30 active:scale-95 disabled:bg-blue-400 whitespace-nowrap"
                                    >
                                        <Check className="w-5 h-5" />
                                        {saveStatus === 'saving' ? 'Submitting...' : 'Confirm & Final Submit'}
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
                            <button onClick={() => fetchSurveyData()} className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            {/* Debugging Log in console only */}
                            {(() => { if (surveyData.length > 0) console.log("📊 Rendering table with:", surveyData); return null; })()}
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

        </div>
    );
}
