import type { SubTopic } from '../../../types'
import { BitwiseOperators } from './lessons/bitwise-operators'
import { CountingSetBits } from './lessons/counting-set-bits'
import { EssentialBitTricks } from './lessons/essential-bit-tricks'
import { IntroductionToBitManipulation } from './lessons/introduction-to-bit-manipulation'
import { SubsetsWithBitmasks } from './lessons/subsets-with-bitmasks'
import { XorPatterns } from './lessons/xor-patterns'

export const bitManipulationSubTopic: SubTopic = {
  id: 'bit-manipulation',
  title: 'Bit Manipulation',
  description:
    'Binary representation, bitwise operators, XOR tricks, popcount, and subset generation with masks.',
  lessonSections: [
    {
      id: 'introduction',
      title: 'Introduction',
      lessons: [
        {
          id: 'introduction-to-bit-manipulation',
          title: 'Introduction to Bit Manipulation',
          description: 'Binary, two\'s complement, and when bit-level thinking helps.',
          readTime: '9 min',
          component: IntroductionToBitManipulation,
        },
        {
          id: 'bitwise-operators',
          title: 'Bitwise Operators in Python',
          description: '&, |, ^, ~, <<, >> — with examples and pitfalls.',
          readTime: '10 min',
          component: BitwiseOperators,
        },
      ],
    },
    {
      id: 'fundamentals',
      title: 'Fundamentals',
      lessons: [
        {
          id: 'essential-bit-tricks',
          title: 'Essential Bit Tricks',
          description: 'Get, set, clear, toggle bits — power of two, isolate lowest set bit.',
          readTime: '11 min',
          component: EssentialBitTricks,
        },
      ],
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      lessons: [
        {
          id: 'xor-patterns',
          title: 'XOR Patterns',
          description: 'Single unique element, missing number, swap without extra space.',
          readTime: '11 min',
          component: XorPatterns,
        },
        {
          id: 'counting-set-bits',
          title: 'Counting Set Bits',
          description: 'Population count, Brian Kernighan, hamming distance.',
          readTime: '10 min',
          component: CountingSetBits,
        },
        {
          id: 'subsets-with-bitmasks',
          title: 'Subsets with Bitmasks',
          description: 'Enumerate all subsets and combinations with integer masks.',
          readTime: '11 min',
          component: SubsetsWithBitmasks,
        },
      ],
    },
  ],
}
