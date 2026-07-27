import type { SubTopic } from '../../../types'
import { ArangeLesson } from './lessons/arange'
import { EyeLesson } from './lessons/eye'
import { LinspaceLesson } from './lessons/linspace'
import { RandomLesson } from './lessons/random'
import { ZerosOnesFull } from './lessons/zeros-ones-full'

export const arrayCreationSubTopic: SubTopic = {
  id: 'array-creation',
  title: 'Array Creation Helpers',
  description:
    'Build arrays without typing every value — arange, linspace, zeros, ones, full, eye, and random.',
  lessons: [
    {
      id: 'arange',
      title: 'np.arange',
      description: 'Evenly spaced values with a step — NumPy’s range.',
      readTime: '8 min',
      component: ArangeLesson,
    },
    {
      id: 'linspace',
      title: 'np.linspace',
      description: 'Fixed number of points between start and stop (inclusive).',
      readTime: '8 min',
      component: LinspaceLesson,
    },
    {
      id: 'zeros-ones-full',
      title: 'zeros, ones & full',
      description: 'Constant-filled arrays and zeros_like / ones_like.',
      readTime: '9 min',
      component: ZerosOnesFull,
    },
    {
      id: 'eye',
      title: 'np.eye (Identity)',
      description: 'Identity matrices and shifted diagonals.',
      readTime: '7 min',
      component: EyeLesson,
    },
    {
      id: 'random',
      title: 'Random Arrays',
      description: 'default_rng — uniform, integers, normal, shuffle.',
      readTime: '10 min',
      component: RandomLesson,
    },
  ],
}
