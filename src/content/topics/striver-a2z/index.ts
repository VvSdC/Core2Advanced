import type { Topic } from '../../types'
import { arraysSubTopic } from './arrays'
import { backtrackingSubTopic } from './backtracking'
import { binaryTreesSubTopic } from './binary-trees'
import { graphsSubTopic } from './graphs'
import { queuesSubTopic } from './queues'
import { stacksSubTopic } from './stacks'

export const striverA2zTopic: Topic = {
  id: 'striver-a2z',
  title: "Striver's A2Z Sheet",
  description:
    'Topic-wise DSA problems with solutions and step-by-step explanations — add problems category by category.',
  accent: 'striver',
  catalog: [
    { type: 'subTopic', subTopicId: 'arrays' },
    { type: 'subTopic', subTopicId: 'backtracking' },
    { type: 'subTopic', subTopicId: 'stacks' },
    { type: 'subTopic', subTopicId: 'queues' },
    { type: 'subTopic', subTopicId: 'binary-trees' },
    { type: 'subTopic', subTopicId: 'graphs' },
  ],
  subTopics: [
    arraysSubTopic,
    backtrackingSubTopic,
    stacksSubTopic,
    queuesSubTopic,
    binaryTreesSubTopic,
    graphsSubTopic,
  ],
}
