import { useLocation, useNavigate } from 'react-router-dom'

function IconDashboard({ active }: { active: boolean }) {
  const c = active ? '#3B82F6' : '#6B7280'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconCalendar({ active }: { active: boolean }) {
  const c = active ? '#3B82F6' : '#6B7280'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function IconScore({ active }: { active: boolean }) {
  const c = active ? '#3B82F6' : '#6B7280'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17 A10 10 0 0 1 20 17" />
      <line x1="12" y1="17" x2="16" y2="10" />
      <circle cx="12" cy="17" r="1.5" fill={c} stroke="none" />
    </svg>
  )
}

function IconChart({ active }: { active: boolean }) {
  const c = active ? '#3B82F6' : '#6B7280'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20V10M9 20V4M15 20v-8M21 20v-5" />
    </svg>
  )
}

const TABS = [
  { path: '/',       label: 'Dashboard', Icon: IconDashboard },
  { path: '/agenda', label: 'Agenda',    Icon: IconCalendar },
  { path: '/score',  label: 'Score',     Icon: IconScore },
  { path: '/notes',  label: 'Notes',     Icon: IconChart },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-subtle flex z-60"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}
    >
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center gap-1 pt-2 pb-1 transition-opacity active:opacity-60"
          >
            <Icon active={active} />
            <span className={`text-[9px] font-medium tracking-wide ${active ? 'text-accent' : 'text-muted'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
