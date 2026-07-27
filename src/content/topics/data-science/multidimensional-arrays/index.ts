import type { SubTopic } from '../../../types'
import { CreatingArraysNotebook } from './lessons/creating-arrays-notebook'
import { VectorsAndMatrices } from './lessons/vectors-and-matrices'

export const multidimensionalArraysSubTopic: SubTopic = {
  id: 'multidimensional-arrays',
  title: 'Multidimensional Arrays',
  description:
    'Vectors, matrices, and the ndarray — how multi-dimensional data is represented and created.',
  lessons: [
    {
      id: 'vectors-and-matrices',
      title: 'Vectors, Matrices & Dimensions',
      description: 'How 1-D / 2-D / 3-D arrays map to vectors, tables, and stacks.',
      readTime: '9 min',
      component: VectorsAndMatrices,
    },
    {
      id: 'creating-arrays-notebook',
      title: 'Creating Arrays (Notebook)',
      description: 'import numpy, np.array, shape checks, and first vectorized ops — cell by cell.',
      readTime: '12 min',
      component: CreatingArraysNotebook,
    },
  ],
}
