import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Sets() {
  return (
    <LessonArticle>
      <Definition term="Sets">
        <p>
          A <strong className="text-white">set</strong> holds unique, unordered values. Use it to remove duplicates,
          test membership fast, and compute unions/intersections.
        </p>
      </Definition>

      <ContentStep number={1} title="Set operations">
        <Example
          title="Uniqueness and set math"
          output={`{1, 2, 3}
True
{2, 3}`}
        >{`tags = {"python", "web", "python", "api"}
print(tags)   # duplicates removed

print("python" in tags)

a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)   # intersection
print(a | b)   # union`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Sets store unique items; order is not guaranteed.',
          'Use add(), remove(), discard() to mutate.',
          '& | - ^ for intersection, union, difference, symmetric difference.',
        ]}
      />
    </LessonArticle>
  )
}
