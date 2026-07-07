import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function GraphRepresentation() {
  return (
    <LessonArticle>
      <Definition term="Graph Representation">
        <p>
          Two standard ways to store a graph in memory: <strong className="text-white">adjacency list</strong> (each
          vertex → list of neighbors) and <strong className="text-white">adjacency matrix</strong> (V×V grid of 0/1 or
          weights).
        </p>
      </Definition>

      <ContentStep number={1} title="Adjacency list">
        <Example
          title="adjacency_list"
          output={`[1, 3]
[0, 2]
[1, 4]
[0, 4]
[2, 3]`}
        >{`from collections import defaultdict

edges = [(0, 1), (1, 2), (2, 4), (4, 3), (3, 0)]

# Undirected — add both directions
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)

for node in sorted(graph):
    print(graph[node])`}</Example>
        <p>
          Space <strong className="text-white">O(V + E)</strong>. Iterating neighbors of a vertex is O(degree). This
          is the default for sparse graphs and most interview problems.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Adjacency matrix">
        <Example
          title="adjacency_matrix"
          output={`[[0, 1, 0, 1, 0], [1, 0, 1, 0, 0], ...]`}
        >{`n = 5
matrix = [[0] * n for _ in range(n)]

for u, v in edges:
    matrix[u][v] = 1
    matrix[v][u] = 1   # undirected

print(matrix[0])  # row 0: neighbors of vertex 0`}</Example>
        <p>
          Space <strong className="text-white">O(V²)</strong>. Checking if edge (u, v) exists is O(1). Good for
          dense graphs or when you need fast edge lookups.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Weighted adjacency list">
        <Example
          title="weighted_graph"
        >{`# (from, to, weight)
weighted_edges = [(0, 1, 4), (0, 3, 2), (1, 2, 1), (2, 4, 5), (3, 4, 3)]

graph = defaultdict(list)
for u, v, w in weighted_edges:
    graph[u].append((v, w))
    graph[v].append((u, w))   # undirected`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Which to use">
        <Callout variant="insight">
          <strong className="text-white">Adjacency list</strong> — sparse graphs, BFS/DFS, Dijkstra, most coding
          problems.
          <br />
          <strong className="text-white">Adjacency matrix</strong> — dense graphs, Floyd-Warshall, quick “is there an
          edge?” checks.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Adjacency list: dict of vertex → neighbors — O(V + E) space.',
          'Adjacency matrix: V×V grid — O(V²) space, O(1) edge lookup.',
          'For weighted graphs, store (neighbor, weight) tuples in the list.',
          'Default to adjacency list unless the problem is dense or needs matrix ops.',
        ]}
      />
    </LessonArticle>
  )
}
