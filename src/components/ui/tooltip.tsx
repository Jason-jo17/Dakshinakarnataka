import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

const TooltipContext = React.createContext<{
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}>({
    isVisible: false,
    show: () => { },
    hide: () => { },
    triggerRef: { current: null },
})

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

const Tooltip = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const triggerRef = React.useRef<HTMLDivElement>(null)
    const timeoutRef = React.useRef<NodeJS.Timeout>(null) // No 'undef' in TS types for Timer usually? Actually NodeJS.Timeout is correct or number.

    const show = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsVisible(true)
    }

    const hide = () => {
        timeoutRef.current = setTimeout(() => setIsVisible(false), 100)
    }

    return (
        <TooltipContext.Provider value={{ isVisible, show, hide, triggerRef }}>
            <div
                className="relative inline-block"
                onMouseEnter={show}
                onMouseLeave={hide}
                ref={triggerRef}
            >
                {children}
            </div>
        </TooltipContext.Provider>
    )
}

const TooltipTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    // The ref is attached to the parent Tooltip div for simplicity in this implementation,
    // but if we wanted specific trigger styling we could move the ref here.
    // For now, just pass through or render as is.
    return <div className={cn("inline-block", className)}>{children}</div>
}

const TooltipContent = ({ className, children, side = "top", ...props }: any) => {
    const { isVisible, show, hide, triggerRef } = React.useContext(TooltipContext)
    const [coords, setCoords] = React.useState({ top: 0, left: 0 })
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useLayoutEffect(() => {
        if (isVisible && triggerRef.current && contentRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const contentRect = contentRef.current.getBoundingClientRect()
            const scrollY = window.scrollY
            const scrollX = window.scrollX

            let top = 0
            let left = 0

            // Simple positioning logic
            if (side === "top") {
                top = triggerRect.top + scrollY - contentRect.height - 8
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (contentRect.width / 2)
            } else if (side === "bottom") {
                top = triggerRect.bottom + scrollY + 8
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (contentRect.width / 2)
            } else if (side === "left") {
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (contentRect.height / 2)
                left = triggerRect.left + scrollX - contentRect.width - 8
            } else if (side === "right") {
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (contentRect.height / 2)
                left = triggerRect.right + scrollX + 8
            }

            // Boundary checks (basic)
            if (left < 5) left = 5
            if (left + contentRect.width > window.innerWidth - 5) left = window.innerWidth - contentRect.width - 5
            if (top < 5) top = 5

            setCoords({ top, left })
        }
    }, [isVisible, side])

    if (!isVisible) return null

    return createPortal(
        <div
            ref={contentRef}
            onMouseEnter={show}
            onMouseLeave={hide}
            style={{
                top: coords.top,
                left: coords.left,
                position: 'absolute',
                zIndex: 9999, // High z-index to sit on top of everything
                pointerEvents: 'auto' // Allow interaction (selection, etc)
            }}
            className={cn(
                "overflow-hidden rounded-md border bg-slate-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in zoom-in-95 duration-200 make-sure-visible",
                className
            )}
            {...props}
        >
            {children}
        </div>,
        document.body
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
