import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface PlacementLocationData {
  id?: string;
  sector_name: string;
  course_name: string;

  trained: number;
  placed: number;

  gender_m: number;
  gender_f: number;
  gender_total?: number;

  location_rural: number;
  location_urban: number;

  migration_no: number;
  migration_within_district: number;
  migration_within_state: number;
  migration_outside_state: number;
  migration_overseas: number;
  migration_total?: number;
}

export const PlacementLocationAnalysis: React.FC = () => {
  const { currentDistrict } = useAuthStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [data, setData] = useState<PlacementLocationData[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);

  // Form State
  const [newEntry, setNewEntry] = useState<Omit<PlacementLocationData, 'id'>>({
    sector_name: '',
    course_name: '',
    trained: 0,
    placed: 0,
    gender_m: 0,
    gender_f: 0,
    gender_total: 0,
    location_rural: 0,
    location_urban: 0,
    migration_no: 0,
    migration_within_district: 0,
    migration_within_state: 0,
    migration_outside_state: 0,
    migration_overseas: 0,
    migration_total: 0,
  });

  // Calculate totals for new entry form
  useEffect(() => {
    const gTotal = (newEntry.gender_m || 0) + (newEntry.gender_f || 0);
    const mTotal = (newEntry.migration_within_district || 0) +
      (newEntry.migration_within_state || 0) +
      (newEntry.migration_outside_state || 0) +
      (newEntry.migration_overseas || 0); // Excluding 'No' migration as per user instruction formula

    setNewEntry(prev => ({ ...prev, gender_total: gTotal, migration_total: mTotal }));
  }, [newEntry.gender_m, newEntry.gender_f, newEntry.migration_within_district, newEntry.migration_within_state, newEntry.migration_outside_state, newEntry.migration_overseas]);

  useEffect(() => {
    fetchData();
  }, [currentDistrict, year]);

  const fetchData = async () => {
    if (!currentDistrict) return;

    setLoading(true);
    try {
      // 1. Fetch Main Data
      const { data: existingData, error } = await supabase
        .from('placement_location_analysis')
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
          gender_m: Number(d.gender_m),
          gender_f: Number(d.gender_f),
          gender_total: Number(d.gender_total),
          location_rural: Number(d.location_rural),
          location_urban: Number(d.location_urban),
          migration_no: Number(d.migration_no),
          migration_within_district: Number(d.migration_within_district),
          migration_within_state: Number(d.migration_within_state),
          migration_outside_state: Number(d.migration_outside_state),
          migration_overseas: Number(d.migration_overseas),
          migration_total: Number(d.migration_total),
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

      if (sectors) {
        const uniqueSectors = Array.from(new Set(sectors.map((s: any) => s.sector_name))) as string[];
        setAvailableSectors(uniqueSectors.sort());
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setMessage({ type: 'error', text: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof Omit<PlacementLocationData, 'id'>, value: string) => {
    let val: string | number = value;
    if (['sector_name', 'course_name'].includes(field)) {
      val = value;
    } else {
      val = value === '' ? 0 : Number(value);
    }
    setNewEntry(prev => ({ ...prev, [field]: val }));
  };

  const handleAddEntry = () => {
    if (!newEntry.sector_name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a sector name.' });
      return;
    }
    if (!newEntry.course_name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a course name.' });
      return;
    }

    // Totals are already calculated in useEffect
    setData([...data, newEntry]);

    setNewEntry({
      sector_name: '',
      course_name: '',
      trained: 0,
      placed: 0,
      gender_m: 0,
      gender_f: 0,
      gender_total: 0,
      location_rural: 0,
      location_urban: 0,
      migration_no: 0,
      migration_within_district: 0,
      migration_within_state: 0,
      migration_outside_state: 0,
      migration_overseas: 0,
      migration_total: 0,
    });
  }

  const handleDeleteRow = async (index: number) => {
    const rowToDelete = data[index];

    if (rowToDelete.id) {
      const { error } = await supabase
        .from('placement_location_analysis')
        .delete()
        .eq('id', rowToDelete.id);

      if (error) {
        console.error('Error deleting row:', error);
        setMessage({ type: 'error', text: 'Failed to delete row from database.' });
        return;
      }
    }

    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  }

  const handleInputChange = (index: number, field: keyof PlacementLocationData, value: string) => {
    const newData = [...data];
    if (['sector_name', 'course_name'].includes(field)) {
      (newData[index] as any)[field] = value;
    } else {
      const numValue = value === '' ? 0 : Number(value);
      (newData[index] as any)[field] = numValue;

      // Recalculate totals for this row
      const row = newData[index];
      row.gender_total = (row.gender_m || 0) + (row.gender_f || 0);
      row.migration_total = (row.migration_within_district || 0) +
        (row.migration_within_state || 0) +
        (row.migration_outside_state || 0) +
        (row.migration_overseas || 0);
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
        .from('placement_location_analysis')
        .upsert(payload, { onConflict: 'district_id, time_period, sector_name, course_name' })
        .select();

      if (error) throw error;

      if (savedData) {
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
        'Course/NOS': row.course_name,
        'Trained': row.trained,
        'Placed': row.placed,
        'Gender M': row.gender_m,
        'Gender F': row.gender_f,
        'Gender Total': row.gender_total,
        'Rural': row.location_rural,
        'Urban': row.location_urban,
        'No Migration': row.migration_no,
        'Within District': row.migration_within_district,
        'Within State': row.migration_within_state,
        'Outside State': row.migration_outside_state,
        'Overseas': row.migration_overseas,
        'Migration Total': row.migration_total
      }
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Placement_Location_Analysis_${currentDistrict}_${year}.csv`);
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

          if (!sector || !course) return;

          const existingIndex = mergedData.findIndex(d =>
            d.sector_name.toLowerCase() === sector.toLowerCase() &&
            d.course_name.toLowerCase() === course.toLowerCase()
          );

          const g_m = Number(row['Gender M']) || 0;
          const g_f = Number(row['Gender F']) || 0;
          const m_dist = Number(row['Within District']) || 0;
          const m_state = Number(row['Within State']) || 0;
          const m_out = Number(row['Outside State']) || 0;
          const m_over = Number(row['Overseas']) || 0;

          const newEntry = {
            sector_name: sector,
            course_name: course,
            trained: Number(row['Trained']) || 0,
            placed: Number(row['Placed']) || 0,
            gender_m: g_m,
            gender_f: g_f,
            gender_total: g_m + g_f,
            location_rural: Number(row['Rural']) || 0,
            location_urban: Number(row['Urban']) || 0,
            migration_no: Number(row['No Migration']) || 0,
            migration_within_district: m_dist,
            migration_within_state: m_state,
            migration_outside_state: m_out,
            migration_overseas: m_over,
            migration_total: m_dist + m_state + m_out + m_over,
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
          <h2 className="text-xl font-bold text-gray-900">Table F: Placement Location Analysis</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sector</label>
            <input type="text" list="sector-options" value={newEntry.sector_name} onChange={(e) => handleFormChange('sector_name', e.target.value)}
              placeholder="Sector Name..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
            <datalist id="sector-options">
              {availableSectors.map(sector => <option key={sector} value={sector} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / NOS</label>
            <input type="text" value={newEntry.course_name} onChange={(e) => handleFormChange('course_name', e.target.value)}
              placeholder="Course Name..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Numbers */}
          <div className="bg-white p-3 rounded border border-gray-200">
            <h4 className="text-xs font-bold text-gray-800 mb-2">Total Numbers</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500">Trained</label>
                <input type="number" min="0" value={newEntry.trained || ''} onChange={(e) => handleFormChange('trained', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Placed</label>
                <input type="number" min="0" value={newEntry.placed || ''} onChange={(e) => handleFormChange('placed', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="bg-white p-3 rounded border border-gray-200">
            <h4 className="text-xs font-bold text-gray-800 mb-2">Gender Breakdown</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500">Male</label>
                <input type="number" min="0" value={newEntry.gender_m || ''} onChange={(e) => handleFormChange('gender_m', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Female</label>
                <input type="number" min="0" value={newEntry.gender_f || ''} onChange={(e) => handleFormChange('gender_f', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold">Total</label>
                <input type="number" readOnly value={newEntry.gender_total || 0}
                  className="w-full px-2 py-1 border border-gray-200 bg-gray-50 text-gray-600 rounded text-sm font-bold shadow-sm" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-3 rounded border border-gray-200">
            <h4 className="text-xs font-bold text-gray-800 mb-2">Location</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500">Rural</label>
                <input type="number" min="0" value={newEntry.location_rural || ''} onChange={(e) => handleFormChange('location_rural', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Urban</label>
                <input type="number" min="0" value={newEntry.location_urban || ''} onChange={(e) => handleFormChange('location_urban', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
            </div>
          </div>

          {/* Migration */}
          <div className="bg-white p-3 rounded border border-gray-200 col-span-1 lg:col-span-1">
            <h4 className="text-xs font-bold text-gray-800 mb-2">Migration</h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="col-span-2 lg:col-span-1">
                <label className="block text-[10px] text-gray-500">No</label>
                <input type="number" min="0" value={newEntry.migration_no || ''} onChange={(e) => handleFormChange('migration_no', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Within Dist</label>
                <input type="number" min="0" value={newEntry.migration_within_district || ''} onChange={(e) => handleFormChange('migration_within_district', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Within State</label>
                <input type="number" min="0" value={newEntry.migration_within_state || ''} onChange={(e) => handleFormChange('migration_within_state', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Outside State</label>
                <input type="number" min="0" value={newEntry.migration_outside_state || ''} onChange={(e) => handleFormChange('migration_outside_state', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500">Overseas</label>
                <input type="number" min="0" value={newEntry.migration_overseas || ''} onChange={(e) => handleFormChange('migration_overseas', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold">Total</label>
                <input type="number" readOnly value={newEntry.migration_total || 0}
                  className="w-full px-2 py-1 border border-gray-200 bg-gray-50 text-gray-600 rounded text-sm font-bold shadow-sm" />
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

                <th colSpan={2} className="px-2 py-1 border-r border-gray-200 bg-gray-100">Number</th>
                <th colSpan={3} className="px-2 py-1 border-r border-gray-200 bg-blue-50">Placed Student Gender</th>
                <th colSpan={2} className="px-2 py-1 border-r border-gray-200 bg-green-50">Placement Location</th>
                <th colSpan={6} className="px-2 py-1 bg-amber-50">Migration for taking up job</th>

                <th rowSpan={2} className="px-2 py-3 w-10 sticky right-0 bg-gray-50"></th>
              </tr>
              <tr>
                {/* Number */}
                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[60px]">Trained</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 min-w-[60px]">Placed</th>

                {/* Gender */}
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[50px]">M</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 min-w-[50px]">F</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50/50 min-w-[60px]">Total</th>

                {/* Location */}
                <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[50px]">Rural</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-green-50 min-w-[50px]">Urban</th>

                {/* Migration */}
                <th className="px-2 py-2 border-r border-gray-200 bg-amber-50 min-w-[50px]">No</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-amber-50 min-w-[80px]">Within Dist</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-amber-50 min-w-[80px]">Within State</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-amber-50 min-w-[80px]">Outside State</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-amber-50 min-w-[80px]">Overseas</th>
                <th className="px-2 py-2 bg-amber-50/50 min-w-[60px]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, index) => {
                const genderTotal = (row.gender_m || 0) + (row.gender_f || 0);
                const migrationTotal = (row.migration_no || 0) + (row.migration_within_district || 0) + (row.migration_within_state || 0) + (row.migration_outside_state || 0) + (row.migration_overseas || 0);

                return (
                  <tr key={index} className="bg-white hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                      {index + 1}
                    </td>
                    {/* Text Inputs */}
                    <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.sector_name} onChange={(e) => handleInputChange(index, 'sector_name', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="text" className="w-full h-full px-2 py-1 outline-none bg-transparent focus:bg-yellow-50 rounded" value={row.course_name} onChange={(e) => handleInputChange(index, 'course_name', e.target.value)} /></td>

                    {/* Metrics */}
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.trained || ''} onChange={(e) => handleInputChange(index, 'trained', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.placed || ''} onChange={(e) => handleInputChange(index, 'placed', e.target.value)} /></td>

                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.gender_m || ''} onChange={(e) => handleInputChange(index, 'gender_m', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.gender_f || ''} onChange={(e) => handleInputChange(index, 'gender_f', e.target.value)} /></td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 font-medium text-gray-700 bg-gray-50">{genderTotal}</td>

                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.location_rural || ''} onChange={(e) => handleInputChange(index, 'location_rural', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.location_urban || ''} onChange={(e) => handleInputChange(index, 'location_urban', e.target.value)} /></td>

                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.migration_no || ''} onChange={(e) => handleInputChange(index, 'migration_no', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.migration_within_district || ''} onChange={(e) => handleInputChange(index, 'migration_within_district', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.migration_within_state || ''} onChange={(e) => handleInputChange(index, 'migration_within_state', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.migration_outside_state || ''} onChange={(e) => handleInputChange(index, 'migration_outside_state', e.target.value)} /></td>
                    <td className="p-1 border-r border-gray-200"><input type="number" min="0" className="w-full h-full px-1 py-1 text-center outline-none bg-transparent focus:bg-blue-50 rounded" value={row.migration_overseas || ''} onChange={(e) => handleInputChange(index, 'migration_overseas', e.target.value)} /></td>
                    <td className="px-2 py-2 text-center font-medium text-gray-700 bg-gray-50">{migrationTotal}</td>

                    <td className="px-2 py-2 text-center sticky right-0 bg-white group-hover:bg-gray-50">
                      <button onClick={() => handleDeleteRow(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={17} className="px-6 py-12 text-center text-gray-500 italic">
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
