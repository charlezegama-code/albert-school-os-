import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { MonthGrid } from '../components/agenda/MonthGrid'
import { WeekStrip, getWeekEventList } from '../components/agenda/WeekStrip'
import { UpcomingList } from '../components/agenda/UpcomingList'
import { AddEventModal } from '../components/agenda/AddEventModal'
import { EVENT_COLORS } from '../data/calendar'
import { useStore } from '../store/useStore'

type ViewMode = 'month' | 'week'

function fmtDate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function Agenda({ direction }: { direction: number }) {
  const { customEvents } = useStore()
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [currentDate, setDate]  = useState(new Date())
  const [addOpen, setAddOpen]   = useState(false)

  function shift(delta: number) {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + delta)
    else d.setDate(d.getDate() + delta * 7)
    setDate(d)
  }

  const monthLabel = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const weekEvents = viewMode === 'week' ? getWeekEventList(currentDate, customEvents) : []

  return (
    <PageShell direction={direction}>
      {/* Header */}
      <div className="px-4 pt-14 pb-4 border-b border-subtle">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-ink">Agenda</h1>
          <div className="flex bg-elevated border border-subtle rounded-lg overflow-hidden">
            {(['month', 'week'] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`text-[10px] font-semibold tracking-wide px-3 py-1.5 transition-colors ${
                  viewMode === m ? 'bg-accent text-ink' : 'text-muted'
                }`}
              >
                {m === 'month' ? 'Mois' : 'Sem.'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => shift(-1)} className="text-muted p-1 active:text-ink transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-ink capitalize">{monthLabel}</span>
          <button onClick={() => shift(+1)} className="text-muted p-1 active:text-ink transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-3 pt-3 pb-2">
        {viewMode === 'month'
          ? <MonthGrid year={currentDate.getFullYear()} month={currentDate.getMonth()} customEvents={customEvents} />
          : <WeekStrip referenceDate={currentDate} customEvents={customEvents} />
        }
      </div>

      {/* Week event list */}
      {viewMode === 'week' && (
        <div className="px-4 flex flex-col gap-0">
          {weekEvents.length === 0
            ? <p className="text-muted text-sm text-center py-8">Aucun événement cette semaine</p>
            : weekEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-3 py-3 border-b border-subtle last:border-0">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: EVENT_COLORS[e.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{e.title}</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {fmtDate(e.startDate)}{e.startDate !== e.endDate ? ` → ${fmtDate(e.endDate)}` : ''}
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{ color: EVENT_COLORS[e.type], background: `${EVENT_COLORS[e.type]}20` }}
                >
                  {e.type}
                </span>
              </div>
            ))
          }
        </div>
      )}

      {viewMode === 'month' && <UpcomingList customEvents={customEvents} />}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-4 w-12 h-12 bg-accent rounded-xl flex items-center justify-center z-40 active:opacity-80 transition-opacity shadow-lg"
      >
        <Plus size={20} className="text-ink" />
      </button>

      <AddEventModal open={addOpen} onClose={() => setAddOpen(false)} />
    </PageShell>
  )
}
