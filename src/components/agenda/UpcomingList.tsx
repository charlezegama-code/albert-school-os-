import { EVENT_COLORS } from '../../data/calendar'
import { getUpcomingEvents } from '../../lib/calendarUtils'
import type { CalendarEvent } from '../../types'

function fmtDate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function UpcomingList({ customEvents }: { customEvents: CalendarEvent[] }) {
  const events = getUpcomingEvents(customEvents)
  if (!events.length) return null

  return (
    <div className="px-4 pt-4 pb-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-3">À venir</p>
      <div className="flex flex-col gap-2">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-3 py-2 border-b border-subtle last:border-0">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5" style={{ background: EVENT_COLORS[e.type] }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{e.title}</p>
              <p className="text-[10px] text-muted mt-0.5">
                {fmtDate(e.startDate)}{e.startDate !== e.endDate ? ` → ${fmtDate(e.endDate)}` : ''}
              </p>
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
              style={{ color: EVENT_COLORS[e.type], background: `${EVENT_COLORS[e.type]}20` }}
            >
              {e.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
