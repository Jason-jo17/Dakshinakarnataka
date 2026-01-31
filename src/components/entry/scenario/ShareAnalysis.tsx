import React, { useState, useEffect } from 'react';
import { Save, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface ShareData {
    parameter: 'ST' | 'Women' | 'SC';
    trainee_share_actual: string; // Formatting as percentage string
    placement_share_actual: string;
    trainee_share_scenario: string; // Editable
    placement_share_scenario: string; // Editable
}



export const ShareAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ShareData[]>([
        { parameter: 'ST', trainee_share_actual: '-', placement_share_actual: '-', trainee_share_scenario: '', placement_share_scenario: '' },
        { parameter: 'Women', trainee_share_actual: '-', placement_share_actual: '-', trainee_share_scenario: '', placement_share_scenario: '' }
    ]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentDistrict) {
            fetchData();
        }
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Actual Data from social_category_analysis
            const { data: socialData, error: socialError } = await supabase
                .from('social_category_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (socialError) throw socialError;

            // Calculate Totals and Specifics
            // Aggregating across all time_periods if multiple exist? 
            // Usually we want the latest or a specific year. For now, let's sum EVERYTHING for the district to get a "Total Historical Share" 
            // or we could filter for the current year. Given the previous component defaulted to current year, let's try to sum checks.
            // Actually, best to sum everything to get a general share analysis if no year filter is provided.

            let totalMaleTrained = 0;
            let totalFemaleTrained = 0;
            let totalMalePlaced = 0;
            let totalFemalePlaced = 0;

            let stMaleTrained = 0;
            let stFemaleTrained = 0;
            let stMalePlaced = 0;
            let stFemalePlaced = 0;

            if (socialData) {
                socialData.forEach((row: any) => {
                    const mt = Number(row.male_trained) || 0;
                    const ft = Number(row.female_trained) || 0;
                    const mp = Number(row.male_placed) || 0;
                    const fp = Number(row.female_placed) || 0;

                    totalMaleTrained += mt;
                    totalFemaleTrained += ft;
                    totalMalePlaced += mp;
                    totalFemalePlaced += fp;

                    if (row.category === 'ST') {
                        stMaleTrained += mt;
                        stFemaleTrained += ft;
                        stMalePlaced += mp;
                        stFemalePlaced += fp;
                    }
                });
            }

            const totalTrained = totalMaleTrained + totalFemaleTrained;
            const totalPlaced = totalMalePlaced + totalFemalePlaced;

            // Formula 1: ST Share
            // Trainee Share (ST) = (ST Male Trained + ST Female Trained) / (Total Male Trained + Total Female Trained)
            const stTrainedShare = totalTrained > 0 ? ((stMaleTrained + stFemaleTrained) / totalTrained * 100).toFixed(2) : '0.00';
            const stPlacedShare = totalPlaced > 0 ? ((stMalePlaced + stFemalePlaced) / totalPlaced * 100).toFixed(2) : '0.00';

            // Formula 2: Women Share
            // Trainee Share (Women) = Total Female Trained / (Total Male Trained + Total Female Trained)
            const womenTrainedShare = totalTrained > 0 ? (totalFemaleTrained / totalTrained * 100).toFixed(2) : '0.00';
            const womenPlacedShare = totalPlaced > 0 ? (totalFemalePlaced / totalPlaced * 100).toFixed(2) : '0.00';

            // Formula 3: SC Share (Added to match verified screenshot requirements)
            let scMaleTrained = 0; let scFemaleTrained = 0; let scMalePlaced = 0; let scFemalePlaced = 0;
            if (socialData) {
                socialData.forEach((row: any) => {
                    const mt = Number(row.male_trained) || 0;
                    const ft = Number(row.female_trained) || 0;
                    const mp = Number(row.male_placed) || 0;
                    const fp = Number(row.female_placed) || 0;
                    if (row.category === 'SC') {
                        scMaleTrained += mt; scFemaleTrained += ft; scMalePlaced += mp; scFemalePlaced += fp;
                    }
                });
            }
            const scTrainedShare = totalTrained > 0 ? ((scMaleTrained + scFemaleTrained) / totalTrained * 100).toFixed(2) : '0.00';
            const scPlacedShare = totalPlaced > 0 ? ((scMalePlaced + scFemalePlaced) / totalPlaced * 100).toFixed(2) : '0.00';


            // 2. Fetch Scenario Data
            const { data: scenarioData, error: scenarioError } = await supabase
                .from('scenario_share_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (scenarioError) throw scenarioError;

            const stScenario = scenarioData?.find(d => d.parameter === 'ST');
            const womenScenario = scenarioData?.find(d => d.parameter === 'Women');
            const scScenario = scenarioData?.find(d => d.parameter === 'SC');

            setRows([
                {
                    parameter: 'SC',
                    trainee_share_actual: scTrainedShare,
                    placement_share_actual: scPlacedShare,
                    trainee_share_scenario: scScenario?.trainee_share?.toString() || scTrainedShare,
                    placement_share_scenario: scScenario?.placement_share?.toString() || scPlacedShare
                },
                {
                    parameter: 'ST',
                    trainee_share_actual: stTrainedShare,
                    placement_share_actual: stPlacedShare,
                    trainee_share_scenario: stScenario?.trainee_share?.toString() || stTrainedShare,
                    placement_share_scenario: stScenario?.placement_share?.toString() || stPlacedShare
                },
                {
                    parameter: 'Women',
                    trainee_share_actual: womenTrainedShare,
                    placement_share_actual: womenPlacedShare,
                    trainee_share_scenario: womenScenario?.trainee_share?.toString() || womenTrainedShare,
                    placement_share_scenario: womenScenario?.placement_share?.toString() || womenPlacedShare
                }
            ]);

        } catch (error: any) {
            console.error('Error fetching data:', error);
            setMessage({ type: 'error', text: 'Failed to load data: ' + error.message });
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
                parameter: r.parameter,
                trainee_share: parseFloat(r.trainee_share_scenario) || 0,
                placement_share: parseFloat(r.placement_share_scenario) || 0,
                updated_at: new Date()
            }));

            const { error } = await supabase
                .from('scenario_share_analysis')
                .upsert(payload, { onConflict: 'district_id, parameter' });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Scenario shares saved successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error saving: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleScenarioChange = (param: 'ST' | 'Women' | 'SC', field: 'trainee_share_scenario' | 'placement_share_scenario', value: string) => {
        setRows(prev => prev.map(row => {
            if (row.parameter === param) {
                return { ...row, [field]: value };
            }
            return row;
        }));
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

                data.forEach((row: any) => {
                    // Match by Parameter
                    const param = row['Parameter'] || row['parameter'];
                    if (param === 'ST' || param === 'Women') {
                        const idx = newRows.findIndex(r => r.parameter === param);
                        if (idx !== -1) {
                            newRows[idx] = {
                                ...newRows[idx],
                                trainee_share_scenario: row['Trainee Share (%)'] || row['trainee_share'] || newRows[idx].trainee_share_scenario,
                                placement_share_scenario: row['Placement Share (%)'] || row['placement_share'] || newRows[idx].placement_share_scenario
                            };
                            updated = true;
                        }
                    }
                });

                if (updated) {
                    setRows(newRows);
                    setMessage({ type: 'success', text: 'CSV imported! Review and click Save.' });
                } else {
                    setMessage({ type: 'error', text: 'No matching data found in CSV.' });
                }
            },
            header: true,
            skipEmptyLines: true
        });
    };

    const handleExport = () => {
        const csv = Papa.unparse(rows.map(r => ({
            'Parameter': r.parameter,
            'Actual Trainee Share (%)': r.trainee_share_actual,
            'Trainee Share (%)': r.trainee_share_scenario,
            'Actual Placement Share (%)': r.placement_share_actual,
            'Placement Share (%)': r.placement_share_scenario
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Share_Analysis_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Share Analysis (ST & Women)</h2>
                    <p className="text-sm text-gray-500">Compare actual participation shares with scenario targets.</p>
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
                            <th className="px-6 py-4 text-left border-r">Parameter</th>
                            <th className="px-6 py-4 border-r bg-gray-50 text-gray-500">Actual Trainee Share</th>
                            <th className="px-6 py-4 border-r bg-blue-50 text-blue-800">Scenario Trainee Share (%)</th>
                            <th className="px-6 py-4 border-r bg-gray-50 text-gray-500">Actual Placement Share</th>
                            <th className="px-6 py-4 bg-green-50 text-green-800">Scenario Placement Share (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row) => (
                            <tr key={row.parameter} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-left font-bold text-gray-900 border-r">{row.parameter} Share</td>
                                <td className="px-6 py-4 border-r text-gray-500">{row.trainee_share_actual}%</td>
                                <td className="px-2 py-2 border-r bg-blue-50/30">
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 text-center border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={row.trainee_share_scenario}
                                        onChange={(e) => handleScenarioChange(row.parameter, 'trainee_share_scenario', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="px-6 py-4 border-r text-gray-500">{row.placement_share_actual}%</td>
                                <td className="px-2 py-2 bg-green-50/30">
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 text-center border border-green-200 rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                        value={row.placement_share_scenario}
                                        onChange={(e) => handleScenarioChange(row.parameter, 'placement_share_scenario', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm border border-yellow-200">
                <h4 className="font-bold mb-1">Calculation Logic (Actuals)</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>ST Share:</strong> (ST Male + ST Female) / (Total Male + Total Female)</li>
                    <li><strong>Women Share:</strong> Total Female / (Total Male + Total Female)</li>
                </ul>
                <p className="mt-2 text-xs text-yellow-700">Actuals are derived from the Social Category Analysis module.</p>
            </div>
        </div>
    );
};
