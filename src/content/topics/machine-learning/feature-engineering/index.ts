import type { SubTopic } from '../../../types'
import { CreatingFeatures } from './lessons/creating-features'
import { EncodingCategoricals } from './lessons/encoding-categoricals'
import { MissingAndOutliers } from './lessons/missing-and-outliers'
import { ScalingAndTransforms } from './lessons/scaling-and-transforms'
import { SelectionAndPipelines } from './lessons/selection-and-pipelines'

export const featureEngineeringSubTopic: SubTopic = {
  id: 'feature-engineering',
  title: 'Feature Engineering',
  description:
    'Repair and enrich the columns EDA found — missing values, scaling, encoding, new features, then a pipeline you can fit on train and serve unchanged.',
  lessons: [
    {
      id: 'missing-and-outliers',
      title: 'Missing Values & Outliers',
      description:
        'Impute + indicator, structural zeros, winsorising, and why you never drop the rare-class rows.',
      readTime: '16 min',
      component: MissingAndOutliers,
    },
    {
      id: 'scaling-and-transforms',
      title: 'Scaling & Numeric Transforms',
      description:
        'Who needs scaling, log1p for skew, fit μ/σ on train only — trees mostly do not care.',
      readTime: '14 min',
      component: ScalingAndTransforms,
    },
    {
      id: 'encoding-categoricals',
      title: 'Encoding Categoricals',
      description:
        'One-hot, ordinal, frequency, smoothed target encoding, hashing — and unseen levels in production.',
      readTime: '16 min',
      component: EncodingCategoricals,
    },
    {
      id: 'creating-features',
      title: 'Creating Features',
      description:
        'Ratios, interactions, datetime parts, strictly-past lags, and user history that does not leak.',
      readTime: '16 min',
      component: CreatingFeatures,
    },
    {
      id: 'selection-and-pipelines',
      title: 'Selection & Pipelines',
      description:
        'Filter / wrapper / embedded selection, ColumnTransformer, and why the pipeline is what you deploy.',
      readTime: '16 min',
      component: SelectionAndPipelines,
    },
  ],
}
