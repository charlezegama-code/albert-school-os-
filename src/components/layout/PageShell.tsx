import { motion } from 'framer-motion'

const pageVariants = {
  initial: (dir: number) => ({ x: dir * 20, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit:    (dir: number) => ({ x: -dir * 20, opacity: 0 }),
}

export function PageShell({ children, direction }: { children: React.ReactNode; direction: number }) {
  return (
    <motion.div
      custom={direction}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col min-h-screen pb-20 bg-surface"
    >
      {children}
    </motion.div>
  )
}
