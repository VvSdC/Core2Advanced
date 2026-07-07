import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function RangeMinimumQuery() {
  return (
    <LessonArticle>
      <Definition term="Range Minimum Query (RMQ)">
        <p>
          Change one line: parents store <strong className="text-white">min(left, right)</strong> instead of sum.
          Fenwick trees do not support min queries cleanly — segment trees do, with the same O(log n) update and
          query structure.
        </p>
      </Definition>

      <ContentStep number={1} title="Min instead of sum">
        <Example
          title="SegmentTreeMin"
          output={`1
2`}
          caption="arr = [4, 1, 5, 2, 3]"
        >{`class SegmentTreeMin:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [float("inf")] * (2 * self.size)
        for i, v in enumerate(arr):
            self.tree[self.size + i] = v
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = min(self.tree[2 * i], self.tree[2 * i + 1])

    def update(self, i, val):
        i += self.size
        self.tree[i] = val
        i //= 2
        while i:
            self.tree[i] = min(self.tree[2 * i], self.tree[2 * i + 1])
            i //= 2

    def query(self, l, r):
        l += self.size
        r += self.size
        res = float("inf")
        while l <= r:
            if l % 2 == 1:
                res = min(res, self.tree[l])
                l += 1
            if r % 2 == 0:
                res = min(res, self.tree[r])
                r -= 1
            l //= 2
            r //= 2
        return res


st = SegmentTreeMin([4, 1, 5, 2, 3])
print(st.query(0, 4))   # min of whole array = 1
print(st.query(2, 4))   # min of [5,2,3] = 2`}</Example>
      </ContentStep>

      <ContentStep number={2} title="General pattern">
        <p>
          The segment tree template is: pick a <strong className="text-white">neutral element</strong> (
          <code className="font-mono text-sm">0</code> for sum, <code className="font-mono text-sm">inf</code> for
          min) and a <strong className="text-white">combine</strong> function. GCD, max, and bitwise OR use the same
          shape if combine is associative.
        </p>
        <Callout variant="insight">
          RMQ is static-friendly too (build once, no updates) — sparse table gives O(1) query. Segment trees shine
          when the array <em>changes</em> between queries.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Replace + with min at build, update, and query.',
          'Initialize leaves with inf for unused slots.',
          'Same query loop as the sum tree.',
          'Any associative combine works in this template.',
        ]}
      />
    </LessonArticle>
  )
}
