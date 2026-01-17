import React from 'react';
import { Card, CardContent } from "./ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color?: string;
    subtitle?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendValue, color = "blue", subtitle }) => {
    return (
        <Card className={`border-l-4 border-l-${color}-500 shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-icon text-xs font-medium uppercase tracking-wider">{title}</p>
                        <h3 className="text-2xl font-bold text-text mt-1">{value}</h3>
                        {subtitle && <p className="text-xs text-icon mt-1">{subtitle}</p>}
                        {trend && (
                            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                <span>{trendValue}</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
                        <Icon size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
