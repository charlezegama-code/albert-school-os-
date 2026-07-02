import { OFFICIAL_EVENTS } from '../data/calendar'
import type { CalendarEvent } from '../types'

const SEMESTERS = [
  { label: 'S1', start: new Date('2026-09-14'), end: new Date('2027-01-15') },
  { label: 'S2', start: new Date('2027-01-18'), end: new Date('2027-07-09') },
]

export function getCurrentSemester(now = new Date()) {
  return SEMESTERS.find((s) => now >= s.start && now <= s.end) ?? SEMESTERS[0]
}

export function getSemesterProgress(now = new Date()): number {
  const sem = getCurrentSemester(now)
  const total   = sem.end.getTime() - sem.start.getTime()
  const elapsed = Math.max(0, now.getTime() - sem.start.getTime())
  return Math.min(100, Math.round((elapsed / total) * 100))
}

export function getWeekNumber(now = new Date()): number {
  const sem = getCurrentSemester(now)
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  return Math.max(1, Math.ceil((now.getTime() - sem.start.getTime()) / msPerWeek))
}

export function getNextEvent(customEvents: CalendarEvent[], now = new Date()): CalendarEvent | null {
  const todayStr = now.toISOString().split('T')[0]
  return [...OFFICIAL_EVENTS, ...customEvents]
    .filter((e) => e.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] ?? null
}

export function getActiveBDD(now = new Date()): CalendarEvent | null {
  const todayStr = now.toISOString().split('T')[0]
  return OFFICIAL_EVENTS.find(
    (e) => e.type === 'BDD' && e.startDate <= todayStr && e.endDate >= todayStr
  ) ?? null
}

export function formatEventDate(e: CalendarEvent): string {
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return e.startDate === e.endDate ? fmt(e.startDate) : `${fmt(e.startDate)} → ${fmt(e.endDate)}`
}
