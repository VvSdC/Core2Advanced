import type { SubTopic } from '../../../types'
import { LeakageDuplicatesAndSplits } from './lessons/leakage-duplicates-and-splits'
import { RelationshipsAndTarget } from './lessons/relationships-and-target'
import { UnivariateEda } from './lessons/univariate-eda'
import { WhyEda } from './lessons/why-eda'

export const exploratoryDataAnalysisSubTopic: SubTopic = {
  id: 'exploratory-data-analysis',
  title: 'Exploratory Data Analysis',
  description:
    'Look at the table before you model — what a row is, what is missing, how features relate to the target, and the leakage smells that fake a genius score.',
  lessons: [
    {
      id: 'why-eda',
      title: 'Why EDA (and when)',
      description:
        'The questions every dataset must answer, why this chapter sits before algorithms, and why you explore train — not test.',
      readTime: '14 min',
      component: WhyEda,
    },
    {
      id: 'univariate-eda',
      title: 'Univariate EDA',
      description:
        'Types, sentinels, missingness, shape, cardinality — one column at a time, before you plot vs y.',
      readTime: '16 min',
      component: UnivariateEda,
    },
    {
      id: 'relationships-and-the-target',
      title: 'Relationships & the Target',
      description:
        'Feature vs y and feature vs feature. Pearson vs a U-shape, twins, confounders, and writing down imbalance.',
      readTime: '16 min',
      component: RelationshipsAndTarget,
    },
    {
      id: 'leakage-duplicates-and-splits',
      title: 'Leakage, Duplicates & Splits',
      description:
        'The clock test, duplicate keys, a column with AUROC 1.0, and which split the data note should demand.',
      readTime: '16 min',
      component: LeakageDuplicatesAndSplits,
    },
  ],
}
