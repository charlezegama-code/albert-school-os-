import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, BarChart2 } from 'lucide-react'

const TABS = [
  { path: '/',       label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/agenda', label: 'Agenda',    Icon: Calendar },
  { path: '/notes',  label: 'Notes',     Icon: BarChart2 },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-opacity active:opacity-60"
          >
            <div className={`h-0.5 w-10 rounded-full mb-1 transition-colors ${active ? 'bg-navy' : 'bg-transparent'}`} />
            <Icon size={18} className={active ? 'text-navy' : 'text-muted'} />
            <span className={`text-[9px] ${active ? 'text-navy font-bold' : 'text-muted font-medium'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
