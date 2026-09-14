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

export function AthenaVsWarehouseTeaser() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two SQL engines, different jobs">
        Athena and Amazon Redshift both answer questions with SQL — but they optimize for different shapes
        of work. Athena is{' '}
        <strong className="text-white">serverless SQL directly on S3 files</strong> — ideal for ad hoc lake
        queries and exploration. Redshift is a{' '}
        <strong className="text-white">provisioned columnar warehouse</strong> — ideal for concurrent BI,
        complex joins at scale, and predictable dashboard latency. Mature AWS data platforms use both; this
        lesson gives the high-level map before the dedicated Redshift sub-topic.
      </Callout>

      <Definition term="Ad hoc lake query vs warehouse">
        <p>
          <strong className="text-white">Ad hoc lake query (Athena):</strong> spin up SQL against external
          tables on S3, pay per scan, no cluster sizing — great when questions change daily and data already
          lives in the lake.{' '}
          <strong className="text-white">Warehouse (Redshift):</strong> load curated subsets (or query via
          Spectrum) into optimized storage with MPP compute reserved for your workloads — great when many
          users hit the same dashboards with strict performance SLAs.
        </p>
      </Definition>

      <LessonSection title="Athena vs Redshift — high-level comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Athena</th>
                <th className="px-4 py-3">Redshift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Data location', 'Files stay on S3; external tables', 'Local MPP storage; COPY from S3'],
                ['Compute model', 'Serverless per query', 'Provisioned nodes or Serverless capacity'],
                ['Pricing shape', 'Pay per TB scanned', 'Pay for cluster uptime / RPU-hours'],
                ['Best for', 'Exploration, QA, intermittent SQL', 'BI concurrency, complex joins, low latency'],
                ['Setup friction', 'Low — DDL + result location', 'Higher — cluster, workload mgmt, sort keys'],
                ['Catalog', 'Glue Data Catalog native', 'Local tables + Spectrum for S3 external'],
              ].map(([dim, ath, rs]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{ath}</td>
                  <td className="px-4 py-3">{rs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Dual-path analytics architecture"
          chart={`flowchart TB
  S3[S3 lake curated Parquet]
  S3 --> ATH[Athena ad hoc SQL]
  S3 --> SPEC[Redshift Spectrum external scan]
  S3 --> COPY[Redshift COPY into local tables]
  COPY --> RS[Redshift warehouse queries]
  ATH --> QA[QA exploration one-off reports]
  RS --> BI[QuickSight dashboards SLA queries]`}
        />
      </LessonSection>

      <LessonSection title="When data engineers reach for Athena">
        <ContentStep number={1} title="Validate pipeline output quickly">
          <p className="text-slate-300">
            Row counts, null checks, duplicate keys on tonight&apos;s partition — Athena against curated S3
            without loading Redshift. Pair with SNS alerts: alarm fires, logs + Athena confirm root cause.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Explore raw and semi-curated zones">
          <p className="text-slate-300">
            New source landed in <code className="text-core-400">raw/</code>? Athena JSON/CSV external tables
            let you inspect schema drift before investing in Glue ETL and warehouse loads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Infrequent or unpredictable queries">
          <p className="text-slate-300">
            Legal asks for a one-time export; product wants an ad hoc funnel analysis once per quarter —
            spinning warehouse capacity for those is wasteful. Athena scan cost matches sporadic usage.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Federated and cross-source previews">
          <p className="text-slate-300">
            Athena federated queries (connector framework) join S3 lake data with SaaS or operational sources
            for lightweight integration — advanced topic, but the mental slot is &quot;quick SQL glue,&quot;
            not petabyte warehouse replacement.
          </p>
        </ContentStep>
        <Example title="DE scenario — partition QA before BI refresh" caption="Athena-first workflow">
{`06:00 Glue job loads curated/sales/ year=2026/month=03/day=15/
06:15 Scheduled Athena:
       SELECT COUNT(*), SUM(revenue) FROM de_lake_prod.sales
       WHERE year='2026' AND month='03' AND day='15';
06:20 Row count within 5% of source — OK to trigger Redshift COPY / dbt run
06:25 QuickSight SPICE refresh on Redshift marts`}
        </Example>
      </LessonSection>

      <LessonSection title="When teams add Redshift (or stay Athena-only longer)">
        <ContentStep number={1} title="Many concurrent dashboard users">
          <p className="text-slate-300">
            Dozens of analysts running similar heavy joins simultaneously — warehouse MPP with workload
            management queues beats repeated full-partition Athena scans on the same gold metrics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Strict latency SLAs">
          <p className="text-slate-300">
            Sub-second or low-second interactive BI on pre-aggregated marts — sort keys, distribution keys,
            materialized views (Redshift features) target this. Athena latency varies with scan size and
            cold starts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Repeated scan cost exceeds cluster cost">
          <p className="text-slate-300">
            If daily dashboards scan terabytes in Athena every hour, loading hot subsets into Redshift (or
            using Spectrum selectively) can be cheaper and faster — finance and performance tradeoff, not
            religion.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Small team, early lake — Athena may be enough">
          <p className="text-slate-300">
            Startup DE stack: S3 + Glue + Athena + QuickSight direct to Athena for months until concurrency
            or latency forces warehouse investment. Valid path — add Redshift when pain appears, not on day
            one by default.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Spectrum bridges both">
          Redshift Spectrum queries external Glue tables on S3 with Redshift SQL — overlapping Athena&apos;s
          turf for join-heavy queries that reference a small local dimension table plus huge S3 fact. Many
          enterprises run Spectrum + local Redshift tables together; Athena remains the analyst self-service
          tool on the same catalog.
        </Callout>
      </LessonSection>

      <LessonSection title="Complementary, not either-or">
        <p className="text-slate-300">
          The modern AWS pattern is <strong className="text-white">lake-first storage (S3)</strong>,{' '}
          <strong className="text-white">shared Glue catalog</strong>,{' '}
          <strong className="text-white">Athena for exploration and QA</strong>, and{' '}
          <strong className="text-white">Redshift (or similar) for curated serving layers</strong> when BI
          scale demands it. Data engineers orchestrate Glue/Lambda to maintain S3; analysts self-serve in
          Athena; certified metrics graduate to warehouse marts.
        </p>
        <Flowchart
          title="Medallion mindset with two SQL front doors"
          chart={`flowchart LR
  RAW[Raw S3] --> PROC[Processed Glue Spark]
  PROC --> CUR[Curated S3 Parquet]
  CUR --> ATH2[Athena explore and QA]
  CUR --> WH[Redshift marts optional]
  ATH2 --> DEC[Decide what to promote]
  DEC --> WH`}
        />
        <Callout variant="insight">
          Interview sound bite: Athena optimizes for cheap flexible reads on object storage; Redshift
          optimizes for fast repeatable analytics on loaded columnar data. Choose based on access pattern and
          cost shape — most DE platforms use Athena daily and Redshift when dashboard concurrency bites.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena: serverless SQL on S3, pay per scan — best for ad hoc lake queries, QA, and exploration.',
          'Redshift: MPP warehouse — best for concurrent BI, predictable latency, and complex repeatable workloads.',
          'DE teams use Athena to validate partitions and explore raw data; promote hot metrics to Redshift when scan cost or concurrency grows.',
          'Glue catalog ties both together; Spectrum lets Redshift query S3 external tables alongside local facts.',
        ]}
      />
    </LessonArticle>
  )
}
