import type { SubTopic } from '../../../types'
import { MeanLesson } from './lessons/mean'
import { MedianLesson } from './lessons/median'

export const statisticsSubTopic: SubTopic = {
  id: 'statistics',
  title: 'Statistics on Arrays',
  description: 'Mean and median — whole-array and axis-wise summaries.',
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
}
