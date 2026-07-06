import type { Lesson, SubTopic } from './types'

export function getSubTopicLessons(subTopic: SubTopic): Lesson[] {
  if (subTopic.lessonSections) {
    return subTopic.lessonSections.flatMap((section) => section.lessons)
  }
  if (subTopic.lessonTracks) {
    return subTopic.lessonTracks.flatMap((track) =>
      track.sections.flatMap((section) => section.lessons),
    )
  }
  return subTopic.lessons ?? []
}
