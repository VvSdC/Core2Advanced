import type { SubTopic } from '../../../types'
import { PolyCostFunction } from './lessons/poly-cost-function'
import { PolyDerivativesAndOls } from './lessons/poly-derivatives-and-ols'
import { PolyEquations } from './lessons/poly-equations'
import { PolyIntroduction } from './lessons/poly-introduction'
import { PolyMathExample } from './lessons/poly-math-example'
import { PolyNotebook } from './lessons/poly-notebook'
import { PolyPerformanceMetrics } from './lessons/poly-performance-metrics'
import { PolyVsLinear } from './lessons/poly-vs-linear'
import { PolyWhenToUse } from './lessons/poly-when-to-use'

const theoryLessons = [
  {
    id: 'poly-introduction',
    title: 'Introduction',
    description: 'Curved fits via x², x³, … — still linear in the parameters θ.',
    readTime: '8 min',
    component: PolyIntroduction,
  },
  {
    id: 'poly-when-to-use',
    title: 'When to Use Polynomial Regression',
    description: 'Scatter bends, curved residuals, and domain clues — plus when not to use it.',
    readTime: '10 min',
    component: PolyWhenToUse,
  },
  {
    id: 'poly-vs-linear',
    title: 'vs Linear Regression',
    description: 'Geometry vs math — same OLS learner, richer polynomial features.',
    readTime: '9 min',
    component: PolyVsLinear,
  },
  {
    id: 'poly-equations',
    title: 'Mathematical Formulas',
    description: 'hθ(x) = θ₀ + θ₁x + … + θₖxᵏ and the feature map φ(x).',
    readTime: '10 min',
    component: PolyEquations,
  },
  {
    id: 'poly-cost-function',
    title: 'Cost Function',
    description: 'MSE on polynomial features — J(θ) = (1/2m)·‖Φθ − y‖².',
    readTime: '7 min',
    component: PolyCostFunction,
  },
  {
    id: 'poly-derivatives-and-ols',
    title: 'Derivatives & OLS',
    description: '∇J = 0 on Φ → θ = (ΦᵀΦ)⁻¹ Φᵀ y.',
    readTime: '10 min',
    component: PolyDerivativesAndOls,
  },
  {
    id: 'poly-math-example',
    title: 'Mathematical Example',
    description: 'Degree-2 OLS recovers θ = [1, 2, 0.5] on a clean quadratic dataset.',
    readTime: '12 min',
    component: PolyMathExample,
  },
  {
    id: 'poly-performance-metrics',
    title: 'Performance Metrics',
    description: 'MAE, MSE, RMSE (and R²) to compare degrees and catch overfitting.',
    readTime: '10 min',
    component: PolyPerformanceMetrics,
  },
]

const notebookLessons = [
  {
    id: 'poly-notebook',
    title: 'Notebook (Sample Data)',
    description:
      'Linear baseline vs degree 2 — feature expansion, OLS, train/test metrics, prediction.',
    readTime: '15 min',
    component: PolyNotebook,
  },
]

export const polynomialRegressionSubTopic: SubTopic = {
  id: 'polynomial-regression',
  title: 'Polynomial Regression',
  description:
    'When curves beat lines — formulas, cost, OLS on polynomial features, metrics by degree, and a full notebook.',
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
