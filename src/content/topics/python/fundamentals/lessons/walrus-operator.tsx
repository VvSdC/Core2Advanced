import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function WalrusOperator() {
  return (
    <LessonArticle>
      <Definition term="Walrus Operator :=">
        <p>
          The <strong className="text-white">walrus operator</strong> (<code className="font-mono text-sm">:=</code>)
          assigns a value and returns it in one expression — introduced in Python 3.8. It reduces duplication when
          you need a value twice: once to test, once to use.
        </p>
      </Definition>

      <ContentStep number={1} title="Avoid double lookup">
        <Example
          title="Read once, use twice"
          output={`Read 5 lines`}
        >{`# Without walrus — read twice or use extra variable
data = input("Enter: ")
while data != "quit":
    print(f"You said: {data}")
    data = input("Enter: ")

# With walrus — assign inside condition
while (data := input("Enter: ")) != "quit":
    print(f"You said: {data}")`}</Example>
      </ContentStep>

      <ContentStep number={2} title="In comprehensions and if">
        <Example
          title="Filter while computing"
          output={`[4, 16]`}
        >{`numbers = [1, 2, 3, 4, 5]
squares = [y for x in numbers if (y := x ** 2) > 10]
print(squares)

if (n := len(numbers)) > 3:
    print(f"Got {n} items")`}</Example>
      </ContentStep>

      <ContentStep number={3} title="When not to use it">
        <Callout variant="insight">
          Parentheses are required in many contexts. Overusing <code className="font-mono text-sm">:=</code> hurts
          readability — prefer a plain variable when the logic is not a one-liner. Interviewers want you to know it
          exists, not abuse it.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          ':= assigns and returns a value in one expression (Python 3.8+).',
          'Useful in while loops and comprehensions to avoid duplicate work.',
          'Parentheses often required: if (x := f()) > 0.',
          'Readability first — do not walrus everything.',
        ]}
      />
    </LessonArticle>
  )
}
