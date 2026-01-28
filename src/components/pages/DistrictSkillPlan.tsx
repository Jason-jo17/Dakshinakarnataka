
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, Download, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../store/useAuthStore';

interface CommitteeMember {
  sno: number;
  name: string;
  designation: string;
  telephone: string;
  email: string;
}

interface DistrictSkillPlanProps {
  onBack: () => void;
  planId?: string | null;
}

export default function DistrictSkillPlan({ onBack, planId }: DistrictSkillPlanProps) {
  const { currentDistrict } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Plan Details
  const [planTitle, setPlanTitle] = useState('');

  // Chairperson Details
  const [chairperson, setChairperson] = useState({
    name: '',
    designation: '',
    tel: '',
    email: ''
  });

  // Committee Members
  const [members, setMembers] = useState<CommitteeMember[]>([
    { sno: 1, name: '', designation: '', telephone: '', email: '' }
  ]);

  useEffect(() => {
    if (currentDistrict) {
      if (planId) {
        fetchPlan(planId);
      } else {
        // New Plan Defaults
        setPlanTitle(`District Skill Plan - ${new Date().getFullYear()}`);
        setMembers([{ sno: 1, name: '', designation: '', telephone: '', email: '' }]);
        setChairperson({ name: '', designation: '', tel: '', email: '' });
      }
    }
  }, [currentDistrict, planId]);

  const fetchPlan = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('district_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching plan:', error);
      } else if (data) {
        setPlanTitle(data.title);
        setChairperson({
          name: data.chairperson_name || '',
          designation: data.chairperson_designation || '',
          tel: data.chairperson_tel || '',
          email: data.chairperson_email || ''
        });
        if (data.committee_members && Array.isArray(data.committee_members)) {
          setMembers(data.committee_members);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentDistrict) return;
    if (!planTitle.trim()) {
      setStatus('Error: Plan Title is required');
      return;
    }

    setIsLoading(true);
    setStatus('Saving...');

    try {
      const payload = {
        district_name: currentDistrict,
        title: planTitle,
        chairperson_name: chairperson.name,
        chairperson_designation: chairperson.designation,
        chairperson_tel: chairperson.tel,
        chairperson_email: chairperson.email,
        committee_members: members,
        updated_at: new Date().toISOString()
      };

      let result;
      if (planId) {
        // Update existing
        result = await supabase
          .from('district_plans')
          .update(payload)
          .eq('id', planId);
      } else {
        // Create new
        result = await supabase
          .from('district_plans')
          .insert([payload])
          .select(); // To get the new ID if needed, though we might just go back
      }

      if (result.error) throw result.error;

      setStatus('Saved Successfully!');
      setTimeout(() => {
        setStatus(null);
        onBack(); // Go back to list after save
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CSV Functions
  const handleDownloadCSV = () => {
    const headers = ['S.No', 'Name', 'Designation', 'Telephone', 'Email'];
    const csvContent = [
      headers.join(','),
      ...members.map(m => [m.sno, `"${m.name}"`, `"${m.designation}"`, `"${m.telephone}"`, `"${m.email}"`].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentDistrict}_Committee_Members.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newMembers: CommitteeMember[] = [];

      // Skip header, start from index 1. 
      // Basic parsing, assuming standard CSV format without complex quoting
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle basic csv parsing (removing quotes if present)
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));

        if (cols.length >= 5) {
          newMembers.push({
            sno: parseInt(cols[0]) || i,
            name: cols[1] || '',
            designation: cols[2] || '',
            telephone: cols[3] || '',
            email: cols[4] || ''
          });
        }
      }

      if (newMembers.length > 0) {
        setMembers(newMembers);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addMemberRow = () => {
    setMembers([...members, {
      sno: members.length + 1,
      name: '',
      designation: '',
      telephone: '',
      email: ''
    }]);
  };

  const removeMemberRow = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    // Re-index S.No
    const reindexedButtons = newMembers.map((m, i) => ({ ...m, sno: i + 1 }));
    setMembers(reindexedButtons);
  };

  const updateMember = (index: number, field: keyof CommitteeMember, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              District Skill Plan
            </h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : 'Save Plan'}
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded-lg text-center ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}

        {/* Plan Title */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Plan Title
          </label>
          <input
            type="text"
            value={planTitle}
            onChange={(e) => setPlanTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Section 1: Chairperson Details */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
            1.a Chairperson Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name of the Chairperson
              </label>
              <input
                type="text"
                value={chairperson.name}
                onChange={(e) => setChairperson({ ...chairperson, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Designation
              </label>
              <input
                type="text"
                value={chairperson.designation}
                onChange={(e) => setChairperson({ ...chairperson, designation: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Telephone
              </label>
              <input
                type="text"
                value={chairperson.tel}
                onChange={(e) => setChairperson({ ...chairperson, tel: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email ID
              </label>
              <input
                type="email"
                value={chairperson.email}
                onChange={(e) => setChairperson({ ...chairperson, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Committee Members */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700 gap-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Committee Members
            </h2>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleUploadCSV}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload CSV
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-left">
                  <th className="p-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 w-16">S.No</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">Name</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">Designation</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">Telephone</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-slate-500">{member.sno}</span>
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-slate-200 text-sm"
                        placeholder="Name"
                      />
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        value={member.designation}
                        onChange={(e) => updateMember(index, 'designation', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-slate-200 text-sm"
                        placeholder="Designation"
                      />
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        value={member.telephone}
                        onChange={(e) => updateMember(index, 'telephone', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-slate-200 text-sm"
                        placeholder="Tel"
                      />
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-slate-200 text-sm"
                        placeholder="Email"
                      />
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-700 text-center">
                      <button
                        onClick={() => removeMemberRow(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addMemberRow}
            className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>
      </div>
    </div>
  );
}
