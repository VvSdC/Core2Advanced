import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function RangeSumQuery() {
  return (
    <LessonArticle>
      <Definition term="Range Sum Query">
        <p>
          Once you have <code className="font-mono text-sm">prefix_sum</code>, any range sum is just two prefix
          queries:
        </p>
        <p className="font-mono text-sm text-gray-300">
          sum(l..r) = prefix_sum(r) − prefix_sum(l − 1)
        </p>
        <p>
          This is the most direct Fenwick tree application — a mutable array with fast range sums.
        </p>
      </Definition>

      <ContentStep number={1} title="Range from two prefixes">
        <Example
          title="range_sum"
          output={`8
11`}
          caption="nums = [3,1,4,2]. Sum [1,3] then update index 3 and sum again"
        >{`class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def prefix_sum(self, i):
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total

    def range_sum(self, l, r):
        return self.prefix_sum(r) - self.prefix_sum(l - 1)


nums = [3, 1, 4, 2]
ft = FenwickTree(len(nums))
for i, v in enumerate(nums, start=1):
    ft.update(i, v)

# 1-indexed positions: sum nums[0..2] = positions 1..3 → 3+1+4 = 8
print(ft.range_sum(1, 3))

# Point update: nums[2] (position 3) from 4 to 7 → add delta +3
ft.update(3, 3)
print(ft.range_sum(1, 3))   # 3+1+7 = 11`}</Example>
      </ContentStep>

      <ContentStep number={2} title="When to use">
        <Callout variant="insight">
          Use a Fenwick tree when you see <strong className="text-white">many</strong> &quot;add to index i&quot; or
          &quot;set index i&quot; operations mixed with <strong className="text-white">sum from l to r</strong>{' '}
          queries. If the array never changes, a plain prefix array is simpler.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'range_sum(l, r) = prefix_sum(r) - prefix_sum(l - 1).',
          'Point update: update(i, delta) where delta = new - old.',
          'Use 1-based indices when talking to the Fenwick tree.',
          'The template from the previous lesson — no new tricks.',
        ]}
      />
    </LessonArticle>
  )
}
