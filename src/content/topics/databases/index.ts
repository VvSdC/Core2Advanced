import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'

const sqlSubTopic = createEmptySubTopic(
  'sql',
  'SQL',
  'Relational databases — queries, joins, indexes, transactions, and schema design.',
)

const nosqlSubTopic = createEmptySubTopic(
  'nosql',
  'NoSQL',
  'Document, key-value, and other non-relational stores — models and when to use them.',
)

export const databasesTopic: Topic = {
  id: 'databases',
  title: 'Databases',
  description: 'Work with data at the query layer — SQL and NoSQL stores from first principles.',
  accent: 'databases',
  catalog: [
    { type: 'subTopic', subTopicId: 'sql' },
    { type: 'subTopic', subTopicId: 'nosql' },
  ],
  subTopics: [sqlSubTopic, nosqlSubTopic],
}
