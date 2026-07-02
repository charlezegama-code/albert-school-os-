import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { AppState } from '../types'

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      grades: [],
      customEvents: [],

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
    }),
    { name: 'albert-os-store' }
  )
)
