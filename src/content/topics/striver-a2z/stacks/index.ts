import type { SubTopic } from '../../../types'
import { ArrayStackImplementation } from './lessons/array-stack-implementation'
import { BalancedParenthesis } from './lessons/balanced-parenthesis'
import { LinkedListStackImplementation } from './lessons/linked-list-stack-implementation'

export const stacksSubTopic: SubTopic = {
  id: 'stacks',
  title: 'Stacks',
  description: 'Monotonic stack, parentheses, and LIFO-based problems.',
  lessons: [
    {
      id: 'array-stack-implementation',
      title: 'Array-based Stack Implementation',
      description: 'Build a stack with a pre-allocated array — push, pop, top, overflow and underflow guards.',
      readTime: '8 min',
      component: ArrayStackImplementation,
    },
    {
      id: 'linked-list-stack-implementation',
      title: 'Linked List Stack Implementation',
      description: 'Build a LIFO stack with a singly linked list — push and pop at the head in O(1).',
      readTime: '8 min',
      component: LinkedListStackImplementation,
    },
    {
      id: 'balanced-parenthesis',
      title: 'Balanced Parenthesis',
      description: 'Check if a bracket string is valid using a stack — match opens with closes in correct order.',
      readTime: '10 min',
      component: BalancedParenthesis,
    },
  ],
}
