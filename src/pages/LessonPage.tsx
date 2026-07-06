import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getAdjacentLessons, getLesson, getSubTopic, getSubTopicLessons, getTopic } from '../content/registry'
import { LessonContent } from '../components/layout/LessonContent'
import { LessonSidebar } from '../components/layout/LessonSidebar'

export function LessonPage() {
  const navigate = useNavigate()
  const { topicId, subTopicId, lessonId } = useParams()

  if (!topicId || !subTopicId) {
    return <Navigate to="/" replace />
  }

  const topic = getTopic(topicId)
  const subTopic = getSubTopic(topicId, subTopicId)

  if (!topic || !subTopic) {
    return <Navigate to="/" replace />
  }

  if (!lessonId) {
    const firstLesson = getSubTopicLessons(subTopic)[0]
    if (firstLesson) {
      return (
        <Navigate
          to={`/${topicId}/${subTopicId}/${firstLesson.id}`}
          replace
        />
      )
    }
  }

  const activeLesson = lessonId ? getLesson(topicId, subTopicId, lessonId) : undefined

  if (!activeLesson) {
    return <Navigate to={`/${topicId}`} replace />
  }

  const { previous, next } = getAdjacentLessons(topicId, subTopicId, activeLesson.id)

  return (
    <div className="mx-auto grid max-w-7xl lg:grid-cols-[320px_1fr]">
      <div className="sticky top-14 hidden h-[calc(100vh-3.5rem)] lg:block">
        <LessonSidebar
          topic={topic}
          subTopic={subTopic}
          activeLessonId={activeLesson.id}
        />
      </div>

      <div className="min-w-0">
        <div className="border-b border-surface-700 bg-surface-900/50 p-4 lg:hidden">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Jump to lesson
          </label>
          <select
            className="mt-2 w-full rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-white"
            value={activeLesson.id}
            onChange={(event) => {
              navigate(`/${topicId}/${subTopicId}/${event.target.value}`)
            }}
          >
            {subTopic.lessonSections
              ? subTopic.lessonSections.flatMap((section) =>
                  section.lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {section.title} › {lesson.title}
                    </option>
                  )),
                )
              : subTopic.lessonTracks
                ? subTopic.lessonTracks.flatMap((track) =>
                    track.sections.flatMap((section) =>
                      section.lessons.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          {track.title} › {section.title} › {lesson.title}
                        </option>
                      )),
                    ),
                  )
                : getSubTopicLessons(subTopic).map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
          </select>
        </div>

        <LessonContent
          topic={topic}
          subTopic={subTopic}
          lesson={activeLesson}
          previous={previous}
          next={next}
        />
      </div>
    </div>
  )
}
