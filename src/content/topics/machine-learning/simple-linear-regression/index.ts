import type { SubTopic } from '../../../types'
import { SlrConvergenceAlgorithm } from './lessons/slr-convergence-algorithm'
import { SlrCostFunction } from './lessons/slr-cost-function'
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
      'What simple linear regression is — one feature, one line, and why it is the best first model.',
    readTime: '9 min',
    component: SlrIntroduction,
  },
  {
    id: 'slr-equations',
    title: 'Simple Linear Regression Equations',
    description: 'ŷ = θ₀ + θ₁x — parameters, predictions, and a peek at vector form.',
    readTime: '10 min',
    component: SlrEquations,
  },
  {
    id: 'slr-cost-function',
    title: 'Cost Function',
    description: 'Mean Squared Error — how we score a line and why we square residuals.',
    readTime: '10 min',
    component: SlrCostFunction,
  },
  {
    id: 'slr-optimal-parameters-math',
    title: 'Optimal Parameters (Math)',
    description:
      'Differentiate the cost, set derivatives to zero, derive normal equations, and solve a full numeric example.',
    readTime: '16 min',
    component: SlrOptimalParametersMath,
  },
  {
    id: 'slr-convergence-algorithm',
    title: 'Convergence Algorithm',
    description: 'Gradient descent — learning rate, updates, worked example vs OLS on the same data.',
    readTime: '12 min',
    component: SlrConvergenceAlgorithm,
  },
  {
    id: 'slr-performance-metrics',
    title: 'Performance Metrics',
    description:
      'MAE, MSE, and RMSE — how to measure regression quality, when to use each, and how to code them.',
    readTime: '12 min',
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
    'Fit a straight line — equations, cost, exact math for optimal θ, gradient descent, metrics, then notebooks.',
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
