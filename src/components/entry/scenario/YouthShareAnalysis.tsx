import React, { useState, useEffect } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import Papa from 'papaparse';

interface ShareRow {
    category: string;
    total: string;
    rural: string;
    urban: string;
}

export const YouthShareAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [shares, setShares] = useState<ShareRow[]>([]);

    useEffect(() => {
        if (currentDistrict) calculateShares();
    }, [currentDistrict]);

    const calculateShares = async () => {
        setLoading(true);
        try {
            // Fetch ALL population data
            const { data } = await supabase
                .from('scenario_population_data')
                .select('*')
                .eq('district_id', currentDistrict)
                .in('group_name', ['Population', 'Male', 'Female']); // Fetching all youth rows

            if (!data) return;

            // Helper to get sum of a column for a specific source and group
            const getSum = (source: 'census_2011' | 'alternate', col: string) => {
                const relevantRows = data.filter(d =>
                    d.source_type === source &&
                    d.group_name === 'Population' && // We only care about Total Population rows for the Denominator, and SC/ST rows (which are in separate columns)
                    ['16-20 Years', '21-25 Years', '26-30 Years', '30-34 Years'].includes(d.row_label)
                );

                // If checking Alternate, and NO alternate rows exist, return null to signal fallback
                if (source === 'alternate' && relevantRows.length === 0) return null;

                // If rows exist but sum is 0? The logic says "IF Alternate Data is Empty". 
                // We'll treat "Empty" as "Sum of Alternate Total Population for Youth is 0 or null".

                const sum = relevantRows.reduce((acc, curr) => acc + (parseFloat(curr[col] || '0') || 0), 0);
                return sum;
            };

            // Logic:
            // Calculate CS (Census Sum) and AS (Alternate Sum)
            // If AS exists and is > 0, use AS. Else use CS.

            // We need 4 main values for each (Total, Rural, Urban):
            // 1. Total Population Youth (Denominator)
            // 2. SC Youth (Numerator 1)
            // 3. ST Youth (Numerator 2)

            const calculatePercentage = (
                numCol: 'sc_total' | 'sc_rural' | 'sc_urban' | 'st_total' | 'st_rural' | 'st_urban',
                denomCol: 'total_total' | 'total_rural' | 'total_urban'
            ) => {
                // Try Alternate first
                const altNum = getSum('alternate', numCol);
                const altDenom = getSum('alternate', denomCol);

                // Check if Alternate is valid (Denominator > 0 is a good proxy for "Data Exists")
                if (altDenom !== null && altDenom > 0) {
                    return ((altNum || 0) / altDenom * 100).toFixed(2) + '%';
                }

                // Fallback to Census
                const censusNum = getSum('census_2011', numCol);
                const censusDenom = getSum('census_2011', denomCol);

                if (censusDenom && censusDenom > 0) {
                    return ((censusNum || 0) / censusDenom * 100).toFixed(2) + '%';
                }

                return '0.00%';
            };

            const newShares: ShareRow[] = [
                {
                    category: 'SC share of Youth Population',
                    total: calculatePercentage('sc_total', 'total_total'),
                    rural: calculatePercentage('sc_rural', 'total_rural'),
                    urban: calculatePercentage('sc_urban', 'total_urban')
                },
                {
                    category: 'ST share of Youth Population',
                    total: calculatePercentage('st_total', 'total_total'),
                    rural: calculatePercentage('st_rural', 'total_rural'),
                    urban: calculatePercentage('st_urban', 'total_urban')
                }
            ];

            setShares(newShares);

        } catch (error) {
            console.error('Error calculating shares:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const csv = Papa.unparse(shares);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Youth_Share_Analysis_${currentDistrict}.csv`;
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Share of Youth Population</h2>
                    <p className="text-sm text-gray-500">Calculated shares based on Census 2011 or Alternate data.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={calculateShares} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left border-r">Category</th>
                            <th className="px-6 py-4 border-r">Total</th>
                            <th className="px-6 py-4 border-r">Rural</th>
                            <th className="px-6 py-4">Urban</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {shares.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-left font-medium text-gray-900 border-r">{row.category}</td>
                                <td className="px-6 py-4 text-blue-600 font-bold border-r bg-blue-50/10">{row.total}</td>
                                <td className="px-6 py-4 border-r">{row.rural}</td>
                                <td className="px-6 py-4">{row.urban}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                <strong>Note:</strong> Calculations automatically switch to use "Alternate" data if it is populated. Otherwise, Census 2011 data is used.
            </div>
        </div>
    );
};
