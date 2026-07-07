import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BasicFenwickTree() {
  return (
    <LessonArticle>
      <Definition term="Basic Fenwick Tree">
        <p>
          Two methods are enough for most problems: <code className="font-mono text-sm">update(i, delta)</code> adds{' '}
          <code className="font-mono text-sm">delta</code> at position i, and{' '}
          <code className="font-mono text-sm">prefix_sum(i)</code> returns the sum of positions 1 through i.
        </p>
      </Definition>

      <ContentStep number={1} title="The two loops">
        <Flowchart
          title="update goes up, query goes down"
          chart={`
flowchart TB
  U["update(i): i += lowbit(i) — climb to parents"]
  Q["prefix_sum(i): i -= lowbit(i) — climb to smaller ranges"]
  L["lowbit(i) = i & -i"]

  U --> L
  Q --> L
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="FenwickTree"
          output={`10
13
7`}
          caption="Build [3,1,4,2], add 3 at index 2, query prefix sums"
        >{`class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def _lowbit(self, i):
        return i & -i

    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += self._lowbit(i)

    def prefix_sum(self, i):
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= self._lowbit(i)
        return total

    @classmethod
    def from_array(cls, arr):
        ft = cls(len(arr))
        for i, val in enumerate(arr, start=1):
            ft.update(i, val)
        return ft


ft = FenwickTree.from_array([3, 1, 4, 2])
print(ft.prefix_sum(4))   # 3+1+4+2 = 10
ft.update(2, 3)           # add 3 at index 2 → nums[1] becomes 4
print(ft.prefix_sum(4))   # 10 + 3 = 13
print(ft.prefix_sum(2))   # 3 + 4 = 7`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Mental model">
        <p>
          <strong className="text-white">update(2, 3)</strong> means &quot;add 3 to position 2.&quot; It does not set
          the value to 3. To set a position from old to new, use{' '}
          <code className="font-mono text-sm">update(i, new - old)</code>.
        </p>
        <Callout variant="insight">
          Space <strong className="text-white">O(n)</strong>, each operation touches at most O(log n) cells. Simpler
          to code than a segment tree for sum/count problems.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'update(i, delta): walk i += lowbit(i) while i <= n.',
          'prefix_sum(i): walk i -= lowbit(i) while i > 0.',
          'from_array: call update(i, val) for each element.',
          'update adds delta — use new - old to set a value.',
        ]}
      />
    </LessonArticle>
  )
}
