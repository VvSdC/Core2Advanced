import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Tuples() {
  return (
    <LessonArticle>
      <Definition term="Tuples">
        <p>
          A <strong className="text-white">tuple</strong> is like a list but <strong className="text-white">immutable</strong> —
          after creation you cannot add, remove, or change items. Use tuples for fixed collections: coordinates,
          RGB colors, database rows.
        </p>
      </Definition>

      <ContentStep number={1} title="Creating and unpacking">
        <Example
          title="Tuple basics"
          output={`3
(40.7, -74.0)
Ada
85`}
        >{`point = (10, 20, 30)
print(point[0])

coords = 40.7128, -74.0060   # parentheses optional
print(coords)

name, score = ("Ada", 85)    # unpacking
print(name)
print(score)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Tuples are ordered and immutable.',
          'Use (1,) for a one-element tuple — the comma matters.',
          'Unpacking assigns multiple variables in one line.',
        ]}
      />
    </LessonArticle>
  )
}
