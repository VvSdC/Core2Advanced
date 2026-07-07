import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToFenwickTrees() {
  return (
    <LessonArticle>
      <Definition term="Fenwick Tree (Binary Indexed Tree)">
        <p>
          A <strong className="text-white">Fenwick tree</strong> stores an array of numbers and supports two
          operations fast:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-gray-300">
          <li>
            <strong className="text-white">Update</strong> — add a value at one index (or change it).
          </li>
          <li>
            <strong className="text-white">Prefix sum</strong> — get the sum of elements from index 0 through i.
          </li>
        </ol>
        <p>Both run in <strong className="text-white">O(log n)</strong> time.</p>
      </Definition>

      <ContentStep number={1} title="Why not a plain prefix array?">
        <Example
          title="the_tradeoff"
          caption="Prefix array: fast sum, slow update"
        >{`nums = [3, 1, 4, 2]

# Prefix sums — sum[0..i] in O(1)
prefix = [0, 3, 4, 8, 10]

# Change nums[1] from 1 to 5:
# Must rebuild prefix[2], prefix[3], prefix[4] — O(n)`}</Example>
        <p>
          A prefix array gives O(1) range sums but O(n) updates. If values change often, that is too slow. A
          Fenwick tree keeps <strong className="text-white">both</strong> update and prefix sum at O(log n).
        </p>
      </ContentStep>

      <ContentStep number={2} title="The core idea (no proof needed)">
        <Flowchart
          title="Responsibility ranges"
          chart={`
flowchart TB
  A["Each tree index 'covers' a range of array positions"]
  B["update(i): add delta along a short path of responsible indices"]
  C["prefix_sum(i): add values along a short path going downward"]
  D["Only O log n indices touched per operation"]

  A --> B
  A --> C
  B --> D
  C --> D
        `}
        />
        <p>
          Think of the Fenwick tree as a bookkeeping trick: instead of storing the array directly, it stores partial
          sums in a helper array <code className="font-mono text-sm">tree</code>. Each position in{' '}
          <code className="font-mono text-sm">tree</code> is responsible for a block of the original array. Updates
          and queries hop between responsible blocks using a simple rule — the{' '}
          <strong className="text-white">lowbit</strong>.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Lowbit in one line">
        <Callout variant="info">
          <code className="font-mono text-sm">lowbit(i) = i &amp; -i</code> — the value of the{' '}
          <em>rightmost 1-bit</em> in i. Example: lowbit(12) = lowbit(1100₂) = 4. You do not need to derive why it
          works — just use it in the two loops in the next lesson.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="1-indexed convention">
        <p>
          Fenwick trees are almost always <strong className="text-white">1-indexed</strong> (indices 1…n). Index 0
          is unused. When your problem uses 0-indexed arrays, add 1 when calling the tree.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Fenwick tree = fast point update + fast prefix sum.',
          'Beats prefix arrays when updates are frequent.',
          'Uses a helper tree[] array and lowbit jumps — O(log n) per op.',
          'Use 1-based indexing in implementations.',
        ]}
      />
    </LessonArticle>
  )
}
