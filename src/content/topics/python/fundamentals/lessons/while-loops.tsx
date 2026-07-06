import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function WhileLoops() {
  return (
    <LessonArticle>
      <Definition term="while Loops">
        <p>
          A <code className="font-mono text-sm">while</code> loop repeats as long as a condition stays true. Use it
          when you do not know in advance how many iterations you need.
        </p>
      </Definition>

      <ContentStep number={1} title="Basic pattern">
        <Example
          title="Countdown"
          output={`3
2
1
Go!`}
        >{`count = 3
while count > 0:
    print(count)
    count -= 1
print("Go!")`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Avoiding infinite loops">
        <p>Every while loop must eventually make the condition false. If it never does, the loop runs forever.</p>
        <Example title="Always advance toward the exit">{`# user input loop
password = ""
while password != "secret":
    password = input("Password: ")`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'while condition: repeats until the condition is falsy.',
          'Ensure something inside the loop changes the condition.',
          'Prefer for when iterating a known sequence.',
        ]}
      />
    </LessonArticle>
  )
}
