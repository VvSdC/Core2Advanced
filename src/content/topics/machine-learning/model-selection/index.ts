import type { SubTopic } from '../../../types'
import { BiasVariance } from './lessons/bias-variance'
import { CrossValidation } from './lessons/cross-validation'
import { HyperparametersAndLearningCurves } from './lessons/hyperparameters-and-learning-curves'

export const modelSelectionSubTopic: SubTopic = {
  id: 'model-selection',
  title: 'Model Selection',
  description:
    'How to choose and trust a model — bias vs variance, cross-validation without leakage, and hyperparameter search read through learning curves.',
  lessons: [
    {
      id: 'bias-variance',
      title: 'Bias–Variance Trade-off',
      description:
        'Test MSE ≈ Bias² + Variance + noise. Underfit vs overfit, and which lever (data, regularisation, ensembles) moves which term.',
      readTime: '16 min',
      component: BiasVariance,
    },
    {
      id: 'cross-validation',
      title: 'Cross-Validation',
      description:
        'K-fold, stratified, grouped, and time-series splits. Nested CV, pipelines, and the leaks that make a score a lie.',
      readTime: '16 min',
      component: CrossValidation,
    },
    {
      id: 'hyperparameters-and-learning-curves',
      title: 'Hyperparameters & Learning Curves',
      description:
        'Grid vs random vs Bayesian search, log-scale knobs, and how error-vs-m tells you whether to gather data or change the model.',
      readTime: '16 min',
      component: HyperparametersAndLearningCurves,
    },
  ],
}
