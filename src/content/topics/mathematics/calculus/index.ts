import type { SubTopic } from '../../../types'

import { ChainRuleAndBackpropagation } from './lessons/chain-rule-and-backpropagation'
import { DerivativesAndRules } from './lessons/derivatives-and-rules'
import { GradientsAndJacobians } from './lessons/gradients-and-jacobians'
import { Integrals } from './lessons/integrals'
import { LimitsAndContinuity } from './lessons/limits-and-continuity'
import { PartialDerivatives } from './lessons/partial-derivatives'
import { TaylorSeriesAndConvexOptimisation } from './lessons/taylor-series-and-convex-optimisation'

export const calculusSubTopic: SubTopic = {
  id: 'calculus',
  title: 'Calculus',
  description:
    'From limits to convex optimisation — the calculus every ML person actually needs. Each lesson pairs the concept with 4–6 worked problems (pure-math and ML-flavour) and a SymPy / NumPy / PyTorch implementation.',
  lessons: [
    {
      id: 'limits-and-continuity',
      title: 'Limits & Continuity',
      description:
        'What "approaches" really means, plug-and-play evaluation, factor-and-cancel, L\'Hôpital\'s rule, one-sided limits, and continuity — with the ML-adjacent limits worth memorising (sigmoid, softplus, log-sum-exp).',
      readTime: '14 min',
      component: LimitsAndContinuity,
    },
    {
      id: 'derivatives-and-rules',
      title: 'Derivatives & Differentiation Rules',
      description:
        'Derivative as the slope of a tangent; the six core rules (constant, power, sum, scalar, product, quotient); ML zoo (eˣ, ln, sigmoid, tanh, ReLU, softplus); higher-order derivatives; symbolic and finite-difference implementations.',
      readTime: '16 min',
      component: DerivativesAndRules,
    },
    {
      id: 'partial-derivatives',
      title: 'Partial Derivatives',
      description:
        'The one-variable-at-a-time trick, gradient as the vector of partials, Clairaut\'s theorem, the Hessian and its role in classifying min/max/saddle points, and worked SLR + MLE derivations.',
      readTime: '16 min',
      component: PartialDerivatives,
    },
    {
      id: 'chain-rule-and-backpropagation',
      title: 'The Chain Rule & Backpropagation',
      description:
        'Single- and multi-variable chain rule; how backprop turns it into a forward/backward pass on a computation graph; hand-worked one-neuron gradient plus the softmax + cross-entropy (p − y) beauty and vanishing-gradient math.',
      readTime: '18 min',
      component: ChainRuleAndBackpropagation,
    },
    {
      id: 'gradients-and-jacobians',
      title: 'Gradients & Jacobians',
      description:
        'Vector calculus for ML — the gradient as steepest ascent, the Jacobian as the matrix of all partials, chain rule as Jacobian multiplication, softmax/L2-normalise/linear-layer Jacobians, and volume change for normalising flows.',
      readTime: '18 min',
      component: GradientsAndJacobians,
    },
    {
      id: 'integrals',
      title: 'Integrals',
      description:
        'Antiderivatives and areas, the Fundamental Theorem, substitution and by-parts; expectations and probabilities as integrals; numerical integration (trapezoidal, quad, Monte Carlo); AUC and Gaussian probabilities as worked examples.',
      readTime: '18 min',
      component: Integrals,
    },
    {
      id: 'taylor-series-and-convex-optimisation',
      title: 'Taylor Series & Convex Optimisation',
      description:
        'Local polynomial approximation, first-order Taylor = gradient descent, second-order = Newton; log1p/expm1 stability tricks; convexity via f\'\' and the Hessian; which ML losses are convex (linear/logistic/SVM) vs which are not (deep nets, K-means).',
      readTime: '20 min',
      component: TaylorSeriesAndConvexOptimisation,
    },
  ],
}
