import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

export const deepLearningTopic: Topic = {
  id: 'deep-learning',
  title: 'Deep Learning',
  description:
    'Neural networks at scale — architectures, training, CNNs, RNNs/transformers foundations, and practice.',
  accent: 'deep-learning',
  catalog: [{ type: 'subTopic', subTopicId: 'fundamentals' }],
  subTopics: [
    createEmptySubTopic(
      'fundamentals',
      'Fundamentals',
      'Core deep learning concepts — lessons coming soon.',
    ),
  ],
}
