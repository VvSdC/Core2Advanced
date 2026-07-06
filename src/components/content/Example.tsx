import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'

interface ExampleProps {
  title?: string
  children: ReactNode
  output?: string
  caption?: string
}

export function Example({ title = 'Example', children, output, caption }: ExampleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="space-y-3"
    >
      <CodeBlock title={title}>{children}</CodeBlock>
      {output ? (
        <div className="overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-500/5">
          <div className="border-b border-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-400">
            Output
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-200">
            <code>{output}</code>
          </pre>
        </div>
      ) : null}
      {caption ? <p className="text-sm leading-relaxed text-slate-400">{caption}</p> : null}
    </motion.div>
  )
}
