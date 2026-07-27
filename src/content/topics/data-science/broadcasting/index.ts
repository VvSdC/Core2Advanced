import type { SubTopic } from '../../../types'
import { BroadcastingNotebook } from './lessons/broadcasting-notebook'
import { BroadcastingRules } from './lessons/broadcasting-rules'
import { WhatIsBroadcasting } from './lessons/what-is-broadcasting'

export const broadcastingSubTopic: SubTopic = {
  id: 'broadcasting',
  title: 'Broadcasting',
  description:
    'How NumPy combines differently shaped arrays — intuition, rules, and hands-on notebook examples.',
  lessons: [
    {
      id: 'what-is-broadcasting',
      title: 'What Is Broadcasting?',
      description: 'Stretch-to-fit idea — from scores + 5 to tax vectors on a price table.',
      readTime: '10 min',
      component: WhatIsBroadcasting,
    },
    {
      id: 'broadcasting-rules',
      title: 'Broadcasting Rules',
      description: 'Compare shapes from the right — equal or 1 — plus row/column patterns.',
      readTime: '12 min',
      component: BroadcastingRules,
    },
    {
      id: 'broadcasting-notebook',
      title: 'Broadcasting (Notebook)',
      description: 'Scalar, row, column, errors, and demeaning columns — with outputs.',
      readTime: '14 min',
      component: BroadcastingNotebook,
    },
  ],
}
