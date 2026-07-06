import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Lists() {
  return (
    <LessonArticle>
      <Definition term="Lists">
        <p>
          A <strong className="text-white">list</strong> is an ordered, mutable collection. Items stay in order,
          you can change them, and duplicates are allowed. Lists are one of the most used structures in Python.
        </p>
      </Definition>

      <ContentStep number={1} title="Creating and indexing">
        <Example
          title="Basics"
          output={`banana
[10, 20, 30]
[0, 1, 4, 9]`}
        >{`fruits = ["apple", "banana", "cherry"]
print(fruits[1])        # index from 0
print(fruits[-1])       # last item

nums = [1, 2, 3]
nums[0] = 10
print(nums)

squares = [x ** 2 for x in range(4)]
print(squares)`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Slicing and methods">
        <Example
          title="Slice and mutate"
          output={`['b', 'c']
['a', 'b', 'c', 'date']
3`}
        >{`fruits = ["apple", "banana", "cherry"]
print(fruits[1:3])      # slice

fruits.append("date")
print(fruits)

fruits.remove("banana")
print(len(fruits))`}</Example>
        <Callout variant="beginner">
          Slicing <code className="font-mono text-sm">[start:stop]</code> includes start, excludes stop — same rule as range().
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Lists are ordered, mutable, and allow duplicates.',
          'Index from 0; negative indices count from the end.',
          'append, extend, insert, remove, pop are common methods.',
        ]}
      />
    </LessonArticle>
  )
}
