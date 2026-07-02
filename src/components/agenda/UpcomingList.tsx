import { Badge } from '../ui/Badge'
import { EVENT_COLORS } from '../../data/calendar'
import { getUpcomingEvents } from '../../lib/calendarUtils'
import type { CalendarEvent } from '../../types'

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function UpcomingList({ customEvents }: { customEvents: CalendarEvent[] }) {
  const events = getUpcomingEvents(customEvents)
  if (!events.length) return null

  return (
    <div className="px-3 pt-2 pb-3">
      <p className="text-[9px] font-bold uppercase tracking-wide text-muted mb-2">À venir</p>
      <div className="flex flex-col gap-1.5">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-2 bg-white rounded-lg p-2.5 shadow-sm">
            <div className="w-0.5 self-stretch rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-text truncate">{e.title}</p>
              <p className="text-[9px] text-muted">
                {fmtDate(e.startDate)}{e.startDate !== e.endDate ? ` → ${fmtDate(e.endDate)}` : ''}
              </p>
            </div>
            <Badge type={e.type} />
          </div>
        ))}
      </div>
    </div>
  )
}
