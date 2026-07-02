import { EVENT_COLORS } from '../../data/calendar'
import { getEventsForDate, toDateStr } from '../../lib/calendarUtils'
import type { CalendarEvent } from '../../types'

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function getWeekDays(ref: Date): Date[] {
  const day    = (ref.getDay() + 6) % 7  // Mon=0
  const monday = new Date(ref)
  monday.setDate(ref.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function getWeekEventList(ref: Date, customEvents: CalendarEvent[]): CalendarEvent[] {
  const days = getWeekDays(ref)
  const seen = new Set<string>()
  const out: CalendarEvent[] = []
  days.forEach((d) => {
    getEventsForDate(toDateStr(d), customEvents).forEach((e) => {
      if (!seen.has(e.id)) { seen.add(e.id); out.push(e) }
    })
  })
  return out.sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function WeekStrip({ referenceDate, customEvents }: { referenceDate: Date; customEvents: CalendarEvent[] }) {
  const days     = getWeekDays(referenceDate)
  const todayStr = toDateStr(new Date())

  return (
    <div className="flex gap-1 pb-1">
      {days.map((d, i) => {
        const dateStr = toDateStr(d)
        const events  = getEventsForDate(dateStr, customEvents).slice(0, 2)
        const isToday = dateStr === todayStr
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[8px] text-white/40 font-semibold uppercase">{DOW[i]}</span>
            <span
              className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                isToday ? 'bg-sky text-navy' : 'text-white/80'
              }`}
            >
              {d.getDate()}
            </span>
            <div className="flex gap-0.5 h-1.5">
              {events.map((e, j) => (
                <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
