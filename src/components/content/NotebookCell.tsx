import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface NotebookCellProps {
  /** Notebook-style cell index, e.g. 1 → In [1] */
  cell: number
  title: string
  /** What we are doing in this step */
  children?: ReactNode
  code: string
  /** Text printed under Out [n] */
  output?: string
  /** Optional plot / figure shown in the output area */
  imageSrc?: string
  imageAlt?: string
}

export function NotebookCell({
  cell,
  title,
  children,
  code,
  output,
  imageSrc,
  imageAlt = 'Notebook plot output',
}: NotebookCellProps) {
  const hasOutput = Boolean(output || imageSrc)

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-xl border border-surface-600 bg-surface-900"
    >
      <div className="border-b border-surface-600 bg-surface-800/60 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-accent-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-accent-400">
            In [{cell}]:
          </span>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        {children ? (
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-300">{children}</div>
        ) : null}
      </div>

      <pre className="overflow-x-auto border-b border-surface-600 p-4 font-mono text-sm leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>

      {hasOutput ? (
        <div className="bg-emerald-500/5">
          <div className="border-b border-emerald-500/20 px-4 py-2 font-mono text-xs font-medium text-emerald-400">
            Out [{cell}]:
          </div>
          {imageSrc ? (
            <div className="border-b border-emerald-500/10 bg-surface-950/40 p-3 md:p-4">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="mx-auto max-h-80 w-full max-w-xl rounded-lg border border-surface-600 object-contain"
                loading="lazy"
              />
            </div>
          ) : null}
          {output ? (
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-200">
              <code>{output}</code>
            </pre>
          ) : null}
        </div>
      ) : null}
    </motion.section>
  )
}
