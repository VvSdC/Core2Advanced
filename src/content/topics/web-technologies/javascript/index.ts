import type { SubTopic } from '../../../types'

import { AsyncAwait } from './lessons/async-await'
import { CallbacksAndAsyncBasics } from './lessons/callbacks-and-async-basics'
import { ClassesAndOopStyle } from './lessons/classes-and-oop-style'
import { ClosuresExplained } from './lessons/closures-explained'
import { ControlFlow } from './lessons/control-flow'
import { ErrorHandling } from './lessons/error-handling'
import { EventDelegation } from './lessons/event-delegation'
import { EventsAndEventLoopBrowser } from './lessons/events-and-event-loop-browser'
import { FetchAndJson } from './lessons/fetch-and-json'
import { FunctionsBasics } from './lessons/functions-basics'
import { JavascriptArchitecture } from './lessons/javascript-architecture'
import { JavascriptLifecycleAndExecution } from './lessons/javascript-lifecycle-and-execution'
import { ModernEsFeatures } from './lessons/modern-es-features'
import { ObjectsAndArrays } from './lessons/objects-and-arrays'
import { OperatorsAndExpressions } from './lessons/operators-and-expressions'
import { Promises } from './lessons/promises'
import { PrototypesAndInheritance } from './lessons/prototypes-and-inheritance'
import { PuttingItTogetherJavascript } from './lessons/putting-it-together-javascript'
import { ScopeAndLexicalEnvironment } from './lessons/scope-and-lexical-environment'
import { SelectingAndUpdatingDom } from './lessons/selecting-and-updating-dom'
import { StrictModeAndModules } from './lessons/strict-mode-and-modules'
import { StringsAndTemplateLiterals } from './lessons/strings-and-template-literals'
import { ThisKeyword } from './lessons/this-keyword'
import { TypeCoercionAndEquality } from './lessons/type-coercion-and-equality'
import { ValuesTypesAndDynamicTyping } from './lessons/values-types-and-dynamic-typing'
import { VariablesLetConstVar } from './lessons/variables-let-const-var'
import { WhatIsJavascript } from './lessons/what-is-javascript'
import { WhatIsTheDom } from './lessons/what-is-the-dom'

const foundationsLessons = [
  {
    id: 'what-is-javascript',
    title: 'What Is JavaScript?',
    description: 'The language of the web — browsers, Node, and why JS is everywhere.',
    readTime: '12 min',
    component: WhatIsJavascript,
  },
  {
    id: 'javascript-architecture',
    title: 'JavaScript Architecture',
    description: 'Engine, runtime, heap, and call stack — how JS actually runs.',
    readTime: '14 min',
    component: JavascriptArchitecture,
  },
  {
    id: 'javascript-lifecycle-and-execution',
    title: 'Lifecycle & Execution',
    description: 'Parse → compile → run — execution contexts and how a script starts.',
    readTime: '14 min',
    component: JavascriptLifecycleAndExecution,
  },
]

const languageCoreLessons = [
  {
    id: 'values-types-and-dynamic-typing',
    title: 'Values, Types & Dynamic Typing',
    description: 'Variables can change type — typeof, primitives, and objects.',
    readTime: '14 min',
    component: ValuesTypesAndDynamicTyping,
  },
  {
    id: 'variables-let-const-var',
    title: 'let, const & var',
    description: 'Declare values the modern way — and why var surprises beginners.',
    readTime: '12 min',
    component: VariablesLetConstVar,
  },
  {
    id: 'operators-and-expressions',
    title: 'Operators & Expressions',
    description: 'Arithmetic, logic, ternary, and === vs == with clear examples.',
    readTime: '12 min',
    component: OperatorsAndExpressions,
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    description: 'if/else, loops, and switch — steer the path of your program.',
    readTime: '12 min',
    component: ControlFlow,
  },
  {
    id: 'functions-basics',
    title: 'Functions Basics',
    description: 'Declarations, arrows, parameters, return, and first taste of scope.',
    readTime: '14 min',
    component: FunctionsBasics,
  },
  {
    id: 'objects-and-arrays',
    title: 'Objects & Arrays',
    description: 'Structured data, property access, and everyday array helpers.',
    readTime: '14 min',
    component: ObjectsAndArrays,
  },
  {
    id: 'strings-and-template-literals',
    title: 'Strings & Template Literals',
    description: 'Text in JS — methods and backtick templates with ${}.',
    readTime: '12 min',
    component: StringsAndTemplateLiterals,
  },
  {
    id: 'type-coercion-and-equality',
    title: 'Type Coercion & Equality',
    description: 'How JS converts types — and how to stay safe with ===.',
    readTime: '14 min',
    component: TypeCoercionAndEquality,
  },
  {
    id: 'strict-mode-and-modules',
    title: 'Strict Mode & Modules',
    description: 'use strict, import/export, and modern script loading.',
    readTime: '12 min',
    component: StrictModeAndModules,
  },
]

const domEventsLessons = [
  {
    id: 'what-is-the-dom',
    title: 'What Is the DOM?',
    description: 'HTML as a live tree of objects — document and window.',
    readTime: '12 min',
    component: WhatIsTheDom,
  },
  {
    id: 'selecting-and-updating-dom',
    title: 'Selecting & Updating the DOM',
    description: 'querySelector, textContent, classList, and creating elements.',
    readTime: '14 min',
    component: SelectingAndUpdatingDom,
  },
  {
    id: 'events-and-event-loop-browser',
    title: 'Events & the Browser Event Model',
    description: 'Clicks, inputs, addEventListener, and how events bubble.',
    readTime: '14 min',
    component: EventsAndEventLoopBrowser,
  },
  {
    id: 'event-delegation',
    title: 'Event Delegation',
    description: 'One listener on a parent — efficient handling for many children.',
    readTime: '12 min',
    component: EventDelegation,
  },
]

const closuresThisLessons = [
  {
    id: 'scope-and-lexical-environment',
    title: 'Scope & Lexical Environment',
    description: 'Where variables live — global, function, and block scope.',
    readTime: '14 min',
    component: ScopeAndLexicalEnvironment,
  },
  {
    id: 'closures-explained',
    title: 'Closures Explained',
    description: 'Functions that remember outer variables — counters and private state.',
    readTime: '16 min',
    component: ClosuresExplained,
  },
  {
    id: 'this-keyword',
    title: 'The this Keyword',
    description: 'How this is decided — methods, arrows, and bind/call/apply.',
    readTime: '14 min',
    component: ThisKeyword,
  },
  {
    id: 'prototypes-and-inheritance',
    title: 'Prototypes & Inheritance',
    description: 'The prototype chain and class syntax as clearer sugar.',
    readTime: '14 min',
    component: PrototypesAndInheritance,
  },
]

const asyncLessons = [
  {
    id: 'callbacks-and-async-basics',
    title: 'Callbacks & Async Basics',
    description: 'Why JS needs async — timers and callback style.',
    readTime: '12 min',
    component: CallbacksAndAsyncBasics,
  },
  {
    id: 'promises',
    title: 'Promises',
    description: 'Pending, fulfilled, rejected — then/catch and Promise.all.',
    readTime: '14 min',
    component: Promises,
  },
  {
    id: 'async-await',
    title: 'async / await',
    description: 'Write async code that reads like sync — with try/catch.',
    readTime: '14 min',
    component: AsyncAwait,
  },
  {
    id: 'fetch-and-json',
    title: 'fetch & JSON',
    description: 'Talk to APIs — fetch, Response, and JSON parse/stringify.',
    readTime: '14 min',
    component: FetchAndJson,
  },
]

const advancedLessons = [
  {
    id: 'error-handling',
    title: 'Error Handling',
    description: 'throw, try/catch/finally, and useful Error objects.',
    readTime: '12 min',
    component: ErrorHandling,
  },
  {
    id: 'classes-and-oop-style',
    title: 'Classes & OOP Style',
    description: 'constructor, methods, static, and private fields.',
    readTime: '14 min',
    component: ClassesAndOopStyle,
  },
  {
    id: 'modern-es-features',
    title: 'Modern ES Features',
    description: 'Optional chaining, nullish coalescing, spread/rest, and reduce.',
    readTime: '14 min',
    component: ModernEsFeatures,
  },
  {
    id: 'putting-it-together-javascript',
    title: 'Putting It Together',
    description: 'Mastery map from language core to DOM, closures, and async.',
    readTime: '12 min',
    component: PuttingItTogetherJavascript,
  },
]

export const javascriptSubTopic: SubTopic = {
  id: 'javascript',
  title: 'JavaScript',
  description:
    'JavaScript from absolute zero to advanced — architecture, lifecycle, dynamic typing, DOM, events, closures, async/await, and modern ES features.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'language-core',
      title: 'Language Core',
      sections: [{ id: 'language-core-lessons', title: 'Lessons', lessons: languageCoreLessons }],
    },
    {
      id: 'dom-and-events',
      title: 'DOM & Events',
      sections: [{ id: 'dom-events-lessons', title: 'Lessons', lessons: domEventsLessons }],
    },
    {
      id: 'closures-and-objects',
      title: 'Scope, Closures & Objects',
      sections: [{ id: 'closures-this-lessons', title: 'Lessons', lessons: closuresThisLessons }],
    },
    {
      id: 'async',
      title: 'Asynchronous JavaScript',
      sections: [{ id: 'async-lessons', title: 'Lessons', lessons: asyncLessons }],
    },
    {
      id: 'advanced',
      title: 'Advanced & Modern',
      sections: [{ id: 'advanced-lessons', title: 'Lessons', lessons: advancedLessons }],
    },
  ],
}
