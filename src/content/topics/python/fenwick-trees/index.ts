import type { SubTopic } from '../../../types'
import { BasicFenwickTree } from './lessons/basic-fenwick-tree'
import { CountSmallerAfterSelf } from './lessons/count-smaller-after-self'
import { IntroductionToFenwickTrees } from './lessons/introduction-to-fenwick-trees'
import { InversionCount } from './lessons/inversion-count'
import { RangeSumQuery } from './lessons/range-sum-query'

export const fenwickTreesSubTopic: SubTopic = {
  id: 'fenwick-trees',
  title: 'Fenwick Trees',
  description:
    'Binary Indexed Trees explained simply — prefix sums, range queries, and counting problems in O(log n).',
  lessonSections: [
    {
      id: 'introduction',
      title: 'Introduction',
      lessons: [
        {
          id: 'introduction-to-fenwick-trees',
          title: 'Introduction to Fenwick Trees',
          description: 'The problem, the idea, and why not just a prefix array.',
          readTime: '10 min',
          component: IntroductionToFenwickTrees,
        },
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      lessons: [
        {
          id: 'basic-fenwick-tree',
          title: 'Basic Fenwick Tree',
          description: 'update and prefix_sum — the two operations you need.',
          readTime: '12 min',
          component: BasicFenwickTree,
        },
      ],
    },
    {
      id: 'examples',
      title: 'Examples',
      lessons: [
        {
          id: 'range-sum-query',
          title: 'Range Sum Query',
          description: 'Sum any subarray after point updates — the classic use case.',
          readTime: '10 min',
          component: RangeSumQuery,
        },
        {
          id: 'inversion-count',
          title: 'Inversion Count',
          description: 'Count pairs where i < j but nums[i] > nums[j].',
          readTime: '11 min',
          component: InversionCount,
        },
        {
          id: 'count-smaller-after-self',
          title: 'Count Smaller After Self',
          description: 'For each index, how many smaller values lie to the right.',
          readTime: '11 min',
          component: CountSmallerAfterSelf,
        },
      ],
    },
  ],
}
