import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { BlocSection } from '../components/notes/BlocSection'
import { GradeModal } from '../components/notes/GradeModal'
import { DATA_SUBJECTS, BIZ_SUBJECTS, SUBJECTS } from '../data/subjects'
import { useStore } from '../store/useStore'
import type { Subject } from '../types'

export function Notes({ direction }: { direction: number }) {
  const { grades } = useStore()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function openModal(subjectId: string) {
    const subject = SUBJECTS.find((s) => s.id === subjectId) ?? null
    setSelectedSubject(subject)
    setModalOpen(true)
  }

  function avg(subjects: Subject[]): number | null {
    const ids = new Set(subjects.map((s) => s.id))
    const actual = grades.filter((g) => ids.has(g.subjectId) && g.actual !== null)
    if (!actual.length) return null
    return actual.reduce((sum, g) => sum + (g.actual as number), 0) / actual.length
  }

  const dataAvg = avg(DATA_SUBJECTS)
  const bizAvg  = avg(BIZ_SUBJECTS)

  return (
    <PageShell direction={direction}>
      {/* Header */}
      <div className="px-4 pt-14 pb-4 border-b border-subtle">
        <h1 className="text-xl font-bold text-ink mb-3">Notes</h1>
        <div className="flex gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Data / Tech</p>
            <p className="text-2xl font-bold text-accent mt-0.5">
              {dataAvg !== null ? dataAvg.toFixed(1) : <span className="text-subtle">—</span>}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Business</p>
            <p className="text-2xl font-bold text-warning mt-0.5">
              {bizAvg !== null ? bizAvg.toFixed(1) : <span className="text-subtle">—</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-5">
        <BlocSection
          title="Data / Tech"
          subjects={DATA_SUBJECTS}
          grades={grades}
          onSubjectClick={openModal}
        />
        <BlocSection
          title="Business"
          subjects={BIZ_SUBJECTS}
          grades={grades}
          onSubjectClick={openModal}
        />
      </div>

      <GradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subject={selectedSubject}
      />
    </PageShell>
  )
}
