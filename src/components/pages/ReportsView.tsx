import React from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

import { INSTITUTIONS } from '../../data/institutions';

const ReportsView: React.FC = () => {
    const handleDownload = () => {
        // Generate CSV Content
        const headers = ['Name', 'Category', 'Address', 'Taluk', 'District'].join(',');
        const rows = INSTITUTIONS.map(inst =>
            `"${inst.name}","${inst.category}","${inst.location.address}","${inst.location.taluk}","${inst.location.district}"`
        ).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + '\n' + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dk_institutions_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [reports, setReports] = React.useState([
        { title: 'Full Institutions Database (Live)', type: 'CSV', size: `${(INSTITUTIONS.length * 0.5).toFixed(1)} KB`, date: new Date().toLocaleDateString(), action: handleDownload },
        { title: 'District Skill Gap Analysis 2024', type: 'PDF', size: '2.4 MB', date: 'Dec 01, 2024' },
        { title: 'Engineering Placement Report Q3', type: 'Excel', size: '1.1 MB', date: 'Nov 15, 2024' },
        { title: 'ITI Infrastructure Audit', type: 'PDF', size: '5.6 MB', date: 'Oct 20, 2024' },
        { title: 'Startup Ecosystem Policy Draft', type: 'PDF', size: '1.2 MB', date: 'Sep 05, 2024' },
        { title: 'GCC Effectiveness Metrics', type: 'Excel', size: '890 KB', date: 'Aug 30, 2024' },
    ]);

    React.useEffect(() => {
        try {
            const savedStr = localStorage.getItem('generated_reports');
            if (savedStr) {
                const savedReports = JSON.parse(savedStr);
                if (Array.isArray(savedReports) && savedReports.length > 0) {
                    setReports(prev => {
                        // Deduplicate by title
                        const prevTitles = new Set(prev.map(p => p.title));
                        const newReports = savedReports.filter((r: any) => !prevTitles.has(r.title));
                        return [...newReports, ...prev];
                    });
                }
            }
        } catch (e) {
            console.error("Failed to load saved reports", e);
            // Optionally clear bad data
            // localStorage.removeItem('generated_reports');
        }
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Download detailed reports on district performance and surveys.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Report Name</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Type</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date Generated</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, idx) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{report.title}</p>
                                            <p className="text-xs text-slate-400">{report.size}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {report.type}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    {report.date}
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                        <Download size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsView;
