import type { SubTopic } from '../../../types'
import { SlrConvergenceAlgorithm } from './lessons/slr-convergence-algorithm'
import { SlrCostFunction } from './lessons/slr-cost-function'
import { SlrDerivingPartialDerivatives } from './lessons/slr-deriving-partial-derivatives'
import { SlrEquations } from './lessons/slr-equations'
import { SlrFromScratchNotebook } from './lessons/slr-from-scratch-notebook'
import { SlrIntroduction } from './lessons/slr-introduction'
import { SlrOptimalParametersMath } from './lessons/slr-optimal-parameters-math'
import { SlrPerformanceMetrics } from './lessons/slr-performance-metrics'
import { SlrRealWorldNotebook } from './lessons/slr-real-world-notebook'

const theoryLessons = [
  {
    id: 'slr-introduction',
    title: 'Introduction',
    description:
      'Beginner-first: what the line means in plain English, with a study-hours story and no panic.',
    readTime: '14 min',
    component: SlrIntroduction,
  },
  {
    id: 'slr-equations',
    title: 'Simple Linear Regression Equations',
    description: 'Meet x, y, ŷ, θ₀, θ₁ slowly — then plug-and-play predictions.',
    readTime: '14 min',
    component: SlrEquations,
  },
  {
    id: 'slr-cost-function',
    title: 'Cost Function',
    description: 'A friendly scorecard for mistakes — why we square errors, with a tiny hand example.',
    readTime: '13 min',
    component: SlrCostFunction,
  },
  {
    id: 'slr-deriving-partial-derivatives',
    title: 'Deriving the Partial Derivatives',
    description:
      'From J to ∂J/∂θ₀ and ∂J/∂θ₁ — chain rule, why the 1/2 cancels, and a tiny numeric check.',
    readTime: '16 min',
    component: SlrDerivingPartialDerivatives,
  },
  {
    id: 'slr-optimal-parameters-math',
    title: 'Optimal Parameters (Math)',
    description:
      'Set the derived derivatives to zero, get OLS formulas, and solve a full numeric example.',
    readTime: '18 min',
    component: SlrOptimalParametersMath,
  },
  {
    id: 'slr-convergence-algorithm',
    title: 'Convergence Algorithm',
    description:
      'Walking downhill in plain English, then a worked GD example that matches OLS.',
    readTime: '16 min',
    component: SlrConvergenceAlgorithm,
  },
  {
    id: 'slr-performance-metrics',
    title: 'Performance Metrics',
    description: 'MAE, MSE, and RMSE explained as everyday “how far off are we?” scores.',
    readTime: '13 min',
    component: SlrPerformanceMetrics,
  },
]

const notebookLessons = [
  {
    id: 'slr-from-scratch-notebook',
    title: 'From Scratch (10 Rows)',
    description:
      'Notebook-style: implement hypothesis, MSE, and gradient descent on a 10-row dataset.',
    readTime: '15 min',
    component: SlrFromScratchNotebook,
  },
  {
    id: 'slr-real-world-notebook',
    title: 'Real-World ML Workflow',
    description:
      'Notebook-style: read data, EDA, correlation, train/test split, scikit-learn fit & metrics.',
    readTime: '16 min',
    component: SlrRealWorldNotebook,
  },
]

export const simpleLinearRegressionSubTopic: SubTopic = {
  id: 'simple-linear-regression',
  title: 'Simple Linear Regression',
  description:
    'Beginner-friendly path to fitting a straight line — stories first, then gentle math, metrics, and notebooks.',
  lessonSections: [
    {
      id: 'theory',
      title: 'Theory',
      lessons: theoryLessons,
    },
    {
      id: 'notebooks',
      title: 'Notebooks',
      lessons: notebookLessons,
    },
  ],
}
