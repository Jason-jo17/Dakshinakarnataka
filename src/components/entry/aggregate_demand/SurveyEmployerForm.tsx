import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Download, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';

interface EmployerData {
  id: string;
  employer_name: string;
  sector: string;
  recruited_past_12m_num: number;
  recruited_past_12m_avg_salary: number;
  recruited_job_roles: string;
  contact_person_name: string;
  contact_person_designation: string;
  contact_person_phone: string;
  expected_recruit_num: number;
  expected_recruit_salary: number;
  expected_recruit_job_role: string;
  place_of_recruitment: string;
}

export default function SurveyEmployerForm() {
  const { user } = useAuthStore();
  const [data, setData] = useState<EmployerData[]>([]);
  const [formData, setFormData] = useState<Partial<EmployerData>>({});
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employer_name) return;

    const newEmployer = {
      district_id: 'Dakshina Kannada',
      employer_name: formData.employer_name,
      sector: formData.sector || '',
      recruited_past_12m_num: Number(formData.recruited_past_12m_num) || 0,
      recruited_past_12m_avg_salary: Number(formData.recruited_past_12m_avg_salary) || 0,
      recruited_job_roles: formData.recruited_job_roles || '',
      contact_person_name: formData.contact_person_name || '',
      contact_person_designation: formData.contact_person_designation || '',
      contact_person_phone: formData.contact_person_phone || '',
      expected_recruit_num: Number(formData.expected_recruit_num) || 0,
      expected_recruit_salary: Number(formData.expected_recruit_salary) || 0,
      expected_recruit_job_role: formData.expected_recruit_job_role || '',
      place_of_recruitment: formData.place_of_recruitment || ''
    };

    const { data: inserted, error } = await supabase
      .from('ad_survey_employer')
      .insert([newEmployer])
      .select();

    if (error) {
      console.error('Error adding employer:', error);
      alert('Error adding employer');
    } else if (inserted) {
      setData([inserted[0], ...data]);
      setFormData({});
    }
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
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          Add New Employer Survey
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name of Employer
            </label>
            <input
              type="text"
              name="employer_name"
              value={formData.employer_name || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employer name"
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sector
            </label>
            <input
              type="text"
              name="sector"
              value={formData.sector || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. IT, Manufacturing, Healthcare"
            />
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input type="text" name="contact_person_phone" value={formData.contact_person_phone || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Place of Recruitment</label>
            <input type="text" name="place_of_recruitment" value={formData.place_of_recruitment || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Add Record
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
                <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">Sl. No</th>
                <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">Employer Name</th>
                <th colSpan={4} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800">Recruited in past 12 months</th>
                <th colSpan={3} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800">Employer Contact Details</th>
                <th colSpan={4} className="px-4 py-2 text-center border-b border-r dark:border-slate-600 bg-slate-100 dark:bg-slate-800">Expected Recruited in past 12 months</th>
                <th rowSpan={2} className="px-4 py-3 align-middle border-r dark:border-slate-600">Place</th>
                <th rowSpan={2} className="px-4 py-3 align-middle">Actions</th>
              </tr>
              <tr>
                {/* Recruited Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">No. of Candidates</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Av. Salary</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Sector</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Job Roles</th>

                {/* Contact Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">Name</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Designation</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">No.</th>

                {/* Expected Sub-columns */}
                <th className="px-4 py-2 border-r dark:border-slate-600">No. of Candidates</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Av. Salary</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Sector</th>
                <th className="px-4 py-2 border-r dark:border-slate-600">Job Roles</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : data.map((item, index) => (
                <tr key={item.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{index + 1}</td>
                  <td className="px-4 py-3 font-medium border-r dark:border-slate-700 max-w-xs">{item.employer_name}</td>

                  {/* Recruited */}
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{item.recruited_past_12m_num}</td>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{item.recruited_past_12m_avg_salary}</td>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{item.sector}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.recruited_job_roles}>{item.recruited_job_roles}</td>

                  {/* Contact */}
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.contact_person_name}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.contact_person_designation}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 whitespace-nowrap">{item.contact_person_phone}</td>

                  {/* Expected */}
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{item.expected_recruit_num}</td>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{item.expected_recruit_salary}</td>
                  <td className="px-4 py-3 text-center border-r dark:border-slate-700">{item.sector}</td>
                  <td className="px-4 py-3 border-r dark:border-slate-700 max-w-xs truncate" title={item.expected_recruit_job_role}>{item.expected_recruit_job_role}</td>

                  <td className="px-4 py-3 border-r dark:border-slate-700">{item.place_of_recruitment}</td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
