import * as React from "react"

const SelectContext = React.createContext<{ value: string; onValueChange: (v: string) => void; open: boolean; setOpen: (v: boolean) => void } | null>(null)

export const Select = ({ children, value, onValueChange }) => {
    const [open, setOpen] = React.useState(false)
    return <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
}

export const SelectTrigger = ({ children, className }) => {
    const ctx = React.useContext(SelectContext)
    return <button onClick={() => ctx.setOpen(!ctx.open)} className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
        {children}
    </button>
}

export const SelectValue = ({ placeholder }) => {
    const ctx = React.useContext(SelectContext)
    return <span>{ctx.value === 'all' || !ctx.value ? placeholder : ctx.value}</span>
}

export const SelectContent = ({ children }) => {
    const ctx = React.useContext(SelectContext)
    if (!ctx.open) return null
    return <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-slate-950 shadow-md">
        <div className="w-full p-1">{children}</div>
    </div>
}

export const SelectItem = ({ value, children }) => {
    const ctx = React.useContext(SelectContext)
    return <div
        onClick={() => { ctx.onValueChange(value); ctx.setOpen(false) }}
        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {ctx.value === value && <span>✓</span>}
        </span>
        {children}
    </div>
}
