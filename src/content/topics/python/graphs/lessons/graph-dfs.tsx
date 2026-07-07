import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function GraphDfs() {
  return (
    <LessonArticle>
      <Definition term="DFS on Graphs">
        <p>
          <strong className="text-white">DFS</strong> on a graph goes as deep as possible along one path before
          backtracking. Like BFS, you need a <strong className="text-white">visited</strong> set to handle cycles.
        </p>
      </Definition>

      <ContentStep number={1} title="Recursive DFS">
        <Flowchart
          title="Graph DFS"
          chart={`
flowchart TB
  A["Mark current visited"]
  B["Process vertex"]
  C["For each unvisited neighbor"]
  D["DFS on neighbor"]
  E["Backtrack"]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> C
        `}
        />
        <Example
          title="dfs_recursive"
          output={`[0, 1, 2, 4, 3]`}
        >{`from collections import defaultdict

edges = [(0, 1), (1, 2), (2, 4), (4, 3), (3, 0)]
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)


def dfs(graph, start):
    visited = set()
    order = []

    def explore(node):
        visited.add(node)
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                explore(neighbor)

    explore(start)
    return order

print(dfs(graph, 0))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Iterative DFS with a stack">
        <Example
          title="dfs_iterative"
          output={`[0, 3, 4, 2, 1]`}
        >{`def dfs_iterative(graph, start):
    visited = set()
    order = []
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
    return order

print(dfs_iterative(graph, 0))`}</Example>
        <p>
          Order differs from recursive DFS depending on neighbor order and stack push order — both are valid DFS
          traversals.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Connected components">
        <Example
          title="count_components"
          output={`2`}
          caption="Graph with two disconnected pieces"
        >{`def count_components(graph, n):
    visited = set()
    components = 0

    def explore(node):
        visited.add(node)
        for nb in graph[node]:
            if nb not in visited:
                explore(nb)

    for node in range(n):
        if node not in visited:
            explore(node)
            components += 1
    return components

# 0—1    2—3  (two components)
g = defaultdict(list)
for u, v in [(0, 1), (2, 3)]:
    g[u].append(v)
    g[v].append(u)
print(count_components(g, 4))`}</Example>
        <Callout variant="insight">
          Run DFS (or BFS) from every unvisited vertex — each launch finds one connected component. Time{' '}
          <strong className="text-white">O(V + E)</strong>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Visited set is mandatory — graphs have cycles.',
          'Recursive DFS: explore neighbor before backtracking.',
          'Iterative DFS: stack instead of call stack.',
          'Outer loop over all vertices finds connected components.',
        ]}
      />
    </LessonArticle>
  )
}
