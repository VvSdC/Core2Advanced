import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ScopeLegbNonlocal() {
  return (
    <LessonArticle>
      <Definition term="Scope, LEGB & nonlocal">
        <p>
          <strong className="text-white">Scope</strong> is where a variable name is visible. Python searches for
          names using the <strong className="text-white">LEGB</strong> rule: Local → Enclosing → Global → Built-in.
        </p>
      </Definition>

      <ContentStep number={1} title="The LEGB flow">
        <Flowchart
          title="Name lookup order"
          chart={`
flowchart TB
  L["Local"]
  E["Enclosing"]
  G["Global"]
  B["Built-in"]

  L --> E
  E --> G
  G --> B
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Local vs global">
        <Example
          title="Reading vs assigning"
          output={`10
20`}
          caption="Assignment inside a function creates a local variable unless you declare global."
        >{`x = 10

def read():
    print(x)   # reads global

def shadow():
    x = 20     # new local x
    print(x)

read()
shadow()
print(x)`}</Example>
      </ContentStep>

      <ContentStep number={3} title="nonlocal — modifying enclosing scope">
        <Example
          title="Counter in nested function"
          output={`1
2
3`}
        >{`def outer():
    count = 0
    def inner():
        nonlocal count
        count += 1
        print(count)
    return inner

counter = outer()
counter()
counter()
counter()`}</Example>
        <Callout variant="beginner">
          <code className="font-mono text-sm">nonlocal</code> is for nested functions updating a variable in the
          parent function. <code className="font-mono text-sm">global</code> is for module-level variables. Closures
          in the next lessons build on this.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'LEGB: Local → Enclosing → Global → Built-in.',
          'Assignment creates a local variable by default.',
          'global modifies module-level names; nonlocal modifies enclosing function names.',
          'Understanding scope is required for closures and decorators.',
        ]}
      />
    </LessonArticle>
  )
}
