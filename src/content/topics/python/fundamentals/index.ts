import type { SubTopic } from '../../../types'
import { BreakContinuePass } from './lessons/break-continue-pass'
import { CustomExceptionsAndContextlib } from './lessons/custom-exceptions-and-contextlib'
import { EnumerateAndZip } from './lessons/enumerate-and-zip'
import { ErrorHandlingExceptions } from './lessons/error-handling-exceptions'
import { ForLoops } from './lessons/for-loops'
import { IfElifElse } from './lessons/if-elif-else'
import { IterationProtocol } from './lessons/iteration-protocol'
import { ListComprehensionsIntro } from './lessons/list-comprehensions-intro'
import { MatchCase } from './lessons/match-case'
import { OperatorsAndExpressions } from './lessons/operators-and-expressions'
import { TruthinessAndIsVsEquals } from './lessons/truthiness-and-is-vs-equals'
import { VariablesAndTypes } from './lessons/variables-and-types'
import { WalrusOperator } from './lessons/walrus-operator'
import { WhileLoops } from './lessons/while-loops'

export const fundamentalsSubTopic: SubTopic = {
  id: 'fundamentals',
  title: 'Fundamentals',
  description: 'Variables, control flow, loops, iteration, and error handling.',
  lessons: [
    {
      id: 'variables-and-types',
      title: 'Variables & Types',
      description: 'Names, basic types, and how Python stores values.',
      readTime: '8 min',
      component: VariablesAndTypes,
    },
    {
      id: 'operators-and-expressions',
      title: 'Operators & Expressions',
      description: 'Math, comparisons, logic, and how expressions evaluate.',
      readTime: '7 min',
      component: OperatorsAndExpressions,
    },
    {
      id: 'truthiness-and-is-vs-equals',
      title: 'Truthiness & is vs ==',
      description: 'Falsy values, identity vs equality, and is None.',
      readTime: '9 min',
      component: TruthinessAndIsVsEquals,
    },
    {
      id: 'if-elif-else',
      title: 'if / elif / else',
      description: 'Making decisions with conditions and truthiness.',
      readTime: '8 min',
      component: IfElifElse,
    },
    {
      id: 'match-case',
      title: 'match / case',
      description: 'Structural pattern matching in Python 3.10+.',
      readTime: '9 min',
      component: MatchCase,
    },
    {
      id: 'walrus-operator',
      title: 'Walrus Operator :=',
      description: 'Assignment expressions — assign and use in one step.',
      readTime: '7 min',
      component: WalrusOperator,
    },
    {
      id: 'for-loops',
      title: 'for Loops',
      description: 'Repeating actions over sequences and ranges.',
      readTime: '8 min',
      component: ForLoops,
    },
    {
      id: 'while-loops',
      title: 'while Loops',
      description: 'Repeating while a condition stays true.',
      readTime: '6 min',
      component: WhileLoops,
    },
    {
      id: 'break-continue-pass',
      title: 'break, continue, pass',
      description: 'Controlling loop flow and placeholder statements.',
      readTime: '6 min',
      component: BreakContinuePass,
    },
    {
      id: 'error-handling-exceptions',
      title: 'Error Handling & Exceptions',
      description: 'try, except, else, finally, and raising errors.',
      readTime: '10 min',
      component: ErrorHandlingExceptions,
    },
    {
      id: 'custom-exceptions-and-contextlib',
      title: 'Custom Exceptions & contextlib',
      description: 'Exception hierarchies, raise from, and suppress.',
      readTime: '10 min',
      component: CustomExceptionsAndContextlib,
    },
    {
      id: 'iteration-protocol',
      title: 'The Iteration Protocol',
      description: 'How iter(), next(), and for loops work under the hood.',
      readTime: '7 min',
      component: IterationProtocol,
    },
    {
      id: 'enumerate-and-zip',
      title: 'enumerate & zip',
      description: 'Pairing indexes with values and iterating multiple sequences.',
      readTime: '6 min',
      component: EnumerateAndZip,
    },
    {
      id: 'list-comprehensions-intro',
      title: 'List Comprehensions',
      description: 'Building lists in one readable expression.',
      readTime: '7 min',
      component: ListComprehensionsIntro,
    },
  ],
}
