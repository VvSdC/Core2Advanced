import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ShortestPathUnweighted() {
  return (
    <LessonArticle>
      <Definition term="Shortest Path — Unweighted">
        <p>
          In an <strong className="text-white">unweighted</strong> graph, the shortest path between two vertices is
          the one with the fewest edges. <strong className="text-white">BFS</strong> finds it naturally — the first
          time you reach the target, you arrived via the minimum number of hops.
        </p>
      </Definition>

      <ContentStep number={1} title="Why BFS works">
        <Flowchart
          title="BFS expands by distance"
          chart={`
flowchart TB
  A["Distance 0: start"]
  B["Distance 1: direct neighbors"]
  C["Distance 2: neighbors of neighbors"]
  D["First time we reach target = shortest hop count"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>
          BFS visits all nodes at distance d before any node at distance d + 1. So the first visit to the target is
          guaranteed shortest.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Distance map">
        <Example
          title="shortest_path_length"
          output={`2`}
          caption="Shortest path 0 → 2 is 0—1—2 (2 edges)"
        >{`from collections import defaultdict, deque

edges = [(0, 1), (1, 2), (2, 4), (4, 3), (3, 0)]
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)


def shortest_path_length(graph, start, target):
    if start == target:
        return 0
    visited = {start}
    q = deque([(start, 0)])
    while q:
        node, dist = q.popleft()
        for neighbor in graph[node]:
            if neighbor == target:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                q.append((neighbor, dist + 1))
    return -1   # no path

print(shortest_path_length(graph, 0, 2))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Reconstructing the path">
        <Example
          title="shortest_path"
          output={`[0, 1, 2]`}
        >{`def shortest_path(graph, start, target):
    if start == target:
        return [start]
    visited = {start}
    q = deque([start])
    parent = {start: None}

    while q:
        node = q.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = node
                if neighbor == target:
                    # Reconstruct path
                    path = []
                    cur = target
                    while cur is not None:
                        path.append(cur)
                        cur = parent[cur]
                    return path[::-1]
                q.append(neighbor)
    return []

print(shortest_path(graph, 0, 2))`}</Example>
        <Callout variant="insight">
          Store a <strong className="text-white">parent</strong> map during BFS to rebuild the path. Time and space{' '}
          <strong className="text-white">O(V + E)</strong>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Unweighted shortest path = fewest edges = BFS.',
          'Track distance or parent while BFS runs.',
          'First arrival at target is optimal — no need to revisit.',
          'Returns -1 or [] if no path exists.',
        ]}
      />
    </LessonArticle>
  )
}
