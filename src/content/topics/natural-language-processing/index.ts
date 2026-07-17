import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

export const naturalLanguageProcessingTopic: Topic = {
  id: 'natural-language-processing',
  title: 'Natural Language Processing',
  description:
    'Text and language systems — tokenization, embeddings, classical NLP, and modern NLP pipelines.',
  accent: 'nlp',
  catalog: [{ type: 'subTopic', subTopicId: 'fundamentals' }],
  subTopics: [
    createEmptySubTopic(
      'fundamentals',
      'Fundamentals',
      'Core NLP concepts — lessons coming soon.',
    ),
  ],
}
