import * as React from "react"

const PopoverContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null)

export const Popover = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false)
    return <PopoverContext.Provider value={{ open, setOpen }}>
        <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
}

export const PopoverTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) => {
    const ctx = React.useContext(PopoverContext)
    const child = asChild && React.isValidElement(children) ? React.Children.only(children) : <button>{children}</button>

    // safe cast to handle props
    const childElement = child as React.ReactElement<any>;

    return React.cloneElement(childElement, {
        onClick: (e: React.MouseEvent) => {
            if (childElement.props && typeof childElement.props.onClick === 'function') {
                childElement.props.onClick(e);
            }
            ctx?.setOpen(!ctx.open)
        }
    })
}

export const PopoverContent = ({ children, className, align = "center", ...props }: { children: React.ReactNode, className?: string, align?: "start" | "center" | "end" } & React.HTMLAttributes<HTMLDivElement>) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx?.open) return null
    return <div className={`absolute z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none ${className} ${align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'}`} {...props}>
        {children}
    </div>
}
