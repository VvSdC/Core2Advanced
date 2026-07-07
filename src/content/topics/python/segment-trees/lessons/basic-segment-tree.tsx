import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BasicSegmentTree() {
  return (
    <LessonArticle>
      <Definition term="Basic Segment Tree (Sum)">
        <p>
          We use an iterative, array-based tree. Size is rounded up to the next power of two; leaves sit at indices{' '}
          <code className="font-mono text-sm">size .. size + n - 1</code>. Internal node i combines children{' '}
          <code className="font-mono text-sm">2*i</code> and <code className="font-mono text-sm">2*i + 1</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="Build bottom-up">
        <Flowchart
          title="Leaves first, then parents"
          chart={`
flowchart TB
  A["Copy array into leaf slots"]
  B["For i from size-1 down to 1: tree[i] = tree[2i] + tree[2i+1]"]
  C["tree[1] is total sum"]

  A --> B
  B --> C
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Full implementation">
        <Example
          title="SegmentTreeSum"
          output={`11
13
7`}
          caption="Build [2,1,5,3,4], query [1,3], update index 2 to 7, query again"
        >{`class SegmentTreeSum:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [0] * (2 * self.size)
        for i, v in enumerate(arr):
            self.tree[self.size + i] = v
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]

    def update(self, i, val):
        i += self.size
        self.tree[i] = val
        i //= 2
        while i:
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
            i //= 2

    def query(self, l, r):
        """Sum of arr[l..r] inclusive."""
        l += self.size
        r += self.size
        res = 0
        while l <= r:
            if l % 2 == 1:
                res += self.tree[l]
                l += 1
            if r % 2 == 0:
                res += self.tree[r]
                r -= 1
            l //= 2
            r //= 2
        return res


st = SegmentTreeSum([2, 1, 5, 3, 4])
print(st.query(0, 3))    # 2+1+5+3 = 11
st.update(2, 7)          # index 2: 5 → 7
print(st.query(0, 3))    # 2+1+7+3 = 13
print(st.query(2, 2))    # 7`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Reading the query loop">
        <p>
          Move <code className="font-mono text-sm">l</code> and <code className="font-mono text-sm">r</code> to leaf
          level, then climb. If <code className="font-mono text-sm">l</code> is a right child, include it and step
          right. If <code className="font-mono text-sm">r</code> is a left child, include it and step left. Then both
          indices move to their parents.
        </p>
        <Callout variant="insight">
          Build O(n), update O(log n), query O(log n), space O(n). The same skeleton works for min/max — only the
          combine line changes.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Leaves at index size + i; internal nodes sum children.',
          'update(i, val): set leaf, bubble up summing parents.',
          'query(l, r): inclusive range, iterative climb from leaves.',
          'Round size up to next power of two for a complete binary tree.',
        ]}
      />
    </LessonArticle>
  )
}
