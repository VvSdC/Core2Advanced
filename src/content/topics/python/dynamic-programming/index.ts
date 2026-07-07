import type { SubTopic } from '../../../types'
import { GridMaxCoins } from './lessons/grid-max-coins'
import { GridPathWithKObstacles } from './lessons/grid-path-with-k-obstacles'
import { IntroductionToDynamicProgramming } from './lessons/introduction-to-dynamic-programming'
import { KnapsackOneD } from './lessons/knapsack-one-d'
import { OneDimensionalDp } from './lessons/one-dimensional-dp'
import { ThreeDimensionalDp } from './lessons/three-dimensional-dp'
import { TwoDimensionalDp } from './lessons/two-dimensional-dp'

export const dynamicProgrammingSubTopic: SubTopic = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming',
  description:
    'Memoization and tabulation — 1D knapsack, 2D grid paths, and 3D state for richer constraints.',
  lessonSections: [
    {
      id: 'introduction',
      title: 'Introduction',
      lessons: [
        {
          id: 'introduction-to-dynamic-programming',
          title: 'Introduction to Dynamic Programming',
          description: 'Overlapping subproblems, optimal substructure, top-down vs bottom-up.',
          readTime: '10 min',
          component: IntroductionToDynamicProgramming,
        },
      ],
    },
    {
      id: 'one-dimensional',
      title: '1D DP',
      lessons: [
        {
          id: 'one-dimensional-dp',
          title: '1D DP — Patterns',
          description: 'Single-array state, recurrence, and memoization vs tabulation.',
          readTime: '11 min',
          component: OneDimensionalDp,
        },
        {
          id: 'knapsack-one-d',
          title: '0/1 Knapsack — 1D',
          description: 'Classic knapsack with a one-dimensional capacity array.',
          readTime: '12 min',
          component: KnapsackOneD,
        },
      ],
    },
    {
      id: 'two-dimensional',
      title: '2D DP',
      lessons: [
        {
          id: 'two-dimensional-dp',
          title: '2D DP — Patterns',
          description: 'Tables indexed by two parameters — rows, columns, and transitions.',
          readTime: '10 min',
          component: TwoDimensionalDp,
        },
        {
          id: 'grid-max-coins',
          title: 'Max Coins in a Grid',
          description: 'Top-left to bottom-right — avoid obstacles, maximize collected coins.',
          readTime: '12 min',
          component: GridMaxCoins,
        },
      ],
    },
    {
      id: 'three-dimensional',
      title: '3D DP',
      lessons: [
        {
          id: 'three-dimensional-dp',
          title: '3D DP — Patterns',
          description: 'When a third state dimension is needed — extra constraints or resources.',
          readTime: '10 min',
          component: ThreeDimensionalDp,
        },
        {
          id: 'grid-path-with-k-obstacles',
          title: 'Grid Path with K Obstacle Breaks',
          description: 'Max coins when you may pass through at most k obstacles — dp[row][col][k].',
          readTime: '13 min',
          component: GridPathWithKObstacles,
        },
      ],
    },
  ],
}
