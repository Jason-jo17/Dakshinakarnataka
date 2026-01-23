import * as React from "react"
import { cn } from "../../lib/utils"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

const Tooltip = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative inline-block group">
            {children}
        </div>
    )
}

const TooltipTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div className={cn("inline-block", className)}>{children}</div>
}

const TooltipContent = ({ className, children, ...props }: any) => {
    return (
        <div
            className={cn(
                "absolute z-50 overflow-hidden rounded-md border bg-slate-900 px-3 py-1.5 text-xs text-white shadow-md invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
