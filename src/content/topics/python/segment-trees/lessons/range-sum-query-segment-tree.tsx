import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function RangeSumQuerySegmentTree() {
  return (
    <LessonArticle>
      <Definition term="Range Sum Query">
        <p>
          The classic segment tree use case: start with an array, handle many{' '}
          <strong className="text-white">update index i</strong> and{' '}
          <strong className="text-white">sum from l to r</strong> operations. Same problem as the Fenwick tree range
          sum lesson — solved here with a segment tree.
        </p>
      </Definition>

      <ContentStep number={1} title="Mutable array wrapper">
        <Example
          title="range_sum_mutable"
          output={`8
11`}
          caption="nums = [3,1,4,2], sum [0,2] then set index 2 to 7"
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


class NumArray:
    def __init__(self, nums):
        self.st = SegmentTreeSum(nums)

    def update(self, index, val):
        self.st.update(index, val)

    def sum_range(self, left, right):
        return self.st.query(left, right)


arr = NumArray([3, 1, 4, 2])
print(arr.sum_range(0, 2))   # 3+1+4 = 8
arr.update(2, 7)
print(arr.sum_range(0, 2))   # 3+1+7 = 11`}</Example>
      </ContentStep>

      <ContentStep number={2} title="When segment tree vs Fenwick">
        <Callout variant="insight">
          For <em>sum only</em> with point updates, a Fenwick tree is shorter. Reach for a segment tree when you
          need min/max, non-invertible combines, or lazy range updates in the next lessons.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'NumArray wraps SegmentTreeSum for update + sum_range.',
          'Point update sets one leaf and rebubbles sums.',
          'Inclusive range query on the same tree from the basic lesson.',
          'Fenwick tree is enough for sum-only; segment tree generalizes further.',
        ]}
      />
    </LessonArticle>
  )
}
