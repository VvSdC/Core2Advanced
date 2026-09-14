import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import type { LessonSection, SubTopic, Topic } from '../../content/types'
import { getTopicAccent } from '../../lib/topic-accent'

interface SubTopicSectionsHubProps {
  topic: Topic
  subTopic: SubTopic
}

function SectionCard({
  topicId,
  subTopicId,
  section,
  index,
}: {
  topicId: string
  subTopicId: string
  section: LessonSection
  index: number
}) {
  const firstLesson = section.lessons[0]
  const lessonCount = section.lessons.length
  const href = firstLesson
    ? `/${topicId}/${subTopicId}/${firstLesson.id}`
    : `/${topicId}/${subTopicId}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={href}
        className="group flex h-full flex-col rounded-2xl border border-surface-600 bg-surface-900/60 p-6 transition-all hover:border-accent-500/40 hover:bg-surface-800/60"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white transition-colors group-hover:text-accent-400">
          {section.title}
        </h2>
        {firstLesson ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
            Starts with: {firstLesson.title}
          </p>
        ) : (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">Lessons coming soon</p>
        )}
        {section.lessons.length > 1 ? (
          <ul className="mt-4 space-y-1 text-xs text-slate-500">
            {section.lessons.slice(0, 3).map((lesson) => (
              <li key={lesson.id} className="truncate">
                · {lesson.title}
              </li>
            ))}
            {section.lessons.length > 3 ? (
              <li className="text-slate-600">· +{section.lessons.length - 3} more</li>
            ) : null}
          </ul>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-400">
          Open
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  )
}

export function SubTopicSectionsHub({ topic, subTopic }: SubTopicSectionsHubProps) {
  const sections = subTopic.lessonSections ?? []
  const { text: accentText } = getTopicAccent(topic.accent)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <Link
        to={`/${topic.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        {topic.title}
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <p className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}>Library</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {subTopic.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          {subTopic.description}
        </p>
      </motion.header>

      <section className="mt-12">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          <BookOpen className="h-4 w-4" />
          Sections
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              topicId={topic.id}
              subTopicId={subTopic.id}
              section={section}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
