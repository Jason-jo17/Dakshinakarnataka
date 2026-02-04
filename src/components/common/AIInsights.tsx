import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const AIInsights = ({
    context = "district skill gap analysis",
    dataPoints = []
}: {
    context?: string;
    dataPoints?: string[];
}) => {
    const [swot, setSWOT] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) return;

        const genAI = new GoogleGenerativeAI(apiKey);

        async function generateSWOT() {
            setLoading(true);
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

                const defaultPoints = [
                    "Critical demand-supply mismatch",
                    "Primary sector skills deficit",
                    "Trainer shortage",
                    "SC/ST/Women underrepresentation",
                    "Data collection gaps",
                    "Placement quality issues",
                    "Gender wage gaps",
                    "Geographic access issues"
                ];

                const pointsToUse = dataPoints.length > 0 ? dataPoints : defaultPoints;

                const prompt = `Based on this ${context}, generate a SWOT in JSON format.
Key data points:
${pointsToUse.map(p => `- ${p}`).join('\n')}

Return ONLY valid JSON with this structure:
{
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "opportunities": ["...", "...", "..."],
  "threats": ["...", "...", "..."]
}`;

                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const parsed = JSON.parse(cleaned);
                setSWOT(parsed);
            } catch (err) {
                console.error('SWOT generation failed:', err);
            } finally {
                setLoading(false);
            }
        }

        generateSWOT();
    }, [context]);

    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Strategic Insights</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Generative analysis based on {context}</p>
                </div>
                {loading && <span className="text-xs text-slate-500 animate-pulse">Generating with Gemini...</span>}
            </div>

            {swot && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 p-4">
                        <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Strengths
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            {swot.strengths.map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">•</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
                        <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Weaknesses
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            {swot.weaknesses.map((w: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-600 mt-0.5">•</span>
                                    <span>{w}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 p-4">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Opportunities
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            {swot.opportunities.map((o: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>{o}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4">
                        <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Threats
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            {swot.threats.map((t: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-0.5">•</span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
