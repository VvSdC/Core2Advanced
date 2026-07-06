import type { ComponentType } from 'react'

export interface LessonMeta {
  id: string
  title: string
  description: string
  readTime: string
}

export interface Lesson extends LessonMeta {
  component: ComponentType
}

export interface LessonSection {
  id: string
  title: string
  lessons: Lesson[]
}

export interface LessonTrack {
  id: string
  title: string
  sections: LessonSection[]
}

export interface SubTopic {
  id: string
  title: string
  description: string
  /** Flat lesson list for simple sub-topics */
  lessons?: Lesson[]
  /** Sidebar sections (e.g. Data Structure, Algorithms) */
  lessonSections?: LessonSection[]
  /** @deprecated Use lessonSections — grouped tracks with sections */
  lessonTracks?: LessonTrack[]
}

export interface TopicSection {
  id: string
  title: string
  description?: string
  subTopicIds: string[]
}

export type TopicCatalogEntry =
  | { type: 'subTopic'; subTopicId: string }
  | { type: 'section'; section: TopicSection }

export interface Topic {
  id: string
  title: string
  description: string
  accent: string
  /** Ordered display catalog for the topic page */
  catalog: TopicCatalogEntry[]
  /** All sub-topics for routing and lookup */
  subTopics: SubTopic[]
}

export type LessonPath = {
  topicId: string
  subTopicId: string
  lessonId: string
}
