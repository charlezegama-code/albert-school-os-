import type { Subject, Grade } from '../../types'
import { SubjectCard } from './SubjectCard'

interface BlocSectionProps {
  title: string
  subjects: Subject[]
  grades: Grade[]
  onSubjectClick: (subjectId: string) => void
}

export function BlocSection({ title, subjects, grades, onSubjectClick }: BlocSectionProps) {
  return (
    <section>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2 px-1">{title}</p>
      <div className="bg-card border border-subtle rounded-card px-4">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            grades={grades.filter((g) => g.subjectId === subject.id)}
            onClick={() => onSubjectClick(subject.id)}
          />
        ))}
      </div>
    </section>
  )
}
