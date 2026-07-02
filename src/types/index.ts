export type EventType = 'COURS' | 'BDD' | 'EXAMEN' | 'DEVOIR' | 'PERSO' | 'VACANCES'

export interface CalendarEvent {
  id: string
  title: string
  type: EventType
  startDate: string   // 'YYYY-MM-DD'
  endDate: string     // 'YYYY-MM-DD' inclusive
  note?: string | null
}

export interface Grade {
  id: string
  subjectId: string
  label: string         // ex: "DS1 Python"
  predicted: number     // /20
  actual: number | null
  date: string          // 'YYYY-MM-DD'
  aiInsight: string | null
}

export interface Subject {
  id: string
  name: string
  emoji: string
  bloc: 'data' | 'business'
}

export interface AppState {
  grades: Grade[]
  customEvents: CalendarEvent[]
  addGrade: (g: Omit<Grade, 'id'>) => void
  updateGrade: (id: string, patch: Partial<Grade>) => void
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void
  deleteEvent: (id: string) => void
}
