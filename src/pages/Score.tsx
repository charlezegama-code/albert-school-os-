import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { PageShell } from '../components/layout/PageShell'
import { SUBJECTS, DATA_SUBJECTS, BIZ_SUBJECTS } from '../data/subjects'
import { OFFICIAL_EVENTS } from '../data/calendar'
import { EVENT_COLORS } from '../data/calendar'
import { useStore } from '../store/useStore'
import { SubjectIcon } from '../components/notes/SubjectIcon'
import { toDateStr } from '../lib/calendarUtils'
import type { Subject, Grade } from '../types'

// ── Helpers ────────────────────────────────────────────────────────────────

function getWeekStart(date = new Date()): string {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  return toDateStr(d)
}

function avgForBloc(grades: Grade[], subjects: Subject[]): number | null {
  const ids = new Set(subjects.map((s) => s.id))
  const actual = grades.filter((g) => ids.has(g.subjectId) && g.actual !== null)
  if (!actual.length) return null
  return actual.reduce((sum, g) => sum + (g.actual as number), 0) / actual.length
}

function scoreColor(score: number): string {
  if (score < 50) return '#EF4444'
  if (score < 70) return '#F59E0B'
  return '#10B981'
}

// ── Gauge Arc ──────────────────────────────────────────────────────────────

function GaugeArc({ score, color }: { score: number; color: string }) {
  const r = 76
  const cx = 110, cy = 100
  const circumference = Math.PI * r
  const dashOffset = circumference * (1 - Math.min(score, 100) / 100)

  const trackD = `M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`

  return (
    <svg viewBox="0 0 220 110" className="w-full max-w-[260px] mx-auto" aria-hidden="true">
      <path d={trackD} fill="none" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />
      <motion.path
        d={trackD}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ── Timeline ───────────────────────────────────────────────────────────────

function Timeline() {
  const todayStr = toDateStr(new Date())
  const milestones = OFFICIAL_EVENTS
    .filter((e) => ['BDD', 'EXAMEN', 'PERSO'].includes(e.type))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-4 min-w-max">
        {milestones.map((e) => {
          const past = e.endDate < todayStr
          const color = EVENT_COLORS[e.type]
          return (
            <div key={e.id} className="flex flex-col items-center gap-1.5 w-20">
              <div
                className="w-2.5 h-2.5 rounded-full border-2 shrink-0 transition-colors"
                style={past
                  ? { background: color, borderColor: color }
                  : { borderColor: '#6B7280', background: 'transparent' }
                }
              />
              <p className="text-[10px] font-medium text-center leading-tight truncate w-full text-center"
                style={{ color: past ? color : '#6B7280' }}>
                {e.title}
              </p>
              <p className="text-[9px] text-muted text-center">
                {new Date(e.startDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )
        })}
      </div>
      {/* Connecting line */}
      <div className="relative">
        <div className="absolute top-[-90px] left-1 right-1 h-px bg-subtle" style={{ zIndex: 0 }} />
      </div>
    </div>
  )
}

// ── Objectives ─────────────────────────────────────────────────────────────

function ObjectiveRow({ subject, grades, target, onSave }: {
  subject: Subject
  grades: { actual: number | null }[]
  target: number | undefined
  onSave: (v: number) => void
}) {
  const [value, setValue] = useState(target?.toString() ?? '')

  useEffect(() => {
    setValue(target?.toString() ?? '')
  }, [target])

  const withActual = grades.filter((g) => g.actual !== null)
  const avg = withActual.length > 0
    ? withActual.reduce((s, g) => s + (g.actual as number), 0) / withActual.length
    : null

  const color = subject.bloc === 'data' ? '#3B82F6' : '#F59E0B'
  const pct = avg !== null && target ? Math.min((avg / target) * 100, 100) : 0
  const achieved = avg !== null && target !== undefined && avg >= target
  const close    = avg !== null && target !== undefined && !achieved && (target - avg) < 2

  const barColor = achieved ? '#10B981' : close ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex items-center gap-3 py-3 border-b border-subtle last:border-0">
      <div className="w-8 h-8 bg-elevated rounded-lg flex items-center justify-center shrink-0">
        <SubjectIcon subjectId={subject.id} size={16} color={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-ink truncate mr-2">{subject.name}</p>
          <span className="text-[10px] text-muted shrink-0">
            {avg !== null ? avg.toFixed(1) : '—'}{target !== undefined ? `/${target}` : ''}
          </span>
        </div>
        <div className="h-1 bg-subtle rounded-full">
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: target !== undefined && avg !== null ? barColor : '#374151' }}
          />
        </div>
      </div>
      <input
        type="number" min="0" max="20" step="0.5"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          const n = parseFloat(value)
          if (!isNaN(n) && n >= 0 && n <= 20) onSave(n)
        }}
        placeholder="—"
        className="w-10 text-center bg-elevated border border-subtle rounded text-[11px] text-ink focus:outline-none focus:border-accent py-1"
      />
    </div>
  )
}

// ── Weekly Intensity ───────────────────────────────────────────────────────

function WeeklyIntensityWidget() {
  const { weeklyIntensity, setWeekIntensity } = useStore()
  const thisWeek = getWeekStart()
  const current = weeklyIntensity.find((w) => w.weekStart === thisWeek)?.value ?? 0

  const chartData = weeklyIntensity.slice(-8).map((w) => ({
    week: w.weekStart.slice(5),
    value: w.value,
  }))

  const labels = ['', 'Légère', 'Normale', 'Intense', 'Dense', 'Extrême']

  return (
    <div className="bg-card border border-subtle rounded-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-4">Intensité de la semaine</p>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl font-bold text-ink w-8">{current || '—'}</span>
        <div className="flex-1">
          <input
            type="range" min="1" max="5" step="1"
            value={current || 1}
            onChange={(e) => setWeekIntensity(thisWeek, parseInt(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[9px] text-muted mt-0.5">
            {[1,2,3,4,5].map((n) => <span key={n}>{n}</span>)}
          </div>
        </div>
      </div>
      {current > 0 && <p className="text-[10px] text-muted mb-4">{labels[current]}</p>}

      {chartData.length >= 2 && (
        <div className="h-16 -mx-1 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis domain={[0, 5]} hide />
              <Tooltip
                contentStyle={{ background: '#1C2333', border: '1px solid #1F2937', borderRadius: 6, fontSize: 10, color: '#F9FAFB' }}
                cursor={{ stroke: '#1F2937' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={1.5}
                dot={{ r: 2, fill: '#3B82F6', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────

export function Score({ direction }: { direction: number }) {
  const { grades, objectives, setObjective } = useStore()

  const dataAvg = avgForBloc(grades, DATA_SUBJECTS)
  const bizAvg  = avgForBloc(grades, BIZ_SUBJECTS)

  const hasScore = dataAvg !== null || bizAvg !== null
  const da = dataAvg ?? 0
  const ba = bizAvg  ?? 0
  const score = hasScore
    ? Math.round(((da * 0.6) + (ba * 0.4)) * 5)
    : 0
  const color = scoreColor(score)

  const withBoth = grades.filter((g) => g.actual !== null)
  const allAbsDeltas = withBoth.map((g) => Math.abs((g.actual as number) - g.predicted))
  const calibrationErr = allAbsDeltas.length
    ? allAbsDeltas.reduce((s, d) => s + d, 0) / allAbsDeltas.length
    : null

  const calibrationLabel =
    calibrationErr === null ? null
    : calibrationErr < 1 ? 'Excellente calibration'
    : calibrationErr < 2 ? 'Calibration correcte'
    : 'Tu te sur/sous-estimes'

  return (
    <PageShell direction={direction}>
      {/* Header */}
      <div className="px-4 pt-14 pb-4 border-b border-subtle">
        <h1 className="text-xl font-bold text-ink">Score · Charles</h1>
        <p className="text-[11px] text-muted mt-0.5">Bachelor Data & IA · Albert School Paris · 2026–2027</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Gauge hero */}
        <div className="bg-card border border-subtle rounded-card px-4 pt-6 pb-4 flex flex-col items-center">
          {hasScore ? (
            <>
              <GaugeArc score={score} color={color} />
              <p className="text-5xl font-bold mt-1" style={{ color }}>{score}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mt-1">Score Global · /100</p>
              <div className="flex gap-6 mt-4 pt-4 border-t border-subtle w-full justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wider">Data/Tech</p>
                  <p className="text-lg font-bold text-accent">{dataAvg?.toFixed(1) ?? '—'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted uppercase tracking-wider">Business</p>
                  <p className="text-lg font-bold text-warning">{bizAvg?.toFixed(1) ?? '—'}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-4xl font-bold text-subtle">—</p>
              <p className="text-xs text-muted mt-2">Commence à noter pour voir ton score</p>
            </div>
          )}
        </div>

        {/* Calibration */}
        <div className="bg-card border border-subtle rounded-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-3">Calibration prédictions</p>
          {calibrationErr !== null ? (
            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold text-ink">
                {calibrationErr.toFixed(1)}
                <span className="text-base font-normal text-muted"> pts</span>
              </p>
              <div className="pb-1">
                <p className="text-[10px] text-muted">Écart moyen prédit/réel</p>
                <p className="text-xs font-semibold mt-0.5" style={{
                  color: calibrationErr < 1 ? '#10B981' : calibrationErr < 2 ? '#F59E0B' : '#EF4444'
                }}>
                  {calibrationLabel}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">Ajoute des notes prédites + réelles pour mesurer ta calibration</p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card border border-subtle rounded-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-4">Jalons de l'année</p>
          <Timeline />
        </div>

        {/* Objectifs */}
        <div className="bg-card border border-subtle rounded-card px-4 py-2">
          <div className="flex items-center justify-between py-2 border-b border-subtle mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Objectifs par matière</p>
            <p className="text-[9px] text-muted">Cible /20</p>
          </div>
          {SUBJECTS.map((subject) => (
            <ObjectiveRow
              key={subject.id}
              subject={subject}
              grades={grades.filter((g) => g.subjectId === subject.id)}
              target={objectives[subject.id]}
              onSave={(v) => setObjective(subject.id, v)}
            />
          ))}
        </div>

        {/* Intensité hebdo */}
        <WeeklyIntensityWidget />
      </div>
    </PageShell>
  )
}
