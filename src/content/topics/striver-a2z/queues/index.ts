import type { SubTopic } from '../../../types'
import { ArrayQueueImplementation } from './lessons/array-queue-implementation'
import { LinkedListQueueImplementation } from './lessons/linked-list-queue-implementation'

export const queuesSubTopic: SubTopic = {
  id: 'queues',
  title: 'Queues',
  description: 'BFS-style problems, deques, and FIFO-based patterns.',
  lessons: [
    {
      id: 'array-queue-implementation',
      title: 'Array-based Queue Implementation',
      description: 'Build a FIFO queue with a pre-allocated array using two index pointers — push, pop, peek, isEmpty.',
      readTime: '8 min',
      component: ArrayQueueImplementation,
    },
    {
      id: 'linked-list-queue-implementation',
      title: 'Linked List Queue Implementation',
      description: 'Build a FIFO queue with head and tail pointers — enqueue at tail, dequeue from head in O(1).',
      readTime: '8 min',
      component: LinkedListQueueImplementation,
    },
  ],
}
