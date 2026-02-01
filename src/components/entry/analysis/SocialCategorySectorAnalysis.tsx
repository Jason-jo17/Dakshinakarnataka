import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

import { AnalysisVisuals } from '../../common/AnalysisVisuals';

interface SocialCategorySectorData {
  id?: string;
  sector_name: string;
  
  sc_trained: number;
  sc_placed: number;
  
  st_trained: number;
  st_placed: number;
  
  minority_trained: number;
  minority_placed: number;
  
  gen_trained: number;
  gen_placed: number;
}

export const SocialCategorySectorAnalysis: React.FC = () => {
  const { currentDistrict } = useAuthStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showVisuals, setShowVisuals] = useState(false);
  
  const [data, setData] = useState<SocialCategorySectorData[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  
  // Form State
  const [newEntry, setNewEntry] = useState<Omit<SocialCategorySectorData, 'id'>>({
    sector_name: '',
    sc_trained: 0,
    sc_placed: 0,
    st_trained: 0,
    st_placed: 0,
    minority_trained: 0,
    minority_placed: 0,
    gen_trained: 0,
    gen_placed: 0,
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
        .from('social_category_sector_analysis')
        .select('*')
        .eq('district_id', currentDistrict)
        .eq('time_period', year)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (existingData) {
        setData(existingData.map((d: any) => ({
            ...d,
            sc_trained: Number(d.sc_trained),
            sc_placed: Number(d.sc_placed),
            st_trained: Number(d.st_trained),
            st_placed: Number(d.st_placed),
            minority_trained: Number(d.minority_trained),
            minority_placed: Number(d.minority_placed),
            gen_trained: Number(d.gen_trained),
            gen_placed: Number(d.gen_placed),
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

  const handleFormChange = (field: keyof Omit<SocialCategorySectorData, 'id'>, value: string) => {
      let val: string | number = value;
       if(['sector_name'].includes(field)) {
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
      
      setData([...data, newEntry]);
      
      setNewEntry({
        sector_name: '',
        sc_trained: 0,
        sc_placed: 0,
        st_trained: 0,
        st_placed: 0,
        minority_trained: 0,
        minority_placed: 0,
        gen_trained: 0,
        gen_placed: 0,
      });
  }

  const handleDeleteRow = async (index: number) => {
      const rowToDelete = data[index];
      
      if(rowToDelete.id) {
           const { error } = await supabase
            .from('social_category_sector_analysis')
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

  const handleInputChange = (index: number, field: keyof SocialCategorySectorData, value: string) => {
    const newData = [...data];
    if(['sector_name'].includes(field)) {
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
        .from('social_category_sector_analysis')
        .upsert(payload, { onConflict: 'district_id, time_period, sector_name' })
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
        // SC
        'SC Trained': row.sc_trained,
        'SC Placed': row.sc_placed,
        // ST
        'ST Trained': row.st_trained,
        'ST Placed': row.st_placed,
        // Minority
        'Minority Trained': row.minority_trained,
        'Minority Placed': row.minority_placed,
        // Gen
        'Gen Trained': row.gen_trained,
        'Gen Placed': row.gen_placed,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Social_Category_Sector_Analysis_${currentDistrict}_${year}.csv`);
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
            
            if (!sector) return; // Skip invalid rows

            const existingIndex = mergedData.findIndex(d => 
                d.sector_name.toLowerCase() === sector.toLowerCase()
            );
            
            const newEntry = {
                sector_name: sector,
                sc_trained: Number(row['SC Trained']) || 0,
                sc_placed: Number(row['SC Placed']) || 0,
                st_trained: Number(row['ST Trained']) || 0,
                st_placed: Number(row['ST Placed']) || 0,
                minority_trained: Number(row['Minority Trained']) || 0,
                minority_placed: Number(row['Minority Placed']) || 0,
                gen_trained: Number(row['Gen Trained']) || 0,
                gen_placed: Number(row['Gen Placed']) || 0,
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
          <h2 className="text-xl font-bold text-gray-900">Table I: Social Category Analysis by Sector</h2>
          <p className="text-sm text-gray-500">Data for {currentDistrict} - Year {year}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowVisuals(!showVisuals)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showVisuals ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {showVisuals ? 'Hide Visuals' : 'Show Visuals'}
          </button>

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

      {showVisuals && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <AnalysisVisuals
            title="Trained vs Placed Scatter Distribution"
            data={data}
            visualsType="scatter"
            xAxisKey="sector_name"
            scatterKeys={[
              { name: 'SC Trained', yKey: 'sc_trained', color: '#818cf8' },
              { name: 'ST Trained', yKey: 'st_trained', color: '#c084fc' },
              { name: 'Minority Trained', yKey: 'minority_trained', color: '#4ade80' },
              { name: 'General Trained', yKey: 'gen_trained', color: '#fbbf24' }
            ]}
            height={400}
          />
        </div>
      )}

       {/* Add New Entry Form */}
       <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Add New Entry</h3>
           
           <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sector</label>
                <input type="text" list="sector-options" value={newEntry.sector_name} onChange={(e) => handleFormChange('sector_name', e.target.value)}
                    placeholder="Select or Enter Sector..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>
                 <datalist id="sector-options">
                    {availableSectors.map(sector => <option key={sector} value={sector} />)}
                </datalist>
            </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {/* SC */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">SC</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Trained</label>
                           <input type="number" min="0" value={newEntry.sc_trained || ''} onChange={(e) => handleFormChange('sc_trained', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Placed</label>
                           <input type="number" min="0" value={newEntry.sc_placed || ''} onChange={(e) => handleFormChange('sc_placed', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* ST */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">ST</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Trained</label>
                           <input type="number" min="0" value={newEntry.st_trained || ''} onChange={(e) => handleFormChange('st_trained', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Placed</label>
                           <input type="number" min="0" value={newEntry.st_placed || ''} onChange={(e) => handleFormChange('st_placed', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* Minority */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">Minority</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Trained</label>
                           <input type="number" min="0" value={newEntry.minority_trained || ''} onChange={(e) => handleFormChange('minority_trained', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Placed</label>
                           <input type="number" min="0" value={newEntry.minority_placed || ''} onChange={(e) => handleFormChange('minority_placed', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                   </div>
               </div>

                {/* Gen */}
               <div className="bg-white p-3 rounded border border-gray-200">
                   <h4 className="text-xs font-bold text-gray-800 mb-2">General</h4>
                   <div className="space-y-2">
                       <div>
                           <label className="block text-[10px] text-gray-500">Trained</label>
                           <input type="number" min="0" value={newEntry.gen_trained || ''} onChange={(e) => handleFormChange('gen_trained', e.target.value)}
                               className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/>
                       </div>
                       <div>
                           <label className="block text-[10px] text-gray-500">Placed</label>
                           <input type="number" min="0" value={newEntry.gen_placed || ''} onChange={(e) => handleFormChange('gen_placed', e.target.value)}
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
                    <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[200px] text-left">Sector</th>
                    
                    <th colSpan={2} className="px-2 py-1 border-r border-gray-200 bg-gray-100">SC</th>
                    <th colSpan={2} className="px-2 py-1 border-r border-gray-200 bg-blue-50">ST</th>
                    <th colSpan={2} className="px-2 py-1 border-r border-gray-200 bg-green-50">Minority</th>
                    <th colSpan={2} className="px-2 py-1 border-r border-gray-200 bg-yellow-50">Gen</th>
                     
                    <th rowSpan={2} className="px-2 py-3 w-10 sticky right-0 bg-gray-50"></th>
                </tr>
                <tr>
                    {/* SC */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Trained</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[80px]">Placed</th>
                    
                    {/* ST */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[80px]">Trained</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[80px]">Placed</th>
                    
                    {/* Minority */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[80px]">Trained</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[80px]">Placed</th>
                    
                    {/* Gen */}
                    <th className="px-2 py-2 border-r border-gray-200 bg-yellow-50 min-w-[80px]">Trained</th>
                    <th className="px-2 py-2 border-r border-gray-200 bg-yellow-50 min-w-[80px]">Placed</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                            {index + 1}
                        </td>
                        <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.sector_name} onChange={(e) => handleInputChange(index, 'sector_name', e.target.value)} /></td>
                        
                         {/* SC */}
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.sc_trained || ''} onChange={(e) => handleInputChange(index, 'sc_trained', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-gray-100 rounded" value={row.sc_placed || ''} onChange={(e) => handleInputChange(index, 'sc_placed', e.target.value)} /></td>
                        
                         {/* ST */}
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.st_trained || ''} onChange={(e) => handleInputChange(index, 'st_trained', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.st_placed || ''} onChange={(e) => handleInputChange(index, 'st_placed', e.target.value)} /></td>
                        
                         {/* Minority */}
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.minority_trained || ''} onChange={(e) => handleInputChange(index, 'minority_trained', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-green-50 rounded" value={row.minority_placed || ''} onChange={(e) => handleInputChange(index, 'minority_placed', e.target.value)} /></td>
                        
                         {/* Gen */}
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.gen_trained || ''} onChange={(e) => handleInputChange(index, 'gen_trained', e.target.value)} /></td>
                        <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.gen_placed || ''} onChange={(e) => handleInputChange(index, 'gen_placed', e.target.value)} /></td>
                        
                        <td className="px-2 py-2 text-center sticky right-0 bg-white group-hover:bg-gray-50">
                            <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-gray-500 italic">
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
