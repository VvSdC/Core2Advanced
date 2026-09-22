import type { SubTopic } from '../../../types'
import { CreatingFeatures } from './lessons/creating-features'
import { EncodingCategoricals } from './lessons/encoding-categoricals'
import { FeCaseStudies } from './lessons/fe-case-studies'
import { MissingAndOutliers } from './lessons/missing-and-outliers'
import { ScalingAndTransforms } from './lessons/scaling-and-transforms'
import { SelectionAndPipelines } from './lessons/selection-and-pipelines'
import { WhatIsFeatureEngineering } from './lessons/what-is-feature-engineering'

export const featureEngineeringSubTopic: SubTopic = {
  id: 'feature-engineering',
  title: 'Feature Engineering',
  description:
    'From the EDA data note to a deployable pipeline — impute, scale, encode, create leak-free features, select, and rehearse on six fresh case studies.',
  lessons: [
    {
      id: 'what-is-feature-engineering',
      title: 'What Is Feature Engineering?',
      description:
        'EDA found the mess; FE decides what the model sees — train-only fits, model-family choices, and the pipeline contract.',
      readTime: '16 min',
      component: WhatIsFeatureEngineering,
    },
    {
      id: 'missing-and-outliers',
      title: 'Missing Values & Outliers',
      description:
        'Impute + indicator, structural zeros, sentinels, winsorising — fit every fill on train only.',
      readTime: '18 min',
      component: MissingAndOutliers,
    },
    {
      id: 'scaling-and-transforms',
      title: 'Scaling & Numeric Transforms',
      description:
        'Who needs scaling, log1p / Yeo–Johnson, RobustScaler, and inverting target transforms for reports.',
      readTime: '18 min',
      component: ScalingAndTransforms,
    },
    {
      id: 'encoding-categoricals',
      title: 'Encoding Categoricals',
      description:
        'One-hot, ordinal, frequency, smoothed target encoding, hashing — and unseen levels in production.',
      readTime: '20 min',
      component: EncodingCategoricals,
    },
    {
      id: 'creating-features',
      title: 'Creating Features',
      description:
        'Ratios, interactions, cyclical time, strictly-past lags, entity history, and train/serve parity.',
      readTime: '18 min',
      component: CreatingFeatures,
    },
    {
      id: 'selection-and-pipelines',
      title: 'Selection & Pipelines',
      description:
        'Filter / wrapper / embedded selection nested in CV, ColumnTransformer, and the Pipeline you deploy.',
      readTime: '18 min',
      component: SelectionAndPipelines,
    },
    {
      id: 'fe-case-studies',
      title: 'Feature Engineering Case Studies',
      description:
        'Six new domains (hotel, ETA, hospital LOS, ads, smart meter, warehouse) — apply impute, encode, create, and pipeline plans on tiny messy tables.',
      readTime: '35 min',
      component: FeCaseStudies,
    },
  ],
}
