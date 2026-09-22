import type { SubTopic } from '../../../types'
import { EdaCaseStudies } from './lessons/eda-case-studies'
import { FindingRelationships } from './lessons/finding-relationships'
import { FirstLookAtData } from './lessons/first-look-at-data'
import { LeakageDuplicatesAndSplits } from './lessons/leakage-duplicates-and-splits'
import { MissingValuesDeepDive } from './lessons/missing-values-deep-dive'
import { UnderstandingEachColumn } from './lessons/understanding-each-column'
import { WhatIsEda } from './lessons/what-is-eda'

export const exploratoryDataAnalysisSubTopic: SubTopic = {
  id: 'exploratory-data-analysis',
  title: 'Exploratory Data Analysis',
  description:
    'From “what is this table?” to leakage-proof splits — grain, types, univariate health, missingness, relationships, traps, and full case studies on tiny messy tables.',
  lessons: [
    {
      id: 'what-is-eda',
      title: 'What Is EDA?',
      description:
        'The habit before any algorithm: five questions every dataset must answer, the freeze test, and a data-note template you will reuse.',
      readTime: '18 min',
      component: WhatIsEda,
    },
    {
      id: 'first-look-at-data',
      title: 'First Look at the Data',
      description:
        'Shape, grain, modelling types, and meeting the target — the first hour with a new file.',
      readTime: '18 min',
      component: FirstLookAtData,
    },
    {
      id: 'understanding-each-column',
      title: 'Understanding Each Column',
      description:
        'Univariate EDA: mean vs median, skew, outliers vs sentinels, cardinality, datetime and text first-passes.',
      readTime: '20 min',
      component: UnderstandingEachColumn,
    },
    {
      id: 'missing-values-deep-dive',
      title: 'Missing Values Deep Dive',
      description:
        'MCAR / MAR / MNAR stories, sentinels, missingness vs the target, and what EDA decides before FE imputes.',
      readTime: '18 min',
      component: MissingValuesDeepDive,
    },
    {
      id: 'finding-relationships',
      title: 'Finding Relationships',
      description:
        'Feature vs target and feature vs feature — rates, scatter, correlation limits, slices, and suspiciously perfect scores.',
      readTime: '18 min',
      component: FindingRelationships,
    },
    {
      id: 'leakage-duplicates-and-splits',
      title: 'Leakage, Duplicates & Splits',
      description:
        'Freeze-time test, duplicates, group and time splits, train-only exploration — the safety net before feature engineering.',
      readTime: '20 min',
      component: LeakageDuplicatesAndSplits,
    },
    {
      id: 'eda-case-studies',
      title: 'EDA Case Studies',
      description:
        'Six tiny messy tables (12–15 rows): classify types, read distributions, map nulls/sentinels, and write a data note before modelling.',
      readTime: '35 min',
      component: EdaCaseStudies,
    },
  ],
}
