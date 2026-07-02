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
      className={`min-h-[38px] p-0.5 flex flex-col items-center ${isCurrentMonth ? '' : 'opacity-20'}`}
      style={isVacances ? { background: 'rgba(16,185,129,0.08)' } : undefined}
    >
      {topEvent && !isVacances && (
        <div className="w-full h-[2px] rounded-full mb-0.5" style={{ background: EVENT_COLORS[topEvent.type] }} />
      )}
      <span
        className={`text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full mt-0.5 ${
          isToday
            ? 'ring-1 ring-accent-sky text-accent-sky font-bold'
            : 'text-muted'
        }`}
      >
        {date.getDate()}
      </span>
      {events.length > 0 && !isVacances && (
        <div className="flex gap-0.5 mt-0.5">
          {events.slice(0, 3).map((e, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
          ))}
        </div>
      )}
    </div>
  )
}
