import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function OopCommonMistakes() {
  return (
    <LessonArticle>
      <Definition term="Common OOP Mistakes">
        <p>
          OOP clicks suddenly after practice — but certain mistakes slow almost every beginner. This lesson
          collects the traps so you can recognize them early.
        </p>
      </Definition>

      <ContentStep number={1} title="Mistake 1: Forgetting self">
        <Example
          title="TypeError waiting to happen"
          caption="Every instance method needs self as the first parameter."
        >{`class Greeter:
    def hello():          # missing self
        print("hi")

# Greeter().hello()  # TypeError`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Mistake 2: Mutable class attributes">
        <Example
          title="Shared list on the class"
          output={`Both teams show ['Ada']`}
        >{`class Team:
    roster = []
    def add(self, name):
        self.roster.append(name)

a, b = Team(), Team()
a.add("Ada")
print(a.roster, b.roster)`}</Example>
        <p>Fix: initialize <code className="font-mono text-sm">self.roster = []</code> in <code className="font-mono text-sm">__init__</code>.</p>
      </ContentStep>

      <ContentStep number={3} title="Mistake 3: God classes">
        <Callout variant="insight">
          One class that does everything — UserManagerAuthPaymentLogger — is hard to test and change. Split
          responsibilities. If a class name needs "And" twice, consider splitting.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Mistake 4: Inheritance abuse">
        <p>
          Not every shared behavior needs a parent class. Ask: is this truly an is-a relationship? If you override
          most parent methods, composition might fit better.
        </p>
      </ContentStep>

      <ContentStep number={5} title="Mistake 5: Skipping super() in __init__">
        <Example
          title="Child without super()"
          caption="Parent setup never runs — attributes like self.name from Animal never get set."
        >{`class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        # forgot super().__init__(name)
        self.breed = breed`}</Example>
      </ContentStep>

      <ContentStep number={6} title="Mistake 6: Overusing getters and setters">
        <p>
          Python is not Java. Simple attributes do not need <code className="font-mono text-sm">get_name()</code> /{' '}
          <code className="font-mono text-sm">set_name()</code> unless you need validation. Use{' '}
          <code className="font-mono text-sm">@property</code> when rules apply.
        </p>
      </ContentStep>

      <ContentStep number={7} title="Mistake 7: Classes where functions suffice">
        <Callout variant="tip">
          A script that converts CSV to JSON does not need a Converter class with one method. A function{' '}
          <code className="font-mono text-sm">csv_to_json(path)</code> is clearer. Use classes when you have state
          and behavior that belong together.
        </Callout>
      </ContentStep>

      <ContentStep number={8} title="Putting it all together">
        <p>
          You now have the full beginner OOP toolkit: classes, objects, <code className="font-mono text-sm">__init__</code>,{' '}
          <code className="font-mono text-sm">self</code>, encapsulation, inheritance, polymorphism, special methods,
          composition, and class methods. The next step is practice — model a small domain (library, game, shop) with
          3–4 classes and relationships between them.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Always include self on instance methods.',
          'Never use mutable class attributes for per-instance data.',
          'Prefer composition when the relationship is has-a, not is-a.',
          'Call super().__init__ in child classes.',
          'Use classes when modeling stateful things — not for every function.',
        ]}
      />
    </LessonArticle>
  )
}
