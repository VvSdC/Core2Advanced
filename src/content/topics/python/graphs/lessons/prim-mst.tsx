import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function PrimMst() {
  return (
    <LessonArticle>
      <Definition term="Prim's Algorithm">
        <p>
          <strong className="text-white">Prim&apos;s algorithm</strong> grows the MST from a single seed vertex. At
          each step it adds the cheapest edge that connects the growing tree to a vertex not yet in the tree — like
          Dijkstra, but minimizing edge weight to the frontier instead of path distance.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Prim's MST"
          chart={`
flowchart TB
  A["Start at any vertex, mark in MST"]
  B["Push all edges from MST to heap"]
  C["Pop cheapest edge to unvisited vertex"]
  D{"Target already in MST?"}
  E["Skip stale edge"]
  F["Add vertex and edge to MST"]
  G{"V - 1 edges added?"}
  H["Done"]

  A --> B
  B --> C
  C --> D
  D -->|Yes| E
  E --> C
  D -->|No| F
  F --> G
  G -->|No| B
  G -->|Yes| H
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="prim"
          output={`10
[(0, 1, 1), (0, 3, 2), (1, 2, 3), (2, 4, 4)]`}
        >{`import heapq
from collections import defaultdict

edges = [(0, 1, 1), (0, 3, 2), (1, 2, 3), (2, 4, 4), (3, 4, 5)]
graph = defaultdict(list)
for u, v, w in edges:
    graph[u].append((v, w))
    graph[v].append((u, w))


def prim(graph, n, start=0):
    in_mst = {start}
    heap = []
    for v, w in graph[start]:
        heapq.heappush(heap, (w, start, v))

    mst = []
    total = 0

    while heap and len(mst) < n - 1:
        w, u, v = heapq.heappop(heap)
        if v in in_mst:
            continue
        in_mst.add(v)
        mst.append((u, v, w))
        total += w
        for nb, weight in graph[v]:
            if nb not in in_mst:
                heapq.heappush(heap, (weight, v, nb))

    return total, mst

total, mst = prim(graph, 5)
print(total)
print(mst)`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Kruskal vs Prim">
        <Callout variant="insight">
          <strong className="text-white">Kruskal</strong> — edge-centric, good for sparse graphs given as edge lists.
          <br />
          <strong className="text-white">Prim</strong> — vertex-centric, good with adjacency lists and dense graphs.
          Both are O(E log V) with a binary heap.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Grow MST from one vertex — always pick cheapest edge to an outside vertex.',
          'Min-heap stores frontier edges; skip if target already in MST.',
          'Similar spirit to Dijkstra but adds edges, not relaxes distances.',
          'O(E log V) with heapq — same MST weight as Kruskal.',
        ]}
      />
    </LessonArticle>
  )
}
