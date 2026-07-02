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
  { path: '/notes',  label: 'Notes',     Icon: IconChart },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-subtle flex z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-opacity active:opacity-60"
          >
            <Icon active={active} />
            <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-accent' : 'text-muted'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
