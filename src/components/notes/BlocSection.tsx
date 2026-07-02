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
    <section className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-muted uppercase tracking-wide px-1">
        {title}
      </p>
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          grades={grades.filter((g) => g.subjectId === subject.id)}
          onClick={() => onSubjectClick(subject.id)}
        />
      ))}
    </section>
  )
}
