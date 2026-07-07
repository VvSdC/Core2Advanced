import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function MinimumSpanningTrees() {
  return (
    <LessonArticle>
      <Definition term="Minimum Spanning Tree (MST)">
        <p>
          A <strong className="text-white">spanning tree</strong> of a connected graph connects all vertices with no
          cycles — exactly V − 1 edges. A <strong className="text-white">minimum spanning tree</strong> is the
          spanning tree whose total edge weight is as small as possible.
        </p>
      </Definition>

      <ContentStep number={1} title="Spanning tree vs shortest path">
        <Flowchart
          title="Different goals"
          chart={`
flowchart TB
  SP["Shortest path — one route from A to B, min total cost"]
  MST["MST — connect ALL vertices, min total edge sum, no cycles"]

  SP --> MST
        `}
        />
        <p>
          MST is for wiring a network (power grid, LAN cables) where every node must be reachable and total wire
          length is minimized — not for point-to-point routing.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Properties">
        <Callout variant="info">
          A connected graph with V vertices has exactly <strong className="text-white">V − 1</strong> edges in any
          spanning tree. The MST is unique only if all edge weights are distinct; otherwise there may be ties.
        </Callout>
        <Example
          title="sample_weighted_graph"
          caption="Used in Kruskal and Prim lessons"
        >{`# Vertices 0—4, weighted edges:
# 0—1 (1), 0—3 (2), 1—2 (3), 2—4 (4), 3—4 (5)
edges = [(0, 1, 1), (0, 3, 2), (1, 2, 3), (2, 4, 4), (3, 4, 5)]
# MST weight = 1 + 2 + 3 + 4 = 10`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Two classic algorithms">
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          <li>
            <strong className="text-white">Kruskal</strong> — sort all edges, add cheapest that does not form a cycle
            (uses disjoint set union — next lessons).
          </li>
          <li>
            <strong className="text-white">Prim</strong> — grow one tree from a seed, always add the cheapest edge to
            an unvisited vertex (min-heap).
          </li>
        </ul>
        <p>Both run in O(E log V) with good data structures and produce the same MST weight.</p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'MST connects all vertices with V − 1 edges and minimum total weight.',
          'Different from shortest path — MST is about the whole network.',
          'Kruskal: global edge sorting + union-find.',
          'Prim: grow tree from one vertex with a priority queue.',
        ]}
      />
    </LessonArticle>
  )
}
