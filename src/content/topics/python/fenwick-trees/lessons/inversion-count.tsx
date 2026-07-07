import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function InversionCount() {
  return (
    <LessonArticle>
      <Definition term="Inversion Count">
        <p>
          An <strong className="text-white">inversion</strong> is a pair (i, j) where i &lt; j but{' '}
          <code className="font-mono text-sm">nums[i] &gt; nums[j]</code>. Nested loops are O(n²). A Fenwick tree
          counts inversions in <strong className="text-white">O(n log n)</strong> by tracking which values have
          already appeared to the left.
        </p>
      </Definition>

      <ContentStep number={1} title="The trick">
        <Flowchart
          title="Scan left to right"
          chart={`
flowchart TB
  A["Map each value to a rank 1..k"]
  B["Walk the array left to right"]
  C["Inversions += seen_so_far - count of ranks <= current"]
  D["update(rank, 1) — mark value as seen"]

  A --> B
  B --> C
  C --> D
  D --> B
        `}
        />
        <p>
          The BIT stores <em>how many times</em> each rank has appeared. Before adding the current value, ask: how
          many earlier values are greater? That is{' '}
          <code className="font-mono text-sm">i - prefix_sum(rank)</code> at step i.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="inversion_count"
          output={`3`}
          caption="[2, 4, 1, 3] — inversions: (2,1), (4,1), (4,3)"
        >{`def rank_map(nums):
    sorted_unique = sorted(set(nums))
    return {v: i + 1 for i, v in enumerate(sorted_unique)}


class FenwickTree:
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


def inversion_count(nums):
    ranks = rank_map(nums)
    ft = FenwickTree(len(ranks))
    inv = 0
    for i, x in enumerate(nums):
        r = ranks[x]
        inv += i - ft.prefix_sum(r)
        ft.update(r, 1)
    return inv

print(inversion_count([2, 4, 1, 3]))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Coordinate compression">
        <Callout variant="info">
          Values can be large (e.g. 10⁹) but there are only n of them — map to ranks 1…n so the Fenwick tree stays
          size O(n). This <strong className="text-white">coordinate compression</strong> step appears in many BIT
          counting problems.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'BIT stores frequencies of ranks, not raw values.',
          'At index i: inversions += i - prefix_sum(rank(x)).',
          'Then update(rank(x), 1).',
          'Compress values to ranks first when numbers are large.',
        ]}
      />
    </LessonArticle>
  )
}
