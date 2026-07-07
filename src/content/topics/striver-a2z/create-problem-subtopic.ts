import type { SubTopic } from '../../types'

/** Scaffold for a Striver A2Z category — add problems to `lessons` as you go. */
export function problemSubTopic(config: {
  id: string
  title: string
  description: string
}): SubTopic {
  return {
    id: config.id,
    title: config.title,
    description: config.description,
    lessons: [],
  }
}
