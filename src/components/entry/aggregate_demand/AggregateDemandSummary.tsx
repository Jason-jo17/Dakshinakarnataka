import React, { useState } from 'react';
import { Save, Info, Trash2 } from 'lucide-react';

interface SummaryRow {
   id: string;
   sectorCategory: 'Primary' | 'Secondary' | 'Services';
   sector: string;
   role: string;
   demandSurvey: number;
   demandSkillGap: number;
   demandGpdp: number;
   demandSelfEmp: number;
   demandPrimary: number;
   mostRealistic: number;
   // Optional columns
   estAgri: number;
   estMining: number;
   estMfg: number;
   estElec: number;
   estCons: number;
   estTrade: number;
   estFin: number;
   estPubAdmin: number;
}

export default function AggregateDemandSummary() {
   const [rows, setRows] = useState<SummaryRow[]>([]);
   const [newRow, setNewRow] = useState<Partial<SummaryRow>>({ sectorCategory: 'Primary' });

   const addRow = () => {
      if (!newRow.sector) return;
      setRows([...rows, {
         id: crypto.randomUUID(),
         sectorCategory: newRow.sectorCategory || 'Primary',
         sector: newRow.sector || '',
         role: newRow.role || '',
         demandSurvey: Number(newRow.demandSurvey) || 0,
         demandSkillGap: Number(newRow.demandSkillGap) || 0,
         demandGpdp: Number(newRow.demandGpdp) || 0,
         demandSelfEmp: Number(newRow.demandSelfEmp) || 0,
         demandPrimary: Number(newRow.demandPrimary) || 0,
         mostRealistic: Number(newRow.mostRealistic) || 0,
         estAgri: 0, estMining: 0, estMfg: 0, estElec: 0, estCons: 0, estTrade: 0, estFin: 0, estPubAdmin: 0
      }]);
      setNewRow({ sectorCategory: newRow.sectorCategory });
   };

   const categories = ['Primary', 'Secondary', 'Services'] as const;

   return (
      <div className="space-y-6">
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
               <Info className="w-4 h-4" /> Aggregate Demand Summary
            </h4>
            <p>Capture demand from various subcomponents. Avoid duplicate demand. The Macro Analysis based estimate is only for supporting data.</p>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
               Consolidated Demand Estimates
            </h3>

            {/* Add Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 bg-slate-50 p-4 rounded-md">
               <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select
                     value={newRow.sectorCategory}
                     onChange={e => setNewRow({ ...newRow, sectorCategory: e.target.value as any })}
                     className="w-full input-standard text-xs"
                  >
                     {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-medium mb-1">Sector *</label>
                  <input type="text" value={newRow.sector || ''} onChange={e => setNewRow({ ...newRow, sector: e.target.value })} className="w-full input-standard text-xs" placeholder="Required" />
               </div>
               <div>
                  <label className="block text-xs font-medium mb-1">Role</label>
                  <input type="text" value={newRow.role || ''} onChange={e => setNewRow({ ...newRow, role: e.target.value })} className="w-full input-standard text-xs" />
               </div>
               <div>
                  <label className="block text-xs font-medium mb-1">Realistic Est.</label>
                  <input type="number" value={newRow.mostRealistic || ''} onChange={e => setNewRow({ ...newRow, mostRealistic: Number(e.target.value) })} className="w-full input-standard text-xs" />
               </div>
               <div className="flex items-end">
                  <button
                     onClick={addRow}
                     disabled={!newRow.sector}
                     className="w-full py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Add Row
                  </button>
               </div>

               {/* Optional Estimates Inputs */}
               <div className="col-span-1 md:col-span-5 grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-200">
                  <div className="col-span-4 text-xs font-semibold text-slate-500">Optional Sector Estimates:</div>
                  <div><label className="text-[10px]">Agriculture</label><input type="number" className="w-full input-standard text-xs" value={newRow.estAgri || ''} onChange={e => setNewRow({ ...newRow, estAgri: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Mining</label><input type="number" className="w-full input-standard text-xs" value={newRow.estMining || ''} onChange={e => setNewRow({ ...newRow, estMining: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Mfg</label><input type="number" className="w-full input-standard text-xs" value={newRow.estMfg || ''} onChange={e => setNewRow({ ...newRow, estMfg: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Electricity</label><input type="number" className="w-full input-standard text-xs" value={newRow.estElec || ''} onChange={e => setNewRow({ ...newRow, estElec: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Construction</label><input type="number" className="w-full input-standard text-xs" value={newRow.estCons || ''} onChange={e => setNewRow({ ...newRow, estCons: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Trade</label><input type="number" className="w-full input-standard text-xs" value={newRow.estTrade || ''} onChange={e => setNewRow({ ...newRow, estTrade: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Finance</label><input type="number" className="w-full input-standard text-xs" value={newRow.estFin || ''} onChange={e => setNewRow({ ...newRow, estFin: Number(e.target.value) })} /></div>
                  <div><label className="text-[10px]">Pub Admin</label><input type="number" className="w-full input-standard text-xs" value={newRow.estPubAdmin || ''} onChange={e => setNewRow({ ...newRow, estPubAdmin: Number(e.target.value) })} /></div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-xs text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        <th className="p-2 border" rowSpan={2}>Sector</th>
                        <th className="p-2 border" rowSpan={2}>Role</th>
                        <th className="p-2 border text-center" rowSpan={2}>Survey</th>
                        <th className="p-2 border text-center" rowSpan={2}>Skill Gap</th>
                        <th className="p-2 border text-center" rowSpan={2}>GPDP</th>
                        <th className="p-2 border text-center" rowSpan={2}>Primary</th>
                        <th className="p-2 border text-center bg-yellow-50 dark:bg-yellow-900/20" rowSpan={2}>Realistic</th>
                        <th className="p-2 border text-center bg-orange-50 dark:bg-orange-900/20" colSpan={8}>Sector Estimates</th>
                        <th className="p-2 border text-center" rowSpan={2}>Action</th>
                     </tr>
                     <tr className="bg-slate-50 dark:bg-slate-700 text-[10px] text-slate-600">
                        <th className="p-1 border text-center">Agri</th>
                        <th className="p-1 border text-center">Min</th>
                        <th className="p-1 border text-center">Mfg</th>
                        <th className="p-1 border text-center">Elec</th>
                        <th className="p-1 border text-center">Cons</th>
                        <th className="p-1 border text-center">Trad</th>
                        <th className="p-1 border text-center">Fin</th>
                        <th className="p-1 border text-center">Pub</th>
                     </tr>
                  </thead>
                  <tbody>
                     {categories.map(cat => (
                        <React.Fragment key={cat}>
                           <tr className="bg-slate-200 dark:bg-slate-600 font-bold">
                              <td colSpan={17} className="p-2 border">{cat} Sector</td>
                           </tr>
                           {rows.filter(r => r.sectorCategory === cat).map(row => (
                              <tr key={row.id}>
                                 <td className="p-2 border">{row.sector}</td>
                                 <td className="p-2 border">{row.role}</td>
                                 <td className="p-2 border text-center">{row.demandSurvey}</td>
                                 <td className="p-2 border text-center">{row.demandSkillGap}</td>
                                 <td className="p-2 border text-center">{row.demandGpdp}</td>
                                 <td className="p-2 border text-center">{row.demandPrimary}</td>
                                 <td className="p-2 border text-center bg-yellow-50 dark:bg-yellow-900/10 font-medium">{row.mostRealistic}</td>

                                 <td className="p-1 border text-center text-slate-500">{row.estAgri}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estMining}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estMfg}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estElec}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estCons}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estTrade}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estFin}</td>
                                 <td className="p-1 border text-center text-slate-500">{row.estPubAdmin}</td>

                                 <td className="p-2 border text-center">
                                    <button onClick={() => setRows(rows.filter(r => r.id !== row.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                                 </td>
                              </tr>
                           ))}
                        </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
               <Save className="w-4 h-4" />
               Save Summary Data
            </button>
         </div>
      </div>
   );
}
