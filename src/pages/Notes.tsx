import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { GaugeBar } from '../components/ui/GaugeBar'
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

  function avgForBloc(subjects: Subject[]): number | null {
    const ids = new Set(subjects.map((s) => s.id))
    const actual = grades.filter((g) => ids.has(g.subjectId) && g.actual !== null)
    if (actual.length === 0) return null
    return actual.reduce((sum, g) => sum + (g.actual as number), 0) / actual.length
  }

  const dataAvg = avgForBloc(DATA_SUBJECTS)
  const bizAvg  = avgForBloc(BIZ_SUBJECTS)

  return (
    <PageShell direction={direction}>
      <div className="bg-navy px-4 pt-12 pb-5">
        <h1 className="text-white font-bold text-base mb-4">Notes & Scores</h1>
        <div className="flex gap-3">
          <GaugeBar label="Data / Tech" value={dataAvg} color="#5BC4F5" />
          <GaugeBar label="Business" value={bizAvg} color="#F59E0B" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
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
