import type { Topic } from '../../types'
import { introductionSubTopic } from './introduction'
import { multipleLinearRegressionSubTopic } from './multiple-linear-regression'
import { polynomialRegressionSubTopic } from './polynomial-regression'
import { simpleLinearRegressionSubTopic } from './simple-linear-regression'

export const machineLearningTopic: Topic = {
  id: 'machine-learning',
  title: 'Machine Learning',
  description:
    'Classical ML — foundations, simple / multiple / polynomial regression, features, and evaluation.',
  accent: 'machine-learning',
  catalog: [
    { type: 'subTopic', subTopicId: 'introduction' },
    { type: 'subTopic', subTopicId: 'simple-linear-regression' },
    { type: 'subTopic', subTopicId: 'multiple-linear-regression' },
    { type: 'subTopic', subTopicId: 'polynomial-regression' },
  ],
  subTopics: [
    introductionSubTopic,
    simpleLinearRegressionSubTopic,
    multipleLinearRegressionSubTopic,
    polynomialRegressionSubTopic,
  ],
}
