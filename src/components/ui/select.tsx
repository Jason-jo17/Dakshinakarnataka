import * as React from "react"

interface SelectContextType {
    value: string;
    onValueChange: (v: string) => void;
    open: boolean;
    setOpen: (v: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export const Select = ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (v: string) => void }) => {
    const [open, setOpen] = React.useState(false)
    return <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
}

export const SelectTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ctx = React.useContext(SelectContext)
    return <button onClick={() => ctx?.setOpen(!ctx.open)} className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
        {children}
    </button>
}

export const SelectValue = ({ placeholder }: { placeholder: string }) => {
    const ctx = React.useContext(SelectContext)
    return <span>{(ctx?.value === 'all' || !ctx?.value) ? placeholder : ctx.value}</span>
}

export const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ctx = React.useContext(SelectContext)
    if (!ctx?.open) return null
    return <div className={`absolute z-50 min-w-[8rem] max-h-60 overflow-y-auto rounded-md border bg-white p-1 text-slate-950 shadow-md ${className || ''}`}>
        <div className="w-full p-1">{children}</div>
    </div>
}

export const SelectItem = ({ value, children, disabled, className }: { value: string; children: React.ReactNode; disabled?: boolean; className?: string }) => {
    const ctx = React.useContext(SelectContext)

    if (disabled) {
        return (
            <div className={`relative flex w-full cursor-not-allowed select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none opacity-50 ${className || ''}`}>
                {children}
            </div>
        );
    }

    return <div
        onClick={() => { ctx?.onValueChange(value); ctx?.setOpen(false) }}
        className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 group ${className || ''}`}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {ctx?.value === value && <span>✓</span>}
        </span>
        {children}
    </div>
}
