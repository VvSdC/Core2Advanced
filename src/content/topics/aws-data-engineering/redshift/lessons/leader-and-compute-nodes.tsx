import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LeaderAndComputeNodes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Redshift is MPP — one leader coordinates many compute nodes">
        Every Redshift cluster (provisioned) has exactly one <strong className="text-white">leader node</strong>{' '}
        and one or more <strong className="text-white">compute nodes</strong>. The leader parses SQL, builds
        plans, and aggregates results; compute nodes scan local slices, hash/join in parallel, and return
        partial results. Data engineering success depends on how rows are distributed across those slices.
      </Callout>

      <Definition term="Leader node">
        <p>
          The leader is the <strong className="text-white">query coordinator</strong> — it accepts client
          connections (JDBC/ODBC, Data API), parses and optimizes SQL, generates execution plans, and
          orchestrates work across compute nodes. It does not store user table data at scale; it holds
          metadata, system tables, and query state. If the leader is overloaded, you see connection queueing
          even when compute nodes have spare CPU.
        </p>
      </Definition>

      <Definition term="Compute node">
        <p>
          Each compute node owns a <strong className="text-white">slice</strong> of every table row (based on
          distribution style). Nodes run scan, filter, aggregate, sort, and join steps in parallel. More nodes
          mean more parallel I/O and CPU — but only if data is distributed to avoid massive{' '}
          <span className="font-mono text-sm">DS_DIST_ALL</span> or{' '}
          <span className="font-mono text-sm">DS_BCAST_INNER</span> steps in the explain plan.
        </p>
      </Definition>

      <LessonSection title="Leader node vs compute nodes">
        <ContentStep number={1} title="What the leader does">
          <p className="text-slate-300">
            Client connects to the leader endpoint. Leader resolves catalog objects, checks WLM queue
            assignment, compiles the query, and ships plan fragments to compute nodes. For{' '}
            <span className="font-mono text-sm">SELECT</span> with aggregates, nodes return partial counts/sums;
            leader merges into final result set returned to BI tools.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What compute nodes do">
          <p className="text-slate-300">
            Each node reads its local columnar blocks (1 MB slices on disk), applies zone maps from sort keys,
            executes joins where both sides are co-located on matching dist keys, or receives broadcast/rehash
            steps when distribution does not align. COPY loads also parallelize — each node ingests its slice
            of incoming rows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE implications">
          <p className="text-slate-300">
            Skew on a KEY distribution column means one node holds most rows — the cluster runs at the speed
            of the slowest slice. Leader bottlenecks show up as high{' '}
            <span className="font-mono text-sm">WLM Query Time</span> in queue without proportional CPU on
            nodes. Resize (add nodes) helps only when work partitions evenly.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Stores user data?</th>
                <th className="px-4 py-3">Primary role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Leader node', 'No (metadata only)', 'Parse, plan, coordinate, merge results, client endpoint'],
                ['Compute node', 'Yes — columnar slices', 'Parallel scan, join, aggregate, sort, COPY ingest'],
              ].map(([component, stores, role]) => (
                <tr key={component} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{component}</td>
                  <td className="px-4 py-3">{stores}</td>
                  <td className="px-4 py-3">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Query path flowchart">
        <Flowchart
          title="Redshift query execution path"
          chart={`flowchart TB
  CLIENT[BI tool JDBC ODBC Data API]
  LEAD[Leader node]
  WLM[WLM queue slot]
  PLAN[Parse optimize plan]
  CN1[Compute node 1 slices]
  CN2[Compute node 2 slices]
  CNN[Compute node N slices]
  MERGE[Leader merge partial results]
  OUT[Result set to client]
  CLIENT --> LEAD
  LEAD --> WLM
  WLM --> PLAN
  PLAN --> CN1
  PLAN --> CN2
  PLAN --> CNN
  CN1 --> MERGE
  CN2 --> MERGE
  CNN --> MERGE
  MERGE --> OUT`}
        />
        <Callout variant="tip">
          Run <span className="font-mono text-sm">EXPLAIN</span> on production join queries — look for{' '}
          <span className="font-mono text-sm">XN Hash Join</span> with co-located keys vs{' '}
          <span className="font-mono text-sm">DS_BCAST_INNER</span> (broadcast smaller table to all nodes).
          Broadcast is fine for small dimensions; deadly for fact-to-fact misaligned joins.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Leader node: single coordinator — connections, planning, WLM, result merge; no bulk user data.',
          'Compute nodes: parallel columnar storage and execution — each holds a slice per table.',
          'MPP speed requires even distribution — skew on dist key caps cluster throughput at one node.',
          'Query path: client → leader → WLM → plan → parallel node steps → leader merge → client.',
          'Use EXPLAIN to spot broadcast/rehash — co-locate join keys with KEY distribution for fact tables.',
        ]}
      />
    </LessonArticle>
  )
}
