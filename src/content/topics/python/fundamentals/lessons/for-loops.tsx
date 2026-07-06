import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ForLoops() {
  return (
    <LessonArticle>
      <Definition term="for Loops">
        <p>
          A <code className="font-mono text-sm">for</code> loop repeats code for each item in a sequence — a list,
          string, range, or any iterable. It is the most common loop in Python.
        </p>
      </Definition>

      <ContentStep number={1} title="Looping over sequences">
        <Example
          title="Iterate a list and a string"
          output={`apple
banana
cherry
h
e
l
l
o`}
        >{`fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

for char in "hello":
    print(char)`}</Example>
      </ContentStep>

      <ContentStep number={2} title="range() — loops with numbers">
        <Example
          title="range(stop), range(start, stop), range(start, stop, step)"
          output={`0 1 2 3 4
2 4 6 8`}
        >{`for i in range(5):
    print(i, end=" ")
print()

for n in range(2, 10, 2):
    print(n, end=" ")`}</Example>
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <Example
          title="Summing values"
          output={`15`}
        >{`total = 0
for n in [1, 2, 3, 4, 5]:
    total += n
print(total)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'for item in iterable: runs the body once per item.',
          'range(n) produces 0 .. n-1.',
          'Loop variables (fruit, i) are just names — pick descriptive ones.',
        ]}
      />
    </LessonArticle>
  )
}
