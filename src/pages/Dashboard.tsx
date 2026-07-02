import { useMemo } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Card } from '../components/ui/Card'
import { useStore } from '../store/useStore'
import { SUBJECTS } from '../data/subjects'
import { EVENT_COLORS } from '../data/calendar'
import {
  getCurrentSemester, getSemesterProgress, getWeekNumber,
  getNextEvent, getActiveBDD, formatEventDate,
} from '../lib/semesterUtils'

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

  const allDeltas   = withActual.map((g) => (g.actual ?? 0) - g.predicted)
  const calibration = allDeltas.length ? allDeltas.reduce((s, d) => s + d, 0) / allDeltas.length : null

  const todayFmt = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <PageShell direction={direction}>
      {/* Header navy */}
      <div className="bg-navy px-4 pt-12 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-white/60 text-xs font-medium">Bonjour Charles 👋</p>
            <p className="text-white font-bold text-sm mt-0.5 capitalize">{todayFmt}</p>
          </div>
          <span className="bg-sky/20 text-sky text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
            Sem. {week} · {sem.label}
          </span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[9px] text-white/50 mb-1">
            <span>Semestre {sem.label}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/15 rounded-full">
            <div
              className="h-1.5 bg-sky rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grille mixte */}
      <div className="p-3 flex flex-col gap-2.5">
        {/* Prochain événement — full width */}
        {nextEvent && (
          <Card className="p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wide text-muted">Prochain événement</span>
              <div className="w-2 h-2 rounded-full" style={{ background: EVENT_COLORS[nextEvent.type] }} />
            </div>
            <p className="text-sm font-bold text-text">{nextEvent.title}</p>
            <p className="text-[10px] text-muted mt-0.5">{formatEventDate(nextEvent)}</p>
          </Card>
        )}

        {/* 2 colonnes : moyennes */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Moy. Data/Tech', value: avg(dataGrades), color: '#5BC4F5' },
            { label: 'Moy. Business',  value: avg(bizGrades),  color: '#F59E0B' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-card p-2.5 bg-navy">
              <p className="text-[9px] font-bold uppercase tracking-wide text-white/50 mb-1">{label}</p>
              <p className="text-xl font-extrabold" style={{ color }}>
                {value !== null ? value.toFixed(1) : '—'}
              </p>
              <div className="h-1 bg-white/10 rounded-full mt-1.5">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: value !== null ? `${Math.min((value / 20) * 100, 100)}%` : '0%', background: color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* BDD en cours — full width */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wide text-muted">BDD en cours</span>
            <div className="w-2 h-2 rounded-full bg-amber" />
          </div>
          {activeBDD ? (
            <>
              <p className="text-sm font-bold text-text">{activeBDD.title}</p>
              <p className="text-[10px] text-muted mt-0.5">{formatEventDate(activeBDD)}</p>
            </>
          ) : (
            <p className="text-sm text-muted">Pas de BDD en cours</p>
          )}
        </Card>

        {/* 2 colonnes : dernière note + calibration */}
        <div className="grid grid-cols-2 gap-2.5">
          <Card className="p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wide text-muted mb-1">Dernière note</p>
            {lastGrade?.actual != null ? (
              <>
                <p className="text-[10px] font-semibold text-text truncate">
                  {lastSubject?.emoji} {lastSubject?.name}
                </p>
                <p className="text-2xl font-extrabold text-navy">{lastGrade.actual}</p>
                <p className={`text-[9px] font-bold ${lastGrade.actual - lastGrade.predicted >= 0 ? 'text-green' : 'text-red'}`}>
                  {lastGrade.actual - lastGrade.predicted >= 0 ? '+' : ''}
                  {(lastGrade.actual - lastGrade.predicted).toFixed(1)} vs prédit
                </p>
              </>
            ) : (
              <p className="text-2xl font-extrabold text-gray-200">—</p>
            )}
          </Card>

          <Card className="p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wide text-muted mb-1">Calibration δ</p>
            {calibration !== null ? (
              <>
                <p className={`text-2xl font-extrabold ${calibration >= 0 ? 'text-green' : 'text-red'}`}>
                  {calibration >= 0 ? '+' : ''}{calibration.toFixed(1)}
                </p>
                <p className="text-[9px] text-muted">moy. écart</p>
              </>
            ) : (
              <p className="text-2xl font-extrabold text-gray-200">—</p>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
