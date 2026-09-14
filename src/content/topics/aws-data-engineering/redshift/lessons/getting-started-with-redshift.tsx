import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why Redshift after Athena in the DE path">
        You know how to run serverless SQL on S3 with Athena — partition filters, external tables, and
        pay-per-scan exploration. The next question every analytics team eventually asks is:{' '}
        <strong className="text-white">how do we serve dashboards and repeatable reports with predictable
        latency when dozens of users query the same metrics every hour?</strong> Amazon Redshift is
        AWS&apos;s managed <strong className="text-white">cloud data warehouse</strong>. It loads curated
        data from S3 (or streams from Kinesis), stores it in columnar MPP storage, and runs SQL tuned for
        analytics concurrency — the standard serving layer when ad hoc lake SQL is not enough.
      </Callout>

      <Definition term="What is Redshift in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon Redshift</strong> is a petabyte-scale data warehouse built
          for OLAP workloads: aggregations, joins across large fact and dimension tables, and concurrent BI
          queries. You provision a <strong className="text-white">cluster</strong> (or use Redshift
          Serverless), load data with <code className="text-core-400">COPY</code>, define{' '}
          <strong className="text-white">distribution</strong> and{' '}
          <strong className="text-white">sort keys</strong> for performance, and point QuickSight or JDBC
          clients at the cluster endpoint. Data can also round-trip to the lake with{' '}
          <code className="text-core-400">UNLOAD</code>.
        </p>
        <p className="mt-2 text-slate-300">
          Think of Redshift as{' '}
          <span className="text-core-400">the fast, always-on SQL engine for curated analytics</span> — S3
          and Glue hold the lake; Athena explores it; Redshift serves the metrics your business trusts daily.
        </p>
      </Definition>

      <LessonSection title="Warehouse vs ad hoc lake SQL">
        <p className="text-slate-300">
          Athena and Redshift both speak SQL, but they optimize for different access patterns. Athena reads
          files in place on S3 — perfect when questions change daily and you pay only for what you scan.
          Redshift keeps hot data in local columnar storage across many compute nodes — perfect when the
          same joins and aggregations run hundreds of times per day with latency expectations measured in
          seconds, not minutes.
        </p>
        <ContentStep number={1} title="Athena — explore and validate">
          <p className="text-slate-300">
            Row counts on tonight&apos;s partition, schema drift in raw JSON, one-off legal exports — lake
            SQL without loading a warehouse. You already practiced this in the Athena sub-topic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Redshift — serve and scale">
          <p className="text-slate-300">
            Executive dashboards, certified revenue metrics, nightly dbt models materialized for analysts —
            workloads that benefit from pre-loaded columnar data, workload management queues, and MPP parallelism
            across nodes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Both on the same lake">
          <p className="text-slate-300">
            Mature AWS platforms rarely pick one engine forever. Glue lands Parquet on S3; Athena QA-checks
            loads; <code className="text-core-400">COPY</code> promotes gold tables into Redshift; Spectrum
            joins local dimensions with cold S3 history when needed.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: Athena is pay-per-scan flexibility on object storage; Redshift is provisioned
          analytics compute on loaded warehouse data. Lake-first storage, warehouse-first serving — complementary,
          not competing.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build Redshift in layers so cluster sizing, distribution keys, and workload management do not
          overwhelm you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Basics — what and why">
          <p className="text-slate-300">
            Understand what a data warehouse is, OLTP vs OLAP, and how Redshift compares to RDS, Athena, and
            raw S3 — the mental map before touching a cluster.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Architecture and load">
          <p className="text-slate-300">
            Learn cluster anatomy (leader node, compute nodes), node types, security groups, IAM roles for{' '}
            <code className="text-core-400">COPY</code>, and loading from S3 with the right file format
            (Parquet preferred).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Design for performance">
          <p className="text-slate-300">
            Distribution styles (KEY, EVEN, ALL), sort keys, compression encodings, and when to denormalize
            vs star-schema — the knobs that turn a slow warehouse into a fast one.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Spectrum and tuning (next module)">
          <p className="text-slate-300">
            After this beginner pass: Redshift Spectrum for external Glue tables on S3, concurrency scaling,
            materialized views, UNLOAD patterns, Serverless vs provisioned tradeoffs, and cost governance
            with WLM and query monitoring.
          </p>
        </ContentStep>
        <Flowchart
          title="Redshift sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is Redshift]
  B --> C[OLTP vs OLAP]
  C --> D[Redshift vs RDS]
  D --> E[Redshift vs Athena]
  E --> F[Redshift vs S3]
  F --> G[Putting it together beginner]
  G --> H[Cluster COPY dist sort — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Cluster',
                  'Your Redshift warehouse instance — a leader node coordinates SQL; compute nodes store data and run queries in parallel',
                ],
                [
                  'Node',
                  'One slice of cluster capacity — more nodes mean more storage and query parallelism; node type sets CPU/RAM per node',
                ],
                [
                  'COPY',
                  'Bulk load command — reads files from S3 (or other sources) into local Redshift tables; the primary ingest path for DE pipelines',
                ],
                [
                  'UNLOAD',
                  'Export command — writes query results from Redshift back to S3 as Parquet or CSV; used for archival, ML features, or lake round-trips',
                ],
                [
                  'Distribution',
                  'How rows are spread across nodes (DISTKEY / DISTSTYLE) — co-locating join keys avoids expensive data shuffles at query time',
                ],
                [
                  'Sort key',
                  'Physical row order on disk (SORTKEY) — helps range filters and merge joins skip irrelevant blocks; critical for large fact tables',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and purpose in cluster identifiers:{' '}
          <code className="text-core-400">acme-analytics-dev</code> or{' '}
          <code className="text-core-400">acme-bi-prod</code>. Keep dev clusters small (ra3.xlarge or
          Serverless with low RPU limits) — warehouse cost scales with node count and uptime, unlike
          Athena&apos;s pay-per-query model.
        </Callout>
      </LessonSection>

      <LessonSection title="How Redshift fits after Athena in a pipeline">
        <p className="text-slate-300">
          Athena confirms tonight&apos;s Glue job wrote the expected row counts. When QA passes, orchestration
          triggers <code className="text-core-400">COPY</code> into{' '}
          <code className="text-core-400">analytics.fact_sales</code>. Analysts and QuickSight hit Redshift
          for sub-minute dashboard refreshes instead of re-scanning terabytes in Athena every hour. When
          finance needs a historical extract, <code className="text-core-400">UNLOAD</code> pushes results
          back to S3 for downstream ML or audit.
        </p>
        <Flowchart
          title="S3 lake → COPY → Redshift → BI / UNLOAD back to S3"
          chart={`flowchart LR
  S3[S3 lake curated Parquet]
  S3 --> GLUE[Glue ETL or dbt on S3]
  GLUE --> COPY[Redshift COPY bulk load]
  COPY --> RS[Redshift cluster local tables]
  RS --> BI[QuickSight JDBC dashboards]
  RS --> UNL[UNLOAD to S3]
  UNL --> ML[ML training or audit archive]`}
        />
        <Callout variant="insight">
          Mature data platforms treat S3 as the system of record and Redshift as the performance layer for
          certified metrics — not a second copy of everything, but the hot subset dashboards need repeatedly.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about Redshift">
        <ContentStep number={1} title="Predictable BI latency">
          <p className="text-slate-300">
            Stakeholders expect Monday morning dashboards in seconds. Columnar storage, sort keys, and MPP
            parallelism target repeatable query plans — unlike ad hoc lake scans whose runtime grows with
            partition size and concurrency.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Controlled concurrency">
          <p className="text-slate-300">
            Workload management (WLM) queues separate ETL loads from interactive analysts. You throttle heavy
            transforms so dashboard queries stay responsive — a capability Athena does not offer at the same
            granularity.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Deep integration with the AWS analytics stack">
          <p className="text-slate-300">
            IAM roles for <code className="text-core-400">COPY</code> from S3, Spectrum reading the same
            Glue catalog as Athena, QuickSight SPICE or direct query, and UNLOAD for feature stores — Redshift
            sits at the center of AWS warehouse patterns you will see in production DE roles.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Redshift follows Athena in the track — lake SQL explores S3; the warehouse serves concurrent BI on loaded curated data.',
          'Roadmap: warehouse basics → cluster architecture and COPY → distribution/sort tuning → Spectrum and advanced ops next.',
          'Core vocabulary: cluster, node, COPY, UNLOAD, distribution, sort key.',
          'Typical flow: S3 curated files → COPY into Redshift → BI tools query local tables → UNLOAD exports results back to S3 when needed.',
        ]}
      />
    </LessonArticle>
  )
}
