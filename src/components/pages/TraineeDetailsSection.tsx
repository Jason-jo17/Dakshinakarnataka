import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Download, Upload, ArrowLeft, LogOut } from 'lucide-react';
import * as Papa from 'papaparse';
import type { TraineeDetails } from '../../types/trainee';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabaseClient';

const initialFormState: Omit<TraineeDetails, 'id' | 'sno'> = {
    // Candidate Details
    candidate_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    parent_guardian_name: '',
    date_of_birth: '',
    gender: 'Male',
    social_category: 'General',
    residential_pincode: '',
    district: 'Dakshina Kannada',
    is_rural_candidate: 'Rural',
    state_ut: 'Karnataka',
    mobile_number: '',
    email_id: '',
    qualification_at_entry: '',

    // Training Details
    training_center_name: '',
    training_city: '',
    training_center_pincode: '',
    training_district: '',
    training_state: 'Karnataka',
    training_programme_name: '',
    enrollment_date: '',
    training_start_date: '',
    training_end_date: '',
    assessment_date: '',
    certification_date: '',
    is_nsfq_aligned: 'Yes',
    qualification_pack_name: '',
    sector_skill_council: '',
    is_certified: 'No',
    trainer_name: '',

    // Post-Training Details
    is_employed: 'No',
    employment_type: 'Wage',
    employment_start_date: '',
    job_role: '',
    sector: '',
    employer_name: '',
    salary_fixed: '',
    salary_variable: '',
    work_district: '',
    work_state: '',
    work_place_type: 'Urban',

    // Time Series Analysis
    age_at_joining: '',
    course_duration: '',
    assessment_gap: '',
    certification_gap: '',
    delay_in_employment: '',
    cycle_time: ''
};

const TraineeDetailsSection: React.FC<{ onBack?: () => void; isRestricted?: boolean }> = ({ onBack, isRestricted }) => {
    const { user } = useAuthStore();
    const [trainees, setTrainees] = useState<TraineeDetails[]>([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [trainingCenterData, setTrainingCenterData] = useState<any>(null);
    const [allTrainingCenters, setAllTrainingCenters] = useState<any[]>([]);

    // Fetch all training centers for the dropdown
    useEffect(() => {
        const fetchAllCenters = async () => {
            const { data } = await supabase
                .from('district_training_centers')
                .select('*')
                .order('training_center_name');
            if (data) setAllTrainingCenters(data);
        };
        fetchAllCenters();
    }, []);

    // Fetch training center data if user is a trainee
    useEffect(() => {
        const fetchTrainingCenter = async () => {
            if (user?.role === 'trainee' && user?.managedEntityId) {
                const entityIdStr = String(user.managedEntityId).trim();
                console.log('[TraineeDetails] Attempting pre-fill for managedEntityId:', entityIdStr);

                // 1. Try to find in the already loaded local list (Case Insensitive + Trim)
                let center = allTrainingCenters.find(c =>
                    c.id === entityIdStr ||
                    c.training_center_name?.trim().toLowerCase() === entityIdStr.toLowerCase()
                );

                // 2. If not found in local list, try to fetch directly from Supabase
                if (!center) {
                    console.log('[TraineeDetails] Not found in local list, querying Supabase for:', entityIdStr);
                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entityIdStr);
                    let query = supabase.from('district_training_centers').select('*');

                    if (isUUID) {
                        query = query.eq('id', entityIdStr);
                    } else {
                        // Use ilike for case-insensitive matching in Supabase
                        query = query.ilike('training_center_name', entityIdStr);
                    }

                    const { data, error } = await query.limit(1).maybeSingle();
                    if (error) {
                        console.error('[TraineeDetails] Supabase query error:', error);
                    }
                    if (data) {
                        console.log('[TraineeDetails] Found center in Supabase:', data.training_center_name);
                        center = data;
                    }
                }

                if (center) {
                    console.log('[TraineeDetails] Pre-filling form for center:', center.training_center_name);
                    setTrainingCenterData(center);
                    // Pre-fill training center and candidate fields
                    const [firstName, ...lastNameParts] = (user?.name || '').split(' ');
                    const lastName = lastNameParts.join(' ');

                    setFormData(prev => ({
                        ...prev,
                        first_name: prev.first_name || firstName || '',
                        last_name: prev.last_name || lastName || '',
                        email_id: prev.email_id || user?.email || '',
                        training_center_name: center.training_center_name || '',
                        training_city: center.block || center.center_address1 || '',
                        training_center_pincode: center.pincode || '',
                        training_district: center.district || 'Dakshina Kannada',
                        training_state: 'Karnataka'
                    }));
                } else {
                    console.warn('[TraineeDetails] Center NOT FOUND for managedEntityId:', entityIdStr);
                }
            }
        };
        fetchTrainingCenter();
    }, [user, allTrainingCenters]);

    const handleCenterSelect = (centerName: string) => {
        const center = allTrainingCenters.find(c => c.training_center_name === centerName);
        if (center) {
            setFormData(prev => ({
                ...prev,
                training_center_name: center.training_center_name,
                training_city: center.block || '',
                training_center_pincode: center.pincode || '',
                training_district: center.district || 'Dakshina Kannada'
            }));
        } else {
            setFormData(prev => ({ ...prev, training_center_name: centerName }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && editId) {
            setTrainees(prev => prev.map(item =>
                item.id === editId
                    ? { ...item, ...formData, id: editId, sno: item.sno }
                    : item
            ));
            setIsEditing(false);
            setEditId(null);
        } else {
            const newEntry: TraineeDetails = {
                id: Date.now().toString(),
                sno: trainees.length + 1,
                ...formData as any // Type assertion needed due to strict types vs initial state
            };
            setTrainees([...trainees, newEntry]);
        }
        // Reset form but preserve training center data for trainees
        if (user?.role === 'trainee' && trainingCenterData) {
            setFormData({
                ...initialFormState,
                training_center_name: trainingCenterData.training_center_name || '',
                training_city: trainingCenterData.block || '',
                training_center_pincode: trainingCenterData.pincode || '',
                training_district: trainingCenterData.district || 'Dakshina Kannada',
                training_state: 'Karnataka'
            });
        } else {
            setFormData(initialFormState);
        }
    };

    const handleEdit = (item: TraineeDetails) => {
        setFormData({
            ...item
        });
        setIsEditing(true);
        setEditId(item.id);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            setTrainees(prev => {
                const filtered = prev.filter(item => item.id !== id);
                return filtered.map((item, index) => ({ ...item, sno: index + 1 }));
            });
        }
    };

    const handleExport = () => {
        const csv = Papa.unparse(trainees);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'trainee_details_1F1.csv');
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
                    // Basic filtering to skip empty rows
                    const validData = importedData.filter(d => Object.keys(d).length > 2);

                    const newEntries = validData.map((item, index) => ({
                        ...initialFormState,
                        ...item,
                        id: Date.now().toString() + index,
                        sno: trainees.length + index + 1
                    }));
                    setTrainees(prev => [...prev, ...newEntries]);
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8">
            <div className="max-w-[95%] mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trainee Details (1F.1)</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage candidate enrolment, training, and placement details</p>
                        </div>
                    </div>
                    {isRestricted ? (
                        <button
                            onClick={() => useAuthStore.getState().logout()}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                        >
                            <LogOut size={16} />
                            <span>Exit & Log Out</span>
                        </button>
                    ) : (
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
                        {isEditing ? 'Edit Trainee Details' : 'Add New Trainee'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Candidate Details */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Candidate Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Candidate ID</label>
                                    <input type="text" name="candidate_id" value={formData.candidate_id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">First Name</label>
                                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Middle Name</label>
                                    <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Last Name</label>
                                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Parent/Guardian</label>
                                    <input type="text" name="parent_guardian_name" value={formData.parent_guardian_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Date of Birth</label>
                                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Social Category</label>
                                    <select name="social_category" value={formData.social_category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="General">General</option>
                                        <option value="SC">SC</option>
                                        <option value="ST">ST</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Residential Pincode</label>
                                    <input type="text" name="residential_pincode" value={formData.residential_pincode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">District</label>
                                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Is Rural?</label>
                                    <select name="is_rural_candidate" value={formData.is_rural_candidate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Rural">Rural</option>
                                        <option value="Urban">Urban</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">State/UT</label>
                                    <input type="text" name="state_ut" value={formData.state_ut} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Mobile</label>
                                    <input type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                                    <input type="email" name="email_id" value={formData.email_id} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Qualification</label>
                                    <input type="text" name="qualification_at_entry" value={formData.qualification_at_entry} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="e.g. 10th Pass" />
                                </div>
                            </div>
                        </div>

                        {/* Training Details */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Training Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Training Centre</label>
                                    {user?.role === 'trainee' && user?.managedEntityId ? (
                                        <input
                                            type="text"
                                            name="training_center_name"
                                            value={formData.training_center_name}
                                            readOnly
                                            className="w-full px-3 py-2 border rounded-lg bg-slate-100 dark:bg-slate-800 dark:border-slate-600 cursor-not-allowed"
                                        />
                                    ) : (
                                        <select
                                            name="training_center_name"
                                            value={formData.training_center_name}
                                            onChange={(e) => handleCenterSelect(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                            required
                                        >
                                            <option value="">Select Training Centre</option>
                                            {allTrainingCenters.map((center) => (
                                                <option key={center.id} value={center.training_center_name}>
                                                    {center.training_center_name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">City</label>
                                    <input
                                        type="text"
                                        name="training_city"
                                        value={formData.training_city}
                                        onChange={handleInputChange}
                                        readOnly={!!formData.training_center_name && allTrainingCenters.some(c => c.training_center_name === formData.training_center_name)}
                                        className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 ${(formData.training_center_name && allTrainingCenters.some(c => c.training_center_name === formData.training_center_name)) ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Center Pincode</label>
                                    <input
                                        type="text"
                                        name="training_center_pincode"
                                        value={formData.training_center_pincode}
                                        onChange={handleInputChange}
                                        readOnly={!!formData.training_center_name && allTrainingCenters.some(c => c.training_center_name === formData.training_center_name)}
                                        className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 ${(formData.training_center_name && allTrainingCenters.some(c => c.training_center_name === formData.training_center_name)) ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">District</label>
                                    <input
                                        type="text"
                                        name="training_district"
                                        value={formData.training_district}
                                        onChange={handleInputChange}
                                        readOnly={!!formData.training_center_name && allTrainingCenters.some(c => c.training_center_name === formData.training_center_name)}
                                        className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 ${(formData.training_center_name && allTrainingCenters.some(c => c.training_center_name === formData.training_center_name)) ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Program Name</label>
                                    <input type="text" name="training_programme_name" value={formData.training_programme_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Enrollment Date</label>
                                    <input type="date" name="enrollment_date" value={formData.enrollment_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Start Date</label>
                                    <input type="date" name="training_start_date" value={formData.training_start_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">End Date</label>
                                    <input type="date" name="training_end_date" value={formData.training_end_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Assessment Date</label>
                                    <input type="date" name="assessment_date" value={formData.assessment_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Certification Date</label>
                                    <input type="date" name="certification_date" value={formData.certification_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">NSFQ Aligned?</label>
                                    <select name="is_nsfq_aligned" value={formData.is_nsfq_aligned} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">QP Name</label>
                                    <input type="text" name="qualification_pack_name" value={formData.qualification_pack_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Sector Skill Council</label>
                                    <input type="text" name="sector_skill_council" value={formData.sector_skill_council} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Certified?</label>
                                    <select name="is_certified" value={formData.is_certified} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Trainer Name</label>
                                    <input type="text" name="trainer_name" value={formData.trainer_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>

                        {/* Post-Training Details */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Post-Training Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Employed?</label>
                                    <select name="is_employed" value={formData.is_employed} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Type of Employment</label>
                                    <select name="employment_type" value={formData.employment_type} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Wage">Wage</option>
                                        <option value="Self">Self</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Emp. Start Date</label>
                                    <input type="date" name="employment_start_date" value={formData.employment_start_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Job Role</label>
                                    <input type="text" name="job_role" value={formData.job_role} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Sector</label>
                                    <input type="text" name="sector" value={formData.sector} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Employer</label>
                                    <input type="text" name="employer_name" value={formData.employer_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="Or 'Self Employed'" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Salary (Fixed)</label>
                                    <input type="number" name="salary_fixed" value={formData.salary_fixed} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Salary (Variable)</label>
                                    <input type="number" name="salary_variable" value={formData.salary_variable} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Work District</label>
                                    <input type="text" name="work_district" value={formData.work_district} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Work Place Type</label>
                                    <select name="work_place_type" value={formData.work_place_type} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                        <option value="Urban">Urban</option>
                                        <option value="Rural">Rural</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Time Series Analysis */}
                        <div className="space-y-4">
                            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 border-b pb-2">Time Series Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Age at Joining</label>
                                    <input type="number" name="age_at_joining" value={formData.age_at_joining} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Course Duration</label>
                                    <input type="text" name="course_duration" value={formData.course_duration} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Assessment Gap</label>
                                    <input type="text" name="assessment_gap" value={formData.assessment_gap} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Certification Gap</label>
                                    <input type="text" name="certification_gap" value={formData.certification_gap} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Emp. Delay</label>
                                    <input type="text" name="delay_in_employment" value={formData.delay_in_employment} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Cycle Time</label>
                                    <input type="text" name="cycle_time" value={formData.cycle_time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                                </div>
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => { setFormData(initialFormState); setIsEditing(false); }} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                <Save size={18} />
                                {isEditing ? 'Update Trainee' : 'Save Trainee'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                {!isRestricted && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Trainee Database</h3>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg max-h-[600px]">
                        <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold text-center sticky top-0 z-20">
                                <tr>
                                    <th className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-600" colSpan={16}>Candidate Details</th>
                                    <th className="p-3 bg-blue-50 dark:bg-slate-900/50 border-b border-slate-300 dark:border-slate-600 border-l border-r" colSpan={16}>Training Details</th>
                                    <th className="p-3 bg-green-50 dark:bg-slate-900/50 border-b border-slate-300 dark:border-slate-600 border-r" colSpan={11}>Post-Training Details</th>
                                    <th className="p-3 bg-purple-50 dark:bg-slate-900/50 border-b border-slate-300 dark:border-slate-600" colSpan={6}>Time Series Analysis</th>
                                    <th className="p-3 bg-slate-50 dark:bg-slate-900 sticky right-0 z-30" rowSpan={2}>Actions</th>
                                </tr>
                                <tr className="bg-slate-50 dark:bg-slate-900">
                                    {/* Candidate */}
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[50px]">ID</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Candidate ID</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">First Name</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Middle Name</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Last Name</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">Parent/Guardian</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">DOB</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Gender</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Category</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Pincode</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">District</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Area</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">State/UT</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[120px]">Mobile</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">Email</th>
                                    <th className="p-2 border-r border-slate-200 dark:border-slate-700 min-w-[100px]">Qualification</th>

                                    {/* Training */}
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">Training Centre</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">City</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Pincode</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">District</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">State</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">Program</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Enrol. Date</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Start Date</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">End Date</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Assess. Date</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Cert. Date</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">NSFQ?</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">QP Name</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">SSC</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Certified?</th>
                                    <th className="p-2 border-r border-slate-200 dark:border-slate-700 min-w-[120px]">Trainer</th>

                                    {/* Post-Training */}
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Employed?</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Type</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Start Date</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[120px]">Job Role</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[120px]">Sector</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[150px]">Employer</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Sal. Fixed</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Sal. Var</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Work Dist</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[100px]">Work State</th>
                                    <th className="p-2 border-r border-slate-200 dark:border-slate-700 min-w-[100px]">Place Type</th>

                                    {/* Time Series */}
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Age Join</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Duration</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Assess Gap</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Cert Gap</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Emp Delay</th>
                                    <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[80px]">Cycle Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {trainees.length === 0 ? (
                                    <tr>
                                        <td colSpan={49} className="p-8 text-center text-slate-500">No trainee details added yet.</td>
                                    </tr>
                                ) : (
                                    trainees.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            {/* Candidate */}
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.sno}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800 font-medium">{item.candidate_id}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.first_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.middle_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.last_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.parent_guardian_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.date_of_birth}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.gender}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.social_category}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.residential_pincode}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.district}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.is_rural_candidate}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.state_ut}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.mobile_number}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800 truncate max-w-[150px]">{item.email_id}</td>
                                            <td className="p-2 border-r border-slate-100 dark:border-slate-800">{item.qualification_at_entry}</td>

                                            {/* Training */}
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_center_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_city}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_center_pincode}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_district}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_state}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_programme_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.enrollment_date}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_start_date}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.training_end_date}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.assessment_date}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.certification_date}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.is_nsfq_aligned}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.qualification_pack_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.sector_skill_council}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.is_certified}</td>
                                            <td className="p-2 border-r border-slate-100 dark:border-slate-800">{item.trainer_name}</td>

                                            {/* Post-Training */}
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.is_employed}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.employment_type}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.employment_start_date}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.job_role}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.sector}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.employer_name}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.salary_fixed}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.salary_variable}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.work_district}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.work_state}</td>
                                            <td className="p-2 border-r border-slate-100 dark:border-slate-800">{item.work_place_type}</td>

                                            {/* Time Series */}
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.age_at_joining}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.course_duration}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.assessment_gap}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.certification_gap}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.delay_in_employment}</td>
                                            <td className="p-2 border border-slate-100 dark:border-slate-800">{item.cycle_time}</td>

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

export default TraineeDetailsSection;
