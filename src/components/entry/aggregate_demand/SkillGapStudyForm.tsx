import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export default function SkillGapStudyForm() {
  const [metadata, setMetadata] = useState({
    monthYear: '',
    sampleSize: '',
    duration: '',
    studyBy: ''
  });

  const [scope, setScope] = useState({
    govAgenda: false,
    agri: false,
    gpdp: false,
    newInd: false,
    selfEmp: false
  });

  // Qualitative fields if scope is NO
  const [qualitative, setQualitative] = useState({
    govAgenda: '',
    agri: '',
    gpdp: '',
    newInd: '',
    selfEmp: ''
  });

  const [rows, setRows] = useState([
    { id: 1, sector: '', role: '', requirement: '' },
    { id: 2, sector: '', role: '', requirement: '' },
    { id: 3, sector: '', role: '', requirement: '' },
    { id: 4, sector: '', role: '', requirement: '' },
    { id: 5, sector: '', role: '', requirement: '' },
  ]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleScopeChange = (key: keyof typeof scope) => {
    setScope({ ...scope, [key]: !scope[key] });
  };

  const handleQualitativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQualitative({ ...qualitative, [e.target.name]: e.target.value });
  };

  const handleRowChange = (id: number, field: string, value: string) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, sector: '', role: '', requirement: '' }]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>Instruction: Use this format only if a recent (April 2020 or later) skill gap study is available.</p>
      </div>

      {/* 2B.1 Metadata */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4">2B.1 Study Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Month and Year of Study</label>
            <input type="month" name="monthYear" value={metadata.monthYear} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sample Size of Employers</label>
            <input type="number" name="sampleSize" value={metadata.sampleSize} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration of Data Collection</label>
            <input type="text" name="duration" value={metadata.duration} onChange={handleMetadataChange} className="w-full input-standard" placeholder="e.g. 3 Months" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Study Done By</label>
            <input type="text" name="studyBy" value={metadata.studyBy} onChange={handleMetadataChange} className="w-full input-standard" placeholder="Agency Name" />
          </div>
        </div>
      </div>

      {/* 2B.2 Scope */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4">2B.2 Scope of Study</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700 text-left">
              <tr>
                <th className="p-3">Did the study cover demand likely to be generated in...</th>
                <th className="p-3 w-24 text-center">Yes/No</th>
                <th className="p-3">If No - Please check for the following (Qualitative Input)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="p-3">Government Development Agenda</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={scope.govAgenda} onChange={() => handleScopeChange('govAgenda')} className="w-5 h-5 rounded" />
                </td>
                <td className="p-3">
                  {!scope.govAgenda && (
                    <input type="text" name="govAgenda" value={qualitative.govAgenda} onChange={handleQualitativeChange} placeholder="Major schemes being planned..." className="w-full input-standard" />
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-3">Agricultural Sector</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={scope.agri} onChange={() => handleScopeChange('agri')} className="w-5 h-5 rounded" />
                </td>
                <td className="p-3">
                  {!scope.agri && (
                    <input type="text" name="agri" value={qualitative.agri} onChange={handleQualitativeChange} placeholder="Likely demand for skilled labour..." className="w-full input-standard" />
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-3">Gram Panchayat Development Plans</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={scope.gpdp} onChange={() => handleScopeChange('gpdp')} className="w-5 h-5 rounded" />
                </td>
                <td className="p-3">
                  {!scope.gpdp && (
                    <input type="text" name="gpdp" value={qualitative.gpdp} onChange={handleQualitativeChange} placeholder="Projects planned & likely demand..." className="w-full input-standard" />
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-3">New Industries likely to open up</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={scope.newInd} onChange={() => handleScopeChange('newInd')} className="w-5 h-5 rounded" />
                </td>
                <td className="p-3">
                  {!scope.newInd && (
                    <input type="text" name="newInd" value={qualitative.newInd} onChange={handleQualitativeChange} placeholder="New licences/permissions issued..." className="w-full input-standard" />
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-3">Self Employment</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={scope.selfEmp} onChange={() => handleScopeChange('selfEmp')} className="w-5 h-5 rounded" />
                </td>
                <td className="p-3">
                  {!scope.selfEmp && (
                    <input type="text" name="selfEmp" value={qualitative.selfEmp} onChange={handleQualitativeChange} placeholder="Check bank loans / RSETI data..." className="w-full input-standard" />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2B.3 Demand Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">2B.3 Sector & Role Wise Requirement</h3>
          <button onClick={addRow} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add Row
          </button>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700 uppercase text-xs">
             <tr>
               <th className="px-4 py-3">S.No</th>
               <th className="px-4 py-3">Sector</th>
               <th className="px-4 py-3">Role</th>
               <th className="px-4 py-3">Indicative Requirement</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <input 
                    type="text" 
                    value={row.sector} 
                    onChange={(e) => handleRowChange(row.id, 'sector', e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0"
                    placeholder="Sector Name"
                  />
                </td>
                <td className="px-4 py-2">
                  <input 
                    type="text" 
                    value={row.role} 
                    onChange={(e) => handleRowChange(row.id, 'role', e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0"
                    placeholder="Job Role"
                  />
                </td>
                <td className="px-4 py-2">
                  <input 
                    type="number" 
                    value={row.requirement} 
                    onChange={(e) => handleRowChange(row.id, 'requirement', e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0"
                    placeholder="0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
           <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
             <Save className="w-4 h-4" />
             Save Study Data
           </button>
        </div>
      </div>
    </div>
  );
}
