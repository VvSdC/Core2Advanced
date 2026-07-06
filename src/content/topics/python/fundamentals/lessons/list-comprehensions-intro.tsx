import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ListComprehensionsIntro() {
  return (
    <LessonArticle>
      <Definition term="List Comprehensions">
        <p>
          A list comprehension builds a new list in one expression — shorter and often faster than a manual for
          loop with append.
        </p>
      </Definition>

      <ContentStep number={1} title="Basic syntax">
        <Example
          title="Squares and filtered values"
          output={`[0, 1, 4, 9, 16]
[0, 2, 4]`}
        >{`squares = [x ** 2 for x in range(5)]
print(squares)

evens = [x for x in range(6) if x % 2 == 0]
print(evens)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Syntax: [expression for item in iterable if condition].',
          'The if part is optional — filters items.',
          'Dict and set comprehensions work similarly (see Collections).',
        ]}
      />
    </LessonArticle>
  )
}
