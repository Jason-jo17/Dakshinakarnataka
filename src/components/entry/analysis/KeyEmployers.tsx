import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface KeyEmployersData {
  id?: string;
  employer_name: string;
  
  recruited_count: number;
  recruited_avg_salary: number;
  recruited_job_roles: string;
  
  contact_name: string;
  contact_designation: string;
  contact_phone: string;
  
  expected_count: number;
  expected_salary: number;
  expected_job_role: string;
  expected_place_of_deployment: string;
}

export const KeyEmployers: React.FC = () => {
  const { currentDistrict } = useAuthStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [data, setData] = useState<KeyEmployersData[]>([]);

  // Form State
  const [newEntry, setNewEntry] = useState<Omit<KeyEmployersData, 'id'>>({
    employer_name: '',
    recruited_count: 0,
    recruited_avg_salary: 0,
    recruited_job_roles: '',
    contact_name: '',
    contact_designation: '',
    contact_phone: '',
    expected_count: 0,
    expected_salary: 0,
    expected_job_role: '',
    expected_place_of_deployment: '',
  });

  useEffect(() => {
    fetchData();
  }, [currentDistrict, year]);

  const fetchData = async () => {
    if (!currentDistrict) return;

    setLoading(true);
    try {
      const { data: existingData, error } = await supabase
        .from('key_employers_analysis')
        .select('*')
        .eq('district_id', currentDistrict)
        .eq('time_period', year)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (existingData) {
        setData(existingData.map((d: any) => ({
            ...d,
            recruited_count: Number(d.recruited_count),
            recruited_avg_salary: Number(d.recruited_avg_salary),
            expected_count: Number(d.expected_count),
            expected_salary: Number(d.expected_salary),
        })));
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage({ type: 'error', text: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof Omit<KeyEmployersData, 'id'>, value: string) => {
      let val: string | number = value;
       if(['employer_name', 'recruited_job_roles', 'contact_name', 'contact_designation', 'contact_phone', 'expected_job_role', 'expected_place_of_deployment'].includes(field)) {
          val = value;
      } else {
          val = value === '' ? 0 : Number(value);
      }
      setNewEntry(prev => ({ ...prev, [field]: val }));
  };

  const handleAddEntry = () => {
      if(!newEntry.employer_name.trim()) {
           setMessage({ type: 'error', text: 'Please enter employer name.' });
           return;
      }
      
      setData([...data, newEntry]);
      
      setNewEntry({
        employer_name: '',
        recruited_count: 0,
        recruited_avg_salary: 0,
        recruited_job_roles: '',
        contact_name: '',
        contact_designation: '',
        contact_phone: '',
        expected_count: 0,
        expected_salary: 0,
        expected_job_role: '',
        expected_place_of_deployment: '',
      });
  }

  const handleDeleteRow = async (index: number) => {
      const rowToDelete = data[index];
      
      if(rowToDelete.id) {
           const { error } = await supabase
            .from('key_employers_analysis')
            .delete()
            .eq('id', rowToDelete.id);
            
           if(error) {
               console.error('Error deleting row:', error);
               setMessage({ type: 'error', text: 'Failed to delete row (DB).' });
               return;
           }
      }

      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
  }

  const handleInputChange = (index: number, field: keyof KeyEmployersData, value: string) => {
    const newData = [...data];
    if(['employer_name', 'recruited_job_roles', 'contact_name', 'contact_designation', 'contact_phone', 'expected_job_role', 'expected_place_of_deployment'].includes(field)) {
        (newData[index] as any)[field] = value;
    } else {
         const numValue = value === '' ? 0 : Number(value);
         (newData[index] as any)[field] = numValue;
    }
    setData(newData);
  };
  
  const handleSave = async () => {
    if (!currentDistrict) {
      setMessage({ type: 'error', text: 'District not identified.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = data.map(row => ({
        id: row.id,
        district_id: currentDistrict,
        time_period: year,
        ...row
      }));

      const { data: savedData, error } = await supabase
        .from('key_employers_analysis')
        .upsert(payload, { onConflict: 'district_id, time_period, employer_name' })
        .select();

      if (error) throw error;
      
      if(savedData) {
          fetchData();
      }

      setMessage({ type: 'success', text: 'Data saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving data:', err);
      setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const csvData = data.map((row, index) => ({
        'S.No': index + 1,
        'Name of Employer': row.employer_name,
        // Recruited
        'Recruited Count': row.recruited_count,
        'Recruited Avg Salary': row.recruited_avg_salary,
        'Recruited Job Roles': row.recruited_job_roles,
        // Contact
        'Contact Name': row.contact_name,
        'Contact Designation': row.contact_designation,
        'Contact Phone': row.contact_phone,
        // Expected
        'Expected Count': row.expected_count,
        'Expected Salary': row.expected_salary,
        'Expected Job Role': row.expected_job_role,
        'Expected Deployment': row.expected_place_of_deployment,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Key_Employers_${currentDistrict}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data;
        const mergedData = [...data]; 
        let newCount = 0;
        let updateCount = 0;

        parsedData.forEach((row: any) => {
            const name = row['Name of Employer'];
            if (!name) return;

            const existingIndex = mergedData.findIndex(d => d.employer_name.toLowerCase() === name.toLowerCase());
            
            const newEntry = {
                employer_name: name,
                recruited_count: Number(row['Recruited Count']) || 0,
                recruited_avg_salary: Number(row['Recruited Avg Salary']) || 0,
                recruited_job_roles: row['Recruited Job Roles'] || '',
                contact_name: row['Contact Name'] || '',
                contact_designation: row['Contact Designation'] || '',
                contact_phone: row['Contact Phone'] || '',
                expected_count: Number(row['Expected Count']) || 0,
                expected_salary: Number(row['Expected Salary']) || 0,
                expected_job_role: row['Expected Job Role'] || '',
                expected_place_of_deployment: row['Expected Deployment'] || '',
            };

            if (existingIndex !== -1) {
                 mergedData[existingIndex] = { ...mergedData[existingIndex], ...newEntry };
                 updateCount++;
            } else {
                mergedData.push(newEntry);
                newCount++;
            }
        });

        setData(mergedData);
        setMessage({ type: 'success', text: `Imported: ${newCount} new, ${updateCount} updated.` });
      },
      error: () => {
          setMessage({ type: 'error', text: 'Error parsing CSV.' });
      }
    });
    
    event.target.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Table H: Key Employers</h2>
          <p className="text-sm text-gray-500">Data for {currentDistrict} - Year {year}</p>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="relative">
                <input 
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Year"
                />
            </div>

            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Import CSV
                <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
            </label>
            
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
                <Download className="w-4 h-4" />
                Export CSV
            </button>
            
            <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Data
            </button>
        </div>
      </div>

       {/* Add New Entry Form */}
       <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Add New Entry</h3>
           
           <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name of Employer</label>
                <input type="text" value={newEntry.employer_name} onChange={(e) => handleFormChange('employer_name', e.target.value)}
                    placeholder="Enter Employer Name" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
               {/* Recruited Past 12 Months */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Recruited (Last 12 Months)</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Number of Trainees</label>
                           <input type="number" min="0" value={newEntry.recruited_count || ''} onChange={(e) => handleFormChange('recruited_count', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Average Salary</label>
                           <input type="number" min="0" value={newEntry.recruited_avg_salary || ''} onChange={(e) => handleFormChange('recruited_avg_salary', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Job Roles</label>
                           <input type="text" value={newEntry.recruited_job_roles} onChange={(e) => handleFormChange('recruited_job_roles', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* Contact Person */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Contact Person</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Name</label>
                           <input type="text" value={newEntry.contact_name} onChange={(e) => handleFormChange('contact_name', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Designation</label>
                           <input type="text" value={newEntry.contact_designation} onChange={(e) => handleFormChange('contact_designation', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Phone No</label>
                           <input type="text" value={newEntry.contact_phone} onChange={(e) => handleFormChange('contact_phone', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* Expected Recruitment */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Expected (This Year)</h4>
                   <div className="space-y-2">
                       <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] text-gray-500">Number</label>
                                <input type="number" min="0" value={newEntry.expected_count || ''} onChange={(e) => handleFormChange('expected_count', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500">Salary</label>
                                <input type="number" min="0" value={newEntry.expected_salary || ''} onChange={(e) => handleFormChange('expected_salary', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                            </div>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Job Role</label>
                           <input type="text" value={newEntry.expected_job_role} onChange={(e) => handleFormChange('expected_job_role', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Place of Deployment</label>
                           <input type="text" value={newEntry.expected_place_of_deployment} onChange={(e) => handleFormChange('expected_place_of_deployment', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>
           </div>
           
           <div className="mt-4">
                <button 
                    onClick={handleAddEntry}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Entry to Table
                </button>
            </div>
       </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 sticky left-0 bg-gray-50 z-10">S.No</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[200px] text-left">Name of Employer</th>
                    
                    <th colSpan={3} className="px-2 py-1 border-r border-gray-200 bg-gray-100">Recruited in past 12 months</th>
                    <th colSpan={3} className="px-2 py-1 border-r border-gray-200 bg-blue-50">Contact Person</th>
                    <th colSpan={4} className="px-2 py-1 border-r border-gray-200 bg-green-50">Expected Recruitment this year</th>
                     
                    <th rowSpan={2} className="px-2 py-3 w-10 sticky right-0 bg-gray-50"></th>
                </tr>
                <tr>
                    {/* Recruited */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Number of Trainees</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Average Salary</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[150px]">Job Roles</th>
                    
                    {/* Contact */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[120px]">Name</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[120px]">Designation</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[100px]">Phone No</th>
                    
                    {/* Expected */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[80px]">Number</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[80px]">Salary</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[120px]">Job Role</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[120px]">Place of Deployment</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                            {index + 1}
                        </td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.employer_name} onChange={(e) => handleInputChange(index, 'employer_name', e.target.value)} /></td>
                        
                         {/* Recruited */}
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.recruited_count || ''} onChange={(e) => handleInputChange(index, 'recruited_count', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.recruited_avg_salary || ''} onChange={(e) => handleInputChange(index, 'recruited_avg_salary', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-1 py-1 outline-none bg-transparent focus:bg-gray-100 rounded" value={row.recruited_job_roles} onChange={(e) => handleInputChange(index, 'recruited_job_roles', e.target.value)} /></td>
                        
                         {/* Contact */}
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-1 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.contact_name} onChange={(e) => handleInputChange(index, 'contact_name', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-1 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.contact_designation} onChange={(e) => handleInputChange(index, 'contact_designation', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-1 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.contact_phone} onChange={(e) => handleInputChange(index, 'contact_phone', e.target.value)} /></td>
                        
                         {/* Expected */}
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.expected_count || ''} onChange={(e) => handleInputChange(index, 'expected_count', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.expected_salary || ''} onChange={(e) => handleInputChange(index, 'expected_salary', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-1 py-1 outline-none bg-transparent focus:bg-green-50 rounded" value={row.expected_job_role} onChange={(e) => handleInputChange(index, 'expected_job_role', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-1 py-1 outline-none bg-transparent focus:bg-green-50 rounded" value={row.expected_place_of_deployment} onChange={(e) => handleInputChange(index, 'expected_place_of_deployment', e.target.value)} /></td>
                        
                        <td className="px-2 py-2 text-center sticky right-0 bg-white group-hover:bg-gray-50">
                            <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={13} className="px-6 py-12 text-center text-gray-500 italic">
                            No data added yet.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
};
