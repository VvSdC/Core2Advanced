import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const variants = {
  info: {
    border: 'border-accent-500/30',
    bg: 'bg-accent-500/10',
    icon: 'text-accent-400',
    label: 'Note',
  },
  tip: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    label: 'Tip',
  },
  insight: {
    border: 'border-python-500/30',
    bg: 'bg-python-500/10',
    icon: 'text-python-400',
    label: 'Insight',
  },
  beginner: {
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    icon: 'text-violet-400',
    label: 'In simple terms',
  },
} as const

type CalloutVariant = keyof typeof variants

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: ReactNode
}

export function Callout({ variant = 'info', title, children }: CalloutProps) {
  const style = variants[variant]

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl border ${style.border} ${style.bg} p-4 md:p-5`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider ${style.icon}`}>
        {title ?? style.label}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-slate-300">{children}</div>
    </motion.aside>
  )
}
