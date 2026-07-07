import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function KruskalMst() {
  return (
    <LessonArticle>
      <Definition term="Kruskal's Algorithm">
        <p>
          <strong className="text-white">Kruskal&apos;s algorithm</strong> builds an MST by sorting edges from
          cheapest to most expensive and adding each edge that does not create a cycle. A{' '}
          <strong className="text-white">union-find</strong> (disjoint set) structure detects cycles efficiently.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Kruskal's MST"
          chart={`
flowchart TB
  A["Sort edges by weight ascending"]
  B["Take next cheapest edge u—v"]
  C{"u and v in same set?"}
  D["Skip — would form cycle"]
  E["Add edge to MST, union sets"]
  F{"MST has V - 1 edges?"}
  G["Done"]

  A --> B
  B --> C
  C -->|Yes| D
  D --> B
  C -->|No| E
  E --> F
  F -->|No| B
  F -->|Yes| G
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Using UnionFind">
        <Callout variant="info">
          Kruskal needs the <strong className="text-white">UnionFind</strong> class from the previous lesson.{' '}
          <code className="font-mono text-sm">union(u, v)</code> returns <code className="font-mono text-sm">False</code>{' '}
          when u and v are already connected — that edge would form a cycle, so skip it.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Kruskal's MST">
        <Example
          title="kruskal"
          output={`10
[(0, 1, 1), (0, 3, 2), (1, 2, 3), (2, 4, 4)]`}
        >{`# UnionFind class — see Disjoint Set Union lesson

def kruskal(n, edges):
    edges = sorted(edges, key=lambda e: e[2])
    uf = UnionFind(n)
    mst = []
    total = 0

    for u, v, w in edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
            if len(mst) == n - 1:
                break
    return total, mst


edges = [(0, 1, 1), (0, 3, 2), (1, 2, 3), (2, 4, 4), (3, 4, 5)]
total, mst = kruskal(5, edges)
print(total)
print(mst)`}</Example>
        <Callout variant="insight">
          Time <strong className="text-white">O(E log E)</strong> for sorting + nearly O(1) amortized union-find per
          edge. Good when edges are easy to sort globally — sparse graphs especially.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Sort edges by weight; greedily add if endpoints are in different components.',
          'Union-find detects cycles — same set means adding edge closes a loop.',
          'Stop when MST has V − 1 edges.',
          'O(E log E) time dominated by sorting.',
        ]}
      />
    </LessonArticle>
  )
}
