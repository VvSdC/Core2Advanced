import type { SubTopic } from '../../../types'
import { DtypesLesson } from './lessons/dtypes'
import { ShapeLesson } from './lessons/shape'

export const dtypesAndShapeSubTopic: SubTopic = {
  id: 'dtypes-and-shape',
  title: 'Data Types & Shape',
  description: 'dtype, shape, reshape, and how NumPy describes array structure.',
  lessons: [
    {
      id: 'dtypes',
      title: 'Data Types (dtype)',
      description: 'int, float, bool — homogeneous types and astype conversions.',
      readTime: '10 min',
      component: DtypesLesson,
    },
    {
      id: 'shape',
      title: 'Shape & reshape',
      description: 'Read shapes, reshape safely, and use -1 to infer a dimension.',
      readTime: '10 min',
      component: ShapeLesson,
    },
  ],
}
