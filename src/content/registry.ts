import type { Topic } from './types'
import { generativeAiTopic } from './topics/generative-ai'
import { pythonTopic } from './topics/python'
import { striverA2zTopic } from './topics/striver-a2z'
import { coreTopic } from './topics/core'
import { systemDesignTopic } from './topics/system-design'
import { webTechnologiesTopic } from './topics/web-technologies'
import { databasesTopic } from './topics/databases'
import { mathematicsTopic } from './topics/mathematics'
import { dataVisualizationTopic } from './topics/data-visualization'
import { dataScienceTopic } from './topics/data-science'
import { machineLearningTopic } from './topics/machine-learning'
import { naturalLanguageProcessingTopic } from './topics/natural-language-processing'
import { deepLearningTopic } from './topics/deep-learning'
import { dockerTopic } from './topics/docker'
import { getSubTopicLessons } from './lesson-utils'

export const topics: Topic[] = [
  pythonTopic,
  striverA2zTopic,
  mathematicsTopic,
  dataVisualizationTopic,
  dataScienceTopic,
  machineLearningTopic,
  naturalLanguageProcessingTopic,
  deepLearningTopic,
  generativeAiTopic,
  coreTopic,
  systemDesignTopic,
  webTechnologiesTopic,
  databasesTopic,
  dockerTopic,
]

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
