import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { MonthGrid } from '../components/agenda/MonthGrid'
import { WeekStrip, getWeekEventList } from '../components/agenda/WeekStrip'
import { UpcomingList } from '../components/agenda/UpcomingList'
import { AddEventModal } from '../components/agenda/AddEventModal'
import { Badge } from '../components/ui/Badge'
import { EVENT_COLORS } from '../data/calendar'
import { useStore } from '../store/useStore'

type ViewMode = 'month' | 'week'

function fmtDate(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function Agenda({ direction }: { direction: number }) {
  const { customEvents } = useStore()
  const [viewMode, setViewMode]   = useState<ViewMode>('month')
  const [currentDate, setDate]    = useState(new Date())
  const [addOpen, setAddOpen]     = useState(false)

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
      <div className="bg-navy px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white font-bold text-base">Agenda</h1>
          <div className="flex bg-white/10 rounded-lg overflow-hidden">
            {(['month', 'week'] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`text-[10px] font-bold px-3 py-1.5 transition-colors ${
                  viewMode === m ? 'bg-sky text-navy' : 'text-white/60'
                }`}
              >
                {m === 'month' ? 'Mois' : 'Sem.'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => shift(-1)} className="text-white/60 p-1"><ChevronLeft size={16} /></button>
          <span className="text-white font-semibold text-sm capitalize">{monthLabel}</span>
          <button onClick={() => shift(+1)} className="text-white/60 p-1"><ChevronRight size={16} /></button>
        </div>
        {viewMode === 'month'
          ? <MonthGrid year={currentDate.getFullYear()} month={currentDate.getMonth()} customEvents={customEvents} />
          : <WeekStrip referenceDate={currentDate} customEvents={customEvents} />
        }
      </div>

      {viewMode === 'week' && (
        <div className="p-3 flex flex-col gap-2">
          {weekEvents.length === 0
            ? <p className="text-muted text-sm text-center py-6">Aucun événement cette semaine</p>
            : weekEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-2 bg-white rounded-lg p-2.5 shadow-sm">
                <div className="w-0.5 self-stretch rounded-full" style={{ background: EVENT_COLORS[e.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-text truncate">{e.title}</p>
                  <p className="text-[9px] text-muted">
                    {fmtDate(e.startDate)}{e.startDate !== e.endDate ? ` → ${fmtDate(e.endDate)}` : ''}
                  </p>
                </div>
                <Badge type={e.type} />
              </div>
            ))
          }
        </div>
      )}

      {viewMode === 'month' && <UpcomingList customEvents={customEvents} />}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-4 w-12 h-12 bg-sky rounded-full flex items-center justify-center shadow-lg z-40 active:scale-95 transition-transform"
      >
        <Plus size={22} className="text-navy" />
      </button>

      <AddEventModal open={addOpen} onClose={() => setAddOpen(false)} />
    </PageShell>
  )
}
