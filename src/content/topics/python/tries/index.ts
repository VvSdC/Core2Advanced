import type { SubTopic } from '../../../types'
import { AddingDeletingEditingWords } from './lessons/adding-deleting-editing-words'
import { BasicTrieImplementation } from './lessons/basic-trie-implementation'
import { IntroductionToTries } from './lessons/introduction-to-tries'
import { WordSearchWithTrie } from './lessons/word-search-with-trie'

export const triesSubTopic: SubTopic = {
  id: 'tries',
  title: 'Tries',
  description: 'Prefix trees — insert, search, delete, edit words, and grid word search.',
  lessonSections: [
    {
      id: 'data-structure',
      title: 'Data Structure',
      lessons: [
        {
          id: 'introduction-to-tries',
          title: 'Introduction to Tries',
          description: 'Prefix trees, why they beat hash sets for autocomplete.',
          readTime: '9 min',
          component: IntroductionToTries,
        },
        {
          id: 'basic-trie-implementation',
          title: 'Basic Trie Implementation',
          description: 'TrieNode, insert, search, and starts_with in Python.',
          readTime: '11 min',
          component: BasicTrieImplementation,
        },
      ],
    },
    {
      id: 'operations',
      title: 'Operations',
      lessons: [
        {
          id: 'adding-deleting-editing-words',
          title: 'Add, Delete & Edit Words',
          description: 'Insert, remove with pruning, and update by delete + insert.',
          readTime: '12 min',
          component: AddingDeletingEditingWords,
        },
      ],
    },
    {
      id: 'applications',
      title: 'Applications',
      lessons: [
        {
          id: 'word-search-with-trie',
          title: 'Word Search with a Trie',
          description: 'Find dictionary words on a 2D board — DFS + prefix pruning.',
          readTime: '13 min',
          component: WordSearchWithTrie,
        },
      ],
    },
  ],
}
