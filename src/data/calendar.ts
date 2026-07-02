import type { CalendarEvent, EventType } from '../types'

export const OFFICIAL_EVENTS: CalendarEvent[] = [
  // ── Semestre 1 ──────────────────────────────────────────────────────
  { id: 'o1',  title: 'Intégration 🎉',       type: 'PERSO',    startDate: '2026-08-31', endDate: '2026-09-11' },
  { id: 'o2',  title: 'Cours S1',              type: 'COURS',    startDate: '2026-09-14', endDate: '2026-10-23' },
  { id: 'o3',  title: 'BDD #1',                type: 'BDD',      startDate: '2026-09-14', endDate: '2026-10-02' },
  { id: 'o4',  title: 'BDD #2',                type: 'BDD',      startDate: '2026-10-05', endDate: '2026-10-23' },
  { id: 'o5',  title: 'Vacances Toussaint 🍂', type: 'VACANCES', startDate: '2026-10-26', endDate: '2026-10-30' },
  { id: 'o6',  title: 'Cours S1 (suite)',       type: 'COURS',    startDate: '2026-11-02', endDate: '2026-12-18' },
  { id: 'o7',  title: 'BDD #3',                type: 'BDD',      startDate: '2026-11-02', endDate: '2026-11-20' },
  { id: 'o8',  title: 'BDD #4',                type: 'BDD',      startDate: '2026-11-23', endDate: '2026-12-18' },
  { id: 'o9',  title: 'Vacances Noël 🎄',       type: 'VACANCES', startDate: '2026-12-21', endDate: '2027-01-03' },
  { id: 'o10', title: 'Examens S1 ⚡',          type: 'EXAMEN',   startDate: '2027-01-11', endDate: '2027-01-15' },
  // ── Semestre 2 ──────────────────────────────────────────────────────
  { id: 'o11', title: 'Cours S2',              type: 'COURS',    startDate: '2027-01-18', endDate: '2027-02-12' },
  { id: 'o12', title: 'BDD #5',                type: 'BDD',      startDate: '2027-01-18', endDate: '2027-02-12' },
  { id: 'o13', title: 'Rattrapages S1',         type: 'EXAMEN',   startDate: '2027-02-15', endDate: '2027-02-19' },
  { id: 'o14', title: 'Vacances ☀️',            type: 'VACANCES', startDate: '2027-02-22', endDate: '2027-02-26' },
  { id: 'o15', title: 'Cours S2 (suite)',       type: 'COURS',    startDate: '2027-03-01', endDate: '2027-04-16' },
  { id: 'o16', title: 'BDD #6',                type: 'BDD',      startDate: '2027-03-01', endDate: '2027-03-19' },
  { id: 'o17', title: 'BDD #7',                type: 'BDD',      startDate: '2027-03-22', endDate: '2027-04-16' },
  { id: 'o18', title: 'Vacances printemps 🌸',  type: 'VACANCES', startDate: '2027-04-19', endDate: '2027-04-30' },
  { id: 'o19', title: 'Cours S2 (fin)',         type: 'COURS',    startDate: '2027-05-03', endDate: '2027-05-21' },
  { id: 'o20', title: 'BDD #8',                type: 'BDD',      startDate: '2027-05-03', endDate: '2027-05-21' },
  { id: 'o21', title: 'Examens S2 ⚡',          type: 'EXAMEN',   startDate: '2027-05-31', endDate: '2027-06-04' },
  { id: 'o22', title: 'Rattrapages S2',         type: 'EXAMEN',   startDate: '2027-07-05', endDate: '2027-07-09' },
]

export const EVENT_COLORS: Record<EventType, string> = {
  COURS:    '#5BC4F5',
  BDD:      '#F59E0B',
  EXAMEN:   '#EF4444',
  DEVOIR:   '#8B5CF6',
  PERSO:    '#1A2456',
  VACANCES: '#10B981',
}

export const EVENT_BG: Record<EventType, string> = {
  COURS:    'rgba(91,196,245,0.12)',
  BDD:      'rgba(245,158,11,0.12)',
  EXAMEN:   'rgba(239,68,68,0.12)',
  DEVOIR:   'rgba(139,92,246,0.12)',
  PERSO:    'rgba(26,36,86,0.10)',
  VACANCES: 'rgba(16,185,129,0.10)',
}
