import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function DisjointSetUnion() {
  return (
    <LessonArticle>
      <Definition term="Disjoint Set Union (DSU)">
        <p>
          A <strong className="text-white">disjoint set union</strong> structure (also called{' '}
          <strong className="text-white">union-find</strong>) tracks a collection of non-overlapping sets. It
          supports two operations fast: <strong className="text-white">find</strong> (which set is x in?) and{' '}
          <strong className="text-white">union</strong> (merge two sets).
        </p>
        <p>
          Kruskal&apos;s MST algorithm uses DSU to detect cycles — if two endpoints of an edge are already in the same
          set, adding that edge would close a loop.
        </p>
      </Definition>

      <ContentStep number={1} title="The idea">
        <Flowchart
          title="Find and union"
          chart={`
flowchart TB
  A["Each element starts in its own set"]
  B["find(x) — follow parent pointers to root"]
  C["union(x, y) — attach one root under the other"]
  D["Same root → already connected"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>
          Store a <code className="font-mono text-sm">parent</code> array: each node points to its parent; the root
          of a set points to itself. Two nodes are in the same set when they share the same root.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Basic implementation">
        <Example
          title="UnionFind"
        >{`class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))   # each node is its own parent
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False   # already in the same set
        # union by rank — attach shorter tree under taller
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Path compression">
        <p>
          During <code className="font-mono text-sm">find</code>, point every node along the path directly to the
          root. Future lookups on those nodes become O(1).
        </p>
        <Example
          title="find_with_path_compression"
          caption="Before: 4→3→2→1→0. After find(4): 4→0, 3→0, 2→0, 1→0"
        >{`# self.parent[x] = self.find(self.parent[x])  # in find()`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Union by rank">
        <p>
          Always attach the shorter tree under the root of the taller tree. Keeps trees shallow so{' '}
          <code className="font-mono text-sm">find</code> stays fast.{' '}
          <code className="font-mono text-sm">rank</code> is an upper bound on tree height, not exact size.
        </p>
      </ContentStep>

      <ContentStep number={5} title="Example — connectivity">
        <Example
          title="connected"
          output={`True
False
True`}
        >{`uf = UnionFind(5)
uf.union(0, 1)
uf.union(2, 3)

print(uf.find(0) == uf.find(1))   # True — same set
print(uf.find(1) == uf.find(2))   # False — different sets

uf.union(1, 2)                    # merge {0,1} and {2,3}
print(uf.find(0) == uf.find(3))   # True`}</Example>
        <Callout variant="insight">
          Amortized time per operation is nearly <strong className="text-white">O(1)</strong> (technically O(α(n)),
          inverse Ackermann — effectively constant). Space <strong className="text-white">O(n)</strong> for parent and
          rank arrays.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'find(x) returns the set root; union(x, y) merges two sets.',
          'Path compression in find flattens trees for speed.',
          'Union by rank keeps trees shallow.',
          'Same root after find → same set → adding an edge between them forms a cycle (used in Kruskal).',
        ]}
      />
    </LessonArticle>
  )
}
