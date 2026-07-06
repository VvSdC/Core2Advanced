import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function EnumerateAndZip() {
  return (
    <LessonArticle>
      <Definition term="enumerate & zip">
        <p>
          <code className="font-mono text-sm">enumerate</code> pairs each item with its index.{' '}
          <code className="font-mono text-sm">zip</code> pairs items from multiple sequences together.
        </p>
      </Definition>

      <ContentStep number={1} title="In practice">
        <Example
          title="enumerate and zip"
          output={`0 apple
1 banana
Ada 85
Bob 92`}
        >{`fruits = ["apple", "banana"]
for i, fruit in enumerate(fruits):
    print(i, fruit)

names = ["Ada", "Bob"]
scores = [85, 92]
for name, score in zip(names, scores):
    print(name, score)`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'enumerate(iterable) yields (index, item) pairs.',
          'zip(a, b) pairs elements until the shortest sequence ends.',
        ]}
      />
    </LessonArticle>
  )
}
