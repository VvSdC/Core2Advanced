import type { SubTopic } from '../../../types'
import { AccessingElements } from './lessons/accessing-elements'
import { SlicingArrays } from './lessons/slicing-arrays'

export const indexingAndSlicingSubTopic: SubTopic = {
  id: 'indexing-and-slicing',
  title: 'Indexing & Slicing',
  description: 'Pick elements, rows, columns, and blocks — plus the view vs copy gotcha.',
  lessons: [
    {
      id: 'accessing-elements',
      title: 'Accessing Elements',
      description: 'a[i], M[row, col], and selecting whole rows or columns.',
      readTime: '9 min',
      component: AccessingElements,
    },
    {
      id: 'slicing-arrays',
      title: 'Slicing Arrays',
      description: 'Windows with start:stop:step in 1-D and 2-D, and when to .copy().',
      readTime: '11 min',
      component: SlicingArrays,
    },
  ],
}
