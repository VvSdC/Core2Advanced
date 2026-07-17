import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

const lowLevelDesignSubTopic = createEmptySubTopic(
  'low-level-design',
  'Low Level Design',
  'Classes, objects, SOLID, patterns, and designing maintainable modules.',
)

const highLevelDesignSubTopic = createEmptySubTopic(
  'high-level-design',
  'High Level Design',
  'Scalable systems — APIs, caching, queues, databases, and architecture tradeoffs.',
)

export const systemDesignTopic: Topic = {
  id: 'system-design',
  title: 'System Design',
  description:
    'Design software at two scales — low-level object design and high-level distributed systems.',
  accent: 'system-design',
  catalog: [
    { type: 'subTopic', subTopicId: 'low-level-design' },
    { type: 'subTopic', subTopicId: 'high-level-design' },
  ],
  subTopics: [lowLevelDesignSubTopic, highLevelDesignSubTopic],
}
