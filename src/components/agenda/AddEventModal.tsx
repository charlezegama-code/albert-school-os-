import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { toDateStr } from '../../lib/calendarUtils'
import type { EventType } from '../../types'

const EVENT_TYPES: EventType[] = ['COURS', 'BDD', 'EXAMEN', 'DEVOIR', 'PERSO']

const inputCls = 'bg-elevated border border-subtle rounded-lg px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent w-full'

export function AddEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addEvent = useStore((s) => s.addEvent)
  const [title, setTitle] = useState('')
  const [type, setType]   = useState<EventType>('DEVOIR')
  const [start, setStart] = useState(toDateStr(new Date()))
  const [end, setEnd]     = useState('')
  const [note, setNote]   = useState('')

  useEffect(() => {
    if (open) {
      setTitle(''); setType('DEVOIR')
      setStart(toDateStr(new Date()))
      setEnd(''); setNote('')
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    if (end && end < start) return
    addEvent({ title: title.trim(), type, startDate: start, endDate: end || start, note: note || null })
    onClose()
  }

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
            className="relative w-full bg-card border-t border-subtle rounded-t-2xl p-5 z-50"
            style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-ink">Ajouter un événement</h2>
              <button onClick={onClose} className="text-muted active:text-ink transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
                className={inputCls}
              />
              <select
                value={type} onChange={(e) => setType(e.target.value as EventType)}
                className={inputCls}
              >
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted font-semibold uppercase tracking-wider block mb-1">Début</label>
                  <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] text-muted font-semibold uppercase tracking-wider block mb-1">Fin (opt.)</label>
                  <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={inputCls} />
                </div>
              </div>
              <input
                value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optionnel)"
                className={inputCls}
              />
              <button type="submit"
                className="bg-accent text-ink font-bold rounded-lg py-3 mt-1 active:opacity-80 transition-opacity text-sm tracking-wide">
                Ajouter
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
