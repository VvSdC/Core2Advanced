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

export function Closures() {
  return (
    <LessonArticle>
      <Definition term="Closures">
        <p>
          A <strong className="text-white">closure</strong> is a nested function that remembers variables from the
          enclosing function's scope — even after the outer function has finished running.
        </p>
        <p>
          Closures are how Python implements private state without classes, factory functions, and decorators.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Closure remembers enclosing scope"
          chart={`
flowchart TB
  A["outer() runs"]
  B["Creates local variable"]
  C["Returns inner function"]
  D["outer finishes"]
  E["inner still sees variable"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Classic closure example">
        <Example
          title="Multiplier factory"
          output={`10
30`}
        >{`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

times3 = make_multiplier(3)
times5 = make_multiplier(5)

print(times3(10))
print(times5(6))`}</Example>
        <StepSequence
          steps={[
            {
              title: 'make_multiplier(3) runs',
              description: 'Creates local n=3 and defines multiply inside.',
            },
            {
              title: 'Returns multiply',
              description: 'The inner function object carries a reference to n=3.',
            },
            {
              title: 'times3(10) later',
              description: 'multiply runs with x=10 and still sees n=3 — that is the closure.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="Practical use: private counter">
        <Example
          title="Enclosed state"
          output={`1
2
3`}
        >{`def counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

c = counter()
print(c())
print(c())
print(c())`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Inspecting closures">
        <Example
          title="__closure__"
          caption="multiply.__closure__ holds cell objects referencing captured variables."
        >{`def outer(msg):
    def inner():
        print(msg)
    return inner

fn = outer("hello")
print(fn.__closure__[0].cell_contents)`}</Example>
      </ContentStep>

      <Callout variant="insight">
        Late-binding gotcha: closures in a loop that capture the loop variable all see the{' '}
        <em>final</em> value unless you capture with a default arg:{' '}
        <code className="font-mono text-sm">lambda i=i: i</code>.
      </Callout>

      <KeyTakeaways
        items={[
          'A closure is an inner function plus captured enclosing variables.',
          'Factories and private state use closures.',
          'nonlocal lets the inner function update enclosed variables.',
          'Decorators are built on closures — next lesson.',
        ]}
      />
    </LessonArticle>
  )
}
