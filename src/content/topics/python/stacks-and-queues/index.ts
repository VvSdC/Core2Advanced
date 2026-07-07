import type { SubTopic } from '../../../types'
import { Deques } from './lessons/deques'
import { Queues } from './lessons/queues'
import { Stacks } from './lessons/stacks'

export const stacksAndQueuesSubTopic: SubTopic = {
  id: 'stacks-and-queues',
  title: 'Stacks & Queues',
  description: 'LIFO stacks, FIFO queues, and double-ended deques — how to use them in Python.',
  lessons: [
    {
      id: 'stacks',
      title: 'Stacks',
      description: 'LIFO with list.append and list.pop — bracket matching and DFS.',
      readTime: '10 min',
      component: Stacks,
    },
    {
      id: 'queues',
      title: 'Queues',
      description: 'FIFO with deque — why not list.pop(0), BFS, and queue.Queue.',
      readTime: '11 min',
      component: Queues,
    },
    {
      id: 'deques',
      title: 'Deques',
      description: 'collections.deque — both ends, maxlen, rotate, and when to use what.',
      readTime: '12 min',
      component: Deques,
    },
  ],
}
