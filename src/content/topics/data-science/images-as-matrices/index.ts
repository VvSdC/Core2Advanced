import type { SubTopic } from '../../../types'
import { ImageAsMatrix } from './lessons/image-as-matrix'

export const imagesAsMatricesSubTopic: SubTopic = {
  id: 'images-as-matrices',
  title: 'Images as Matrices',
  description: 'Pixels are numbers — grayscale and RGB arrays, crops, and simple transforms.',
  lessons: [
    {
      id: 'image-as-matrix',
      title: 'Image as a NumPy Matrix',
      description: 'Build a tiny image array, visualize it, slice a region, and stack RGB channels.',
      readTime: '12 min',
      component: ImageAsMatrix,
    },
  ],
}
