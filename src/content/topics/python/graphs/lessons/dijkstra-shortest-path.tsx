import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function DijkstraShortestPath() {
  return (
    <LessonArticle>
      <Definition term="Dijkstra's Algorithm">
        <p>
          <strong className="text-white">Dijkstra&apos;s algorithm</strong> finds shortest paths from a single source
          in a graph with <strong className="text-white">non-negative</strong> edge weights. It always processes the
          unvisited vertex with the smallest known distance next — a greedy choice that works when weights are ≥ 0.
        </p>
      </Definition>

      <ContentStep number={1} title="The idea">
        <Flowchart
          title="Dijkstra — greedy by distance"
          chart={`
flowchart TB
  A["dist[start] = 0, others = infinity"]
  B["Pick unvisited vertex with smallest dist"]
  C["Relax each neighbor: dist[v] = min(dist[v], dist[u] + weight)"]
  D{"All vertices processed?"}
  E["Done"]

  A --> B
  B --> C
  C --> D
  D -->|No| B
  D -->|Yes| E
        `}
        />
        <p>
          <strong className="text-white">Relax</strong> an edge (u, v, w): if going through u is cheaper than the
          current best to v, update <code className="font-mono text-sm">dist[v]</code>.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Implementation with heapq">
        <Example
          title="dijkstra"
          output={`{0: 0, 1: 4, 2: 5, 3: 2, 4: 5}`}
          caption="Shortest distances from vertex 0"
        >{`import heapq
from collections import defaultdict

# (u, v, weight) — undirected
edges = [(0, 1, 4), (0, 3, 2), (1, 2, 1), (2, 4, 5), (3, 4, 3)]
graph = defaultdict(list)
for u, v, w in edges:
    graph[u].append((v, w))
    graph[v].append((u, w))


def dijkstra(graph, start):
    dist = {start: 0}
    heap = [(0, start)]   # (distance, vertex)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float("inf")):
            continue   # stale entry
        for v, w in graph[u]:
            new_dist = d + w
            if new_dist < dist.get(v, float("inf")):
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))
    return dist

print(dijkstra(graph, 0))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Why a min-heap">
        <p>
          The heap always gives the vertex with the smallest tentative distance. The{' '}
          <code className="font-mono text-sm">if d &gt; dist[u]</code> skip handles duplicate heap entries after a
          better path is found.
        </p>
        <Callout variant="insight">
          Time <strong className="text-white">O((V + E) log V)</strong> with a binary heap. Does <em>not</em> work with
          negative edges — use Bellman-Ford for that. BFS is Dijkstra with all weights = 1.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Greedy: always settle the closest unvisited vertex next.',
          'Relax neighbors: dist[v] = min(dist[v], dist[u] + weight).',
          'Use heapq for the priority queue — O((V + E) log V).',
          'Non-negative weights only; negative edges need Bellman-Ford.',
        ]}
      />
    </LessonArticle>
  )
}
