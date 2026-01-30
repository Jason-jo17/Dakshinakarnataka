import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface WageAnalysisData {
  id?: string;
  sector_name: string;
  course_name: string;
  
  avg_wage_rural_male: number;
  avg_wage_rural_female: number;
  avg_wage_urban_male: number;
  avg_wage_urban_female: number;

  placed_trainees: number;

  placed_above_10_percent_min: number;
  placed_within_10_percent_min: number;
  placed_below_min: number;
}

export const WageAnalysis: React.FC = () => {
  const { currentDistrict } = useAuthStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [data, setData] = useState<WageAnalysisData[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  
  // District Level Min Wage State (Visual only for now, unless we create a table for it)
  const [minWageSkilled, setMinWageSkilled] = useState<number | ''>('');
  const [minWageUnskilled, setMinWageUnskilled] = useState<number | ''>('');

  // Form State
  const [newEntry, setNewEntry] = useState<Omit<WageAnalysisData, 'id'>>({
    sector_name: '',
    course_name: '',
    avg_wage_rural_male: 0,
    avg_wage_rural_female: 0,
    avg_wage_urban_male: 0,
    avg_wage_urban_female: 0,
    placed_trainees: 0,
    placed_above_10_percent_min: 0,
    placed_within_10_percent_min: 0,
    placed_below_min: 0,
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
        .from('wage_analysis')
        .select('*')
        .eq('district_id', currentDistrict)
        .eq('time_period', year)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (existingData) {
        setData(existingData.map((d: any) => ({
            ...d,
            avg_wage_rural_male: Number(d.avg_wage_rural_male),
            avg_wage_rural_female: Number(d.avg_wage_rural_female),
            avg_wage_urban_male: Number(d.avg_wage_urban_male),
            avg_wage_urban_female: Number(d.avg_wage_urban_female),
            placed_trainees: Number(d.placed_trainees),
            placed_above_10_percent_min: Number(d.placed_above_10_percent_min),
            placed_within_10_percent_min: Number(d.placed_within_10_percent_min),
            placed_below_min: Number(d.placed_below_min),
        })));
      } else {
        setData([]);
      }

      // 2. Fetch Sectors for Dropdown
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

  const handleFormChange = (field: keyof Omit<WageAnalysisData, 'id'>, value: string) => {
      let val: string | number = value;
       if(['sector_name', 'course_name'].includes(field)) {
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
      
      setNewEntry({
        sector_name: '',
        course_name: '',
        avg_wage_rural_male: 0,
        avg_wage_rural_female: 0,
        avg_wage_urban_male: 0,
        avg_wage_urban_female: 0,
        placed_trainees: 0,
        placed_above_10_percent_min: 0,
        placed_within_10_percent_min: 0,
        placed_below_min: 0,
      });
  }

  const handleDeleteRow = async (index: number) => {
      const rowToDelete = data[index];
      
      if(rowToDelete.id) {
           const { error } = await supabase
            .from('wage_analysis')
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

  const handleInputChange = (index: number, field: keyof WageAnalysisData, value: string) => {
    const newData = [...data];
    if(['sector_name', 'course_name'].includes(field)) {
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
        .from('wage_analysis')
        .upsert(payload, { onConflict: 'district_id, time_period, sector_name, course_name' })
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
        'Sector': row.sector_name,
        'Course/NOS': row.course_name,
        'Avg Wages (Rural M)': row.avg_wage_rural_male,
        'Avg Wages (Rural F)': row.avg_wage_rural_female,
        'Avg Wages (Urban M)': row.avg_wage_urban_male,
        'Avg Wages (Urban F)': row.avg_wage_urban_female,
        'Traiinees Placed': row.placed_trainees,
        'Placed > 10% Min': row.placed_above_10_percent_min,
        'Placed +/- 10% Min': row.placed_within_10_percent_min,
        'Placed < Min': row.placed_below_min
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Wage_Analysis_${currentDistrict}_${year}.csv`);
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
            const course = row['Course/NOS'] || row['Course'];
            
            if (!sector || !course) return; // Skip invalid rows

            const existingIndex = mergedData.findIndex(d => 
                d.sector_name.toLowerCase() === sector.toLowerCase() &&
                d.course_name.toLowerCase() === course.toLowerCase()
            );
            
            const newEntry = {
                sector_name: sector,
                course_name: course,
                avg_wage_rural_male: Number(row['Avg Wages (Rural M)']) || 0,
                avg_wage_rural_female: Number(row['Avg Wages (Rural F)']) || 0,
                avg_wage_urban_male: Number(row['Avg Wages (Urban M)']) || 0,
                avg_wage_urban_female: Number(row['Avg Wages (Urban F)']) || 0,
                placed_trainees: Number(row['Traiinees Placed']) || 0,
                placed_above_10_percent_min: Number(row['Placed > 10% Min']) || 0,
                placed_within_10_percent_min: Number(row['Placed +/- 10% Min']) || 0,
                placed_below_min: Number(row['Placed < Min']) || 0,
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
          <h2 className="text-xl font-bold text-gray-900">Table G: Wage Analysis</h2>
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

       {/* Top Section: Min Wage Config (Visual Reference) */}
       <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
           <div className="flex items-center gap-6">
               <span className="text-sm font-bold text-gray-800">Min wage in district:</span>
               <div className="flex items-center gap-2">
                   <label className="text-xs text-gray-600">Skilled Manpower:</label>
                   <input 
                      type="number" 
                      value={minWageSkilled} 
                      onChange={(e) => setMinWageSkilled(e.target.value === '' ? '' : Number(e.target.value))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded w-24 focus:ring-1 focus:ring-blue-500"
                      placeholder="₹"
                   />
               </div>
               <div className="flex items-center gap-2">
                   <label className="text-xs text-gray-600">Unskilled Manpower:</label>
                   <input 
                      type="number" 
                      value={minWageUnskilled} 
                      onChange={(e) => setMinWageUnskilled(e.target.value === '' ? '' : Number(e.target.value))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded w-24 focus:ring-1 focus:ring-blue-500"
                      placeholder="₹"
                   />
               </div>
               <span className="text-xs text-gray-400 italic">(For reference)</span>
           </div>
       </div>

       {/* Add New Entry Form */}
       <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Add New Entry</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sector</label>
                    <input type="text" list="sector-options" value={newEntry.sector_name} onChange={(e) => handleFormChange('sector_name', e.target.value)}
                        placeholder="Sector Name..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>
                     <datalist id="sector-options">
                        {availableSectors.map(sector => <option key={sector} value={sector} />)}
                    </datalist>
                </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / NOS</label>
                    <input type="text" value={newEntry.course_name} onChange={(e) => handleFormChange('course_name', e.target.value)}
                        placeholder="Course Name..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>
                </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
               {/* Avg Wages */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Avg Wages</h4>
                   <div className="grid grid-cols-2 gap-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Rural Male</label>
                           <input type="number" min="0" value={newEntry.avg_wage_rural_male || ''} onChange={(e) => handleFormChange('avg_wage_rural_male', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Rural Female</label>
                           <input type="number" min="0" value={newEntry.avg_wage_rural_female || ''} onChange={(e) => handleFormChange('avg_wage_rural_female', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Urban Male</label>
                           <input type="number" min="0" value={newEntry.avg_wage_urban_male || ''} onChange={(e) => handleFormChange('avg_wage_urban_male', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Urban Female</label>
                           <input type="number" min="0" value={newEntry.avg_wage_urban_female || ''} onChange={(e) => handleFormChange('avg_wage_urban_female', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* Trainees Placed */}
               <div className="bg-white p-3 rounded border border-gray-200 lg:col-span-1">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Count</h4>
                   <div className="flex flex-col gap-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Number of trainees placed</label>
                           <input type="number" min="0" value={newEntry.placed_trainees || ''} onChange={(e) => handleFormChange('placed_trainees', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* Distribution */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Placement Distribution (vs Skilled Min Wage)</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">getting 10% or more above min wage</label>
                           <input type="number" min="0" value={newEntry.placed_above_10_percent_min || ''} onChange={(e) => handleFormChange('placed_above_10_percent_min', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Getting +/- 10% of the min wage</label>
                           <input type="number" min="0" value={newEntry.placed_within_10_percent_min || ''} onChange={(e) => handleFormChange('placed_within_10_percent_min', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Getting lower than min wage</label>
                           <input type="number" min="0" value={newEntry.placed_below_min || ''} onChange={(e) => handleFormChange('placed_below_min', e.target.value)}
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
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[150px]">Sector</th>
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[200px]">Course/NOS</th>
                    
                    <th colSpan={4} className="px-2 py-1 border-r border-gray-200 bg-gray-100">Avg Wages</th>
                    <th rowSpan={2} className="px-4 py-1 border-r border-gray-200 bg-blue-50 w-24">Number of trainees placed</th>
                    <th colSpan={3} className="px-2 py-1 border-r border-gray-200 bg-green-50">Number of placed trainees</th>
                     
                    <th rowSpan={2} className="px-2 py-3 w-10 sticky right-0 bg-gray-50"></th>
                </tr>
                <tr>
                    {/* Avg Wages */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Rural Male</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Rural Female</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Urban Male</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Urban Female</th>
                    
                    {/* Distribution */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[100px] text-[10px]">getting 10% or more above min wage for skilled</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[100px] text-[10px]">Getting +/- 10% of the min wage for skilled</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[100px] text-[10px]">Getting lower that min wage for skilled manpower</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                            {index + 1}
                        </td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.sector_name} onChange={(e) => handleInputChange(index, 'sector_name', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.course_name} onChange={(e) => handleInputChange(index, 'course_name', e.target.value)} /></td>
                        
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.avg_wage_rural_male || ''} onChange={(e) => handleInputChange(index, 'avg_wage_rural_male', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.avg_wage_rural_female || ''} onChange={(e) => handleInputChange(index, 'avg_wage_rural_female', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.avg_wage_urban_male || ''} onChange={(e) => handleInputChange(index, 'avg_wage_urban_male', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.avg_wage_urban_female || ''} onChange={(e) => handleInputChange(index, 'avg_wage_urban_female', e.target.value)} /></td>
                        
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded font-medium" value={row.placed_trainees || ''} onChange={(e) => handleInputChange(index, 'placed_trainees', e.target.value)} /></td>
                        
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.placed_above_10_percent_min || ''} onChange={(e) => handleInputChange(index, 'placed_above_10_percent_min', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.placed_within_10_percent_min || ''} onChange={(e) => handleInputChange(index, 'placed_within_10_percent_min', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.placed_below_min || ''} onChange={(e) => handleInputChange(index, 'placed_below_min', e.target.value)} /></td>
                        
                        <td className="px-2 py-2 text-center sticky right-0 bg-white group-hover:bg-gray-50">
                            <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={12} className="px-6 py-12 text-center text-gray-500 italic">
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
