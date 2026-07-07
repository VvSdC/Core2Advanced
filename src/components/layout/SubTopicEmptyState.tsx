import { Link } from 'react-router-dom'
import { ArrowLeft, ListPlus } from 'lucide-react'
import type { SubTopic, Topic } from '../../content/types'

export function SubTopicEmptyState({
  topic,
  subTopic,
}: {
  topic: Topic
  subTopic: SubTopic
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <Link
        to={`/${topic.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        {topic.title}
      </Link>

      <div className="mt-8 rounded-2xl border border-dashed border-surface-600 bg-surface-900/40 p-8 text-center md:p-12">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-striver-500/15 text-striver-400">
          <ListPlus className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-white">{subTopic.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{subTopic.description}</p>
        <p className="mt-6 text-sm text-slate-500">
          No problems here yet. Add lessons to this category&apos;s{' '}
          <code className="rounded bg-surface-800 px-1.5 py-0.5 font-mono text-xs text-slate-300">
            lessons
          </code>{' '}
          array when you are ready.
        </p>
      </div>
    </div>
  )
}
