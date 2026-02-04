import { useState, useMemo } from 'react';
import { Button } from "../ui/button";
import matrixConfig from '../../data/districtSkillMatrixConfig.json';
import { Save, Loader2, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabaseClient';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

// Types (re-defined to ensure type safety)
interface MatrixRowConfig {
    row_id: string;
    type: string; // "QUALITATIVE" | "QUANTITATIVE" | "HEADER" | "SUBHEADER"
    title: string;
    max_score: number;
    multiplier?: number;
    rubric_options?: { score: number; text: string; enabled: boolean }[];
    inputs?: { var_a_label: string; var_b_label: string; formula: string };
    rubric_logic?: string; // "ASCENDING" | "DESCENDING"
    thresholds?: number[];
    evidence_needed?: string;
    rubric_level_descriptions?: string[];
}

interface RowData {
    variable_a: string;
    variable_b: string;
    selected_option_score: number | null;
    evidence_url: string;
}

const DistrictSkillMatrix = () => {
    const { currentDistrict, isAuthenticated } = useAuthStore();
    const [formData, setFormData] = useState<Record<string, RowData>>({});
    const [isSaving, setIsSaving] = useState(false);

    // --- Calculations ---

    const getIndicatorValue = (inputA: string, inputB: string) => {
        const a = parseFloat(inputA) || 0;
        const b = parseFloat(inputB) || 0;
        if (b === 0) return 0;
        return (a / b) * 100;
    };

    const getDistrictScore = (indicatorValue: number, rowConfig: MatrixRowConfig, selectedScore: number | null) => {
        if (rowConfig.type === "QUALITATIVE") {
            return selectedScore !== null ? selectedScore : 0;
        }
        if (rowConfig.type === "HEADER" || rowConfig.type === "SUBHEADER") return 0;

        // QUANTITATIVE Score Calculation
        let level = 0;
        const t = rowConfig.thresholds || [];

        if (rowConfig.rubric_logic === "ASCENDING") {
            if (indicatorValue < t[0]) level = 0;
            else if (indicatorValue < t[1]) level = 1;
            else if (indicatorValue < t[2]) level = 2;
            else if (indicatorValue < t[3]) level = 3;
            else if (indicatorValue < t[4]) level = 4;
            else level = 5;
        } else if (rowConfig.rubric_logic === "DESCENDING") {
            if (indicatorValue > t[0]) level = 0;
            else if (indicatorValue > t[1]) level = 1;
            else if (indicatorValue > t[2]) level = 2;
            else if (indicatorValue > t[3]) level = 3;
            else if (indicatorValue > t[4]) level = 4;
            else level = 5;
        }

        return level * (rowConfig.multiplier || 1);
    };

    const updateRowData = (rowId: string, field: keyof RowData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId] || { variable_a: '', variable_b: '', selected_option_score: null, evidence_url: '' },
                [field]: value
            }
        }));
    };

    const totalScore = useMemo(() => {
        return matrixConfig.reduce((acc, rowItem) => {
            const row = rowItem as unknown as MatrixRowConfig;
            if (row.type === 'HEADER' || row.type === 'SUBHEADER') return acc;

            const data = formData[row.row_id] || { variable_a: '', variable_b: '', selected_option_score: null };
            let score = 0;
            if (row.type === 'QUALITATIVE') {
                score = getDistrictScore(0, row, data.selected_option_score);
            } else {
                const indVal = getIndicatorValue(data.variable_a, data.variable_b);
                score = getDistrictScore(indVal, row, null);
            }
            return acc + score;
        }, 0);
    }, [formData]);

    const maxTotalScore = useMemo(() => {
        return matrixConfig.reduce((acc, row) => {
            // Exclude headers/subheaders from max score sum if they are just grouping containers
            // However, checks CSV, max score is summed at component header level? 
            // Our config currently puts max_score on LEAF nodes. 
            // Header rows in our config have a visual max_score but shouldn't be double counted if we sum leaves.
            // Based on config, Headers store the 'SUM' for display, but we should sum the leaves.
            // Actually, the CSV shows "Max Score" column populated for headers too.
            // Let's assume we sum all rows that are NOT headers/subheaders.
            const r = row as unknown as MatrixRowConfig;
            if (r.type === 'HEADER' || r.type === 'SUBHEADER') return acc;
            return acc + (r.max_score || 0);
        }, 0)
    }, []);

    const handleSave = async () => {
        if (!isAuthenticated || !currentDistrict) {
            alert("You must be logged in and have a district selected to save data.");
            return;
        }
        setIsSaving(true);
        try {
            // Filter out headers from payload
            const payload = matrixConfig
                .filter(r => r.type !== 'HEADER' && r.type !== 'SUBHEADER')
                .map((rowItem) => {
                    const row = rowItem as unknown as MatrixRowConfig;
                    const data = formData[row.row_id] || { variable_a: '', variable_b: '', selected_option_score: null, evidence_url: '' };
                    const indicatorValue = getIndicatorValue(data.variable_a, data.variable_b);
                    const score = getDistrictScore(indicatorValue, row, data.selected_option_score);

                    return {
                        district_id: currentDistrict,
                        row_id: row.row_id,
                        variable_a: data.variable_a ? parseFloat(data.variable_a) : null,
                        variable_b: data.variable_b ? parseFloat(data.variable_b) : null,
                        indicator_value: indicatorValue,
                        district_score: score,
                        evidence_url: data.evidence_url || null,
                        updated_at: new Date().toISOString()
                    };
                });

            const { error } = await supabase
                .from('district_skill_matrix')
                .upsert(payload, { onConflict: 'district_id, row_id' });

            if (error) throw error;
            alert("District data saved successfully!");
        } catch (err: any) {
            console.error("error", err);
            alert(`Failed to save: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to render text for Quantitative thresholds in the grid (0-5 columns)
    const renderQuantitativeRubricText = (row: MatrixRowConfig, level: number) => {
        // Priority 1: Use explicit descriptions if available
        if (row.rubric_level_descriptions && row.rubric_level_descriptions[level]) {
            return row.rubric_level_descriptions[level];
        }

        const t = row.thresholds || [];
        if (row.rubric_logic === "ASCENDING") {
            if (level === 0) return `< ${t[0]}%`;
            if (level === 1) return `${t[0]}% to ${t[1]}%`;
            if (level === 2) return `${t[1]}% to ${t[2]}%`;
            if (level === 3) return `${t[2]}% to ${t[3]}%`;
            if (level === 4) return `${t[3]}% to ${t[4]}%`;
            if (level === 5) return `> ${t[4]}%`;
        }
        if (row.rubric_logic === "DESCENDING") {
            if (level === 0) return `> ${t[0]}%`;
            if (level === 1) return `${t[1]}% - ${t[0]}%`; // Approximate
            return `Level ${level}`;
        }
        return "-";
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">

                {/* Header / Score Card */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">District Skill Matrix</h1>
                        <p className="text-slate-500">Self-Scoring Grid - {currentDistrict || 'No District Selected'}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Total Score</p>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="text-3xl font-bold text-indigo-600">{totalScore.toFixed(0)}</span>
                                <span className="text-lg text-slate-400 font-medium">/ {maxTotalScore.toFixed(0)}</span>
                            </div>
                        </div>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Data
                        </Button>
                    </div>
                </div>


                {/* Main Table Container */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse min-w-[1400px]">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100 font-bold sticky top-0 z-20 shadow-sm">
                                {/* Top Header Row */}
                                <tr>
                                    <th rowSpan={2} className="px-4 py-3 border border-slate-300 w-64 bg-slate-200">Indicators</th>
                                    <th colSpan={6} className="px-4 py-2 border border-slate-300 text-center bg-blue-100 text-blue-800 border-b-white">Self-Scoring Grid (0-5)</th>
                                    <th rowSpan={2} className="px-2 py-3 border border-slate-300 text-center bg-slate-200 w-16">Max<br />Score</th>
                                    <th colSpan={2} className="px-4 py-2 border border-slate-300 text-center bg-orange-100 text-orange-800">Variables</th>
                                    <th rowSpan={2} className="px-4 py-3 border border-slate-300 text-center w-24 bg-slate-200">Formula</th>
                                    <th rowSpan={2} className="px-4 py-3 border border-slate-300 text-center w-24 bg-slate-200">Indicator<br />Value</th>
                                    <th rowSpan={2} className="px-4 py-3 border border-slate-300 text-center w-20 bg-slate-200">District<br />Score</th>
                                    <th colSpan={2} className="px-4 py-2 border border-slate-300 text-center bg-emerald-100 text-emerald-800">Remarks</th>
                                </tr>
                                {/* Sub Header Row */}
                                <tr className="bg-slate-50 text-slate-500">
                                    {/* 0-5 Columns */}
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <th key={i} className="px-2 py-2 border border-slate-300 text-center w-36 bg-blue-50/50">{i}</th>
                                    ))}
                                    {/* Variable Cols */}
                                    <th className="px-2 py-2 border border-slate-300 w-32 bg-orange-50/50">Variable A</th>
                                    <th className="px-2 py-2 border border-slate-300 w-32 bg-orange-50/50">Variable B</th>
                                    {/* Evidence Cols */}
                                    <th className="px-4 py-2 border border-slate-300 w-48 bg-emerald-50/50">Evidence Needed</th>
                                    <th className="px-4 py-2 border border-slate-300 w-48 bg-emerald-50/50">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {matrixConfig.map((rowItem) => {
                                    const row = rowItem as unknown as MatrixRowConfig;

                                    // --- Header Row Rendering ---
                                    if (row.type === 'HEADER') {
                                        return (
                                            <tr key={row.row_id} className="bg-slate-800 text-white">
                                                <td colSpan={14} className="px-4 py-3 font-bold text-base border-y border-slate-600">
                                                    {/* Basic flex layout to separate title and max score */}
                                                    <div className="flex justify-between items-center">
                                                        <span>{row.title}</span>
                                                        <span className="bg-slate-700 px-3 py-1 rounded text-sm text-slate-200 border border-slate-600">Max: {row.max_score}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    if (row.type === 'SUBHEADER') {
                                        return (
                                            <tr key={row.row_id} className="bg-slate-200 text-slate-800">
                                                <td colSpan={14} className="px-4 py-2 font-semibold border-y border-slate-300">
                                                    <div className="flex justify-between items-center">
                                                        <span>{row.title}</span>
                                                        <span className="px-3 py-0.5 rounded text-xs text-slate-600 bg-slate-300/50 border border-slate-300">Max: {row.max_score}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // --- Scoring Row Rendering ---
                                    const data = formData[row.row_id] || { variable_a: '', variable_b: '', selected_option_score: null, evidence_url: '' };
                                    const indicatorValue = getIndicatorValue(data.variable_a, data.variable_b);
                                    const currentScore = getDistrictScore(indicatorValue, row, data.selected_option_score);
                                    const isQualitative = row.type === 'QUALITATIVE';

                                    return (
                                        <tr key={row.row_id} className="hover:bg-slate-50 transition-colors">
                                            {/* Indicator Title */}
                                            <td className="px-4 py-3 border border-slate-300 align-top max-w-[250px]">
                                                <div className="font-semibold text-slate-800 text-xs mb-1 bg-slate-100 inline-block px-1.5 py-0.5 rounded">{row.row_id}</div>
                                                <div className="text-slate-700 text-xs leading-snug">{row.title}</div>
                                            </td>

                                            {/* 0-5 Scoring Grid Cells */}
                                            {[0, 1, 2, 3, 4, 5].map(level => {
                                                let fullTextVal = "";
                                                let isSelected = false;
                                                let isInteractive = false;
                                                let textToDisplay = "-";

                                                if (isQualitative) {
                                                    const option = row.rubric_options?.find(opt => opt.score === level);
                                                    if (option) {
                                                        fullTextVal = option.text;
                                                        textToDisplay = option.text;
                                                        isInteractive = !!option.enabled;
                                                    }
                                                    isSelected = data.selected_option_score === level;
                                                } else {
                                                    // Quantitative
                                                    const qText = renderQuantitativeRubricText(row, level);
                                                    fullTextVal = qText;
                                                    textToDisplay = qText;
                                                    isSelected = (currentScore / (row.multiplier || 1)) === level;
                                                }

                                                const cellContent = (
                                                    <div className={`
                                                        h-full min-h-[60px] flex flex-col items-center justify-center p-1 text-[10px] leading-tight text-center 
                                                        ${isSelected ? 'font-medium text-indigo-900' : 'text-slate-500'}
                                                    `}>
                                                        {textToDisplay !== "-" && (
                                                            <span className="line-clamp-3 overflow-hidden text-ellipsis w-full">
                                                                {textToDisplay}
                                                            </span>
                                                        )}
                                                        {textToDisplay === "-" && <span>-</span>}

                                                        {isQualitative && isInteractive && !isSelected && (
                                                            <div className="mt-2 w-2.5 h-2.5 rounded-full border border-slate-300 flex-shrink-0"></div>
                                                        )}
                                                        {isSelected && isQualitative && (
                                                            <div className="mt-2 w-2.5 h-2.5 rounded-full border-4 border-indigo-600 bg-white flex-shrink-0"></div>
                                                        )}
                                                    </div>
                                                );

                                                return (
                                                    <td
                                                        key={level}
                                                        className={`
                                                            border border-slate-300 align-top relative
                                                            ${isInteractive && isQualitative ? 'cursor-pointer hover:bg-blue-50' : ''}
                                                            ${isSelected ? 'bg-indigo-50 shadow-[inset_0_0_0_2px_rgba(99,102,241,0.5)]' : ''}
                                                        `}
                                                        onClick={() => {
                                                            if (isQualitative && isInteractive) {
                                                                updateRowData(row.row_id, 'selected_option_score', level);
                                                            }
                                                        }}
                                                    >
                                                        {textToDisplay !== "-" ? (
                                                            <Tooltip>
                                                                <TooltipTrigger className="w-full h-full block">
                                                                    {cellContent}
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="max-w-md bg-slate-900 text-white p-3 text-xs leading-relaxed shadow-xl z-50">
                                                                    {fullTextVal}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ) : (
                                                            cellContent
                                                        )}
                                                    </td>
                                                )
                                            })}

                                            {/* Max Score */}
                                            <td className="px-2 py-3 border border-slate-300 text-center font-semibold text-slate-700 text-xs">
                                                {row.max_score}
                                            </td>

                                            {/* Variable A & B */}
                                            {isQualitative ? (
                                                <>
                                                    <td className="px-2 py-2 border border-slate-300 bg-slate-50 text-center text-slate-400 text-[10px]">NA</td>
                                                    <td className="px-2 py-2 border border-slate-300 bg-slate-50 text-center text-slate-400 text-[10px]">NA</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-2 py-2 border border-slate-300 align-top">
                                                        <div className="text-[9px] text-slate-500 mb-1 line-clamp-2" title={row.inputs?.var_a_label}>{row.inputs?.var_a_label}</div>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                            value={data.variable_a}
                                                            onChange={(e) => updateRowData(row.row_id, 'variable_a', e.target.value)}
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-2 border border-slate-300 align-top">
                                                        <div className="text-[9px] text-slate-500 mb-1 line-clamp-2" title={row.inputs?.var_b_label}>{row.inputs?.var_b_label}</div>
                                                        <input
                                                            type="number"
                                                            className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                            value={data.variable_b}
                                                            onChange={(e) => updateRowData(row.row_id, 'variable_b', e.target.value)}
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                </>
                                            )}

                                            {/* Formula */}
                                            <td className="px-2 py-2 border border-slate-300 text-center text-[10px] text-slate-500 bg-slate-50">
                                                {isQualitative ? 'NA' : (row.inputs?.formula || 'A/B*100')}
                                            </td>

                                            {/* Indicator Value */}
                                            <td className="px-2 py-2 border border-slate-300 text-center font-mono font-medium text-slate-700 bg-slate-50 text-xs">
                                                {isQualitative ? 'NA' : <span>{indicatorValue.toFixed(1)}%</span>}
                                            </td>

                                            {/* District Score */}
                                            <td className="px-2 py-2 border border-slate-300 text-center font-bold text-indigo-700 bg-indigo-50/30 text-base">
                                                {currentScore}
                                            </td>

                                            {/* Remarks / Evidence */}
                                            <td className="px-2 py-2 border border-slate-300 text-[10px] text-slate-600 align-top">
                                                <Tooltip>
                                                    <TooltipTrigger className="w-full text-left block">
                                                        <div className="line-clamp-4 overflow-hidden cursor-help">
                                                            {row.evidence_needed}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="max-w-sm bg-slate-900 text-white p-3 text-xs z-50">
                                                        <p>{row.evidence_needed}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                            <td className="px-2 py-2 border border-slate-300 align-top">
                                                <div className="flex gap-1 items-center">
                                                    <input
                                                        type="text"
                                                        className="w-full text-xs p-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                                        placeholder="URL or Source..."
                                                        value={data.evidence_url}
                                                        onChange={(e) => updateRowData(row.row_id, 'evidence_url', e.target.value)}
                                                    />
                                                    {data.evidence_url && (
                                                        <a href={data.evidence_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded transition-colors" title="Open Link">
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div >
        </TooltipProvider >
    );
};

export default DistrictSkillMatrix;
