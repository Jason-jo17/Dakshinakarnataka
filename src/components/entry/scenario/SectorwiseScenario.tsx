import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface SectorScenarioRow {
    sector_name: string;
    actual_female: number;
    actual_male: number;
    scenario_female: string; // String for input editing
    scenario_male: string;   // String for input editing
}

export const SectorwiseScenario: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<SectorScenarioRow[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Actuals from sectorwise_analysis (Trainee Data Analysis)
            // We need to aggregate if there are multiple years, or just take the latest? 
            // The prompt implies "As Is", usually meaning current state. 
            // We will sum up all records for the district to be safe, or we could filter by year if we had a year selector.
            // For now, let's sum by sector_name.
            const { data: actualsData, error: actualsError } = await supabase
                .from('sectorwise_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (actualsError) throw actualsError;

            // Aggregate Actuals
            const actualsMap = new Map<string, { female: number, male: number }>();

            if (actualsData) {
                actualsData.forEach((item: any) => {
                    const name = item.sector_name;
                    if (!name) return;
                    const current = actualsMap.get(name) || { female: 0, male: 0 };
                    actualsMap.set(name, {
                        female: current.female + (Number(item.female_trained) || 0),
                        male: current.male + (Number(item.male_trained) || 0)
                    });
                });
            }

            // 2. Fetch Scenarios
            const { data: scenarioData, error: scenarioError } = await supabase
                .from('scenario_sectorwise_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (scenarioError) throw scenarioError;

            const scenarioMap = new Map<string, { female: number, male: number }>();
            if (scenarioData) {
                scenarioData.forEach((item: any) => {
                    scenarioMap.set(item.sector_name, {
                        female: Number(item.female_val),
                        male: Number(item.male_val)
                    });
                });
            }

            // 3. Merge and Build Rows
            // We want to show ALL sectors found in Actuals, PLUS any that might only exist in Scenario (unlikely but possible).
            // Let's iterate Actuals first.
            const uniqueSectors = new Set([...actualsMap.keys(), ...scenarioMap.keys()]);
            const newRows: SectorScenarioRow[] = [];

            uniqueSectors.forEach(sector => {
                const actual = actualsMap.get(sector) || { female: 0, male: 0 };
                const scenario = scenarioMap.get(sector);

                // Default Scenario to Actual if not present
                newRows.push({
                    sector_name: sector,
                    actual_female: actual.female,
                    actual_male: actual.male,
                    scenario_female: scenario ? scenario.female.toString() : actual.female.toString(),
                    scenario_male: scenario ? scenario.male.toString() : actual.male.toString()
                });
            });

            // 4. Sort by Total Trainees (Scenario) Descending as per instruction "largest to smallest"
            newRows.sort((a, b) => {
                const totalA = (Number(a.scenario_female) || 0) + (Number(a.scenario_male) || 0);
                const totalB = (Number(b.scenario_female) || 0) + (Number(b.scenario_male) || 0);
                return totalB - totalA;
            });

            setRows(newRows);

        } catch (error: any) {
            console.error('Error fetching data:', error);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const payload = rows.map(r => ({
                district_id: currentDistrict,
                sector_name: r.sector_name,
                female_val: Number(r.scenario_female) || 0,
                male_val: Number(r.scenario_male) || 0,
                updated_at: new Date()
            }));

            const { error } = await supabase
                .from('scenario_sectorwise_analysis')
                .upsert(payload, { onConflict: 'district_id, sector_name' });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Scenarios saved successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index: number, field: 'scenario_female' | 'scenario_male', value: string) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: (results) => {
                const data = results.data as any[];
                if (!data) return;

                const newRows = [...rows];
                let updated = false;

                data.forEach((item: any) => {
                    const sector = item['Sector'];
                    if (sector) {
                        const idx = newRows.findIndex(r => r.sector_name.toLowerCase() === sector.toLowerCase());
                        const sFemale = item['Scenario Female'] || item['Female'];
                        const sMale = item['Scenario Male'] || item['Male'];

                        if (idx !== -1) {
                            // Update
                            if (sFemale !== undefined) newRows[idx].scenario_female = sFemale;
                            if (sMale !== undefined) newRows[idx].scenario_male = sMale;
                            updated = true;
                        } else {
                            // Add new if not exists (optional, but good for completeness)
                            newRows.push({
                                sector_name: sector,
                                actual_female: 0,
                                actual_male: 0,
                                scenario_female: sFemale || '0',
                                scenario_male: sMale || '0'
                            });
                            updated = true;
                        }
                    }
                });

                if (updated) {
                    setRows(newRows);
                    setMessage({ type: 'success', text: 'CSV imported. Review and Save.' });
                } else {
                    setMessage({ type: 'error', text: 'No matching sectors found.' });
                }
            },
            header: true,
            skipEmptyLines: true
        });
    };

    const handleExport = () => {
        const csv = Papa.unparse(rows.map(r => ({
            'Sector': r.sector_name,
            'Actual Female': r.actual_female,
            'Actual Male': r.actual_male,
            'Scenario Female': r.scenario_female,
            'Scenario Male': r.scenario_male,
            'Total Scenario': (Number(r.scenario_female) || 0) + (Number(r.scenario_male) || 0)
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Sectorwise_Scenario_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Sectorwise As Is Scenario</h2>
                    <p className="text-sm text-gray-500">Edit trainee numbers by sector for scenario planning.</p>
                </div>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 cursor-pointer border border-green-200">
                        <Download className="w-4 h-4 rotate-180" /> Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                    </label>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                            <th rowSpan={2} className="px-6 py-4 border-r w-16">S.No</th>
                            <th rowSpan={2} className="px-6 py-4 text-left border-r">Sector</th>
                            <th colSpan={3} className="px-6 py-2 bg-blue-50 text-blue-800">Scenario (Editable)</th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 border-r bg-blue-50 text-xs">Female</th>
                            <th className="px-4 py-2 border-r bg-blue-50 text-xs">Male</th>
                            <th className="px-4 py-2 bg-blue-50 text-xs font-bold">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row, index) => {
                            const scenarioTotal = (Number(row.scenario_female) || 0) + (Number(row.scenario_male) || 0);
                            return (
                                <tr key={row.sector_name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-r text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-left font-medium text-gray-900 border-r">{row.sector_name}</td>

                                    {/* Scenario */}
                                    <td className="px-2 py-2 border-r bg-blue-50/10">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1 text-center border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={row.scenario_female}
                                            onChange={(e) => handleChange(index, 'scenario_female', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-2 py-2 border-r bg-blue-50/10">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1 text-center border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={row.scenario_male}
                                            onChange={(e) => handleChange(index, 'scenario_male', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-4 font-bold text-blue-700 bg-blue-50/20">{scenarioTotal}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No sector data found. Please ensure data is entered in the Trainee Data Analysis module.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
