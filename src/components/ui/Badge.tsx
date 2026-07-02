import { EVENT_COLORS, EVENT_BG } from '../../data/calendar'
import type { EventType } from '../../types'

export function Badge({ type, className = '' }: { type: EventType; className?: string }) {
  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0 ${className}`}
      style={{ color: EVENT_COLORS[type], background: EVENT_BG[type] }}
    >
      {type}
    </span>
  )
}
