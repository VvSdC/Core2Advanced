import type { Topic } from './types'
import { pythonTopic } from './topics/python'
import { striverA2zTopic } from './topics/striver-a2z'
import { getSubTopicLessons } from './lesson-utils'

export const topics: Topic[] = [pythonTopic, striverA2zTopic]

export function getTopic(topicId: string) {
  return topics.find((topic) => topic.id === topicId)
}

export function getSubTopic(topicId: string, subTopicId: string) {
  return getTopic(topicId)?.subTopics.find((subTopic) => subTopic.id === subTopicId)
}

export function getLesson(topicId: string, subTopicId: string, lessonId: string) {
  const subTopic = getSubTopic(topicId, subTopicId)
  if (!subTopic) return undefined
  return getSubTopicLessons(subTopic).find((lesson) => lesson.id === lessonId)
}

export function getAllLessons() {
  return topics.flatMap((topic) =>
    topic.subTopics.flatMap((subTopic) =>
      getSubTopicLessons(subTopic).map((lesson) => ({
        topic,
        subTopic,
        lesson,
      })),
    ),
  )
}

export function getAdjacentLessons(topicId: string, subTopicId: string, lessonId: string) {
  const subTopic = getSubTopic(topicId, subTopicId)
  if (!subTopic) return { previous: null, next: null }

  const lessons = getSubTopicLessons(subTopic)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)
  if (index === -1) return { previous: null, next: null }

  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
  }
}

export { getSubTopicLessons } from './lesson-utils'
