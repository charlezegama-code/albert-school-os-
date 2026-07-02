import type { Subject } from '../types'

export const SUBJECTS: Subject[] = [
  { id: 'maths',        name: 'Mathématiques',               emoji: '📐', bloc: 'data' },
  { id: 'python',       name: 'Python & Programmation',      emoji: '🐍', bloc: 'data' },
  { id: 'sql',          name: 'SQL & Data',                  emoji: '🗄️', bloc: 'data' },
  { id: 'datascience',  name: 'Data Science & ML',           emoji: '🤖', bloc: 'data' },
  { id: 'deeplearning', name: 'Deep Learning & IA',          emoji: '🧠', bloc: 'data' },
  { id: 'finance',      name: 'Finance & Comptabilité',      emoji: '💰', bloc: 'business' },
  { id: 'marketing',    name: 'Marketing',                   emoji: '📣', bloc: 'business' },
  { id: 'strategie',    name: 'Stratégie & Entrepreneuriat', emoji: '🎯', bloc: 'business' },
  { id: 'supply',       name: 'Supply Chain & Économie',     emoji: '🔗', bloc: 'business' },
  { id: 'softskills',   name: 'Soft Skills & Leadership',    emoji: '🤝', bloc: 'business' },
]

export const DATA_SUBJECTS = SUBJECTS.filter((s) => s.bloc === 'data')
export const BIZ_SUBJECTS  = SUBJECTS.filter((s) => s.bloc === 'business')
