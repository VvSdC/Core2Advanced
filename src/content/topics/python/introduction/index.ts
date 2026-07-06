import type { SubTopic } from '../../../types'
import { ArchitectureOfPython } from './lessons/architecture-of-python'
import { AsyncAndAsyncio } from './lessons/async-and-asyncio'
import { ContextManagers } from './lessons/context-managers'
import { GarbageCollection } from './lessons/garbage-collection'
import { HowPythonIsCompiled } from './lessons/how-python-is-compiled'
import { InterviewQuestions } from './lessons/interview-questions'
import { MemoryAllocation } from './lessons/memory-allocation'
import { ModulesAndImports } from './lessons/modules-and-imports'
import { Multiprocessing } from './lessons/multiprocessing'
import { PythonObjectModel } from './lessons/python-object-model'
import { ShallowVsDeepCopy } from './lessons/shallow-vs-deep-copy'
import { TheGil } from './lessons/the-gil'
import { TypeHints } from './lessons/type-hints'

export const introductionSubTopic: SubTopic = {
  id: 'introduction',
  title: 'Introduction',
  description: 'The invisible machinery behind Python — architecture, compilation, and memory.',
  lessons: [
    {
      id: 'architecture-of-python',
      title: 'Architecture of Python',
      description: 'How Python is layered from your code down to the operating system.',
      readTime: '6 min',
      component: ArchitectureOfPython,
    },
    {
      id: 'how-python-is-compiled',
      title: 'How Python is Compiled',
      description: 'Source code, bytecode, and the interpreter loop that runs your programs.',
      readTime: '7 min',
      component: HowPythonIsCompiled,
    },
    {
      id: 'memory-allocation',
      title: 'Memory Allocation',
      description: 'How Python requests, pools, and organizes memory for objects.',
      readTime: '6 min',
      component: MemoryAllocation,
    },
    {
      id: 'garbage-collection',
      title: 'Garbage Collection',
      description: 'Reference counting, cyclic garbage, and how Python reclaims memory.',
      readTime: '7 min',
      component: GarbageCollection,
    },
    {
      id: 'python-object-model',
      title: 'The Python Object Model',
      description: 'Everything is an object — and that design choice shapes the entire language.',
      readTime: '5 min',
      component: PythonObjectModel,
    },
    {
      id: 'the-gil',
      title: 'The GIL & Concurrency',
      description: 'Why threads behave differently in Python and what actually runs in parallel.',
      readTime: '8 min',
      component: TheGil,
    },
    {
      id: 'modules-and-imports',
      title: 'Modules & Imports',
      description: 'import mechanics, packages, circular imports, and __name__ == "__main__".',
      readTime: '10 min',
      component: ModulesAndImports,
    },
    {
      id: 'context-managers',
      title: 'Context Managers',
      description: 'with statements, __enter__/__exit__, and contextlib patterns.',
      readTime: '10 min',
      component: ContextManagers,
    },
    {
      id: 'shallow-vs-deep-copy',
      title: 'Shallow vs Deep Copy',
      description: 'Assignment, copy.copy, and deepcopy — when nested data is shared.',
      readTime: '9 min',
      component: ShallowVsDeepCopy,
    },
    {
      id: 'type-hints',
      title: 'Type Hints & typing',
      description: 'Annotations, Optional, Callable, Protocol, and static checking.',
      readTime: '11 min',
      component: TypeHints,
    },
    {
      id: 'async-and-asyncio',
      title: 'Async & asyncio',
      description: 'Event loop, coroutines, and I/O-bound concurrency.',
      readTime: '12 min',
      component: AsyncAndAsyncio,
    },
    {
      id: 'multiprocessing',
      title: 'Multiprocessing',
      description: 'ProcessPoolExecutor and CPU-bound parallelism beyond the GIL.',
      readTime: '9 min',
      component: Multiprocessing,
    },
    {
      id: 'interview-questions',
      title: 'Interview Questions',
      description: '30 real-world interview questions — tricky output, exceptions, and internals revision.',
      readTime: '25 min',
      component: InterviewQuestions,
    },
  ],
}
