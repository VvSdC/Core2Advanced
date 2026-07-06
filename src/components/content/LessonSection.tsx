import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface LessonSectionProps {
  title: string
  children: ReactNode
}

export function LessonSection({ title, children }: LessonSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-slate-300">{children}</div>
    </motion.section>
  )
}

interface LessonArticleProps {
  children: ReactNode
}

export function LessonArticle({ children }: LessonArticleProps) {
  return <article className="space-y-10 md:space-y-12">{children}</article>
}
