import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface PlacementRow {
    sector_name: string;
    female_trained: number;
    female_placed: number;
    female_salary: number;
    male_trained: number;
    male_placed: number;
    male_salary: number;
}

interface PlacementAsIsScenarioProps {
    title?: string;
}

export const PlacementAsIsScenario: React.FC<PlacementAsIsScenarioProps> = ({ title = "Placement As Is Scenario" }) => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<PlacementRow[]>([]);

    useEffect(() => {
        if (currentDistrict) fetchData();
    }, [currentDistrict]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('sectorwise_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            if (error) throw error;

            if (data) {
                // Aggregate by sector
                const map = new Map<string, PlacementRow>();

                data.forEach((item: any) => {
                    const sector = item.sector_name || 'Unknown';
                    const current = map.get(sector) || {
                        sector_name: sector,
                        female_trained: 0, female_placed: 0, female_salary: 0,
                        male_trained: 0, male_placed: 0, male_salary: 0
                    };

                    map.set(sector, {
                        sector_name: sector,
                        female_trained: current.female_trained + (Number(item.female_trained) || 0),
                        female_placed: current.female_placed + (Number(item.female_placed) || 0),
                        female_salary: Number(item.avg_salary_female) || current.female_salary,
                        male_trained: current.male_trained + (Number(item.male_trained) || 0),
                        male_placed: current.male_placed + (Number(item.male_placed) || 0),
                        male_salary: Number(item.avg_salary_male) || current.male_salary,
                    });
                });

                setRows(Array.from(map.values()));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csvData = rows.map(r => {
            const totalTrained = r.female_trained + r.male_trained;
            const totalPlaced = r.female_placed + r.male_placed;
            // Weighted avg salary for total
            const totalSalary = totalPlaced > 0
                ? Math.round(((r.female_salary * r.female_placed) + (r.male_salary * r.male_placed)) / totalPlaced)
                : 0;

            return {
                'Sector': r.sector_name,
                'Female Trained': r.female_trained,
                'Female Placed': r.female_placed,
                'Female Avg Salary': r.female_salary,
                'Male Trained': r.male_trained,
                'Male Placed': r.male_placed,
                'Male Avg Salary': r.male_salary,
                'Total Trained': totalTrained,
                'Total Placed': totalPlaced,
                'Total Avg Salary': totalSalary
            };
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Placement_As_Is_${currentDistrict}.csv`;
        link.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: async (results) => {
                const data = results.data as any[];
                console.log('Importing data:', data);
                alert("Importing into Actuals (Sectorwise Analysis) from this view is restricted. Please use the main Sectorwise Analysis module for data entry.");
            },
            header: true
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500">By Sector - Reference Data from Trainee Analysis</p>
                </div>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 cursor-pointer border border-green-200">
                        <Download className="w-4 h-4 rotate-180" /> Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                    </label>
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                            <th rowSpan={2} className="px-6 py-4 border-r w-16">S.No</th>
                            <th rowSpan={2} className="px-6 py-4 text-left border-r">Sector</th>
                            <th colSpan={3} className="px-6 py-2 border-r bg-gray-200">Female</th>
                            <th colSpan={3} className="px-6 py-2 border-r bg-gray-200">Male</th>
                            <th colSpan={3} className="px-6 py-2 bg-gray-300">Total</th>
                        </tr>
                        <tr>
                            <th className="px-4 py-2 border-r bg-gray-100">Trained</th>
                            <th className="px-4 py-2 border-r bg-gray-100">Placed</th>
                            <th className="px-4 py-2 border-r bg-gray-100">Avg Salary</th>
                            <th className="px-4 py-2 border-r bg-gray-100">Trained</th>
                            <th className="px-4 py-2 border-r bg-gray-100">Placed</th>
                            <th className="px-4 py-2 border-r bg-gray-100">Avg Salary</th>
                            <th className="px-4 py-2 border-r bg-gray-200">Trained</th>
                            <th className="px-4 py-2 border-r bg-gray-200">Placed</th>
                            <th className="px-4 py-2 bg-gray-200">Avg Salary</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row, index) => {
                            const totalTrained = row.female_trained + row.male_trained;
                            const totalPlaced = row.female_placed + row.male_placed;
                            const totalSalary = totalPlaced > 0
                                ? Math.round(((row.female_salary * row.female_placed) + (row.male_salary * row.male_placed)) / totalPlaced)
                                : 0;
                            return (
                                <tr key={row.sector_name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-r text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-left font-medium text-gray-900 border-r">{row.sector_name}</td>

                                    <td className="px-4 py-4 border-r">{row.female_trained}</td>
                                    <td className="px-4 py-4 border-r">{row.female_placed}</td>
                                    <td className="px-4 py-4 border-r">{row.female_salary}</td>

                                    <td className="px-4 py-4 border-r">{row.male_trained}</td>
                                    <td className="px-4 py-4 border-r">{row.male_placed}</td>
                                    <td className="px-4 py-4 border-r">{row.male_salary}</td>

                                    <td className="px-4 py-4 border-r bg-gray-50 font-bold">{totalTrained}</td>
                                    <td className="px-4 py-4 border-r bg-gray-50 font-bold">{totalPlaced}</td>
                                    <td className="px-4 py-4 bg-gray-50 font-bold">{totalSalary}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                                    No sector data found in Trainee Analysis.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
