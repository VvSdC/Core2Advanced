import type { SubTopic } from '../../../types'

import { AnyUnknownAndNever } from './lessons/any-unknown-and-never'
import { ArraysTuplesAndEnums } from './lessons/arrays-tuples-and-enums'
import { AsyncAndPromisesTyping } from './lessons/async-and-promises-typing'
import { BasicTypes } from './lessons/basic-types'
import { ClassesInTypescript } from './lessons/classes-in-typescript'
import { CommonMistakesTypescript } from './lessons/common-mistakes-typescript'
import { DeclarationFilesAndLib } from './lessons/declaration-files-and-lib'
import { FunctionsInTypescript } from './lessons/functions-in-typescript'
import { GenericsAdvanced } from './lessons/generics-advanced'
import { GenericsBasics } from './lessons/generics-basics'
import { InstallingAndTsconfig } from './lessons/installing-and-tsconfig'
import { Interfaces } from './lessons/interfaces'
import { MappedAndConditionalTypes } from './lessons/mapped-and-conditional-types'
import { ModulesAndNamespaces } from './lessons/modules-and-namespaces'
import { ObjectsAndTypeAliases } from './lessons/objects-and-type-aliases'
import { PuttingItTogetherTypescript } from './lessons/putting-it-together-typescript'
import { StrictnessAndCompilerFlags } from './lessons/strictness-and-compiler-flags'
import { TsWithReactAndNodePreview } from './lessons/ts-with-react-and-node-preview'
import { TypeAssertionsAndGuards } from './lessons/type-assertions-and-guards'
import { TypeNarrowing } from './lessons/type-narrowing'
import { TypescriptArchitecture } from './lessons/typescript-architecture'
import { TypingDomAndEvents } from './lessons/typing-dom-and-events'
import { UnionIntersectionAndLiterals } from './lessons/union-intersection-and-literals'
import { UtilityTypes } from './lessons/utility-types'
import { WhatIsTypescript } from './lessons/what-is-typescript'
import { WhyTypescript } from './lessons/why-typescript'

const foundationsLessons = [
  {
    id: 'what-is-typescript',
    title: 'What Is TypeScript?',
    description: 'JavaScript with static types — compiles to JS, types erase at runtime.',
    readTime: '12 min',
    component: WhatIsTypescript,
  },
  {
    id: 'why-typescript',
    title: 'Why TypeScript?',
    description: 'Catch bugs early, better autocomplete, safer refactors — when TS pays off.',
    readTime: '12 min',
    component: WhyTypescript,
  },
  {
    id: 'typescript-architecture',
    title: 'TypeScript Architecture',
    description: 'Write TS → type-check → emit JS → run. Checker vs runtime.',
    readTime: '14 min',
    component: TypescriptArchitecture,
  },
  {
    id: 'installing-and-tsconfig',
    title: 'Installing & tsconfig',
    description: 'tsc, tsconfig.json — target, module, strict, outDir explained simply.',
    readTime: '14 min',
    component: InstallingAndTsconfig,
  },
]

const typeSystemLessons = [
  {
    id: 'basic-types',
    title: 'Basic Types',
    description: 'string, number, boolean, and type inference that just works.',
    readTime: '12 min',
    component: BasicTypes,
  },
  {
    id: 'arrays-tuples-and-enums',
    title: 'Arrays, Tuples & Enums',
    description: 'Typed lists, fixed-length tuples, and enums (plus modern as const).',
    readTime: '12 min',
    component: ArraysTuplesAndEnums,
  },
  {
    id: 'objects-and-type-aliases',
    title: 'Objects & Type Aliases',
    description: 'Shape objects with type, optional fields, and readonly.',
    readTime: '12 min',
    component: ObjectsAndTypeAliases,
  },
  {
    id: 'interfaces',
    title: 'Interfaces',
    description: 'Contracts for objects — extend, implement, and when to prefer type.',
    readTime: '14 min',
    component: Interfaces,
  },
  {
    id: 'functions-in-typescript',
    title: 'Functions in TypeScript',
    description: 'Parameter types, return types, void/never, and function type aliases.',
    readTime: '14 min',
    component: FunctionsInTypescript,
  },
  {
    id: 'union-intersection-and-literals',
    title: 'Unions, Intersections & Literals',
    description: 'string | number, & combine shapes, and precise literal unions.',
    readTime: '14 min',
    component: UnionIntersectionAndLiterals,
  },
  {
    id: 'type-narrowing',
    title: 'Type Narrowing',
    description: 'How control flow tightens types — typeof, in, and discriminated unions.',
    readTime: '14 min',
    component: TypeNarrowing,
  },
  {
    id: 'any-unknown-and-never',
    title: 'any, unknown & never',
    description: 'Escape hatches done right — avoid any, prefer unknown, use never.',
    readTime: '12 min',
    component: AnyUnknownAndNever,
  },
]

const genericsLessons = [
  {
    id: 'generics-basics',
    title: 'Generics Basics',
    description: 'Reusable types with <T> — identity, Array<T>, and constraints.',
    readTime: '14 min',
    component: GenericsBasics,
  },
  {
    id: 'generics-advanced',
    title: 'Generics Advanced',
    description: 'keyof constraints, defaults, and generic interfaces/classes.',
    readTime: '14 min',
    component: GenericsAdvanced,
  },
  {
    id: 'utility-types',
    title: 'Utility Types',
    description: 'Partial, Pick, Omit, Record, and friends — everyday type tools.',
    readTime: '14 min',
    component: UtilityTypes,
  },
  {
    id: 'mapped-and-conditional-types',
    title: 'Mapped & Conditional Types',
    description: 'Transform types in bulk and branch with T extends U ? X : Y.',
    readTime: '16 min',
    component: MappedAndConditionalTypes,
  },
]

const practicalLessons = [
  {
    id: 'classes-in-typescript',
    title: 'Classes in TypeScript',
    description: 'Visibility, readonly, implements/extends, and abstract classes.',
    readTime: '14 min',
    component: ClassesInTypescript,
  },
  {
    id: 'modules-and-namespaces',
    title: 'Modules & Namespaces',
    description: 'ES modules with types, import type, and why namespaces are legacy.',
    readTime: '12 min',
    component: ModulesAndNamespaces,
  },
  {
    id: 'typing-dom-and-events',
    title: 'Typing the DOM & Events',
    description: 'HTMLElement types and typed event listeners in the browser.',
    readTime: '14 min',
    component: TypingDomAndEvents,
  },
  {
    id: 'async-and-promises-typing',
    title: 'Async & Promise Typing',
    description: 'Promise<T>, async return types, and careful fetch/JSON typing.',
    readTime: '14 min',
    component: AsyncAndPromisesTyping,
  },
  {
    id: 'type-assertions-and-guards',
    title: 'Assertions & Type Guards',
    description: 'as Type, satisfies, and custom is guards — without lying to the compiler.',
    readTime: '14 min',
    component: TypeAssertionsAndGuards,
  },
]

const toolingLessons = [
  {
    id: 'declaration-files-and-lib',
    title: 'Declaration Files & @types',
    description: '.d.ts files and DefinitelyTyped — typing JS libraries you import.',
    readTime: '12 min',
    component: DeclarationFilesAndLib,
  },
  {
    id: 'strictness-and-compiler-flags',
    title: 'Strictness & Compiler Flags',
    description: 'strict, strictNullChecks, noImplicitAny — and gradual migration.',
    readTime: '12 min',
    component: StrictnessAndCompilerFlags,
  },
  {
    id: 'ts-with-react-and-node-preview',
    title: 'TS with React & Node (Preview)',
    description: '.tsx, props typing mental model, and Node + TS — bridges to next tracks.',
    readTime: '12 min',
    component: TsWithReactAndNodePreview,
  },
  {
    id: 'common-mistakes-typescript',
    title: 'Common Mistakes',
    description: 'any overuse, bad assertions, and undefined pitfalls — debugging guide.',
    readTime: '12 min',
    component: CommonMistakesTypescript,
  },
  {
    id: 'putting-it-together-typescript',
    title: 'Putting It Together',
    description: 'Mastery checklist — types erase at runtime; ship JS with confidence.',
    readTime: '12 min',
    component: PuttingItTogetherTypescript,
  },
]

export const typescriptSubTopic: SubTopic = {
  id: 'typescript',
  title: 'TypeScript',
  description:
    'TypeScript from absolute zero to advanced — architecture, type system, generics, utility types, DOM/async typing, and strict tooling.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'type-system',
      title: 'Type System',
      sections: [{ id: 'type-system-lessons', title: 'Lessons', lessons: typeSystemLessons }],
    },
    {
      id: 'generics',
      title: 'Generics & Type Tools',
      sections: [{ id: 'generics-lessons', title: 'Lessons', lessons: genericsLessons }],
    },
    {
      id: 'practical',
      title: 'Practical Typing',
      sections: [{ id: 'practical-lessons', title: 'Lessons', lessons: practicalLessons }],
    },
    {
      id: 'tooling',
      title: 'Tooling & Mastery',
      sections: [{ id: 'tooling-lessons', title: 'Lessons', lessons: toolingLessons }],
    },
  ],
}
