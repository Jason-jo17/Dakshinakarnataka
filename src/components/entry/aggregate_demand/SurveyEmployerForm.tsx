import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Download, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';

interface EmployerData {
  id: string;
  employer_name: string;
  employer_address: string;
  registration_number: string;
  company_type: string;
  sector: string;
  sub_sector: string;
  business_activity: string;
  manufacturing_location: string;
  state: string;
  recruited_past_12m_num: number;
  recruited_past_12m_avg_salary: number;
  recruited_job_roles: string;
  contact_person_name: string;
  contact_person_designation: string;
  contact_person_phone: string;
  contact_person_email: string;
  contact_department: string;
  expected_recruit_num: number;
  expected_recruit_salary: number;
  expected_recruit_job_role: string;
  expected_recruit_qualification: string;
  place_of_recruitment: string;
  has_skill_gaps?: boolean;
  skill_gaps_observed: string;
}

export default function SurveyEmployerForm() {
  const { user } = useAuthStore();
  const [data, setData] = useState<EmployerData[]>([]);
  const [formData, setFormData] = useState<Partial<EmployerData>>({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase
      .from('ad_survey_employer')
      .select('*')
      .eq('district_id', 'Dakshina Kannada') // Hardcoded for this context
      .order('created_at', { ascending: false });

    if (user?.role === 'company' && user.managedEntityId) {
      query = query.eq('id', user.managedEntityId);
    }

    const { data: employers, error } = await query;

    if (error) {
      console.error('Error fetching employers:', error);
    } else {
      setData(employers || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employer_name) return;

    const employerRecord = {
      district_id: 'Dakshina Kannada',
      employer_name: formData.employer_name,
      employer_address: formData.employer_address || '',
      registration_number: formData.registration_number || '',
      company_type: formData.company_type || '',
      sector: formData.sector || '',
      sub_sector: formData.sub_sector || '',
      business_activity: formData.business_activity || '',
      manufacturing_location: formData.manufacturing_location || '',
      state: formData.state || 'Karnataka',
      recruited_past_12m_num: Number(formData.recruited_past_12m_num) || 0,
      recruited_past_12m_avg_salary: Number(formData.recruited_past_12m_avg_salary) || 0,
      recruited_job_roles: formData.recruited_job_roles || '',
      skill_gaps_observed: formData.has_skill_gaps ? (formData.skill_gaps_observed || '') : '',
      contact_person_name: formData.contact_person_name || '',
      contact_person_designation: formData.contact_person_designation || '',
      contact_person_phone: formData.contact_person_phone || '',
      contact_person_email: formData.contact_person_email || '',
      contact_department: formData.contact_department || '',
      expected_recruit_num: Number(formData.expected_recruit_num) || 0,
      expected_recruit_salary: Number(formData.expected_recruit_salary) || 0,
      expected_recruit_job_role: formData.expected_recruit_job_role || '',
      expected_recruit_qualification: formData.expected_recruit_qualification || '',
      place_of_recruitment: formData.place_of_recruitment || ''
    };

    if (editingId) {
      const { data: updated, error } = await supabase
        .from('ad_survey_employer')
        .update(employerRecord)
        .eq('id', editingId)
        .select();

      if (error) {
        console.error('Error updating employer:', error);
        alert('Error updating employer');
      } else if (updated) {
        setData(data.map(item => item.id === editingId ? updated[0] : item));
        setFormData({});
        setEditingId(null);
      }
    } else {
      const { data: inserted, error } = await supabase
        .from('ad_survey_employer')
        .insert([employerRecord])
        .select();

      if (error) {
        console.error('Error adding employer:', error);
        alert('Error adding employer');
      } else if (inserted) {
        setData([inserted[0], ...data]);
        setFormData({});
      }
    }
  };

  const handleEdit = (item: EmployerData) => {
    setFormData(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('ad_survey_employer')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employer:', error);
      alert('Error deleting employer');
    } else {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Plus className={`w-5 h-5 ${editingId ? 'text-amber-500' : 'text-blue-600'}`} />
            {editingId ? 'Edit Employer Survey' : 'Add New Employer Survey'}
          </span>
          {editingId && (
            <button
              onClick={() => { setFormData({}); setEditingId(null); }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Cancel Edit
            </button>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name of Enterprise
            </label>
            <input
              type="text"
              name="employer_name"
              value={formData.employer_name || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name of the enterprise"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Address
            </label>
            <input
              type="text"
              name="employer_address"
              value={formData.employer_address || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter enterprise address"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration No</label>
            <input type="text" name="registration_number" value={formData.registration_number || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Type</label>
            <select name="company_type" value={formData.company_type || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
              <option value="">Select Type</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Public Limited">Public Limited</option>
              <option value="MNC">MNC</option>
              <option value="Proprietorship">Proprietorship</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sector</label>
            <input type="text" name="sector" value={formData.sector || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. IT" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sub Sector</label>
            <input type="text" name="sub_sector" value={formData.sub_sector || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manufacturing Location</label>
            <input type="text" name="manufacturing_location" value={formData.manufacturing_location || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Activity</label>
            <input type="text" name="business_activity" value={formData.business_activity || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="form-has-skill-gaps"
                name="has_skill_gaps"
                checked={formData.has_skill_gaps || false}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-slate-300"
              />
              <label htmlFor="form-has-skill-gaps" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Have you identified skill gaps?
              </label>
            </div>
            {formData.has_skill_gaps && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skill Gaps Observed</label>
                <textarea
                  name="skill_gaps_observed"
                  value={formData.skill_gaps_observed || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md h-20"
                  placeholder="Describe the gaps observed (e.g. Communication, Technical Skills)"
                />
              </div>
            )}
          </div>

          {/* Recruited Past 12 Months */}
          <div className="lg:col-span-4 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recruited in Past 12 Months
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number</label>
            <input type="number" name="recruited_past_12m_num" value={formData.recruited_past_12m_num || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Avg Salary</label>
            <input type="number" name="recruited_past_12m_avg_salary" value={formData.recruited_past_12m_avg_salary || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Roles</label>
            <input type="text" name="recruited_job_roles" value={formData.recruited_job_roles || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>

          {/* Contact Person */}
          <div className="lg:col-span-4 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Contact Person
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
            <input type="text" name="contact_person_name" value={formData.contact_person_name || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
            <input type="text" name="contact_person_designation" value={formData.contact_person_designation || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input type="text" name="contact_person_phone" value={formData.contact_person_phone || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email ID</label>
            <input type="email" name="contact_person_email" value={formData.contact_person_email || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <input type="text" name="contact_department" value={formData.contact_department || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>

          {/* Expected Recruitment */}
          <div className="lg:col-span-4 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Expected Recruitment This Year
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number</label>
            <input type="number" name="expected_recruit_num" value={formData.expected_recruit_num || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary</label>
            <input type="number" name="expected_recruit_salary" value={formData.expected_recruit_salary || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Role</label>
            <input type="text" name="expected_recruit_job_role" value={formData.expected_recruit_job_role || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Place of Deployment</label>
            <input type="text" name="place_of_recruitment" value={formData.place_of_recruitment || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
            <input type="text" name="expected_recruit_qualification" value={formData.expected_recruit_qualification || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors font-medium shadow-sm`}
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 dark:text-white">Employer Survey Data</h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <Upload className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">S.no</th>
                <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">Name of the Enterprise</th>
                <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">Address</th>
                <th colSpan={5} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800 font-bold">Company Details</th>
                <th colSpan={4} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800 font-bold">Recruited (Past 12m)</th>
                <th colSpan={4} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800 font-bold">Contact Person</th>
                <th colSpan={5} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800 font-bold">Expected (This Year)</th>
                <th rowSpan={2} className="px-4 py-3 align-middle">Actions</th>
              </tr>
              <tr>
                {/* Company Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">Reg No</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Type</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Sector</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Sub Sector</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Business Activity</th>

                {/* Recruited Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">Count</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Avg Salary</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Job Roles</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Skill Gaps</th>

                {/* Contact Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">Name</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Role</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Email</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Phone</th>

                {/* Expected Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">Count</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Job Role</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Salary</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Qualifi.</th>
                <th className="px-4 py-2 border-r dark:border-slate-600 text-center">Place</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : data.map((item, index) => (
                <tr key={item.id} className={`border-b dark:border-slate-700 transition-colors ${editingId === item.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r dark:border-slate-700 max-w-xs">{item.employer_name}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.employer_address}>{item.employer_address}</td>

                  {/* Company Details */}
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.registration_number}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.company_type}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.sector}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.sub_sector}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.business_activity}>{item.business_activity}</td>

                  {/* Recruited */}
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700 font-bold text-blue-600">{item.recruited_past_12m_num}</td>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">₹{item.recruited_past_12m_avg_salary.toLocaleString()}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.recruited_job_roles}>{item.recruited_job_roles}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.skill_gaps_observed}>{item.skill_gaps_observed}</td>

                  {/* Contact */}
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.contact_person_name}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.contact_person_designation}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.contact_person_email}>{item.contact_person_email}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.contact_person_phone}</td>

                  {/* Expected */}
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700 font-bold text-green-600">{item.expected_recruit_num}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.expected_recruit_job_role}>{item.expected_recruit_job_role}</td>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">₹{item.expected_recruit_salary.toLocaleString()}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.expected_recruit_qualification}>{item.expected_recruit_qualification}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 text-center">{item.place_of_recruitment}</td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No data added yet. Use the form above to add employer surveys.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
