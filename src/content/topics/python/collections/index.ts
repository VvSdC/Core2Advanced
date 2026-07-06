import type { SubTopic } from '../../../types'
import { ChoosingACollection } from './lessons/choosing-a-collection'
import { CollectionComplexity } from './lessons/collection-complexity'
import { CollectionsModule } from './lessons/collections-module'
import { Comprehensions } from './lessons/comprehensions'
import { CopyAndAliasing } from './lessons/copy-and-aliasing'
import { DictAdvancedPatterns } from './lessons/dict-advanced-patterns'
import { Dictionaries } from './lessons/dictionaries'
import { Lists } from './lessons/lists'
import { Sets } from './lessons/sets'
import { Tuples } from './lessons/tuples'

export const collectionsSubTopic: SubTopic = {
  id: 'collections',
  title: 'Collections',
  description: 'Lists, tuples, dicts, sets — storing and organizing data.',
  lessons: [
    {
      id: 'lists',
      title: 'Lists',
      description: 'Ordered, mutable sequences — indexing, slicing, and methods.',
      readTime: '9 min',
      component: Lists,
    },
    {
      id: 'tuples',
      title: 'Tuples',
      description: 'Ordered, immutable sequences and unpacking.',
      readTime: '7 min',
      component: Tuples,
    },
    {
      id: 'dictionaries',
      title: 'Dictionaries',
      description: 'Key-value mappings, hashing, and common patterns.',
      readTime: '9 min',
      component: Dictionaries,
    },
    {
      id: 'dict-advanced-patterns',
      title: 'Dictionary Advanced Patterns',
      description: 'Insertion order, merging, setdefault, and hashable keys.',
      readTime: '10 min',
      component: DictAdvancedPatterns,
    },
    {
      id: 'sets',
      title: 'Sets',
      description: 'Unordered collections of unique values.',
      readTime: '7 min',
      component: Sets,
    },
    {
      id: 'copy-and-aliasing',
      title: 'Copy & Aliasing Traps',
      description: 'List multiplication, += vs +, and shared mutable state.',
      readTime: '10 min',
      component: CopyAndAliasing,
    },
    {
      id: 'collection-complexity',
      title: 'Time & Space Complexity',
      description: 'Big-O for list, dict, and set operations.',
      readTime: '9 min',
      component: CollectionComplexity,
    },
    {
      id: 'collections-module',
      title: 'collections Module',
      description: 'defaultdict, Counter, deque, and namedtuple.',
      readTime: '11 min',
      component: CollectionsModule,
    },
    {
      id: 'choosing-a-collection',
      title: 'Choosing a Collection',
      description: 'When to use list vs tuple vs dict vs set.',
      readTime: '6 min',
      component: ChoosingACollection,
    },
    {
      id: 'comprehensions',
      title: 'Comprehensions Deep Dive',
      description: 'List, dict, and set comprehensions with conditions.',
      readTime: '8 min',
      component: Comprehensions,
    },
  ],
}
