import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

export const dataVisualizationTopic: Topic = {
  id: 'data-visualization',
  title: 'Data Visualization',
  description:
    'Turn data into clear charts and dashboards — principles, libraries, and storytelling with visuals.',
  accent: 'data-visualization',
  catalog: [{ type: 'subTopic', subTopicId: 'fundamentals' }],
  subTopics: [
    createEmptySubTopic(
      'fundamentals',
      'Fundamentals',
      'Core visualization concepts — lessons coming soon.',
    ),
  ],
}
