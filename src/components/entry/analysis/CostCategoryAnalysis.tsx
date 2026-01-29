
import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface CostCategoryData {
  id?: string;
  sector_name: string;
  course_name: string;
  total_duration: string;
  cost_category: string;
  
  trained: number;
  placed: number;
  avg_salary: number;
}

export const CostCategoryAnalysis: React.FC = () => {
  const { currentDistrict } = useAuthStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [data, setData] = useState<CostCategoryData[]>([]);

  /* State for dropdown options */
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);

  // Form State
  const [newEntry, setNewEntry] = useState<Omit<CostCategoryData, 'id'>>({
    sector_name: '',
    course_name: '',
    total_duration: '',
    cost_category: '',
    
    trained: 0,
    placed: 0,
    avg_salary: 0,
  });

  useEffect(() => {
    fetchData();
  }, [currentDistrict, year]);

  const fetchData = async () => {
    if (!currentDistrict) return;

    setLoading(true);
    try {
        // 1. Fetch Main Data
      const { data: existingData, error } = await supabase
        .from('cost_category_analysis')
        .select('*')
        .eq('district_id', currentDistrict)
        .eq('time_period', year)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (existingData) {
        setData(existingData.map((d: any) => ({
          ...d,
            trained: Number(d.trained),
            placed: Number(d.placed),
            avg_salary: Number(d.avg_salary),
        })));
      } else {
        setData([]);
      }

      // 2. Fetch Sectors for Dropdown (from sectorwise_analysis)
      const { data: sectors } = await supabase
        .from('sectorwise_analysis')
        .select('sector_name')
        .eq('district_id', currentDistrict)
        .eq('time_period', year);
        
      if(sectors) {
          const uniqueSectors = Array.from(new Set(sectors.map((s:any) => s.sector_name))) as string[];
          setAvailableSectors(uniqueSectors.sort());
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage({ type: 'error', text: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof Omit<CostCategoryData, 'id'>, value: string) => {
      // Text fields are strings, numeric fields are numbers
      let val: string | number = value;
      if(['sector_name', 'course_name', 'total_duration', 'cost_category'].includes(field)) {
          val = value;
      } else {
          val = value === '' ? 0 : Number(value);
      }
      setNewEntry(prev => ({ ...prev, [field]: val }));
  };

  const handleAddEntry = () => {
      if(!newEntry.sector_name.trim()) {
           setMessage({ type: 'error', text: 'Please enter a sector name.' });
           return;
      }
       if(!newEntry.course_name.trim()) {
           setMessage({ type: 'error', text: 'Please enter a course name.' });
           return;
      }
      
      setData([...data, newEntry]);
      
      // Reset form
      setNewEntry({
        sector_name: '',
        course_name: '',
        total_duration: '',
        cost_category: '',
        
        trained: 0,
        placed: 0,
        avg_salary: 0,
      });
  }

  const handleDeleteRow = async (index: number) => {
      const rowToDelete = data[index];
      
      if(rowToDelete.id) {
           const { error } = await supabase
            .from('cost_category_analysis')
            .delete()
            .eq('id', rowToDelete.id);
            
           if(error) {
               console.error('Error deleting row:', error);
               setMessage({ type: 'error', text: 'Failed to delete row from database.' });
               return;
           }
      }

      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
  }

  const handleInputChange = (index: number, field: keyof CostCategoryData, value: string) => {
    const newData = [...data];
    
    // Check if field is numeric or string
    if(['sector_name', 'course_name', 'total_duration', 'cost_category'].includes(field)) {
        (newData[index] as any)[field] = value;
    } else {
         const numValue = value === '' ? 0 : Number(value);
         if (isNaN(numValue)) return;
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
        
        sector_name: row.sector_name,
        course_name: row.course_name,
        total_duration: row.total_duration,
        cost_category: row.cost_category,
        
        trained: row.trained,
        placed: row.placed,
        avg_salary: row.avg_salary,
      }));

      const { data: savedData, error } = await supabase
        .from('cost_category_analysis')
        .upsert(payload, { onConflict: 'district_id, time_period, sector_name, course_name, cost_category' })
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
    const csvData = data.map((row, index) => {
      return {
          'S.No': index + 1,
          'Sector': row.sector_name,
          'Course': row.course_name,
          'Total Duration': row.total_duration,
          'Cost Category': row.cost_category,
          
          'Trained': row.trained,
          'Placed': row.placed,
          'Average Salary': row.avg_salary,
      }
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cost_Category_Analysis_${currentDistrict}_${year}.csv`);
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
            const sector = row['Sector'];
            const course = row['Course'];
            
            if (!sector || !course) return; 

            const existingIndex = mergedData.findIndex(d => 
                d.sector_name.toLowerCase() === sector.toLowerCase() &&
                d.course_name.toLowerCase() === course.toLowerCase() &&
                d.cost_category.toLowerCase() === (row['Cost Category'] || '').toLowerCase()
            );
            
            const newEntry = {
                sector_name: sector,
                course_name: course,
                total_duration: row['Total Duration'] || '',
                cost_category: row['Cost Category'] || '',
                
                trained: Number(row['Trained']) || 0,
                placed: Number(row['Placed']) || 0,
                avg_salary: Number(row['Average Salary']) || 0,
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
          <h2 className="text-xl font-bold text-gray-900">Table E: Cost Category Analysis</h2>
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
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sector</label>
                    <input 
                        type="text"
                        list="sector-options" 
                        value={newEntry.sector_name}
                        onChange={(e) => handleFormChange('sector_name', e.target.value)}
                        placeholder="Select or Enter Sector Name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                     <datalist id="sector-options">
                        {availableSectors.map(sector => (
                            <option key={sector} value={sector} />
                        ))}
                    </datalist>
                </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / QP NOS</label>
                    <input 
                        type="text" 
                        value={newEntry.course_name}
                        onChange={(e) => handleFormChange('course_name', e.target.value)}
                        placeholder="Enter Course name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Total Duration</label>
                    <input 
                        type="text" 
                        value={newEntry.total_duration}
                        onChange={(e) => handleFormChange('total_duration', e.target.value)}
                        placeholder="Enter Duration..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cost Category (CCN)</label>
                    <input 
                        type="text" 
                        value={newEntry.cost_category}
                        onChange={(e) => handleFormChange('cost_category', e.target.value)}
                        placeholder="Enter Cost Category..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                </div>
           </div>

           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
               <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-gray-500"></span> Number of Trainees in LY
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Trained</label>
                        <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            value={newEntry.trained || ''} onChange={(e) => handleFormChange('trained', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Placed</label>
                        <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            value={newEntry.placed || ''} onChange={(e) => handleFormChange('placed', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Avg Salary</label>
                        <input type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                            value={newEntry.avg_salary || ''} onChange={(e) => handleFormChange('avg_salary', e.target.value)} />
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
            <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 w-12">S.No</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[150px]">Sector</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[200px]">Course/ QP NOS</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[120px]">Total Duration</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[120px]">Cost Category</th>
                    
                    <th colSpan={3} className="px-4 py-3 text-center bg-gray-100">Number of Trainees in LY</th>
                    <th rowSpan={2} className="px-2 py-3 w-10"></th>
                </tr>
                <tr>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Trained</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Placed</th>
                    <th className="px-2 py-2 bg-gray-100 min-w-[80px]">Avg Salary</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => {
                    return (
                        <tr key={index} className="bg-white hover:bg-gray-50 transition-colors group">
                            <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200">
                                {index + 1}
                            </td>
                            {/* Text Inputs */}
                            <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.sector_name} onChange={(e) => handleInputChange(index, 'sector_name', e.target.value)} /></td>
                            <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.course_name} onChange={(e) => handleInputChange(index, 'course_name', e.target.value)} /></td>
                            <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.total_duration} onChange={(e) => handleInputChange(index, 'total_duration', e.target.value)} /></td>
                            <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.cost_category} onChange={(e) => handleInputChange(index, 'cost_category', e.target.value)} /></td>
                            
                             {/* Metric Inputs */}
                            <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.trained || ''} onChange={(e) => handleInputChange(index, 'trained', e.target.value)} /></td>
                            <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.placed || ''} onChange={(e) => handleInputChange(index, 'placed', e.target.value)} /></td>
                            <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-blue-50 rounded" value={row.avg_salary || ''} onChange={(e) => handleInputChange(index, 'avg_salary', e.target.value)} /></td>
                            
                            <td className="px-2 py-2 text-center">
                                <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    )
                })}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500 italic">
                            No data added yet. Use the form above to add a new entry.
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
