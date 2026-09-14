import type { SubTopic } from '../../../types'
import { ArangeLesson } from '../array-creation/lessons/arange'
import { EyeLesson } from '../array-creation/lessons/eye'
import { LinspaceLesson } from '../array-creation/lessons/linspace'
import { RandomLesson } from '../array-creation/lessons/random'
import { ZerosOnesFull } from '../array-creation/lessons/zeros-ones-full'
import { BroadcastingNotebook } from '../broadcasting/lessons/broadcasting-notebook'
import { BroadcastingRules } from '../broadcasting/lessons/broadcasting-rules'
import { WhatIsBroadcasting } from '../broadcasting/lessons/what-is-broadcasting'
import { DtypesLesson } from '../dtypes-and-shape/lessons/dtypes'
import { ShapeLesson } from '../dtypes-and-shape/lessons/shape'
import { FilteringArrays } from '../filtering/lessons/filtering-arrays'
import { ImageAsMatrix } from '../images-as-matrices/lessons/image-as-matrix'
import { AccessingElements } from '../indexing-and-slicing/lessons/accessing-elements'
import { SlicingArrays } from '../indexing-and-slicing/lessons/slicing-arrays'
import { CreatingArraysNotebook } from '../multidimensional-arrays/lessons/creating-arrays-notebook'
import { VectorsAndMatrices } from '../multidimensional-arrays/lessons/vectors-and-matrices'
import { MeanLesson } from '../statistics/lessons/mean'
import { MedianLesson } from '../statistics/lessons/median'
import { GettingStartedWithNumpy } from '../why-numpy/lessons/getting-started-with-numpy'
import { NumpyBenefits } from '../why-numpy/lessons/numpy-benefits'
import { WhyNotJustLists } from '../why-numpy/lessons/why-not-just-lists'

export const numpySubTopic: SubTopic = {
  id: 'numpy',
  title: 'NumPy',
  description:
    'Arrays, indexing, creation helpers, broadcasting, stats, filtering, and images — from zero to comfortable.',
  lessonSections: [
    {
      id: 'why-numpy',
      title: 'Why NumPy?',
      lessons: [
        {
          id: 'getting-started-with-numpy',
          title: 'Getting Started',
          description: 'Beginner roadmap, vocabulary, setup, and how to study this track calmly.',
          readTime: '10 min',
          component: GettingStartedWithNumpy,
        },
        {
          id: 'why-not-just-lists',
          title: 'Why Not Just Python Lists?',
          description: 'Efficiency and time tradeoffs — when lists struggle and arrays shine.',
          readTime: '11 min',
          component: WhyNotJustLists,
        },
        {
          id: 'numpy-benefits',
          title: 'Benefits of NumPy',
          description: 'Vectorized ops, optimized math functions, and complex work with minimal code.',
          readTime: '9 min',
          component: NumpyBenefits,
        },
      ],
    },
    {
      id: 'multidimensional-arrays',
      title: 'Multidimensional Arrays',
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
    },
    {
      id: 'dtypes-and-shape',
      title: 'Data Types & Shape',
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
    },
    {
      id: 'indexing-and-slicing',
      title: 'Indexing & Slicing',
      lessons: [
        {
          id: 'accessing-elements',
          title: 'Accessing Elements',
          description: 'a[i], M[row, col], and selecting whole rows or columns.',
          readTime: '9 min',
          component: AccessingElements,
        },
        {
          id: 'slicing-arrays',
          title: 'Slicing Arrays',
          description: 'Windows with start:stop:step in 1-D and 2-D, and when to .copy().',
          readTime: '11 min',
          component: SlicingArrays,
        },
      ],
    },
    {
      id: 'array-creation',
      title: 'Array Creation Helpers',
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
    },
    {
      id: 'broadcasting',
      title: 'Broadcasting',
      lessons: [
        {
          id: 'what-is-broadcasting',
          title: 'What Is Broadcasting?',
          description: 'Stretch-to-fit idea — from scores + 5 to tax vectors on a price table.',
          readTime: '10 min',
          component: WhatIsBroadcasting,
        },
        {
          id: 'broadcasting-rules',
          title: 'Broadcasting Rules',
          description: 'Compare shapes from the right — equal or 1 — plus row/column patterns.',
          readTime: '12 min',
          component: BroadcastingRules,
        },
        {
          id: 'broadcasting-notebook',
          title: 'Broadcasting (Notebook)',
          description: 'Scalar, row, column, errors, and demeaning columns — with outputs.',
          readTime: '14 min',
          component: BroadcastingNotebook,
        },
      ],
    },
    {
      id: 'statistics',
      title: 'Statistics on Arrays',
      lessons: [
        {
          id: 'mean',
          title: 'Mean',
          description: 'Averages with np.mean — overall and along rows/columns.',
          readTime: '8 min',
          component: MeanLesson,
        },
        {
          id: 'median',
          title: 'Median',
          description: 'Middle values that resist outliers — and when to prefer them over the mean.',
          readTime: '8 min',
          component: MedianLesson,
        },
      ],
    },
    {
      id: 'filtering',
      title: 'Filtering Arrays',
      lessons: [
        {
          id: 'filtering-arrays',
          title: 'Boolean Masks & Filtering',
          description: 'Keep the values that match a condition — with multiple examples.',
          readTime: '11 min',
          component: FilteringArrays,
        },
      ],
    },
    {
      id: 'images-as-matrices',
      title: 'Images as Matrices',
      lessons: [
        {
          id: 'image-as-matrix',
          title: 'Image as a NumPy Matrix',
          description: 'Build a tiny image array, visualize it, slice a region, and stack RGB channels.',
          readTime: '12 min',
          component: ImageAsMatrix,
        },
      ],
    },
  ],
}
