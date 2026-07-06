import type { SubTopic } from '../../../types'
import { ArgsAndKwargs } from './lessons/args-and-kwargs'
import { AsyncFunctions } from './lessons/async-functions'
import { ClassDecorators } from './lessons/class-decorators'
import { Closures } from './lessons/closures'
import { Decorators } from './lessons/decorators'
import { DefiningFunctions } from './lessons/defining-functions'
import { FirstClassFunctions } from './lessons/first-class-functions'
import { FunctionMistakes } from './lessons/function-mistakes'
import { FunctoolsAndItertools } from './lessons/functools-and-itertools'
import { GeneratorsAndYield } from './lessons/generators-and-yield'
import { LambdaFunctions } from './lessons/lambda-functions'
import { ParametersAndArguments } from './lessons/parameters-and-arguments'
import { Recursion } from './lessons/recursion'
import { ScopeLegbNonlocal } from './lessons/scope-legb-nonlocal'

export const functionsSubTopic: SubTopic = {
  id: 'functions',
  title: 'Functions',
  description: 'Defining functions, scope, closures, decorators, and generators.',
  lessons: [
    {
      id: 'defining-functions',
      title: 'Defining Functions',
      description: 'def, return, and why functions exist.',
      readTime: '10 min',
      component: DefiningFunctions,
    },
    {
      id: 'parameters-and-arguments',
      title: 'Parameters & Arguments',
      description: 'Positional, keyword, and default values.',
      readTime: '11 min',
      component: ParametersAndArguments,
    },
    {
      id: 'args-and-kwargs',
      title: '*args & **kwargs',
      description: 'Variable-length arguments unpacked and packed.',
      readTime: '10 min',
      component: ArgsAndKwargs,
    },
    {
      id: 'scope-legb-nonlocal',
      title: 'Scope, LEGB & nonlocal',
      description: 'Where names live — local, enclosing, global, built-in.',
      readTime: '12 min',
      component: ScopeLegbNonlocal,
    },
    {
      id: 'first-class-functions',
      title: 'First-Class Functions',
      description: 'Functions as values — pass them, store them, return them.',
      readTime: '10 min',
      component: FirstClassFunctions,
    },
    {
      id: 'lambda-functions',
      title: 'Lambda Functions',
      description: 'Small anonymous functions for quick operations.',
      readTime: '8 min',
      component: LambdaFunctions,
    },
    {
      id: 'closures',
      title: 'Closures',
      description: 'Nested functions that remember their environment.',
      readTime: '12 min',
      component: Closures,
    },
    {
      id: 'decorators',
      title: 'Decorators',
      description: 'Wrapping functions to add behavior with @syntax.',
      readTime: '13 min',
      component: Decorators,
    },
    {
      id: 'class-decorators',
      title: 'Class Decorators',
      description: 'Decorating classes — singletons, registration, and @dataclass preview.',
      readTime: '9 min',
      component: ClassDecorators,
    },
    {
      id: 'functools-and-itertools',
      title: 'functools & itertools',
      description: 'partial, lru_cache, reduce, and iterator utilities.',
      readTime: '12 min',
      component: FunctoolsAndItertools,
    },
    {
      id: 'recursion',
      title: 'Recursion',
      description: 'Base case, stack limits, and recursion vs loops.',
      readTime: '12 min',
      component: Recursion,
    },
    {
      id: 'generators-and-yield',
      title: 'Generators & yield',
      description: 'Lazy sequences that produce values one at a time.',
      readTime: '12 min',
      component: GeneratorsAndYield,
    },
    {
      id: 'async-functions',
      title: 'Async Functions',
      description: 'async def, await, and async generators.',
      readTime: '10 min',
      component: AsyncFunctions,
    },
    {
      id: 'function-mistakes',
      title: 'Common Function Mistakes',
      description: 'Mutable defaults, shadowing, and other traps.',
      readTime: '10 min',
      component: FunctionMistakes,
    },
  ],
}
