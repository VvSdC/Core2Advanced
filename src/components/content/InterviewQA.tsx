import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface InterviewQAProps {
  number: number
  question: string
  children: ReactNode
}

export function InterviewQA({ number, question, children }: InterviewQAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-surface-600 bg-surface-800/40 p-4 md:p-5"
    >
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-python-500/15 text-xs font-bold text-python-400">
          {number}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <h3 className="font-semibold leading-snug text-white">{question}</h3>
          <div className="space-y-2 text-sm leading-relaxed text-slate-300 md:text-base">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface InterviewSectionProps {
  title: string
  children: ReactNode
}

export function InterviewSection({ title, children }: InterviewSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
