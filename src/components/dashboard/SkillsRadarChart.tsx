import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SkillsRadarChartProps {
    data: {
        subject: string;
        A: number; // Student Reality
        B: number; // Industry Expectation
        fullMark: number;
    }[];
    onInsightClick: (data: any) => void;
}

const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ data, onInsightClick }) => {
    return (
        <div className="h-[400px] w-full bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Skills Gap Analysis: Student Reality vs Industry Expectation</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                        name="Student Reality"
                        dataKey="A"
                        stroke="#0D47A1" // Primary Blue
                        fill="#0D47A1"
                        fillOpacity={0.6}
                        onClick={(data) => onInsightClick({ skill: 'Overall Analysis', priority: 'High', gap: 'Various', ...data })}
                        className="cursor-pointer"
                    />
                    <Radar
                        name="Industry Expectation"
                        dataKey="B"
                        stroke="#4CAF50" // Success Green
                        fill="#4CAF50"
                        fillOpacity={0.6}
                        onClick={(data) => onInsightClick({ skill: 'Industry Standards', priority: 'High', gap: 'Critical', ...data })}
                        className="cursor-pointer"
                    />
                    <Legend />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillsRadarChart;
