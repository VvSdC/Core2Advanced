import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface DefinitionProps {
  term: string
  children: ReactNode
}

export function Definition({ term, children }: DefinitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-accent-500/25 bg-gradient-to-br from-accent-500/10 to-transparent p-5 md:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">Definition</p>
      <h2 className="mt-1 text-lg font-semibold text-white md:text-xl">{term}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-300">{children}</div>
    </motion.div>
  )
}
