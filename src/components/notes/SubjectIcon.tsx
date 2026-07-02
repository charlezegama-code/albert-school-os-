interface IconProps { size?: number; color?: string }
const S = 1.5
const L = 'round'

export function IconMaths({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <path d="M17 4H7l6 8-6 8h10" />
    </svg>
  )
}

export function IconPython({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <polyline points="8,9 4,12 8,15" />
      <polyline points="16,9 20,12 16,15" />
      <line x1="13" y1="8" x2="11" y2="16" />
    </svg>
  )
}

export function IconSQL({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  )
}

export function IconDataScience({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <circle cx="6"  cy="8"  r="1.5" fill={color} />
      <circle cx="14" cy="6"  r="1.5" fill={color} />
      <circle cx="9"  cy="15" r="1.5" fill={color} />
      <circle cx="18" cy="13" r="1.5" fill={color} />
      <circle cx="13" cy="19" r="1.5" fill={color} />
    </svg>
  )
}

export function IconDeepLearning({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <circle cx="5"  cy="8"  r="2" />
      <circle cx="5"  cy="16" r="2" />
      <circle cx="13" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" />
      <line x1="7"  y1="8"  x2="11" y2="12" />
      <line x1="7"  y1="16" x2="11" y2="12" />
      <line x1="15" y1="12" x2="18" y2="12" />
    </svg>
  )
}

export function IconFinance({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <polyline points="4,18 9,11 13,14 18,7" />
      <line x1="3" y1="20" x2="21" y2="20" />
      <polyline points="16,7 18,7 18,9" />
    </svg>
  )
}

export function IconMarketing({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <path d="M3 10v4h4l7 5V5L7 10H3z" />
      <path d="M18.36 6.64a9 9 0 0 1 0 10.72" />
      <path d="M15.54 9.46a5 5 0 0 1 0 5.08" />
    </svg>
  )
}

export function IconStrategie({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  )
}

export function IconSupply({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <rect x="2"  y="10" width="5" height="4" rx="1" />
      <rect x="10" y="10" width="5" height="4" rx="1" />
      <rect x="18" y="10" width="4" height="4" rx="1" />
      <line x1="7"  y1="12" x2="10" y2="12" />
      <line x1="15" y1="12" x2="18" y2="12" />
    </svg>
  )
}

export function IconSoftSkills({ size = 24, color = '#3B82F6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={S} strokeLinecap={L} strokeLinejoin={L}>
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
    </svg>
  )
}

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  maths:        IconMaths,
  python:       IconPython,
  sql:          IconSQL,
  datascience:  IconDataScience,
  deeplearning: IconDeepLearning,
  finance:      IconFinance,
  marketing:    IconMarketing,
  strategie:    IconStrategie,
  supply:       IconSupply,
  softskills:   IconSoftSkills,
}

export function SubjectIcon({ subjectId, size = 18, color = '#3B82F6' }: { subjectId: string; size?: number; color?: string }) {
  const Icon = ICON_MAP[subjectId]
  if (!Icon) return <span className="text-xs font-bold" style={{ color }}>{subjectId[0].toUpperCase()}</span>
  return <Icon size={size} color={color} />
}
