import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
    activeTab: string;
    setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{ defaultValue: string, className?: string, children: React.ReactNode }> = ({ defaultValue, className, children }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const TabsTrigger: React.FC<{ value: string, className?: string, children: React.ReactNode }> = ({ value, className, children }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={`${className || ''} ${isActive ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'text-slate-600 hover:text-slate-900'} transition-all`}
            data-state={isActive ? 'active' : 'inactive'}
        >
            {children}
        </button>
    );
};

export const TabsContent: React.FC<{ value: string, className?: string, children: React.ReactNode }> = ({ value, className, children }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.activeTab !== value) return null;

    return (
        <div className={`animate-fade-in ${className}`}>
            {children}
        </div>
    );
};
