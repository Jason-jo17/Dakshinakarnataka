import React from 'react';

const COMPANIES = [
    { name: 'Infosys', color: '#007cc3' },
    { name: 'Tech Mahindra', color: '#e31837' },
    { name: 'Cognizant', color: '#0033a0' },
    { name: 'Hexaware', color: '#000000' },
    { name: 'EG', color: '#e31837' },
    { name: 'Bose', color: '#000000' },
    { name: 'Niveus', color: '#f58220' },
    { name: 'Novigo', color: '#004c97' },
    { name: 'Semnox', color: '#666666' },
    { name: '99Games', color: '#ed1c24' },
    { name: 'UnifyCX', color: '#005696' },
    { name: 'TAPMI', color: '#8d1f2e' },
    { name: 'UniCourt', color: '#0072c6' },
    { name: 'Winman', color: '#d6001c' },
    { name: 'JSW', color: '#0f3e69' },
    { name: 'BASF', color: '#00477e' },
    { name: 'MCF', color: '#00843d' },
    { name: 'ELF', color: '#fdb913' },
    { name: 'Cardolite', color: '#005596' },
    { name: 'Adani', color: '#2b5797' },
    { name: 'Syngene', color: '#004c97' },
];

interface LeadingCompaniesProps {
    onCompanyClick?: (company: string) => void;
}

const LeadingCompanies: React.FC<LeadingCompaniesProps> = ({ onCompanyClick }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Leading Companies from Mangaluru</h3>
                <p className="text-sm text-slate-500">Major employers driving the regional ecosystem</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {COMPANIES.map((company, idx) => (
                    <div
                        key={idx}
                        onClick={() => onCompanyClick?.(company.name)}
                        className="group flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                        <span
                            className="font-bold text-sm md:text-base text-center group-hover:opacity-100 opacity-70 transition-opacity"
                            style={{ color: company.color }}
                        >
                            {company.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <p className="text-xs text-slate-400 font-medium">+ 50 More Startups & SMBs in Region-04</p>
            </div>
        </div >
    );
};

export default LeadingCompanies;
