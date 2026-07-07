import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToGraphs() {
  return (
    <LessonArticle>
      <Definition term="Graph">
        <p>
          A <strong className="text-white">graph</strong> is a set of <strong className="text-white">vertices</strong>{' '}
          (nodes) connected by <strong className="text-white">edges</strong>. Unlike trees, graphs can have cycles
          and multiple paths between the same pair of nodes.
        </p>
        <p>
          Graphs model networks: roads, social connections, dependencies, web links, and circuit boards.
        </p>
      </Definition>

      <ContentStep number={1} title="Directed vs undirected">
        <Flowchart
          title="Edge direction"
          chart={`
flowchart TB
  U["Undirected — A—B same as B—A"]
  D["Directed — A→B only; no automatic B→A"]

  U --> D
        `}
        />
        <Example
          title="examples"
          caption="Twitter follow = directed; Facebook friendship = undirected (mutual)"
        >{`# Undirected: (0, 1) means 0 and 1 are connected both ways
# Directed: (0, 1) means edge from 0 to 1 only`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Weighted vs unweighted">
        <p>
          In a <strong className="text-white">weighted</strong> graph, each edge has a cost (distance, time, bandwidth).
          In an <strong className="text-white">unweighted</strong> graph, every edge counts as one step — BFS finds
          shortest hop-count paths.
        </p>
        <Callout variant="info">
          A <strong className="text-white">path</strong> is a sequence of edges connecting two vertices. A{' '}
          <strong className="text-white">cycle</strong> is a path that starts and ends at the same vertex. A{' '}
          <strong className="text-white">connected</strong> undirected graph has a path between every pair of vertices.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Sample graph">
        <Example
          title="sample_graph"
          caption="5 vertices, undirected — used in later lessons"
        >{`#     0 --- 1 --- 2
#     |           |
#     3 --------- 4

edges = [(0, 1), (1, 2), (2, 4), (4, 3), (3, 0)]`}</Example>
      </ContentStep>

      <ContentStep number={4} title="What comes next">
        <p>Lessons build from representation → traversal → shortest paths → spanning trees:</p>
        <ol className="list-decimal space-y-1 pl-5 text-gray-300">
          <li>How to store a graph (adjacency list / matrix)</li>
          <li>BFS and DFS with a visited set</li>
          <li>Shortest paths — BFS (unweighted), Dijkstra (weighted)</li>
          <li>Minimum spanning trees — Kruskal and Prim</li>
        </ol>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Graph = vertices + edges; trees are acyclic connected graphs.',
          'Directed edges have direction; undirected edges go both ways.',
          'Weighted edges have costs; unweighted edges count as one hop.',
          'Cycles and multiple paths are normal — unlike trees.',
        ]}
      />
    </LessonArticle>
  )
}
