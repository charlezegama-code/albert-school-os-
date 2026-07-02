import { DayCell } from './DayCell'
import { getDaysInMonth, getEventsForDate, toDateStr } from '../../lib/calendarUtils'
import type { CalendarEvent } from '../../types'

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

interface MonthGridProps {
  year: number
  month: number
  customEvents: CalendarEvent[]
}

export function MonthGrid({ year, month, customEvents }: MonthGridProps) {
  const days     = getDaysInMonth(year, month)
  const todayStr = toDateStr(new Date())

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d, i) => (
          <div key={i} className="text-center text-[9px] font-semibold tracking-widest text-muted py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const dateStr = toDateStr(d)
          return (
            <DayCell
              key={dateStr + i}
              date={d}
              events={getEventsForDate(dateStr, customEvents)}
              isCurrentMonth={d.getMonth() === month}
              isToday={dateStr === todayStr}
            />
          )
        })}
      </div>
    </div>
  )
}
