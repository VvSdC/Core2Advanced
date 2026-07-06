import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CompositionVsInheritance() {
  return (
    <LessonArticle>
      <Definition term="Composition vs Inheritance">
        <p>
          <strong className="text-white">Inheritance</strong> is <em>is-a</em>: a Dog is an Animal.{' '}
          <strong className="text-white">Composition</strong> is <em>has-a</em>: a Car has an Engine. Instead of
          extending a class, you embed other objects as attributes and delegate work to them.
        </p>
      </Definition>

      <ContentStep number={1} title="When to use which">
        <Flowchart
          title="Design choice"
          chart={`
flowchart TB
  Q{"Is it an is-a relationship?"}
  ISA["Use Inheritance"]
  Q2{"Is it a has-a relationship?"}
  HASA["Use Composition"]

  Q -->|Yes| ISA
  Q -->|No| Q2
  Q2 -->|Yes| HASA
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Composition example">
        <Example
          title="Car has an Engine — not Car is an Engine"
          output={`Vroom!`}
        >{`class Engine:
    def start(self):
        print("Vroom!")

class Car:
    def __init__(self):
        self.engine = Engine()   # composition

    def start(self):
        self.engine.start()

car = Car()
car.start()`}</Example>
        <p>
          If you later need an ElectricMotor instead of Engine, you swap what{' '}
          <code className="font-mono text-sm">self.engine</code> points to — without deep inheritance trees.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Inheritance misuse">
        <Callout variant="insight" title="Code smell: shallow inheritance">
          Bad: <code className="font-mono text-sm">class Stack(list)</code> just to reuse list — a Stack{' '}
          <em>uses</em> a list internally, it is not a special kind of list. Bad: inheriting only to reuse one
          method while overriding everything else. Favor composition when the relationship is not a true is-a.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Inheritance: is-a (Dog is Animal).',
          'Composition: has-a (Car has Engine).',
          'Composition is often more flexible and easier to change.',
          'Do not inherit just to reuse code — compose instead.',
        ]}
      />
    </LessonArticle>
  )
}
