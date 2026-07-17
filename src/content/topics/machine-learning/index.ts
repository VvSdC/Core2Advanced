import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

export const machineLearningTopic: Topic = {
  id: 'machine-learning',
  title: 'Machine Learning',
  description:
    'Classical ML — supervised and unsupervised learning, features, evaluation, and model workflows.',
  accent: 'machine-learning',
  catalog: [{ type: 'subTopic', subTopicId: 'fundamentals' }],
  subTopics: [
    createEmptySubTopic(
      'fundamentals',
      'Fundamentals',
      'Core machine learning concepts — lessons coming soon.',
    ),
  ],
}
