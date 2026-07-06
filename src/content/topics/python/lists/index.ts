import type { SubTopic } from '../../../types'
import { BubbleSort } from '../data-structures-and-algorithms/lists/algorithms/bubble-sort'
import { InsertionSort } from '../data-structures-and-algorithms/lists/algorithms/insertion-sort'
import { KadanesAlgorithm } from '../data-structures-and-algorithms/lists/algorithms/kadanes-algorithm'
import { MergeSort } from '../data-structures-and-algorithms/lists/algorithms/merge-sort'
import { PythonTimsort } from '../data-structures-and-algorithms/lists/algorithms/python-timsort'
import { QuickSort } from '../data-structures-and-algorithms/lists/algorithms/quick-sort'
import { SelectionSort } from '../data-structures-and-algorithms/lists/algorithms/selection-sort'
import { SortingOverview } from '../data-structures-and-algorithms/lists/algorithms/sorting-overview'
import { HowPythonListsWork } from '../data-structures-and-algorithms/lists/data-structure/how-python-lists-work'
import { ListCopySemantics } from '../data-structures-and-algorithms/lists/data-structure/list-copy-semantics'
import { ListMemoryAllocation } from '../data-structures-and-algorithms/lists/data-structure/list-memory-allocation'
import { ReferencesInLists } from '../data-structures-and-algorithms/lists/data-structure/references-in-lists'
import { ShallowDeepCopyLists } from '../data-structures-and-algorithms/lists/data-structure/shallow-deep-copy-lists'

export const listsSubTopic: SubTopic = {
  id: 'lists',
  title: 'Lists',
  description:
    'How Python lists work under the hood, copy semantics, sorting algorithms, and Kadane\'s algorithm.',
  lessonSections: [
    {
      id: 'data-structure',
      title: 'Data Structure',
      lessons: [
        {
          id: 'how-python-lists-work',
          title: 'How Python Lists Work',
          description: 'Dynamic arrays, PyListObject, and why indexing is O(1).',
          readTime: '10 min',
          component: HowPythonListsWork,
        },
        {
          id: 'list-memory-allocation',
          title: 'Memory Allocation & Growth',
          description: 'Overallocation, amortized append, and cost of insert.',
          readTime: '9 min',
          component: ListMemoryAllocation,
        },
        {
          id: 'references-in-lists',
          title: 'References in Lists',
          description: 'Lists store pointers — shared objects and identity.',
          readTime: '8 min',
          component: ReferencesInLists,
        },
        {
          id: 'list-copy-semantics',
          title: 'Copy Semantics',
          description: 'Assignment, slicing, and list.copy() behavior.',
          readTime: '9 min',
          component: ListCopySemantics,
        },
        {
          id: 'shallow-deep-copy-lists',
          title: 'Shallow & Deep Copy',
          description: 'copy.copy vs deepcopy — nested list traps.',
          readTime: '10 min',
          component: ShallowDeepCopyLists,
        },
      ],
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      lessons: [
        {
          id: 'sorting-overview',
          title: 'Sorting Overview',
          description: 'Comparison sorts, stability, and Big-O basics.',
          readTime: '10 min',
          component: SortingOverview,
        },
        {
          id: 'bubble-sort',
          title: 'Bubble Sort',
          description: 'Adjacent swaps, O(n²), stable, early-exit optimization.',
          readTime: '9 min',
          component: BubbleSort,
        },
        {
          id: 'selection-sort',
          title: 'Selection Sort',
          description: 'Find minimum, swap — O(n²), minimal writes.',
          readTime: '8 min',
          component: SelectionSort,
        },
        {
          id: 'insertion-sort',
          title: 'Insertion Sort',
          description: 'Build sorted region — great for small or nearly sorted data.',
          readTime: '9 min',
          component: InsertionSort,
        },
        {
          id: 'merge-sort',
          title: 'Merge Sort',
          description: 'Divide and conquer — O(n log n), stable, O(n) space.',
          readTime: '11 min',
          component: MergeSort,
        },
        {
          id: 'quick-sort',
          title: 'Quick Sort',
          description: 'Partition around pivot — fast average case, in-place.',
          readTime: '11 min',
          component: QuickSort,
        },
        {
          id: 'python-timsort',
          title: "Python's Timsort",
          description: 'list.sort() and sorted() — hybrid stable sort in CPython.',
          readTime: '9 min',
          component: PythonTimsort,
        },
        {
          id: 'kadanes-algorithm',
          title: "Kadane's Algorithm",
          description: 'Maximum subarray sum in O(n).',
          readTime: '10 min',
          component: KadanesAlgorithm,
        },
      ],
    },
  ],
}
