import { EVENT_COLORS } from '../../data/calendar'
import type { CalendarEvent } from '../../types'

interface DayCellProps {
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function DayCell({ date, events, isCurrentMonth, isToday }: DayCellProps) {
  const isVacances = events.some((e) => e.type === 'VACANCES')
  const topEvent   = events.find((e) => e.type !== 'VACANCES') ?? events[0]

  return (
    <div
      className={`min-h-[36px] p-0.5 rounded-sm ${isCurrentMonth ? '' : 'opacity-25'}`}
      style={{ background: isVacances ? 'rgba(16,185,129,0.12)' : undefined }}
    >
      {topEvent && !isVacances && (
        <div className="h-0.5 rounded-full w-full mb-0.5" style={{ background: EVENT_COLORS[topEvent.type] }} />
      )}
      <span
        className={`text-[9px] font-semibold flex items-center justify-center w-5 h-5 rounded-full mx-auto ${
          isToday ? 'bg-sky text-navy font-extrabold' : 'text-text'
        }`}
      >
        {date.getDate()}
      </span>
      {events.length > 1 && !isVacances && (
        <div className="flex gap-0.5 justify-center mt-0.5">
          {events.slice(0, 3).map((e, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
          ))}
        </div>
      )}
    </div>
  )
}
