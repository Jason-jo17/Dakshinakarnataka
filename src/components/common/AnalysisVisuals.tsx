import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

interface AnalysisVisualsProps {
    data: any[];
    visualsType: 'bar' | 'pie' | 'composed' | 'scatter';
    barKeys?: { key: string, color: string, name: string, stackId?: string }[];
    pieKey?: string;
    pieNameKey?: string;
    scatterKeys?: { xKey?: string, yKey: string, zKey?: string, name: string, color: string }[];
    xAxisKey?: string;
    height?: number;
    title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const AnalysisVisuals: React.FC<AnalysisVisualsProps> = ({
    data,
    visualsType,
    barKeys = [],
    pieKey,
    pieNameKey,
    scatterKeys = [],
    xAxisKey = 'name',
    height = 300,
    title
}) => {
    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-gray-400 italic">No data to display</div>;
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            {title && <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>}
            <div style={{ width: '100%', height: height }}>
                <ResponsiveContainer>
                    {visualsType === 'bar' ? (
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey={xAxisKey}
                                tick={{ fontSize: 12 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={70}
                            />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {barKeys.map((k) => (
                                <Bar
                                    key={k.key}
                                    dataKey={k.key}
                                    name={k.name}
                                    fill={k.color}
                                    stackId={k.stackId}
                                    radius={[4, 4, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    ) : visualsType === 'pie' && pieKey && pieNameKey ? (
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey={pieKey}
                                nameKey={pieNameKey}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    ) : visualsType === 'scatter' ? (
                        <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <CartesianGrid />
                            <XAxis type="category" dataKey={xAxisKey} name="Sector" angle={-45} textAnchor="end" height={70} interval={0} tick={{ fontSize: 12 }} />
                            <YAxis type="number" name="Count" />
                            <ZAxis type="number" range={[100, 100]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            {scatterKeys.map((k, index) => (
                                <Scatter
                                    key={index}
                                    name={k.name}
                                    data={data}
                                    fill={k.color}
                                    dataKey={k.yKey}
                                >
                                </Scatter>
                            ))}
                        </ScatterChart>
                    ) : (
                        <div>Unsupported Chart Type</div>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};
