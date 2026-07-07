import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function GraphBfs() {
  return (
    <LessonArticle>
      <Definition term="BFS on Graphs">
        <p>
          <strong className="text-white">BFS</strong> explores a graph level by level from a start vertex. Unlike
          trees, graphs can have cycles — you need a <strong className="text-white">visited</strong> set so you never
          enqueue the same node twice.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Graph BFS"
          chart={`
flowchart TB
  A["Mark start visited, enqueue it"]
  B{"Queue empty?"}
  C["Dequeue vertex"]
  D["Process vertex"]
  E["For each unvisited neighbor: mark visited, enqueue"]
  F["Done"]

  A --> B
  B -->|No| C
  C --> D
  D --> E
  E --> B
  B -->|Yes| F
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="bfs"
          output={`[0, 1, 3, 2, 4]`}
        >{`from collections import defaultdict, deque

edges = [(0, 1), (1, 2), (2, 4), (4, 3), (3, 0)]
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)


def bfs(graph, start):
    visited = {start}
    order = []
    q = deque([start])
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)
    return order

print(bfs(graph, 0))`}</Example>
        <p>
          Mark visited <em>when enqueueing</em>, not when dequeuing — otherwise the same neighbor can be added to the
          queue multiple times.
        </p>
      </ContentStep>

      <ContentStep number={3} title="BFS vs tree BFS">
        <Callout variant="insight">
          Tree BFS needs no visited set (each node has one parent). Graph BFS <em>must</em> track visited nodes
          because edges can form cycles. Time <strong className="text-white">O(V + E)</strong>, space{' '}
          <strong className="text-white">O(V)</strong>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Use a queue + visited set — mark visited when enqueueing.',
          'BFS order = increasing distance (in hops) from the start.',
          'O(V + E) time — each vertex and edge touched once.',
          'Essential for unweighted shortest paths and level-order problems.',
        ]}
      />
    </LessonArticle>
  )
}
