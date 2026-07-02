import { useMemo } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { useStore } from '../store/useStore'
import { SUBJECTS } from '../data/subjects'
import { EVENT_COLORS } from '../data/calendar'
import {
  getCurrentSemester, getSemesterProgress, getWeekNumber,
  getNextEvent, getActiveBDD, formatEventDate,
} from '../lib/semesterUtils'

function StatCard({ label, value, color }: { label: string; value: number | null; color: string }) {
  const pct = value !== null ? Math.min((value / 20) * 100, 100) : 0
  return (
    <div className="bg-card border border-subtle rounded-card p-4 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: value !== null ? color : '#374151' }}>
        {value !== null ? value.toFixed(1) : '—'}
      </p>
      <div className="h-px bg-subtle mt-3 mb-1">
        <div className="h-px transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[10px] text-muted">/20</p>
    </div>
  )
}

export function Dashboard({ direction }: { direction: number }) {
  const { grades, customEvents } = useStore()
  const now = new Date()

  const sem       = getCurrentSemester(now)
  const progress  = getSemesterProgress(now)
  const week      = getWeekNumber(now)
  const nextEvent = useMemo(() => getNextEvent(customEvents, now), [customEvents])
  const activeBDD = useMemo(() => getActiveBDD(now), [])

  const withActual = grades.filter((g) => g.actual !== null)
  const dataGrades = withActual.filter((g) => SUBJECTS.find((s) => s.id === g.subjectId)?.bloc === 'data')
  const bizGrades  = withActual.filter((g) => SUBJECTS.find((s) => s.id === g.subjectId)?.bloc === 'business')
  const avg = (gs: typeof grades) =>
    gs.length ? gs.reduce((s, g) => s + (g.actual ?? 0), 0) / gs.length : null

  const lastGrade   = [...withActual].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
  const lastSubject = lastGrade ? SUBJECTS.find((s) => s.id === lastGrade.subjectId) : null
  const lastDelta   = lastGrade ? (lastGrade.actual ?? 0) - lastGrade.predicted : null

  const allDeltas   = withActual.filter((g) => g.predicted !== null).map((g) => (g.actual ?? 0) - g.predicted)
  const calibration = allDeltas.length ? allDeltas.reduce((s, d) => s + d, 0) / allDeltas.length : null

  return (
    <PageShell direction={direction}>
      {/* Header */}
      <div className="px-4 pt-14 pb-5 border-b border-subtle">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Albert School · Bachelor</p>
            <h1 className="text-xl font-bold text-ink mt-0.5">Albert OS</h1>
          </div>
          <span className="bg-elevated border border-subtle text-[10px] font-semibold tracking-wide text-muted px-2.5 py-1 rounded-full">
            {sem.label} · Sem. {week}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-subtle">
            <div
              className="h-px bg-accent transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-accent tabular-nums">{progress}%</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Moyennes */}
        <div className="flex gap-3">
          <StatCard label="Data / Tech" value={avg(dataGrades)} color="#3B82F6" />
          <StatCard label="Business"    value={avg(bizGrades)}  color="#F59E0B" />
        </div>

        {/* Prochain événement */}
        {nextEvent && (
          <div className="bg-card border border-subtle rounded-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Prochain événement</p>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ color: EVENT_COLORS[nextEvent.type], background: `${EVENT_COLORS[nextEvent.type]}20` }}
              >
                {nextEvent.type}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink">{nextEvent.title}</p>
            <p className="text-xs text-muted mt-1">{formatEventDate(nextEvent)}</p>
          </div>
        )}

        {/* BDD actif */}
        {activeBDD ? (
          <div className="bg-card border border-subtle rounded-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">BDD en cours</p>
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
            </div>
            <p className="text-sm font-semibold text-ink">{activeBDD.title}</p>
            <p className="text-xs text-muted mt-1">{formatEventDate(activeBDD)}</p>
          </div>
        ) : (
          <p className="text-xs text-muted px-1">Aucun BDD actif</p>
        )}

        {/* Dernière note + Calibration */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-subtle rounded-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Dernière note</p>
            {lastGrade?.actual != null ? (
              <>
                <p className="text-[11px] text-muted truncate mb-1">{lastSubject?.name}</p>
                <p className="text-3xl font-bold text-ink">{lastGrade.actual.toFixed(1)}</p>
                <p className={`text-[10px] font-semibold mt-1 ${(lastDelta ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                  {(lastDelta ?? 0) >= 0 ? '+' : ''}{(lastDelta ?? 0).toFixed(1)} vs prédit
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-subtle">—</p>
            )}
          </div>

          <div className="bg-card border border-subtle rounded-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Calibration δ</p>
            {calibration !== null ? (
              <>
                <p className={`text-3xl font-bold ${calibration >= 0 ? 'text-success' : 'text-danger'}`}>
                  {calibration >= 0 ? '+' : ''}{calibration.toFixed(1)}
                </p>
                <p className="text-[10px] text-muted mt-1">écart moyen</p>
              </>
            ) : (
              <p className="text-3xl font-bold text-subtle">—</p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
