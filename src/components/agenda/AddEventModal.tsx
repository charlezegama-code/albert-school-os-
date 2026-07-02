import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { EventType } from '../../types'

const EVENT_TYPES: EventType[] = ['COURS', 'BDD', 'EXAMEN', 'DEVOIR', 'PERSO']

export function AddEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addEvent = useStore((s) => s.addEvent)
  const [title, setTitle]   = useState('')
  const [type, setType]     = useState<EventType>('DEVOIR')
  const [start, setStart]   = useState(new Date().toISOString().split('T')[0])
  const [end, setEnd]       = useState('')
  const [note, setNote]     = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addEvent({ title: title.trim(), type, startDate: start, endDate: end || start, note: note || null })
    setTitle(''); setNote(''); setEnd('')
    onClose()
  }

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
            className="relative w-full bg-white rounded-t-2xl p-5 pb-8"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-text">Ajouter un événement</h2>
              <button onClick={onClose} className="text-muted"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-sky"
              />
              <select
                value={type} onChange={(e) => setType(e.target.value as EventType)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-sky"
              >
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted font-medium block mb-1">Début</label>
                  <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
                    className="border border-gray-200 rounded-xl px-2 py-2 text-xs w-full focus:outline-none focus:border-sky" />
                </div>
                <div>
                  <label className="text-[10px] text-muted font-medium block mb-1">Fin (opt.)</label>
                  <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
                    className="border border-gray-200 rounded-xl px-2 py-2 text-xs w-full focus:outline-none focus:border-sky" />
                </div>
              </div>
              <input
                value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optionnel)"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-sky"
              />
              <button type="submit"
                className="bg-sky text-navy font-bold rounded-xl py-3 mt-1 active:scale-95 transition-transform">
                Ajouter
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
