import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'
import { calculusSubTopic } from './calculus'
import { linearAlgebraSubTopic } from './linear-algebra'
import { probabilityAndStatisticsSubTopic } from './probability-and-statistics'

const discreteAndInformationTheorySubTopic = createEmptySubTopic(
  'discrete-and-information-theory',
  'Discrete Math & Information Theory',
  'Sets, combinatorics, logs & exponentials, entropy, cross-entropy, KL divergence, and distance metrics — coming soon.',
)

export const mathematicsTopic: Topic = {
  id: 'mathematics',
  title: 'Mathematics',
  description:
    'Math foundations for ML and computing — linear algebra, calculus, probability & statistics, and discrete math / information theory. Every topic pairs the concept with 3–6 worked problems and a NumPy implementation.',
  accent: 'mathematics',
  catalog: [
    { type: 'subTopic', subTopicId: 'linear-algebra' },
    { type: 'subTopic', subTopicId: 'calculus' },
    { type: 'subTopic', subTopicId: 'probability-and-statistics' },
    { type: 'subTopic', subTopicId: 'discrete-and-information-theory' },
  ],
  subTopics: [
    linearAlgebraSubTopic,
    calculusSubTopic,
    probabilityAndStatisticsSubTopic,
    discreteAndInformationTheorySubTopic,
  ],
}
