import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ResearchPaperHeaderProps {
  title: string
  authors: string
  year: string
  venue?: string
  url: string
  children?: ReactNode
}

export function ResearchPaperHeader({
  title,
  authors,
  year,
  venue,
  url,
  children,
}: ResearchPaperHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-genai-500/30 bg-genai-500/10 p-5 md:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-genai-400">Research Paper</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-start gap-2 text-lg font-semibold text-white transition-colors hover:text-genai-400 md:text-xl"
      >
        {title}
        <ExternalLink className="mt-1 h-4 w-4 shrink-0 opacity-70" />
      </a>
      <p className="mt-2 text-sm text-slate-400">
        {authors} — {year}
        {venue ? ` · ${venue}` : ''}
      </p>
      {children ? <div className="mt-3 text-sm leading-relaxed text-slate-300">{children}</div> : null}
    </motion.div>
  )
}
