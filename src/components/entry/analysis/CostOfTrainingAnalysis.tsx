
import React, { useState, useEffect } from 'react';
import { Download, Loader2, Settings, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';
import { AnalysisVisuals } from '../../common/AnalysisVisuals';
import { QPNOSDurationManager } from './QPNOSDurationManager';

interface CostTrainingRow {
  id?: string;
  sector_name: string;
  course_name: string;
  total_duration: string; // From stored data
  cost_category: string;
  trained: number;
  placed: number;
  avg_salary: number;
}

export const CostOfTrainingAnalysis: React.FC = () => {
  const { currentDistrict } = useAuthStore();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'analysis' | 'config'>('analysis');
  const [showVisuals, setShowVisuals] = useState(false);

  const [data, setData] = useState<CostTrainingRow[]>([]);
  const [ccnRates, setCcnRates] = useState<Record<string, number>>({});
  const [qpDurations, setQpDurations] = useState<Record<string, number>>({});

  useEffect(() => {
    if (view === 'analysis') {
      fetchData();
    }
  }, [currentDistrict, year, view]);

  const fetchData = async () => {
    if (!currentDistrict) return;

    setLoading(true);
    try {
      // 1. Fetch Main Data (Cost Category Analysis)
      const { data: analysisData, error } = await supabase
        .from('cost_category_analysis')
        .select('*')
        .eq('district_id', currentDistrict)
        .eq('time_period', year)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // 2. Fetch CCN Rates
      const { data: ccnData } = await supabase
        .from('ccn_dependency')
        .select('category, cost_per_hour');

      const rates: Record<string, number> = {};
      if (ccnData) {
        ccnData.forEach((d: any) => {
          rates[d.category] = Number(d.cost_per_hour);
        });
      }
      if (ccnData) {
        const uniqueCategories = Array.from(new Set(ccnData.map((c: any) => c.category))) as string[];
        setAvailableCategories(uniqueCategories.sort());
      }
      setCcnRates(rates);

      // 3. Fetch QP NOS Durations
      const { data: qpData } = await supabase
        .from('qp_nos_duration')
        .select('course_name, total_duration_hours');

      const durations: Record<string, number> = {};
      if (qpData) {
        qpData.forEach((d: any) => {
          durations[d.course_name] = Number(d.total_duration_hours);
        });
      }
      setQpDurations(durations);

      // 4. Fetch Sectors
      const { data: sectors } = await supabase
        .from('sectorwise_analysis')
        .select('sector_name')
        .eq('district_id', currentDistrict)
        .eq('time_period', year);

      if (sectors) {
        const uniqueSectors = Array.from(new Set(sectors.map((s: any) => s.sector_name))) as string[];
        setAvailableSectors(uniqueSectors.sort());
      }

      // Map data
      if (analysisData) {
        setData(analysisData.map((d: any) => ({
          ...d,
          trained: Number(d.trained),
          placed: Number(d.placed),
          avg_salary: Number(d.avg_salary),
        })));
      } else {
        setData([]);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Calculations ---
  const getCalculations = (row: CostTrainingRow) => {
    // 1. Duration: Try official lookup, else parse row.total_duration
    let duration = qpDurations[row.course_name];
    if (!duration) {
      const parsed = parseFloat(row.total_duration);
      duration = isNaN(parsed) ? 0 : parsed;
    }

    // 2. Rate
    const rate = ccnRates[row.cost_category] || 0;

    // 3. Cost per Candidate
    const costPerCandidate = rate * duration;

    // 4. Due to Training Partners
    const dueToPartners = costPerCandidate * row.trained;

    // 5. Estimated OH Costs (10.5%)
    const ohCosts = dueToPartners * 0.105;

    // 6. Total Cost
    const totalCost = dueToPartners + ohCosts;

    // 7. Cost per Placed Candidate
    const costPerPlaced = row.placed > 0 ? (totalCost / row.placed) : 0;

    // 8. Ratio (Cost per Placed / Cost per Candidate)
    const ratio = costPerCandidate > 0 ? (costPerPlaced / costPerCandidate) : 0;

    // 9. Payback Period
    const payback = row.avg_salary > 0 ? ((costPerCandidate * 1.105) / row.avg_salary) : 0;

    return {
      duration,
      rate,
      costPerCandidate,
      dueToPartners,
      ohCosts,
      totalCost,
      costPerPlaced,
      ratio,
      payback
    };
  };

  const calculateTotals = () => {
    return data.reduce((acc, row) => {
      const calcs = getCalculations(row);
      return {
        trained: acc.trained + row.trained,
        placed: acc.placed + row.placed,
        dueToPartners: acc.dueToPartners + calcs.dueToPartners,
        ohCosts: acc.ohCosts + calcs.ohCosts,
        totalCost: acc.totalCost + calcs.totalCost,
      };
    }, { trained: 0, placed: 0, dueToPartners: 0, ohCosts: 0, totalCost: 0 });
  };

  const totals = calculateTotals();

  // Dropdown Options
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Form State
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [newEntry, setNewEntry] = useState<CostTrainingRow>({
    sector_name: '',
    course_name: '',
    total_duration: '',
    cost_category: '',
    trained: 0,
    placed: 0,
    avg_salary: 0
  });

  // Handle Form Inputs
  const handleFormChange = (field: keyof CostTrainingRow, value: string | number) => {
    setNewEntry(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-fill duration if course selected
      if (field === 'course_name') {
        const dur = qpDurations[value as string];
        if (dur) updated.total_duration = dur.toString();
      }
      return updated;
    });
  };

  const handleSaveEntry = async () => {
    if (!newEntry.sector_name || !newEntry.course_name || !newEntry.cost_category) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        district_id: currentDistrict,
        time_period: year,
        sector_name: newEntry.sector_name,
        course_name: newEntry.course_name,
        total_duration: newEntry.total_duration,
        cost_category: newEntry.cost_category,
        trained: newEntry.trained,
        placed: newEntry.placed,
        avg_salary: newEntry.avg_salary
      };

      const { error } = await supabase
        .from('cost_category_analysis')
        .upsert(payload, { onConflict: 'district_id, time_period, sector_name, course_name, cost_category' });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Entry saved successfully!' });
      setNewEntry({
        sector_name: '',
        course_name: '',
        total_duration: '',
        cost_category: '',
        trained: 0,
        placed: 0,
        avg_salary: 0
      });
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to save: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Live Calculations for New Entry
  const previewCalcs = getCalculations(newEntry);


  // Export CSV with calculations
  const handleExportCSV = () => {
    const csvData = data.map((row, index) => {
      const calcs = getCalculations(row);
      return {
        'S.No': index + 1,
        'Sector': row.sector_name,
        'Course/QP NOS': row.course_name,
        'Total Duration (hrs)': calcs.duration,
        'Cost Category': row.cost_category,
        'Trained': row.trained,
        'Placed': row.placed,
        'Avg Salary pm': row.avg_salary,
        'Cost per Candidate': calcs.costPerCandidate.toFixed(2),
        'Due to Training Partners': calcs.dueToPartners.toFixed(2),
        'Estimated OH Costs (10.5%)': calcs.ohCosts.toFixed(2),
        'Total Cost': calcs.totalCost.toFixed(2),
        'Cost per Placed Candidate': calcs.costPerPlaced.toFixed(2),
        'Ratio': calcs.ratio.toFixed(2),
        'Payback period pm': calcs.payback.toFixed(2)
      }
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cost_Of_Training_Analysis_${currentDistrict}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === 'config') {
    return <QPNOSDurationManager onBack={() => setView('analysis')} />;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Cost of Training Analysis</h2>
          <p className="text-sm text-gray-500">Financial analysis based on trainee data and standardized rates.</p>
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

          <button
            onClick={() => setView('config')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            title="Manage QP NOS Durations"
          >
            <Settings className="w-4 h-4" />
            QP Durations
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Analysis
          </button>
        </div>
      </div>

      {showVisuals && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {(() => {
            // Prepare Chart Data Grouped by Sector
            const sectorMap = data.reduce((acc, row) => {
              const calcs = getCalculations(row);
              if (!acc[row.sector_name]) {
                acc[row.sector_name] = { name: row.sector_name, total_cost: 0, total_trained: 0, total_placed: 0 };
              }
              acc[row.sector_name].total_cost += calcs.totalCost;
              acc[row.sector_name].total_trained += row.trained;
              acc[row.sector_name].total_placed += row.placed;
              return acc;
            }, {} as Record<string, any>);

            const chartData = Object.values(sectorMap).sort((a, b) => b.total_cost - a.total_cost).slice(0, 10);

            return (
              <>
                <AnalysisVisuals
                  title="Total Training Cost by Sector (Top 10)"
                  data={chartData}
                  visualsType="bar"
                  xAxisKey="name"
                  barKeys={[
                    { key: 'total_cost', name: 'Total Cost (₹)', color: '#0ea5e9', }
                  ]}
                />
                <AnalysisVisuals
                  title="Trained vs Placed by Sector (Top 10 by Cost)"
                  data={chartData}
                  visualsType="bar"
                  xAxisKey="name"
                  barKeys={[
                    { key: 'total_trained', name: 'Trained', color: '#8b5cf6' },
                    { key: 'total_placed', name: 'Placed', color: '#10b981' }
                  ]}
                />
              </>
            );
          })()}
        </div>
      )}

      {/* New Entry Form & Live Preview */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Add Entry & Verify Formula</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sector</label>
              <input type="text" list="sectors" value={newEntry.sector_name} onChange={e => handleFormChange('sector_name', e.target.value)} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="Select Sector" />
              <datalist id="sectors">{availableSectors.map(s => <option key={s} value={s} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / QP NOS</label>
              <input type="text" list="courses" value={newEntry.course_name} onChange={e => handleFormChange('course_name', e.target.value)} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="Enter Course" />
              <datalist id="courses">{Object.keys(qpDurations).map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cost Category</label>
              <input type="text" list="categories" value={newEntry.cost_category} onChange={e => handleFormChange('cost_category', e.target.value)} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="Category" />
              <datalist id="categories">{availableCategories.map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Total Duration</label>
              <input type="text" value={newEntry.total_duration} onChange={e => handleFormChange('total_duration', e.target.value)} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="Duration (Hrs)" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trained</label>
              <input type="number" min="0" value={newEntry.trained || ''} onChange={e => handleFormChange('trained', Number(e.target.value))} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Placed</label>
              <input type="number" min="0" value={newEntry.placed || ''} onChange={e => handleFormChange('placed', Number(e.target.value))} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Avg Salary</label>
              <input type="number" min="0" value={newEntry.avg_salary || ''} onChange={e => handleFormChange('avg_salary', Number(e.target.value))} className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 placeholder:text-gray-400" placeholder="0" />
            </div>
          </div>
          <button onClick={handleSaveEntry} disabled={saving} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full font-medium shadow-sm disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Entry to Database
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 flex flex-col justify-center shadow-sm">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2 flex items-center justify-between">
            Live Preview
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Auto-Calculated</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700">Cost / Candidate:</span>
              <span className="font-bold text-blue-900">₹{previewCalcs.costPerCandidate.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-white/50 px-3 py-2 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center text-xs text-blue-600 mb-1">
                <span>Base Rate (CCN):</span>
                <span className="font-medium">₹{previewCalcs.rate}/hr</span>
              </div>
              <div className="flex justify-between items-center text-xs text-blue-600">
                <span>Duration:</span>
                <span className="font-medium">{previewCalcs.duration} hrs</span>
              </div>
            </div>
            <div className="border-t border-blue-200 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-700">Due to Partners:</span>
                <span className="font-bold text-blue-900">₹{previewCalcs.dueToPartners.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-700">Overhead (10.5%):</span>
                <span className="font-bold text-blue-900">₹{previewCalcs.ohCosts.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-lg pt-3 border-t-2 border-blue-200 mt-2">
              <span className="font-bold text-blue-800">Total Cost:</span>
              <span className="font-extrabold text-blue-900">₹{previewCalcs.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'} animate-in fade-in duration-300`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium">{message.text}</span>
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
                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 sticky left-0 bg-gray-50 z-10 w-12">S.No</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[150px]">Sector</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 min-w-[200px]">Course/ QP NOS</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 w-24">Total Duration (hrs)</th>
                <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 w-24">Cost Category</th>

                <th colSpan={3} className="px-4 py-2 border-r border-gray-200 bg-gray-100">Number of Trainees in LY</th>
                <th colSpan={7} className="px-4 py-2 bg-blue-50">Financial Analysis</th>
              </tr>
              <tr>
                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 w-20">Trained</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 w-20">Placed</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-gray-100 w-24">Avg Salary pm</th>

                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 w-28">Cost per Candidate</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 w-28">Due to Training Partners</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 w-28">Est. OH Costs @ 10.5%</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 w-28">Total Cost</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 w-28">Cost per Placed Candidate</th>
                <th className="px-2 py-2 border-r border-gray-200 bg-blue-50 w-20">Ratio</th>
                <th className="px-2 py-2 bg-blue-50 w-24">Payback period pm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, index) => {
                const calcs = getCalculations(row);
                const hasRate = calcs.rate > 0;
                return (
                  <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-500 border-r border-gray-200 sticky left-0 bg-white z-10 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-800">{row.sector_name}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-800">{row.course_name}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{calcs.duration}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">
                      {row.cost_category}
                      {!hasRate && row.cost_category && <span className="ml-2 text-[10px] text-red-500">(No Rate)</span>}
                    </td>

                    <td className="px-4 py-3 border-r border-gray-200 text-center bg-gray-50/50">{row.trained}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center bg-gray-50/50">{row.placed}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right bg-gray-50/50">₹{row.avg_salary.toLocaleString()}</td>

                    <td className="px-4 py-3 border-r border-gray-200 text-right font-medium">₹{calcs.costPerCandidate.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right">₹{calcs.dueToPartners.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right text-gray-600">₹{calcs.ohCosts.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right font-bold text-gray-900">₹{calcs.totalCost.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-right">
                      {isFinite(calcs.costPerPlaced) ? `₹${calcs.costPerPlaced.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">
                      {isFinite(calcs.ratio) ? calcs.ratio.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-blue-600">
                      {isFinite(calcs.payback) ? `${calcs.payback.toFixed(1)}m` : '-'}
                    </td>
                  </tr>
                );
              })}
              {data.length > 0 && (
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td colSpan={5} className="px-4 py-3 text-right sticky left-0 bg-slate-100">Total</td>
                  <td className="px-4 py-3 text-center">{totals.trained}</td>
                  <td className="px-4 py-3 text-center">{totals.placed}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right">₹{totals.dueToPartners.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{totals.ohCosts.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{totals.totalCost.toLocaleString()}</td>
                  <td colSpan={3}></td>
                </tr>
              )}
              {data.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center text-gray-500 italic">
                    No data found for this period. Please populate "Cost Category Analysis" first.
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

