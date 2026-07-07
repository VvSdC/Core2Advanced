import type { SubTopic } from '../../../types'
import { IntroductionToBacktracking } from './lessons/introduction-to-backtracking'
import { SubsetSumNoReuse } from './lessons/subset-sum-no-reuse'
import { SubsetSumWithReuse } from './lessons/subset-sum-with-reuse'

export const backtrackingSubTopic: SubTopic = {
  id: 'backtracking',
  title: 'Backtracking',
  description: 'Choose, explore, unchoose — subset sum with and without element reuse.',
  lessons: [
    {
      id: 'introduction-to-backtracking',
      title: 'Introduction to Backtracking',
      description: 'The choose–explore–unchoose template and when to use it.',
      readTime: '9 min',
      component: IntroductionToBacktracking,
    },
    {
      id: 'subset-sum-no-reuse',
      title: 'Subset Sum — Each Element Once',
      description: 'Include or exclude each number — at most one use per element.',
      readTime: '12 min',
      component: SubsetSumNoReuse,
    },
    {
      id: 'subset-sum-with-reuse',
      title: 'Subset Sum — Unlimited Reuse',
      description: 'Same element can repeat — stay at index i after taking.',
      readTime: '12 min',
      component: SubsetSumWithReuse,
    },
  ],
}
