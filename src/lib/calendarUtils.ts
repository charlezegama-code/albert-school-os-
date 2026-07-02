import { OFFICIAL_EVENTS } from '../data/calendar'
import type { CalendarEvent } from '../types'

export function getAllEvents(customEvents: CalendarEvent[]): CalendarEvent[] {
  return [...OFFICIAL_EVENTS, ...customEvents]
}

export function getEventsForDate(dateStr: string, customEvents: CalendarEvent[]): CalendarEvent[] {
  return getAllEvents(customEvents).filter(
    (e) => e.startDate <= dateStr && e.endDate >= dateStr
  )
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const days: Date[] = []
  // Pad to Monday start (ISO week: Mon=0)
  const startPad = (first.getDay() + 6) % 7
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(first)
    d.setDate(d.getDate() - i - 1)
    days.push(d)
  }
  for (let d = new Date(first); d <= last; ) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  while (days.length % 7 !== 0) {
    const d = new Date(days[days.length - 1])
    d.setDate(d.getDate() + 1)
    days.push(d)
  }
  return days
}

export function toDateStr(d: Date): string {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function getUpcomingEvents(customEvents: CalendarEvent[], limit = 5): CalendarEvent[] {
  const todayStr = toDateStr(new Date())
  return getAllEvents(customEvents)
    .filter((e) => e.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit)
}
