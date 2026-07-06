import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Inheritance() {
  return (
    <LessonArticle>
      <Definition term="Inheritance">
        <p>
          <strong className="text-white">Inheritance</strong> lets you define a new class based on an existing one.
          The child class <strong className="text-white">inherits</strong> attributes and methods from the parent
          and can add or override behavior. This models an <strong className="text-white">is-a</strong> relationship:
          a Dog <em>is an</em> Animal.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Inheritance chain"
          chart={`
flowchart TB
  A["class Animal"]
  B["class Dog(Animal)"]
  C["Dog instance"]

  A --> B
  B --> C

  style A fill:#1a2540,stroke:#64748b,color:#f8fafc
  style B fill:#1a2540,stroke:#38bdf8,color:#f8fafc
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Basic inheritance">
        <Example
          title="Animal and Dog"
          output={`Buddy makes a sound
Buddy runs`}
        >{`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound")

    def run(self):
        print(f"{self.name} runs")

class Dog(Animal):
    def speak(self):
        print(f"{self.name} says Woof!")

buddy = Dog("Buddy")
buddy.speak()
buddy.run()   # inherited from Animal`}</Example>
        <p>
          <code className="font-mono text-sm">Dog(Animal)</code> means Dog inherits from Animal. Dog gets{' '}
          <code className="font-mono text-sm">run</code> for free but <strong className="text-white">overrides</strong>{' '}
          <code className="font-mono text-sm">speak</code> with its own version.
        </p>
      </ContentStep>

      <ContentStep number={3} title="super() — call the parent">
        <Example
          title="Extend parent __init__"
          output={`Whiskers the Cat`}
        >{`class Animal:
    def __init__(self, name):
        self.name = name

class Cat(Animal):
    def __init__(self, name, indoor):
        super().__init__(name)
        self.indoor = indoor

    def describe(self):
        kind = "indoor" if self.indoor else "outdoor"
        print(f"{self.name} the {kind} cat")

cat = Cat("Whiskers", True)
cat.describe()`}</Example>
        <Callout variant="beginner">
          <code className="font-mono text-sm">super().__init__(name)</code> calls the parent's initializer so you
          do not duplicate setup logic. Always set up the parent before adding child-specific attributes.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Method Resolution Order (MRO) — preview">
        <p>
          When you call a method, Python searches: the instance → the class → parent classes left to right. You can
          inspect this with <code className="font-mono text-sm">ClassName.mro()</code>. Multiple inheritance gets
          tricky — prefer simple hierarchies while learning.
        </p>
        <Example title="See the MRO">{`class A: pass
class B(A): pass
print(B.mro())`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Child class inherits from parent: class Child(Parent).',
          'Override methods by defining same name in child.',
          'super() calls parent methods — essential in __init__.',
          'Use inheritance for genuine is-a relationships.',
        ]}
      />
    </LessonArticle>
  )
}
