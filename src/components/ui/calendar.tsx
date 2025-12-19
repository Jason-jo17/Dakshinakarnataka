import * as React from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const Calendar = ({ mode, selected, onSelect, className, initialFocus, ...props }: { mode?: string, selected?: Date | null, onSelect?: (date: Date | null) => void, className?: string, initialFocus?: boolean } & React.HTMLAttributes<HTMLDivElement>) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    })

    return (
        <div className={`p-3 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-muted-foreground">{d}</div>)}
                {days.map((day, i) => (
                    <button
                        key={day.toString()}
                        onClick={() => onSelect && onSelect(day)}
                        className={`
              h-8 w-8 rounded-md flex items-center justify-center hover:bg-slate-100
              ${!isSameMonth(day, currentMonth) ? "text-slate-300" : ""}
              ${selected && isSameDay(day, selected) ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
            `}
                    >
                        {format(day, "d")}
                    </button>
                ))}
            </div>
        </div>
    )
}
