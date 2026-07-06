import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getSubTopicLessons } from '../../content/registry'
import type { SubTopic, Topic } from '../../content/types'

interface LessonSidebarProps {
  topic: Topic
  subTopic: SubTopic
  activeLessonId: string
}

function LessonLink({
  topic,
  subTopic,
  lesson,
  isActive,
}: {
  topic: Topic
  subTopic: SubTopic
  lesson: { id: string; title: string; readTime: string }
  isActive: boolean
}) {
  const path = `/${topic.id}/${subTopic.id}/${lesson.id}`

  return (
    <NavLink
      to={path}
      className={`group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        isActive
          ? 'bg-accent-500/15 text-white'
          : 'text-slate-400 hover:bg-surface-800 hover:text-slate-200'
      }`}
    >
      <span
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
          isActive ? 'bg-accent-400' : 'bg-surface-600 group-hover:bg-surface-500'
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug">{lesson.title}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{lesson.readTime}</span>
      </span>
      <ChevronRight
        className={`mt-0.5 h-4 w-4 shrink-0 transition-transform ${
          isActive ? 'text-accent-400' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
    </NavLink>
  )
}

function GroupedLessonNav({
  topic,
  subTopic,
  activeLessonId,
}: {
  topic: Topic
  subTopic: SubTopic
  activeLessonId: string
}) {
  const groups =
    subTopic.lessonSections ??
    subTopic.lessonTracks?.flatMap((track) =>
      track.sections.map((section) => ({
        ...section,
        title: subTopic.lessonTracks!.length > 1 ? `${track.title} · ${section.title}` : section.title,
      })),
    ) ??
    []

  return (
    <div className="space-y-5">
      {groups.map((section) => (
        <div key={section.id}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {section.title}
          </p>
          <ul className="mt-1 space-y-0.5">
            {section.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonLink
                  topic={topic}
                  subTopic={subTopic}
                  lesson={lesson}
                  isActive={lesson.id === activeLessonId}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function LessonSidebar({ topic, subTopic, activeLessonId }: LessonSidebarProps) {
  const hasGroupedLessons = Boolean(
    subTopic.lessonSections?.length || subTopic.lessonTracks?.length,
  )
  const flatLessons = getSubTopicLessons(subTopic)

  return (
    <aside className="flex h-full flex-col border-r border-surface-700 bg-surface-900/50">
      <div className="border-b border-surface-700 p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-python-400">
          {topic.title}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">{subTopic.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{subTopic.description}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 md:p-4">
        {hasGroupedLessons ? (
          <GroupedLessonNav topic={topic} subTopic={subTopic} activeLessonId={activeLessonId} />
        ) : (
          <ul className="space-y-1">
            {flatLessons.map((lesson, index) => {
              const isActive = lesson.id === activeLessonId

              return (
                <li key={lesson.id}>
                  <NavLink
                    to={`/${topic.id}/${subTopic.id}/${lesson.id}`}
                    className={`group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors ${
                      isActive
                        ? 'bg-accent-500/15 text-white'
                        : 'text-slate-400 hover:bg-surface-800 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                        isActive
                          ? 'bg-accent-500 text-surface-950'
                          : 'bg-surface-700 text-slate-400 group-hover:bg-surface-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug">{lesson.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{lesson.readTime}</span>
                    </span>
                    <ChevronRight
                      className={`mt-1 h-4 w-4 shrink-0 transition-transform ${
                        isActive ? 'text-accent-400' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </NavLink>
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </aside>
  )
}
