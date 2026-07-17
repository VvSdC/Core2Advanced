import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { getSubTopicLessons, getTopic } from '../content/registry'
import type { SubTopic, TopicCatalogEntry } from '../content/types'
import { getTopicAccent } from '../lib/topic-accent'

function SubTopicCard({
  topicId,
  subTopic,
  index,
}: {
  topicId: string
  subTopic: SubTopic
  index: number
}) {
  const lessons = getSubTopicLessons(subTopic)
  const itemLabel = topicId === 'striver-a2z' ? 'problem' : 'lesson'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={`/${topicId}/${subTopic.id}`}
        className="group flex h-full flex-col rounded-2xl border border-surface-600 bg-surface-900/60 p-6 transition-all hover:border-accent-500/40 hover:bg-surface-800/60"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
          {lessons.length} {itemLabel}
          {lessons.length !== 1 ? 's' : ''}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white transition-colors group-hover:text-accent-400">
          {subTopic.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{subTopic.description}</p>
        {lessons[0] ? (
          <p className="mt-4 text-xs text-slate-500">
            Starts with: {lessons[0].title}
          </p>
        ) : (
          <p className="mt-4 text-xs text-slate-500">
            {topicId === 'striver-a2z' ? 'Problems coming soon' : 'Lessons coming soon'}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-400">
          Open
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  )
}

function groupCatalogEntries(catalog: TopicCatalogEntry[]) {
  const groups: Array<
    | { kind: 'subTopics'; ids: string[] }
    | { kind: 'section'; section: Extract<TopicCatalogEntry, { type: 'section' }>['section'] }
  > = []

  let pendingSubTopicIds: string[] = []

  const flushSubTopics = () => {
    if (pendingSubTopicIds.length > 0) {
      groups.push({ kind: 'subTopics', ids: [...pendingSubTopicIds] })
      pendingSubTopicIds = []
    }
  }

  for (const entry of catalog) {
    if (entry.type === 'subTopic') {
      pendingSubTopicIds.push(entry.subTopicId)
    } else {
      flushSubTopics()
      groups.push({ kind: 'section', section: entry.section })
    }
  }

  flushSubTopics()
  return groups
}

export function TopicPage() {
  const { topicId } = useParams()
  const topic = topicId ? getTopic(topicId) : undefined

  if (!topic) {
    return <Navigate to="/" replace />
  }

  const subTopicById = new Map(topic.subTopics.map((subTopic) => [subTopic.id, subTopic]))
  const groups = groupCatalogEntries(topic.catalog)
  const { text: accentText } = getTopicAccent(topic.accent)
  let cardIndex = 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        All topics
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <p className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}>Topic</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          {topic.description}
        </p>
      </motion.header>

      <div className="mt-12 space-y-12">
        {groups.map((group, groupIndex) => {
          if (group.kind === 'subTopics') {
            const subTopics = group.ids
              .map((id) => subTopicById.get(id))
              .filter((subTopic): subTopic is SubTopic => subTopic !== undefined)

            return (
              <section key={`subtopics-${groupIndex}`}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  <BookOpen className="h-4 w-4" />
                  Sub-topics
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {subTopics.map((subTopic) => {
                    const currentIndex = cardIndex++
                    return (
                      <SubTopicCard
                        key={subTopic.id}
                        topicId={topic.id}
                        subTopic={subTopic}
                        index={currentIndex}
                      />
                    )
                  })}
                </div>
              </section>
            )
          }

          const sectionSubTopics = group.section.subTopicIds
            .map((id) => subTopicById.get(id))
            .filter((subTopic): subTopic is SubTopic => subTopic !== undefined)

          return (
            <section key={group.section.id}>
              <div className="border-b border-surface-700 pb-4">
                <p className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}>
                  Section
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                  {group.section.title}
                </h2>
                {group.section.description ? (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                    {group.section.description}
                  </p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sectionSubTopics.map((subTopic) => {
                  const currentIndex = cardIndex++
                  return (
                    <SubTopicCard
                      key={subTopic.id}
                      topicId={topic.id}
                      subTopic={subTopic}
                      index={currentIndex}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
