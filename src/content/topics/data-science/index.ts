import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

export const dataScienceTopic: Topic = {
  id: 'data-science',
  title: 'Data Science',
  description:
    'End-to-end data work — wrangling, exploration, statistics, and turning data into decisions.',
  accent: 'data-science',
  catalog: [{ type: 'subTopic', subTopicId: 'fundamentals' }],
  subTopics: [
    createEmptySubTopic(
      'fundamentals',
      'Fundamentals',
      'Core data science concepts — lessons coming soon.',
    ),
  ],
}
