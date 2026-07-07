import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToSegmentTrees() {
  return (
    <LessonArticle>
      <Definition term="Segment Tree">
        <p>
          A <strong className="text-white">segment tree</strong> is a binary tree stored in an array. Each internal
          node holds the result of combining its two children — usually <em>sum</em>, <em>min</em>, or{' '}
          <em>max</em> over a segment of the original array. It answers <strong className="text-white">range
          queries</strong> and supports <strong className="text-white">point updates</strong> in O(log n).
        </p>
      </Definition>

      <ContentStep number={1} title="The problem (again)">
        <p>
          You have an array that changes. You need to ask many questions like &quot;what is the sum (or min) from
          index l to r?&quot; Recomputing from scratch each time is O(n). A segment tree keeps both updates and
          queries at O(log n).
        </p>
        <Example
          title="naive_vs_tree"
          caption="Same motivation as Fenwick trees — different structure"
        >{`nums = [2, 1, 5, 3, 4]

# Naive range sum l..r: loop O(n) per query
# Segment tree: O(log n) per query after O(n) build`}</Example>
      </ContentStep>

      <ContentStep number={2} title="How it is laid out">
        <Flowchart
          title="Array-backed binary tree"
          chart={`
flowchart TB
  A["Original array at the leaves"]
  B["Parent = combine(left child, right child)"]
  C["Root = answer over entire array"]
  D["Query walks O log n nodes — skips whole subtrees outside range"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>
          Think of the tree as recursively splitting <code className="font-mono text-sm">[0, n)</code> in half until
          each leaf is one element. The root summarizes the full array; each query visits only O(log n) nodes.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Segment tree vs Fenwick tree">
        <Callout variant="info">
          <strong className="text-white">Fenwick tree</strong> — simpler code, great for prefix sums and frequency
          counts. Harder to generalize beyond additive structures.
          <br />
          <strong className="text-white">Segment tree</strong> — swap the combine function for min, max, gcd, or use{' '}
          <strong className="text-white">lazy propagation</strong> for range updates (add v to every element in
          [l, r]). More flexible, slightly more code.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Segment tree = array-backed tree; each node summarizes a segment.',
          'Point update and range query in O(log n).',
          'Combine function defines the query (sum, min, max, …).',
          'Use when Fenwick trees are not enough — min/max or lazy range updates.',
        ]}
      />
    </LessonArticle>
  )
}
