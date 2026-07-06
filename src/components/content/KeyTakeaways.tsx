import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface KeyTakeawaysProps {
  items: ReactNode[]
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-python-500/25 bg-gradient-to-br from-python-500/10 to-transparent p-5 md:p-6"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-python-400">
        Key takeaways
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-sm leading-relaxed text-slate-200">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-python-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}
