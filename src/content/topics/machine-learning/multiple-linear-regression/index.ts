import type { SubTopic } from '../../../types'
import { MlrCostFunction } from './lessons/mlr-cost-function'
import { MlrDerivativesAndOls } from './lessons/mlr-derivatives-and-ols'
import { MlrEquations } from './lessons/mlr-equations'
import { MlrIntroduction } from './lessons/mlr-introduction'
import { MlrMathExample } from './lessons/mlr-math-example'
import { MlrNotebook } from './lessons/mlr-notebook'
import { MlrVsSlr } from './lessons/mlr-vs-slr'

const theoryLessons = [
  {
    id: 'mlr-introduction',
    title: 'Introduction',
    description:
      'Predict with two or more features — ŷ = θ₀ + θ₁x₁ + … + θₙxₙ.',
    readTime: '8 min',
    component: MlrIntroduction,
  },
  {
    id: 'mlr-vs-slr',
    title: 'MLR vs Simple Linear Regression',
    description: 'What changes when you move from one feature to many — and what stays the same.',
    readTime: '9 min',
    component: MlrVsSlr,
  },
  {
    id: 'mlr-equations',
    title: 'Mathematical Formulas',
    description: 'Hypothesis, parameter vector, design matrix X, and ŷ = Xθ.',
    readTime: '10 min',
    component: MlrEquations,
  },
  {
    id: 'mlr-cost-function',
    title: 'Cost Function',
    description: 'MSE for multiple features — J(θ) = (1/2m)·‖Xθ − y‖².',
    readTime: '8 min',
    component: MlrCostFunction,
  },
  {
    id: 'mlr-derivatives-and-ols',
    title: 'Derivatives & OLS',
    description:
      'Gradient of J, set ∇J = 0, and the normal equation θ = (XᵀX)⁻¹Xᵀy.',
    readTime: '12 min',
    component: MlrDerivativesAndOls,
  },
  {
    id: 'mlr-math-example',
    title: 'Mathematical Example',
    description:
      'Four-row, two-feature dataset — build X, solve OLS, recover θ = [1, 2, 3].',
    readTime: '14 min',
    component: MlrMathExample,
  },
]

const notebookLessons = [
  {
    id: 'mlr-notebook',
    title: 'Notebook (Sample Data)',
    description:
      'EDA, two-feature fit, train/test metrics, and OLS normal equation with outputs each step.',
    readTime: '16 min',
    component: MlrNotebook,
  },
]

export const multipleLinearRegressionSubTopic: SubTopic = {
  id: 'multiple-linear-regression',
  title: 'Multiple Linear Regression',
  description:
    'Linear models with many features — formulas, cost, derivatives, OLS, worked math, and a full notebook.',
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
