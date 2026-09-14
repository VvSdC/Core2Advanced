import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ScalingAndState() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Scaling a restaurant can mean buying a bigger stove (<strong className="text-white">vertical</strong>
        ) or opening more identical kitchens with the same menu (
        <strong className="text-white">horizontal</strong>). Data workers work best like identical
        kitchens: stateless cooks who fetch ingredients from shared storage (S3/DB) instead of hiding
        recipes in one chef&apos;s head.
      </Callout>

      <Definition term="Vertical scaling (scale up)">
        <p>
          <strong className="text-white">Vertical scaling</strong> increases the power of a single
          resource — more vCPU and RAM on one EC2 instance, larger Redshift node type, more Glue DPUs on
          one job driver configuration.
        </p>
        <p className="mt-2 text-slate-300">
          Simpler to reason about, but hits hardware limits and often requires downtime to resize.
        </p>
      </Definition>

      <Definition term="Horizontal scaling (scale out)">
        <p>
          <strong className="text-white">Horizontal scaling</strong> adds more units of the same size —
          more EC2 nodes in a Spark cluster, more Glue workers, more Lambda concurrent executions, more
          Redshift nodes in a cluster.
        </p>
        <p className="mt-2 text-slate-300">
          Preferred at cloud scale when work parallelizes (partitioned files, independent batches).
        </p>
      </Definition>

      <LessonSection title="Horizontal vs vertical — when DE uses each">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Good for</th>
                <th className="px-4 py-3">Watch out for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Vertical',
                  'Single-threaded transforms, small datasets, quick fixes',
                  'Diminishing returns; max instance size; resize downtime',
                ],
                [
                  'Horizontal',
                  'Partitioned ETL, distributed Spark, parallel file ingestion',
                  'Needs idempotent tasks; shuffle overhead; orchestration complexity',
                ],
              ].map(([approach, good, watch]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{approach}</td>
                  <td className="px-4 py-3">{good}</td>
                  <td className="px-4 py-3">{watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Scaling decision" caption="Typical Glue tuning path">
{`Job slow on 5 DPUs, CPU saturated on driver → try vertical: bigger worker type
Job slow, many small files, CPU low on workers → horizontal: more workers + better partitioning`}
        </Example>
      </LessonSection>

      <Definition term="Stateless vs stateful">
        <p>
          A <strong className="text-white">stateless</strong> worker does not rely on local memory or disk
          from previous runs — any instance can pick up any task. A{' '}
          <strong className="text-white">stateful</strong> worker remembers session data, local caches, or
          file handles that tie work to one machine.
        </p>
        <p className="mt-2 text-slate-300">
          Auto Scaling and serverless assume statelessness. If worker 3 dies, worker 7 should redo the task
          without corruption.
        </p>
      </Definition>

      <LessonSection title="Why DE prefers stateless workers + external state">
        <ContentStep number={1} title="External state in S3">
          <p className="text-slate-300">
            Raw and curated datasets live in S3 — the shared source of truth. Glue, Lambda, and EMR workers
            read inputs and write outputs to known prefixes. No single server owns &quot;the data.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="External state in databases">
          <p className="text-slate-300">
            Job metadata, watermarks, and dedupe keys belong in RDS, DynamoDB, or the Glue Data Catalog —
            not in /tmp on an EC2 box. Restarts and scale-out stay safe.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Idempotent writes">
          <p className="text-slate-300">
            Write to partition paths like <code className="text-accent-300">dt=2024-01-15/</code> and
            overwrite or merge deterministically. Retries then produce the same result — essential when
            AWS replaces your instance mid-batch.
          </p>
        </ContentStep>
        <Flowchart
          title="Stateless worker pattern"
          chart={`flowchart TB
  subgraph workers [Stateless workers]
    W1[Glue worker 1]
    W2[Glue worker 2]
    W3[Glue worker N]
  end
  S3[(S3 lake — external state)]
  CAT[(Glue Catalog / RDS metadata)]
  W1 --> S3
  W2 --> S3
  W3 --> S3
  W1 --> CAT
  W2 --> CAT
  W3 --> CAT
  ORCH[Step Functions / scheduler] --> workers`}
        />
        <Callout variant="insight">
          Lambda is stateless by design (ephemeral /tmp only). Long-running Spark on EC2 tempts teams to
          cache locally — push caches to Redis or disk on EBS only if you accept recompute on failure.
        </Callout>
      </LessonSection>

      <LessonSection title="Stateful services in the platform">
        <p className="text-slate-300">
          Not everything is stateless. Redshift, RDS, and Kinesis shards hold state — AWS manages
          replication and failover. Your job is to not treat them like scratch pads: use connection pools,
          avoid storing pipeline progress only in warehouse temp tables without backup strategy.
        </p>
        <Callout variant="tip">
          When designing a new job, ask: &quot;If this container vanishes mid-run, can another container
          safely continue?&quot; If no, move state external or redesign the step boundary.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Vertical scaling = bigger machine; horizontal = more machines — DE favors horizontal for partitioned workloads.',
          'Stateless workers + external state (S3, catalog, DB) enable safe retries, Auto Scaling, and serverless.',
          'Design idempotent partition writes; treat managed databases as stateful components with their own HA models.',
        ]}
      />
    </LessonArticle>
  )
}
