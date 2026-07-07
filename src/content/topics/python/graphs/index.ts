import type { SubTopic } from '../../../types'
import { DisjointSetUnion } from './lessons/disjoint-set-union'
import { DijkstraShortestPath } from './lessons/dijkstra-shortest-path'
import { GraphBfs } from './lessons/graph-bfs'
import { GraphDfs } from './lessons/graph-dfs'
import { GraphRepresentation } from './lessons/graph-representation'
import { IntroductionToGraphs } from './lessons/introduction-to-graphs'
import { KruskalMst } from './lessons/kruskal-mst'
import { MinimumSpanningTrees } from './lessons/minimum-spanning-trees'
import { PrimMst } from './lessons/prim-mst'
import { ShortestPathUnweighted } from './lessons/shortest-path-unweighted'

export const graphsSubTopic: SubTopic = {
  id: 'graphs',
  title: 'Graphs',
  description:
    'Vertices and edges, adjacency representations, BFS/DFS, shortest paths, and minimum spanning trees.',
  lessonSections: [
    {
      id: 'data-structure',
      title: 'Data Structure',
      lessons: [
        {
          id: 'introduction-to-graphs',
          title: 'Introduction to Graphs',
          description: 'Vertices, edges, directed vs undirected, weighted graphs.',
          readTime: '10 min',
          component: IntroductionToGraphs,
        },
        {
          id: 'graph-representation',
          title: 'Graph Representation',
          description: 'Adjacency list vs adjacency matrix — tradeoffs and Python code.',
          readTime: '11 min',
          component: GraphRepresentation,
        },
      ],
    },
    {
      id: 'traversal',
      title: 'Traversal',
      lessons: [
        {
          id: 'graph-bfs',
          title: 'BFS on Graphs',
          description: 'Level-by-level exploration with a queue and visited set.',
          readTime: '11 min',
          component: GraphBfs,
        },
        {
          id: 'graph-dfs',
          title: 'DFS on Graphs',
          description: 'Go deep first — recursive, iterative, and connected components.',
          readTime: '11 min',
          component: GraphDfs,
        },
      ],
    },
    {
      id: 'shortest-path',
      title: 'Shortest Path',
      lessons: [
        {
          id: 'shortest-path-unweighted',
          title: 'Shortest Path — Unweighted',
          description: 'BFS gives shortest hop-count in unweighted graphs.',
          readTime: '10 min',
          component: ShortestPathUnweighted,
        },
        {
          id: 'dijkstra-shortest-path',
          title: "Dijkstra's Algorithm",
          description: 'Shortest weighted paths with a min-heap — non-negative edges.',
          readTime: '13 min',
          component: DijkstraShortestPath,
        },
      ],
    },
    {
      id: 'spanning-trees',
      title: 'Spanning Trees',
      lessons: [
        {
          id: 'minimum-spanning-trees',
          title: 'Minimum Spanning Trees',
          description: 'What an MST is and when you need one.',
          readTime: '9 min',
          component: MinimumSpanningTrees,
        },
        {
          id: 'disjoint-set-union',
          title: 'Disjoint Set Union',
          description: 'Union-find with path compression — detect cycles for Kruskal.',
          readTime: '11 min',
          component: DisjointSetUnion,
        },
        {
          id: 'kruskal-mst',
          title: "Kruskal's Algorithm",
          description: 'Sort edges by weight, union-find to avoid cycles.',
          readTime: '12 min',
          component: KruskalMst,
        },
        {
          id: 'prim-mst',
          title: "Prim's Algorithm",
          description: 'Grow the MST from a seed vertex with a min-heap.',
          readTime: '12 min',
          component: PrimMst,
        },
      ],
    },
  ],
}
