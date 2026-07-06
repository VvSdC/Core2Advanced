import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function LambdaFunctions() {
  return (
    <LessonArticle>
      <Definition term="Lambda Functions">
        <p>
          A <strong className="text-white">lambda</strong> is a small, anonymous function written in one
          expression. Use it for short throwaway operations — especially with{' '}
          <code className="font-mono text-sm">sorted</code>, <code className="font-mono text-sm">map</code>, and{' '}
          <code className="font-mono text-sm">filter</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="Syntax">
        <Example
          title="lambda vs def"
          output={`25
[1, 4, 9, 16]`}
        >{`square = lambda x: x * x
print(square(5))

nums = [1, 2, 3, 4]
squares = list(map(lambda x: x ** 2, nums))
print(squares)`}</Example>
        <p>
          Syntax: <code className="font-mono text-sm">lambda parameters: expression</code>. No{' '}
          <code className="font-mono text-sm">return</code> keyword — the expression is returned automatically.
        </p>
      </ContentStep>

      <ContentStep number={2} title="With sorted">
        <Example
          title="Custom sort key"
          output={`['Ada', 'bob', 'charlie']`}
        >{`names = ["charlie", "Ada", "bob"]
print(sorted(names, key=lambda n: n.lower()))`}</Example>
      </ContentStep>

      <Callout variant="tip">
        If a lambda grows beyond one line, use a regular <code className="font-mono text-sm">def</code> instead.
        Readability beats brevity.
      </Callout>

      <KeyTakeaways
        items={[
          'lambda args: expression creates an anonymous function.',
          'Best for short callbacks and sort keys.',
          'Use def when logic is more than one simple expression.',
        ]}
      />
    </LessonArticle>
  )
}
