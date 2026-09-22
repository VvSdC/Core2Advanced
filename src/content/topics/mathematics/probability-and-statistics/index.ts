import type { SubTopic } from '../../../types'

import { ProbabilityFoundations } from './lessons/probability-foundations'
import { ConditionalProbabilityAndBayes } from './lessons/conditional-probability-and-bayes'
import { RandomVariables } from './lessons/random-variables'
import { CommonDistributions } from './lessons/common-distributions'
import { ExpectationVarianceCovariance } from './lessons/expectation-variance-covariance'
import { LlnAndClt } from './lessons/lln-and-clt'
import { MleAndMap } from './lessons/mle-and-map'
import { HypothesisTestingAndConfidenceIntervals } from './lessons/hypothesis-testing-and-confidence-intervals'

export const probabilityAndStatisticsSubTopic: SubTopic = {
  id: 'probability-and-statistics',
  title: 'Probability & Statistics',
  description:
    'From axioms to A/B tests — the probability machinery every ML system relies on. Sample spaces, Bayes, random variables, common distributions, expectation, LLN & CLT, MLE / MAP, and hypothesis testing, each with 5–6 worked problems and Python verification.',
  lessons: [
    {
      id: 'probability-foundations',
      title: 'Probability Foundations',
      description:
        'Sample space, events, Kolmogorov axioms, counting rules, independence — the whole edifice in one lesson.',
      readTime: '18 min',
      component: ProbabilityFoundations,
    },
    {
      id: 'conditional-probability-and-bayes',
      title: 'Conditional Probability & Bayes',
      description:
        'Conditioning, multiplication rule, law of total probability, and the base-rate classic worked through Monty Hall and medical testing.',
      readTime: '20 min',
      component: ConditionalProbabilityAndBayes,
    },
    {
      id: 'random-variables',
      title: 'Random Variables',
      description:
        'Discrete vs continuous, PMFs / PDFs / CDFs, joint & conditional distributions, and the change-of-variables trick that powers normalising flows.',
      readTime: '18 min',
      component: RandomVariables,
    },
    {
      id: 'common-distributions',
      title: 'Common Distributions',
      description:
        'Bernoulli, Binomial, Poisson, Uniform, Exponential, Normal, Categorical — when to reach for each and how they connect.',
      readTime: '18 min',
      component: CommonDistributions,
    },
    {
      id: 'expectation-variance-covariance',
      title: 'Expectation, Variance & Covariance',
      description:
        'Linearity of expectation, variance identities, covariance vs correlation, and the covariance matrix that PCA diagonalises.',
      readTime: '20 min',
      component: ExpectationVarianceCovariance,
    },
    {
      id: 'lln-and-clt',
      title: 'Law of Large Numbers & CLT',
      description:
        'Why sample means converge, why they look Gaussian, and why every error bar you have ever quoted is powered by these two theorems.',
      readTime: '16 min',
      component: LlnAndClt,
    },
    {
      id: 'mle-and-map',
      title: 'MLE & MAP Estimation',
      description:
        'Maximum likelihood, maximum a posteriori, and the direct link between priors and regularisation — Ridge, Lasso, and Laplace smoothing.',
      readTime: '18 min',
      component: MleAndMap,
    },
    {
      id: 'hypothesis-testing-and-confidence-intervals',
      title: 'Hypothesis Testing & CIs',
      description:
        'Type I / II errors, z / t / χ² / F tests, confidence intervals, A/B tests, power analysis, and the multiple-testing trap.',
      readTime: '22 min',
      component: HypothesisTestingAndConfidenceIntervals,
    },
  ],
}
