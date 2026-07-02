import type { Subject, Grade } from '../../types'
import { Card } from '../ui/Card'
import { Sparkline } from './Sparkline'

interface SubjectCardProps {
  subject: Subject
  grades: Grade[]
  onClick: () => void
}

const SKY = '#5BC4F5'
const AMBER = '#F59E0B'

function fmt(n: number | null, prefix = true): string {
  if (n === null) return '—'
  const sign = prefix && n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}`
}

export function SubjectCard({ subject, grades, onClick }: SubjectCardProps) {
  const color = subject.bloc === 'data' ? SKY : AMBER

  const withActual = grades.filter((g) => g.actual !== null)
  const avg =
    withActual.length > 0
      ? withActual.reduce((sum, g) => sum + (g.actual as number), 0) / withActual.length
      : null

  const withBoth = grades.filter((g) => g.actual !== null && g.predicted !== null)
  const deltaAvg =
    withBoth.length > 0
      ? withBoth.reduce((sum, g) => sum + ((g.actual as number) - g.predicted), 0) /
        withBoth.length
      : null

  const sorted = [...grades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const lastGrade = sorted.find((g) => g.actual !== null) ?? null
  const lastDelta =
    lastGrade ? (lastGrade.actual as number) - lastGrade.predicted : null

  const sparkValues = [...grades]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((g) => g.actual !== null)
    .map((g) => g.actual as number)

  const nextPredicted =
    grades.find((g) => g.actual === null)?.predicted ?? null

  return (
    <Card onClick={onClick} className="px-4 py-3 flex flex-col gap-1">
      {/* Row 1: emoji + name + avg */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-semibold text-sm text-text truncate">
          <span>{subject.emoji}</span>
          <span className="truncate">{subject.name}</span>
        </span>
        <span className="text-sm font-bold shrink-0 ml-2" style={{ color }}>
          {avg !== null ? `${avg.toFixed(1)}/20` : '—'}
        </span>
      </div>

      {/* Row 2: δavg · count · last δ */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          δ moy : <span className="font-medium">{fmt(deltaAvg)}</span>
          {' · '}
          {withActual.length} note{withActual.length !== 1 ? 's' : ''}
        </span>
        <span className="font-medium">{fmt(lastDelta)}</span>
      </div>

      {/* Row 3: sparkline */}
      <div className="mt-1">
        <Sparkline values={sparkValues} predicted={nextPredicted} color={color} />
      </div>
    </Card>
  )
}
