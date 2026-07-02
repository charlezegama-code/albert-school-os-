import type { Subject, Grade } from '../../types'

interface SubjectCardProps {
  subject: Subject
  grades: Grade[]
  onClick: () => void
}

export function SubjectCard({ subject, grades, onClick }: SubjectCardProps) {
  const initial = subject.name.charAt(0).toUpperCase()

  const withActual = grades.filter((g) => g.actual !== null)
  const avg = withActual.length > 0
    ? withActual.reduce((sum, g) => sum + (g.actual as number), 0) / withActual.length
    : null

  const count = withActual.length
  const avgStr = avg !== null ? avg.toFixed(1) : '—'

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 border-b border-subtle last:border-0 active:opacity-60 transition-opacity text-left"
    >
      <div className="w-8 h-8 bg-elevated rounded-lg flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-accent">{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{subject.name}</p>
        <p className="text-[10px] text-muted mt-0.5">
          {count} note{count !== 1 ? 's' : ''} · moy. {avgStr}
        </p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}
