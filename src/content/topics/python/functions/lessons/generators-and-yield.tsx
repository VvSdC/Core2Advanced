import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function GeneratorsAndYield() {
  return (
    <LessonArticle>
      <Definition term="Generators & yield">
        <p>
          A <strong className="text-white">generator</strong> is a function that produces values lazily — one at a
          time — using <code className="font-mono text-sm">yield</code> instead of{' '}
          <code className="font-mono text-sm">return</code>. It remembers its state between calls.
        </p>
        <p>
          Generators are memory-efficient for large or infinite sequences.
        </p>
      </Definition>

      <ContentStep number={1} title="yield pauses and resumes">
        <Example
          title="Count up"
          output={`1
2
3`}
        >{`def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

for num in count_up_to(3):
    print(num)`}</Example>
        <p>
          Calling <code className="font-mono text-sm">count_up_to(3)</code> returns a generator object — it does
          not run the body yet. The loop calls <code className="font-mono text-sm">next()</code> until{' '}
          <code className="font-mono text-sm">StopIteration</code>.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Generator expressions">
        <Example
          title="Like list comprehension but lazy"
          output={`10`}
        >{`gen = (x ** 2 for x in range(5))
print(sum(gen))`}</Example>
      </ContentStep>

      <Callout variant="beginner">
        Use a list when you need all values at once. Use a generator when you process items one-by-one or the
        sequence is huge.
      </Callout>

      <KeyTakeaways
        items={[
          'yield produces a value and pauses; next call resumes.',
          'Generator functions return generator objects.',
          '(expr for x in it) is a generator expression.',
          'Generators save memory for large sequences.',
        ]}
      />
    </LessonArticle>
  )
}
