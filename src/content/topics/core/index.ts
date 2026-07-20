import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'
import { gitSubTopic } from './git'
import { dockerSubTopic } from './docker'

const operatingSystemSubTopic = createEmptySubTopic(
  'operating-system',
  'Operating System',
  'Processes, memory, filesystems, concurrency, and how the OS runs your programs.',
)

const computerNetworksSubTopic = createEmptySubTopic(
  'computer-networks',
  'Computer Networks',
  'Layers, TCP/IP, HTTP, DNS, and how machines talk on the internet.',
)

const dbmsSubTopic = createEmptySubTopic(
  'database-management-system',
  'Database Management System',
  'DBMS concepts — storage, indexing, transactions, concurrency, and query processing.',
)

export const coreTopic: Topic = {
  id: 'core',
  title: 'Core',
  description:
    'Foundational CS topics every engineer needs — Git, Docker, operating systems, networks, and DBMS.',
  accent: 'core',
  catalog: [
    { type: 'subTopic', subTopicId: 'git' },
    { type: 'subTopic', subTopicId: 'docker' },
    { type: 'subTopic', subTopicId: 'operating-system' },
    { type: 'subTopic', subTopicId: 'computer-networks' },
    { type: 'subTopic', subTopicId: 'database-management-system' },
  ],
  subTopics: [
    gitSubTopic,
    dockerSubTopic,
    operatingSystemSubTopic,
    computerNetworksSubTopic,
    dbmsSubTopic,
  ],
}
