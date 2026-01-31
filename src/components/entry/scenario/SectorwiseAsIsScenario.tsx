import React, { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface SectorRow {
    sector_name: string;
    female_trained: number;
    male_trained: number;
}

export const SectorwiseAsIsScenario: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<SectorRow[]>([]);

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
                const map = new Map<string, SectorRow>();
                
                data.forEach((item: any) => {
                    const sector = item.sector_name || 'Unknown';
                    const current = map.get(sector) || { 
                        sector_name: sector, 
                        female_trained: 0,
                        male_trained: 0
                    };
                    
                    map.set(sector, {
                        sector_name: sector,
                        female_trained: current.female_trained + (Number(item.female_trained) || 0),
                        male_trained: current.male_trained + (Number(item.male_trained) || 0)
                    });
                });
                
                // Sort by total trainees descending
                const sortedRows = Array.from(map.values()).sort((a, b) => {
                    const totalA = a.female_trained + a.male_trained;
                    const totalB = b.female_trained + b.male_trained;
                    return totalB - totalA;
                });
                
                setRows(sortedRows);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csvData = rows.map((r, index) => ({
            'S.No': index + 1,
            'Sector': r.sector_name,
            'Female': r.female_trained,
            'Male': r.male_trained,
            'Total': r.female_trained + r.male_trained
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Sectorwise_As_Is_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Sectorwise As Is Scenario</h2>
                    <p className="text-sm text-gray-500">By Sector - Reference Data from Trainee Analysis</p>
                </div>
                 <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Refresh'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 border-r w-16">S.No</th>
                            <th className="px-6 py-4 text-left border-r">Sector</th>
                            <th className="px-6 py-4 border-r">Female</th>
                            <th className="px-6 py-4 border-r">Male</th>
                            <th className="px-6 py-4 bg-gray-200">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row, index) => {
                            const total = row.female_trained + row.male_trained;
                            return (
                                <tr key={row.sector_name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-r text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-left font-medium text-gray-900 border-r">{row.sector_name}</td>
                                    <td className="px-6 py-4 border-r">{row.female_trained}</td>
                                    <td className="px-6 py-4 border-r">{row.male_trained}</td>
                                    <td className="px-6 py-4 bg-gray-50 font-bold">{total}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
