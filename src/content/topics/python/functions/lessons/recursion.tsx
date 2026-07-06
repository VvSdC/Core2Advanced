import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Recursion() {
  return (
    <LessonArticle>
      <Definition term="Recursion">
        <p>
          <strong className="text-white">Recursion</strong> is when a function calls itself to solve a smaller
          version of the same problem. Every recursive function needs a{' '}
          <strong className="text-white">base case</strong> (when to stop) and a{' '}
          <strong className="text-white">recursive case</strong> (smaller subproblem).
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Recursive calls"
          chart={`
flowchart TB
  A["factorial(4)"]
  B["4 * factorial(3)"]
  C["3 * factorial(2)"]
  D["2 * factorial(1)"]
  E["1 base case"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Factorial example">
        <Example
          title="n! = n * (n-1)!"
          output={`120`}
        >{`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`}</Example>
        <p>
          Each call waits for the next to finish — a call stack builds up, then unwinds as base cases return.
        </p>
      </ContentStep>

      <ContentStep number={3} title="When recursion goes wrong">
        <Callout variant="insight">
          Missing base case → infinite recursion → <code className="font-mono text-sm">RecursionError</code>.
          Python limits stack depth. For large inputs, a loop is often safer and faster.
        </Callout>
        <Example
          title="Stack depth limit"
          caption="Default recursion limit is ~1000 — sys.getrecursionlimit()"
        >{`import sys
print(sys.getrecursionlimit())   # typically 1000

# sys.setrecursionlimit(2000)  # use cautiously — can crash with stack overflow`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Recursion vs iteration">
        <Example
          title="Same factorial, iterative"
          output={`120`}
        >{`def factorial_iter(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial_iter(5))`}</Example>
        <p>
          Python does <em>not</em> optimize tail recursion. Deep recursion → stack overflow. Interviews often ask
          you to convert recursive solutions to loops for large n.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Recursion: function calls itself on a smaller input.',
          'Always define a base case that stops recursion.',
          'Each call adds a stack frame — default limit ~1000.',
          'No tail-call optimization — prefer loops for deep recursion.',
          'Loops can replace many recursive solutions.',
        ]}
      />
    </LessonArticle>
  )
}
