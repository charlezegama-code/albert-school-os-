import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { getGradeInsight } from '../../lib/haiku'
import { AIInsight } from './AIInsight'
import { toDateStr } from '../../lib/calendarUtils'
import type { Subject, Grade } from '../../types'

interface GradeModalProps {
  open: boolean
  onClose: () => void
  subject: Subject | null
}

export function GradeModal({ open, onClose, subject }: GradeModalProps) {
  const { grades, addGrade, updateGrade } = useStore()
  const [label, setLabel]         = useState('')
  const [predicted, setPredicted] = useState('')
  const [actual, setActual]       = useState('')
  const [date, setDate]           = useState(toDateStr(new Date()))
  const [pendingGrade, setPendingGrade] = useState<Grade | null>(null)

  useEffect(() => {
    if (open && subject) {
      setLabel(''); setPredicted(''); setActual('')
      setDate(toDateStr(new Date()))
      const pending = grades
        .filter((g) => g.subjectId === subject.id && g.actual === null)
        .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
      setPendingGrade(pending)
    }
  }, [open, subject])

  if (!subject) return null
  const s = subject

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const act = actual !== '' ? parseFloat(actual) : null

    if (pendingGrade) {
      updateGrade(pendingGrade.id, { actual: act, date })
      if (act !== null) {
        try {
          const insight = await getGradeInsight(s.name, pendingGrade.predicted, act)
          updateGrade(pendingGrade.id, { aiInsight: insight })
        } catch { /* silent */ }
      }
    } else {
      const pred = parseFloat(predicted)
      if (isNaN(pred) || pred < 0 || pred > 20) return
      addGrade({
        subjectId: s.id,
        label: label.trim() || `Note ${s.name}`,
        predicted: pred,
        actual: act,
        date,
        aiInsight: null,
      })
      if (act !== null) {
        try {
          const insight = await getGradeInsight(s.name, pred, act)
          const allGrades = useStore.getState().grades
          const newGrade = [...allGrades]
            .reverse()
            .find((g) => g.subjectId === s.id && g.actual === act)
          if (newGrade) updateGrade(newGrade.id, { aiInsight: insight })
        } catch { /* silent */ }
      }
    }
    onClose()
  }

  const recentWithActual = [...grades]
    .filter((g) => g.subjectId === subject.id && g.actual !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full bg-white rounded-t-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-text">{subject.emoji} {subject.name}</h2>
              <button onClick={onClose} className="text-muted"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {pendingGrade ? (
                <div className="bg-app-gray rounded-xl p-3 text-sm text-muted">
                  Prédiction en attente : <span className="font-bold text-text">{pendingGrade.label}</span> — {pendingGrade.predicted}/20
                </div>
              ) : (
                <>
                  <input
                    value={label} onChange={(e) => setLabel(e.target.value)}
                    placeholder="Intitulé (ex: DS1)"
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-sky"
                  />
                  <div>
                    <label className="text-[10px] text-muted font-medium block mb-1">Note prédite / 20</label>
                    <input
                      required type="number" min="0" max="20" step="0.5"
                      value={predicted} onChange={(e) => setPredicted(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:border-sky"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-[10px] text-muted font-medium block mb-1">Note réelle / 20 (optionnel)</label>
                <input
                  type="number" min="0" max="20" step="0.5"
                  value={actual} onChange={(e) => setActual(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:border-sky"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted font-medium block mb-1">Date</label>
                <input
                  type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-200 rounded-xl px-2 py-2 text-sm w-full focus:outline-none focus:border-sky"
                />
              </div>
              <button type="submit"
                className="bg-sky text-navy font-bold rounded-xl py-3 mt-1 active:scale-95 transition-transform">
                Enregistrer
              </button>
            </form>

            {recentWithActual.length > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                <p className="text-xs text-muted font-semibold uppercase tracking-wide">Historique</p>
                {recentWithActual.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-text">{g.label}</span>
                      <span className="font-bold">{(g.actual as number).toFixed(1)}/20</span>
                    </div>
                    <AIInsight
                      grade={g}
                      subject={subject}
                      onInsightSaved={(insight) => updateGrade(g.id, { aiInsight: insight })}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
