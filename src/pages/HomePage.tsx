import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Layers } from 'lucide-react'
import { topics } from '../content/registry'
import { getTopicAccent } from '../lib/topic-accent'

export function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <section>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          <Layers className="h-4 w-4" />
          Topics
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => {
            const { text: accentText, hover: accentHover, border: accentBorder } = getTopicAccent(topic.accent)

            return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={`/${topic.id}`}
                className={`group block h-full rounded-2xl border border-surface-600 bg-surface-900/60 p-6 transition-all ${accentBorder} hover:bg-surface-800/60`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}>
                  {topic.subTopics.length} sub-topic{topic.subTopics.length !== 1 ? 's' : ''}
                </p>
                <h2 className={`mt-2 text-2xl font-semibold text-white transition-colors ${accentHover}`}>
                  {topic.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{topic.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent-400">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
