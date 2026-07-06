import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function DefiningFunctions() {
  return (
    <LessonArticle>
      <Definition term="Defining Functions">
        <p>
          A <strong className="text-white">function</strong> is a named block of code you can run whenever you need
          it. Instead of copying the same logic ten times, you write it once and <strong className="text-white">call</strong>{' '}
          the function by name.
        </p>
        <p>
          Functions are the main way to organize logic in Python — before classes, before modules, you need solid
          functions.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Calling a function"
          chart={`
flowchart TB
  A["def greet()"]
  B["greet() called"]
  C["Body runs"]
  D["return value"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Your first function">
        <Example
          title="Define and call"
          output={`Hello, Ada!
Hello, Bob!`}
        >{`def greet(name):
    print(f"Hello, {name}!")

greet("Ada")
greet("Bob")`}</Example>
        <p>
          <code className="font-mono text-sm">def</code> starts the definition. The indented block is the body.
          Calling <code className="font-mono text-sm">greet("Ada")</code> jumps into that block with{' '}
          <code className="font-mono text-sm">name="Ada"</code>.
        </p>
      </ContentStep>

      <ContentStep number={3} title="return — sending a value back">
        <Example
          title="Functions that compute"
          output={`15
120`}
          caption="Without return, a function gives back None."
        >{`def add(a, b):
    return a + b

def broken():
    pass   # returns None

print(add(10, 5))
print(broken())`}</Example>
        <Callout variant="beginner">
          <code className="font-mono text-sm">print</code> shows output to the user.{' '}
          <code className="font-mono text-sm">return</code> sends a value back to whoever called the function — use
          return when other code needs the result.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'def name(): defines a function; name() calls it.',
          'Parameters receive values; return sends a value back.',
          'Functions reduce duplication and organize logic.',
          'Functions without return implicitly return None.',
        ]}
      />
    </LessonArticle>
  )
}
