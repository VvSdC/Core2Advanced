import type { SubTopic } from '../../../types'
import { AbstractBaseClasses } from './lessons/abstract-base-classes'
import { AttributesAndState } from './lessons/attributes-and-state'
import { ClassAndStaticMethods } from './lessons/class-and-static-methods'
import { ClassesAndObjects } from './lessons/classes-and-objects'
import { CompositionVsInheritance } from './lessons/composition-vs-inheritance'
import { Dataclasses } from './lessons/dataclasses'
import { Descriptors } from './lessons/descriptors'
import { Encapsulation } from './lessons/encapsulation'
import { Inheritance } from './lessons/inheritance'
import { InitAndSelf } from './lessons/init-and-self'
import { IsinstanceVsDuckTyping } from './lessons/isinstance-vs-duck-typing'
import { Metaclasses } from './lessons/metaclasses'
import { Methods } from './lessons/methods'
import { MroAndMultipleInheritance } from './lessons/mro-and-multiple-inheritance'
import { OopCommonMistakes } from './lessons/oop-common-mistakes'
import { Polymorphism } from './lessons/polymorphism'
import { Slots } from './lessons/slots'
import { SpecialMethods } from './lessons/special-methods'
import { WhyOop } from './lessons/why-oop'

export const oopSubTopic: SubTopic = {
  id: 'oop',
  title: 'Object Oriented Programming',
  description: 'Classes, objects, inheritance, and polymorphism — explained slowly from zero.',
  lessons: [
    {
      id: 'why-oop',
      title: 'Why OOP?',
      description: 'The problem OOP solves and when it makes your code clearer.',
      readTime: '10 min',
      component: WhyOop,
    },
    {
      id: 'classes-and-objects',
      title: 'Classes & Objects',
      description: 'Your first class, your first object — the blueprint and the house.',
      readTime: '12 min',
      component: ClassesAndObjects,
    },
    {
      id: 'init-and-self',
      title: '__init__ & self',
      description: 'How objects are born and why every method has self.',
      readTime: '12 min',
      component: InitAndSelf,
    },
    {
      id: 'attributes-and-state',
      title: 'Attributes & State',
      description: 'Instance data vs class data — what each object remembers.',
      readTime: '11 min',
      component: AttributesAndState,
    },
    {
      id: 'methods',
      title: 'Methods',
      description: 'Behavior inside classes — functions that belong to objects.',
      readTime: '11 min',
      component: Methods,
    },
    {
      id: 'encapsulation',
      title: 'Encapsulation',
      description: 'Public, protected, private conventions, and @property.',
      readTime: '14 min',
      component: Encapsulation,
    },
    {
      id: 'inheritance',
      title: 'Inheritance',
      description: 'Reusing and extending classes — is-a relationships.',
      readTime: '13 min',
      component: Inheritance,
    },
    {
      id: 'mro-and-multiple-inheritance',
      title: 'MRO & Multiple Inheritance',
      description: 'C3 linearization, diamond problem, and cooperative super().',
      readTime: '12 min',
      component: MroAndMultipleInheritance,
    },
    {
      id: 'polymorphism',
      title: 'Polymorphism',
      description: 'One interface, many forms — writing flexible code.',
      readTime: '11 min',
      component: Polymorphism,
    },
    {
      id: 'isinstance-vs-duck-typing',
      title: 'isinstance vs Duck Typing',
      description: 'Behavior-first design and when to check types.',
      readTime: '9 min',
      component: IsinstanceVsDuckTyping,
    },
    {
      id: 'special-methods',
      title: 'Special Methods',
      description: 'Dunder methods — making your objects work with Python syntax.',
      readTime: '12 min',
      component: SpecialMethods,
    },
    {
      id: 'abstract-base-classes',
      title: 'Abstract Base Classes',
      description: 'abc module, @abstractmethod, and interface contracts.',
      readTime: '10 min',
      component: AbstractBaseClasses,
    },
    {
      id: 'dataclasses',
      title: '@dataclass',
      description: 'Auto-generated __init__, __repr__, and field defaults.',
      readTime: '10 min',
      component: Dataclasses,
    },
    {
      id: 'slots',
      title: '__slots__',
      description: 'Fixed attributes and memory optimization.',
      readTime: '8 min',
      component: Slots,
    },
    {
      id: 'descriptors',
      title: 'Descriptors',
      description: '__get__, __set__, and how @property works under the hood.',
      readTime: '11 min',
      component: Descriptors,
    },
    {
      id: 'metaclasses',
      title: 'Metaclasses',
      description: 'Classes that create classes — type and when to avoid them.',
      readTime: '10 min',
      component: Metaclasses,
    },
    {
      id: 'composition-vs-inheritance',
      title: 'Composition vs Inheritance',
      description: 'Has-a vs is-a — choosing the right design.',
      readTime: '11 min',
      component: CompositionVsInheritance,
    },
    {
      id: 'class-and-static-methods',
      title: 'Class & Static Methods',
      description: '@classmethod and @staticmethod — when the object is not enough.',
      readTime: '10 min',
      component: ClassAndStaticMethods,
    },
    {
      id: 'oop-common-mistakes',
      title: 'Common OOP Mistakes',
      description: 'Traps beginners fall into — and how to avoid them.',
      readTime: '12 min',
      component: OopCommonMistakes,
    },
  ],
}
