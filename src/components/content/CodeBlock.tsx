import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CodeBlockProps {
  title?: string
  children: ReactNode
}

export function CodeBlock({ title, children }: CodeBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-xl border border-surface-600 bg-surface-900"
    >
      {title ? (
        <div className="border-b border-surface-600 px-4 py-2 text-xs font-medium text-slate-400">
          {title}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-200">
        <code>{children}</code>
      </pre>
    </motion.div>
  )
}
