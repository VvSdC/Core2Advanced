import type { SubTopic } from '../../../types'
import { BasicSegmentTree } from './lessons/basic-segment-tree'
import { IntroductionToSegmentTrees } from './lessons/introduction-to-segment-trees'
import { LazyPropagationRangeAdd } from './lessons/lazy-propagation-range-add'
import { RangeMinimumQuery } from './lessons/range-minimum-query'
import { RangeSumQuerySegmentTree } from './lessons/range-sum-query-segment-tree'

export const segmentTreesSubTopic: SubTopic = {
  id: 'segment-trees',
  title: 'Segment Trees',
  description:
    'Range queries with point updates, min/max variants, and lazy propagation — the flexible cousin of Fenwick trees.',
  lessonSections: [
    {
      id: 'introduction',
      title: 'Introduction',
      lessons: [
        {
          id: 'introduction-to-segment-trees',
          title: 'Introduction to Segment Trees',
          description: 'What they solve, how they differ from Fenwick trees.',
          readTime: '10 min',
          component: IntroductionToSegmentTrees,
        },
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      lessons: [
        {
          id: 'basic-segment-tree',
          title: 'Basic Segment Tree',
          description: 'Array-based tree, build, point update, range sum query.',
          readTime: '13 min',
          component: BasicSegmentTree,
        },
      ],
    },
    {
      id: 'examples',
      title: 'Examples',
      lessons: [
        {
          id: 'range-sum-query-segment-tree',
          title: 'Range Sum Query',
          description: 'Mutable array — sum any subarray in O(log n).',
          readTime: '10 min',
          component: RangeSumQuerySegmentTree,
        },
        {
          id: 'range-minimum-query',
          title: 'Range Minimum Query',
          description: 'Same tree shape — change the merge to min.',
          readTime: '10 min',
          component: RangeMinimumQuery,
        },
        {
          id: 'lazy-propagation-range-add',
          title: 'Lazy Propagation — Range Add',
          description: 'Add a value to a whole range, then query range sum.',
          readTime: '13 min',
          component: LazyPropagationRangeAdd,
        },
      ],
    },
  ],
}
