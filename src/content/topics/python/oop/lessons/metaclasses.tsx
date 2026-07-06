import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Metaclasses() {
  return (
    <LessonArticle>
      <Definition term="Metaclasses">
        <p>
          Classes in Python are objects too. A <strong className="text-white">metaclass</strong> is the class of a
          class — it controls class creation. <code className="font-mono text-sm">type</code> is the default metaclass.
        </p>
        <p>
          Interviewers rarely ask you to write metaclasses daily — they want you to know what they are and when{' '}
          <code className="font-mono text-sm">@dataclass</code> or class decorators suffice instead.
        </p>
      </Definition>

      <ContentStep number={1} title="type creates classes">
        <Example
          title="class Foo: pass is syntactic sugar"
        >{`def __init__(self, x):
    self.x = x

Foo = type("Foo", (), {"__init__": __init__})
obj = Foo(10)
print(obj.x)`}</Example>
        <p><code className="font-mono text-sm">type(name, bases, namespace)</code> builds a class object at runtime.</p>
      </ContentStep>

      <ContentStep number={2} title="Custom metaclass">
        <Example
          title="Hook into class creation"
        >{`class LoggedMeta(type):
    def __new__(mcs, name, bases, namespace):
        print(f"Creating class {name}")
        return super().__new__(mcs, name, bases, namespace)

class MyClass(metaclass=LoggedMeta):
    pass`}</Example>
        <p><code className="font-mono text-sm">__new__</code> on the metaclass runs when the class body finishes executing.</p>
      </ContentStep>

      <ContentStep number={3} title="When metaclasses are used">
        <ul className="space-y-2 text-slate-300">
          <li>ORM frameworks (Django models register fields at class creation)</li>
          <li>Enforcing interfaces on all subclasses automatically</li>
          <li>Singleton registries and plugin discovery</li>
        </ul>
      </ContentStep>

      <ContentStep number={4} title="Simpler alternatives">
        <Callout variant="insight">
          "If you are not sure you need a metaclass, you don't." Prefer <code className="font-mono text-sm">@dataclass</code>,{' '}
          class decorators, or <code className="font-mono text-sm">__init_subclass__</code> for most customization.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Metaclass = class factory; type is the default metaclass.',
          'Custom metaclasses hook class creation via metaclass.__new__.',
          'Used in frameworks — rarely in application code.',
          'Prefer dataclass, decorators, __init_subclass__ when possible.',
        ]}
      />
    </LessonArticle>
  )
}
