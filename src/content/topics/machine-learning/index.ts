import type { Topic } from '../../types'
import { classificationSubTopic } from './classification'
import { exploratoryDataAnalysisSubTopic } from './exploratory-data-analysis'
import { featureEngineeringSubTopic } from './feature-engineering'
import { introductionSubTopic } from './introduction'
import { modelSelectionSubTopic } from './model-selection'
import { regressionSubTopic } from './regression'
import { unsupervisedSubTopic } from './unsupervised'

export const machineLearningTopic: Topic = {
  id: 'machine-learning',
  title: 'Machine Learning',
  description:
    'Classical ML in order — foundations, then know and prepare the data, then each algorithm family, then how to choose and trust a model.',
  accent: 'machine-learning',
  catalog: [
    { type: 'subTopic', subTopicId: 'introduction' },
    {
      type: 'section',
      section: {
        id: 'working-with-data',
        title: 'Working with data',
        description:
          'Before any algorithm: understand the table, then transform it. EDA writes the spec; feature engineering implements it on train only.',
        subTopicIds: ['exploratory-data-analysis', 'feature-engineering'],
      },
    },
    {
      type: 'section',
      section: {
        id: 'supervised-models',
        title: 'Supervised models',
        description:
          'Predict a number, then a category — now that the columns are honest and the pipeline is fit on train.',
        subTopicIds: ['regression', 'classification'],
      },
    },
    { type: 'subTopic', subTopicId: 'unsupervised' },
    { type: 'subTopic', subTopicId: 'model-selection' },
  ],
  subTopics: [
    introductionSubTopic,
    exploratoryDataAnalysisSubTopic,
    featureEngineeringSubTopic,
    regressionSubTopic,
    classificationSubTopic,
    unsupervisedSubTopic,
    modelSelectionSubTopic,
  ],
}
