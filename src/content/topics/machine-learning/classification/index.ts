import type { SubTopic } from '../../../types'
import { ClassificationMetrics } from './lessons/classification-metrics'
import { DecisionTreesLesson } from './lessons/decision-trees'
import { GradientBoostingLesson } from './lessons/gradient-boosting'
import { KNearestNeighbors } from './lessons/k-nearest-neighbors'
import { LogisticRegressionLesson } from './lessons/logistic-regression'
import { NaiveBayesLesson } from './lessons/naive-bayes'
import { RandomForestsLesson } from './lessons/random-forests'
import { SupportVectorMachines } from './lessons/support-vector-machines'

export const classificationSubTopic: SubTopic = {
  id: 'classification',
  title: 'Classification',
  description:
    'Predict a category — logistic regression, k-NN, Naive Bayes, trees, forests, gradient boosting, and SVMs. Each lesson is what the algorithm is, when to use it, how it works, and the theory with worked problems.',
  lessons: [
    {
      id: 'logistic-regression',
      title: 'Logistic Regression',
      description:
        'A linear model for P(y = 1 | x) = σ(θᵀx). Log-loss, odds ratios, softmax, and when a hyperplane is enough.',
      readTime: '18 min',
      component: LogisticRegressionLesson,
    },
    {
      id: 'k-nearest-neighbors',
      title: 'k-Nearest Neighbours',
      description:
        'Vote among the k closest training rows. Distance, the k knob, scaling, and the curse of dimensionality.',
      readTime: '14 min',
      component: KNearestNeighbors,
    },
    {
      id: 'naive-bayes',
      title: 'Naive Bayes',
      description:
        'Bayes with independent features — Bernoulli / Multinomial / Gaussian, Laplace smoothing, and why it still works on text.',
      readTime: '16 min',
      component: NaiveBayesLesson,
    },
    {
      id: 'decision-trees',
      title: 'Decision Trees',
      description:
        'Greedy yes/no splits that minimise Gini or entropy. Information gain, pruning, and why one deep tree overfits.',
      readTime: '16 min',
      component: DecisionTreesLesson,
    },
    {
      id: 'random-forests',
      title: 'Random Forests',
      description:
        'Bagged trees plus random features at each split. OOB error, max_features, and why more trees rarely overfit.',
      readTime: '16 min',
      component: RandomForestsLesson,
    },
    {
      id: 'gradient-boosting',
      title: 'Gradient Boosting',
      description:
        'Add trees that fit the negative gradient of the loss. Shrinkage, early stopping, and how XGBoost / LightGBM / CatBoost fit in.',
      readTime: '18 min',
      component: GradientBoostingLesson,
    },
    {
      id: 'support-vector-machines',
      title: 'Support Vector Machines',
      description:
        'Maximum-margin hyperplanes, hinge loss, the C knob, and kernels (linear, polynomial, RBF).',
      readTime: '18 min',
      component: SupportVectorMachines,
    },
    {
      id: 'classification-metrics',
      title: 'Classification Metrics',
      description:
        'Confusion matrix, precision / recall / F1, thresholds, ROC vs PR, and the 99% accuracy trap.',
      readTime: '14 min',
      component: ClassificationMetrics,
    },
  ],
}
