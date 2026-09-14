import type { Topic } from '../../types'
import { matplotlibSubTopic } from './matplotlib'
import { numpySubTopic } from './numpy'
import { pandasSubTopic } from './pandas'
import { scipySubTopic } from './scipy'

export const dataScienceTopic: Topic = {
  id: 'data-science',
  title: 'Data Science',
  description:
    'NumPy, Pandas, SciPy, and Matplotlib — open a library, pick a section, then learn lesson by lesson.',
  accent: 'data-science',
  catalog: [
    { type: 'subTopic', subTopicId: 'numpy' },
    { type: 'subTopic', subTopicId: 'pandas' },
    { type: 'subTopic', subTopicId: 'scipy' },
    { type: 'subTopic', subTopicId: 'matplotlib' },
  ],
  subTopics: [numpySubTopic, pandasSubTopic, scipySubTopic, matplotlibSubTopic],
}
