import { useState } from 'react'
import { getGradeInsight } from '../../lib/haiku'
import type { Grade, Subject } from '../../types'

interface AIInsightProps {
  grade: Grade
  subject: Subject
  onInsightSaved: (insight: string) => void
}

export function AIInsight({ grade, subject, onInsightSaved }: AIInsightProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function generate() {
    if (grade.actual === null) return
    setLoading(true); setError(null)
    try {
      const insight = await getGradeInsight(subject.name, grade.predicted, grade.actual)
      onInsightSaved(insight)
    } catch {
      setError('Erreur API')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-2 p-3 bg-elevated border border-subtle rounded-lg">
        <div className="h-2.5 w-3/4 rounded bg-subtle animate-pulse" />
        <div className="h-2.5 w-1/2 rounded bg-subtle animate-pulse mt-1.5" />
      </div>
    )
  }

  return (
    <div className="mt-2 p-3 bg-elevated border border-subtle rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-widest text-accent">INSIGHT IA</span>
        <button onClick={generate} className="text-[10px] text-muted active:text-ink transition-colors">
          ↻ Régénérer
        </button>
      </div>
      {error
        ? <p className="text-xs text-danger">{error}</p>
        : <p className="text-xs text-muted leading-relaxed">{grade.aiInsight ?? '—'}</p>
      }
    </div>
  )
}
