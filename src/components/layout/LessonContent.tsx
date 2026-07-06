import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLayoutEffect } from 'react'
import type { Lesson, SubTopic, Topic } from '../../content/types'

interface LessonContentProps {
  topic: Topic
  subTopic: SubTopic
  lesson: Lesson
  previous: Lesson | null
  next: Lesson | null
}

export function LessonContent({ topic, subTopic, lesson, previous, next }: LessonContentProps) {
  const LessonComponent = lesson.component
  const basePath = `/${topic.id}/${subTopic.id}`

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [lesson.id])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1"
      >
        <header className="border-b border-surface-700/80 bg-surface-900/30 px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="text-python-400">{topic.title}</span>
            <span>/</span>
            <span>{subTopic.title}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            {lesson.title}
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-400">
            {lesson.description}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>{lesson.readTime} read</span>
          </div>
        </header>

        <div className="px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-3xl">
            <LessonComponent />
          </div>
        </div>
      </motion.div>

      <footer className="border-t border-surface-700 bg-surface-900/40 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-3xl items-stretch justify-between gap-4">
          {previous ? (
            <Link
              to={`${basePath}/${previous.id}`}
              className="group flex min-w-0 flex-1 flex-col rounded-lg border border-surface-600 px-4 py-3 transition-colors hover:border-surface-500 hover:bg-surface-800/50"
            >
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <ArrowLeft className="h-3 w-3" />
                Previous
              </span>
              <span className="mt-1 truncate text-sm font-medium text-slate-200 group-hover:text-white">
                {previous.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link
              to={`${basePath}/${next.id}`}
              className="group flex min-w-0 flex-1 flex-col items-end rounded-lg border border-surface-600 px-4 py-3 text-right transition-colors hover:border-accent-500/40 hover:bg-accent-500/5"
            >
              <span className="flex items-center gap-1 text-xs text-slate-500">
                Next
                <ArrowRight className="h-3 w-3" />
              </span>
              <span className="mt-1 truncate text-sm font-medium text-slate-200 group-hover:text-white">
                {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </footer>
    </div>
  )
}
