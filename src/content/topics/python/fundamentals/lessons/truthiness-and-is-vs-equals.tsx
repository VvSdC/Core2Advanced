import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function TruthinessAndIsVsEquals() {
  return (
    <LessonArticle>
      <Definition term="Truthiness & is vs ==">
        <p>
          In <code className="font-mono text-sm">if</code> statements, Python evaluates values as{' '}
          <strong className="text-white">truthy</strong> or <strong className="text-white">falsy</strong>.{' '}
          <code className="font-mono text-sm">==</code> compares <em>values</em>;{' '}
          <code className="font-mono text-sm">is</code> compares <em>identity</em> (same object in memory).
        </p>
        <p>These two topics appear in almost every Python interview.</p>
      </Definition>

      <ContentStep number={1} title="Falsy values">
        <Example
          title="What counts as False in if"
        >{`falsy = [False, None, 0, 0.0, "", [], {}, set(), range(0)]
for v in falsy:
    print(v, bool(v))`}</Example>
        <p>Everything else is truthy — including non-empty containers and the string <code className="font-mono text-sm">"0"</code>.</p>
      </ContentStep>

      <ContentStep number={2} title="== vs is">
        <Example
          title="Value equality vs identity"
          output={`True
False
True`}
        >{`a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True — same values
print(a is b)   # False — different objects
print(a is c)   # True — same object`}</Example>
        <Callout variant="insight">
          Always use <code className="font-mono text-sm">is None</code> and <code className="font-mono text-sm">is not None</code> — never{' '}
          <code className="font-mono text-sm">== None</code>. <code className="font-mono text-sm">None</code> is a singleton.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Small integer caching">
        <Example
          title="CPython interning"
          output={`True
False (often)`}
        >{`print(1 is 1)        # True — cached small ints
print(1000 is 1000)  # may be False — not cached`}</Example>
        <p>Never rely on <code className="font-mono text-sm">is</code> for value comparison — only identity checks.</p>
      </ContentStep>

      <ContentStep number={4} title="Chained comparisons">
        <Example
          title="Pythonic range check"
          output={`True`}
        >{`x = 15
print(10 < x < 20)   # same as 10 < x and x < 20`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Falsy: False, None, 0, empty containers, empty string.',
          '== compares values; is compares object identity.',
          'Use is None / is not None — never == None.',
          'Small int caching makes "is" misleading for numbers.',
        ]}
      />
    </LessonArticle>
  )
}
