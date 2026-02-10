import React, { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

// 2E.1 Table Data Interface
interface TraineeTarget {
  id: string;
  trainingCentre: string;
  scheme: string;
  sector: string;
  prevTrainedM: number;
  prevTrainedF: number;
  prevSeM: number;
  prevSeF: number;
  prevWeM: number;
  prevWeF: number;
  currTrained: number;
  currSe: number;
  currWe: number;
  nextToTrain: number;
  nextTargetSe: number;
  nextTargetWe: number;
}

// 2E.2 Mudra Table Data Interface
interface MudraData {
  id: string;
  sector: string;
  sishuNum: number;
  sishuAmt: number;
  kishoreNum: number;
  kishoreAmt: number;
  tarunNum: number;
  tarunAmt: number;
  nextSishuNum: number;
  nextSishuAmt: number;
}

export default function SelfEmploymentForm() {
  const [traineeData, setTraineeData] = useState<TraineeTarget[]>([]);
  const [newTrainee, setNewTrainee] = useState<Partial<TraineeTarget>>({});

  const [mudraData, setMudraData] = useState<MudraData[]>([]);
  const [newMudra, setNewMudra] = useState<Partial<MudraData>>({});

  const addTraineeRow = () => {
    if (!newTrainee.trainingCentre) return;
    setTraineeData([...traineeData, {
      id: crypto.randomUUID(),
      trainingCentre: newTrainee.trainingCentre || '',
      scheme: newTrainee.scheme || '',
      sector: newTrainee.sector || '',
      prevTrainedM: Number(newTrainee.prevTrainedM) || 0,
      prevTrainedF: Number(newTrainee.prevTrainedF) || 0,
      prevSeM: Number(newTrainee.prevSeM) || 0,
      prevSeF: Number(newTrainee.prevSeF) || 0,
      prevWeM: Number(newTrainee.prevWeM) || 0,
      prevWeF: Number(newTrainee.prevWeF) || 0,
      currTrained: Number(newTrainee.currTrained) || 0,
      currSe: Number(newTrainee.currSe) || 0,
      currWe: Number(newTrainee.currWe) || 0,
      nextToTrain: Number(newTrainee.nextToTrain) || 0,
      nextTargetSe: Number(newTrainee.nextTargetSe) || 0,
      nextTargetWe: Number(newTrainee.nextTargetWe) || 0
    }]);
    setNewTrainee({});
  };

  const addMudraRow = () => {
    if (!newMudra.sector) return;
    setMudraData([...mudraData, {
      id: crypto.randomUUID(),
      sector: newMudra.sector || '',
      sishuNum: Number(newMudra.sishuNum) || 0,
      sishuAmt: Number(newMudra.sishuAmt) || 0,
      kishoreNum: Number(newMudra.kishoreNum) || 0,
      kishoreAmt: Number(newMudra.kishoreAmt) || 0,
      tarunNum: Number(newMudra.tarunNum) || 0,
      tarunAmt: Number(newMudra.tarunAmt) || 0,
      nextSishuNum: Number(newMudra.nextSishuNum) || 0,
      nextSishuAmt: Number(newMudra.nextSishuAmt) || 0
    }]);
    setNewMudra({});
  };

  return (
    <div className="space-y-8">
      {/* 2E.1 Trainee Targets */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          2E.1 Training Centre & Scheme Details
        </h3>

        {/* Simple Form for Adding Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-slate-50 p-4 rounded-md">
          <div>
            <label className="block text-xs font-medium mb-1">Training Centre *</label>
            <input type="text" value={newTrainee.trainingCentre || ''} onChange={e => setNewTrainee({ ...newTrainee, trainingCentre: e.target.value })} className="w-full input-standard" placeholder="e.g. RSETI (Required)" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Scheme</label>
            <input type="text" value={newTrainee.scheme || ''} onChange={e => setNewTrainee({ ...newTrainee, scheme: e.target.value })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Sector</label>
            <input type="text" value={newTrainee.sector || ''} onChange={e => setNewTrainee({ ...newTrainee, sector: e.target.value })} className="w-full input-standard" />
          </div>
          <div className="flex items-end">
            <button
              onClick={addTraineeRow}
              disabled={!newTrainee.trainingCentre}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Row
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <th rowSpan={2} className="p-2 border">Centre</th>
                <th rowSpan={2} className="p-2 border">Scheme</th>
                <th rowSpan={2} className="p-2 border">Sector</th>
                <th colSpan={6} className="p-2 border text-center bg-blue-50 dark:bg-blue-900/20">Previous Year Data</th>
                <th colSpan={3} className="p-2 border text-center bg-green-50 dark:bg-green-900/20">Plan This Year</th>
                <th colSpan={3} className="p-2 border text-center bg-purple-50 dark:bg-purple-900/20">Plan Next Year</th>
                <th rowSpan={2} className="p-2 border">Action</th>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-600">
                <th className="p-1 border min-w-[50px]">Trained(M)</th>
                <th className="p-1 border min-w-[50px]">Trained(F)</th>
                <th className="p-1 border min-w-[50px]">SE(M)</th>
                <th className="p-1 border min-w-[50px]">SE(F)</th>
                <th className="p-1 border min-w-[50px]">WE(M)</th>
                <th className="p-1 border min-w-[50px]">WE(F)</th>
                <th className="p-1 border min-w-[50px]">Trained</th>
                <th className="p-1 border min-w-[50px]">SE</th>
                <th className="p-1 border min-w-[50px]">WE</th>
                <th className="p-1 border min-w-[50px]">To Train</th>
                <th className="p-1 border min-w-[50px]">Target SE</th>
                <th className="p-1 border min-w-[50px]">Target WE</th>
              </tr>
            </thead>
            <tbody>
              {traineeData.map(row => (
                <tr key={row.id}>
                  <td className="p-2 border">{row.trainingCentre}</td>
                  <td className="p-2 border">{row.scheme}</td>
                  <td className="p-2 border">{row.sector}</td>
                  <td className="p-2 border">{row.prevTrainedM}</td>
                  <td className="p-2 border">{row.prevTrainedF}</td>
                  <td className="p-2 border">{row.prevSeM}</td>
                  <td className="p-2 border">{row.prevSeF}</td>
                  <td className="p-2 border">{row.prevWeM}</td>
                  <td className="p-2 border">{row.prevWeF}</td>
                  <td className="p-2 border">{row.currTrained}</td>
                  <td className="p-2 border">{row.currSe}</td>
                  <td className="p-2 border">{row.currWe}</td>
                  <td className="p-2 border">{row.nextToTrain}</td>
                  <td className="p-2 border">{row.nextTargetSe}</td>
                  <td className="p-2 border">{row.nextTargetWe}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => setTraineeData(traineeData.filter(r => r.id !== row.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2E.2 Mudra Loans */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          2E.2 Mudra Loans (Bank Wise / Sector Wise)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium mb-1">Sector *</label>
            <input type="text" value={newMudra.sector || ''} onChange={e => setNewMudra({ ...newMudra, sector: e.target.value })} className="w-full input-standard" placeholder="Sector (Required)" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Sishu Num</label>
            <input type="number" value={newMudra.sishuNum || ''} onChange={e => setNewMudra({ ...newMudra, sishuNum: Number(e.target.value) })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Sishu Amount</label>
            <input type="number" value={newMudra.sishuAmt || ''} onChange={e => setNewMudra({ ...newMudra, sishuAmt: Number(e.target.value) })} className="w-full input-standard" />
          </div>
          <div className="flex items-end">
            <button
              onClick={addMudraRow}
              disabled={!newMudra.sector}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <th rowSpan={2} className="p-2 border">Sector</th>
                <th colSpan={2} className="p-2 border text-center">Sishu (up to 50k)</th>
                <th colSpan={2} className="p-2 border text-center">Kishore (50k-5L)</th>
                <th colSpan={2} className="p-2 border text-center">Tarun (5L-10L)</th>
                <th rowSpan={2} className="p-2 border">Action</th>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-600">
                <th className="p-2 border">Num</th>
                <th className="p-2 border">Amt</th>
                <th className="p-2 border">Num</th>
                <th className="p-2 border">Amt</th>
                <th className="p-2 border">Num</th>
                <th className="p-2 border">Amt</th>
              </tr>
            </thead>
            <tbody>
              {mudraData.map(row => (
                <tr key={row.id}>
                  <td className="p-2 border">{row.sector}</td>
                  <td className="p-2 border">{row.sishuNum}</td>
                  <td className="p-2 border">{row.sishuAmt}</td>
                  <td className="p-2 border">{row.kishoreNum}</td>
                  <td className="p-2 border">{row.kishoreAmt}</td>
                  <td className="p-2 border">{row.tarunNum}</td>
                  <td className="p-2 border">{row.tarunAmt}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => setMudraData(mudraData.filter(r => r.id !== row.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Save className="w-4 h-4" />
          Save Self Employment Data
        </button>
      </div>
    </div>
  );
}
