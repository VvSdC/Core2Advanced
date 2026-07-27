import type { SubTopic } from '../../../types'
import { GettingStartedWithNumpy } from './lessons/getting-started-with-numpy'
import { NumpyBenefits } from './lessons/numpy-benefits'
import { WhyNotJustLists } from './lessons/why-not-just-lists'

export const whyNumpySubTopic: SubTopic = {
  id: 'why-numpy',
  title: 'Why NumPy?',
  description:
    'Begin here — learning path, why lists are not enough, and the big benefits of NumPy.',
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
}
