import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IterationProtocol() {
  return (
    <LessonArticle>
      <Definition term="The Iteration Protocol">
        <p>
          A <code className="font-mono text-sm">for</code> loop works because objects implement the iteration
          protocol: <code className="font-mono text-sm">__iter__()</code> returns an iterator, and{' '}
          <code className="font-mono text-sm">__next__()</code> returns the next value until{' '}
          <code className="font-mono text-sm">StopIteration</code> is raised.
        </p>
      </Definition>

      <ContentStep number={1} title="iter() and next()">
        <Example
          title="Manual iteration"
          output={`a
b
c`}
        >{`items = iter(["a", "b", "c"])
print(next(items))
print(next(items))
print(next(items))
# next(items) again → StopIteration`}</Example>
        <Callout variant="beginner">
          A for loop is syntactic sugar: it calls iter(), repeatedly next(), and catches StopIteration for you.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'iter(obj) gets an iterator from an iterable.',
          'next(it) fetches the next item.',
          'StopIteration signals the end — for loops handle it internally.',
        ]}
      />
    </LessonArticle>
  )
}
