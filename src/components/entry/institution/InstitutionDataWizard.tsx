
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { supabase } from '../../../lib/supabaseClient';
import {
    Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle, School,
    GraduationCap, Users, BookOpen, Upload, Key, Loader2, Save
} from 'lucide-react';
import * as Papa from 'papaparse';
import { SECTORS, getTradesForSector } from '../../../data/sectors';

// --- Interfaces ---

interface Scheme {
    id: string;
    sno: number;
    scheme_name: string;
    scheme_url: string;
    affiliated_centers: string;
    sector: string;
    trade: string;
    annual_intake: number;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
}

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

interface TraineeDetails {
    id: string;
    sno: number;
    // Candidate Details
    candidate_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    parent_guardian_name: string;
    date_of_birth: string;
    gender: 'Male' | 'Female' | 'Other';
    social_category: 'General' | 'SC' | 'ST' | 'Others';
    residential_pincode: string;
    district: string;
    is_rural_candidate: 'Rural' | 'Urban';
    state_ut: string;
    mobile_number: string;
    email_id: string;
    qualification_at_entry: string;
    // Training Details
    training_center_name: string;
    training_city: string;
    training_center_pincode: string;
    training_district: string;
    training_state: string;
    training_programme_name: string;
    enrollment_date: string;
    training_start_date: string;
    training_end_date: string;
    assessment_date: string;
    certification_date: string;
    is_nsfq_aligned: 'Yes' | 'No';
    qualification_pack_name: string;
    sector_skill_council: string;
    is_certified: 'Yes' | 'No';
    trainer_name: string;
    // Post-Training Details
    is_employed: 'Yes' | 'No';
    employment_type: 'Wage' | 'Self';
    employment_start_date: string;
    job_role: string;
    sector: string;
    employer_name: string;
    salary_fixed: string;
    salary_variable: string;
    work_district: string;
    work_state: string;
    work_place_type: 'Rural' | 'Urban';
    // Time Series Analysis
    age_at_joining: string;
    course_duration: string;
    assessment_gap: string;
    certification_gap: string;
    delay_in_employment: string;
    cycle_time: string;
}

interface PartialTrainee {
    id: string;
    first_name: string;
    mobile_number: string;
    credentialGenerated: boolean;
    username?: string;
    password?: string;
}

export default function InstitutionDataWizard({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [availableSchemes, setAvailableSchemes] = useState<Scheme[]>([]);
    const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);

    const [tcData, setTcData] = useState<TrainingCenter>({
        id: '',
        sno: 1,
        training_center_name: user?.name || '',
        center_address1: '',
        center_address2: '',
        block: '',
        district: 'Dakshina Kannada',
        pincode: '',
        year_started: '',
        class_room_count: '',
        seating_capacity: '',
        capacity_of_lab: '',
        is_residential: 'N',
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
    });

    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [trainees, setTrainees] = useState<TraineeDetails[]>([]);

    // Partial Trainee State
    const [partialTrainee, setPartialTrainee] = useState<PartialTrainee>({ id: '', first_name: '', mobile_number: '', credentialGenerated: false });
    const [isGeneratingCreds, setIsGeneratingCreds] = useState(false);

    // Form Visibility States
    const [showTrainerForm, setShowTrainerForm] = useState(false);
    const [showTraineeForm, setShowTraineeForm] = useState(false);

    // Temporary Form States
    const [newTrainer, setNewTrainer] = useState<Partial<Trainer>>({
        title: 'Mr',
        sector: '',
        trade: ''
    });
    const [newTrainee, setNewTrainee] = useState<Partial<TraineeDetails>>({
        gender: 'Male',
        social_category: 'General',
        is_rural_candidate: 'Rural',
        state_ut: 'Karnataka',
        is_nsfq_aligned: 'Yes',
        is_certified: 'No',
        is_employed: 'No'
    });


    useEffect(() => {
        const fetchSchemes = async () => {
            const { data } = await supabase.from('district_schemes').select('*');
            if (data) setAvailableSchemes(data);
        };
        fetchSchemes();
    }, []);

    // --- Actions ---

    const toggleScheme = (id: string) => {
        setSelectedSchemes(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const updateTc = (field: keyof TrainingCenter, value: any) => {
        setTcData(prev => ({ ...prev, [field]: value }));
    };

    // Trainer Actions
    const handleAddTrainer = () => {
        if (!newTrainer.first_name || !newTrainer.sector || !newTrainer.trade) {
            alert('Please fill required fields: First Name, Sector, Trade');
            return;
        }

        const trainer: Trainer = {
            id: crypto.randomUUID(),
            sno: trainers.length + 1,
            ...newTrainer
        } as Trainer;
        setTrainers([...trainers, trainer]);
        setShowTrainerForm(false);
        setNewTrainer({ title: 'Mr', sector: '', trade: '' });
    };

    const handleTrainerCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results: Papa.ParseResult<any>) => {
                    const imported = results.data
                        .filter((item: any) => item.first_name || item['First Name']) // Basic validation
                        .map((item, idx) => ({
                            id: crypto.randomUUID(),
                            sno: trainers.length + idx + 1,
                            ...item
                        } as Trainer));
                    setTrainers([...trainers, ...imported]);
                }
            });
        }
    };
    const removeTrainer = (id: string) => setTrainers(trainers.filter(t => t.id !== id));

    // Trainee Actions
    const handleAddTrainee = () => {
        if (!newTrainee.first_name || !newTrainee.candidate_id) {
            alert('Please fill required fields: Candidate ID, First Name');
            return;
        }
        const trainee: TraineeDetails = {
            id: crypto.randomUUID(),
            sno: trainees.length + 1,
            ...newTrainee
        } as TraineeDetails;
        setTrainees([...trainees, trainee]);
        setShowTraineeForm(false);
        setNewTrainee({
            gender: 'Male',
            social_category: 'General',
            is_rural_candidate: 'Rural',
            state_ut: 'Karnataka',
            is_nsfq_aligned: 'Yes',
            is_certified: 'No',
            is_employed: 'No'
        });
    };

    const handleTraineeCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results: Papa.ParseResult<any>) => {
                    const imported = results.data
                        .filter((item: any) => item.first_name || item['First Name'])
                        .map((item, idx) => ({
                            id: crypto.randomUUID(),
                            sno: trainees.length + idx + 1,
                            ...item
                        } as TraineeDetails));
                    setTrainees([...trainees, ...imported]);
                }
            });
        }
    };

    const handleGenerateCredential = async () => {
        if (!partialTrainee.first_name || !partialTrainee.mobile_number) {
            alert("Please enter Name and Mobile Number");
            return;
        }
        setIsGeneratingCreds(true);
        setTimeout(() => {
            const username = partialTrainee.first_name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000);
            const password = Math.random().toString(36).slice(-8);

            setPartialTrainee(prev => ({ ...prev, credentialGenerated: true, username, password }));
            setIsGeneratingCreds(false);
        }, 1500);
    };

    const handleSubmitAll = async () => {
        console.log('Submitting Data:', { selectedSchemes, tcData, trainersCount: trainers.length, traineesCount: trainees.length });
        setTimeout(() => { alert('Data Submitted Successfully!'); onSuccess(); }, 1000);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Institution Data Collection</h1>
                        <p className="text-xs text-slate-500">Step {currentStep} of {totalSteps}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col">
                {/* Progress Bar */}
                <div className="mb-8 flex items-center justify-between relative px-10">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10" />
                    <div className="absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
                    {[
                        { id: 1, label: 'Schemes', icon: BookOpen },
                        { id: 2, label: 'Training Centre', icon: School },
                        { id: 3, label: 'Trainers', icon: Users },
                        { id: 4, label: 'Trainees', icon: GraduationCap },
                        { id: 5, label: 'Credentials', icon: Key }
                    ].map((step) => (
                        <div key={step.id} className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 px-2 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= step.id
                                ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'}`}>
                                <step.icon size={18} />
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{step.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="flex-1 p-6 overflow-y-auto">

                        {/* Step 1: Schemes */}
                        {currentStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center gap-2">Schemes Operating</h2>
                                        <p className="text-slate-500 text-sm">Select the schemes your institution is currently running.</p>
                                    </div>
                                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {selectedSchemes.length} Selected
                                    </div>
                                </div>
                                <div className="border rounded-lg overflow-hidden dark:border-slate-700">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                            <tr>
                                                <th className="px-6 py-3 w-16">Select</th>
                                                <th className="px-6 py-3">Scheme Name</th>
                                                <th className="px-6 py-3">Sector</th>
                                                <th className="px-6 py-3">Trade</th>
                                                <th className="px-6 py-3 text-right">Intake</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {availableSchemes.map(scheme => (
                                                <tr key={scheme.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedSchemes.includes(scheme.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div
                                                            onClick={() => toggleScheme(scheme.id)}
                                                            className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-colors ${selectedSchemes.includes(scheme.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}
                                                        >
                                                            {selectedSchemes.includes(scheme.id) && <CheckCircle size={14} />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{scheme.scheme_name}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{scheme.sector}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{scheme.trade}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-right">{scheme.annual_intake}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Training Centre Info */}
                        {currentStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">Training Centre Information</h2>
                                <p className="text-slate-500 text-sm mb-6">Template 1E: Update infrastructure and capacity details.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="md:col-span-3 pb-2 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700">About Center</div>
                                    <div><label className="label-std">Center Name</label><input type="text" value={tcData.training_center_name} onChange={e => updateTc('training_center_name', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Year Started</label><input type="number" value={tcData.year_started} onChange={e => updateTc('year_started', e.target.value)} className="input-std" /></div>
                                    <div className="md:col-span-2"><label className="label-std">Address 1</label><input type="text" value={tcData.center_address1} onChange={e => updateTc('center_address1', e.target.value)} className="input-std" /></div>
                                    <div className="md:col-span-2"><label className="label-std">Address 2</label><input type="text" value={tcData.center_address2} onChange={e => updateTc('center_address2', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Block</label><input type="text" value={tcData.block} onChange={e => updateTc('block', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">District</label><input type="text" value={tcData.district} disabled className="input-std bg-slate-100" /></div>
                                    <div><label className="label-std">Pincode</label><input type="text" value={tcData.pincode} onChange={e => updateTc('pincode', e.target.value)} className="input-std" /></div>

                                    <div className="md:col-span-3 pt-4 pb-2 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700">Capacity</div>
                                    <div><label className="label-std">Classrooms</label><input type="number" value={tcData.class_room_count} onChange={e => updateTc('class_room_count', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Labs</label><input type="number" value={tcData.capacity_of_lab} onChange={e => updateTc('capacity_of_lab', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Seating Capacity</label><input type="number" value={tcData.seating_capacity} onChange={e => updateTc('seating_capacity', e.target.value)} className="input-std" /></div>

                                    <div className="md:col-span-3 pt-4 pb-2 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700">Residential Facilities</div>
                                    <div><label className="label-std">Is Residential?</label><select value={tcData.is_residential} onChange={e => updateTc('is_residential', e.target.value)} className="input-std"><option value="N">No</option><option value="Y">Yes</option></select></div>
                                    {tcData.is_residential === 'Y' && (<><div><label className="label-std">Hostel (Men)</label><input type="number" value={tcData.hostel_capacity_men} onChange={e => updateTc('hostel_capacity_men', e.target.value)} className="input-std" /></div><div><label className="label-std">Hostel (Women)</label><input type="number" value={tcData.hostel_capacity_women} onChange={e => updateTc('hostel_capacity_women', e.target.value)} className="input-std" /></div><div><label className="label-std">Distance to Center</label><input type="text" value={tcData.distance_hostel_center} onChange={e => updateTc('distance_hostel_center', e.target.value)} className="input-std" /></div></>)}

                                    <div className="md:col-span-3 pt-4 pb-2 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700">Contact Person</div>
                                    <div><label className="label-std">Name</label><input type="text" value={tcData.contact_person_name} onChange={e => updateTc('contact_person_name', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Role</label><input type="text" value={tcData.contact_role} onChange={e => updateTc('contact_role', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Phone</label><input type="text" value={tcData.contact_phone} onChange={e => updateTc('contact_phone', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Email</label><input type="email" value={tcData.contact_email} onChange={e => updateTc('contact_email', e.target.value)} className="input-std" /></div>

                                    <div className="md:col-span-3 pt-4 pb-2 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700">Offerings & Performance</div>
                                    <div><label className="label-std">Schemes Empanelled</label><input type="text" value={tcData.schemes_empanelled} onChange={e => updateTc('schemes_empanelled', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Funding Source</label><input type="text" value={tcData.funding_source} onChange={e => updateTc('funding_source', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Scheme URL</label><input type="text" value={tcData.scheme_url} onChange={e => updateTc('scheme_url', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Trades Offered</label><input type="text" value={tcData.trades_offered} onChange={e => updateTc('trades_offered', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Sectors</label><input type="text" value={tcData.sectors} onChange={e => updateTc('sectors', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Trained Last Year</label><input type="number" value={tcData.trained_last_year} onChange={e => updateTc('trained_last_year', e.target.value)} className="input-std" /></div>
                                    <div><label className="label-std">Placed Last Year</label><input type="number" value={tcData.placed_last_year} onChange={e => updateTc('placed_last_year', e.target.value)} className="input-std" /></div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Trainers */}
                        {currentStep === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <div><h2 className="text-2xl font-bold flex items-center gap-2">Trainer Data</h2><p className="text-slate-500 text-sm">Manage Active Trainers</p></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowTrainerForm(true)} className="btn-secondary flex items-center gap-2 text-sm"><Plus size={16} /> Add Trainer</button>
                                        <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer"><Upload size={16} /> Import CSV<input type="file" accept=".csv" className="hidden" onChange={handleTrainerCSV} /></label>
                                    </div>
                                </div>

                                {showTrainerForm && (
                                    <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold mb-4">Add New Trainer</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div><label className="label-sm">Centre Name</label><input className="input-std" value={newTrainer.centre_name || ''} onChange={e => setNewTrainer({ ...newTrainer, centre_name: e.target.value })} /></div>
                                            <div><label className="label-sm">Title</label>
                                                <select className="input-std" value={newTrainer.title} onChange={e => setNewTrainer({ ...newTrainer, title: e.target.value })}>
                                                    <option value="Mr">Mr</option><option value="Ms">Ms</option><option value="Dr">Dr</option>
                                                </select></div>
                                            <div><label className="label-sm">First Name *</label><input className="input-std" value={newTrainer.first_name || ''} onChange={e => setNewTrainer({ ...newTrainer, first_name: e.target.value })} /></div>
                                            <div><label className="label-sm">Last Name</label><input className="input-std" value={newTrainer.last_name || ''} onChange={e => setNewTrainer({ ...newTrainer, last_name: e.target.value })} /></div>
                                            <div><label className="label-sm">DOB</label><input type="date" className="input-std" value={newTrainer.dob || ''} onChange={e => setNewTrainer({ ...newTrainer, dob: e.target.value })} /></div>
                                            <div><label className="label-sm">Qualification</label><input className="input-std" value={newTrainer.qualification || ''} onChange={e => setNewTrainer({ ...newTrainer, qualification: e.target.value })} /></div>

                                            <div><label className="label-sm">Mobile</label><input className="input-std" value={newTrainer.phone || ''} onChange={e => setNewTrainer({ ...newTrainer, phone: e.target.value })} /></div>
                                            <div><label className="label-sm">Email</label><input className="input-std" value={newTrainer.email || ''} onChange={e => setNewTrainer({ ...newTrainer, email: e.target.value })} /></div>
                                            <div><label className="label-sm">Industry Exp</label><input className="input-std" value={newTrainer.industry_exp || ''} onChange={e => setNewTrainer({ ...newTrainer, industry_exp: e.target.value })} /></div>
                                            <div><label className="label-sm">Training Exp</label><input className="input-std" value={newTrainer.training_exp || ''} onChange={e => setNewTrainer({ ...newTrainer, training_exp: e.target.value })} /></div>

                                            <div><label className="label-sm">Sector *</label>
                                                <select className="input-std" value={newTrainer.sector} onChange={e => setNewTrainer({ ...newTrainer, sector: e.target.value })}>
                                                    <option value="">Select Sector</option>
                                                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select></div>
                                            <div><label className="label-sm">Trade *</label>
                                                <select className="input-std" value={newTrainer.trade} onChange={e => setNewTrainer({ ...newTrainer, trade: e.target.value })} disabled={!newTrainer.sector}>
                                                    <option value="">Select Trade</option>
                                                    {newTrainer.sector && getTradesForSector(newTrainer.sector).map(t => <option key={t} value={t}>{t}</option>)}
                                                </select></div>

                                            <div><label className="label-sm">Certified By</label><input className="input-std" value={newTrainer.certified_by || ''} onChange={e => setNewTrainer({ ...newTrainer, certified_by: e.target.value })} /></div>
                                            <div><label className="label-sm">Valid Till</label><input type="date" className="input-std" value={newTrainer.valid_till || ''} onChange={e => setNewTrainer({ ...newTrainer, valid_till: e.target.value })} /></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handleAddTrainer} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"><Save size={16} /> Save Trainer</button>
                                            <button onClick={() => setShowTrainerForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                                        </div>
                                    </div>
                                )}

                                <div className="border rounded-lg overflow-x-auto dark:border-slate-700">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                            <tr>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Sector</th>
                                                <th className="px-4 py-3">Trade</th>
                                                <th className="px-4 py-3">Phone</th>
                                                <th className="px-4 py-3">Qualification</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {trainers.map(t => (
                                                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                    <td className="px-4 py-3 font-medium">{t.title} {t.first_name} {t.last_name}</td>
                                                    <td className="px-4 py-3">{t.sector}</td>
                                                    <td className="px-4 py-3">{t.trade}</td>
                                                    <td className="px-4 py-3">{t.phone}</td>
                                                    <td className="px-4 py-3">{t.qualification}</td>
                                                    <td className="px-4 py-3 text-right"><button onClick={() => removeTrainer(t.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button></td>
                                                </tr>
                                            ))}
                                            {trainers.length === 0 && (
                                                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No trainers added.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Trainees */}
                        {currentStep === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <div><h2 className="text-2xl font-bold flex items-center gap-2">Trainee Details</h2><p className="text-slate-500 text-sm">Manage Trainee Enrollment</p></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowTraineeForm(true)} className="btn-secondary flex items-center gap-2 text-sm"><Plus size={16} /> Add Trainee</button>
                                        <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer"><Upload size={16} /> Import CSV<input type="file" accept=".csv" className="hidden" onChange={handleTraineeCSV} /></label>
                                    </div>
                                </div>

                                {showTraineeForm && (
                                    <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 max-h-[600px] overflow-y-auto">
                                        <h3 className="font-bold mb-4">Add New Trainee</h3>

                                        <h4 className="text-xs font-bold text-slate-500 uppercase border-b pb-2 mb-3">Candidate Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div><label className="label-sm">Candidate ID *</label><input className="input-std" value={newTrainee.candidate_id || ''} onChange={e => setNewTrainee({ ...newTrainee, candidate_id: e.target.value })} /></div>
                                            <div><label className="label-sm">First Name *</label><input className="input-std" value={newTrainee.first_name || ''} onChange={e => setNewTrainee({ ...newTrainee, first_name: e.target.value })} /></div>
                                            <div><label className="label-sm">Last Name</label><input className="input-std" value={newTrainee.last_name || ''} onChange={e => setNewTrainee({ ...newTrainee, last_name: e.target.value })} /></div>
                                            <div><label className="label-sm">Mobile</label><input className="input-std" value={newTrainee.mobile_number || ''} onChange={e => setNewTrainee({ ...newTrainee, mobile_number: e.target.value })} /></div>
                                            <div><label className="label-sm">Date of Birth</label><input type="date" className="input-std" value={newTrainee.date_of_birth || ''} onChange={e => setNewTrainee({ ...newTrainee, date_of_birth: e.target.value })} /></div>
                                            <div><label className="label-sm">Gender</label><select className="input-std" value={newTrainee.gender} onChange={e => setNewTrainee({ ...newTrainee, gender: e.target.value as any })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                                        </div>

                                        <h4 className="text-xs font-bold text-slate-500 uppercase border-b pb-2 mb-3">Training Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div><label className="label-sm">Training Centre</label><input className="input-std" value={newTrainee.training_center_name || ''} onChange={e => setNewTrainee({ ...newTrainee, training_center_name: e.target.value })} /></div>
                                            <div><label className="label-sm">Program</label><input className="input-std" value={newTrainee.training_programme_name || ''} onChange={e => setNewTrainee({ ...newTrainee, training_programme_name: e.target.value })} /></div>
                                            <div><label className="label-sm">Start Date</label><input type="date" className="input-std" value={newTrainee.training_start_date || ''} onChange={e => setNewTrainee({ ...newTrainee, training_start_date: e.target.value })} /></div>
                                            <div><label className="label-sm">End Date</label><input type="date" className="input-std" value={newTrainee.training_end_date || ''} onChange={e => setNewTrainee({ ...newTrainee, training_end_date: e.target.value })} /></div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={handleAddTrainee} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"><Save size={16} /> Save Trainee</button>
                                            <button onClick={() => setShowTraineeForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                                        </div>
                                    </div>
                                )}

                                <div className="border rounded-lg overflow-x-auto dark:border-slate-700">
                                    <table className="w-full text-sm text-center">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Mobile</th>
                                                <th className="px-4 py-3">Gender</th>
                                                <th className="px-4 py-3">District</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {trainees.map(t => (
                                                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                    <td className="px-4 py-3">{t.candidate_id}</td>
                                                    <td className="px-4 py-3 font-medium">{t.first_name} {t.last_name}</td>
                                                    <td className="px-4 py-3">{t.mobile_number}</td>
                                                    <td className="px-4 py-3">{t.gender}</td>
                                                    <td className="px-4 py-3">{t.district}</td>
                                                    <td className="px-4 py-3 text-right"><button onClick={() => setTrainees(trainees.filter(x => x.id !== t.id))} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button></td>
                                                </tr>
                                            ))}
                                            {trainees.length === 0 && (
                                                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No trainees added.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Credentials Management */}
                        {currentStep === 5 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-2"><Key className="text-amber-500" /> Credential Management</h2>
                                    <p className="text-slate-500 text-sm">Manage portal access for your staff and students.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><GraduationCap size={20} className="text-violet-500" /> Student Self-Reporting</h3>
                                        <p className="text-slate-500 text-sm mb-6">Generate unique login credentials for students to fill their own detailed information directly.</p>

                                        {!partialTrainee.credentialGenerated ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="label-sm">Candidate Name</label>
                                                        <input type="text" className="input-std" placeholder="Full Name" value={partialTrainee.first_name} onChange={e => setPartialTrainee({ ...partialTrainee, first_name: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="label-sm">Mobile Number</label>
                                                        <input type="tel" className="input-std" placeholder="10-digit mobile" value={partialTrainee.mobile_number} onChange={e => setPartialTrainee({ ...partialTrainee, mobile_number: e.target.value })} />
                                                    </div>
                                                </div>
                                                <button onClick={handleGenerateCredential} disabled={isGeneratingCreds} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50">
                                                    {isGeneratingCreds ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                    Generate & Issue Credentials
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700/50 animate-in zoom-in-95 duration-300">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">CREDENTIAL GENERATED</span>
                                                    <button onClick={() => setPartialTrainee({ id: '', first_name: '', mobile_number: '', credentialGenerated: false })} className="text-xs text-blue-500 hover:underline">Create Another</button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-800">
                                                        <p className="text-xs text-slate-500 mb-1">Username</p>
                                                        <p className="font-mono font-bold text-slate-900 dark:text-white select-all">{partialTrainee.username}</p>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-800">
                                                        <p className="text-xs text-slate-500 mb-1">Temporary Password</p>
                                                        <p className="font-mono font-bold text-slate-900 dark:text-white select-all">{partialTrainee.password}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-blue-600/70 mt-4 italic">Share these credentials with the student for direct portal access.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                            <Users className="text-slate-400" size={32} />
                                        </div>
                                        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Internal Staff Access</h3>
                                        <p className="text-slate-500 text-sm max-w-sm">Use the Master Credential sheet in the District Admin Portal to manage logins for multiple trainers and staff members.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 px-8 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <button onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors font-medium">Cancel Wizard</button>
                        <div className="flex gap-4">
                            <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors font-medium"><ArrowLeft size={18} /> Back</button>
                            {currentStep < totalSteps ? (
                                <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium">Next Step <ArrowRight size={18} /></button>
                            ) : (
                                <button onClick={handleSubmitAll} className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 font-bold"><CheckCircle size={18} /> Submit All Data</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        .label-sm { display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem; }
        .input-sm { width: 100%; padding: 0.35rem 0.5rem; font-size: 0.875rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; background: white; color: #1e293b; outline: none; transition: all 0.2s; }
        .input-sm:focus { border-color: #3b82f6; ring: 2px solid #3b82f6; }
        
        .label-std { display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 0.5rem; }
        .input-std { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; background: white; color: #1e293b; outline: none; transition: all 0.2s; }
        .input-std:focus { border-color: #3b82f6; ring: 2px solid #3b82f6; }

        .btn-secondary { padding: 0.5rem 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; color: #475569; font-weight: 500; transition: all 0.2s; }
        .btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }
      `}</style>
        </div>
    );
}
