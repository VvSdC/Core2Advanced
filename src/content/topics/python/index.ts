import type { Topic } from '../../types'

import { collectionsSubTopic } from './collections'

import { fundamentalsSubTopic } from './fundamentals'

import { functionsSubTopic } from './functions'

import { introductionSubTopic } from './introduction'

import { linkedListSubTopic } from './linked-list'

import { listsSubTopic } from './lists'

import { stringsSubTopic } from './strings'

import { triesSubTopic } from './tries'

import { miscellaneousSubTopic } from './miscellaneous'

import { oopSubTopic } from './oop'

import { stacksAndQueuesSubTopic } from './stacks-and-queues'

import { backtrackingSubTopic } from './backtracking'

import { binaryTreesSubTopic } from './binary-trees'

import { graphsSubTopic } from './graphs'

import { dynamicProgrammingSubTopic } from './dynamic-programming'

import { fenwickTreesSubTopic } from './fenwick-trees'

import { bitManipulationSubTopic } from './bit-manipulation'

import { segmentTreesSubTopic } from './segment-trees'



export const pythonTopic: Topic = {

  id: 'python',

  title: 'Python',

  description: 'From fundamentals to internals — learn Python clearly, step by step.',

  accent: 'python',

  catalog: [

    { type: 'subTopic', subTopicId: 'introduction' },

    { type: 'subTopic', subTopicId: 'fundamentals' },

    { type: 'subTopic', subTopicId: 'collections' },

    { type: 'subTopic', subTopicId: 'functions' },

    { type: 'subTopic', subTopicId: 'oop' },

    { type: 'subTopic', subTopicId: 'miscellaneous' },

    {

      type: 'section',

      section: {

        id: 'data-structures-and-algorithms',

        title: 'Data Structures & Algorithms',

        description:

          'Classic structures and algorithms — internals, sorting, and problem-solving patterns.',

        subTopicIds: ['lists', 'strings', 'tries', 'linked-list', 'stacks-and-queues', 'backtracking', 'binary-trees', 'graphs', 'dynamic-programming', 'fenwick-trees', 'bit-manipulation', 'segment-trees'],

      },

    },

  ],

  subTopics: [

    introductionSubTopic,

    fundamentalsSubTopic,

    collectionsSubTopic,

    functionsSubTopic,

    oopSubTopic,

    listsSubTopic,

    stringsSubTopic,

    triesSubTopic,

    linkedListSubTopic,

    stacksAndQueuesSubTopic,

    backtrackingSubTopic,

    binaryTreesSubTopic,

    graphsSubTopic,

    dynamicProgrammingSubTopic,

    fenwickTreesSubTopic,

    bitManipulationSubTopic,

    segmentTreesSubTopic,

    miscellaneousSubTopic,

  ],

}

