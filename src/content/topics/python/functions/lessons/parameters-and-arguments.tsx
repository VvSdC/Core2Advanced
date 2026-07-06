import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function ParametersAndArguments() {
  return (
    <LessonArticle>
      <Definition term="Parameters & Arguments">
        <p>
          <strong className="text-white">Parameters</strong> are the names in the function definition.{' '}
          <strong className="text-white">Arguments</strong> are the actual values you pass when calling. They are
          two sides of the same handshake.
        </p>
      </Definition>

      <ContentStep number={1} title="Positional and keyword arguments">
        <Example
          title="Two ways to pass values"
          output={`Ada is 30
Ada is 30`}
        >{`def describe(name, age):
    print(f"{name} is {age}")

describe("Ada", 30)              # positional
describe(age=30, name="Ada")     # keyword — order free`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Default parameter values">
        <Example
          title="Optional parameters"
          output={`Hello, World!
Hello, Python!`}
          caption="Defaults must come after non-default parameters."
        >{`def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("World")
greet("Python", "Hi")`}</Example>
        <Callout variant="insight" title="Mutable default trap">
          Never use a mutable default like <code className="font-mono text-sm">def f(items=[])</code>. Use{' '}
          <code className="font-mono text-sm">items=None</code> and create the list inside. Covered in depth in
          Common Function Mistakes.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Parameter order rules">
        <StepSequence
          steps={[
            {
              title: 'Positional-only (rare)',
              description: 'Before / in def — advanced, skip for now.',
            },
            {
              title: 'Positional-or-keyword',
              description: 'Normal parameters: def f(a, b).',
            },
            {
              title: 'Default values',
              description: 'def f(a, b=10) — b is optional.',
            },
            {
              title: 'Keyword-only',
              description: 'After * in def f(a, *, b) — b must be passed by name.',
            },
          ]}
        />
      </ContentStep>

      <KeyTakeaways
        items={[
          'Parameters in def; arguments at call time.',
          'Pass by position or by keyword name=value.',
          'Defaults make parameters optional.',
          'Never use mutable objects as default values.',
        ]}
      />
    </LessonArticle>
  )
}
