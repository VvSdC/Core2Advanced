import type { Topic } from '../../types'

import { collectionsSubTopic } from './collections'

import { fundamentalsSubTopic } from './fundamentals'

import { functionsSubTopic } from './functions'

import { introductionSubTopic } from './introduction'

import { linkedListSubTopic } from './linked-list'

import { listsSubTopic } from './lists'

import { miscellaneousSubTopic } from './miscellaneous'

import { oopSubTopic } from './oop'



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

        subTopicIds: ['lists', 'linked-list'],

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

    linkedListSubTopic,

    miscellaneousSubTopic,

  ],

}

