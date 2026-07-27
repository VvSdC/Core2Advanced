import type { SubTopic } from '../../../types'
import { FilteringArrays } from './lessons/filtering-arrays'

export const filteringSubTopic: SubTopic = {
  id: 'filtering',
  title: 'Filtering Arrays',
  description: 'Boolean masks, combined conditions, and np.where.',
  lessons: [
    {
      id: 'filtering-arrays',
      title: 'Boolean Masks & Filtering',
      description: 'Keep the values that match a condition — with multiple examples.',
      readTime: '11 min',
      component: FilteringArrays,
    },
  ],
}
