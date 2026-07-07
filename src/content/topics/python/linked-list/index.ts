import type { SubTopic } from '../../../types'
import { FloydCycleDetection } from '../data-structures-and-algorithms/linked-list/algorithms/floyd-cycle-detection'
import { MiddleElementSlowFast } from '../data-structures-and-algorithms/linked-list/algorithms/middle-element-slow-fast'
import { LinkedListOperations } from '../data-structures-and-algorithms/linked-list/data-structure/linked-list-operations'
import { SinglyLinkedList } from '../data-structures-and-algorithms/linked-list/data-structure/singly-linked-list'
import { WhatIsLinkedList } from '../data-structures-and-algorithms/linked-list/data-structure/what-is-linked-list'

export const linkedListSubTopic: SubTopic = {
  id: 'linked-list',
  title: 'Linked List',
  description: 'Nodes, pointers, operations, and classic linked-list algorithms.',
  lessonSections: [
    {
      id: 'data-structure',
      title: 'Data Structure',
      lessons: [
        {
          id: 'what-is-linked-list',
          title: 'What is a Linked List?',
          description: 'Nodes, pointers, and tradeoffs vs Python lists.',
          readTime: '9 min',
          component: WhatIsLinkedList,
        },
        {
          id: 'singly-linked-list',
          title: 'Singly Linked List',
          description: 'Node and LinkedList class implementation in Python.',
          readTime: '11 min',
          component: SinglyLinkedList,
        },
        {
          id: 'linked-list-operations',
          title: 'Linked List Operations',
          description: 'Insert, delete, search, traverse — with complexities.',
          readTime: '10 min',
          component: LinkedListOperations,
        },
      ],
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      lessons: [
        {
          id: 'middle-element-slow-fast',
          title: 'Middle Element — Slow & Fast',
          description: 'Find the middle node in one pass with two pointers.',
          readTime: '10 min',
          component: MiddleElementSlowFast,
        },
        {
          id: 'floyd-cycle-detection',
          title: "Floyd's Cycle Detection",
          description: 'Tortoise and hare — detect cycles in O(n) time, O(1) space.',
          readTime: '12 min',
          component: FloydCycleDetection,
        },
      ],
    },
  ],
}
