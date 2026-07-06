import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function InitAndSelf() {
  return (
    <LessonArticle>
      <Definition term="__init__ & self">
        <p>
          <code className="font-mono text-sm">__init__</code> is the <strong className="text-white">initializer</strong>{' '}
          method — Python calls it automatically when you create an object. It is where you set up the object's
          starting state.
        </p>
        <p>
          <code className="font-mono text-sm">self</code> is a reference to <em>the current object</em> — the
          instance being created or used. It is how the object refers to its own attributes and methods.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why 'self'?">
        When you write <code className="font-mono text-sm">buddy.bark()</code>, Python secretly passes{' '}
        <code className="font-mono text-sm">buddy</code> as the first argument to <code className="font-mono text-sm">bark</code>.
        Inside the method, that first parameter is traditionally named <code className="font-mono text-sm">self</code>.
      </Callout>

      <ContentStep number={1} title="The flow when you call Dog('Buddy', 3)">
        <Flowchart
          title="Object creation"
          chart={`
flowchart TB
  A["Dog('Buddy', 3)"]
  B["Python creates empty object"]
  C["Calls __init__(self, 'Buddy', 3)"]
  D["self.name = 'Buddy'"]
  E["Object ready to use"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Writing __init__">
        <Example
          title="Dog with initializer"
          output={`Buddy says Woof!`}
        >{`class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(f"{self.name} says Woof!")

buddy = Dog("Buddy", 3)
buddy.bark()`}</Example>
        <StepSequence
          steps={[
            {
              title: 'def __init__(self, ...)',
              description: 'First parameter must be self (by convention). Remaining parameters are what you pass to Dog(...).',
            },
            {
              title: 'self.name = name',
              description: 'Stores the argument on the object. self.name is the instance attribute; name is the parameter.',
            },
            {
              title: 'Dog("Buddy", 3)',
              description: 'Python creates the object and calls __init__ automatically. You never call __init__ directly.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="self in every instance method">
        <Example
          title="Methods always receive self"
          output={`Buddy is 3 years old
Happy birthday! Now 4`}
        >{`class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def describe(self):
        print(f"{self.name} is {self.age} years old")

    def birthday(self):
        self.age += 1
        print(f"Happy birthday! Now {self.age}")

buddy = Dog("Buddy", 3)
buddy.describe()
buddy.birthday()`}</Example>
        <p>
          <code className="font-mono text-sm">buddy.birthday()</code> is shorthand for{' '}
          <code className="font-mono text-sm">Dog.birthday(buddy)</code>. Python passes the object as{' '}
          <code className="font-mono text-sm">self</code>.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Common beginner confusion">
        <Callout variant="insight" title="self is not a keyword">
          You could name it <code className="font-mono text-sm">this</code> or <code className="font-mono text-sm">me</code> —
          but every Python developer uses <code className="font-mono text-sm">self</code>. Always include it as the
          first parameter of instance methods. Never pass it when calling: use <code className="font-mono text-sm">obj.method()</code>, not{' '}
          <code className="font-mono text-sm">obj.method(self)</code>.
        </Callout>
        <Example
          title="Missing self — TypeError"
          caption="If you forget self in the method definition, calling it raises TypeError: method() takes 0 positional arguments but 1 was given"
        >{`class Broken:
    def greet():   # missing self!
        print("hi")

# Broken().greet()  # TypeError`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          '__init__ sets up new objects — called automatically on ClassName(...).',
          'self is the current instance — first parameter of instance methods.',
          'self.attribute stores data on the object.',
          'When calling methods, Python passes the object as self for you.',
        ]}
      />
    </LessonArticle>
  )
}
