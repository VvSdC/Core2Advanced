import type { SubTopic } from '../../../types'
import { IntroductionToStringAlgorithms } from './lessons/introduction-to-string-algorithms'
import { KmpAlgorithm } from './lessons/kmp-algorithm'
import { ManachersAlgorithm } from './lessons/manachers-algorithm'
import { RabinKarp } from './lessons/rabin-karp'
import { ZAlgorithm } from './lessons/z-algorithm'

export const stringsSubTopic: SubTopic = {
  id: 'strings',
  title: 'Strings',
  description: 'Pattern matching and advanced string algorithms — Z, KMP, Rabin-Karp, and Manacher.',
  lessonSections: [
    {
      id: 'introduction',
      title: 'Introduction',
      lessons: [
        {
          id: 'introduction-to-string-algorithms',
          title: 'Introduction to String Algorithms',
          description: 'Pattern matching, preprocessing, and complexity basics.',
          readTime: '9 min',
          component: IntroductionToStringAlgorithms,
        },
      ],
    },
    {
      id: 'pattern-matching',
      title: 'Pattern Matching',
      lessons: [
        {
          id: 'z-algorithm',
          title: 'Z-Algorithm',
          description: 'Z-array in linear time — prefix matches and pattern search.',
          readTime: '12 min',
          component: ZAlgorithm,
        },
        {
          id: 'kmp-algorithm',
          title: 'KMP Algorithm',
          description: 'Prefix function (LPS) — no backtracking on the text.',
          readTime: '12 min',
          component: KmpAlgorithm,
        },
        {
          id: 'rabin-karp',
          title: 'Rabin-Karp',
          description: 'Rolling hash — average O(n + m) substring search.',
          readTime: '11 min',
          component: RabinKarp,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'manachers-algorithm',
          title: "Manacher's Algorithm",
          description: 'Longest palindromic substring in O(n).',
          readTime: '13 min',
          component: ManachersAlgorithm,
        },
      ],
    },
  ],
}
