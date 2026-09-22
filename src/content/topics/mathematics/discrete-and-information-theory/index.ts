import type { SubTopic } from '../../../types'

import { SetsAndBooleanLogic } from './lessons/sets-and-boolean-logic'
import { CombinatoricsToolkit } from './lessons/combinatorics-toolkit'
import { LogarithmsAndExponentials } from './lessons/logarithms-and-exponentials'
import { EntropyAndInformation } from './lessons/entropy-and-information'
import { CrossEntropyAndKlDivergence } from './lessons/cross-entropy-and-kl-divergence'
import { DistanceMetrics } from './lessons/distance-metrics'

export const discreteAndInformationTheorySubTopic: SubTopic = {
  id: 'discrete-and-information-theory',
  title: 'Discrete Math & Information Theory',
  description:
    'Sets, counting, logs, and the information-theoretic machinery behind cross-entropy loss, KL divergence, and vector-store distance metrics. Six lessons with 6 worked problems and NumPy verification each.',
  lessons: [
    {
      id: 'sets-and-boolean-logic',
      title: 'Sets & Boolean Logic',
      description:
        'Set operations, De Morgan, inclusion–exclusion, Cartesian product, power set — the algebra behind every SQL WHERE and vector-store filter.',
      readTime: '16 min',
      component: SetsAndBooleanLogic,
    },
    {
      id: 'combinatorics-toolkit',
      title: 'Combinatorics Toolkit',
      description:
        'Multiplication rule, permutations, combinations, stars & bars, multinomials, pigeonhole — the 2 × 2 grid of "order × repetition" and where each shows up in ML.',
      readTime: '16 min',
      component: CombinatoricsToolkit,
    },
    {
      id: 'logarithms-and-exponentials',
      title: 'Logarithms & Exponentials',
      description:
        'Log rules, log-space math, LogSumExp, numerically safe softmax, and why every framework stores logits — plus big-O with logs.',
      readTime: '18 min',
      component: LogarithmsAndExponentials,
    },
    {
      id: 'entropy-and-information',
      title: 'Entropy & Information',
      description:
        'Self-information, Shannon entropy, joint / conditional entropy, and mutual information — with decision-tree information gain worked in full.',
      readTime: '18 min',
      component: EntropyAndInformation,
    },
    {
      id: 'cross-entropy-and-kl-divergence',
      title: 'Cross-Entropy & KL Divergence',
      description:
        'Cross-entropy vs KL, forward vs reverse KL, binary and categorical cross-entropy losses, VAE / RLHF / distillation applications, and JSD / TV as symmetric siblings.',
      readTime: '18 min',
      component: CrossEntropyAndKlDivergence,
    },
    {
      id: 'distance-metrics',
      title: 'Distance Metrics',
      description:
        'Metric axioms, the Minkowski family (L1/L2/L∞), cosine, Hamming, Jaccard, Levenshtein, and Mahalanobis — matched to the data types they were built for.',
      readTime: '18 min',
      component: DistanceMetrics,
    },
  ],
}
