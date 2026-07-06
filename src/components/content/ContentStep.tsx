import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ContentStepProps {
  number: number
  title: string
  children: ReactNode
}

export function ContentStep({ number, title, children }: ContentStepProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-600 bg-surface-800 text-sm font-bold text-accent-400">
          {number}
        </span>
        <div className="min-w-0 flex-1 space-y-4">
          <h2 className="pt-1 text-xl font-semibold tracking-tight text-white">{title}</h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-300">{children}</div>
        </div>
      </div>
    </motion.section>
  )
}
