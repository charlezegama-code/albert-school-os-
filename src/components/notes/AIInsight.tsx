import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { getGradeInsight } from '../../lib/haiku'
import type { Grade, Subject } from '../../types'

interface AIInsightProps {
  grade: Grade
  subject: Subject
  onInsightSaved: (insight: string) => void
}

const SKY = '#5BC4F5'

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
      <div
        className="rounded-xl p-3 mt-2"
        style={{ background: 'rgba(91,196,245,0.08)', border: '1px solid rgba(91,196,245,0.25)' }}
      >
        <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: 'rgba(91,196,245,0.3)' }} />
        <div className="h-3 w-1/2 rounded animate-pulse mt-1.5" style={{ background: 'rgba(91,196,245,0.2)' }} />
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-3 mt-2"
      style={{ background: 'rgba(91,196,245,0.08)', border: '1px solid rgba(91,196,245,0.25)' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold tracking-wide" style={{ color: SKY }}>✦ Insight IA</span>
        <button onClick={generate} className="p-0.5" style={{ color: SKY }}>
          <RefreshCw size={12} />
        </button>
      </div>
      {error
        ? <p className="text-xs text-red-500">{error}</p>
        : <p className="text-xs text-text leading-relaxed">{grade.aiInsight ?? '—'}</p>
      }
    </div>
  )
}
