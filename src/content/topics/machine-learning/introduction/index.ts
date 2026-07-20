import type { SubTopic } from '../../../types'
import { BatchVsOnlineLearning } from './lessons/batch-vs-online-learning'
import { ChallengesOfMl } from './lessons/challenges-of-ml'
import { FeaturesLabelsAndData } from './lessons/features-labels-and-data'
import { InstanceVsModelBased } from './lessons/instance-vs-model-based'
import { OverfittingAndUnderfitting } from './lessons/overfitting-and-underfitting'
import { PuttingItTogetherMl } from './lessons/putting-it-together-ml'
import { ReinforcementLearningIntro } from './lessons/reinforcement-learning-intro'
import { SupervisedLearning } from './lessons/supervised-learning'
import { TheMlWorkflow } from './lessons/the-ml-workflow'
import { TrainValidationTest } from './lessons/train-validation-test'
import { TypesOfMlTechniques } from './lessons/types-of-ml-techniques'
import { UnsupervisedLearning } from './lessons/unsupervised-learning'
import { WhatIsMachineLearning } from './lessons/what-is-machine-learning'
import { WhyMachineLearning } from './lessons/why-machine-learning'

const gettingOrientedLessons = [
  {
    id: 'what-is-machine-learning',
    title: 'What Is Machine Learning?',
    description:
      'Learn patterns from data instead of hand-written rules — the core idea and vocabulary.',
    readTime: '10 min',
    component: WhatIsMachineLearning,
  },
  {
    id: 'why-machine-learning',
    title: 'Why Machine Learning?',
    description:
      'When rules fail, when the world changes, and where ML already powers everyday products.',
    readTime: '9 min',
    component: WhyMachineLearning,
  },
  {
    id: 'features-labels-and-data',
    title: 'Features, Labels & Data',
    description:
      'Rows, columns, features, labels, and the difference between labeled and unlabeled data.',
    readTime: '10 min',
    component: FeaturesLabelsAndData,
  },
]

const typesOfLearningLessons = [
  {
    id: 'types-of-ml-techniques',
    title: 'Types of ML Techniques',
    description:
      'Supervised, unsupervised, semi-supervised, and reinforcement learning — the big map.',
    readTime: '11 min',
    component: TypesOfMlTechniques,
  },
  {
    id: 'supervised-learning',
    title: 'Supervised Learning',
    description: 'Learn from labeled answers — classification vs regression with clear examples.',
    readTime: '11 min',
    component: SupervisedLearning,
  },
  {
    id: 'unsupervised-learning',
    title: 'Unsupervised Learning',
    description: 'Find structure without labels — clustering, dimensionality reduction, anomalies.',
    readTime: '10 min',
    component: UnsupervisedLearning,
  },
  {
    id: 'reinforcement-learning-intro',
    title: 'Reinforcement Learning',
    description: 'Agents, environments, rewards, and the explore vs exploit trade-off.',
    readTime: '10 min',
    component: ReinforcementLearningIntro,
  },
]

const howSystemsLearnLessons = [
  {
    id: 'batch-vs-online-learning',
    title: 'Batch vs Online Learning',
    description: 'Train once on a full dataset, or update continuously as new data arrives.',
    readTime: '9 min',
    component: BatchVsOnlineLearning,
  },
  {
    id: 'instance-vs-model-based',
    title: 'Instance-Based vs Model-Based',
    description:
      'Remember examples (k-NN style) vs fit a compact model — two ways to generalize.',
    readTime: '11 min',
    component: InstanceVsModelBased,
  },
]

const buildingGoodModelsLessons = [
  {
    id: 'the-ml-workflow',
    title: 'The ML Workflow',
    description:
      'From problem framing to deploy and monitor — the pipeline behind every real project.',
    readTime: '12 min',
    component: TheMlWorkflow,
  },
  {
    id: 'challenges-of-ml',
    title: 'Challenges of Machine Learning',
    description: 'Bad data, bias, leakage, drift, and other traps that beat fancy algorithms.',
    readTime: '10 min',
    component: ChallengesOfMl,
  },
  {
    id: 'train-validation-test',
    title: 'Train, Validation & Test',
    description: 'Split data honestly so you can learn, tune, and measure generalization.',
    readTime: '11 min',
    component: TrainValidationTest,
  },
  {
    id: 'overfitting-and-underfitting',
    title: 'Overfitting & Underfitting',
    description: 'Too simple vs too complex — how to spot the gap and what to fix.',
    readTime: '11 min',
    component: OverfittingAndUnderfitting,
  },
  {
    id: 'putting-it-together-ml',
    title: 'Putting It All Together',
    description: 'One mental model of ML, a spam-filter story, and what to learn next.',
    readTime: '8 min',
    component: PuttingItTogetherMl,
  },
]

export const introductionSubTopic: SubTopic = {
  id: 'introduction',
  title: 'Introduction to Machine Learning',
  description:
    'Beginner-friendly foundations — what ML is, types of learning, instance vs model-based methods, and how to build and evaluate models honestly.',
  lessonSections: [
    {
      id: 'getting-oriented',
      title: 'Getting Oriented',
      lessons: gettingOrientedLessons,
    },
    {
      id: 'types-of-learning',
      title: 'Types of Learning',
      lessons: typesOfLearningLessons,
    },
    {
      id: 'how-systems-learn',
      title: 'How Systems Learn',
      lessons: howSystemsLearnLessons,
    },
    {
      id: 'building-good-models',
      title: 'Building Good Models',
      lessons: buildingGoodModelsLessons,
    },
  ],
}
