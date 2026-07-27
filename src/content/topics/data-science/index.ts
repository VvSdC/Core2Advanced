import type { Topic } from '../../types'
import { arrayCreationSubTopic } from './array-creation'
import { broadcastingSubTopic } from './broadcasting'
import { dtypesAndShapeSubTopic } from './dtypes-and-shape'
import { filteringSubTopic } from './filtering'
import { imagesAsMatricesSubTopic } from './images-as-matrices'
import { indexingAndSlicingSubTopic } from './indexing-and-slicing'
import { multidimensionalArraysSubTopic } from './multidimensional-arrays'
import { pandasSubTopic } from './pandas'
import { statisticsSubTopic } from './statistics'
import { whyNumpySubTopic } from './why-numpy'

export const dataScienceTopic: Topic = {
  id: 'data-science',
  title: 'Data Science',
  description:
    'NumPy foundations first, then a full Pandas course — tables, cleaning, wrangling, viz, and advanced topics.',
  accent: 'data-science',
  catalog: [
    {
      type: 'section',
      section: {
        id: 'numpy',
        title: 'NumPy',
        description: 'Arrays, indexing, creation helpers, broadcasting, stats, filtering, and images.',
        subTopicIds: [
          'why-numpy',
          'multidimensional-arrays',
          'dtypes-and-shape',
          'indexing-and-slicing',
          'array-creation',
          'broadcasting',
          'statistics',
          'filtering',
          'images-as-matrices',
        ],
      },
    },
    {
      type: 'section',
      section: {
        id: 'pandas-section',
        title: 'Pandas',
        description: 'Tabular data analysis from basics through time series and performance.',
        subTopicIds: ['pandas'],
      },
    },
  ],
  subTopics: [
    whyNumpySubTopic,
    multidimensionalArraysSubTopic,
    dtypesAndShapeSubTopic,
    indexingAndSlicingSubTopic,
    arrayCreationSubTopic,
    broadcastingSubTopic,
    statisticsSubTopic,
    filteringSubTopic,
    imagesAsMatricesSubTopic,
    pandasSubTopic,
  ],
}
