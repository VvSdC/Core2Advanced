import type { SubTopic } from '../../../types'
import { SlrFromScratchNotebook } from '../simple-linear-regression/lessons/slr-from-scratch-notebook'
import { SlrRealWorldNotebook } from '../simple-linear-regression/lessons/slr-real-world-notebook'
import { AssumptionsAndResiduals } from './lessons/assumptions-and-residuals'
import { FittingOlsAndGradientDescent } from './lessons/fitting-ols-and-gradient-descent'
import { MultipleLinearRegression } from './lessons/multiple-linear-regression'
import { PolynomialRegressionLesson } from './lessons/polynomial-regression'
import { RegressionMetrics } from './lessons/regression-metrics'
import { RegressionRegularization } from './lessons/regularization'
import { WhatIsRegression } from './lessons/what-is-regression'

const theoryLessons = [
  {
    id: 'what-is-regression',
    title: 'What Is Regression?',
    description:
      'Predict a number — intuition, when to use a line, how the four-part loop works, and how to read θ₀ and θ₁.',
    readTime: '16 min',
    component: WhatIsRegression,
  },
  {
    id: 'fitting-ols-and-gradient-descent',
    title: 'Fitting: OLS & Gradient Descent',
    description:
      'MSE cost, the closed-form slope, the normal equation, and walking the bowl with gradient descent.',
    readTime: '20 min',
    component: FittingOlsAndGradientDescent,
  },
  {
    id: 'multiple-linear-regression',
    title: 'Multiple Linear Regression',
    description:
      'Many features, ŷ = Xθ, dummy variables, coefficient interpretation, and multicollinearity.',
    readTime: '18 min',
    component: MultipleLinearRegression,
  },
  {
    id: 'polynomial-regression',
    title: 'Polynomial Regression',
    description:
      'Curves via x², x³, … — still linear in θ. Degree as a hyperparameter and the overfitting signature.',
    readTime: '16 min',
    component: PolynomialRegressionLesson,
  },
  {
    id: 'regularization',
    title: 'Regularisation: Ridge, Lasso, Elastic Net',
    description:
      'Penalise large weights. L2 shrinks, L1 sparsifies, Elastic Net mixes — plus why you must scale first.',
    readTime: '18 min',
    component: RegressionRegularization,
  },
  {
    id: 'assumptions-and-residuals',
    title: 'Assumptions & Residual Diagnostics',
    description:
      'Gauss-Markov assumptions, residual plots, leverage vs outliers, and prediction vs causal stories.',
    readTime: '16 min',
    component: AssumptionsAndResiduals,
  },
  {
    id: 'regression-metrics',
    title: 'Regression Metrics',
    description:
      'MAE, MSE, RMSE, R², adjusted R² — which one to quote, when R² goes negative, and how to compare models honestly.',
    readTime: '16 min',
    component: RegressionMetrics,
  },
]

const notebookLessons = [
  {
    id: 'from-scratch-notebook',
    title: 'From Scratch (10 Rows)',
    description:
      'Implement hypothesis, MSE, and gradient descent on a 10-row hours → score dataset.',
    readTime: '15 min',
    component: SlrFromScratchNotebook,
  },
  {
    id: 'sklearn-notebook',
    title: 'scikit-learn Workflow',
    description:
      'Read data, EDA, train/test split, fit, and metrics — the production-shaped path.',
    readTime: '16 min',
    component: SlrRealWorldNotebook,
  },
]

export const regressionSubTopic: SubTopic = {
  id: 'regression',
  title: 'Regression',
  description:
    'Predict a number — from a straight line through many features, curves, and regularisation, with diagnostics and the metrics you actually report.',
  lessonSections: [
    { id: 'theory', title: 'Theory', lessons: theoryLessons },
    { id: 'notebooks', title: 'Notebooks', lessons: notebookLessons },
  ],
}
