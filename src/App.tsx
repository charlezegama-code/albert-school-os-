import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BottomNav } from './components/layout/BottomNav'
import { Dashboard } from './pages/Dashboard'
import { Agenda } from './pages/Agenda'
import { Notes } from './pages/Notes'

const PAGE_ORDER: Record<string, number> = { '/': 0, '/agenda': 1, '/notes': 2 }

export default function App() {
  const location = useLocation()
  const [direction, setDirection] = useState(0)
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  useEffect(() => {
    const prev = PAGE_ORDER[prevPathname] ?? 0
    const curr = PAGE_ORDER[location.pathname] ?? 0
    setDirection(curr >= prev ? 1 : -1)
    setPrevPathname(location.pathname)
  }, [location.pathname])

  return (
    <>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"       element={<Dashboard direction={direction} />} />
          <Route path="/agenda" element={<Agenda    direction={direction} />} />
          <Route path="/notes"  element={<Notes     direction={direction} />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </>
  )
}
