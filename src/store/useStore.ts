import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { AppState } from '../types'

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      grades: [],
      customEvents: [],
      objectives: {},
      weeklyIntensity: [],

      addGrade: (g) =>
        set((s) => ({ grades: [...s.grades, { ...g, id: nanoid() }] })),

      updateGrade: (id, patch) =>
        set((s) => ({
          grades: s.grades.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      addEvent: (e) =>
        set((s) => ({ customEvents: [...s.customEvents, { ...e, id: nanoid() }] })),

      deleteEvent: (id) =>
        set((s) => ({ customEvents: s.customEvents.filter((e) => e.id !== id) })),

      setObjective: (subjectId, target) =>
        set((s) => ({ objectives: { ...s.objectives, [subjectId]: target } })),

      setWeekIntensity: (weekStart, value) =>
        set((s) => {
          const filtered = s.weeklyIntensity.filter((w) => w.weekStart !== weekStart)
          return { weeklyIntensity: [...filtered, { weekStart, value }].sort((a, b) => a.weekStart.localeCompare(b.weekStart)) }
        }),
    }),
    { name: 'albert-os-store' }
  )
)
