import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
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

const inputCls = 'bg-elevated border border-subtle rounded-lg px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent w-full'

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

  const chronoGrades = [...grades]
    .filter((g) => g.subjectId === s.id && g.actual !== null)
    .sort((a, b) => a.date.localeCompare(b.date))

  const chartData = chronoGrades.map((g) => ({
    label: g.label,
    value: g.actual as number,
  }))

  const recentWithActual = [...chronoGrades].reverse().slice(0, 5)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end">
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full bg-card border-t border-subtle rounded-t-2xl p-5 z-50 max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                  {s.bloc === 'data' ? 'Data / Tech' : 'Business'}
                </p>
                <h2 className="text-base font-bold text-ink mt-0.5">{s.name}</h2>
              </div>
              <button onClick={onClose} className="text-muted active:text-ink transition-colors"><X size={18} /></button>
            </div>

            {/* Chart */}
            {chartData.length >= 2 && (
              <div className="mb-5 h-28 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#6B7280', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 20]}
                      tick={{ fill: '#6B7280', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      ticks={[0, 5, 10, 15, 20]}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1C2333', border: '1px solid #1F2937', borderRadius: 6, fontSize: 11, color: '#F9FAFB' }}
                      cursor={{ stroke: '#1F2937' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
                      activeDot={{ r: 4, fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
              {pendingGrade ? (
                <div className="bg-elevated border border-subtle rounded-lg p-3 text-sm text-muted">
                  Prédiction en attente : <span className="font-semibold text-ink">{pendingGrade.label}</span> — {pendingGrade.predicted}/20
                </div>
              ) : (
                <>
                  <input
                    value={label} onChange={(e) => setLabel(e.target.value)}
                    placeholder="Intitulé (ex: DS1)"
                    className={inputCls}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted font-semibold uppercase tracking-wider block mb-1">Prédite</label>
                      <input
                        required type="number" min="0" max="20" step="0.5"
                        value={predicted} onChange={(e) => setPredicted(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted font-semibold uppercase tracking-wider block mb-1">Réelle (opt.)</label>
                      <input
                        type="number" min="0" max="20" step="0.5"
                        value={actual} onChange={(e) => setActual(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </>
              )}
              {pendingGrade && (
                <div>
                  <label className="text-[10px] text-muted font-semibold uppercase tracking-wider block mb-1">Note réelle / 20</label>
                  <input
                    type="number" min="0" max="20" step="0.5"
                    value={actual} onChange={(e) => setActual(e.target.value)}
                    className={inputCls}
                    placeholder="—"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] text-muted font-semibold uppercase tracking-wider block mb-1">Date</label>
                <input
                  type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
              </div>
              <button type="submit"
                className="bg-accent text-ink font-bold rounded-lg py-3 mt-1 active:opacity-80 transition-opacity text-sm tracking-wide">
                Enregistrer
              </button>
            </form>

            {/* History */}
            {recentWithActual.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-3">Historique</p>
                <div className="flex flex-col gap-4">
                  {recentWithActual.map((g) => {
                    const delta = (g.actual as number) - g.predicted
                    return (
                      <div key={g.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-ink">{g.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold ${delta >= 0 ? 'text-success' : 'text-danger'}`}>
                              {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                            </span>
                            <span className="text-sm font-bold text-ink">{(g.actual as number).toFixed(1)}<span className="text-muted font-normal">/20</span></span>
                          </div>
                        </div>
                        <AIInsight
                          grade={g}
                          subject={s}
                          onInsightSaved={(insight) => updateGrade(g.id, { aiInsight: insight })}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
