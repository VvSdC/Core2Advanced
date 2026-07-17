import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

export const mathematicsTopic: Topic = {
  id: 'mathematics',
  title: 'Mathematics',
  description:
    'Math foundations for computing and ML — linear algebra, calculus, probability, and discrete math.',
  accent: 'mathematics',
  catalog: [{ type: 'subTopic', subTopicId: 'fundamentals' }],
  subTopics: [
    createEmptySubTopic(
      'fundamentals',
      'Fundamentals',
      'Core mathematical building blocks — lessons coming soon.',
    ),
  ],
}
