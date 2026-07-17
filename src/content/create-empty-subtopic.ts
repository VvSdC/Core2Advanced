import type { SubTopic } from './types'

/** Placeholder sub-topic with no lessons yet — content can be added later. */
export function createEmptySubTopic(
  id: string,
  title: string,
  description: string,
): SubTopic {
  return {
    id,
    title,
    description,
    lessons: [],
  }
}
