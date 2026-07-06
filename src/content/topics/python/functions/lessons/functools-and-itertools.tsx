import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function FunctoolsAndItertools() {
  return (
    <LessonArticle>
      <Definition term="functools & itertools">
        <p>
          <strong className="text-white">functools</strong> provides higher-order function utilities;{' '}
          <strong className="text-white">itertools</strong> offers memory-efficient iterator building blocks.
          Both are interview staples for elegant, performant Python.
        </p>
      </Definition>

      <ContentStep number={1} title="functools.partial">
        <Example
          title="Freeze some arguments"
          output={`10`}
        >{`from functools import partial

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(10))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="functools.lru_cache">
        <Example
          title="Memoize expensive calls"
          output={`55
0`}
        >{`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
print(fib.cache_info())`}</Example>
        <p>Arguments must be hashable. Great for recursive DP and pure functions.</p>
      </ContentStep>

      <ContentStep number={3} title="functools.reduce">
        <Example
          title="Fold a sequence"
          output={`24`}
        >{`from functools import reduce

product = reduce(lambda acc, x: acc * x, [1, 2, 3, 4], 1)
print(product)`}</Example>
        <p>Prefer <code className="font-mono text-sm">sum()</code>, <code className="font-mono text-sm">any()</code>, loops when clearer — reduce is less Pythonic today but still asked.</p>
      </ContentStep>

      <ContentStep number={4} title="itertools highlights">
        <Example
          title="chain, islice, combinations"
        >{`from itertools import chain, islice, combinations

print(list(chain([1, 2], [3, 4])))
print(list(islice(range(100), 5)))
print(list(combinations("ABC", 2)))`}</Example>
        <Callout variant="info">
          Other interview favorites: <code className="font-mono text-sm">groupby</code> (requires sorted input),{' '}
          <code className="font-mono text-sm">cycle</code>, <code className="font-mono text-sm">permutations</code>,{' '}
          <code className="font-mono text-sm">accumulate</code>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'partial freezes arguments; lru_cache memoizes pure functions.',
          'reduce folds iterables — know it, but prefer builtins when possible.',
          'itertools builds lazy iterators — chain, islice, combinations.',
          'lru_cache requires hashable arguments.',
        ]}
      />
    </LessonArticle>
  )
}
