import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Step {
  title: string
  description: ReactNode
}

interface StepSequenceProps {
  steps: Step[]
}

export function StepSequence({ steps }: StepSequenceProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <motion.li
          key={step.title}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="relative flex gap-4 rounded-xl border border-surface-600 bg-surface-800/50 p-4 md:p-5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-sm font-semibold text-accent-400">
            {index + 1}
          </span>
          <div>
            <h4 className="font-semibold text-white">{step.title}</h4>
            <div className="mt-1 text-sm leading-relaxed text-slate-300">{step.description}</div>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}
