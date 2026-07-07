import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function LazyPropagationRangeAdd() {
  return (
    <LessonArticle>
      <Definition term="Lazy Propagation">
        <p>
          Point updates are not enough when the problem says: <strong className="text-white">add v to every element
          in [l, r]</strong>. Updating each index one by one is O(n). <strong className="text-white">Lazy
          propagation</strong> stores a pending addition on a node (&quot;add 5 to this whole segment later&quot;) and
          pushes it down only when a query or a narrower update needs the children.
        </p>
      </Definition>

      <ContentStep number={1} title="The lazy idea">
        <Flowchart
          title="Defer work with a lazy tag"
          chart={`
flowchart TB
  A["range_add(l, r, v): tag nodes covering the range"]
  B["Do not update every leaf at once"]
  C["Before query or child update: push tag to children"]
  D["Apply to node sum: tag * segment length"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Range add + range sum">
        <Example
          title="lazy_segment_tree"
          output={`15
21`}
          caption="Start [1,2,3,4,5], add 2 to [1,3], sum entire array"
        >{`class LazySegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [0] * (2 * self.size)
        self.lazy = [0] * (2 * self.size)
        for i, v in enumerate(arr):
            self.tree[self.size + i] = v
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]

    def _push(self, i, seg_len):
        if self.lazy[i]:
            self.tree[i] += self.lazy[i] * seg_len
            if i < self.size:
                self.lazy[2 * i] += self.lazy[i]
                self.lazy[2 * i + 1] += self.lazy[i]
            self.lazy[i] = 0

    def _range_add(self, l, r, val, i, seg_l, seg_r):
        self._push(i, seg_r - seg_l + 1)
        if r < seg_l or l > seg_r:
            return
        if l <= seg_l and seg_r <= r:
            self.lazy[i] += val
            self._push(i, seg_r - seg_l + 1)
            return
        mid = (seg_l + seg_r) // 2
        self._range_add(l, r, val, 2 * i, seg_l, mid)
        self._range_add(l, r, val, 2 * i + 1, mid + 1, seg_r)
        self._push(2 * i, mid - seg_l + 1)
        self._push(2 * i + 1, seg_r - mid)
        self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]

    def range_add(self, l, r, val):
        self._range_add(l, r, val, 1, 0, self.size - 1)

    def _query(self, l, r, i, seg_l, seg_r):
        self._push(i, seg_r - seg_l + 1)
        if r < seg_l or l > seg_r:
            return 0
        if l <= seg_l and seg_r <= r:
            return self.tree[i]
        mid = (seg_l + seg_r) // 2
        return self._query(l, r, 2 * i, seg_l, mid) + self._query(
            l, r, 2 * i + 1, mid + 1, seg_r
        )

    def query(self, l, r):
        return self._query(l, r, 1, 0, self.size - 1)


st = LazySegmentTree([1, 2, 3, 4, 5])
print(st.query(0, 4))     # 15
st.range_add(1, 3, 2)     # → [1, 4, 5, 6, 5]
print(st.query(0, 4))     # 21`}</Example>
        <p>
          This version uses recursive DFS on segment ranges{' '}
          <code className="font-mono text-sm">[0, size - 1]</code>. The iterative sum tree from the basic lesson is
          simpler; lazy propagation usually needs the recursive shape to tag subtrees cleanly.
        </p>
      </ContentStep>

      <ContentStep number={3} title="When you need lazy">
        <Callout variant="insight">
          Use lazy propagation for <strong className="text-white">range updates</strong> paired with range queries
          (range add + range sum, range assign + range min, etc.). Both operations stay O(log n). This is where
          segment trees clearly beat Fenwick trees.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'lazy[i] = pending addition for the whole segment at node i.',
          'push() applies lazy to tree[i] and passes it to children.',
          'range_add tags nodes; query pushes before reading.',
          'Range update + range query — the main reason for lazy segment trees.',
        ]}
      />
    </LessonArticle>
  )
}
